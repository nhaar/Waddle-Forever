import { UPDATES } from "@server/updates/updates";
import { newVersionsTimeline } from ".";
import { START_DATE } from "./dates";

export const PARTY_ANNOUNCEMENT_TIMELINE = newVersionsTimeline<string | null>(timeline => {
  timeline.addInfo(null, START_DATE);
  UPDATES.forEach(update => {
    if (update.update.partyAnnouncement !== undefined) {
      timeline.addInfo(update.update.partyAnnouncement, update.date, update.end);
    }
  })
});