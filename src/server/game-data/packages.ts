import { StaticDataTable } from "../../common/static-table";

type Package = {
  id: number;
  name: string;
};

export const PACKAGES = new StaticDataTable<Package, ['id', 'name']>(
  ['id', 'name'],
  [
    [1, 'default'],
    [2, 'clothing']
  ]
);