import { findInVersion, VersionsTimeline } from "../game-data";
import { WaddleRoomInfo } from "../game-logic/waddles";
import { Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export function getExtraWaddleRooms(version: Version) {
  const timeline = new VersionsTimeline<WaddleRoomInfo[]>();

  UPDATES.forEach(update => {
    if (update.update.newWaddleRooms !== undefined) {
      timeline.add({
        date: update.date,
        end: update.end,
        info: update.update.newWaddleRooms
      });
    }
  });

  return findInVersion(version, timeline.getVersions());
}