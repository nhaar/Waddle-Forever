import { Version } from "../routes/versions"
import { RoomName } from "./rooms"
import { PET_SHOP_RELEASE, PUFFLE_PARTY_10_CONST_START } from "./updates";

export type Pin = {
  date: Version;
  end: Version;
  roomChange?: [RoomName, number];
  frameChange?: [RoomName, number];
  name: string;
}

// has to be sorted
export const PINS: Array<Pin> = [
  {
    date: PET_SHOP_RELEASE,
    end: '2006-03-31',
    roomChange: ['coffee', 4938],
    frameChange: ['coffee', 2],
    name: 'Shamrock Pin'
  },
  {
    date: PUFFLE_PARTY_10_CONST_START,
    end: '2010-03-18',
    name: 'Feather Pin'
  }
];