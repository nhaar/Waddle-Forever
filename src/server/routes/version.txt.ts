import { BETA_RELEASE, CAVE_OPENING_START, EGG_HUNT_2006_END, EGG_HUNT_2006_START, FIRST_STAGE_PLAY, PRE_CPIP_REWRITE_DATE, WINTER_FIESTA_08_START } from "../data/updates";
import { findEarliestDateHitIndex } from "./client-files";

/** Map date and the version number it started using */
const VERSIONS: Record<string, number> = {
  [BETA_RELEASE]: 291,
  [EGG_HUNT_2006_START]: 299,
  [EGG_HUNT_2006_END]: 339,
  [PRE_CPIP_REWRITE_DATE]: 506,
  // added 604 because it has the stage, though have no idea of where it is from yet
  [FIRST_STAGE_PLAY]: 604
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