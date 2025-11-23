import { Pin, PINS } from "../game-data/pins";
import { addDays, Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export const PIN_TIMELINE: Array<Pin & { date: Version; end: Version; }> = [];

let version = '';
for (let i = 0; i < UPDATES.length; i++) {
  if (UPDATES[i].update.pin !== undefined) {
    version = UPDATES[i].date;
  }
}
PINS.forEach((pin) => {
  const next = addDays(version, 14);
  PIN_TIMELINE.push({
    date: version,
    end: next,
    ...pin
  });
  version = next;
});