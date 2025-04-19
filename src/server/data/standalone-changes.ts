type StandaloneChange = {
  route: string;
  fileId: number;
  updateId: number;
};

type StandaloneTemporaryChange = {
  route: string;
  startUpdateId: number;
  endUpdateid: number;
  fileId: number;
}

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
  },
  {
    // have no better place to put the default dependencies.json
    route: 'play/v2/client/dependencies.json',
    updateId: 1,
    fileId: 136
  },
  {
    // file from legacy media with a few stamps removed since they shouldn't be there
    route: 'web_service/worldachievements.xml',
    updateId: 26,
    fileId: 2516
  },
  {
    // placeholder binoculars
    route: 'play/v2/content/global/binoculars/empty.swf',
    updateId: 27,
    fileId: 200
  },
  {
    // placeholder telescope
    route: 'play/v2/content/global/telescope/empty.swf',
    updateId: 27,
    fileId: 270
  },
  {
    // placeholder igloo background
    route: 'play/v2/content/global/igloo/assets/igloo_background.swf',
    updateId: 27,
    fileId: 366
  }
];

export const STANDALONE_TEMPORARY_CHANGE: StandaloneTemporaryChange[] = [
  // 4th of july fireworks on the mountain (2010)
  {
    startUpdateId: 73,
    endUpdateid: 74,
    route: 'play/v2/content/global/rooms/mtn.swf',
    fileId: 2295 // same as new years day
  },
  // removing fireworks in music jam construction for the iceberg
  {
    startUpdateId: 74,
    endUpdateid: 75,
    route: 'play/v2/content/global/rooms/berg.swf',
    fileId: 2474
  }
]