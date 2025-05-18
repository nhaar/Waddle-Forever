import { PRE_CPIP_CATALOGS } from "../game-data/catalogues";
import { VersionsTimeline } from "../game-data";
import { processVersion, Version } from "../routes/versions";

export function getFileDateSignature(date: Version): string {
  const decomposed = processVersion(date);
  if (decomposed === undefined) {
    throw new Error(`Invalid version: ${date}`);
  }
  const [year, month] = decomposed;
  // the last 2 numbers of year, and month with a 0 on front if needed
  return `${String(year).slice(2)}${String(month).padStart(2, '0')}`;
}

export function getClothingTimeline() {
  const timeline = new VersionsTimeline<string>();
  Object.keys(PRE_CPIP_CATALOGS).forEach((date) => {
    const signature = getFileDateSignature(date);
    timeline.add({
      date,
      info: signature
    });
  });

  return timeline.getVersions();
}