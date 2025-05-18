import path from "path";
import crypto from 'crypto';
import hash from 'object-hash';
import { RoomName } from "../game-data/rooms";
import { isGreater, isGreaterOrEqual, Version } from "../routes/versions";
import { PARTIES } from "../game-data/parties";
import { Update } from "../game-data/updates";
import { processTimeline, TimelineEvent } from "../game-data";
import { ITEMS } from "../game-logic/items";
import { STANDALONE_MIGRATOR_VISITS } from "../game-data/migrator-visits";
import { ROOM_MUSIC_TIMELINE } from "../game-data/room-updates";
import { STAGE_PLAYS, STAGE_TIMELINE } from "../game-data/stage-plays";
import { getMapForDate } from ".";
import { getMusicTimeline } from "./music";

/** Represents a unique global crumbs state */
export type GlobalCrumbContent = {
  prices: Record<number, number>;
  music: Partial<Record<RoomName, number>>;
  paths: Record<string, string>;
  newMigratorStatus: boolean;
}

export type LocalCrumbContent = {
  paths: Record<string, string>;
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
    PARTIES.forEach((party) => {
      // crumbs dont exist before this date
      if (isGreaterOrEqual(party.date, Update.CPIP_UPDATE)){
        const localPaths: Record<string, string> = {};
        if (party.localChanges !== undefined) {
          // only 'en' support
          Object.entries(party.localChanges).forEach((pair) => {
            const [route, langs] = pair;
            if (langs.en !== undefined) {
              if (typeof langs.en !== 'number') {
                const [_, ...paths] = langs.en;
                paths.forEach((path) => {
                  localPaths[path] = route;
                })
              }
            }
          })
        }
    
        if (Object.keys(localPaths).length > 0) {
          timeline.push({
            date: party.date,
            end: party.end,
            info: { paths: localPaths }
          });
        }
      }

    })
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

function getBaseCrumbsOutput<CrumbContent extends hash.NotUndefined>(
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
    // this is a third party function that can properly hash objects
    // even if their property order isn't the same
    return hash(out);
  });

  const crumbsHash = getMd5(JSON.stringify(crumbs))
  return { hash: crumbsHash, crumbs };
}

/** Get price object for a blank state */
function getBasePriceObject(): Record<number, number> {
  const prices: Record<number, number> = {};
  ITEMS.rows.forEach((item) => {
    prices[item.id] = item.cost;
  });

  return prices;
}

export const SCAVENGER_ICON_PATH = 'scavenger_hunt/scavenger_hunt_icon.swf';
export const TICKET_ICON_PATH = 'tickets.swf';
export const TICKET_INFO_PATH = 'ticket_info.swf';

/**
 * Get an output of the global crumbs timeline which includes a hash
 * identifying this timeline and the information of each version
 */
export function getGlobalCrumbsOutput() {
  return getBaseCrumbsOutput<GlobalCrumbContent>((timeline) => {
    STANDALONE_MIGRATOR_VISITS.forEach((visit) => {
      timeline.push({
        date: visit.date,
        end: visit.end,
        info: {
          newMigratorStatus: true
        }
      });
    });
    
    PARTIES.forEach((party) => {
      const globalPaths: Record<string, string> = {};
      if (party.globalChanges !== undefined) {
        Object.entries(party.globalChanges).forEach((pair) => {
          const [route, info] = pair;
          if (typeof info !== 'number') {
            const [_, ...paths] = info;
            paths.forEach((globalPath) => {
              globalPaths[globalPath] = route;
            })
          }
        })
      }

      if (party.scavengerHunt2010 !== undefined) {
        const huntIconPath = party.scavengerHunt2010.iconFilePath ?? SCAVENGER_ICON_PATH;
        globalPaths['scavenger_hunt_icon'] = huntIconPath;
      }

      if (party.fairCpip !== undefined) {
        globalPaths['ticket_icon'] = TICKET_ICON_PATH;
        globalPaths['tickets'] = TICKET_INFO_PATH;
      }
  
      // we only want to add parties that are post CPIP and actually made changes
      // so we don't have excess crumb files
      // NOTE that this design can easily lead to new properties being added not being handled
      let crumbChanged = false;
      if (isGreaterOrEqual(party.date, Update.CPIP_UPDATE)) {
        // change is detected if any of these is true
        crumbChanged = [
          party.music !== undefined,
          Object.keys(globalPaths).length > 0,
          party.activeMigrator !== undefined,
          party.scavengerHunt2010 !== undefined,
          party.fairCpip !== undefined
        ].some((v) => v);
      }
  
      if (crumbChanged) {
        timeline.push({
          date: party.date,
          end: party.end,
          info: {
            music: party.music,
            paths: globalPaths,
            prices: {},
            newMigratorStatus: party.activeMigrator === undefined ? undefined : true
          }
        });
      }
    });

    Object.entries(ROOM_MUSIC_TIMELINE).forEach((pair) => {
      const [room, musicTimeline] = pair;
      const [_, ...otherSongs] = musicTimeline;
      otherSongs.forEach((update) => {
        if (isGreater(update.date, Update.CPIP_UPDATE)) {
          timeline.push({
            date: update.date,
            info: {
              music: {
                [room as RoomName]: update.musicId
              }
            }
          })
        }
      })
    })
  
    STAGE_TIMELINE.forEach((debut) => {
      const play = STAGE_PLAYS.find((play) => play.name === debut.name);
      if (play === undefined) {
        throw new Error(`Stage play has no music: ${debut.name}`);
      }
      timeline.push({
        date: debut.date,
        info: {
          music: {
            'stage': play.musicId
          }
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
      paths: {
        ...prev.paths,
        ...cur.paths
      },
      newMigratorStatus: cur.newMigratorStatus === undefined ? prev.newMigratorStatus : cur.newMigratorStatus
    }
  }, () => {
    return {
      prices: getBasePriceObject(),
      music: getMapForDate(getMusicTimeline(), Update.CPIP_UPDATE),
      newMigratorStatus: false,
      paths: {}
    }
  });
}