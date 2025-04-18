import { StaticDataTable } from "../../common/static-table";

type PreCpipStaticFile = {
  id: number;
  path: number;
  file: number;
};

export const PRE_CPIP_STATIC_FILES = new StaticDataTable<PreCpipStaticFile, ['id', 'path', 'file']>(
  ['id', 'path', 'file'],
  [
    [1, 8, 4],
    [9, 29, 18],
    [10, 21, 19],
    [11, 22, 20],
    [12, 20, 21],
    [13, 1, 1],
    [14, 2, 2]
  ]
);