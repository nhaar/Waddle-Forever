import { TimelineMap } from "../game-data";
import { ORIGINAL_STAMPBOOK, StampCategory, StampRoom, STAMP_ROOMS } from "../game-data/stamps";
import { Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

export const STAMP_DATES: Record<number, Version> = {};

const timeline = new TimelineMap<StampRoom, number[]>();

export const GAME_STAMPS: Record<StampRoom, number[]> = {
  [StampRoom.AstroBarrier]: [],
  [StampRoom.IceFishing]: [],
  [StampRoom.CartSurfer]: [],
  [StampRoom.JetPackAdventure]: [],
  [StampRoom.ThinIce]: [],
  [StampRoom.Pizzatron]: [],
  [StampRoom.CatchinWaves]: [],
  [StampRoom.AquaGrabber]: [],
  [StampRoom.PuffleRescue]: [],
  [StampRoom.SystemDefender]: [],
  [StampRoom.PuffleLaunch]: [],
  [StampRoom.PuffleScape]: [],
  [StampRoom.CardJitsu]: []
}

let first = true;

function addCategory(category: StampCategory, date: Version) {
  const stampRoom = STAMP_ROOMS[category.group_id];
  if (stampRoom !== undefined) {
    GAME_STAMPS[stampRoom] = category.stamps.map(s => s.stamp_id);
    timeline.add(stampRoom, [...GAME_STAMPS[stampRoom]], date);
  }
  category.stamps.forEach(stamp => {
    STAMP_DATES[stamp.stamp_id] = date;
  });
}

for (let i = 0; i < UPDATES.length; i++) {
  const update = UPDATES[i];

  // original stamps
  if (first && update.update.worldStamps !== undefined) {
    ORIGINAL_STAMPBOOK.forEach(category => {
      addCategory(category, update.date);
    });
    first = false;
  }

  if (update.update.stampUpdates !== undefined) {
    update.update.stampUpdates.forEach(stampUpdate => {
      if ('category' in stampUpdate) {
        addCategory(stampUpdate.category, update.date);
      } else {
        const stampRoom = STAMP_ROOMS[stampUpdate.categoryId];
        if (stampRoom !== undefined) {
          stampUpdate.stamps.forEach(stamp => GAME_STAMPS[stampRoom].push(stamp.stamp_id));
          timeline.add(stampRoom, [...GAME_STAMPS[stampRoom]], update.date);
        }
        stampUpdate.stamps.forEach(stamp => {
          STAMP_DATES[stamp.stamp_id] = update.date;
        });
      }
    });
  }
}

export const GAME_STAMPS_TIMELINE = timeline.getVersionsMap()