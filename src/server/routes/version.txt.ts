import { findInVersion, VersionsTimeline } from "../game-data";
import { UPDATES } from "../updates/updates";

const timeline = new VersionsTimeline<number>();

UPDATES.forEach(update => {
  if (update.update.chatVersion !== undefined) {
    timeline.add({
      date: update.date,
      info: update.update.chatVersion
    });
  }
});

export const VERSIONS_TIMELINE = timeline.getVersions();

/** Get the version.txt file used in preCPIP */
export function getVersionTxt(date: string): string {
  const version = findInVersion(date, VERSIONS_TIMELINE);
  return `&v=${version}\n`;
}