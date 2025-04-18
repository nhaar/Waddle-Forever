import { StaticDataTable } from "../../common/static-table";
import { Version } from "../routes/versions";
import { RoomName } from "./rooms";

type RoomOpening = {

};

type RoomUpdate = {
  id: number;
  room: RoomName;
  // file used in the update
  fileId: number;
  updateId: number;
  comment: string;
};

const ROOM_UPDATES = new StaticDataTable<RoomUpdate, ['id', 'room', 'fileId', 'updateId', 'comment']>(
  ['id', 'room', 'fileId', 'updateId', 'comment'],
  [
  ]
);