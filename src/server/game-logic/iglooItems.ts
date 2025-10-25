import { StaticDataTable } from "../../common/static-table";
import { Version } from "../routes/versions";

type IglooType = {
  id: number;
  name: string;
  cost: number;
  patched: boolean;
  old: boolean;
  modern: boolean;
};

export const IGLOO_TYPES = new StaticDataTable<IglooType, [
  'id',
  'name',
  'cost',
  'patched',
  'old',
  'modern'
]>([
  'id',
  'name',
  'cost',
  'patched',
  'old',
  'modern'
], [
 [0, 'Igloo Removal', 0, false, false, false],
 [1, 'Basic Igloo', 1500, false, true, true],
 [2, 'Candy Igloo', 1500, false, false, false],
 [3, 'Deluxe Blue Igloo', 4000, false, false, false],
 [4, 'Big Candy Igloo', 4000, false, false, false],
 [5, 'Secret Stone Igloo', 2000, false, false, false],
 [6, 'Snow Igloo', 1000, false, false, false],
 [8, 'Secret Deluxe Stone Igloo', 5000, false, false, false],
 [9, 'Deluxe Snow Igloo', 3000, false, false, false],
 [10, 'Bamboo Hut', 3200, false, false, false],
 [11, 'Log Cabin', 4100, false, false, false],
 [12, 'Gym', 4800, false, false, false],
 [13, 'Split Level Igloo', 4600, false, false, false],
 [14, 'Candy Split Level Igloo', 4600, false, false, false],
 [15, 'Snowglobe', 3700, false, false, false],
 [16, 'Ice Castle', 2400, false, false, false],
 [17, 'Split Level Snow Igloo', 4600, false, false, false],
 [18, 'Fish Bowl', 2400, false, false, false],
 [19, 'Tent', 2700, false, false, false],
 [20, 'Jack O\' Lantern', 2700, false, false, false],
 [21, 'Backyard Igloo', 4200, false, false, false],
 [22, 'Pink Ice Palace', 2400, false, false, false],
 [23, 'Ship Igloo', 4300, false, false, false],
 [24, 'Dojo Igloo', 1300, false, false, false],
 [25, 'Gingerbread House', 2100, false, false, false],
 [26, 'Restaurant Igloo', 4800, false, false, false],
 [27, 'Tree House Igloo', 4500, false, false, false],
 [28, 'Theatre Igloo', 4600, false, false, false],
 [29, 'Circus Tent', 3000, false, false, false],
 [30, 'Snowy Backyard Igloo', 3000, false, false, false],
 [31, 'Cave Igloo', 1500, false, false, false],
 [32, 'Green Clover Igloo', 2050, false, false, false],
 [33, 'Grey Ice Castle', 2400, false, false, false],
 [35, 'Cozy Cottage Igloo', 2500, false, false, false],
 [36, 'Estate Igloo', 2500, false, false, false],
 [37, 'In Half Igloo', 2300, false, false, false],
 [38, 'Shadowy Keep', 1800, false, false, false],
 [39, 'Dragon\'s Lair', 3000, false, false, false],
 [40, 'Mermaid Cove', 3030, false, false, false],
 [41, 'Whale\'s Mouth', 2700, false, false, false],
 [42, 'Trick-or-Treat Igloo', 2000, false, false, false],
 [43, 'Deluxe Gingerbread House', 0, false, false, false],
 [45, 'Invisible Snowy', 0, false, false, false],
 [46, 'Invisible Beach', 0, false, false, false],
 [47, 'Invisible Forest', 0, false, false, false],
 [48, 'Invisible Mountain', 0, false, false, false],
 [49, 'Shipwreck Igloo', 900, false, false, false],
 [50, 'Wildlife Den', 900, false, false, false],
 [51, 'Medieval Manor', 1200, false, false, false],
 [52, 'Warehouse', 950, false, false, false],
 [53, 'Pineapple Igloo', 0, false, false, false],
 [54, 'Creepy Cavern', 1500, false, false, false],
 [55, 'Frost Bite Palace', 2000, false, false, false],
 [56, 'Fresh Baked Gingerbread House', 2500, false, false, false],
 [57, 'Penthouse', 4000, false, false, false],
 [58, 'VIP Penthouse', 4500, false, false, false],
 [59, 'Invisible Age of Dinosaurs', 0, false, false, false],
 [60, 'Puffle Tree Fort', 0, false, false, false],
 [61, 'Secret Base', 1600, false, false, false],
 [62, 'Imperial Base Igloo', 1000, false, false, false],
 [63, 'Beach Party Igloo', 1500, false, false, false],
 [64, 'Gymnasium Igloo', 0, false, false, false],
 [65, 'Magical Hideout', 1500, false, false, false],
 [66, 'Eerie Castle', 2000, false, false, false],
 [67, 'Sweet Swirl Igloo', 0, false, false, false],
 [68, 'Train Station Igloo', 1100, false, false, false],
 [69, 'Main Event Igloo', 1000, false, false, false],
 [70, 'CP Airliner', 1200, false, false, false],
 [71, 'Puffle Tree House', 1500, false, false, false],
 [72, 'Invisible Distant Planet', 0, false, false, false],
 [73, 'Space Dome Igloo', 2000, false, false, false],
 [74, 'Invisible Soccer Pitch', 0, false, false, false],
 [75, 'Tour Bus Igloo', 1800, false, false, false],
 [76, 'Ice Palace Igloo', 0, false, false, false],
 [77, 'Sharks Gym', 1500, false, false, false],
 [78, 'Schoolhouse Igloo', 0, false, false, false],
 [79, 'Ghostly Cavern Igloo', 1800, false, false, false],
 [80, 'Invisible Undersea', 0, false, false, false],
 [81, 'Invisible Merry Walrus Iceberg', 0, false, false, false],
 [82, 'Ezra\'s Hideout', 1800, false, false, false],
 [83, 'Starship Igloo', 0, false, false, false],
 [84, 'Talent Show Stage', 1500, false, false, false],
 [85, 'Red Puffle Tree House', 1000, false, false, false],
 [86, 'Orange Puffle Tree House', 1000, false, false, false],
 [87, 'Yellow Puffle Tree House', 1000, false, false, false],
 [88, 'Green Puffle Tree House', 1000, false, false, false],
 [89, 'Blue Puffle Tree House', 1000, false, false, false],
 [90, 'Purple Puffle Tree House', 1000, false, false, false],
 [91, 'Black Puffle Tree House', 1000, false, false, false],
 [92, 'White Puffle Tree House', 1000, false, false, false],
 [93, 'Brown Puffle Tree House', 1000, false, false, false],
 [94, 'Pink Puffle Tree House', 1000, false, false, false],
 [95, 'Gold Puffle Tree House', 1000, false, false, false],
 [96, 'Rainbow Puffle Tree House', 1000, false, false, false],
 [97, 'Spring Palace', 0, false, false, false],
 [98, 'Stage Igloo', 1500, false, false, false]
]);

export function getFlooringCost(flooring: number, version: Version = '2010-11-24') {
  switch (flooring) {
    case 0: // Remove flooring
      return 20
    case 1: // Terracotta
      return 680
    case 4: // Burgundy carpet
      return 530
    case 7: // Dance floor
      return 1000
    case 9: // Bamboo floor
      return 370
    case 14: // Phony-Lawn
      return 700
    case 17: // Pink carpet
      return 530
    case 20: // Cobblestone
      return 1200
    case 21: // Snowy Floor
      return 400
    case 22: // Lime Green Carpet
      return 530
    default:
      return 0;
  }
}

export function getIglooCost(igloo: number) {
  const item = IGLOO_TYPES.getStrict(igloo);
  return item.cost;
}