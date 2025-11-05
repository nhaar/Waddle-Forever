

import { findInVersion } from "../game-data";
import { getHuntTimeline } from "../timelines/crumbs";
import { getMapNoteTimeline } from "../timelines/map-note";
import { getMigratorTimeline } from "../timelines/migrator";
import { Version } from "./versions";

const mapNoteTimeline = getMapNoteTimeline();
const migratorTimeline = getMigratorTimeline();
const huntTimeline = getHuntTimeline();

export function getGeneralJson(version: Version): string {
  const hunt = findInVersion(version, huntTimeline);

  return JSON.stringify({ "mascot_options": { "migrator_active": findInVersion(version, migratorTimeline) }, "party_options": { "fair_ticket_active": false, "hunt_active": hunt !== null, "itemRewardID": hunt?.global.reward ?? 0, "isMapNoteActive": findInVersion(version, mapNoteTimeline), "showPartyAnnouncement": false, "party_icon_active": false }, "igloo_options": { "contestRunning": false }, "oops_test": { "testEnabled": true }, "island_options": { "isDaytime": true }, "party_dates": { "20170201": "2017-01-30" } })
}