import { iterateEntries } from "../../common/utils";
import { TimelineMap } from "../game-data";
import { PARTIES } from "../game-data/parties";
import { Update } from "../game-data/updates";
import { ITEMS } from "../game-logic/items";

/** Get price object for a blank state */
export function getPricesTimeline() {
  const timeline = new TimelineMap<number, number>();
  ITEMS.rows.forEach((item) => {
    timeline.add(item.id, item.cost, Update.CPIP_UPDATE);
  });

  PARTIES.forEach((party) => {
    if (party.prices !== undefined) {
      iterateEntries(party.prices, (id, cost) => {
        timeline.add(Number(id), cost, party.date, party.end);
      });
    }
  });

  return timeline.getVersionsMap();
}