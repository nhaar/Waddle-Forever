import express from 'express';

import { SettingsManager } from "@server/settings";
import { Router } from "express";
import { processVersion } from '@server/routes/versions';
import { getDateString } from '@common/utils';
import { PenguinRepository } from '@server/database/database';
import { getDefaultPenguin } from '@server/handlers/play/login';
import { WorldPenguin } from '@server/socket-server/world/world-penguin';
import { getPenguinString } from '@server/handlers/play/join';
import { GameData } from '@server/timelines/game-data';

type PostCallback = (body: any, ctx: {
  settings: SettingsManager;
  db: PenguinRepository;
  data: GameData;
  session: SessionManager;
}) => Promise<string>;

type GetCallback = (settings: SettingsManager, db: PenguinRepository) => string;

// todo: better organize listener declarations
const POST_LISTENERS: Record<string, PostCallback> = {
  '/create_account/create_account.php': async (body, { settings, db, session }) => {
    let res: string = ''
    let sid: string | undefined = body.sid;

    if (sid === undefined) {
      const newSID = session.generateSession();
      res += `sid=${newSID}&`;
      sid = newSID;
    }

    const sessionInfo = session.get(sid);

    if (sessionInfo === undefined) {
      return 'timeout=1&error=Session expired! Please try again';
    }

    sessionInfo.timeout = session.setTimeout(sid);
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

        if (await db.exists(body.username)) {
          res += 'error=This penguin already exists!'
          break
        }

        sessionInfo.username = body.username;
        sessionInfo.color = Number(body.colour);
        res += 'success=1';
        break;

      case 'validate_password_email':
        if (sessionInfo.username.length < 1) {
          return '';
        }
        await db.create(getDefaultPenguin(sessionInfo.username, sessionInfo.color, settings.settings.always_member, settings.getVirtualDate(0).getTime()));
        res += 'success=1';
        break;
    }

    return res;
  },
  '/php/join.php': async (body, { settings, db }) => {
    const name = body.Username;
    if (name.length < 3 || name.length > 12 || (await db.exists(name))) {
      return 'e=700';
    }

    await db.create(getDefaultPenguin(name, Number(body.Colour), settings.settings.always_member, settings.getVirtualDate(0).getTime()));

    return 'e=0';
  },
  // '/php/online.php': () => {
  //   return '0';
  // },
  // // returns a crumb for a given player ID
  // '/php/gp.php': (body) => {
  //   const rawId = body.PlayerId ?? body.playerId ?? body.id;
  //   const penguinId = Number(rawId);
  //   if (!Number.isFinite(penguinId)) {
  //     return 'e=0&crumb=0|Unknown|0|0|0|0|0|0|0|0|0|0|0|0|0';
  //   }

  //   // const penguin = Penguin.getById(penguinId);
  //   // if (penguin !== undefined) {
  //   //   const crumb = penguin.getEngine1Crumb();
  //   //   return `e=0&crumb=${crumb}`;
  //   // }

  //   const crumb = `${penguinId}|Unknown|0|0|0|0|0|0|0|0|0|0|0|0|0`;
  //   return `e=0&crumb=${crumb}`;
  // },
  // Logging in
  '/php/login.php': async (body, { settings, db, data}) => {
    const { Username } = body;

    let penguin = await db.fromName(Username);

    if (settings.settings.no_create_via_login && penguin === null) {
      return 'e=100';
    }

    if (penguin === null) {
      const json = getDefaultPenguin(Username, 1 /* blue as default */, settings.settings.always_member, settings.getVirtualDate(0).getTime()); 
      penguin = [await db.create(json), json];
    }

    const virtualDate = settings.getVirtualDate(43);
    // // const buddies = penguin.getBuddies();
    const buddyList = ''; // TODO add later
    // // const buddyList = buddies.map((id) => server.formatBuddyEntry(id, true)).join(',');


    const worldPenguin = new WorldPenguin(...penguin, settings);

    const params: Record<string, number | string> = {
      crumb: getPenguinString(data, worldPenguin, { x: 0, y: 0, frame: 1 }),
      k1: 'a',
      c: worldPenguin.currency.coins,
      s: worldPenguin.preference.isSafeChat ? 1 : 0,
      // jd uses non virtual date, there simulating age delta it with real time
      jd: getDateString(Date.now() - (settings.getVirtualDate(0).getTime() - worldPenguin.time.virtualRegistrationTimestamp)),
      ed: '10000-1-1', // EXPIRACY DATE TODO what is it for?
      h: '', // TODO what is?
      w: '100|0', // TODO what is?
      m: '', // TODO what is
      bl: buddyList,
      nl: '',
      il: '', // TODOserver.getItemsFiltered(penguin.getItems()).join('|'), // item list
      td: `${virtualDate.getUTCFullYear()}-${String(virtualDate.getUTCMonth()).padStart(2, '0')}-${String(virtualDate.getUTCDate()).padStart(2, '0')}:${virtualDate.getUTCHours()}:${virtualDate.getUTCMinutes()}:${virtualDate.getUTCSeconds()}` // used for the snow forts clock in later years
    }

    let response = ''
    for (const key in params) {
      response += `&${key}=${params[key]}`
    }
    return response 
  }
}


const GET_LISTENERS: Record<string, GetCallback> = {
  '/flash/date.php': (settings) => {
    const [year, month, day] = processVersion(settings.settings.version)
    return `output=${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}${String(year % 2000).padStart(2, '0')}`;
  }
}

interface NewPenguin {
  username: string,
  color: number,
  timeout: NodeJS.Timeout
}

class SessionManager {
  private _sessions = new Map<string, NewPenguin>();

  public setTimeout(sid: string): NodeJS.Timeout {
    const session = this._sessions.get(sid)
    if (session) {
      clearTimeout(session.timeout)
    }
    return setTimeout(() => {
      this._sessions.delete(sid);
    }, 5 * 60 * 1000);
  }

  public generateSession(): string {
    // crypto.randomUUID() can't be accessed here, so this will have to do
    const gen = () => Date.now() * Math.random();
    let sid: string;
    
    do {
      sid = String(gen());
    } while(this._sessions.has(sid));

    this._sessions.set(sid, { username: '', color: 1, timeout: this.setTimeout(sid) });

    return sid;
  }

  public get(sid: string) {
    return this._sessions.get(sid);
  }
}

export class PhpServer {
  private postListeners: Map<string, PostCallback>;

  private getListeners: Map<string, GetCallback>;

  private _sessionManager = new SessionManager();

  constructor(
    private settings: SettingsManager,
    private db: PenguinRepository,
    private gameData: GameData
  ) {
    this.postListeners = new Map(Object.entries(POST_LISTENERS));
    this.getListeners = new Map(Object.entries(GET_LISTENERS));
  }

  public getExpressRouter(): Router {
    const router = Router();

    router.use(express.urlencoded({ extended: true }))
    router.use(express.json());

    this.postListeners.forEach((callback, path) => {
      router.post(path, (req, res) => {
        callback(req.body, {
          settings: this.settings,
          db: this.db,
          data: this.gameData,
          session: this._sessionManager
        }).then(r => {
          res.send(r);
        })
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