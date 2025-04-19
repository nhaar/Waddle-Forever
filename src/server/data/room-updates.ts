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
  },
  {
    room: 'village',
    fileId: 82,
    updateId: 9
  },
  {
    room: 'village',
    fileId: 83,
    updateId: 10
  },
  {
    room: 'forts',
    fileId: 87,
    updateId: 13
  },
  {
    room: 'plaza',
    updateId: 21,
    fileId: 102
  },
  {
    room: 'forts',
    updateId: 20,
    fileId: 36
  }
];

export const ROOM_OPENINGS: RoomOpening[] = [
  {
    room: 'forts',
    fileId: 37,
    updateId: 2
  },
  {
    room: 'sport',
    fileId: 17,
    updateId: 9
  },
  {
    room: 'mtn',
    fileId: 13,
    updateId: 10
  },
  {
    room: 'lodge',
    fileId: 11,
    updateId: 16
  },
  {
    room: 'pizza',
    fileId: 100,
    updateId: 19
  },
  {
    room: 'plaza',
    fileId: 103,
    updateId: 19
  },
  {
    room: 'pet',
    fileId: 14,
    updateId: 21
  },
  {
    room: 'berg',
    fileId: 6,
    updateId: 22
  }
];