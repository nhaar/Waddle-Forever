

import { findInVersion } from "../game-data";
import { getHuntTimeline } from "../timelines/crumbs";
import { FAIR_TIMELINE } from "../timelines/fair";
import { MAP_NOTE_TIMELINE } from "../timelines/map-note";
import { MIGRATOR_TIMELINE } from "../timelines/migrator";
import { Version } from "./versions";

const huntTimeline = getHuntTimeline();
export function getGeneralJson(version: Version): string {
  const hunt = findInVersion(version, huntTimeline);
  const fair = findInVersion(version, FAIR_TIMELINE);

  return JSON.stringify({ "mascot_options": { "migrator_active": findInVersion(version, MIGRATOR_TIMELINE) }, "party_options": { "fair_ticket_active": fair, "hunt_active": hunt !== null || fair, "itemRewardID": hunt?.global.reward ?? 0, "isMapNoteActive": findInVersion(version, MAP_NOTE_TIMELINE), "showPartyAnnouncement": false, "party_icon_active": false }, "igloo_options": { "contestRunning": false }, "oops_test": { "testEnabled": true }, "island_options": { "isDaytime": true }, "party_dates": { "20170201": "2017-01-30" } })
}