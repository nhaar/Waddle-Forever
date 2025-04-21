import { Version } from "../routes/versions"
import { RoomName } from "./rooms"
import { PUFFLE_PARTY_10_CONST_START } from "./updates";

export const PINS: Array<{
  date: Version;
  roomChange: Partial<Record<RoomName, number>>;
  name: string;
}> = [
  {
    date: PUFFLE_PARTY_10_CONST_START,
    roomChange: {},
    name: 'Feather Pin'
  }
];