import { Version } from "../routes/versions"
import { RoomName } from "./rooms"
import { PET_SHOP_RELEASE, PUFFLE_PARTY_10_CONST_START } from "./updates";

export type Pin = {
  date: Version;
  end: Version;
  name: string;
} & ({} | {
  room: RoomName;
  fileId?: number;
  frame?: number;
})
  
// has to be sorted
export const PINS: Array<Pin> = [
  {
    date: PET_SHOP_RELEASE,
    end: '2006-03-31',
    room: 'coffee',
    fileId: 4938,
    frame: 2,
    name: 'Shamrock'
  },
  {
    date: '2006-05-12',
    end: '2006-05-26',
    room: 'dock',
    fileId: 4939,
    frame: 2,
    name: 'Balloon'
  },
  {
    date: PUFFLE_PARTY_10_CONST_START,
    end: '2010-03-18',
    name: 'Feather'
  }
];