import { Pin, PINS } from "../game-data/pins";
import { addDays, isLower, Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export const PIN_TIMELINE: Array<Pin & { date: Version; end: Version; }> = [];

let pinIndex = 0;
let version = '';
let inPeriod = false;

function pushPin() {
  const pin = PINS[pinIndex];
  const next = addDays(version, 14);
  if (Array.isArray(pin)) {
    pin.forEach(p => {
      PIN_TIMELINE.push({
        date: version,
        end: next,
        ...p
      });
    })
  } else {
    PIN_TIMELINE.push({
      date: version,
      end: next,
      ...pin
    });
  }
  version = next;
  pinIndex++;
  if (pinIndex >= PINS.length) {
    inPeriod = false;
  }
}

for (let i = 0; i < UPDATES.length; i++) {
  if (inPeriod) {
    while (isLower(version, UPDATES[i].date) && inPeriod) {
      pushPin();
    }
  }
  if (UPDATES[i].update.pin !== undefined) {
    switch (UPDATES[i].update.pin) {
      case 'start':
        version = UPDATES[i].date;
        inPeriod = true;
        pushPin();
        break;
      case 'end':
        pushPin();
        inPeriod = false;
        break;
    }
  }
}