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
  fileRef: string;
  comment?: string;
  endComment?: string;
  updates?: Array<{
    date: string;
    fileRef: string;
    comment?: string;
  }>
}

export const STANDALONE_CHANGE: Record<string, Array<{ fileRef: string; date: string; comment?: string }>> = {
  'chat291.swf': [
    {
      // newspapers-less precpip client
      fileRef: 'approximation:chat291_no_news.swf',
      date: BETA_RELEASE
    },
    {
      // precpip client with newspapers
      fileRef: 'unknown:chat291.swf',
      date: PRE_BOILER_ROOM_PAPERS[0]
    }
  ],
  'play/v2/client/shell.swf': [
    {
      fileRef: 'slegacy:media/play/v2/client/shell.swf',
      date: CPIP_UPDATE
    },
    {
      fileRef: 'svanilla:media/play/v2/client/shell.swf',
      date: MODERN_AS3
    }
  ],
  'play/v2/client/engine.swf': [
    {
      fileRef: 'unknown:engine_2009.swf',
      date: CPIP_UPDATE
    },
    {
      // engine that has EPF and stuff
      fileRef: 'slegacy:media/play/v2/client/engine.swf',
      date: EPF_RELEASE
    },
    {
      fileRef: 'svanilla:media/play/v2/client/engine.swf',
      date: MODERN_AS3
    }
  ],
  'play/v2/client/interface.swf': [
    {
      fileRef: 'unknown:interface_2009.swf',
      date: CPIP_UPDATE
    },
    {
      // interface with EPF phone
      fileRef: 'recreation:interface_epf_no_stamps.swf',
      date: EPF_RELEASE
    },
    {
      fileRef: 'unknown:interface_stamps.swf',
      date: STAMPS_RELEASE
    }
  ],
  'play/v2/client/club_penguin.swf': [
    {
      // this file is from Dec 2010, but will be using it as a placeholder
      // one from november 2010 exists in archives, and should be included if they are different
      fileRef: 'archives:Dec2010club_penguin.swf',
      date: AS3_UPDATE
    }
  ],
  'play/v2/client/Newspaper.swf': [
    {
      fileRef: 'archives:Dec2010ClientNewspaper.swf',
      date: AS3_UPDATE
    }
  ],
  'play/v2/games/paddle/paddle.swf': [
    {
      fileRef: 'slegacy:media/play/v2/games/paddle/paddle.swf',
      date: FAIR_2011_START
    },
    {
      fileRef: 'recreation:paddle_no_brown.swf',
      date: FAIR_2010_START
    }
  ],
  'play/v2/content/local/en/close_ups/digposter2.swf': [
    {
      // permanent dig poster after cave expedition
      date: CAVE_EXPEDITION_END,
      fileRef: 'slegacy:media/play/v2/content/local/en/close_ups/digposter2.swf' 
    }
  ],
  'play/v2/client/dependencies.json': [
    {
      // have no better place to put the default dependencies.json
      date: BETA_RELEASE,
      fileRef: 'slegacy:media/play/v2/client/dependencies.json' 
    }
  ],
  'web_service/worldachievements.xml': [
    {
      // file from legacy media with a few stamps removed since they shouldn't be there
      date: STAMPS_RELEASE,
      fileRef: 'approximation:worldachievements.xml'
    }
  ],
  'play/v2/content/global/binoculars/empty.swf': [
    {
      // placeholder binoculars
      date: CPIP_UPDATE,
      fileRef: 'slegacy:media/play/v2/content/global/binoculars/empty.swf'
    }
  ],
  'play/v2/content/global/telescope/empty.swf': [
    {
      // placeholder telescope
      date: CPIP_UPDATE,
      fileRef: 'slegacy:media/play/v2/content/global/telescope/empty.swf'
    }
  ],
  'play/v2/content/global/igloo/assets/igloo_background.swf': [
    {
      // placeholder igloo background
      date: CPIP_UPDATE,
      fileRef: 'slegacy:media/play/v2/content/global/igloo/assets/igloo_background.swf'
    }
  ],
  'play/v2/content/local/en/catalogues/ninja.swf': [
    {
      fileRef: 'archives:November09Ninja2.swf',
      comment: 'The amulet is added to the Martial Artworks',
      date: '2009-11-13',
    }
  ],
  'play/v2/content/local/en/catalogues/pets.swf': [
    {
      date: '2010-03-19',
      fileRef: 'archives:Mar2010Pets.swf'
    }
  ],
  'play/v2/content/local/en/forms/library.swf': [
    {
      date: '2009-10-24',
      fileRef: 'recreation:library_2009.swf'
    },
    {
      date: ANNIVERSARY_5_START,
      fileRef: 'archives:ENFormsLibrary-2010.swf'
    }
  ],
  'play/v2/content/local/en/postcards/111.swf': [
    {
      date: '2010-02-25',
      fileRef: 'fix:postcard_orange_puffle.swf'
    },
    {
      date: '2011-02-17',
      fileRef: 'archives:Enm111.swf'
    }
  ],
  'play/v2/games/roundup/PuffleRoundup.swf': [
    {
      // orange puffle version, must add white puffle version too later
      date: CPIP_UPDATE,
      fileRef: 'recreation:puffle_roundup_orange.swf'
    }
  ],
  'play/v2/content/local/en/catalogues/costume.swf': [
    {
      // placeholder CPIP stage
      date: CPIP_UPDATE,
      fileRef: 'archives:January2009Costume.swf'
    }
  ]
};

