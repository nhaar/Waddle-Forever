import { Version } from "@server/routes/versions";
import { UPDATES } from "@server/updates/updates";

const NINTENDO_ITEMS: Array<{ date: Version; items: number[]; }> = [];
export const IBITZ_ITEMS: number[] = [];

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
