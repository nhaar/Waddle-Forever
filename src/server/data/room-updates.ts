import { StaticDataTable } from "../../common/static-table";
import { Version } from "../routes/versions";
import { RoomName } from "./rooms";

type RoomOpening = {
  room: RoomName;
  fileId: number;
  updateId: number;
};

type RoomUpdate = {
  room: RoomName;
  // file used in the update
  fileId: number;
  updateId: number;
  /** If not supplied, this won't be in the timeline as an update */
  comment?: string;
};

export const ROOM_UPDATES: RoomUpdate[] = [
  {
    room: 'town',
    fileId: 28,
    updateId: 2
  },
  {
    room: 'rink',
    fileId: 32,
    updateId: 2
  }
];

export const ROOM_OPENINGS: RoomOpening[] = [
  {
    room: 'forts',
    fileId: 37,
    updateId: 2
  }
];