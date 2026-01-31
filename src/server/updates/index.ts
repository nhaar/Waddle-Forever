import { iterateEntries } from "../../common/utils";
import { FileRef } from "../game-data/files";
import { GameName } from "../game-data/games";
import { RoomName } from "../game-data/rooms";
import { getStagePlayMusic, StageName, StageScript } from "../game-data/stage-plays";
import { StampUpdates } from "../game-data/stamps";
import { WaddleRoomInfo } from "../game-logic/waddles";
import { Version } from "../routes/versions"

/** Array of either file to a start screen, or a pair [startscreen name, file] */
type Startscreens = Array<FileRef | [string, FileRef]>;
type Language = 'en';
/** First element is file id used, then a list of all the crumbs that point to this path */
export type CrumbIndicator = [FileRef, ...string[]];
export type LocalChanges = Record<string, Partial<Record<Language, FileRef | CrumbIndicator>>>;
type GlobalChanges = Record<string, FileRef | CrumbIndicator>;

/** Information for a song in a music list */
type Song = {
  id: number;
  display: string;
}

/** Information for a song in a music list */
export type ListSong = Song & {
  new?: true;
};

/** Represents a row of a 2D music list */
type Row = [ListSong, ListSong];

/** Represents a 2D music list */
export type IglooList = [Row, Row, Row, Row, Row, Row, Row];

/** Information for a song that is being added in a music list */
export type ListSongPatch = Song & {
  /** Row, column, starting at 1 */
  pos: [number, number];
}

export type GlobalHuntCrumbs = {
  member: boolean;
  reward: number;
}

export type LocalHuntCrumbs = {
  en: {
    loading: string;
    title: string;
    start: string;
    itemsFound: string;
    itemsFoundPlural: string;
    claim: string;
    continue: string;
    clues: [ string, string, string, string, string, string, string, string ];
  }
}

export type HuntCrumbs = {
  global: GlobalHuntCrumbs;
  lang: LocalHuntCrumbs;
  icon: FileRef;
};

export type RoomChanges = Partial<Record<RoomName, FileRef>>;

export type AchievementCode = {
  event: string;
  conditions: string[];
  optionalConditions?: string[];
}
export type WorldStamp = {
  name: string;
  id: number;
  declarations: AchievementCode[];
}

export type PartyOp = 'battle-of-doom';

export type CPUpdate = {
  map?: FileRef;
  /** Pin period indicator */
  pin?: 'start' | 'end';
  /** If the base SWF for a room that has a pin is updated with the pin in it */
  pinRoomUpdate?: FileRef;

  /** If a new catalog was released this day: its file */
  clothingCatalog?: FileRef;
  /** If a new catalog was released this day: its file */
  furnitureCatalog?: FileRef;
  /** If a new catalog was released this day: its file */
  iglooCatalog?: FileRef;
  /** If a new catalog was released this day: its file */
  postcardCatalog?: FileRef;
  sportCatalog?: FileRef;
  hairCatalog?: FileRef;
  petFurniture?: FileRef;
  martialArtworks?: FileRef;

  stampUpdates?: StampUpdates

  worldStamps?: WorldStamp[]

  /** Name of the game that is released this day */
  gameRelease?: string;
  /** File of all room changes */
  rooms?: RoomChanges;

  /** All room music IDs */
  music?: Partial<Record<RoomName, number>>;

  gameMusic?: Partial<Record<GameName, number>>;

  frames?: Partial<Record<RoomName, number>>;

  memberRooms?: Partial<Record<RoomName, boolean>>;

  /**
   * 'irregular': A new issue is released
   * 'period-start': A new issue is released, and from here onwards, each issue is released after one week
   * 'period-end': A new issue is released AND the newspaper stops releaseing weekly from here onwards
   * 'fan': The fan issue is released
   */
  newspaper?: 'irregular' | 'period-start' | 'period-end' | 'fan';

  /** New version of the igloo swf */
  iglooVersion?: number;

  chatVersion?: number;

  /** Misc. updates on this day to be added in the timeline */
  miscComments?: string[];

  roomComment?: string | string[];

  constructionComment?: string;

  partyComment?: string;

  fileChanges?: Record<string, FileRef>;

  startscreens?: Startscreens;

  localChanges?: LocalChanges;

  // only EN support currently
  gameStrings?: Record<string, string>;

  globalChanges?: GlobalChanges;

  migrator?: boolean | string;

  freeBrownPuffle?: boolean;

  dateReference?: DateReference;

  indexHtml?: string;
  websiteFolder?: string;

  battleOp?: PartyOp;

  /**
   * For a scavenger hunt in the 2007-2008 client,
   * writing what the file number of the egg file is
   * */
  scavengerHunt2007?: FileRef;

  /** Scavenger Hunt icon is loaded by the dependency, must be specified */
  scavengerHunt2010?: {
    iconFileId: FileRef;
    // if not supplied, will use a placeholder one
    iconFilePath?: string;
  };

  scavengerHunt2011?: HuntCrumbs

  /** If used the CPIP fair icon and its info */
  fairCpip?: {
    // exact ID
    iconFileId: FileRef;
    // UI id might be required in the future if we find different ones
    infoFile: FileRef;
  };

  iglooList?: string | true | {
    file: FileRef;
    hidden: boolean;
  } | IglooList | ListSongPatch[];

  prices?: Partial<Record<number, number>>;
  furniturePrices?: Partial<Record<number, number>>;
  mapNote?: string;
  newWaddleRooms?: WaddleRoomInfo[];

  coinsForChange?: true;
  bakery?: true;
  cfcValues?: [number, number, number];

  stagePlay?: {
    name: StageName;
    script?: StageScript;
    hide?: true;
    notPremiere?: true;
    costumeTrunk: FileRef | null;
  } & CPUpdate;

  /** An update of a stage script that is independent from the normal workflow of plays */
  playScript?: StageScript;

  partyIconFile?: FileRef;

  activeFeatures?: string;

  /** Used for the Ultimate Jam (2012 party) */
  unlockedDay?: number;

  /** For pre-cpip clients, in which items are stored in chat.swf, supply all items available in the chat.swf of that day */
  clientFiles?: number[];
  removeClientFiles?: number[];
} & ({
  partyName: string;
  decorated?: false;
  partyIcon?: FileRef;
} | {
  partyStart: string;
  partyEnd: string;
  decorated?: false;
  partyIcon?: FileRef;
} | {
  update: string;
} | {});

