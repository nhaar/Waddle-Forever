import { iterateEntries } from "../../common/utils";
import { isGreaterOrEqual, isLower, Version } from "../routes/versions";
import { DateReference } from "../updates";
import { UPDATES } from "../updates/updates";

export const START_DATE = UPDATES[0].date;

const dateRefRecord: Record<DateReference, Version | undefined> = {
  'as3': undefined,
  'as3-startscreen': undefined,
  'cpip': undefined,
  'igloo-music': undefined,
  'stamps-release': undefined,
  'vanilla-engine': undefined,
  'placeholder-2016': undefined,
  'vr-room': undefined,
  'old-rink': undefined
};

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

export function isEngine1(version: Version): boolean {
  return isLower(version, getDate('cpip'))
}

export function isEngine2(version: Version): boolean {
  return isGreaterOrEqual(version, getDate('cpip')) && isLower(version, getDate('vanilla-engine'));
}

export function isEngine3(version: Version): boolean {
  return isGreaterOrEqual(version, getDate('vanilla-engine'));
}

export function isAS3(version: Version): boolean {
  return isGreaterOrEqual(version, getDate('as3'));
}

export function isPreCpip(version: Version): boolean {
  return isLower(version, getDate('cpip'));
}

export function isPostCpip(version: Version): boolean {
  return isGreaterOrEqual(version, getDate('cpip'));
}