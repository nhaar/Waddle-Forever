import { newVersionsTimeline } from ".";
import { UPDATES } from "../updates/updates";

export const START_SCREEN_TIMELINE = newVersionsTimeline<string[]>(timeline => {
const addTimeline = (screens: Array<string | [string, string]>, date: string, end?: string) => {
    const resolvedScreens = screens.map((screen, i) => {
      if (typeof screen === 'string') {
        return `background${i}.swf`;
      } else {
        return screen[0];
      }
    });

    if (end === undefined) {
      timeline.add({ date, info: resolvedScreens });
    } else {
      timeline.add({ date, end, info: resolvedScreens });
    }
  }

  UPDATES.forEach(update => {
    if (update.update.startscreens !== undefined) {
      addTimeline(update.update.startscreens, update.date, update.end);
    }
  });
})