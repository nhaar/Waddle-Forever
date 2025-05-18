import { TimelineMap } from "../game-data/changes";
import { PARTIES } from "../game-data/parties";
import { PINS } from "../game-data/pins";
import { TEMPORARY_ROOM_UPDATES } from "../game-data/room-updates";
import { RoomName, ROOMS } from "../game-data/rooms";
import { Update } from "../game-data/updates";
import { Version } from "../routes/versions";

export function getRoomFrameTimeline() {
  const timeline = new TimelineMap<RoomName, number>();

  // adding defaults
  // TODO, not fond of design?
  Object.keys(ROOMS).forEach((room) => {
    timeline.addPerm(room as RoomName, Update.BETA_RELEASE, 0);
  })

  PINS.forEach((pin) => {
    if ('room' in pin && pin.frame !== undefined) {
      timeline.addTemp(pin.room, pin.date, pin.end, pin.frame);
    }
  });

  const addRoomFrames = (frames: Partial<Record<RoomName, number>>, start: Version, end: Version) => {
    Object.entries(frames).forEach((pair) => {
      const [room, frame] = pair;
      timeline.addTemp(room as RoomName, start, end, frame);
    })
  }
  
  PARTIES.forEach((party) => {
    if (party.roomFrames !== undefined) {
      addRoomFrames(party.roomFrames, party.date, party.end);
    }
  });

  Object.entries(TEMPORARY_ROOM_UPDATES).forEach((pair) => {
    const [room, updates] = pair;
    updates.forEach((update) => {
      if (update.frame !== undefined) {
        timeline.addTemp(room as RoomName, update.date, update.end, update.frame);
      }
    });
  });

  return timeline.getVersionsMap();
}