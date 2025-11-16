

import { findInVersion } from "../game-data";
import { getHuntTimeline } from "../timelines/crumbs";
import { getFairTimeline } from "../timelines/fair";
import { getMapNoteTimeline } from "../timelines/map-note";
import { getMigratorTimeline } from "../timelines/migrator";
import { Version } from "./versions";

const mapNoteTimeline = getMapNoteTimeline();
const migratorTimeline = getMigratorTimeline();
const huntTimeline = getHuntTimeline();
const fairTimeline = getFairTimeline();

export function getGeneralJson(version: Version): string {
  const hunt = findInVersion(version, huntTimeline);
  const fair = findInVersion(version, fairTimeline);

  return JSON.stringify({ "mascot_options": { "migrator_active": findInVersion(version, migratorTimeline) }, "party_options": { "fair_ticket_active": fair, "hunt_active": hunt !== null || fair, "itemRewardID": hunt?.global.reward ?? 0, "isMapNoteActive": findInVersion(version, mapNoteTimeline), "showPartyAnnouncement": false, "party_icon_active": false }, "igloo_options": { "contestRunning": false }, "oops_test": { "testEnabled": true }, "island_options": { "isDaytime": true }, "party_dates": { "20170201": "2017-01-30" } })
}