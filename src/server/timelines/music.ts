import { iterateEntries } from "../../common/utils";
import { TimelineMap } from "../game-data";
import { RoomMap, RoomName, ROOMS } from "../game-data/rooms";
import { STAGE_PLAYS } from "../game-data/stage-plays";
import { Update } from "../game-data/updates";
import { Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export function getMusicTimeline() {
  const timeline = new TimelineMap<RoomName, number>();

  const addMusic = (music: RoomMap<number>, start: Version, end: Version | undefined = undefined) => {
    iterateEntries(music, (room, musicId) => {
      timeline.add(room, musicId, start, end);
    });
  }

  Object.keys(ROOMS).forEach((room) => {
    timeline.add(room as RoomName, 0, Update.BETA_RELEASE);
  });
  
  UPDATES.forEach(update => {
    if (update.update.music !== undefined) {
      addMusic(update.update.music, update.date, update.end);
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

  return timeline.getVersionsMap();
}