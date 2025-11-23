import { newTimelineMap } from ".";
import { addRecordToMap } from "../game-data";
import { RoomName, ROOMS } from "../game-data/rooms";
import { getStagePlayMusic } from "../game-data/stage-plays";
import { UPDATES } from "../updates/updates";
import { START_DATE } from "./dates";

export const MUSIC_TIMELINE = newTimelineMap<RoomName, number>(timeline => {
  Object.keys(ROOMS).forEach((room) => {
    timeline.add(room as RoomName, 0, START_DATE);
  });
  
  UPDATES.forEach(update => {
    if (update.update.music !== undefined) {
      addRecordToMap(timeline, update.update.music, update.date, update.end);
    }
    if (update.update.stagePlay !== undefined) {
      timeline.add('stage', getStagePlayMusic(update.update.stagePlay.name), update.date);
    }
  });
});