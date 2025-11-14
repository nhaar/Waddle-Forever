import { findInVersion } from "../game-data";
import { getStageScriptTimeline } from "../timelines/crumbs";
import { Version } from "./versions";

const stageTimeline = getStageScriptTimeline();

export default function getStageScriptMessagesJson(version: Version) {
  const script = findInVersion(version, stageTimeline) ?? [];

  if (script.length === 0) {
    return JSON.stringify([{"note":"STAGE SCRIPT NOT ADDED"}])
  }

  return JSON.stringify(script);
}