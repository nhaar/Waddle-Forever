import { Handler } from "..";
import { Handle } from "../handles";
import { Client } from "../../../server/client";

const handler = new Handler();

const teamScore: number[] = [0, 0];

function getPuckPosition(client: Client): Array<number> | null {
  if (client.room.id === 802) {
    return client.server.puckPosition;
  }
  if (client.room.id === 898) {
    // Client is in the Pitch room during the Penguin Games 2008
    return client.server.puckPositionParty;
  }
  return null;
}

handler.xt(Handle.GetHockeyGame, (client) => {
  const vector = getPuckPosition(client);
  if (vector === null) {
    return;
  }
  client.sendXt('gz', ...vector, ...teamScore);
});

handler.xt(Handle.MoveHockeyPuck, (client, penguinId, x, y, ...speed) => {
  const vector = getPuckPosition(client);
  if (vector === null) {
    return;
  }
  vector[0] = x;
  vector[1] = y;
  client.sendRoomXt('zm', penguinId, x, y, ...speed);
});

handler.xt(Handle.MoveHockeyPuckOld, (client, x, y) => {
  const vector = getPuckPosition(client);
  if (vector === null) {
    return;
  }
  vector[0] = x;
  vector[1] = y;
  client.sendRoomXt('zm', x, y);
});

handler.xt(Handle.UpdateHockeyGame, (client, team) => {
  if (client.room.id !== 802) {
    return;
  }

  teamScore[team] = (teamScore[team] + 1) % 10;

  client.sendRoomXt('uz', ...teamScore);
});

export default handler;
