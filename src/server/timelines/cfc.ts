import { newVersionsTimeline } from ".";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export const COINS_FOR_CHANGE_TIMELINE = newVersionsTimeline<boolean>(timeline => {
  timeline.addInfo(false, START_DATE);

  UPDATES.forEach(update => {
    if (update.update.coinsForChange === true) {
      timeline.addInfo(true, update.date, update.end);
    }
  })
});

export const BAKERY_TIMELINE = newVersionsTimeline<boolean>(timeline => {
  timeline.addInfo(false, START_DATE);

  UPDATES.forEach(update => {
    if (update.update.bakery === true) {
      timeline.addInfo(true, update.date, update.end);
    }
  });
});