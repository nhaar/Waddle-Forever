import { getSubUpdateDates } from ".";
import { VersionsTimeline } from "../game-data";
import { PARTIES } from "../game-data/parties";
import { Update } from "../game-data/updates";
import { UPDATES } from "../updates/updates";

export function getMigratorTimeline() {
  const timeline = new VersionsTimeline<boolean>();
  timeline.add({
    date: Update.BETA_RELEASE,
    info: false
  });

  PARTIES.forEach((party) => {
    if (party.activeMigrator !== undefined) {
      timeline.add({
        date: party.date,
        end: party.end,
        info: true
      });
    }
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