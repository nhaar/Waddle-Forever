import { JsonDatabase } from "@server/database"
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { PenguinMessenger } from "../world/world-client";

export type LoginContext = {
  db: JsonDatabase;
  settings: SettingsManager;
  data: GameData;
  messenger: PenguinMessenger;
}