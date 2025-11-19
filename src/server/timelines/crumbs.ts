import path from "path";
import crypto from 'crypto';
import { RoomName } from "../game-data/rooms";
import { isGreater, isLower, isLowerOrEqual, Version } from "../routes/versions";
import { Update } from "../game-data/updates";
import { findInVersion, processTimeline, TimelineEvent, TimelineMap, VersionsTimeline } from "../game-data";
import { getMapForDate } from ".";
import { getMusicTimeline } from "./music";
import { getMigratorTimeline } from "./migrator";
import { getMemberTimeline } from "./member";
import { getFurniturePricesTimeline, getPricesTimeline } from "./prices";
import { StageScript } from "../game-data/stage-plays";
import { UPDATES } from "../updates/updates";
import { GlobalHuntCrumbs, HuntCrumbs, LocalChanges, LocalHuntCrumbs } from "../updates";


const musicTimeline = getMusicTimeline();
const migratorTimeline = getMigratorTimeline();
const memberTimeline = getMemberTimeline();
const huntTimeline = getHuntTimeline();

export const SCAVENGER_ICON_PATH = 'scavenger_hunt/scavenger_hunt_icon.swf';
export const TICKET_INFO_PATH = 'close_ups/tickets.swf';

export function getGlobalPathsTimeline() {
  const timeline = new TimelineMap<string, null | string>({ value: null, date: Update.CPIP_UPDATE });

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
  const timeline = new TimelineMap<string, null | string>({ value: null, date: Update.CPIP_UPDATE });

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

export function getStageScriptTimeline() {
  const timeline = new VersionsTimeline<StageScript>();

  const scripts = new Map<string, StageScript>();
  UPDATES.forEach((update) => {
    if (update.update.stagePlay !== undefined) {
      let script = scripts.get(update.update.stagePlay.name);
      if (script === undefined) {
        script = update.update.stagePlay.script ?? []
        scripts.set(update.update.stagePlay.name, script);
      } else {
        if (update.update.stagePlay.script !== undefined) {
          script = update.update.stagePlay.script;
          scripts.set(update.update.stagePlay.name, script);
        }
      }

      timeline.add({
        date: update.date,
        info: script
      });
    }
  });

  return timeline.getVersions();
}

const localPathsTimeline = getLocalPathsTimeline();
const globalPathsTimeline = getGlobalPathsTimeline();
const pricesTimeline = getPricesTimeline();
const furniturePricesTimeline = getFurniturePricesTimeline();
const stageTimeline = getStageScriptTimeline();

/** Represents a unique global crumbs state */
export type GlobalCrumbContent = {
  prices: Record<number, number | undefined>;
  furniturePrices: Record<number, number | undefined>;
  music: Partial<Record<RoomName, number>>;
  member: Partial<Record<RoomName, boolean>>;
  paths: Record<string, string | undefined>;
  newMigratorStatus: boolean;
  hunt: GlobalHuntCrumbs | undefined;
}



export type LocalCrumbContent = {
  paths: Record<string, string | undefined>;
  hunt: LocalHuntCrumbs | undefined;
  stageScript: StageScript;
}

export const GLOBAL_CRUMBS_PATH = path.join('default', 'auto', 'global_crumbs');
export const LOCAL_CRUMBS_PATH = path.join('default', 'auto', 'local_crumbs');
export const NEWS_CRUMBS_PATH = path.join('default', 'auto', 'news_crumbs');
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
        if (isLowerOrEqual(Update.CPIP_UPDATE, info.date) && isLower(info.date, Update.MODERN_AS3)) {
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
      if (isLowerOrEqual(Update.CPIP_UPDATE, info.date) && isLower(info.date, Update.MODERN_AS3)) {
        timeline.push({
          date: info.date,
          info: {
            hunt: info.info === null ? undefined : info.info.lang
          }
        });
      }
    });

    stageTimeline.forEach((info) => {
      if (isLowerOrEqual(Update.CPIP_UPDATE, info.date) && isLower(info.date, Update.MODERN_AS3)) {
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
      stageScript: findInVersion(Update.CPIP_UPDATE, stageTimeline) ?? []
    }
  });
}

