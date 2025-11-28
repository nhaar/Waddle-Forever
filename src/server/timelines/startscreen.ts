import { VersionsTimeline } from "../game-data";
import { UPDATES } from "../updates/updates";

export function getStartscreenTimeline() {
  const timeline = new VersionsTimeline<string[]>();

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

  return timeline.getVersions();
}