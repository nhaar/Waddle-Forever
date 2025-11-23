import fs from 'fs';
import path from 'path';

import { getMediaFilePath } from "../game-data/files"
import { StampCategory, Stamp, Stampbook, ORIGINAL_STAMPBOOK } from "../game-data/stamps"
import { isGreaterOrEqual, isLower, Version } from "./versions"
import { MEDIA_DIRECTORY } from '../../common/utils';
import { UPDATES } from '../updates/updates';
import { MODERN_AS3, PLACEHOLDER_AS3, STAMPS_RELEASE } from '../timelines/dates';


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
  if (isLower(version, STAMPS_RELEASE)) {
    return []
  } else if (isGreaterOrEqual(version, PLACEHOLDER_AS3)) {
    // placeholder until the timeline is complete
    return JSON.parse(fs.readFileSync(path.join(MEDIA_DIRECTORY, getMediaFilePath('approximation:game_configs/stamps.json')), { encoding: 'utf-8' })) as Stampbook;
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

  if (isLower(version, MODERN_AS3)) {
    return getOriginalStampbookJson(stampbook);
  }
  return JSON.stringify(stampbook)
}