export function getHuntTimeline() {
  const timeline = new VersionsTimeline<null | HuntCrumbs>();
  timeline.add({
    date: Update.BETA_RELEASE,
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
      date: Update.CPIP_UPDATE,
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

/**
 * Get an output of the global crumbs timeline which includes a hash
 * identifying this timeline and the information of each version
 */
export function getGlobalCrumbsOutput() {
  return getBaseCrumbsOutput<GlobalCrumbContent>((timeline) => {
    migratorTimeline.forEach((info) => {
      if (isLowerOrEqual(Update.CPIP_UPDATE, info.date) && isLower(info.date, Update.MODERN_AS3)) {
        timeline.push({
          date: info.date,
          info: {
            newMigratorStatus: info.info
          }
        });
      }
    });
    
    globalPathsTimeline.forEach((versions, globalPath) => {
      versions.forEach((info) => {
        if (isLowerOrEqual(Update.CPIP_UPDATE, info.date) && isLower(info.date, Update.MODERN_AS3)) {
          timeline.push({
            date: info.date,
            info: {
              paths: {
                [globalPath]: info.info ?? undefined
              }
            }
          });
        }
      })
    });

    musicTimeline.forEach((versions, room) => {
      versions.forEach((info) => {
        if (isLowerOrEqual(Update.CPIP_UPDATE, info.date) && isLower(info.date, Update.MODERN_AS3)) {
          timeline.push({
            date: info.date,
            info: {
              music: {
                [room]: info.info
              }
            }
          });
        }
      });
    });

    memberTimeline.forEach((versions, room) => {
      versions.forEach((info) => {
        if (isLowerOrEqual(Update.CPIP_UPDATE, info.date) && isLower(info.date, Update.MODERN_AS3)) {
          timeline.push({
            date: info.date,
            info: {
              member: {
                [room]: info.info
              }
            }
          });
        }
      });
    });

    pricesTimeline.forEach((versions, itemId) => {
      versions.forEach((info) => {
        if (isGreater(info.date, Update.CPIP_UPDATE)) {
          timeline.push({
            date: info.date,
            info: {
              prices: {
                [itemId]: info.info
              }
            }
          });
        }
      });
    });

    furniturePricesTimeline.forEach((versions, itemId) => {
      versions.forEach((info) => {
        if (isGreater(info.date, Update.CPIP_UPDATE)) {
          timeline.push({
            date: info.date,
            info: {
              furniturePrices: {
                [itemId]: info.info
              }
            }
          });
        }
      });
    });

    huntTimeline.forEach((info) => {
      if (isLowerOrEqual(Update.CPIP_UPDATE, info.date) && isLower(info.date, Update.MODERN_AS3)) {
        timeline.push({
          date: info.date,
          info: {
            hunt: info.info === null ? undefined : info.info.global
          }
        });
      }
    });
  }, (prev, cur) => {
    return {
      music: {
        ...prev.music,
        ...cur.music
      },
      prices: {
        ...prev.prices,
        ...cur.prices
      },
      furniturePrices: {
        ...prev.furniturePrices,
        ...cur.furniturePrices
      },
      paths: {
        ...prev.paths,
        ...cur.paths
      },
      member: {
        ...prev.member,
        ...cur.member
      },
      newMigratorStatus: cur.newMigratorStatus === undefined ? prev.newMigratorStatus : cur.newMigratorStatus,
      hunt: cur.hunt
    }
  }, () => {
    return {
      prices: getMapForDate(pricesTimeline, Update.CPIP_UPDATE),
      furniturePrices: getMapForDate(furniturePricesTimeline, Update.CPIP_UPDATE),
      music: getMapForDate(musicTimeline, Update.CPIP_UPDATE),
      newMigratorStatus: findInVersion(Update.CPIP_UPDATE, migratorTimeline) ?? false,
      paths: {},
      member: getMapForDate(memberTimeline, Update.CPIP_UPDATE),
      hunt: undefined
    }
  });
}