import { consumeUpdates, CPUpdate } from ".";
import { IS_DEV } from "../../common/constants";
import { VersionsInformation, VersionsTimeline } from "../game-data";
import { isGreater } from "../routes/versions";
import { UPDATES_2005 } from "./2005";
import { UPDATES_2006 } from "./2006";
import { UPDATES_2007 } from "./2007";
import { UPDATES_2008 } from "./2008";
import { UPDATES_2009 } from "./2009";
import { UPDATES_2010 } from "./2010";
import { UPDATES_2011 } from "./2011";

export const UPDATES = [
  ...UPDATES_2005,
  ...UPDATES_2006,
  ...UPDATES_2007,
  ...UPDATES_2008,
  ...UPDATES_2009,
  ...UPDATES_2010,
  ...UPDATES_2011
];

function enforceCorrectness() {
  let greatest: string | undefined = undefined;
  const seen = new Set<string>();
  for (let i = 0; i < UPDATES.length; i++) {
    const update = UPDATES[i];
    if (greatest === undefined) {
      greatest = update.date;
    } else {
      if (isGreater(greatest, update.date)) {
        throw new Error(`Date out of order: ${update.date}`);
      }
    }
    if (seen.has(update.date)) {
      throw new Error(`Duplicate date: ${update.date}`);
    }
    seen.add(update.date);
  }
}

if (IS_DEV) {
  enforceCorrectness();
}

const consumed = consumeUpdates(UPDATES);

export function createTimeline<T>(callback: (update: CPUpdate) => T | undefined): VersionsInformation<T> {
  const timeline = new VersionsTimeline<T>();

  consumed.forEach((day) => {
    const info = callback(day.update);
    if (info !== undefined) {
      timeline.add({
        date: day.date,
        end: day.end,
        info
      });
    }
  });

  return timeline.getVersions();
}