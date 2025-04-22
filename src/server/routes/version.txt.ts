import { BETA_RELEASE, CAVE_OPENING_START, EGG_HUNT_2006_START, PRE_CPIP_REWRITE_DATE, WINTER_FIESTA_08_START } from "../data/updates";
import { findEarliestDateHitIndex } from "./client-files";

/** Map date and the version number it started using */
const VERSIONS: Record<string, number> = {
  [BETA_RELEASE]: 291,
  [EGG_HUNT_2006_START]: 299,
  [CAVE_OPENING_START]: 339,
  [PRE_CPIP_REWRITE_DATE]: 506,
  // no clue what the 604 features are yet,
  // this was added to fix a bug that wasn't a bug
  // so now I'm just leaving 604 here
  [WINTER_FIESTA_08_START]: 604
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