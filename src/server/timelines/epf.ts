import { newVersionsTimeline } from ".";
import { PartyOp } from "../updates";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export const PARTY_OP_TIMELINE = newVersionsTimeline<PartyOp | undefined>((timeline) => {
  timeline.addInfo(undefined, START_DATE);

  UPDATES.forEach(update => {
    if (update.update.battleOp !== undefined) {
      timeline.addInfo(update.update.battleOp, update.date, update.end);
    }
  });
})