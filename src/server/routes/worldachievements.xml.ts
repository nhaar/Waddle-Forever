import { WORLD_STAMPS_TIMELINE } from "../timelines/worldstamps";
import { AchievementCode, WorldStamp } from "../updates";
import { isGreaterOrEqual, isLower, Version } from "./versions";

type WorldAchievements = Array<AchievementCode & {
  stamp: number;
  subId?: number;
  name: string;
}>;

class WorldAchievementsXml {
  private _worldAchievements: WorldAchievements = [];

  addWorldStamps(stamps: WorldStamp[]) {
    stamps.forEach(stamp => {
      stamp.declarations.forEach((declaration, i) => {
        this._worldAchievements.push({
          stamp: stamp.id,
          name: stamp.name,
          subId: stamp.declarations.length > 1 ? i : undefined,
          conditions: declaration.conditions,
          event: declaration.event,
          optionalConditions: declaration.optionalConditions
        })
      });
    });
    
  }

  serialize(): string {
    return `<achievementDocument>
      ${this._worldAchievements.map(a => {
        return `<achievement name="${a.name}" id="${a.stamp}${a.subId === undefined ? '' : `.${a.subId}`}">
      <event>${a.event}</event>
      ${a.conditions.map(c => {
        return `<condition>${c}</condition>`
      }).join('\n')}
      ${a.optionalConditions?.map(c => {
        return `<optionalCondition>${c}</optionalCondition>`
      })?.join('\n') ?? ''}
      <result>stampEarned ${a.stamp}</result>
    </achievement>`
      }).join('\n')}
    </achievementDocument>`;
  }
}

export function getWorldAchievementsXml(version: Version): string {
  const worldAchievements = new WorldAchievementsXml();

  WORLD_STAMPS_TIMELINE.forEach(update => {
    if (isGreaterOrEqual(version, update.start) && (update.end === undefined || isLower(version, update.end))) {
      worldAchievements.addWorldStamps(update.stamps);
    }
  });

  return worldAchievements.serialize();
}