import { getSubUpdateDates } from ".";
import { VersionsTimeline } from "../game-data";
import { STANDALONE_MIGRATOR_VISITS } from "../game-data/migrator-visits";
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

  STANDALONE_MIGRATOR_VISITS.forEach((visit) => {
    timeline.add({
      date: visit.date,
      end: visit.end,
      info: true
    });
  });

  UPDATES.forEach(update => {
    if (update.update.migrator !== undefined) {
      if (update.end === undefined) {
        timeline.add({
          date: update.date,
          info: update.update.migrator
        });
      } else {
        timeline.add({
          date: update.date,
          info: update.update.migrator,
          end: update.end
        });
      }
    }
  });

  return timeline.getVersions();
}