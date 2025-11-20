import { isGreaterOrEqual, isLower, Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export const START_DATE = UPDATES[0].date;

let stampsRelease: string | undefined = undefined;
let modernAs3: string | undefined = undefined;
let as3: string | undefined = undefined;
let cpip: string | undefined = undefined;
let startscreen: string | undefined = undefined;
let igloo: string | undefined = undefined;

for (let i = 0; i < UPDATES.length; i++) {
  const update = UPDATES[i];
  if (stampsRelease === undefined && update.update.worldStamps !== undefined) {
    stampsRelease = update.date;
  } else {
    switch (update.update.engineUpdate) {
      case 'vanilla-engine':
        modernAs3 = update.date;
        break;
      case 'as3':
        as3 = update.date;
        break;
      case 'igloo-music':
        igloo = update.date;
        break;
      case 'as3-startscreen':
        startscreen = update.date;
        break;
      case 'cpip':
        cpip = update.date;
        break;
    }
  }
}

if (stampsRelease === undefined || modernAs3 === undefined || as3 === undefined || cpip === undefined || startscreen === undefined || igloo === undefined) {
  throw new Error('Somehow, could not find a date');
}

export const STAMPS_RELEASE = stampsRelease;
export const MODERN_AS3 = modernAs3;
export const PLACEHOLDER_AS3 = '2016-01-01';
export const AS3_UPDATE = as3;
export const CPIP_UPDATE = cpip;
export const AS3_STARTSCREEN = startscreen;
export const IGLOO_MUSIC_RELEASE = igloo;

export function isEngine1(version: Version): boolean {
  return isLower(version, CPIP_UPDATE)
}

export function isEngine2(version: Version): boolean {
  return isGreaterOrEqual(version, CPIP_UPDATE) && isLower(version, MODERN_AS3);
}

export function isEngine3(version: Version): boolean {
  return isGreaterOrEqual(version, MODERN_AS3);
}