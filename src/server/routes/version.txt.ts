import { BETA_RELEASE, EGG_HUNT_2006_START } from "../data/updates";
import { findEarliestDateHitIndex } from "./client-files";

/** Map date and the version number it started using */
const VERSIONS: Record<string, number> = {
  [BETA_RELEASE]: 291,
  [EGG_HUNT_2006_START]: 299
};

/** Get the version.txt file used in preCPIP */
export function getVersionTxt(date: string): string {
  const versionsArray = Object.entries(VERSIONS).map((pair) => {
    const [date, version] = pair;
    return {
      date,
      version
    };
  });
  const index = findEarliestDateHitIndex(date, versionsArray);
  const version = versionsArray[index].version;
  return `&v=${version}\n`;
}