export const STANDALONE_TEMPORARY_CHANGE: Record<string, StandaloneTemporaryChange[]> = {
  'play/v2/content/global/rooms/mtn.swf': [
    {
      startDate: MUSIC_JAM_2010_CONST_START,
      endDate: JULY_4_2010_END,
      fileRef: 'archives:2010newyearfireworksskihill.swf' // same as new years day
    }
  ],
  'play/v2/content/global/rooms/berg.swf': [
    {
      // removing fireworks in music jam construction for the iceberg
      startDate: JULY_4_2010_END,
      endDate: MUSIC_JAM_2010_START,
      fileRef: 'recreation:iceberg_mjamconst_no_fireworks.swf'
    }
  ],
  'play/v2/content/global/binoculars/empty.swf': [
    {
      startDate: '2010-10-21',
      endDate: HALLOWEEN_2010_START,
      fileRef: 'archives:Storm_on_horizon.swf',
      comment: 'A storm is approaching and visible from the Cove'
    }
  ],
  'artwork/rooms/plaza.swf': [
    {
      startDate: CHRISTMAS_2006_DECORATION,
      endDate: '2006-12-21',
      fileRef: 'archives:ArtworkRoomsPlaza42.swf',
      comment: 'A tree is available to be decorated for Christmas'
    },
    {
      startDate: '2007-12-14',
      endDate: CHRISTMAS_2007_START,
      fileRef: 'archives:RoomsPlaza-ChristmasParty2007Pre.swf',
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
      fileRef: 'archives:BeaconTelescopeCrash.swf',
      comment: 'Something happening with The Migrator can be viewed from the telescope',
      endComment: 'The Migrator is completely sunk',
      updates: [
        {
          // we know on 17th it was still the previous one
          // this date below here is mostly an assumption, but it should be this at most
          // by the 23rd
          date: '2008-01-18',
          fileRef: 'archives:TelescopeCrash2.swf',
          comment: 'The aftermath of The Migrator crash remains in the telescope'
        },
        {
          date: '2008-01-30',
          comment: 'The Migrator\'s remains sink further',
          fileRef: 'archives:TelescopeCrash3.swf'
        },
        {
          date: '2008-02-01',
          comment: 'Rockhopper is seen leaving Club Penguin from the telescope',
          fileRef: 'archives:TelescopeCrash4.swf'
        }
      ]
    },
    {
      startDate: '2008-04-17',
      endDate: ROCKHOPPER_ARRIVAL_PARTY_START,
      fileRef: 'archives:Telescope0417.swf',
      comment: 'Rockhopper is spotted through the telescope'
    }
  ],
}