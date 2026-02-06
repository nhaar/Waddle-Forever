import { Handler } from "..";
import { Handle } from "../handles";
import { Client, Server } from "@server/client";

interface NewPenguin {
  username: string,
  color: number,
  timeout: NodeJS.Timeout
}

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

function createPenguin(username: string, color: number, server: Server) {
  Client.create(username, color, {
    is_member: server.settings.always_member,
    virtualRegistrationTimestamp: server.getVirtualDate(0).getTime()
  });
}

const handler = new Handler();

handler.post('/create_account/create_account.php', (server, body) => {
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

      if (server.penguinExists(body.username)) {
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
      createPenguin(session.username, session.color, server);
      res += 'success=1';
      break;
  }

  return res;
});

handler.post('/php/join.php', (server, body) => {
  const name = body.Username;
  if (name.length < 3 || name.length > 12 || server.penguinExists(name)) {
    return 'e=700';
  }

  createPenguin(name, Number(body.Colour), server);

  return 'e=0';
});

handler.xt(Handle.CheckNameOld, (client, name) => {
  const isValid = (name.length > 2 && name.length <= 12 && !client.server.penguinExists(name)) ? 0 : 1;
  client.sendXt('checkName', isValid, name);
});

export default handler;
