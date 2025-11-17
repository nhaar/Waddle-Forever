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
};

type TemporaryUpdate = {
  end: Version;
  consequences?: { date: Version; } & CPUpdate;
  sub?: Array<{ date: Version; } & CPUpdate>;
} & CPUpdate;

export type Update = {
  date: Version;
  temp?: TemporaryUpdate[];
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

  updates.forEach(update => {
    consumed.push({
      date: update.date,
      update: update
    })

    if (update.temp !== undefined) {
      update.temp.forEach(temp => {
        consumed.push({
          date: update.date,
          end: temp.end,
          update: temp
        });

        if (temp.consequences !== undefined) {
          consumed.push({
            date: temp.end,
            update: temp.consequences
          });
        }

        if (temp.sub !== undefined) {
          temp.sub.forEach((subUpdate) => {
            consumed.push({
              date: subUpdate.date,
              end: temp.end,
              update: subUpdate
            });
          });
        }
      });
    }
  });

  return consumed;
}
