import serverList, { getServerPopulation } from "../../../server/servers";
import { XtHandler } from "..";
import { isAs3 } from "../../../server/routes/versions";

const handler = new XtHandler();

handler.xml('verChk', (client) => {
  // version checking
  // this is irrelevant for us, we just always send an OK response
  client.send('<msg t="sys"><body action="apiOK" r="0"></body></msg>');
});

handler.xml('rndK', (client) => {
  // random key generation
  // this is used for authentication, so it is not needed for us, we just send any key
  client.send('<msg t="sys"><body action="rndK" r="-1"><k>key</k></body></msg>');
});

handler.xml('login', (client, data) => {
  const nicknameMatch = data.match(/<nick><!\[CDATA\[(.*)\]\]><\/nick>/);
  if (nicknameMatch === null) {
    console.log('No nickname provided during Login, terminating.');
    client.socket.end('');
  } else {
    const name = nicknameMatch[1];
    if (isAs3(client.version) && client.serverType === 'World') {
      // in AS3 client, the world actually receives the ID instead of the name
      client.setPenguinFromId(Number(name));
    } else {
      client.setPenguinFromName(name);
    }
    console.log(`${client.penguin.name} is logging in`);
    /*
    TODO
    buddies
    how will server size be handled after NPCs?
    */
    // information regarding how many populations are in each server
    client.sendXt('l', client.id, client.id, '', serverList.map((server) => {
      const population = server.name === 'Blizzard' ? 5 : getServerPopulation()
      return `${server.id},${population}`;
    }).join('|'));
  }
})

export default handler;