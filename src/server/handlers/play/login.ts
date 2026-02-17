import serverList, { getServerPopulation } from "../../servers";
import { Handler } from "..";
import { logdebug } from "@server/logger";
import { isGreaterOrEqual, isLower } from "@server/routes/versions";
import { getDate } from "@server/timelines/dates";

const handler = new Handler();

handler.xml('verChk', (client) => {
  // version checking
  // this is irrelevant for us, we just always send an OK response
  client.send('<msg t="sys"><body action="apiOK" r="0"></body></msg>');
});

handler.xml('rndK', (client) => {
  // random key generation
  // this is used for authentication, so it is not needed for us, we just send any key
  client.send(`<msg t="sys"><body action="rndK" r="-1"><k>key</k></body></msg>`);
});

handler.xml('login', (client, data) => {
  const joinMatch = data.match(/<login z='j'>/);
  if (client.isEngine1 && joinMatch) {
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
    if (client.isEngine3 && client.serverType === 'World') {
      // in Engine 3 client, the world actually receives the ID instead of the name
      client.setPenguinFromId(Number(name));
    } else {
      if (client.isEngine1) {
        // in pre-cpip, underscores represent spaces in names
        name = name.replace(/_/g, ' ');
      }

      // todo: error 101 is incorrect password
      if (client.server.settings.no_create_via_login && !client.server.penguinExists(name)) {
        client.sendXt('e', 100)
        return
      }

      client.setPenguinFromName(name);
    }
    console.log(`${client.penguin.name} is logging in`);
    /*
    TODO
    buddies
    how will server size be handled after NPCs?
    */

    // 'l' packet arguments:

    // outside 2012 client
    // 1 = ID
    // 2 = ??
    // 3 = ??
    // 4 = server list

    // 2012 client
    // 1 = ID
    // 2 = Friend SWID (??)
    // 3 = login key (unknown what it is used for)
    // 4 = friends login key (??)
    // 5 = worlds with buddies
    // 6 = server list

    const serverString = serverList.map((server) => {
      const population = server.name === 'Blizzard' ? 5 : getServerPopulation()
      return `${server.id},${population}`;
    }).join('|');

    if (isGreaterOrEqual(client.version, getDate('2012-client')) && isLower(client.version, getDate('vanilla-engine'))) {
      client.sendXt('l', client.penguin.id, client.penguin.id, '', '', '', serverString);
    } else {
      client.sendXt('l', client.penguin.id, client.penguin.id, '', serverString);
    }
  }
})

export default handler;