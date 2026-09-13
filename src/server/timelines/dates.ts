import { iterateEntries } from "@common/utils";
import { isGreaterOrEqual, isLower, Version } from "../routes/versions";
import { DateReference, dateRefs } from "../updates";
import { UPDATES } from "../updates/updates";

export const START_DATE = UPDATES[0].date;

const dateRefRecord = Object.fromEntries(dateRefs.map(r => [r, undefined])) as Record<DateReference, Version | undefined>;

const dateRefMap = new Map<DateReference, Version>();

export function getDate(ref: DateReference): Version {
  const value = dateRefMap.get(ref);
  if (value === undefined) {
    throw new Error(`Could not find date reference: ${ref}`);
  }
  return value;
}

for (let i = 0; i < UPDATES.length; i++) {
  const update = UPDATES[i];
  if (update.update.dateReference !== undefined) {
    dateRefRecord[update.update.dateReference] = update.date;
  }
}

iterateEntries(dateRefRecord, (key, value) => {
  if (value === undefined) {
    throw new Error(`Did not set value for reference: ${key}`);
  }
  dateRefMap.set(key, value);
});