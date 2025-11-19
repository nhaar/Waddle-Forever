import { iterateEntries } from "../../common/utils";
import { TimelineMap } from "../game-data";
import { RoomMap, RoomName, ROOMS } from "../game-data/rooms";
import { Update } from "../game-data/updates";
import { Version } from "../routes/versions";

export function getMemberTimeline() {
  const timeline = new TimelineMap<RoomName, boolean>();

  const addMember = (music: RoomMap<boolean>, start: Version, end: Version | undefined = undefined) => {
    iterateEntries(music, (room, member) => {
      timeline.add(room, member, start, end);
    });
  }

  Object.keys(ROOMS).forEach((room) => {
    timeline.add(room as RoomName, false, Update.BETA_RELEASE);
  });

  return timeline.getVersionsMap();
}