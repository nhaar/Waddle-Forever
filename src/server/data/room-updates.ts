import { StaticDataTable } from "../../common/static-table";
import { Version } from "../routes/versions";

type RoomUpdate = {
  id: number;
  roomId: number;
  // file used in the update
  fileId: number;
  updateId: number;
  comment: string;
};

const ROOM_UPDATES = new StaticDataTable<RoomUpdate, ['id', 'roomId', 'fileId', 'updateId', 'comment']>(
  ['id', 'roomId', 'fileId', 'updateId', 'comment'],
  [
  ]
);