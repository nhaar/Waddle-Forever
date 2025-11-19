import { iterateEntries } from "../../common/utils";
import { TimelineMap } from "../game-data";
import { RoomMap, RoomName, ROOMS } from "../game-data/rooms";
import { Update } from "../game-data/updates";
import { Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export function getMemberTimeline() {
  const timeline = new TimelineMap<RoomName, boolean>();

  const addMember = (music: RoomMap<boolean>, start: Version, end: Version | undefined = undefined) => {
    iterateEntries(music, (room, member) => {
      timeline.add(room, member, start, end);
    });
  }

  UPDATES.forEach(update => {
    if (update.update.memberRooms !== undefined) {
      addMember(update.update.memberRooms, update.date, update.end);
    }
  })

  Object.keys(ROOMS).forEach((room) => {
    timeline.add(room as RoomName, false, START_DATE);
  });

  return timeline.getVersionsMap();
}