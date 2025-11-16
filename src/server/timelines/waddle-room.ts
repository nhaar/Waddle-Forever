import { findInVersion, VersionsTimeline } from "../game-data";
import { PARTIES } from "../game-data/parties";
import { WaddleRoomInfo } from "../game-logic/waddles";
import { Version } from "../routes/versions";

export function getExtraWaddleRooms(version: Version) {
  const timeline = new VersionsTimeline<WaddleRoomInfo[]>();

  PARTIES.forEach((party) => {
    if (party.newWaddleRooms !== undefined) {
      timeline.add({
        date: party.date,
        end: party.end,
        info: party.newWaddleRooms
      });
    }
  });

  return findInVersion(version, timeline.getVersions());
}