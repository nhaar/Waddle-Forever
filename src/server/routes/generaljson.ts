

import { findInVersion } from "../game-data";
import { getMapNoteTimeline } from "../timelines/map-note";
import { Version } from "./versions";

const mapNoteTimeline = getMapNoteTimeline();

export function getGeneralJson(version: Version): string {
  return JSON.stringify({ "mascot_options": { "migrator_active": false }, "party_options": { "fair_ticket_active": false, "hunt_active": false, "itemRewardID": 1388, "isMapNoteActive": findInVersion(version, mapNoteTimeline), "showPartyAnnouncement": false, "party_icon_active": false }, "igloo_options": { "contestRunning": false }, "oops_test": { "testEnabled": true }, "island_options": { "isDaytime": true }, "party_dates": { "20170201": "2017-01-30" } })
}