import { FileRef } from "./files";
import { RoomName } from "./rooms";

// room name -> file Id
export type RoomChanges = Partial<Record<RoomName, FileRef>>;