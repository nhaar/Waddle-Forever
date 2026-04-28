import { iterateEntries } from "@common/utils";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { getChunkingMapJson } from "./chunking_map.json";
import getDependenciesJson from "./dependencies.json";
import { getEnvironmentDataXml } from "./environment_data.xml";
import { getGamesJson } from "./games.json";
import { getGameStrings } from "./game_strings.json";
import { getGeneralJson } from "./general.json";
import { getGlobalCrumbsSwf } from "./global_crumbs.swf";
import { getIglooMusicXml } from "./igloo_music.xml";
import { getLocalCrumbsSwf } from "./local_crumbs.swf";
import { getNewspapersJson } from "./newspapers.json";
import { getNewsCrumbsSwf } from "./news_crumbs.swf";
import { getPaperItemsJson } from "./paper_items.json";
import { getPathsJson } from "./paths.json";
import { getPenguinActionFramesJson } from "./penguin_action_frames.json";
import { getRoomsJson } from "./rooms.json";
import { getSetupXml } from "./setup.xml";
import getStageScriptMessagesJson from "./stage_script_messages.json";
import { getStampsJson } from "./stamps.json";
import { getStartscreenXML } from "./startscreen.xml";
import { getVersionTxt } from "./version.txt";
import { getWorldAchievementsXml } from "./worldachievements.xml";

export type FileGenerator = (d: GameData, s: SettingsManager) => Buffer | string;

const GENERATORS: Record<string, FileGenerator> = {
  'en/web_service/stamps.json': getStampsJson,
  'play/en/web_service/game_configs/stamps.json': getStampsJson,
  'play/en/web_service/game_configs/chunking_map.json': getChunkingMapJson,
  'play/en/web_service/game_configs/general.json': getGeneralJson,
  'play/v2/client/dependencies.json': getDependenciesJson,
  'play/v2/content/local/en/crumbs/local_crumbs.swf': getLocalCrumbsSwf,
  'play/en/web_service/game_configs/stage_script_messages.json': getStageScriptMessagesJson,
  'play/en/web_service/game_configs/paths.json': getPathsJson,
  'play/v2/content/global/crumbs/global_crumbs.swf': getGlobalCrumbsSwf,
  'play/en/web_service/game_configs/games.json': getGamesJson,
  'en/web_service/games.json': getGamesJson,
  'play/en/web_service/game_configs/paper_items.json': getPaperItemsJson,
  'play/en/web_service/game_configs/rooms.json': getRoomsJson,
  'setup.xml': getSetupXml,
  'play/v2/content/local/en/news/news_crumbs.swf': getNewsCrumbsSwf,
  'play/v2/content/local/en/login/startscreen.xml': getStartscreenXML,
  'playstart/xml/start_module_config.xml': getStartscreenXML,
  'web_service/worldachievements.xml': getWorldAchievementsXml,
  'play/v2/content/global/stampbook/world_stamps.xml': getWorldAchievementsXml,
  'play/en/web_service/game_configs/game_strings.json': getGameStrings,
  'play/en/web_service/game_configs/newspapers.json': getNewspapersJson,
  'play/en/web_service/game_configs/penguin_action_frames.json': getPenguinActionFramesJson,
  'version.txt': getVersionTxt,
  'play/web_service/environment_data.xml': getEnvironmentDataXml,
  'play/v2/content/global/en/igloo_music.xml': getIglooMusicXml
};

export function getGeneratorsMap(): Map<string, FileGenerator> {
  const map = new Map<string, FileGenerator>();
  iterateEntries(GENERATORS, (key, value) => map.set(key, value));
  return map;
}