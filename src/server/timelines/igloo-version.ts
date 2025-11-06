import { VersionsTimeline } from "../game-data";
import { PRE_CPIP_IGLOO_LISTS } from "../game-data/igloo-lists";

export function getIglooTimeline() {
  const timeline = new VersionsTimeline<number>();

  PRE_CPIP_IGLOO_LISTS.forEach(list => {
    timeline.add({
      date: list.date,
      info: list.igloo
    });
  });

  return timeline.getVersions();
}