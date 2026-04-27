import { iterateEntries } from "@common/utils";
import { GAMES } from "@server/game-data/games";
import { GameData } from "@server/timelines/game-data";
import { GAME_CRUMBS } from "../game-data/game-crumbs";

export function getGamesJson(d: GameData): string {
  const json = JSON.parse(JSON.stringify(GAME_CRUMBS))
  const music = d.getGamesMusic();

  iterateEntries(GAMES, (name) => {
    const id = music.get(name);
    if (id !== undefined) {
      if (name in json) {
        json[name as keyof typeof json].music_id = String(id);
      }
    }
  });

  return JSON.stringify(json);
}