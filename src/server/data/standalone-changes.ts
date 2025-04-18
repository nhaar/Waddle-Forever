import { StaticDataTable } from "../../common/static-table";

type StandaloneChange = {
  id: number;
  pathId: number;
  fileId: number;
  updateId: number;
};

export const STANDALONE_CHANGE = new StaticDataTable<StandaloneChange, ['id', 'pathId', 'fileId', 'updateId']>(
  ['id', 'pathId', 'fileId', 'updateId'],
  [
    // newspapers-less precpip client
    [1, 3, 24, 1]
  ]
);