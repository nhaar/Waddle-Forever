import { StaticDataTable } from "../../common/static-table";

type StandaloneChange = {
  route: string;
  fileId: number;
  updateId: number;
};

export const STANDALONE_CHANGE: StandaloneChange[] = [
  {
    // newspapers-less precpip client
    route: 'chat291.swf',
    fileId: 24,
    updateId: 1
  },
  {
    // precpip client with newspapers
    route: 'chat291.swf',
    fileId: 66,
    updateId: 6
  },
  {
    // engine that has EPF and stuff
    route: 'play/v2/client/engine.swf',
    fileId: 119,
    updateId: 25
  }
];