import { TimelineMap } from "../game-data";
import { RoomName, ROOMS } from "../game-data/rooms";
import { Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";
import { PIN_TIMELINE } from "./pins";

export function getRoomFrameTimeline() {
  const timeline = new TimelineMap<RoomName, number>();

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

  const addRoomFrames = (frames: Partial<Record<RoomName, number>>, start: Version, end: Version) => {
    Object.entries(frames).forEach((pair) => {
      const [room, frame] = pair;
      timeline.add(room as RoomName, frame, start, end);
    })
  }

  UPDATES.forEach(update => {
    if (update.update.frames !== undefined && update.end !== undefined) {
      addRoomFrames(update.update.frames, update.date, update.end);
    }
  });

  return timeline.getVersionsMap();
}