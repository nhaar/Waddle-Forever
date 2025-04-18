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
    [29, 28, 'edit6.swf']
  ]
);

export const PRECPIP_MAP_PATH = 13;