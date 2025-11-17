import { iterateEntries } from "../../common/utils";
import { FileRef } from "../game-data/files";
import { RoomName } from "../game-data/rooms";
import { Version } from "../routes/versions"

/** Array of either file to a start screen, or a pair [startscreen name, file] */
type Startscreens = Array<FileRef | [string, FileRef]>;
type Language = 'en';
/** First element is file id used, then a list of all the crumbs that point to this path */
type CrumbIndicator = [FileRef, ...string[]];
type LocalChanges = Record<string, Partial<Record<Language, FileRef | CrumbIndicator>>>;
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

export type CPUpdate = {
  map?: FileRef;
  /** True if this update is the first seasonal pin ever */
  pin?: true;
  /** If a new catalog was released this day: its file */
  clothingCatalog?: FileRef;
  /** If a new catalog was released this day: its file */
  furnitureCatalog?: FileRef;
  /** If a new catalog was released this day: its file */
  iglooCatalog?: FileRef;
  /** Name of the game that is released this day */
  gameRelease?: string;
  /** File of all room changes */
  rooms?: Partial<Record<RoomName, FileRef>>;

  /** All room music IDs */
  music?: Partial<Record<RoomName, number>>;

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

  /** Misc. updates on this day to be added in the timeline */
  miscComments?: string[];

  fileChanges?: Record<string, FileRef>;

  startscreens?: Startscreens;

  localChanges?: LocalChanges;

  globalChanges?: GlobalChanges;

  migrator?: boolean;

  iglooList?: true | {
    file: FileRef;
    hidden: boolean;
  } | IglooList | ListSongPatch[];
};

export type Event = 'migrator-crash' |
  'migrator-reconstruction' |
  'rockhopper-approach' |
  'pet-renovation';

export type Update = {
  date: Version;
  temp?: Partial<Record<Event, CPUpdate>>;
  end?: Array<Event>;
} & CPUpdate;

export function consumeUpdates(updates: Update[]): Array<{
  date: Version;
  end?: Version;
  update: CPUpdate;
}> {
  const consumed: Array<{
    date: Version;
    end?: Version;
    update: CPUpdate;
  }> = [];

  const eventEnds = new Map<Event, Version>();
  const temps: Array<{ date: Version; update: CPUpdate, event: Event }> = [];

  updates.forEach(update => {
    consumed.push({
      date: update.date,
      update: update
    })

    if (update.temp !== undefined) {
      iterateEntries(update.temp, (e, u) => {
        temps.push({
          date: update.date,
          update: u,
          event: e
        });
      });
    }

    if (update.end !== undefined) {
      update.end.forEach(event => {
        if (eventEnds.has(event)) {
          throw new Error(`Event ending twice: ${event}`);
        }
        eventEnds.set(event, update.date);
      });
    }
  });

  
  temps.forEach(temp => {
    const end = eventEnds.get(temp.event);
    if (end === undefined) {
      throw new Error(`No ending to event: ${temp.event}`);
    }
    consumed.push({
      date: temp.date,
      end: end,
      update: temp.update
    });
  });

  return consumed;
}
