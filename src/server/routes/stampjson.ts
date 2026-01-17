import { StampCategory, Stamp, Stampbook, ORIGINAL_STAMPBOOK } from "../game-data/stamps"
import { isLower, Version } from "./versions"
import { UPDATES } from '../updates/updates';
import { getDate } from '../timelines/dates';


type OriginalStamps = Record<string, Stamp>;

type OriginalStampbook = Record<string, Omit<StampCategory, 'stamps'> & { stamps: OriginalStamps }>;

function getOriginalStampbookJson(stampbook: Stampbook): string {
  const json: OriginalStampbook = {};
  stampbook.forEach(category => {
    const stamps: OriginalStamps = {};
    category.stamps.forEach((stamp) => {
      stamps[String(stamp.stamp_id)] = stamp;
    });
    json[String(category.group_id)] = {
      ...category,
      stamps: stamps
    }
  });
  return JSON.stringify(json);
}

export function getStampbook(version: Version): Stampbook {
  if (isLower(version, getDate('stamps-release'))) {
    return []
  }
  
  const newStampbook = JSON.parse(JSON.stringify(ORIGINAL_STAMPBOOK)) as Stampbook

  for (let i = 0; i < UPDATES.length; i++) {
    const update = UPDATES[i];
    if (isLower(version, update.date)) {
      break;
    }

    if (update.update.stampUpdates !== undefined) {
      update.update.stampUpdates.forEach(u => {
        if ('category' in u) {
          newStampbook.push(u.category);
        } else {
          for (let i = 0; i < newStampbook.length; i++) {
            if (newStampbook[i].group_id === u.categoryId) {
              newStampbook[i].stamps.push(...u.stamps);
              break;
            }
          }
        }
      });
    }
  }

  return newStampbook;
}

export function getStampsJson(version: Version) : string {
  const stampbook = getStampbook(version);

  if (isLower(version, getDate('vanilla-engine'))) {
    return getOriginalStampbookJson(stampbook);
  }
  return JSON.stringify(stampbook)
}