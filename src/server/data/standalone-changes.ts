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
  },
  {
    // interface with EPF phone
    route: 'play/v2/client/interface.swf',
    fileId: 2260,
    updateId: 25
  },
  {
    route: 'play/v2/client/interface.swf',
    fileId: 2261,
    updateId: 26
  },
  {
    route: 'play/v2/client/engine.swf',
    fileId: 2265,
    updateId: 29
  },
  {
    route: 'play/v2/games/paddle/paddle.swf',
    fileId: 181,
    updateId: 31
  },
  {
    route: 'play/v2/games/paddle/paddle.swf',
    fileId: 2266,
    updateId: 30
  },
  {
    // permanent dig poster after cave expedition
    route: 'play/v2/content/local/en/close_ups/digposter2.swf',
    updateId: 54,
    fileId: 1080
  }
];