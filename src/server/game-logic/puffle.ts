import { StaticDataTable } from "../../common/static-table";

type Puffle = {
  id: number
  parentId: number | undefined
  name: string
  cost: number
  member: boolean
  favouriteFood: number
  favouriteToy: number | undefined
  runawayPostcard: number | undefined
};

export const PUFFLE_DATA: Array<{
  colour: number;
  max_health: number;
  max_hunger: number;
  max_rest: number;
}> = [
  {colour:3394815,max_health:100,max_hunger:100,max_rest:100},
  {colour:16764159,max_health:100,max_hunger:120,max_rest:80},
  {colour:6710886,max_health:120,max_hunger:80,max_rest:100},
  {colour:3394560,max_health:80,max_hunger:100,max_rest:120},
  {colour:11362246,max_health:80,max_hunger:120,max_rest:80},
  {colour:15615044,max_health:100,max_hunger:80,max_rest:120},
  {colour:16776960,max_health:100,max_hunger:100,max_rest:100},
  {colour:16777198,max_health:120,max_hunger:80,max_rest:100},
  {colour:16750848,max_health:100,max_hunger:80,max_rest:120}
];

export const PUFFLES = new StaticDataTable<Puffle, [
  'id',
  'parentId',
  'name',
  'cost',
  'member',
  'favouriteFood',
  'favouriteToy',
  'runawayPostcard'
]>(
  ['id', 'parentId', 'name', 'cost', 'member', 'favouriteFood', 'favouriteToy', 'runawayPostcard'],
  [
    [0, undefined, 'Blue', 400, false, 105, 27, undefined],
    [1, undefined, 'Pink', 400, true, 107, 28, 101],
    [2, undefined, 'Black', 400, true, 112, 31, 102],
    [3, undefined, 'Green', 400, true, 109, 30, 103],
    [4, undefined, 'Purple', 400, true, 110, 35, 104],
    [5, undefined, 'Red', 400, false, 106, 29, 105],
    [6, undefined, 'Yellow', 400, true, 114, 32, 106],
    [7, undefined, 'White', 400, true, 111, 33, 169],
    [8, undefined, 'Orange', 400, true, 108, 34, 109],
    [9, undefined, 'Brown', 400, true, 113, 36, undefined],
    [10, undefined, 'Rainbow', 0, true, 115, 103, undefined],
    [11, undefined, 'Gold', 0, true, 128, 125, undefined],
    [1000, 2, 'Black T-Rex', 0, true, 112, undefined, undefined],
    [1001, 4, 'Purple T-Rex', 0, true, 110, undefined, undefined],
    [1002, 5, 'Red Triceratops', 0, true, 106, undefined, undefined],
    [1003, 0, 'Blue Triceratops', 0, true, 105, undefined, undefined],
    [1004, 6, 'Yellow Stegasaurus', 0, true, 114, undefined, undefined],
    [1005, 1, 'Pink Stegasaurus', 0, true, 107, undefined, undefined],
    [1006, 0, 'Blue Dog', 800, true, 105, undefined, undefined],
    [1007, 8, 'Orange Cat', 800, true, 108, undefined, undefined],
    [1008, 3, 'Green Raccoon', 800, true, 109, undefined, undefined],
    [1009, 8, 'Orange Raccoon', 800, true, 108, undefined, undefined],
    [1010, 1, 'Pink Raccoon', 800, true, 107, undefined, undefined],
    [1011, 0, 'Blue Raccoon', 800, true, 105, undefined, undefined],
    [1012, 3, 'Green Rabbit', 800, true, 109, undefined, undefined],
    [1013, 1, 'Pink Rabbit', 800, true, 107, undefined, undefined],
    [1014, 7, 'White Rabbit', 800, true, 111, undefined, undefined],
    [1015, 5, 'Red Rabbit', 800, true, 106, undefined, undefined],
    [1016, 0, 'Blue Deer', 800, true, 105, undefined, undefined],
    [1017, 2, 'Black Deer', 800, true, 112, undefined, undefined],
    [1018, 5, 'Red Deer', 800, true, 106, undefined, undefined],
    [1019, 4, 'Purple Deer', 800, true, 110, undefined, undefined],
    [1020, 6, 'Yellow Unicorn', 800, true, 114, undefined, undefined],
    [1021, 7, 'Snowman', 0, true, 111, undefined, undefined],
    [1022, 4, 'Ghost', 0, true, 110, undefined, undefined],
    [1023, 0, 'Crystal', 0, true, 105, undefined, undefined],
    [1024, 3, 'Green Alien', 0, false, 109, undefined, undefined],
    [1025, 8, 'Orange Alien', 0, true, 108, undefined, undefined],
    [1026, 6, 'Yellow Alien', 0, true, 114, undefined, undefined],
    [1027, 4, 'Purple Alien', 0, true, 110, undefined, undefined]
  ]
);