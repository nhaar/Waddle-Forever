import serverList, { getServerPopulation } from "../../servers";
import { Handler } from "..";
import { logdebug } from "@server/logger";
import { Client } from "@server/client";
import { LoginClient } from "@server/socket-server/login/login-client";
import { GameData } from "@server/timelines/game-data";
import { ClientSocket } from "@server/socket-server";
import { Settings } from "@server/settings";
import { JsonDatabase } from "@server/database";

interface XmlClient {
  send: (s: string) => Promise<void>;
  socket: ClientSocket;
  data: GameData;
  settings: Settings;
  db: JsonDatabase;
  sendXt: (code: string, ...args: Array<number | string>) => void;
}

const worldLoginHandler = new Handler<Client>();
const loginHandler = new Handler<LoginClient>();

const checkVersion = (client: XmlClient) => {
  // version checking
  // this is irrelevant for us, we just always send an OK response
  client.send('<msg t="sys"><body action="apiOK" r="0"></body></msg>');
}

const getKey = (client: XmlClient) => {
  // random key generation
  // this is used for authentication, so it is not needed for us, we just send any key
  client.send('<msg t="sys"><body action="rndK" r="-1"><k>key</k></body></msg>');
}

const login = (data: string, info : {
  world: true;
  client: Client;
} | {
  world: false;
  client: LoginClient;
}) => {
  const joinMatch = data.match(/<login z='j'>/);
  const { client } = info;
  if (client.data.isPreCpip() && joinMatch) {
    // join.swf sends 'j' as the login
    client.send('<msg t="sys"><body action="logOK"></body></msg>');
    return;
  }

  const nicknameMatch = data.match(/<nick><!\[CDATA\[(.*)\]\]><\/nick>/);
  if (nicknameMatch === null) {
    logdebug('No nickname provided during Login, terminating.');
    client.socket.end('');
  } else {
    let name = nicknameMatch[1];
    if (client.data.isVanillaEngine() && info.world) {
      // in Engine 3 client, the world actually receives the ID instead of the name
      info.client.setPenguinFromId(Number(name));
    } else {
      if (client.data.isPreCpip()) {
        // in pre-cpip, underscores represent spaces in names
        name = name.replace(/_/g, ' ');
      }

      // todo: error 101 is incorrect password
      if (client.settings.no_create_via_login && !client.db.penguinExists(name)) {
        client.sendXt('e', 100)
        return
      }

      if (info.world) {
        info.client.setPenguinFromName(name);
      }
    }
    console.log(`${name} is logging in`);
    /*
    TODO
    buddies
    how will server size be handled after NPCs?
    */
    // information regarding how many populations are in each server
    // 0 -> penguin id?

    const penguinId = info.world ? info.client.penguin.id : info.client.getPenguinFromName(name);

    client.sendXt('l', penguinId, penguinId, '', serverList.map((server) => {
      const population = server.name === 'Blizzard' ? 5 : getServerPopulation()
      return `${server.id},${population}`;
    }).join('|'));
  }
}

worldLoginHandler.xml('verChk', checkVersion);

worldLoginHandler.xml('rndK', getKey);

worldLoginHandler.xml('login', (client, data) => {
  login(data, { world: true, client });
})

loginHandler.xml('verChk', checkVersion);

loginHandler.xml('rndK', getKey);

loginHandler.xml('login', (client, data) => {
  login(data, { world: false, client });
})

export { worldLoginHandler, loginHandler };