import { findInVersion } from "../game-data";
import { STAGE_TIMELINE } from "../timelines/stage";
import { Version } from "./versions";

export default function getStageScriptMessagesJson(version: Version) {
  const script = findInVersion(version, STAGE_TIMELINE) ?? [];

  if (script.length === 0) {
    return JSON.stringify([{"note":"STAGE SCRIPT NOT ADDED"}])
  }

  return JSON.stringify(script);
}