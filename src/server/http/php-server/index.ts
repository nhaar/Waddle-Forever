import express from 'express';

import { SettingsManager } from "@server/settings";
import { Router } from "express";
import { processVersion } from '@server/routes/versions';
import { getDateString } from '@common/utils';
import { getDefaultPenguin, PenguinJson, PenguinRepository } from '@server/database/database';
import { filterItems } from '@server/socket-server/handlers/join';
import { GameData } from '@server/timelines/game-data';

interface Ctx {
  settings: SettingsManager;
  db: PenguinRepository;
  data: GameData;
  sessions: {
    join: JoinSessionManager
    snow: SnowSessionManager
  };
}

type PostCallback = (body: any, ctx: Ctx) => Promise<string | Record<string, any>>;

type GetCallback = (body: any, ctx: Ctx) => string;

export function getOfflinePenguinCrumb(id: number, penguin: PenguinJson): string {
  return [
    id,
    penguin.name,
    penguin.color,
    penguin.head,
    penguin.face,
    penguin.neck,
    penguin.body,
    penguin.hand,
    penguin.feet,
    penguin.pin,
    penguin.background,
    0, // unecessary data: room state
    0,
    0,
    penguin.is_member ? 1 : 0,
  ].join('|');
}

// todo: better organize listener declarations
const POST_LISTENERS: Record<string, PostCallback> = {
  '/create_account/create_account.php': async (body, { settings, db, sessions: { join: session } }) => {
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
  '/php/online.php': async () => {
    return '0';
  },
  // returns a crumb for a given player ID
  '/php/gp.php': async (body, { db }) => {
    const rawId = body.PlayerId ?? body.playerId ?? body.id;
    const penguinId = Number(rawId);
    if (!Number.isFinite(penguinId)) {
      return 'e=0&crumb=0|Unknown|0|0|0|0|0|0|0|0|0|0|0|0|0';
    }

    const penguinData = await db.get(penguinId);
    if (penguinData !== null) {
      return `e=0&crumb=${getOfflinePenguinCrumb(penguinId, penguinData)}`;
    }

    const crumb = `${penguinId}|Unknown|0|0|0|0|0|0|0|0|0|0|0|0|0`;
    return `e=0&crumb=${crumb}`;
  },
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
    const [id, penguinData] = penguin;
    
    const buddies = (await Promise.all((penguinData.buddies ?? []).map(id => new Promise<[number, string] | null>((res) => {
      db.get(id).then(p => {
        if (p !== null) {
          res([id, p.name]);
        } else {
          res(null);
        }
      })
    })))).filter((p): p is [number, string] => p !== null);
    const ignored = (await Promise.all((penguinData.ignored ?? []).map(id => new Promise<[number, string] | null>((res) => {
      db.get(id).then(p => {
        if (p !== null) {
          res([id, p.name]);
        } else {
          res(null);
        }
      })
    })))).filter((p): p is [number, string] => p !== null);

    const params: Record<string, number | string> = {
      crumb: getOfflinePenguinCrumb(id, penguinData),
      k1: 'a',
      c: penguinData.coins,
      s: penguinData.safeChat ? 1 : 0,
      // jd uses non virtual date, there simulating age delta it with real time
      jd: getDateString(Date.now() - (settings.getVirtualDate(0).getTime() - penguinData.virtualRegistrationTimestamp)),
      ed: '10000-1-1', // EXPIRACY DATE TODO what is it for?
      h: '', // TODO what is?
      w: '100|0', // TODO what is?
      m: '', // TODO what is
      bl: buddies.map(([id, name]) => `${id}|${name}`).join(','),
      nl: ignored.map(([id, name]) => `${id}|${name}`).join(','),
      il: filterItems(data, penguinData.inventory).join('|'), // item list
      td: `${virtualDate.getUTCFullYear()}-${String(virtualDate.getUTCMonth()).padStart(2, '0')}-${String(virtualDate.getUTCDate()).padStart(2, '0')}:${virtualDate.getUTCHours()}:${virtualDate.getUTCMinutes()}:${virtualDate.getUTCSeconds()}` // used for the snow forts clock in later years
    }

    let response = ''
    for (const key in params) {
      response += `&${key}=${params[key]}`
    }
    return response 
  },

  // CJ Snow session generator
  '/en/web-service/snfgenerator/session': async (body, { db, sessions: { snow: sessions } }) => {
    const id = Number(body.pid);
    const token = body.token;

    if (isNaN(id) || !token) {
      return { hasError: true, error: 'Invalid parameters', data: '' };
    }

    const penguin = await db.get(id);

    if (!penguin) {
      return { hasError: true, error: 'User not found', data: '' };
    }

    const sid = sessions.generateSession();

    sessions.get(sid).id = id;

    return { hasError: false, error: '', data: sid };
  }
}

const GET_LISTENERS: Record<string, GetCallback> = {
  '/flash/date.php': (_, { settings }) => {
    const [year, month, day] = processVersion(settings.settings.version)
    return `output=${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}${String(year % 2000).padStart(2, '0')}`;
  },

  // CJ Snow endpoint for getting server info
  '/api/v0.2/xxx/game/get/world-name-service/start_world_request': (query, { settings, sessions: { snow: sessions } }) => {
    const { name, token, product_name, owner } = query;

    if (!name || !token || !product_name || !owner) {
      return '[S_ERROR]|3518|Cannot Start World|Missing parameters';
    }

    if (product_name != 'cjsnow' || !name.startsWith('cjsnow')) {
      return '[S_ERROR]|3514|Cannot Start World|World type not supported';
    }

    const pid = Number(owner);

    if (isNaN(pid) || !token) {
      return '[S_ERROR]|3518|Cannot Start World|Invalid parameters';
    }

    const session = sessions.get(token);

    if (!session || session.id !== pid) {
      return '[S_ERROR]|3525|Cannot Start World|Invalid token';
    }

    return `[S_WORLDLIST]|${token}|${name}|${settings.targetIP}|${settings.snowPort}||crowdcontrol|${name}|CPNext_dev_branch|example`;
  }
}

interface Session {
  timeout: NodeJS.Timeout
}

interface NewPenguin extends Session {
  username: string,
  color: number,
}

interface SnowSession extends Session {
  id: number
}

class SessionManager<T extends Session> {
  protected _sessions = new Map<string, T>();

  constructor(private createEntry: (timeout: NodeJS.Timeout) => T) {}

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

    const timeout = this.setTimeout(sid);
    this._sessions.set(sid, this.createEntry(timeout));

    return sid;
  }

  public get(sid: string) {
    return this._sessions.get(sid);
  }
}

class JoinSessionManager extends SessionManager<NewPenguin> {
  constructor() {
    super(timeout => ({ username: '', color: 1, timeout }));
  }
}

class SnowSessionManager extends SessionManager<SnowSession> {
  constructor() {
    super(timeout => ({ timeout, id: -1 }));
  }
}

export class PhpServer {
  private postListeners: Map<string, PostCallback>;

  private getListeners: Map<string, GetCallback>;

  private _joinSessionManager = new JoinSessionManager();
  private _snowSessionManager = new SnowSessionManager();

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

    const ctx = {
      settings: this.settings,
      db: this.db,
      data: this.gameData,
      sessions: { join: this._joinSessionManager, snow: this._snowSessionManager }
    };

    this.postListeners.forEach((callback, path) => {
      router.post(path, (req, res) => {
        callback(req.body, ctx).then(r => {
          res.send(r);
        })
      });
    });
    this.getListeners.forEach((callback, path) => {
      router.get(path, (req, res) => {
        res.send(callback(req.query, ctx))
      });
    });

    return router;
  }
}