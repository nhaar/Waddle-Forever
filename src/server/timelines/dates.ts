import { UPDATES } from "../updates/updates";

export const START_DATE = UPDATES[0].date;


let stampsRelease: string | undefined = undefined;
for (let i = 0; i < UPDATES.length; i++) {
  const update = UPDATES[i];
  if (update.update.worldStamps !== undefined) {
    stampsRelease = update.date;
    break;
  }
}

if (stampsRelease === undefined) {
  throw new Error('Somehow, could not find world stamps');
}

export const STAMPS_RELEASE = stampsRelease;