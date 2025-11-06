import { VersionsTimeline } from "../game-data";
import { PRE_CPIP_IGLOO_LISTS } from "../game-data/igloo-lists";
import { STANDALONE_UPDATES } from "../game-data/standalone-changes";

export function getIglooTimeline() {
  const timeline = new VersionsTimeline<number>();

  STANDALONE_UPDATES.forEach(update => {
    if (update.iglooVersion !== undefined) {
      timeline.add({
        date: update.date,
        info: update.iglooVersion
      });
    }
  })

  PRE_CPIP_IGLOO_LISTS.forEach(list => {
    timeline.add({
      date: list.date,
      info: list.igloo
    });
  });

  return timeline.getVersions();
}