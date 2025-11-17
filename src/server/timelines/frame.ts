import { getSubUpdateDates } from ".";
import { TimelineMap } from "../game-data";
import { PARTIES } from "../game-data/parties";
import { TEMPORARY_ROOM_UPDATES } from "../game-data/room-updates";
import { RoomName, ROOMS } from "../game-data/rooms";
import { Update } from "../game-data/updates";
import { Version } from "../routes/versions";
import { PIN_TIMELINE } from "./pins";

export function getRoomFrameTimeline() {
  const timeline = new TimelineMap<RoomName, number>();

  // adding defaults
  // TODO, not fond of design?
  Object.keys(ROOMS).forEach((room) => {
    timeline.add(room as RoomName, 1, Update.BETA_RELEASE);
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
  
  PARTIES.forEach((party) => {
    if (party.roomFrames !== undefined) {
      addRoomFrames(party.roomFrames, party.date, party.end);
    }
    if (party.updates !== undefined) {
      party.updates.forEach((update, i) => {
        if (update.roomFrames !== undefined) {
          const { date, end } = getSubUpdateDates(party, i);
          addRoomFrames(update.roomFrames, date, end);
        }
      });
    }
  });

  Object.entries(TEMPORARY_ROOM_UPDATES).forEach((pair) => {
    const [room, updates] = pair;
    updates.forEach((update) => {
      if (update.frame !== undefined) {
        timeline.add(room as RoomName, update.frame, update.date, update.end);
      }
    });
  });

  return timeline.getVersionsMap();
}