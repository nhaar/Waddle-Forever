import { StaticDataTable } from "../../common/static-table";

type Person = {
  id: number;
  name: string;
};

const PEOPLE = new StaticDataTable<Person, ['id', 'name']>(
  ['id', 'name'],
  [
    [1, 'supermanover'],
    [2, 'nhaar'],
    [3, 'Randomno'],
    [4, 'JeffTheRock'],
    [5, 'Blue Kirby'],
    [6, 'Resol'],
    [7, 'Zeldaboy']
  ]
);