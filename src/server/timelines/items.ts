import { findFirstIndexEqualOrGreater } from "@common/utils";
import { ItemType } from "@server/game-logic/items";
import { isGreaterOrEqual, Version } from "@server/routes/versions";
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

export function getItemsInRange(start: Version, end: Version): Set<number> {
  const items = new Set<number>();
  const startIndex = findFirstIndexEqualOrGreater(start, itemsReleaseIndex, ([a,], b) => isGreaterOrEqual(a, b));
  const endIndex = findFirstIndexEqualOrGreater(end, itemsReleaseIndex, ([a,], b) => isGreaterOrEqual(a, b));
  itemsReleaseIndex.slice(startIndex, endIndex + 1).forEach(([, is]) => is.forEach(i => items.add(i)));
  return items;
}

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