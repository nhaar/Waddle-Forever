import { StaticDataTable } from "../../common/static-table";

export enum FileCategory {
  Archives,
  Fix,
  Approximation,
  Recreation,
  Mod,
  Tool,
  StaticServer,
  Unknown
};

type File = {
  id: number;
  path: string;
  packageId: number;
  category: FileCategory;
  // if category is StaticServer, other null
  staticId: null | number;
  // if is recreated from another file in here
  baseFile: null | number;
  credits: null | number[];
};

export const FILES = new StaticDataTable<File, [
  'id',
  'path',
  'packageId',
  'category',
  'staticId',
  'baseFile',
  'credits'
]>(['id', 'path', 'packageId', 'category', 'staticId', 'baseFile', 'credits'], [
  [1, 'load.swf', 1, FileCategory.StaticServer, 1, null, null],
  [2, 'version.txt', 1, FileCategory.StaticServer, 1, null, null],
  [3, 'artwork/catalogue/adopt0703.swf', 1, FileCategory.StaticServer, 1, null, null],
  [4, 'artwork/characters/penguin.swf', 1, FileCategory.StaticServer, 1, null, null],
  [5, 'artwork/rooms/agent11.swf', 1, FileCategory.StaticServer, 1, null, null],
  [6, 'artwork/rooms/berg10.swf', 1, FileCategory.StaticServer, 1, null, null],
  [7, 'artwork/rooms/coffee11.swf', 1, FileCategory.StaticServer, 1, null, null],
  [8, 'artwork/rooms/dance10.swf', 1, FileCategory.StaticServer, 1, null, null],
  [9, 'artwork/rooms/dock11.swf', 1, FileCategory.StaticServer, 1, null, null],
  [10, 'artwork/rooms/dojo10.swf', 1, FileCategory.StaticServer, 1, null, null],
  [11, 'artwork/rooms/lodge11.swf', 1, FileCategory.StaticServer, 1, null, null],
  [12, 'artwork/rooms/lounge10.swf', 1, FileCategory.StaticServer, 1, null, null],
  [13, 'artwork/rooms/mtn10.swf', 1, FileCategory.StaticServer, 1, null, null],
  [14, 'artwork/rooms/pet11.swf', 1, FileCategory.StaticServer, 1, null, null],
  [15, 'artwork/rooms/pizza12.swf', 1, FileCategory.StaticServer, 1, null, null],
  [16, 'artwork/rooms/shop10.swf', 1, FileCategory.StaticServer, 1, null, null],
  [17, 'artwork/rooms/sport11.swf', 1, FileCategory.StaticServer, 1, null, null],
  [18, 'edit/edit6.swf', 1, FileCategory.StaticServer, 1, null, null],
  [19, 'games/astro.swf', 1, FileCategory.StaticServer, 1, null, null],
  [20, 'games/beans.swf', 1, FileCategory.StaticServer, 1, null, null],
  [21, 'games/biscuit.swf', 1, FileCategory.StaticServer, 1, null, null],
  [22, 'games/fish.swf', 1, FileCategory.StaticServer, 1, null, null],
  [23, 'games/puffle.swf', 1, FileCategory.StaticServer, 1, null, null],
  [24, 'chat291_no_news.swf', 1, FileCategory.Approximation, null, 66, null],
  [25, 'play/v2/content/global/music/1.swf', 1, FileCategory.StaticServer, 2, null, null],
  [26, 'play/v2/content/global/music/2.swf', 1, FileCategory.StaticServer, 2, null, null],

  // with the Snow Forts trigger removed since it wasn't available yet
  [27, 'town_release.swf', 1, FileCategory.Approximation, null, 28, null],

  [28, 'ArtworkRoomsTown10.swf', 1, FileCategory.Archives, null, null, null],
  [29, 'Beta-book.swf', 1, FileCategory.Archives, null, null, null],
  [30, 'ArtworkRoomsVillage11.swf', 1, FileCategory.Archives, null, null, null],

  // removed ability to enter mtn, sport, lodge
  [31, 'village_release.swf', 1, FileCategory.Approximation, null, 30, null],
  [32, 'ArtworkRoomsRink10.swf', 1, FileCategory.Archives, null, null, null],

  // removed ability to go to snow fort via the door, maybe that door used to open the map.
  [33, 'rink_release.swf', 1, FileCategory.Approximation, null, 32, null],
  
  // removed the Snow Forts button
  [34, 'map_release.swf', 1, FileCategory.Recreation, null, 35, [7]],

  [35, 'ArtworkMapsIsland3.swf', 1, FileCategory.Archives, null, null, null],
  [36, 'ArtworkRoomsForts12.swf', 1, FileCategory.Archives, null, null, null],
  [37, 'forts_release.swf', 1, FileCategory.Approximation, null, 36, null],
  [38, 'Beta-town.swf', 1, FileCategory.Archives, null, null, null],
  [40, 'News1.swf', 1, FileCategory.Archives, null, null, null],
  [41, 'News2.swf', 1, FileCategory.Archives, null, null, null],
  [42, 'News3.swf', 1, FileCategory.Archives, null, null, null],
  [43, 'News4.swf', 1, FileCategory.Archives, null, null, null],
  [44, 'News5.swf', 1, FileCategory.Archives, null, null, null],
  [45, 'News6.swf', 1, FileCategory.Archives, null, null, null],
  [46, 'News7.swf', 1, FileCategory.Archives, null, null, null],
  [47, 'News8.swf', 1, FileCategory.Archives, null, null, null],
  [48, 'News9.swf', 1, FileCategory.Archives, null, null, null],
  [49, 'News10.swf', 1, FileCategory.Archives, null, null, null],
  [50, 'News11.swf', 1, FileCategory.Archives, null, null, null],
  [51, 'News12.swf', 1, FileCategory.Archives, null, null, null],
  [52, 'News13.swf', 1, FileCategory.Archives, null, null, null],
  [53, 'News14.swf', 1, FileCategory.Archives, null, null, null],
  [54, 'News15.swf', 1, FileCategory.Archives, null, null, null],
  [55, 'News16.swf', 1, FileCategory.Archives, null, null, null],
  [56, 'News17.swf', 1, FileCategory.Archives, null, null, null],
  [57, 'News18.swf', 1, FileCategory.Archives, null, null, null],
  [58, 'News19.swf', 1, FileCategory.Archives, null, null, null],
  [59, 'News20.swf', 1, FileCategory.Archives, null, null, null],
  [60, 'News21.swf', 1, FileCategory.Archives, null, null, null],
  [61, 'News22.swf', 1, FileCategory.Archives, null, null, null],
  [62, 'News23.swf', 1, FileCategory.Archives, null, null, null],
  [63, 'News24.swf', 1, FileCategory.Archives, null, null, null],
  [64, 'News25.swf', 1, FileCategory.Archives, null, null, null],
  [65, 'News26.swf', 1, FileCategory.Archives, null, null, null],
  [66, 'chat291.swf', 1, FileCategory.Unknown, null, null, null],
  [67, 'NewsFan.swf', 1, FileCategory.Archives, null, null, null],
  [68, 'September05Style.swf', 1, FileCategory.Archives, null, null, null],
  [69, 'Clothing_0510.swf', 1, FileCategory.Archives, null, null, null],
  [70, 'Clothing_0511.swf', 1, FileCategory.Archives, null, null, null],
  [71, 'Clothing_0512.swf', 1, FileCategory.Archives, null, null, null],
  [72, 'Clothing_0601.swf', 1, FileCategory.Archives, null, null, null],
  [73, 'Clothing_0602.swf', 1, FileCategory.Archives, null, null, null],
  [74, 'Clothing_0603.swf', 1, FileCategory.Archives, null, null, null],
  [75, 'Clothing_0604.swf', 1, FileCategory.Archives, null, null, null],

  // halloween files fixed for compatibility with chat291.swf
  [76, 'Book2_03_halloween.swf', 1, FileCategory.Fix, null, null, null],
  [77, 'Dance1b_halloween.swf', 1, FileCategory.Fix, null, null, null],
  [78, 'Lounge1_halloween.swf', 1, FileCategory.Fix, null, null, null],
  [79, 'Dojo_halloween.swf', 1, FileCategory.Fix, null, null, null],
  [80, 'Icerink_halloween.swf', 1, FileCategory.Fix, null, null, null],
  [81, 'Town_halloween.swf', 1, FileCategory.Fix, null, null, null],
  [82, 'village_sport.swf', 1, FileCategory.Approximation, null, 30, null],
  [83, 'village_no_lodge.swf', 1, FileCategory.Approximation, null, 30, null],

  [84, 'Dance1b_pet.swf', 1, FileCategory.Fix, null, null, null],
  [85, 'Forts_pet.swf', 1, FileCategory.Fix, null, null, null],
  [86, 'Icerink_pet.swf', 1, FileCategory.Fix, null, null, null]
]);
