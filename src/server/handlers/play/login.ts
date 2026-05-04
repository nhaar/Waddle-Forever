import serverList, { getServerPopulation } from "../../servers";
import { Handler, XmlHandler } from "..";
import { logdebug } from "@server/logger";
import { Settings, SettingsManager } from "@server/settings";
import { Databases, JsonDatabase, PenguinData } from "@server/database";
import { World, WorldClient, WorldContext, WorldPenguin } from "@server/new-client";
import { Penguin } from "@server/penguin";
import { ClientSocket, XtSocket } from "@server/socket-server";
import { GameData } from "@server/timelines/game-data";
import { LoginContext } from "@server/socket-server/login/login-client";

const worldLoginHandler = new XmlHandler<WorldClient, WorldContext, ['world']>(['world']);
const loginHandler = new XmlHandler<WorldClient, LoginContext, ['db', 'settings', 'data']>(['db', 'settings', 'data']);

const filePolicy = ({ client }: { client: ClientSocket }) => {
  client.end('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
};

const checkVersion = ({ client }: { client: ClientSocket }) => {
  // version checking
  // this is irrelevant for us, we just always send an OK response
  client.write('<msg t="sys"><body action="apiOK" r="0"></body></msg>');
}

const getKey = ({ client }: { client: ClientSocket }) => {
  // random key generation
  // this is used for authentication, so it is not needed for us, we just send any key
  client.write('<msg t="sys"><body action="rndK" r="-1"><k>key</k></body></msg>');
}

const login = (ctx: { client: WorldClient, world: World } | {
  client: XtSocket;
  data: GameData;
  settings: SettingsManager;
  db: JsonDatabase;
}, message: string) => {
  const joinMatch = message.match(/<login z='j'>/);
  const { client } = ctx;
  
  let data: GameData;
  let db: JsonDatabase;
  let settings: SettingsManager;

  if ('world' in ctx) {
    data = ctx.world.data;
    db = ctx.world.getDb();
    settings = ctx.world.getSettings();
  } else {
    data = ctx.data;
    settings = ctx.settings;
    db = ctx.db;
  }

  if (data.isPreCpip() && joinMatch) {
    // join.swf sends 'j' as the login
    client.write('<msg t="sys"><body action="logOK"></body></msg>');
    return;
  }

  const nicknameMatch = message.match(/<nick><!\[CDATA\[(.*)\]\]><\/nick>/);
  if (nicknameMatch === null) {
    logdebug('No nickname provided during Login, terminating.');
    client.end('');
  } else {
    let name = nicknameMatch[1];
    let penguin: Penguin;
    if (data.isVanillaEngine() && 'world' in ctx) {
      // in Engine 3 client, the world actually receives the ID instead of the name
        const id = Number(name);
        const data = db.getById<PenguinData>(Databases.Penguins, id);
        if (data === undefined) {
          throw new Error(`Could not find penguin of ID ${id}`);
        }
        penguin = new Penguin(id, data);
    } else {
      if (data.isPreCpip()) {
        // in pre-cpip, underscores represent spaces in names
        name = name.replace(/_/g, ' ');
      }

      // todo: error 101 is incorrect password
      if (settings.settings.no_create_via_login && !db.penguinExists(name)) {
        client.sendXt('e', 100)
        return
      }

      penguin = Penguin.getPenguinFromName(name, settings.getVirtualDate(0).getTime(), settings.settings.always_member);
    }
    if ('world' in ctx) {
      ctx.world.addPenguin(new WorldPenguin(ctx.client, penguin, data, settings));
    }
    console.log(`${name} is logging in`);
    /*
    TODO
    buddies
    how will server size be handled after NPCs?
    */
    // information regarding how many populations are in each server
    const penguinId = penguin.id;

    client.sendXt('l', penguinId, penguinId, '', serverList.map((server) => {
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

export { worldLoginHandler, 
  loginHandler 
};