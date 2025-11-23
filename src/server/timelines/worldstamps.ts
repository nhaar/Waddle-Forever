import { Version } from "../routes/versions";
import { WorldStamp } from "../updates";
import { UPDATES } from "../updates/updates";

export const WORLD_STAMPS_TIMELINE: Array<{
  stamps: WorldStamp[],
  start: Version,
  end?: Version
}> = [];

UPDATES.forEach(update => {
  if (update.update.worldStamps !== undefined) {
    const day = {
      start: update.date,
      stamps: update.update.worldStamps
    };
    if (update.end === undefined) {
      WORLD_STAMPS_TIMELINE.push(day);
    } else {
      WORLD_STAMPS_TIMELINE.push({
        ...day,
        end: update.end
      });
    }
  }
});