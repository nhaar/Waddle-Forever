import { PRE_BOILER_ROOM_PAPERS } from "./newspapers";
import { BETA_RELEASE, CAVE_EXPEDITION_END, CPIP_UPDATE, EPF_RELEASE, FAIR_2010_START, FAIR_2011_START, HALLOWEEN_2010_START, JULY_4_2010_END, MODERN_AS3, MUSIC_JAM_2010_CONST_START, MUSIC_JAM_2010_START, STAMPS_RELEASE } from "./updates";

type StandaloneChange = {
  route: string;
  fileId: number;
  date: string;
  comment?: string;
};

type StandaloneTemporaryChange = {
  route: string;
  startDate: string;
  endDate: string;
  fileId: number;
  comment?: string;
}

export const STANDALONE_CHANGE: StandaloneChange[] = [
  {
    // newspapers-less precpip client
    route: 'chat291.swf',
    fileId: 24,
    date: BETA_RELEASE
  },
  {
    // precpip client with newspapers
    route: 'chat291.swf',
    fileId: 66,
    date: PRE_BOILER_ROOM_PAPERS[0]
  },
  {
    // engine that has EPF and stuff
    route: 'play/v2/client/engine.swf',
    fileId: 119,
    date: EPF_RELEASE
  },
  {
    // interface with EPF phone
    route: 'play/v2/client/interface.swf',
    fileId: 2260,
    date: EPF_RELEASE
  },
  {
    route: 'play/v2/client/interface.swf',
    fileId: 2261,
    date: STAMPS_RELEASE
  },
  {
    route: 'play/v2/client/engine.swf',
    fileId: 2265,
    date: MODERN_AS3
  },
  {
    route: 'play/v2/games/paddle/paddle.swf',
    fileId: 181,
    date: FAIR_2011_START
  },
  {
    route: 'play/v2/games/paddle/paddle.swf',
    fileId: 2266,
    date: FAIR_2010_START
  },
  {
    // permanent dig poster after cave expedition
    route: 'play/v2/content/local/en/close_ups/digposter2.swf',
    date: CAVE_EXPEDITION_END,
    fileId: 1080
  },
  {
    // have no better place to put the default dependencies.json
    route: 'play/v2/client/dependencies.json',
    date: BETA_RELEASE,
    fileId: 136
  },
  {
    // file from legacy media with a few stamps removed since they shouldn't be there
    route: 'web_service/worldachievements.xml',
    date: STAMPS_RELEASE,
    fileId: 2516
  },
  {
    // placeholder binoculars
    route: 'play/v2/content/global/binoculars/empty.swf',
    date: CPIP_UPDATE,
    fileId: 200
  },
  {
    // placeholder telescope
    route: 'play/v2/content/global/telescope/empty.swf',
    date: CPIP_UPDATE,
    fileId: 270
  },
  {
    // placeholder igloo background
    route: 'play/v2/content/global/igloo/assets/igloo_background.swf',
    date: CPIP_UPDATE,
    fileId: 366
  },
  {
    route: 'play/v2/content/local/en/catalogues/ninja.swf',
    date: '2009-11-13',
    fileId: 2690,
    comment: 'The amulet is added to the Martial Artworks'
  },
  {
    route: 'play/v2/content/local/en/catalogues/pets.swf',
    date: '2010-03-19',
    fileId: 2691
  }
];

export const STANDALONE_TEMPORARY_CHANGE: StandaloneTemporaryChange[] = [
  // 4th of july fireworks on the mountain (2010)
  {
    startDate: MUSIC_JAM_2010_CONST_START,
    endDate: JULY_4_2010_END,
    route: 'play/v2/content/global/rooms/mtn.swf',
    fileId: 2295 // same as new years day
  },
  // removing fireworks in music jam construction for the iceberg
  {
    startDate: JULY_4_2010_END,
    endDate: MUSIC_JAM_2010_START,
    route: 'play/v2/content/global/rooms/berg.swf',
    fileId: 2474
  },
  {
    startDate: '2010-10-14', // estimate from newspapers
    endDate: HALLOWEEN_2010_START,
    route: 'play/v2/content/global/binoculars/empty.swf',
    fileId: 2634,
    comment: 'A storm is approaching and visible from the Cove'
  }
]