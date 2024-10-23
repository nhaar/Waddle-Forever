import { itemDatas, ItemId, ItemName, ItemMember, ItemType, ItemAs2, ItemAs3, ItemEpf, ItemReleaseDate, ItemTour, ItemTreasure } from "./items";

interface Item {
  id: ItemId
  name: ItemName
  isMember: ItemMember
  type: ItemType
  isAs2: ItemAs2
  isAs3: ItemAs3
  isEPF: ItemEpf
  releaseDate: ItemReleaseDate
  isTour: ItemTour
  isTreasure: ItemTreasure
}

export const items: Record<ItemId, Item> = {}

for (const item of itemDatas) {
  items[item[0]] = {
    id: item[0],
    name: item[1],
    type: item[2],
    isMember: item[3],
    isAs2: item[4],
    isAs3: item[5],
    isEPF: item[6],
    isTour: item[7],
    isTreasure: item[8],
    releaseDate: item[9]
  }
}
