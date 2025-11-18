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

  migrator?: boolean | string;

  iglooList?: true | {
    file: FileRef;
    hidden: boolean;
  } | IglooList | ListSongPatch[];

  partyName?: string;
};

export type Event = 'party' |
  'migrator-crash' |
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

  const events = new Map<Event, Array<{ date: Version; update: CPUpdate; }>>();

  updates.forEach(update => {
    consumed.push({
      date: update.date,
      update: update
    })

    if (update.temp !== undefined) {
      iterateEntries(update.temp, (e, u) => {
        const eventsArray = events.get(e) ?? [];
        eventsArray.push({
          date: update.date,
          update: u
        });
        events.set(e, eventsArray);
      });
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
  });

  

  return consumed;
}
