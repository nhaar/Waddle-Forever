import { GameData } from "@server/timelines/game-data";

export default function getStageScriptMessagesJson(d: GameData) {
  const script = d.getStageScript();

  if (script.length === 0) {
    return JSON.stringify([{"note":"STAGE SCRIPT NOT ADDED"}])
  }

  return JSON.stringify(script);
}