import { StaticDataTable } from "../../common/static-table";

type StandaloneChange = {
  pathId: number;
  fileId: number;
  updateId: number;
};

export const STANDALONE_CHANGE: StandaloneChange[] = [
  {
    // newspapers-less precpip client
    pathId: 3,
    fileId: 24,
    updateId: 1
  },
  {
    // precpip client with newspapers
    pathId: 3,
    fileId: 66,
    updateId: 6
  }
];