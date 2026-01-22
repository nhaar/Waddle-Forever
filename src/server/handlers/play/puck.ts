import { Vector } from "../../../common/utils";
import { Handler } from "..";
import { Handle } from "../handles";
import { isGreaterOrEqual, isLower } from "../../../server/routes/versions";

const handler = new Handler();

const puckPosition = new Vector(0, 0);
const puckPositionParty = new Vector(0, 0);

function getPuckPosition(roomId: number, version: string): Array<number> | null {
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
  const vector = getPuckPosition(client.room.id, client.settings.version);
  if (vector === null) {
    return;
  }
  client.sendXt('gz', ...vector);
});

handler.xt(Handle.MoveHockeyPuck, (client, _, x, y, ...speed) => {
  const vector = getPuckPosition(client.room.id, client.settings.version);
  if (vector === null) {
    return;
  }
  vector[0] = x;
  vector[1] = y;
  client.sendRoomXt('zm', 0, x, y, ...speed);
});

export default handler;
