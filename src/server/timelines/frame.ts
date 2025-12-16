import { newTimelineMap } from ".";
import { addRecordToMap } from "../game-data";
import { RoomName, ROOMS } from "../game-data/rooms";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";
import { PIN_TIMELINE } from "./pins";

export const ROOM_FRAME_TIMELINE = newTimelineMap<RoomName, number>((timeline) => {
  // adding defaults
  // TODO, not fond of design?
  Object.keys(ROOMS).forEach((room) => {
    timeline.add(room as RoomName, 1, START_DATE);
  })

  PIN_TIMELINE.forEach(pin => {
    if ('frame' in pin && pin.frame !== undefined) {
      timeline.add(pin.room, pin.frame, pin.date, pin.end);
    }
  });

  UPDATES.forEach(update => {
    if (update.update.frames !== undefined) {
      addRecordToMap(timeline, update.update.frames, update.date, update.end);
    }
  });
});