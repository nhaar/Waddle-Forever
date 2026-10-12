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
  readonly start: Version;
  readonly end: Version | null;
  readonly newItems: number[]
}>;

type OldCatalogIndex = Array<{
  readonly start: Version;
  readonly end: Version | null;
  readonly items: number[]
}>;

const CATALOG_ADDED_ITEMS_INDEX: NewCatalogIndex = [];
const CATALOG_INCLUDED_ITEMS_INDEX: OldCatalogIndex = [];

function buildCatalogIndex(newIndex: NewCatalogIndex, oldIndex: OldCatalogIndex): void {
  const included = new Set<number>();
  let previousClothing: Version | null = null;
  const catalogIndexes: Array<{ index: number, type: 'clothing' | 'sport' | 'martialartworks' | 'gameupgrades' | 'elitegear' }> = [];

  let previousSportDate: Version | null = null;
  let previousMartialArtworksDate: Version | null = null;
  let previousGameUpgradesDate: Version | null = null;
  let previousEliteGearDate: Version | null = null;

  for (let i = UPDATES.length - 1; i >= 0; i--) {
    const { date, update} = UPDATES[i];
    if (update.clothingCatalog !== undefined) {
      catalogIndexes.push({ index: i, type: 'clothing' });
      newIndex.push({
        start: date,
        end: previousClothing,
        newItems: [...update.clothingCatalog.newItems]
      });
      previousClothing = date;
    }
    if (update.sportCatalog !== undefined) {
      catalogIndexes.push({ index: i, type: 'sport' });
      newIndex.push({
        start: date,
        end: previousSportDate,
        newItems: [...update.sportCatalog.items]
      });
      previousSportDate = date;
    }
    if (update.martialArtworks !== undefined && typeof update.martialArtworks !== "string") {
      catalogIndexes.push({ index: i, type: 'martialartworks' });
      newIndex.push({
        start: date,
        end: previousMartialArtworksDate,
        newItems: [...update.martialArtworks.newItems]
      });
      previousMartialArtworksDate = date;
    }
    if (update.gameUpgrades !== undefined) {
      catalogIndexes.push({ index: i, type: 'gameupgrades' });
      newIndex.push({
        start: date,
        end: previousGameUpgradesDate,
        newItems: [...update.gameUpgrades.newItems]
      });
      previousGameUpgradesDate = date;
    }
    if (update.eliteGearItems !== undefined) {
      catalogIndexes.push({ index: i, type: 'elitegear' });
      newIndex.push({
        start: date,
        end: previousEliteGearDate,
        newItems: [...update.eliteGearItems]
      });
      previousEliteGearDate = date;
    }
  }


  CATALOG_ADDED_ITEMS_INDEX.reverse();
  catalogIndexes.reverse();

  for (let i = 0; i < catalogIndexes.length; i++) {
    const info = catalogIndexes[i];
    if (info.type === 'clothing') {
      const clothingCatalog = UPDATES[info.index].update.clothingCatalog;
      if (clothingCatalog !== undefined) {
        clothingCatalog.newItems.forEach(item => included.add(item));
        clothingCatalog.removedItems.forEach(item => included.delete(item));
        oldIndex.push({
          start: CATALOG_ADDED_ITEMS_INDEX[i].start,
          end: CATALOG_ADDED_ITEMS_INDEX[i].end,
          items: [...included.values()]
        });
      }
    } else if (info.type === 'sport') {
      const items = UPDATES[info.index].update.sportCatalog?.items;
      if (items !== undefined) {
        oldIndex.push({
          start: CATALOG_ADDED_ITEMS_INDEX[i].start,
          end: CATALOG_ADDED_ITEMS_INDEX[i].end,
          items: [...items]
        })
      }
    } else if (info.type === 'martialartworks') {
      const martialArtworks = UPDATES[info.index].update.martialArtworks;
      if (martialArtworks !== undefined && typeof martialArtworks !== "string") {
        martialArtworks.newItems.forEach(item => included.add(item));
        martialArtworks.removedItems.forEach(item => included.delete(item));
        oldIndex.push({
          start: CATALOG_ADDED_ITEMS_INDEX[i].start,
          end: CATALOG_ADDED_ITEMS_INDEX[i].end,
          items: [...included.values()]
        })
      }
    } else if (info.type === 'gameupgrades') {
      const gameUpgrades = UPDATES[info.index].update.gameUpgrades;
      if (gameUpgrades !== undefined) {
        gameUpgrades.newItems.forEach(item => included.add(item));
        gameUpgrades.removed.forEach(item => included.delete(item));
        oldIndex.push({
          start: CATALOG_ADDED_ITEMS_INDEX[i].start,
          end: CATALOG_ADDED_ITEMS_INDEX[i].end,
          items: [...included.values()]
        })
      }
    } else if (info.type === 'elitegear') {
      const eliteGearItems = UPDATES[info.index].update.eliteGearItems;
      if (eliteGearItems !== undefined) {
        eliteGearItems.forEach(item => included.add(item));
        oldIndex.push({
          start: CATALOG_ADDED_ITEMS_INDEX[i].start,
          end: CATALOG_ADDED_ITEMS_INDEX[i].end,
          items: [...included.values()]
        })
      }
    }
  }

}

export function getAddedCatalogIndex(): NewCatalogIndex {
  return CATALOG_ADDED_ITEMS_INDEX;
}

export function getIncludedCatalogIndex(): OldCatalogIndex {
  return CATALOG_INCLUDED_ITEMS_INDEX;
}

buildCatalogIndex(CATALOG_ADDED_ITEMS_INDEX, CATALOG_INCLUDED_ITEMS_INDEX);
