import express from 'express';

import { SettingsManager } from "@server/settings";
import { JsonDatabase } from "@server/database";
import { Router } from "express";
import { processVersion } from '@server/routes/versions';
import { Penguin } from '@server/penguin';
import { Server } from '@server/client';
import { getDateString } from '@common/utils';

type PostCallback = (body: any, settings: SettingsManager, db: JsonDatabase, server: Server) => string;

interface NewPenguin {
  username: string,
  color: number,
  timeout: NodeJS.Timeout
}

// todo remove global state
const sessionMap = new Map<string, NewPenguin>();

function setSessionTimeout(sid: string): NodeJS.Timeout {
  const session = sessionMap.get(sid)
  if (session) {
    clearTimeout(session.timeout)
  }
  return setTimeout(() => {
    sessionMap.delete(sid);
  }, 5 * 60 * 1000)
}

function generateSessionId() {
  // crypto.randomUUID() can't be accessed here, so this will have to do
  let num: number = 0;
  const gen = () => Date.now() * Math.random()
  num = gen();
  while (sessionMap.has(String(num))) {
    num = gen();
  }
  return String(num);
}

function createPenguin(username: string, color: number, isMember: boolean, registration: number) {
  Penguin.create(username, color, {
    is_member: isMember,
    virtualRegistrationTimestamp: registration
  });
}

// todo: better organize listener declarations
const POST_LISTENERS: Record<string, PostCallback> = {
  '/create_account/create_account.php': (body, settings, db) => {
    let res: string = ''
    let sid: string | undefined = body.sid;

    if (sid === undefined) {
      const newSID = generateSessionId();
      sessionMap.set(newSID, { username: '', color: 1, timeout: setSessionTimeout(newSID) });
      res += `sid=${newSID}&`;
      sid = newSID;
    }

    const session = sessionMap.get(sid);

    if (session === undefined) {
      return 'timeout=1&error=Session expired! Please try again';
    }

    session.timeout = setSessionTimeout(sid);
    res += `sid=${sid}&`;

    switch (body.action) {
      case 'validate_agreement':
        if (body.agree_to_rules !== '1' && body.agree_to_terms !== '1') {
          res += 'error=Please agree to the rules and terms'
          break
        }
        if (body.agree_to_rules !== '1') {
          res += 'error=Please agree to the rules'
          break
        }
        if (body.agree_to_terms !== '1') {
          res += 'error=Please agree to the terms'
          break
        }

        res += 'success=1';
        break;
      
      case 'validate_username':
        if (body.username.length < 1 || body.username.length > 12) {
          res += 'error=Please choose a username between 1 and 12 characters.'
          break;
        }

        if (db.penguinExists(body.username)) {
          res += 'error=This penguin already exists!'
          break
        }

        session.username = body.username;
        session.color = Number(body.colour);
        res += 'success=1';
        break;

      case 'validate_password_email':
        if (session.username.length < 1) {
          return '';
        }
        createPenguin(session.username, session.color, settings.settings.always_member, settings.getVirtualDate(0).getTime());
        res += 'success=1';
        break;
    }

    return res;
  },
  '/php/join.php': (body, settings, db) => {
    const name = body.Username;
    if (name.length < 3 || name.length > 12 || db.penguinExists(name)) {
      return 'e=700';
    }

    createPenguin(name, Number(body.Colour), settings.settings.always_member, settings.getVirtualDate(0).getTime());

    return 'e=0';
  },
  '/php/online.php': () => {
    return '0';
  },
  // returns a crumb for a given player ID
  '/php/gp.php': (body) => {
    const rawId = body.PlayerId ?? body.playerId ?? body.id;
    const penguinId = Number(rawId);
    if (!Number.isFinite(penguinId)) {
      return 'e=0&crumb=0|Unknown|0|0|0|0|0|0|0|0|0|0|0|0|0';
    }

    const penguin = Penguin.getById(penguinId);
    if (penguin !== undefined) {
      const crumb = penguin.getEngine1Crumb();
      return `e=0&crumb=${crumb}`;
    }

    const crumb = `${penguinId}|Unknown|0|0|0|0|0|0|0|0|0|0|0|0|0`;
    return `e=0&crumb=${crumb}`;
  },
  // Logging in
  '/php/login.php': (body, settings, db, server) => {
    const { Username } = body;

    if (settings.settings.no_create_via_login && !db.penguinExists(Username)) {
      return 'e=100';
    }

    const penguin = Penguin.getPenguinFromName(Username, settings.getVirtualDate(0).getTime(), settings.settings.always_member);

    const virtualDate = settings.getVirtualDate(43);
    const buddies = penguin.getBuddies();
    const buddyList = buddies.map((id) => server.formatBuddyEntry(id, true)).join(',');

    const params: Record<string, number | string> = {
      crumb: penguin.getEngine1Crumb(),
      k1: 'a',
      c: penguin.coins,
      s: penguin.isSafeChat ? 1 : 0,
      // jd uses non virtual date, there simulating age delta it with real time
      jd: getDateString(Date.now() - (settings.getVirtualDate(0).getTime() - penguin.virtualRegistration)),
      ed: '10000-1-1', // EXPIRACY DATE TODO what is it for?
      h: '', // TODO what is?
      w: '100|0', // TODO what is?
      m: '', // TODO what is
      bl: buddyList,
      nl: '',
      il: server.getItemsFiltered(penguin.getItems()).join('|'), // item list
      td: `${virtualDate.getUTCFullYear()}-${String(virtualDate.getUTCMonth()).padStart(2, '0')}-${String(virtualDate.getUTCDate()).padStart(2, '0')}:${virtualDate.getUTCHours()}:${virtualDate.getUTCMinutes()}:${virtualDate.getUTCSeconds()}` // used for the snow forts clock in later years
    }

    let response = ''
    for (const key in params) {
      response += `&${key}=${params[key]}`
    }
    return response 
  }
}

type GetCallback = (settings: SettingsManager, db: JsonDatabase) => string;

const GET_LISTENERS: Record<string, GetCallback> = {
  '/flash/date.php': (settings) => {
    const [year, month, day] = processVersion(settings.settings.version)
    return `output=${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}${String(year % 2000).padStart(2, '0')}`;
  }
}

export class PhpServer {
  private postListeners: Map<string, PostCallback>;

  private getListeners: Map<string, GetCallback>;

  constructor(private settings: SettingsManager, private db: JsonDatabase, private server: Server) {
    this.postListeners = new Map(Object.entries(POST_LISTENERS));
    this.getListeners = new Map(Object.entries(GET_LISTENERS));
  }

  public getExpressRouter(): Router {
    const router = Router();

    router.use(express.urlencoded({ extended: true }))
    router.use(express.json());

    this.postListeners.forEach((callback, path) => {
      router.post(path, (req, res) => {
        res.send(callback(req.body, this.settings, this.db, this.server));
      });
    });
    this.getListeners.forEach((callback, path) => {
      router.get(path, (_, res) => {
        res.send(callback(this.settings, this.db))
      });
    });

    return router;
  }
}