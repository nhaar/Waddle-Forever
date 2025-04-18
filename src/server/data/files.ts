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
  [24, 'chat291_no_news.swf', 1, FileCategory.Approximation, null, null, null],
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
  [37, 'forts_release.swf', 1, FileCategory.Approximation, null, 36, [2]]
]);
