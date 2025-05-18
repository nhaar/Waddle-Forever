import { getSubUpdateDates } from ".";
import { VersionsTimeline } from "../game-data/changes";
import { STANDALONE_MIGRATOR_VISITS } from "../game-data/migrator-visits";
import { PARTIES } from "../game-data/parties";
import { STANDALONE_TEMPORARY_UPDATES } from "../game-data/standalone-changes";
import { Update } from "../game-data/updates";

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

  STANDALONE_TEMPORARY_UPDATES.forEach((update) => {
    if (update.updates !== undefined) {
      update.updates.forEach((subUpdate, i) => {
        if (subUpdate.activeMigrator !== undefined) {
          timeline.add({
            ...getSubUpdateDates(update, i),
            info: true
          });
        }
      })
    }
  })

  return timeline.getVersions();
}