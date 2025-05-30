import { findInVersion, VersionsTimeline } from "../game-data/changes";
import { BETA_RELEASE, CHAT_339, EGG_HUNT_2006_START, FIRST_STAGE_PLAY, PRE_CPIP_REWRITE_DATE } from "../game-data/updates";

/** Map date and the version number it started using */
const VERSIONS: Record<string, number> = {
  [BETA_RELEASE]: 291,
  [EGG_HUNT_2006_START]: 299,
  [CHAT_339]: 339,
  [PRE_CPIP_REWRITE_DATE]: 506,
  // added 604 because it has the stage, though have no idea of where it is from yet
  [FIRST_STAGE_PLAY]: 604
};

export function getVersionsTimeline() {
  const versionTimeline = new VersionsTimeline<number>();
  versionTimeline.addDateMap(VERSIONS);

  return versionTimeline.getVersions();
}

const versionsTimeline = getVersionsTimeline();

/** Get the version.txt file used in preCPIP */
export function getVersionTxt(date: string): string {
  const version = findInVersion(date, versionsTimeline);
  return `&v=${version}\n`;
}