import { PRE_BOILER_ROOM_PAPERS } from "./newspapers";
import { ANNIVERSARY_5_START, AS3_UPDATE, BETA_RELEASE, CAVE_EXPEDITION_END, CHRISTMAS_2006_DECORATION, CHRISTMAS_2007_START, CPIP_UPDATE, EPF_RELEASE, FAIR_2010_START, FAIR_2011_START, HALLOWEEN_2010_START, JULY_4_2010_END, MODERN_AS3, MUSIC_JAM_2010_CONST_START, MUSIC_JAM_2010_START, ROCKHOPPER_ARRIVAL_PARTY_START, STAMPS_RELEASE } from "./updates";

type StandaloneChange = {
  route: string;
  fileId: number;
  date: string;
  comment?: string;
};

type StandaloneTemporaryChange = {
  startDate: string;
  endDate: string;
  fileId: number;
  comment?: string;
  endComment?: string;
  updates?: Array<{
    date: string;
    fileId: number;
    comment?: string;
  }>
}

export const STANDALONE_CHANGE: Record<string, Array<{ fileId: number; date: string; comment?: string }>> = {
  'chat291.swf': [
    {
      // newspapers-less precpip client
      fileId: 24,
      date: BETA_RELEASE
    },
    {
      // precpip client with newspapers
      fileId: 66,
      date: PRE_BOILER_ROOM_PAPERS[0]
    }
  ],
  'play/v2/client/shell.swf': [
    {
      fileId: 5105,
      date: CPIP_UPDATE
    },
    {
      fileId: 5106,
      date: MODERN_AS3
    }
  ],
  'play/v2/client/engine.swf': [
    {
      // engine that has EPF and stuff
      fileId: 119,
      date: EPF_RELEASE
    },
    {
      fileId: 2265,
      date: MODERN_AS3
    }
  ],
  'play/v2/client/interface.swf': [
    {
      // interface with EPF phone
      fileId: 2260,
      date: EPF_RELEASE
    },
    {
      fileId: 2261,
      date: STAMPS_RELEASE
    }
  ],
  'play/v2/client/club_penguin.swf': [
    {
      // this file is from Dec 2010, but will be using it as a placeholder
      // one from november 2010 exists in archives, and should be included if they are different
      fileId: 4753,
      date: AS3_UPDATE
    }
  ],
  'play/v2/client/Newspaper.swf': [
    {
      fileId: 4754,
      date: AS3_UPDATE
    }
  ],
  'play/v2/games/paddle/paddle.swf': [
    {
      fileId: 181,
      date: FAIR_2011_START
    },
    {
      fileId: 2266,
      date: FAIR_2010_START
    }
  ],
  'play/v2/content/local/en/close_ups/digposter2.swf': [
    {
      // permanent dig poster after cave expedition
      date: CAVE_EXPEDITION_END,
      fileId: 1080 
    }
  ],
  'play/v2/client/dependencies.json': [
    {
      // have no better place to put the default dependencies.json
      date: BETA_RELEASE,
      fileId: 136 
    }
  ],
  'web_service/worldachievements.xml': [
    {
      // file from legacy media with a few stamps removed since they shouldn't be there
      date: STAMPS_RELEASE,
      fileId: 2516
    }
  ],
  'play/v2/content/global/binoculars/empty.swf': [
    {
      // placeholder binoculars
      date: CPIP_UPDATE,
      fileId: 200
    }
  ],
  'play/v2/content/global/telescope/empty.swf': [
    {
      // placeholder telescope
      date: CPIP_UPDATE,
      fileId: 270
    }
  ],
  'play/v2/content/global/igloo/assets/igloo_background.swf': [
    {
      // placeholder igloo background
      date: CPIP_UPDATE,
      fileId: 366
    }
  ],
  'play/v2/content/local/en/catalogues/ninja.swf': [
    {
      fileId: 2690,
      comment: 'The amulet is added to the Martial Artworks',
      date: '2009-11-13',
    }
  ],
  'play/v2/content/local/en/catalogues/pets.swf': [
    {
      date: '2010-03-19',
      fileId: 2691
    }
  ],
  'play/v2/content/local/en/forms/library.swf': [
    {
      date: '2009-10-24',
      fileId: 2692
    },
    {
      date: ANNIVERSARY_5_START,
      fileId: 2693
    }
  ],
  'play/v2/content/local/en/postcards/111.swf': [
    {
      date: '2010-02-25',
      fileId: 2695
    },
    {
      date: '2011-02-17',
      fileId: 2694
    }
  ],
};

export const STANDALONE_TEMPORARY_CHANGE: Record<string, StandaloneTemporaryChange[]> = {
  'play/v2/content/global/rooms/mtn.swf': [
    {
      startDate: MUSIC_JAM_2010_CONST_START,
      endDate: JULY_4_2010_END,
      fileId: 2295 // same as new years day
    }
  ],
  'play/v2/content/global/rooms/berg.swf': [
    {
      // removing fireworks in music jam construction for the iceberg
      startDate: JULY_4_2010_END,
      endDate: MUSIC_JAM_2010_START,
      fileId: 2474
    }
  ],
  'play/v2/content/global/binoculars/empty.swf': [
    {
      startDate: '2010-10-21',
      endDate: HALLOWEEN_2010_START,
      fileId: 2634,
      comment: 'A storm is approaching and visible from the Cove'
    }
  ],
  'artwork/rooms/plaza.swf': [
    {
      startDate: CHRISTMAS_2006_DECORATION,
      endDate: '2006-12-21',
      fileId: 3836,
      comment: 'A tree is available to be decorated for Christmas'
    },
    {
      startDate: '2007-12-14',
      endDate: CHRISTMAS_2007_START,
      fileId: 3905,
      comment: 'The Coins For Change event begins'
    }
  ],
  'artwork/tools/telescope0.swf': [
    {
      // according to newspaper
      // unsure if in the original game the animation replayed each time
      // unless they had some interesting serverside code or the client in this day was different
      // it probably just replayed each time
      startDate: '2008-01-16',
      endDate: '2008-02-06',
      fileId: 4940,
      comment: 'Something happening with The Migrator can be viewed from the telescope',
      endComment: 'The Migrator is completely sunk',
      updates: [
        {
          // we know on 17th it was still the previous one
          // this date below here is mostly an assumption, but it should be this at most
          // by the 23rd
          date: '2008-01-18',
          fileId: 4941,
          comment: 'The aftermath of The Migrator crash remains in the telescope'
        },
        {
          date: '2008-01-30',
          comment: 'The Migrator\'s remains sink further',
          fileId: 4943
        },
        {
          date: '2008-02-01',
          comment: 'Rockhopper is seen leaving Club Penguin from the telescope',
          fileId: 4944
        }
      ]
    },
    {
      startDate: '2008-04-17',
      endDate: ROCKHOPPER_ARRIVAL_PARTY_START,
      fileId: 4945,
      comment: 'Rockhopper is spotted through the telescope'
    }
  ],
}