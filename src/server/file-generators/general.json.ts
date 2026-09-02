import { GameData } from "@server/timelines/game-data";

export function getGeneralJson(d: GameData): string {
  const hunt = d.getHunt();
  const fair = d.getFair();
  return JSON.stringify({
    "mascot_options": {
      "migrator_active": d.getMigrator()
    },
    "party_options": {
      "fair_ticket_active": d.getFair(),
      "hunt_active": hunt !== null || fair || d.getPartyIcon(),
      "itemRewardID": hunt?.global.reward ?? 0,
      "isMapNoteActive": d.getMapNote(),
      "showPartyAnnouncement": false, "party_icon_active": false,
      unlockedDay: d.getUnlockedDay()
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