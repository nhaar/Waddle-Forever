import { StaticDataTable } from "../../common/static-table";

type Path = {
  id: number;
  parentId: null | number;
  name: string;
};

export const PATHS = new StaticDataTable<Path, ['id', 'parentId', 'name']>(
  ['id', 'parentId', 'name'],
  [
    [1, null, 'load.swf'],
    [2, null, 'version.txt'],
    [3, null, 'chat291.swf'],
    [4, null, 'artwork'],
    [5, 4, 'rooms'],
    [6, 5, 'town10.swf'],
    [7, 4, 'characters'],
    [8, 7, 'penguin.swf'],
    [9, 5, 'coffee11.swf'],
    [10, 5, 'dance10.swf'],
    [11, 5, 'lounge10.swf'],
    [12, 4, 'maps'],
    [13, 12, 'island5.swf'],
    [14, 5, 'rink10.swf'],
    [15, 5, 'dock11.swf'],
    [16, 5, 'village11.swf'],
    [17, 5, 'shop10.swf'],
    [18, 5, 'book11.swf'],
    [19, null, 'games'],
    [20, 19, 'biscuit.swf'],
    [21, 19, 'astro.swf'],
    [22, 19, 'beans.swf'],
    [23, null, 'music'],
    [24, 23, '1.swf'],
    [25, 23, '2.swf'],
    [26, 5, 'agent11.swf'],
    [27, 5, 'dojo10.swf'],
    [28, null, 'edit'],
    [29, 28, 'edit6.swf'],
    [30, 5, 'forts12.swf'],
    [31, 4, 'news'],
    [32, 31, 'news1.swf'],
    [33, 31, 'news2.swf'],
    [34, 31, 'news3.swf'],
    [35, 31, 'news4.swf'],
    [36, 31, 'news5.swf'],
    [37, 31, 'news6.swf'],
    [38, 31, 'news7.swf'],
    [39, 31, 'news8.swf'],
    [40, 31, 'news9.swf'],
    [41, 31, 'news10.swf'],
    [42, 31, 'news11.swf'],
    [43, 31, 'news12.swf'],
    [44, 31, 'news13.swf'],
    [45, 31, 'news14.swf'],
    [46, 31, 'news15.swf'],
    [47, 31, 'news16.swf'],
    [48, 31, 'news17.swf'],
    [49, 31, 'news18.swf'],
    [50, 31, 'news19.swf'],
    [51, 31, 'news20.swf'],
    [52, 31, 'news21.swf'],
    [53, 31, 'news22.swf'],
    [54, 31, 'news23.swf'],
    [55, 31, 'news24.swf'],
    [56, 31, 'news25.swf'],
    [57, 31, 'news26.swf'],
    [58, 31, 'newsfan.swf']
  ]
);

export const PRECPIP_MAP_PATH = 13;