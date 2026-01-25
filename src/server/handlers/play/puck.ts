import { Vector } from "../../../common/utils";
import { Handler } from "..";
import { Handle } from "../handles";

const handler = new Handler();

const puckPosition = new Vector(0, 0);
const puckPositionParty = new Vector(0, 0);

const teamScore: number[] = [0, 0];

function getPuckPosition(roomId: number): Array<number> | null {
  if (roomId === 802) {
    return puckPosition.vector;
  }
  if (roomId === 898) {
    // Client is in the Pitch room during the Penguin Games 2008
    return puckPositionParty.vector;
  }
  return null;
}

handler.xt(Handle.GetHockeyGame, (client) => {
  const vector = getPuckPosition(client.room.id);
  if (vector === null) {
    return;
  }
  client.sendXt('gz', ...vector, ...teamScore);
});

handler.xt(Handle.MoveHockeyPuck, (client, penguinId, x, y, ...speed) => {
  const vector = getPuckPosition(client.room.id);
  if (vector === null) {
    return;
  }
  vector[0] = x;
  vector[1] = y;
  client.sendRoomXt('zm', penguinId, x, y, ...speed);
});

handler.xt(Handle.UpdateHockeyGame, (client, team) => {
  if (client.room.id !== 802) {
    return;
  }

  teamScore[team] = (teamScore[team] + 1) % 10;

  client.sendRoomXt('uz', ...teamScore);
});

export default handler;
