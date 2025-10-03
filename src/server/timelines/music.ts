import { getSubUpdateDates } from ".";
import { iterateEntries } from "../../common/utils";
import { TimelineMap } from "../game-data";
import { PARTIES } from "../game-data/parties";
import { ROOM_MUSIC_TIMELINE } from "../game-data/room-updates";
import { RoomMap, RoomName, ROOMS } from "../game-data/rooms";
import { STAGE_PLAYS, STAGE_TIMELINE } from "../game-data/stage-plays";
import { STANDALONE_UPDATES } from "../game-data/standalone-changes";
import { Update } from "../game-data/updates";
import { Version } from "../routes/versions";

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

  STAGE_TIMELINE.forEach((debut) => {
    const musicId = STAGE_PLAYS.find((stage) => stage.name === debut.name)?.musicId ?? 0;
    timeline.add('stage', musicId, debut.date);
  });

  PARTIES.forEach((party) => {
    if (party.music !== undefined) {
      addMusic(party.music, party.date, party.end);
    }
    party.updates?.forEach((update, i) => {
      if (update.music !== undefined) {
        const dates = getSubUpdateDates(party, i);
        addMusic(update.music, dates.date, dates.end);
      }
    })
  })

  STANDALONE_UPDATES.forEach((update) => {
    if (update.music !== undefined) {
      addMusic(update.music, update.date);
    }
  });

  return timeline.getVersionsMap();
}