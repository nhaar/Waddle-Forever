import { Stamp, Stampbook, StampCategory } from "@server/game-data/stamps";
import { isLower } from "@server/routes/versions";
import { getDate } from "@server/timelines/dates";
import { GameData } from "@server/timelines/game-data";

type OriginalStampbook = Record<string, Omit<StampCategory, 'stamps'> & { stamps: OriginalStamps }>;
type OriginalStamps = Record<string, Stamp>;

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

export function getStampsJson(d: GameData) : string {
  const stampbook = d.getStampbook();

  if (isLower(d.getDate(), getDate('vanilla-engine'))) {
    return getOriginalStampbookJson(stampbook);
  }
  return JSON.stringify(stampbook)
}