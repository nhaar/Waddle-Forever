import { newVersionsTimeline } from ".";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export const MIGRATOR_TIMELINE = newVersionsTimeline<boolean>(timeline => {
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
});
