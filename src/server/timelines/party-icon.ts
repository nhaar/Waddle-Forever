import { newVersionsTimeline } from ".";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export const PARTY_ICON_TIMELINE = newVersionsTimeline<boolean>(timeline => {
  timeline.addInfo(false, START_DATE);
  UPDATES.forEach(update => {
    if (update.update.partyIconFile !== undefined) {
      timeline.addInfo(true, update.date, update.end);
    }
  })
});