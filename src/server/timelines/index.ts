import { findInVersion, VersionsMap, VersionsTimeline, VersionsInformation } from "../game-data";
import { Version } from "../routes/versions";

export function getMapForDate<Key extends string | number, Value>(map: VersionsMap<Key, Value>, date: Version): Partial<Record<Key, Value>> {
  const dateMap: Partial<Record<Key, Value>> = {};
  map.forEach((versions, key) => {
    dateMap[key] = findInVersion(date, versions);
  });
  return dateMap;
}

export function newVersionsTimeline<T>(callback: (timeline: VersionsTimeline<T>) => void): VersionsInformation<T> {
  const timeline = new VersionsTimeline<T>();
  callback(timeline);
  return timeline.getVersions();
}