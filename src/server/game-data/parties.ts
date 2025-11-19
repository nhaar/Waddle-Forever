import { Version } from "../routes/versions";
import { MigratorVisit, ComplexTemporaryUpdateTimeline } from ".";
import { FileRef } from "./files";
import { RoomName } from "./rooms";
import { Update } from "./updates";
import { WaddleRoomInfo } from "../game-logic/waddles";

// room name -> file Id
export type RoomChanges = Partial<Record<RoomName, FileRef>>;

export type GlobalHuntCrumbs = {
  member: boolean;
  reward: number;
}

type Startscreens = Array<FileRef | [string, FileRef]>;

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

type Language = 'en';

export type LocalChanges = Record<string, Partial<Record<Language, FileRef | CrumbIndicator>>>;

/** First element is file id used, then a list of all the crumbs that point to this path */
export type CrumbIndicator = [FileRef, ...string[]];

export type IslandChanges = {
  roomChanges?: RoomChanges;
  // a map of a path inside play/v2/content/local eg en/catalogues/party.swf mapping to a file
  // inside a map of each language
  localChanges?: LocalChanges;
  // maps route inside play/v2/global to either file Id or tuple [global_path name, file Id]
  globalChanges?: Record<string, FileRef | CrumbIndicator>

  roomFrames?: Partial<Record<RoomName, number>>;

  // route -> fileId
  generalChanges?: Record<string, FileRef>;

  roomComment?: string;

  map?: FileRef;

  music?: Partial<Record<RoomName, number>>;

  /** Price updates */
  prices?: Partial<Record<number, number>>;
  furniturePrices?: Partial<Record<number, number>>;

  roomMemberStatus?: Partial<Record<RoomName, boolean>>;

  activeMigrator?: MigratorVisit;

  /** A list of all backgrounds used for the startscreen. Each element bust be either a file, or a file and the exact name the startscreen uses for it */
  startscreens?: Startscreens;

  /** Scavenger Hunt icon is loaded by the dependency, must be specified */
  scavengerHunt2010?: {
    iconFileId: FileRef;
    // if not supplied, will use a placeholder one
    iconFilePath?: string;
  };

  scavengerHunt2011?: HuntCrumbs

  // TODO maybe also supplying the ID if we know
  // otherwise default egg id to 1
  /**
   * For a scavenger hunt in the 2007-2008 client,
   * writing what the file number of the egg file is
   * */
  scavengerHunt2007?: FileRef;

  /** If used the CPIP fair icon and its info */
  fairCpip?: {
    // exact ID
    iconFileId: FileRef;
    // UI id might be required in the future if we find different ones
    infoFile: FileRef;
  };

  mapNote?: FileRef;

  /** For pre-cpip, if updates the version of the igloo SWF */
  iglooVersion?: number;

  newWaddleRooms?: WaddleRoomInfo[];

  construction?: Construction;
}

export type Party = IslandChanges & {
  name?: string;
  /** If true, then this will not be labeled a party in the timeline */
  event?: true;

  // Overriding the default placeholder message for a party start
  // with a custom one
  startComment?: string;
  endComment?: string;

  updates?: Array<{
    comment?: string;
    date: string;
  } & IslandChanges>;
};

type Construction = {
  date: string;
  changes: RoomChanges;
  startscreens?: Startscreens;

  localChanges?: LocalChanges;

  comment?: string;

  updates?: Array<{
    date: Version;
    changes: RoomChanges;
    comment: string;
  }>;
};