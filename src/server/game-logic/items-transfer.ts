import { Version } from "@server/routes/versions";
import { UPDATES } from "@server/updates/updates";

const NINTENDO_ITEMS: Array<{ date: Version; items: number[]; }> = [];
export const IBITZ_ITEMS: number[] = [15365, 15364, 15363, 15366, 16198, 11699, 16199, 11700, 14953, 14954];

UPDATES.forEach(u => {
  if (u.update.nintendoItems !== undefined) {
    NINTENDO_ITEMS.push({
      date: u.date,
      items: [...u.update.nintendoItems]
    })
  }
});

export function getNintendoItems() {
  return NINTENDO_ITEMS;
}
