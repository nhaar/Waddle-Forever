import path from "path";
import crypto from 'crypto';
import { RoomName } from "../game-data/rooms";
import { isGreater, isGreaterOrEqual, Version } from "../routes/versions";
import { PARTIES } from "../game-data/parties";
import { Update } from "../game-data/updates";
import { findInVersion, processTimeline, TimelineEvent, TimelineMap } from "../game-data";
import { getMapForDate } from ".";
import { getMusicTimeline } from "./music";
import { getMigratorTimeline } from "./migrator";
import { getMemberTimeline } from "./member";
import { getFurniturePricesTimeline, getPricesTimeline } from "./prices";

const musicTimeline = getMusicTimeline();
const migratorTimeline = getMigratorTimeline();
const memberTimeline = getMemberTimeline();

export const SCAVENGER_ICON_PATH = 'scavenger_hunt/scavenger_hunt_icon.swf';
export const TICKET_ICON_PATH = 'tickets.swf';
export const TICKET_INFO_PATH = 'ticket_info.swf';

function getGlobalPathsTimeline() {
  const timeline = new TimelineMap<string, null | string>({ value: null, date: Update.CPIP_UPDATE });

  PARTIES.forEach((party) => {
    if (party.globalChanges !== undefined) {
      Object.entries(party.globalChanges).forEach((pair) => {
        const [route, info] = pair;
        if (typeof info !== 'number') {
          const [_, ...paths] = info;
          paths.forEach((globalPath) => {
            timeline.add(globalPath, route, party.date, party.end);
          })
        }
      })
    }

    if (party.scavengerHunt2010 !== undefined) {
      const huntIconPath = party.scavengerHunt2010.iconFilePath ?? SCAVENGER_ICON_PATH;
      timeline.add('scavenger_hunt_icon', huntIconPath, party.date, party.end);
    }

    if (party.fairCpip !== undefined) {
      timeline.add('ticket_icon', TICKET_ICON_PATH, party.date, party.end);
      timeline.add('tickets', TICKET_INFO_PATH, party.date, party.end);
    }
  });

  return timeline.getVersionsMap();

}

function getLocalPathsTimeline() {
  const timeline = new TimelineMap<string, null | string>({ value: null, date: Update.CPIP_UPDATE });

  PARTIES.forEach((party) => {
    // crumbs dont exist before this date
    if (isGreaterOrEqual(party.date, Update.CPIP_UPDATE)){
      if (party.localChanges !== undefined) {
        // only 'en' support
        Object.entries(party.localChanges).forEach((pair) => {
          const [route, langs] = pair;
          if (langs.en !== undefined) {
            if (typeof langs.en !== 'number') {
              const [_, ...paths] = langs.en;
              paths.forEach((path) => {
                timeline.add(path, route, party.date, party.end);
              })
            }
          }
        })
      }
    }
  });

  return timeline.getVersionsMap();
}

const localPathsTimeline = getLocalPathsTimeline();
const globalPathsTimeline = getGlobalPathsTimeline();
const pricesTimeline = getPricesTimeline();
const furniturePricesTimeline = getFurniturePricesTimeline();

/** Represents a unique global crumbs state */
export type GlobalCrumbContent = {
  prices: Record<number, number | undefined>;
  furniturePrices: Record<number, number | undefined>;
  music: Partial<Record<RoomName, number>>;
  member: Partial<Record<RoomName, boolean>>;
  paths: Record<string, string | undefined>;
  newMigratorStatus: boolean;
}

export type LocalCrumbContent = {
  paths: Record<string, string | undefined>;
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
        if (isGreater(info.date, Update.CPIP_UPDATE)) {
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
  }, (prev, cur) => {
    return {
      paths: { ...prev.paths, ...cur.paths }
    };
  }, () => {
    return {
      paths: {}
    }
  });
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
      if (isGreater(info.date, Update.CPIP_UPDATE)) {
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
        if (isGreater(info.date, Update.CPIP_UPDATE)) {
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
        if (isGreater(info.date, Update.CPIP_UPDATE)) {
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
        if (isGreater(info.date, Update.CPIP_UPDATE)) {
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
      newMigratorStatus: cur.newMigratorStatus === undefined ? prev.newMigratorStatus : cur.newMigratorStatus
    }
  }, () => {
    return {
      prices: getMapForDate(pricesTimeline, Update.CPIP_UPDATE),
      furniturePrices: getMapForDate(furniturePricesTimeline, Update.CPIP_UPDATE),
      music: getMapForDate(musicTimeline, Update.CPIP_UPDATE),
      newMigratorStatus: findInVersion(Update.CPIP_UPDATE, migratorTimeline) ?? false,
      paths: {},
      member: getMapForDate(memberTimeline, Update.CPIP_UPDATE)
    }
  });
}