import { Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";
import { HuntCrumbs, LocalChanges } from "../updates";
import { START_DATE, getDate } from "./dates";
import { newTimelineMap, newVersionsTimeline } from ".";
import { TimelineMap } from "../game-data";

export const SCAVENGER_ICON_PATH = 'scavenger_hunt/scavenger_hunt_icon.swf';
export const TICKET_INFO_PATH = 'close_ups/tickets.swf';



export const HUNT_TIMELINE = newVersionsTimeline<null | HuntCrumbs>(timeline => {
  timeline.addInfo(null, START_DATE);

  UPDATES.forEach(update => {
    if (update.update.scavengerHunt2011 !== undefined) {
      timeline.addInfo(update.update.scavengerHunt2011, update.date, update.end);
    }
  });
});