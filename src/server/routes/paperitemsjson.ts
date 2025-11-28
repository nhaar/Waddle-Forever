import { ITEMS } from "../game-logic/items";
import { getMapForDate } from "../timelines";
import { PRICES_TIMELINE } from "../timelines/prices";
import { Version } from "./versions";

type PaperItem = {
  paper_item_id: number;
  cost: number;
  label: string;
  layer: number;
  is_epf?: "1";
  has_translations?: "1";
  has_back?: "1",
  make_secret_agent?: "1",
  is_gift?: "1";
  exclusive?: "1";
  type: number;
  is_member: boolean;
  prompt: string;
  is_bait?: "1";
  customDepth?: string;
  is_back?: "1";
  make_tour_guide?: "1";
  is_medal?: "1";
  noPurchasePopup?: "1";
  is_game_achievable?: "1";
}

function getPaperItems(version: Version): PaperItem[] {
  const costs = getMapForDate(PRICES_TIMELINE, version);
  return ITEMS.rows.map(i => {
    return ({
    paper_item_id: i.id,
    cost: costs[i.id] ?? i.cost,
    label: i.label ?? i.name,
    layer: i.layer,
    is_epf: i.isEPF ? "1" : undefined,
    has_translations: i.hasTranslations ? "1" : undefined,
    has_back: i.hasBack ? "1" : undefined,
    make_secret_agent: i.makeAgent ? "1" : undefined,
    is_gift: i.isGift ? "1" : undefined,
    exclusive: i.exclusive ? "1" : undefined,
    type: i.type,
    is_member: i.isMember,
    prompt: i.name,
    is_bait: i.isBait ? "1" : undefined,
    customDepth: String(i.customDepth) ?? undefined,
    is_back: i.isBack ? "1" : undefined,
    make_tour_guide: i.isTour? "1" : undefined,
    is_medal: i.isMedal? "1" : undefined,
    noPurchasPopup: i.noPurchasePopup? "1" : undefined,
    is_game_achieavable: i.isGameAchievable? "1" : undefined
  })}); 
}

export function getPaperItemsJson(version: Version): string {
  return JSON.stringify(getPaperItems(version));
}