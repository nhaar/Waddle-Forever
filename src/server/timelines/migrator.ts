import { VersionsTimeline } from "../game-data";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export function getMigratorTimeline() {
  const timeline = new VersionsTimeline<boolean>();
  timeline.add({
    date: START_DATE,
    info: false
  });

  UPDATES.forEach(update => {
    if (update.update.migrator !== undefined) {
      const migrator = update.update.migrator === false ? false : true;
      if (update.end === undefined) {
        timeline.add({
          date: update.date,
          info: migrator
        });
      } else {
        timeline.add({
          date: update.date,
          info: migrator,
          end: update.end
        });
      }
    }
  });

  return timeline.getVersions();
}