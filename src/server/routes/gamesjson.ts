import { iterateEntries } from "../../common/utils";
import { GAME_CRUMBS } from "../game-data/game-crumbs";
import { GAMES } from "../game-data/games";
import { getMapForDate } from "../timelines";
import { GAME_MUSIC_TIMELINE } from "../timelines/music";
import { Version } from "./versions";

export function getGamesJson(version: Version): string {
  const json = JSON.parse(JSON.stringify(GAME_CRUMBS))

  const music = getMapForDate(GAME_MUSIC_TIMELINE, version);

  iterateEntries(GAMES, (name, gameId) => {
    if (music[name] !== undefined) {
      if (name in json) {
        const musicId = music[name]
        if (typeof musicId === 'number') {
          json[name as keyof typeof json].music_id = String(musicId);
        } 
      }
    }
  });

  return JSON.stringify(json);
}