export type Event = 'party' |
  'party2' |
  'party3' |
  'const' |
  'migrator-crash' |
  'migrator-reconstruction' |
  'rockhopper-approach' |
  'pet-renovation' |
  'earthquake' |
  'event' |
  'fire-construction' |
  'launchpad-construction' |
  'town-launchpad' |
  'broken-clock' |
  'forts-sign' |
  'attic-snow' |
  'telescope-bottle' |
  'storm' |
  'box-plants';

export type DateReference = 'cpip' |
  'as3' |
  'vanilla-engine' |
  'as3-startscreen' |
  'igloo-music' |
  'stamps-release' |
  'placeholder-2016' |
  'vr-room' |
  'old-rink';

export type Update = {
  date: Version;
  temp?: Partial<Record<Event, CPUpdate>>;
  end?: Array<Event>;
} & CPUpdate;

type TimeBoundInfo<T> = {
  date: Version;
  end?: Version;
} & T;

type UpdateTimeline = TimeBoundInfo<{ update: CPUpdate }>[];

export function consumeUpdates(updates: Update[]): Array<{
  date: Version;
  end?: Version;
  update: CPUpdate;
}> {
  const consumed: UpdateTimeline = [];

  const events = new Map<Event, Array<{ date: Version; update: CPUpdate; }>>();
  let stagePlay: { date: Version; update: CPUpdate; name: StageName } | undefined = undefined;


  for (let i = 0; i < updates.length; i++) {
    const update = updates[i];

    consumed.push({
      date: update.date,
      update: update
    })

    if (update.temp !== undefined) {
      iterateEntries(update.temp, (e, u) => {
        if (e.startsWith('party')) {
          const constructions = events.get('const');
          if (constructions !== undefined) {
            const constructionComment = 'partyName' in u ? (
              `Construction for the ${u.partyName} starts`
            ): (
              constructions[0].update.constructionComment
            );
            if (constructionComment === undefined) {
              throw new Error('Expected construction comment to be defined');
            }
            constructions.forEach(constUpdate => {
              consumed.push({
                date: constUpdate.date,
                end: update.date,
                update: { ...constUpdate.update, constructionComment }
              });
            })
            events.delete('const');
          }
        }
        const eventsArray = events.get(e) ?? [];
        eventsArray.push({
          date: update.date,
          update: u
        });
        events.set(e, eventsArray);
      });
    }
    if (update.stagePlay !== undefined) {
      if (stagePlay !== undefined) {
        // exceptional play that plays music in a different room
        if (stagePlay.name === 'Norman Swarm Has Been Transformed') {
          stagePlay.update.music = {
            party1: getStagePlayMusic(stagePlay.name)
          }
        }
        consumed.push({
          ...stagePlay,
          end: update.date 
        });
      }
      stagePlay = {
        date: update.date,
        update: update.stagePlay,
        name: update.stagePlay.name
      }
    }

    if (update.end !== undefined) {
      update.end.forEach(event => {
        const eventsArray = events.get(event);
        if (eventsArray === undefined) {
          throw new Error(`No such event to end: ${event}`);
        }
        eventsArray.forEach(temp => {
          consumed.push({
            date: temp.date,
            end: update.date,
            update: temp.update
          });
        });
        events.delete(event);
      });
    }
  }

  if (stagePlay !== undefined) {
    consumed.push(stagePlay);
  }

  

  return consumed;
}
