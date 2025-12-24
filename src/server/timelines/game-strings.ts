import { newVersionsTimeline } from ".";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export const GAME_STRINGS_TIMELINE = newVersionsTimeline<Record<string, string>>(timeline => {
  timeline.addInfo({}, START_DATE);

  UPDATES.forEach(update => {
    if (update.update.gameStrings !== undefined) {
      timeline.addInfo(update.update.gameStrings, update.date, update.end);
    }
  })
});