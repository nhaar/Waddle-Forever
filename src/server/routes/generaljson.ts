

import { PARTY_ANNOUNCEMENT_TIMELINE } from "@server/timelines/party-announcement";
import { findInVersion } from "../game-data";
import { HUNT_TIMELINE } from "../timelines/crumbs";
import { FAIR_TIMELINE } from "../timelines/fair";
import { MAP_NOTE_TIMELINE } from "../timelines/map-note";
import { MIGRATOR_TIMELINE } from "../timelines/migrator";
import { PARTY_ICON_TIMELINE } from "../timelines/party-icon";
import { UNLOCKED_DAY_TIMELINE } from "../timelines/unlocked-day";
import { Version } from "./versions";

export function getGeneralJson(version: Version): string {
  const hunt = findInVersion(version, HUNT_TIMELINE);
  const fair = findInVersion(version, FAIR_TIMELINE);
  const partyIcon = findInVersion(version, PARTY_ICON_TIMELINE);
  const partyAnnouncement = findInVersion(version, PARTY_ANNOUNCEMENT_TIMELINE) !== null;

  return JSON.stringify({
    "mascot_options": {
      "migrator_active": findInVersion(version, MIGRATOR_TIMELINE)
    },
    "party_options": {
      "fair_ticket_active": fair,
      "hunt_active": hunt !== null || fair || partyIcon,
      "itemRewardID": hunt?.global.reward ?? 0,
      "isMapNoteActive": findInVersion(version, MAP_NOTE_TIMELINE),
      "showPartyAnnouncement": partyAnnouncement, "party_icon_active": false,
      unlockedDay: findInVersion(version, UNLOCKED_DAY_TIMELINE)
    },
    "igloo_options": {
      "contestRunning": false
    },
    "oops_test": {
      "testEnabled": true
    },
    "island_options": {
      "isDaytime": true
    },
    "party_dates": {
      "20170201": "2017-01-30"
    }
  })
}