import { VersionsTimeline } from "../game-data";
import { PARTIES } from "../game-data/parties";
import { STANDALONE_UPDATES } from "../game-data/standalone-changes";

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

  STANDALONE_UPDATES.forEach((update) => {
    if (update.startscreens !== undefined) {
      addTimeline(update.startscreens, update.date);
    }
  });

  PARTIES.forEach((party) => {
    if (party.startscreens !== undefined) {
      addTimeline(party.startscreens, party.date, party.end);
    }
  });

  return timeline.getVersions();
}