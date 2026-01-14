import path from "path";
import crypto from 'crypto';
import { Version } from "../routes/versions";
import { findInVersion, processTimeline, TimelineEvent, TimelineMap, VersionsTimeline } from "../game-data";
import { StageScript } from "../game-data/stage-plays";
import { UPDATES } from "../updates/updates";
import { HuntCrumbs, LocalChanges, LocalHuntCrumbs } from "../updates";
import { START_DATE, getDate, isEngine2 } from "./dates";
import { STAGE_TIMELINE } from "./stage";


const huntTimeline = getHuntTimeline();

export const SCAVENGER_ICON_PATH = 'scavenger_hunt/scavenger_hunt_icon.swf';
export const TICKET_INFO_PATH = 'close_ups/tickets.swf';

export function getGlobalPathsTimeline() {
  const timeline = new TimelineMap<string, null | string>({ value: null, date: getDate('cpip') });

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

  return timeline.getVersionsMap();

}

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

export function getLocalPathsTimeline() {
  const timeline = new TimelineMap<string, null | string>({ value: null, date: getDate('cpip') });

  UPDATES.forEach((update) => {
    if (update.update.localChanges !== undefined && update.end !== undefined) {
      addLocalChanges(update.update.localChanges, timeline, update.date, update.end);
    
    }
    if (update.update.fairCpip !== undefined) {
      timeline.add('tickets', TICKET_INFO_PATH, update.date, update.end);
    }
  })

  return timeline.getVersionsMap();
}

const localPathsTimeline = getLocalPathsTimeline();

export type LocalCrumbContent = {
  paths: Record<string, string | undefined>;
  hunt: LocalHuntCrumbs | undefined;
  stageScript: StageScript;
}

export const LOCAL_CRUMBS_PATH = path.join('default', 'auto', 'local_crumbs');
export function getCrumbFileName(hash: string, id: number): string {
  return `${hash}-${id}.swf`;
}

function getMd5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

export type CrumbOutput<CrumbContent> = {
  hash: string;
  crumbs: Array<{
        date: Version;
        out: CrumbContent;
        id: number;
    }>;
};

export function getLocalCrumbsOutput() {
  return getBaseCrumbsOutput<LocalCrumbContent>((timeline) => {
    localPathsTimeline.forEach((versions, localPath) => {
      versions.forEach((info) => {
        if (isEngine2(info.date)) {
          timeline.push({
            date: info.date,
            info: {
              paths: {
                [localPath]: info.info ?? undefined
              }
            }
          });
        }
      })
    });

    huntTimeline.forEach((info) => {
      if (isEngine2(info.date)) {
        timeline.push({
          date: info.date,
          info: {
            hunt: info.info === null ? undefined : info.info.lang
          }
        });
      }
    });

    STAGE_TIMELINE.forEach((info) => {
      if (isEngine2(info.date)) {
        timeline.push({
          date: info.date,
          info: {
            stageScript: info.info
          }
        });
      }
    });
  }, (prev, cur) => {
    return {
      paths: { ...prev.paths, ...cur.paths },
      hunt: cur.hunt,
      stageScript: cur.stageScript ?? prev.stageScript
    };
  }, () => {
    return {
      paths: {},
      hunt: undefined,
      stageScript: findInVersion(getDate('cpip'), STAGE_TIMELINE) ?? []
    }
  });
}

export function getHuntTimeline() {
  const timeline = new VersionsTimeline<null | HuntCrumbs>();
  timeline.add({
    date: START_DATE,
    info: null
  });

  UPDATES.forEach(update => {
    if (update.update.scavengerHunt2011 !== undefined) {
      timeline.add({
        date: update.date,
        end: update.end,
        info: update.update.scavengerHunt2011
      });
    }
  });

  return timeline.getVersions();
}

function getBaseCrumbsOutput<CrumbContent>(
  timelineBuilder: (timeline: TimelineEvent<Partial<CrumbContent>>[]) => void,
  mergeCrumbs: (prev: CrumbContent, cur: Partial<CrumbContent>) => CrumbContent,
  getFirstCrumb: () => CrumbContent
) {
  const timeline: TimelineEvent<Partial<CrumbContent>>[] = [
    {
      date: getDate('cpip'),
      info: getFirstCrumb()
    }
  ];

  timelineBuilder(timeline);

  const crumbs = processTimeline(timeline, (input) => {
    return input
  }, getFirstCrumb, mergeCrumbs, (out) => {
    // theoretically, stringify might not work if things are out of order
    // however, due to how the crumbs are setup, this is not an issue
    // (if the crumbs script ever breaks though, it's because it became an issue)
    return JSON.stringify(out);
  });

  const crumbsHash = getMd5(JSON.stringify(crumbs))
  return { hash: crumbsHash, crumbs };
}