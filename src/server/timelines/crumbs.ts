import { Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";
import { HuntCrumbs, LocalChanges } from "../updates";
import { START_DATE, getDate } from "./dates";
import { newTimelineMap, newVersionsTimeline } from ".";
import { TimelineMap } from "../game-data";

export const SCAVENGER_ICON_PATH = 'scavenger_hunt/scavenger_hunt_icon.swf';
export const TICKET_INFO_PATH = 'close_ups/tickets.swf';

export const GLOBAL_PATHS_TIMELINE = newTimelineMap<string, null | string>(timeline => {
  timeline.addDefault({ value: null, date: getDate('cpip') });

  UPDATES.forEach(update => {
    if (update.update.scavengerHunt2010 !== undefined) {
      const huntIconPath = update.update.scavengerHunt2010.iconFilePath ?? SCAVENGER_ICON_PATH;
      timeline.add('scavenger_hunt_icon', huntIconPath, update.date, update.end);
    }
    if (update.update.globalChanges !== undefined) {
      Object.entries(update.update.globalChanges).forEach((pair) => {
        const [route, info] = pair;
        if (typeof info !== 'string') {
          const [_, ...paths] = info;
          paths.forEach((globalPath) => {
            timeline.add(globalPath, route, update.date, update.end);
          })
        }
      })
    }
    if (update.update.fairCpip !== undefined) {
      timeline.add('ticket_icon', SCAVENGER_ICON_PATH, update.date, update.end);
    }
    if (update.update.scavengerHunt2011 !== undefined) {
      timeline.add('scavenger_hunt_icon', SCAVENGER_ICON_PATH, update.date, update.end);
    }
  });
});

export const LOCAL_PATHS_TIMELINE = newTimelineMap<string, null | string>(timeline => {
  timeline.addDefault({ value: null, date: getDate('cpip') });

  UPDATES.forEach((update) => {
    if (update.update.localChanges !== undefined && update.end !== undefined) {
      addLocalChanges(update.update.localChanges, timeline, update.date, update.end);
    
    }
    if (update.update.fairCpip !== undefined) {
      timeline.add('tickets', TICKET_INFO_PATH, update.date, update.end);
    }
  });
});

function addLocalChanges(changes: LocalChanges, timeline: TimelineMap<string, null | string>, date: Version, end: Version) {
  // only 'en' support
  Object.entries(changes).forEach((pair) => {
    const [route, langs] = pair;
    if (langs.en !== undefined) {
      if (typeof langs.en !== 'string') {
        const [_, ...paths] = langs.en;
        paths.forEach((path) => {
          timeline.add(path, route, date, end);
        })
      }
    }
  })
}

export const HUNT_TIMELINE = newVersionsTimeline<null | HuntCrumbs>(timeline => {
  timeline.addInfo(null, START_DATE);

  UPDATES.forEach(update => {
    if (update.update.scavengerHunt2011 !== undefined) {
      timeline.addInfo(update.update.scavengerHunt2011, update.date, update.end);
    }
  });
});