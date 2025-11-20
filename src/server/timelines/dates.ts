import { Update } from "../game-data/updates";
import { isGreaterOrEqual, isLower, Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export const START_DATE = UPDATES[0].date;

let stampsRelease: string | undefined = undefined;
let modernAs3: string | undefined = undefined;
let as3: string | undefined = undefined;

for (let i = 0; i < UPDATES.length; i++) {
  const update = UPDATES[i];
  if (stampsRelease === undefined && update.update.worldStamps !== undefined) {
    stampsRelease = update.date;
  } else if (update.update.engineUpdate === 'vanilla-engine') {
    modernAs3 = update.date;
  } else if (update.update.engineUpdate === 'as3') {
    as3 = update.date;
  }
}

if (stampsRelease === undefined || modernAs3 === undefined || as3 === undefined) {
  throw new Error('Somehow, could not find a date');
}

export const STAMPS_RELEASE = stampsRelease;
export const MODERN_AS3 = modernAs3;
export const PLACEHOLDER_AS3 = '2016-01-01';
export const AS3_UPDATE = as3;

export function isEngine1(version: Version): boolean {
  return isLower(version, Update.CPIP_UPDATE)
}

export function isEngine2(version: Version): boolean {
  return isGreaterOrEqual(version, Update.CPIP_UPDATE) && isLower(version, MODERN_AS3);
}

export function isEngine3(version: Version): boolean {
  return isGreaterOrEqual(version, MODERN_AS3);
}