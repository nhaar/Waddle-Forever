import { newVersionsTimeline } from ".";
import { StageScript } from "../game-data/stage-plays";
import { UPDATES } from "../updates/updates";

export const STAGE_TIMELINE = newVersionsTimeline<StageScript>(timeline => {
  const scripts = new Map<string, StageScript>();
  UPDATES.forEach((update) => {
    if (update.update.stagePlay !== undefined) {
      let script = scripts.get(update.update.stagePlay.name);
      if (script === undefined) {
        script = update.update.stagePlay.script ?? []
        scripts.set(update.update.stagePlay.name, script);
      } else {
        if (update.update.stagePlay.script !== undefined) {
          script = update.update.stagePlay.script;
          scripts.set(update.update.stagePlay.name, script);
        }
      }

      timeline.add({
        date: update.date,
        info: script
      });
    }
    if (update.update.playScript !== undefined) {
      timeline.addInfo(update.update.playScript, update.date, update.end);
    }
  });
})