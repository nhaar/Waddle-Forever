import { getSubUpdateDates } from ".";
import { iterateEntries } from "../../common/utils";
import { TimelineMap } from "../game-data";
import { ROOM_MUSIC_TIMELINE } from "../game-data/room-updates";
import { RoomMap, RoomName, ROOMS } from "../game-data/rooms";
import { STAGE_PLAYS, STAGE_TIMELINE } from "../game-data/stage-plays";
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
    
  // regular room IDs
  iterateEntries(ROOM_MUSIC_TIMELINE, (room, musicTimeline) => {
    const [firstSong, ...otherSongs] = musicTimeline;
    timeline.add(room, firstSong, Update.BETA_RELEASE);
    otherSongs.forEach((song) => {
      timeline.add(room, song.musicId, song.date);
    });
  });

  STAGE_TIMELINE.forEach((debut, i) => {
    const musicId = STAGE_PLAYS.find((stage) => stage.name === debut.name)?.musicId ?? 0;
    timeline.add('stage', musicId, debut.date);
    if (debut.musicRooms !== undefined) {
      const end = i === STAGE_TIMELINE.length - 1 ? undefined : STAGE_TIMELINE[i + 1].date;
      debut.musicRooms.forEach(room => {
        timeline.add(room, musicId, debut.date, end);
      });
    }
  });

  UPDATES.forEach(update => {
    if (update.update.music !== undefined) {
      addMusic(update.update.music, update.date, update.end);
    }
  });

  return timeline.getVersionsMap();
}