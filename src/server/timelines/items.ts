import { ItemType } from "@server/game-logic/items";
import { Version } from "@server/routes/versions";
import { EquipProp } from "@server/socket-server/world/world-penguin";
import { UPDATES } from "@server/updates/updates";

const itemsReleaseIndex: Array<[Version, Set<number>]> = [];

const added = new Set<number>();

UPDATES.forEach(u => {
  if (u.update.clothingCatalog !== undefined) {
    const newItems = new Set<number>();
    u.update.clothingCatalog.newItems.forEach(i => {
      if (!added.has(i)) {
        newItems.add(i);
        added.add(i);
      }
    });
    itemsReleaseIndex.push([u.date, newItems]);
  }
});

export function getItemTypeFromEquipProp(prop: EquipProp): ItemType {
  return {
    'color': ItemType.Color,
    'head': ItemType.Head,
    'face': ItemType.Face,
    'neck': ItemType.Neck,
    'body': ItemType.Body,
    'hand': ItemType.Hand,
    'feet': ItemType.Feet,
    'pin': ItemType.Pin,
    'background': ItemType.Background
  }[prop];
}
type NewCatalogIndex = Array<{
  readonly date: Version;
  readonly newItems: number[];
}>;

type OldCatalogIndex = Array<{
  readonly date: Version;
  readonly items: number[];
}>;

const CATALOG_ADDED_ITEMS_INDEX: NewCatalogIndex = [];
const CATALOG_INCLUDED_ITEMS_INDEX: OldCatalogIndex = [];

function buildCatalogIndex(newIndex: NewCatalogIndex, oldIndex: OldCatalogIndex): void {
  const included = new Set<number>();
  let sportCatalog: number[] = [];

  const addDelta = (newItems: number[], removed: number[]) => {
    newItems.forEach(i => {
      included.add(i);
    });
    removed.forEach(i => {
      included.delete(i);
    });
  }

  for (let i = 0; i < UPDATES.length; i++) {
    const { update, date } = UPDATES[i];
    let changed = false;
    if (update.clothingCatalog !== undefined) {
      changed = true;
      addDelta(update.clothingCatalog.newItems, update.clothingCatalog.removedItems);
    }
    if (update.sportCatalog !== undefined) {
      changed = true;
      sportCatalog.forEach(i => {
        included.delete(i);
      });
      sportCatalog = update.sportCatalog.items;
      sportCatalog.forEach(i => {
        included.add(i);
      });
    }
    if (update.martialArtworks !== undefined && typeof update.martialArtworks !== 'string') {
      changed = true;
      addDelta(update.martialArtworks.newItems, update.martialArtworks.removedItems);
    }
    if (update.gameUpgrades !== undefined) {
      changed = true;
      addDelta(update.gameUpgrades.newItems, update.gameUpgrades.removed);
    }
    if (update.eliteGearItems !== undefined) {
      changed = true;
      addDelta(update.eliteGearItems, []);
    }
    if (update.newspaperItems !== undefined) {
      changed = true;
      addDelta(update.newspaperItems.newItems, update.newspaperItems.removed);
    }
    if (update.postcardgiftItems !== undefined) {
      changed = true;
      addDelta(update.postcardgiftItems.newItems, update.postcardgiftItems.removed);
    }

    if (changed) {
      oldIndex.push({ date, items: [...included.values()] });
    }
  }

  for (let i = 0; i < oldIndex.length; i++) {
    const prev = new Set(i == 0 ? [] : oldIndex[i - 1].items);
    const newItems = oldIndex[i].items.filter(i => !prev.has(i));
    newIndex.push({ date: oldIndex[i].date, newItems });
  }
}

export function getAddedCatalogIndex(): NewCatalogIndex {
  return CATALOG_ADDED_ITEMS_INDEX;
}

export function getIncludedCatalogIndex(): OldCatalogIndex {
  return CATALOG_INCLUDED_ITEMS_INDEX;
}

buildCatalogIndex(CATALOG_ADDED_ITEMS_INDEX, CATALOG_INCLUDED_ITEMS_INDEX);
