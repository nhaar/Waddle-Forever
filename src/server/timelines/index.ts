import { findInVersion, TemporaryUpdate, VersionsMap } from "../game-data";
import { Version } from "../routes/versions";

export function getMapForDate<Key extends string | number, Value>(map: VersionsMap<Key, Value>, date: Version): Partial<Record<Key, Value>> {
  const dateMap: Partial<Record<Key, Value>> = {};
  map.forEach((versions, key) => {
    dateMap[key] = findInVersion(date, versions);
  });
  return dateMap;
}

export function getSubUpdateDates<UpdateInfo, SubUpdateInfo>(update: TemporaryUpdate<UpdateInfo, SubUpdateInfo>, index: number) {
  if (update.updates === undefined) {
    throw new Error('Update must have subupdates');
  }
  const subUpdate = update.updates[index];
  let end = subUpdate.end;

  if (end === undefined) {
    const next = update.updates[index + 1];
    if (next !== undefined && next.date !== undefined) {
      end = next.date;
    }
  }
  if (end === undefined || end === null) {
    end = update.end;
  }

  return { date: subUpdate.date ?? update.date, end };
}