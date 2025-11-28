import { newTimelineMap } from ".";
import { addRecordToMap } from "../game-data";
import { RoomName, ROOMS } from "../game-data/rooms";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export const MEMBER_TIMELINE = newTimelineMap<RoomName, boolean>(timeline => {
  UPDATES.forEach(update => {
    if (update.update.memberRooms !== undefined) {
      addRecordToMap(timeline, update.update.memberRooms, update.date, update.end);
    }
  })

  Object.keys(ROOMS).forEach((room) => {
    timeline.add(room as RoomName, false, START_DATE);
  });
});
