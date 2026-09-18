import { StaticDataTable } from "@common/static-table";
import { START_DATE } from "@server/timelines/dates";
import { Version } from "../routes/versions";
import { ItemsData } from "./items-data";

export enum ItemType {
  Color = 1,
  Head = 2,
  Face = 3,
  Neck = 4,
  Body = 5,
  Hand = 6,
  Feet = 7,
  Pin = 8,
  Background = 9,
  Award = 10
};

export enum ExclusiveType {
  Not = 0,
  Exclusive = 1,
  Super = 2
}

export type Item = {
  id: number;
  name: string;
  isMember: boolean;
  type: ItemType;
  cost: number;

  isEPF: boolean;
  isTour: boolean;
  isTreasure: boolean;
  
  releaseDate: string;

  label: string | null;
  layer: number;
  hasTranslations: boolean;
  hasBack: boolean;
  makeAgent: boolean;
  isGift: boolean;
  exclusive: ExclusiveType;
  isBait: boolean;
  customDepth: number | null;
  isBack: boolean;
  isMedal: boolean;
  noPurchasePopup: boolean;
  isGameAchievable: boolean;
}

export type CustomItem = {
  id: number;
  name: string;
  type: ItemType;
  layer: number;
  cost: number;
  isMember: boolean;
  isBack: boolean;
};

export function getCost(item: Item, date: Version): number {
  // todo implement with versions timeline
  return item.cost;
}

export class ItemTable extends StaticDataTable<Item, [
  'id',
  'name',
  'isMember',
  'type',
  'cost',
  'isEPF',
  'isTour',
  'isTreasure',
  'releaseDate',
  'label',
  'layer',
  'hasTranslations',
  'hasBack',
  'makeAgent',
  'isGift',
  'exclusive',
  'isBait',
  'customDepth',
  'isBack',
  'isMedal',
  'noPurchasePopup',
  'isGameAchievable'
]> {
  public addCustomItem(info: CustomItem) {
    this.map.set(info.id, {
      id: info.id,
      name: info.name,
      isMember: info.isMember,
      type: info.type,
      cost: info.cost,
      isEPF: false,
      isTour: false,
      isTreasure: false,
      releaseDate: START_DATE,
      label: null,
      layer: info.layer,
      hasTranslations: false,
      hasBack: info.isBack,
      makeAgent: false,
      isGift: false,
      exclusive: 0,
      isBait: false,
      customDepth: null,
      isBack: info.isBack,
      isMedal: false,
      noPurchasePopup: false,
      isGameAchievable: false
    });
  }

  public removeCustomItem(id: number) {
    this.map.delete(id);
  }
}

export function getItemsTable(items: ItemsData): ItemTable {
  return new ItemTable([
  'id',
  'name',
  'isMember',
  'type',
  'cost',
  'isEPF',
  'isTour',
  'isTreasure',
  'releaseDate',
  'label',
  'layer',
  'hasTranslations',
  'hasBack',
  'makeAgent',
  'isGift',
  'exclusive',
  'isBait',
  'customDepth',
  'isBack',
  'isMedal',
  'noPurchasePopup',
  'isGameAchievable'
], items);
}