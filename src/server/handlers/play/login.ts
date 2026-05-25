import { XmlHandler } from "../xml";

import { WorldContext } from "@server/socket-server/world/world";
import { PenguinMessenger } from "../messenger";
import { ClientSocket } from "@server/socket-server";
import { Igloo, PenguinJson } from "@server/database/database";
import { logdebug } from "@server/logger";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";
import serverList, { getServerPopulation } from "@server/servers";
import { LoginContext } from "@server/socket-server/world/xml-handler";

function capitalizeName(name: string): string {
  return name.split(' ').map((name => {
    return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
  })).join(' ');
}

export function getDefaultIgloo(id: number): Igloo {
  return {
    id,
    type: 1,
    flooring: 0,
    location: 0,
    music: 0,
    furniture: [],
    locked: true
  }
}

export function getDefaultPenguin(name: string, color: number, member: boolean, virtualTimestamp: number): PenguinJson {
  return {
    name: capitalizeName(name),
    mascot: 0,

    is_member: member,
    is_agent: false,

    color: color,
    head: 0,
    face: 0,
    neck: 0,
    body: 0,
    hand: 0,
    feet: 0,
    background: 0,
    pin: 0,
    inventory: [color],

    coins: 500,
    registration_date: Date.now(),

    minutes_played: 0,
    virtualRegistrationTimestamp: virtualTimestamp,

    stamps: [],
    stampbook: {
      color: 1,
      highlight: 1,
      pattern: 0,
      icon: 1,
      stamps: [],
      recent_stamps: []
    },
    puffleSeq: 0,
    puffles: [],
    backyard: [],
    puffleItems: {},
    hasDug: false,
    treasureFinds: [],
    rainbow: {
      adoptability: false,
      currentTask: 0,
      coinsCollected: []
    },
    igloo: 1,
    igloos: [getDefaultIgloo(1)],
    furniture: {},
    iglooFloorings: [],
    iglooTypes: [1],
    iglooLocations: [1],
    iglooSeq: 1,
    mail: [],
    mailSeq: 0,
    ownedMedals: 0,
    careerMedals: 0,
    nuggets: 0,
    cards: {},
    cardProgress: 0,
    isNinja: false,
    senseiAttempts: 0,
    cardWins: 0,
    battleOfDoom: false
  }
}

export function sendError(msg: PenguinMessenger, p: WorldPenguin | ClientSocket | Array<WorldPenguin | ClientSocket>, error: number) {
  msg.send(p, 'e', error);
}

const worldLoginHandler = new XmlHandler<WorldContext, ['world', 'msg', 'data', 'settings', 'db', 'client']>(['world', 'msg', 'data', 'settings', 'db', 'client']);
const loginHandler = new XmlHandler<LoginContext, ['db', 'settings', 'data', 'msg', 'client']>(['db', 'settings', 'data', 'msg', 'client']);

type LoginHandler = (ctx: LoginContext, message: string) => void;

export const filePolicy: LoginHandler = ({ client }) => {
  client.end('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
};

export const checkVersion: LoginHandler = ({ msg, client }) => {
  // version checking
  // this is irrelevant for us, we just always send an OK response
  msg.sendXml(client, 'apiOK', '', 0);
}

export const getKey: LoginHandler = ({ msg, client }) => {
  // random key generation
  // this is used for authentication, so it is not needed for us, we just send any key
  msg.sendXml(client, 'rndK', '<k>key</k>', -1);
}

export const login: LoginHandler = async (ctx, message: string) => {
  const joinMatch = message.match(/<login z='j'>/);
  const { msg, data, settings, db, client } = ctx;

  if (data.isPreCpip() && joinMatch) {
    // join.swf sends 'j' as the login
    msg.sendXml(client, 'logOK', '');
    return;
  }

  const nicknameMatch = message.match(/<nick><!\[CDATA\[(.*)\]\]><\/nick>/);
  if (nicknameMatch === null) {
    logdebug('No nickname provided during Login, terminating.');
    // terminating: TODO collect the client sockets
  } else {
    let name = nicknameMatch[1];
    let penguin: PenguinJson;
    let id: number;
    if (data.isVanillaEngine() && 'world' in ctx) {
      // in Engine 3 client, the world actually receives the ID instead of the name
      id = Number(name);
      const data = await db.get(id);
      // const data = db.getById<PenguinData>(Databases.Penguins, id);
      if (data === undefined) {
        throw new Error(`Could not find penguin of ID ${id}`);
      }
      const penguinData = await db.get(id);
      if (penguinData === null) {
        return;
      } 
      penguin = penguinData;
    } else {
      if (data.isPreCpip()) {
        // in pre-cpip, underscores represent spaces in names
        name = name.replace(/_/g, ' ');
      }

      // todo: error 101 is incorrect password
      if (settings.settings.no_create_via_login && !(await db.exists(name))) {
        sendError(msg, client, 100);
        return
      }

      let info = await db.fromName(name);
      if (info === null) {
        // 1 = blue
        const json = getDefaultPenguin(name, 1 /* blue */, settings.settings.always_member, settings.getVirtualDate(0).getTime());
        info = [await db.create(json), json];
      }
      id = info[0];
      penguin = info[1];
    }
    if (ctx.world !== undefined) {
      const p = new WorldPenguin(id, penguin, settings);
      ctx.world.addPenguin(p);
      msg.linkClient(client, p);
    }
    console.log(`${name} is logging in`);
    /*
    TODO
    buddies
    how will server size be handled after NPCs?
    */
    // information regarding how many populations are in each server
    msg.send(client, 'l', id, id, '', serverList.map((server) => {
      const population = server.name === 'Blizzard' ? 5 : getServerPopulation()
      return `${server.id},${population}`;
    }).join('|'));
  }
}

worldLoginHandler.xml('policy', filePolicy);

worldLoginHandler.xml('verChk', checkVersion);

worldLoginHandler.xml('rndK', getKey);

worldLoginHandler.xml('login', login)

loginHandler.xml('policy', filePolicy);

loginHandler.xml('verChk', checkVersion);

loginHandler.xml('rndK', getKey);

loginHandler.xml('login', login);

export { 
  worldLoginHandler, 
  loginHandler 
};