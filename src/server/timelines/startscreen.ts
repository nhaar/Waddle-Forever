import { VersionsTimeline } from "../game-data";
import { PARTIES } from "../game-data/parties";
import { STANDALONE_UPDATES } from "../game-data/standalone-changes";

export function getStartscreenTimeline() {
  const timeline = new VersionsTimeline<string[]>();

  STANDALONE_UPDATES.forEach((update) => {
    if (update.startscreens !== undefined) {
      timeline.add({ date: update.date, info: update.startscreens });
    }
  });

  PARTIES.forEach((party) => {
    if (party.startscreens !== undefined) {
      timeline.add({ date: party.date, end: party.end, info: party.startscreens });
    }
  });

  return timeline.getVersions();
}