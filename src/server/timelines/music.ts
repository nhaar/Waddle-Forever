import { newTimelineMap } from ".";
import { addRecordToMap, TimelineMap } from "../game-data";
import { RoomName, ROOMS } from "../game-data/rooms";
import { STAGE_PLAYS } from "../game-data/stage-plays";
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
      const name = update.update.stagePlay.name;
      const musicId = STAGE_PLAYS.find((stage) => stage.name === name)?.musicId ?? 0;
      timeline.add('stage', musicId, update.date);
      if (name === 'Norman Swarm Has Been Transformed') {
        timeline.add('party1', musicId, update.date);
      }
    }
  });
});