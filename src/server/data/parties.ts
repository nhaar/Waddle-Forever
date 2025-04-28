import { Version } from "../routes/versions";
import { RoomName } from "./rooms";
import { ANNIVERSARY_5_START, CAVE_EXPEDITION_END, CAVE_OPENING_END, CAVE_OPENING_START, CHRISTMAS_2005_ENDS, CHRISTMAS_2007_START, DIG_OUT_DOJO_END, EARTH_DAY_2010_END, EARTH_DAY_2010_START, EGG_HUNT_2006_END, EGG_HUNT_2006_START, EPF_RELEASE, FAIR_2010_START, FIRE_CELEBRATION_START, HALLOWEEN_2010_START, LIGHTHOUSE_PARTY_START, MUSIC_JAM_08_START, MUSIC_JAM_2010_CONST_START, MUSIC_JAM_2010_START, NEW_YEARS_2010_UPDATE, PET_SHOP_RELEASE, PIZZA_PARLOR_OPENING_END, PIZZA_PARLOR_OPENING_START, PLANET_Y_2010, PUFFLE_PARTY_10_CONST_START, ROCKHOPPER_ARRIVAL_END, ROCKHOPPER_ARRIVAL_PARTY_START, SPORT_PARTY_END, SPORT_PARTY_START, STADIUM_GAMES_END, SUMMER_PARTY_END, SUMMER_PARTY_START, WATER_CELEBRATION_END, WATER_HUNT_END, WINTER_FIESTA_08_START } from "./updates";

// room name -> file Id
export type RoomChanges = Partial<Record<RoomName, number>>;

type Language = 'en';

/** First element is file id used, then a list of all the crumbs that point to this path */
export type CrumbIndicator = [number, ...string[]];

export type PartyChanges = {
  roomChanges: RoomChanges;
  // a map of a path inside play/v2/content/local eg en/catalogues/party.swf mapping to a file
  // inside a map of each language
  localChanges?: Record<string, Partial<Record<Language, number | CrumbIndicator>>>;
  // maps route inside play/v2/global to either file Id or tuple [global_path name, file Id]
  globalChanges?: Record<string, number | CrumbIndicator>

  roomFrames?: Partial<Record<RoomName, number>>;

  // route -> fileId
  generalChanges?: Record<string, number>;
}

export type Party = PartyChanges & {
  name: string;
  startDate: string;
  endDate: string;
  /** If true, then this will not be labeled a party in the timeline */
  event?: true;

  // Overriding the default placeholder message for a party start
  // with a custom one
  startComment?: string;
  endComment?: string;

  music?: Partial<Record<RoomName, number>>;
  construction?: Construction;
  /** Scavenger Hunt icon is loaded by the dependency, must be specified */
  scavengerHunt2010?: {
    iconFileId: number;
    // if not supplied, will use a placeholder one
    iconFilePath?: string;
  };

  /** If used the CPIP fair icon and its info */
  fairCpip?: {
    // exact ID
    iconFileId: number;
    // UI id might be required in the future if we find different ones
  };

  updates?: Array<{
    comment?: string;
    date: string;
  } & PartyChanges>;

  activeMigrator?: true;

  // TODO maybe also supplying the ID if we know
  // otherwise default egg id to 1
  /**
   * For a scavenger hunt in the 2007-2008 client,
   * writing what the file number of the egg file is
   * */
  scavengerHunt2007?: number;

  /** Permanent changes to the island at the party's start */
  permanentChanges?: PartyChanges & { roomComment?: string; };

  /** Permanent changes to the island at the party's end */
  consequences?: PartyChanges & { roomComment?: string; };
};

type Construction = {
  date: string;
  changes: RoomChanges;

  comment?: string;

  updates?: Array<{
    date: Version;
    changes: RoomChanges;
    comment: string;
  }>;
};

export const PARTIES: Party[] = [
  {
    name: 'Beta Test Party',
    startDate: '2005-09-21',
    endDate: '2005-09-22',
    roomChanges: {
      'town': 38
    }
  },
  {
    name: 'Halloween Party 2005',
    startDate: '2005-10-27',
    endDate: '2005-11-01',
    roomChanges: {
      'book': 76,
      'dance': 77,
      'lounge': 78,
      'dojo': 79,
      'rink': 80,
      'town': 81
    }
  },
  {
    name: 'The Great Puffle Discovery',
    startDate: '2005-11-15',
    endDate: '2005-12-05',
    roomChanges: {
      'dance': 84,
      'forts': 85,
      'rink': 86
    }
  },
  {
    name: 'Christmas Party 2005',
    startDate: '2005-12-22',
    endDate: CHRISTMAS_2005_ENDS,
    roomChanges: {
      'coffee': 88,
      'dance': 89,
      'lodge': 90,
      'rink': 91,
      'shop': 92,
      'town': 93,
      'village': 94
    },
    music: {
      'town': 200,
      'coffee': 200,
      'dance': 200,
      'shop': 200,
      'village': 200,
      'lodge': 200,
      'rink': 200
    },
    permanentChanges: {
      roomChanges: {
        // lodge is now accessible
        village: 30
      }
    }
  },
  {
    name: 'Valentine\'s Day Celebration',
    startDate: '2006-02-14',
    endDate: '2006-02-15',
    roomChanges: {
      'dance': 98,
      'lounge': 97
    }
  },
  {
    name: 'Pizza Parlor Opening Party',
    startDate: PIZZA_PARLOR_OPENING_START,
    endDate: PIZZA_PARLOR_OPENING_END,
    roomChanges: {
      'forts': 99,
      'pizza': 100,
      'town': 101
    },
    music: {
      'plaza': 2
    },
    roomFrames: {
      'town': 2
    },
    consequences: {
      roomChanges: {
        // now has path to the plaza
        forts: 36
      }
    }
  },
  {
    name: 'St. Patrick\'s Day Party',
    startDate: PET_SHOP_RELEASE,
    startComment: 'A celebration for St. Patrick\'s Day and Puffles starts',
    endComment: 'The St. Patrick\'s Day and Puffle party ends',
    endDate: '2006-03-20',
    roomChanges: {
      'village': 110,
      'plaza': 4870,
      'town': 4871
    },
    roomFrames: {
      'village': 2
    }
  },
  {
    name: 'April Fools Party 2006',
    startDate: '2006-03-31',
    endDate: '2006-04-03',
    roomChanges: {
      'dojo': 105,
      'rink': 106,
      'dance': 107,
      'plaza': 108,
      'lodge': 109,
      'village': 110,
      'forts': 111,
      'town': 112
    },
    music: {
      'dance': 201,
      'forts': 201,
      'rink': 201,
      'town': 201,
      'plaza': 201
    },
    roomFrames: {
      'plaza': 3
    }
  },
  {
    name: 'Easter Egg Hunt 2006',
    startDate: EGG_HUNT_2006_START,
    endDate: EGG_HUNT_2006_END,
    roomChanges: {
      'book': 3759,
      'berg': 3760,
      'dance': 3761,
      'pet': 3762,
      'mtn': 3763,
      'lodge': 3764,
      'village': 3765,
      'forts': 3766
    }
  },
  {
    name: 'Underground Opening Party',
    startDate: CAVE_OPENING_START,
    endDate: CAVE_OPENING_END,
    roomChanges: {
      'mine': 3783
    },
    music: {
      'boiler': 203,
      'cave': 202,
      'mine': 203,
      'plaza': 203
    },
    permanentChanges: {
      roomChanges: {
        // manhole path
        plaza: 3780,
        // green puffle + boiler room trigger
        dance: 3779
      }
    }
  },
  {
    name: 'Summer Party',
    startDate: SUMMER_PARTY_START,
    endDate: SUMMER_PARTY_END,
    roomChanges: {
      'beach': 3796,
      'boiler': 3797,
      'dock': 3798,
      'dojo': 3799,
      'berg': 3800,
      'shack': 3801,
      'dance': 3802,
      'plaza': 3803,
      'mtn': 3804,
      'village': 3805,
      'forts': 3806,
      'town': 3807
    },
    music: {
      'beach': 204,
      'boiler': 204,
      'dock': 204,
      'dojo': 204,
      'berg': 204,
      'shack': 204,
      'dance': 204,
      'plaza': 204,
      'mtn': 204,
      'village': 204,
      'forts': 204,
      'town': 204
    },
    updates: [
      {
        date: '2006-06-21',
        comment: 'Two new items are available for the Summer Party',
        roomChanges: {
          'beach': 3831,
          'plaza': 3832
        }
      }
    ],
    permanentChanges: {
      roomComment: 'More rooms are visible from the HQ',
      roomChanges: {
        // now this has a path to the beach
        village: 4924,
        agent: 4933
      }
    }
  },
  {
    name: 'Western Party',
    startDate: '2006-07-14',
    endDate: '2006-07-17',
    roomChanges: {
      plaza: 3814,
      forts: 3815,
      dance: 3813,
      town: 3816
    },
    roomFrames: {
      plaza: 2,
      forts: 2,
      dance: 2,
      town: 2
    }
  },
  {
    name: 'Band Scavenger Hunt',
    startDate: '2006-07-21',
    endDate: '2006-07-23',
    roomChanges: {
      'boiler': 3939,
      'cave': 3940,
      'dock': 3941,
      'mtn': 3942,
      'lodge': 3943,
      'village': 3944,
      'pet': 3945,
      'pizza': 3946
    }
  },
  {
    name: 'Sports Party',
    startDate: SPORT_PARTY_START,
    endDate: SPORT_PARTY_END,
    roomChanges: {
      'beach': 3818,
      'cave': 3819,
      'coffee': 3820,
      'dock': 3821,
      'rink': 3822,
      'pizza': 3823,
      'plaza': 3824,
      'mtn': 3825,
      'village': 3826,
      'forts': 3827,
      'town': 3828
    },
    music: {
      'beach': 213,
      'cave': 213,
      'coffee': 213,
      'dock': 213,
      'rink': 213,
      'pizza': 213,
      'plaza': 213,
      'mtn': 213,
      'forts': 213,
      'town': 213,
      'village': 213
    },
    roomFrames: {
      'beach': 2,
      'cave': 2,
      'coffee': 2,
      'dock': 2,
      'rink': 2,
      'pizza': 2,
      'plaza': 2,
      'mtn': 2,
      'village': 3,
      'forts': 2,
      'town': 2
    },
    updates: [
      {
        date: '2006-08-18',
        comment: 'A new item is in the Snow Forts for the Sports Party',
        roomChanges: {
          forts: 3830
        },
        roomFrames: {
          forts: 3
        }
      }
    ],
    consequences: {
      roomComment: 'The pool becomes a part of the undeground after the Sports Party ends',
      roomChanges: {
        cave: 4916,
      }
    }
  },
  {
    name: 'Lighthouse Party',
    startDate: LIGHTHOUSE_PARTY_START,
    endDate: '2006-09-24',
    roomChanges: {
      'beacon': 3833,
      'light': 3834
    },
    roomFrames: {
      'light': 2,
      'beacon': 2
    },
    permanentChanges: {
      roomChanges: {
        // first room archived with the lighthouse open
        // used for the party since the SWF for the beach in
        // the party is also lost
        beach: 3835
      }
    }
  },
  {
    name: 'Winter Fiesta',
    startDate: '2007-01-19',
    endDate: '2007-01-22',
    roomChanges: {
      'village': 3837
    },
    music: {
      'village': 206
    }
  },
  {
    name: 'Pirate Party',
    startDate: '2007-04-27',
    endDate: '2007-05-04',
    roomChanges: {
      'town': 3840,
      'dock': 3839
    },
    music: {
      'town': 212,
      'dock': 212
    }
  },
  {
    name: 'Water Party',
    startDate: '2007-07-13',
    endDate: '2007-07-23',
    roomChanges: {
      'dojo': 3847
    },
    music: {
      'dojo': 217
    }
  },
  {
    name: 'Camp Penguin',
    startDate: '2007-08-24',
    endDate: '2007-08-27',
    startComment: 'Camp Penguin party begins',
    endComment: 'Camp Penguin party ends',
    roomChanges: {
      'village': 3849
    }
  },
  {
    name: 'Fall Fair',
    startDate: '2007-09-21',
    endDate: '2007-10-01',
    roomChanges: {
      'beach': 3850,
      'beacon': 3851,
      'cove': 3852,
      'lounge': 3853,
      'dock': 3854,
      'forest': 3855,
      'rink': 3856,
      'light': 3857,
      'mine': 3858,
      'dance': 3859,
      'pizza': 3860,
      'plaza': 3861,
      'mtn': 3862,
      'village': 3863,
      'forts': 3864,
      'town': 3865
    },
    music: {
      // music wiki backed
      'town': 221,
      'dance': 221,
      'lounge': 221,
      'forts': 221,
      'plaza': 221,
      'pizza': 221,
      'forest': 221,
      'cove': 221,
      'dock': 221,
      'beach': 221,
      'light': 221,
      'beacon': 221,
      'village': 221,
      'mtn': 221
    },
    generalChanges: {
      'artwork/rooms/0926/PrizeBooth2.swf': 3867
    },
    scavengerHunt2007: 3866
  },
  {
    name: '2nd Anniversary Party',
    startDate: '2007-10-24',
    endDate: '2007-10-25',
    roomChanges: {
      'book': 3870,
      'coffee': 3871
    },
    music: {
      'coffee': 100
    }
  },
  {
    name: 'Halloween Party',
    startDate: '2007-10-26',
    endDate: '2007-11-01',
    roomChanges: {
      'beach': 3873,
      'beacon': 3874,
      'cave': 3875,
      'coffee': 3876,
      'cove': 3877,
      'dock': 3878,
      'forest': 3879,
      'berg': 3880,
      'light': 3881,
      'attic': 3882,
      'shack': 3883,
      'dance': 3884,
      'pizza': 3885,
      'plaza': 3886,
      'forts': 3887,
      'rink': 3888,
      'mtn': 3889,
      'lodge': 3890,
      'village': 3891,
      'town': 3892
    },
    music: {
      // mix of archives + music wiki
      'beach': 223,
      'coffee': 205,
      'cove': 223,
      'dock': 223,
      'forest': 223,
      'berg': 223,
      'light': 205,
      'shack': 223,
      'dance': 224,
      'pizza': 205,
      'forts': 223,
      'mtn': 223,
      'lodge': 205,
      'village': 223,
      'town': 223,
      'plaza': 223
    },
    generalChanges: {
      'artwork/tools/binoculars1.swf': 2563
    }
  },
  {
    name: 'Surprise Party',
    startDate: '2007-11-23',
    endDate: '2007-11-26',
    roomChanges: {
      'cove': 3897,
      'dock': 3898,
      'forest': 3899,
      'dance': 3900,
      'plaza': 3901,
      'forts': 3902,
      'town': 3903
    },
    music: {
      // just put music in every room
      'cove': 55555,
      'dock': 55555,
      'forest': 55555,
      'dance': 55555,
      'plaza': 55555,
      'forts': 55555,
      'town': 55555
    }
  },
  {
    name: 'Christmas Party',
    startDate: CHRISTMAS_2007_START,
    endDate: '2008-01-02',
    roomChanges: {
      'beach': 3906,
      'beacon': 3907,
      'book': 3908,
      'cove': 3909,
      'dock': 3910,
      'forest': 3911,
      'berg': 3912,
      'attic': 3913,
      'dance': 3914,
      'plaza': 3915,
      'mtn': 3916,
      'lodge': 3917,
      'village': 3918,
      'forts': 3919,
      'town': 3920
    },
    music: {
      'beach': 200,
      'beacon': 227,
      'book': 227,
      'cove': 200,
      'dock': 200,
      'forest': 228,
      'berg': 227,
      'attic': 228,
      'dance': 226,
      'plaza': 227,
      'mtn': 228,
      'lodge': 228,
      'village': 228,
      'forts': 227,
      'town': 227
    }
  },
  {
    name: 'Winter Fiesta',
    startDate: WINTER_FIESTA_08_START,
    endDate: '2008-01-21',
    roomChanges: {
      'coffee': 3926,
      'village': 3933,
      'forts': 3934,
      'town': 3935
    },
    music: {
      'beach': 229,
      'coffee': 229,
      'cove': 229,
      'dock': 229,
      'forest': 229,
      'dance': 229,
      'pizza': 229,
      'plaza': 229,
      'village': 229,
      'forts': 229,
      'town': 229
    }
  },
  {
    name: 'Sub-Marine Party',
    startDate: '2008-02-15',
    endDate: '2008-02-22',
    roomChanges: {
      'beach': 3947,
      'beacon': 3948,
      'book': 3949,
      'coffee': 3950,
      'cove': 3951,
      'lounge': 3952,
      'dock': 3953,
      forest: 3954,
      dance: 3956,
      pizza: 3957,
      plaza: 3958,
      village: 3959,
      forts: 3960,
      town: 3961
    },
    music : {
      town: 230,
      plaza: 230,
      coffee: 230,
      book: 230,
      forts: 230,
      forest: 230,
      cove: 230,
      village: 230,
      beach: 230,
      light: 230,
      beacon: 230,
      dock: 230,
      pizza: 212,
      dance: 202
    }
  },
  {
    name: 'St. Patrick\'s Day Party',
    startDate: '2008-03-14',
    endDate: '2008-03-18',
    roomChanges: {
      coffee: 3964,
      dock: 3965,
      forest: 3966,
      dance: 3967,
      plaza: 3968,
      village: 3969,
      forts: 3970,
      town: 3971
    },
    music: {
      coffee: 208,
      dock: 208,
      forest: 208,
      dance: 208,
      plaza: 208,
      village: 208,
      forts: 208,
      town: 208
    }
  },
  {
    name: 'Easter Egg Hunt',
    startDate: '2008-03-21',
    endDate: '2008-03-24',
    roomChanges: {
      book: 4954,
      dock: 4955,
      dojo: 4956,
      shop: 4957,
      attic: 4958,
      mine: 4959,
      pet: 4960,
      plaza: 4961
    },
    scavengerHunt2007: 4962
  },
  {
    name: 'April Fools\' Party',
    startDate: '2008-03-28',
    endDate: '2008-04-02',
    roomChanges: {
      beach: 3973,
      beacon: 3974,
      boiler: 3975,
      book: 3976,
      coffee: 3977,
      lounge: 3978,
      dock: 3979,
      dojo: 3980,
      forest: 3981,
      shop: 3982,
      berg: 3983,
      light: 3984,
      attic: 3985,
      shack: 3986,
      dance: 3987,
      pet: 3988,
      pizza: 3989,
      plaza: 3990,
      lodge: 3991,
      village: 3992,
      forts: 3993,
      town: 3994,
      cove: 2669
    },
    music: {
      pet: 201,
      shop: 201,
      coffee: 201,
      book: 201,
      light: 201,
      beacon: 201,
      sport: 201,
      lodge: 201,
      attic: 201,
      dojo: 201,
      dance: 231,
      lounge: 231,
      town: 232,
      plaza: 232,
      forts: 232,
      forest: 232,
      cove: 232,
      dock: 232,
      beach: 232,
      village: 232,
      shack: 232,
      berg: 232
    },
    generalChanges: {
      'games/thinice/game.swf': 3999,
      'artwork/tools/binoculars1.swf': 3997,
      'artwork/tools/telescope0.swf': 3998
    }
  },
  {
    name: 'Rockhopper & Yarr\'s Arr-ival Parr-ty',
    startDate: ROCKHOPPER_ARRIVAL_PARTY_START,
    endDate: ROCKHOPPER_ARRIVAL_END,
    roomChanges: {
      beach: 4000,
      dock: 4002,
      coffee: 4001,
      dance: 4003,
      plaza: 4004,
      ship: 4005,
      shiphold: 4006,
      village: 4007,
      forts: 4008,
      town: 4009
    },
    music: {
      town: 212,
      forts: 212,
      plaza: 212,
      village: 212,
      beach: 212,
      dock: 212,
      coffee: 212,
      dance: 212
    },
    activeMigrator: true,
    consequences: {
      roomChanges: {
        // returning to normality
        beach: 3835
      }
    }
  },
  {
    name: 'Medieval Party',
    startDate: '2008-05-16',
    endDate: '2008-05-25',
    roomChanges: {
      beach: 4010,
      beacon: 4011,
      boiler: 4012,
      cave: 4013,
      coffee: 4014,
      cove: 4015,
      lounge: 4016,
      dock: 4017,
      forest: 4018,
      light: 4019,
      attic: 4020,
      mine: 4021,
      shack: 4022,
      dance: 4023,
      pet: 4024,
      pizza: 4025,
      plaza: 4026,
      rink: 4027,
      mtn: 4028,
      lodge: 4029,
      village: 4030,
      forts: 4031,
      town: 4032,

      // this is technically room "party"
      // but we have an issue with the id of that room
      // changing... (if want to preserve the internal URLs will need refactoring, so not doing it rn)
      party99: 4033
    },
    music: {
      beach: 235,
      beacon: 235,
      boiler: 236,
      cave: 236,
      coffee: 234,
      cove: 235,
      lounge: 234,
      dock: 233,
      forest: 235,
      light: 235,
      attic: 234,
      mine: 236,
      shack: 233,
      dance: 234,
      pet: 234,
      pizza: 234,
      plaza: 233,
      rink: 233,
      mtn: 234,
      lodge: 234,
      village: 233,
      forts: 233,
      town: 233,
      party99: 235
    }
  },
  {
    name: 'Water Party',
    startDate: '2008-06-13',
    endDate: '2008-06-17',
    roomChanges: {
      beach: 4038,
      beacon: 4039,
      boiler: 4040,
      cave: 4041,
      coffee: 4042,
      cove: 4043,
      dance: 4044,
      lounge: 4045,
      dock: 4046,
      dojo: 4047,
      forest: 4048,
      forts: 4049,
      berg: 4050,
      rink: 4051,
      light: 4052,
      attic: 4053,
      mine: 4054,
      shack: 4055,
      // technically it was party.swf
      party99: 4056,
      pizza: 4057,
      plaza: 4058,
      mtn: 4059,
      lodge: 4060,
      village: 4061,
      town: 4062
    },
    music: {
      beach: 218,
      beacon: 218,
      boiler: 217,
      cave: 217,
      coffee: 218,
      cove: 217,
      dance: 217,
      dock: 218,
      dojo: 218,
      forest: 217,
      forts: 217,
      rink: 217,
      light: 217,
      mine: 218,
      shack: 218,
      party99: 218,
      plaza: 217,
      mtn: 218,
      village: 218,
      town: 218
    }
  },
  {
    name: 'Music Jam',
    startDate: MUSIC_JAM_08_START,
    endDate: '2008-08-05',
    roomChanges: {
      party: 4064,
      beach: 4065,
      cave: 4066,
      coffee: 4067,
      cove: 4068,
      lounge: 4069,
      dock: 4070,
      dojo: 4071,
      forest: 4072,
      berg: 4073,
      rink: 4074,
      light: 4075,
      mine: 4076,
      dance: 4077,
      pizza: 4078,
      village: 4080,
      town: 4081,
      forts: 4082
    },
    music: {
      party: 243,
      coffee: 211,
      berg: 244,
      mine: 247,
      pizza: 210,
      plaza: 242,
      forts: 240,
      town: 242,
      dance: 242,
      lounge: 242
    },
    localChanges: {
      'catalogues/merch.swf': {
        'en': 4095
      },
      'close_ups/backstage_allaccesspass.swf': {
        'en': 4094
      },
      'catalogues/music.swf': {
        'en': 4096
      }
    },
    permanentChanges: {
      roomChanges: {
        // this is from june 26, when dj3k disks are added
        // other SWFs in-between are lost
        dance: 4860,
        // placeholder date for the band
        light: 4915
      }
    }
  },
  {
    name: 'Paper Boat Scavenger Hunt',
    startDate: '2008-08-08',
    endDate: '2008-08-18',
    roomChanges: {
      beach: 4964,
      cave: 4965,
      coffee: 4966,
      cove: 4967,
      dock: 4968,
      berg: 4969,
      shack: 4970,
      pet: 4971
    },
    globalChanges: {
      'scavenger_hunt/hunt_ui.swf': [4973, 'scavenger_hunt_boat', 'easter_hunt'],
    },
    scavengerHunt2010: {
      iconFileId: 4972
    }
  },
  {
    name: 'Penguin Games',
    startDate: '2008-08-22',
    endDate: '2008-08-26',
    startComment: 'The Penguin Games party begins',
    endComment: 'The Penguin Games party ends',
    roomChanges: {
      'beach': 4098,
      book: 4099,
      cave: 4100,
      coffee: 4101,
      cove: 4102,
      dock: 4103,
      forest: 4104,
      berg: 4105,
      rink: 4106,
      attic: 4107,
      pizza: 4109,
      plaza: 4110,
      mtn: 4111,
      lodge: 4112,
      village: 4113,
      forts: 4114,
      sport: 4115,
      town: 4116
    },
    music: {
      beach: 213,
      book: 240,
      cave: 249,
      coffee: 240,
      cove: 213,
      dock: 213,
      forest: 213,
      berg: 249,
      rink: 240,
      attic: 248,
      pizza: 240,
      plaza: 213,
      mtn: 240,
      lodge: 248,
      village: 213,
      forts: 213,
      sport: 249,
      town: 213
    }
  },
  {
    name: 'Fall Fair',
    startDate: '2008-09-26',
    endDate: '2008-10-06',
    roomChanges: {
      beach: 4119,
      beacon: 4120,
      cave: 4121,
      coffee: 4122,
      cove: 4123,
      dance: 4124,
      lounge: 4125,
      dock: 4126,
      forest: 4127,
      berg: 4128,
      mine: 4129,
      party: 4130,
      pizza: 4131,
      mtn: 4132,
      village: 4133,
      forts: 4134,
      town: 4135
    },
    music: {
      beach: 221,
      beacon: 221,
      cave: 221,
      coffee: 221,
      cove: 221,
      dance: 221,
      lounge: 221,
      dock: 221,
      forest: 221,
      berg: 221,
      mine: 221,
      party: 221,
      pizza: 221,
      mtn: 221,
      village: 221,
      forts: 221,
      town: 221
    },
    fairCpip: {
      iconFileId: 4449
    }
  },
  {
    name: '3rd Anniversary Party',
    startDate: '2008-10-24',
    endDate: '2008-10-27',
    roomChanges: {
      book: 4141,
      coffee: 4142,
      dance: 4143,
      town: 4144
    },
    music: {
      book: 250,
      coffee: 250,
      dance: 250,
      town: 250
    }
  },
  {
    name: 'Halloween Party',
    startDate: '2008-10-28',
    endDate: '2008-11-02',
    roomChanges: {
      beach: 4146,
      beacon: 4147,
      book: 4148,
      cave: 4149,
      coffee: 4150,
      cove: 4151,
      dance: 4152,
      lounge: 4153,
      dock: 4154,
      dojo: 4155,
      forest: 4156,
      shop: 4157,
      berg: 4158,
      light: 4159,
      attic: 4160,
      rink: 4161,
      shack: 4162,
      pet: 4163,
      pizza: 4164,
      plaza: 4165,
      party: 4166,
      mtn: 4167,
      lodge: 4168,
      village: 4169,
      forts: 4170,
      sport: 4171,
      town: 4172
    },
    music: {
      beach: 251,
      beacon: 251,
      book: 252,
      cave: 252,
      coffee: 252,
      cove: 251,
      dance: 224,
      lounge: 224,
      dock: 251,
      dojo: 252,
      forest: 251,
      shop: 252,
      berg: 251,
      light: 252,
      attic: 252,
      rink: 251,
      shack: 251,
      pet: 252,
      pizza: 252,
      plaza: 251,
      party: 253,
      mtn: 251,
      lodge: 252,
      village: 251,
      forts: 251,
      sport: 252,
      town: 251
    }
  },
  {
    name: 'Dig Out the Dojo',
    startDate: '2008-11-03',
    endDate: DIG_OUT_DOJO_END,
    startComment: 'The Dig Out the Dojo event begins',
    endComment: 'The Dig Out the Dojo event ends',
    roomChanges: {
      dojo: 4175,
      dojoext: 4176
    },
    updates: [
      {
        comment: 'The excavation progresses, and less snow covers the Dojo',
        date: '2008-11-10',
        roomChanges: {
          dojo: 4177,
          dojoext: 4178
        }
      }
    ],
    consequences: {
      roomComment: 'The dojo has a great reopening',
      roomChanges : {
        dojo: 4180
      }
    }
  },
  {
    name: 'Christmas Party',
    startDate: '2008-12-19',
    endDate: '2008-12-29',
    roomChanges: {
      beach: 4181,
      beacon: 4182,
      boiler: 4183,
      book: 4184,
      shipquarters: 4185,
      cave: 4186,
      coffee: 4187,
      agentcom: 4188,
      cove: 4189,
      shipnest: 4190,
      lounge: 4191,
      dock: 4192,
      dojo: 4193,
      dojoext: 4194,
      forest: 4195,
      agent: 4196,
      rink: 4197,
      berg: 4198,
      mine: 4199,
      shack: 4200,
      dance: 4201,
      dojohide: 4202,
      ship: 4203,
      pizza: 4204,
      plaza: 4205,
      shiphold: 4206,
      mtn: 4207,
      lodge: 4208,
      village: 4209,
      forts: 4210,
      town: 4211
    },
    music: {
      beach: 254,
      beacon: 254,
      boiler: 256,
      book: 255,
      shipquarters: 254,
      cave: 256,
      coffee: 255,
      cove: 254,
      shipnest: 254,
      lounge: 226,
      dock: 254,
      dojo: 256,
      dojoext: 254,
      forest: 254,
      rink: 254,
      berg: 254,
      mine: 256,
      shack: 255,
      dance: 226,
      dojohide: 256,
      ship: 254,
      pizza: 256,
      plaza: 254,
      shiphold: 254,
      mtn: 254,
      lodge: 254,
      village: 254,
      forts: 254,
      town: 254,
      light: 254
    },
    activeMigrator: true
  },
  {
    name: 'Dance-A-Thon',
    startDate: '2009-01-15',
    endDate: '2009-01-20',
    roomChanges: {
      boiler: 4216,
      lounge: 4217,
      dance: 4218,
      party: 4219,
      town: 4220
    },
    music: {
      dance: 258,
      party: 257
    }
  },
  {
    name: 'Winter Fiesta',
    startDate: '2009-01-23',
    endDate: '2009-01-25',
    roomChanges: {
      beach: 4223,
      coffee: 4224,
      cove: 4225,
      dock: 4226,
      forest: 4227,
      dance: 4228,
      pizza: 4229,
      plaza: 4230,
      lodge: 4231,
      village: 4232,
      forts: 4233,
      town: 4234
    },
    music: {
      beach: 229,
      coffee: 229,
      cove: 206,
      dock: 229,
      forest: 206,
      dance: 206,
      pizza: 206,
      plaza: 206,
      lodge: 229,
      village: 229,
      forts: 206,
      town: 206
    }
  },
  {
    name: 'Puffle Party',
    startDate: '2009-02-20',
    endDate: '2009-02-24',
    roomChanges: {
      beach: 4235,
      beacon: 4236,
      cave: 4237,
      cove: 4238,
      dance: 4239,
      dock: 4240,
      dojo: 4097,
      forest: 4241,
      berg: 4242,
      light: 4243,
      mtn: 4244,
      pet: 4245,
      plaza: 4246,
      party: 4247,
      attic: 4248,
      village: 4249,
      forts: 4250,
      town: 4251,
    },
    music: {
      town: 260,
      beach: 260,
      dock: 260,
      pet: 261,
      plaza: 259,
      forest: 259,
      cove: 259,
      berg: 259,
      beacon: 261,
      light: 31,
      cave: 240,
      dance: 243,
      forts: 260,
      party: 259,
      village: 260
    },
    construction: {
      date: '2009-02-13',
      changes: {
        beacon: 4258,
        cave: 4259,
        cove: 4260,
        forest: 4261,
        berg: 4262,
        light: 4263,
        dance: 4264,
        plaza: 4265,
        village: 4266,
        town: 4267
      }
    }
  },
  {
    name: 'St. Patrick\'s Day Party',
    startDate: '2009-03-13',
    endDate: '2009-03-17',
    roomChanges: {
      town: 4268,
      coffee: 4269,
      dance: 4270,
      forts: 4271,
      plaza: 4272,
      stage: 4273,
      forest: 4274,
      party: 4275,
      dock: 4276,
      berg: 4277,
      mtn: 4278,
      village: 4279
    },
    music: {
      town: 262,
      dance: 263,
      forts: 262,
      plaza: 262,
      stage: 0,
      forest: 208,
      dock: 262,
      mtn: 262,
      village: 262,
      party: 208
    },
    construction: {
      date: '2009-03-06',
      changes: {
        cove: 4282,
        forest: 4283,
        village: 4284
      }
    }
  },
  {
    name: 'Snow Sculpture Showcase',
    startDate: '2009-03-20',
    endDate: '2009-04-09',
    roomChanges: {
      beach: 5003,
      beacon: 5004,
      dock: 5005,
      light: 5006,
      mtn: 5007,
      village: 5008
    }
  },
  {
    name: 'Penguin Play Awards',
    startDate: '2009-03-20',
    endDate: '2009-04-09',
    roomChanges: {
      party: 4285,
      plaza: 4286,
      stage: 4287
    },
    music: {
      party: 40,
      plaza: 40,
      stage: 40
    },
    globalChanges: {
      'content/shorts/penguinsTime.swf': 4289
    }
  },
  {
    name: 'April Fools\' Party',
    startDate: '2009-04-01',
    endDate: '2009-04-06',
    roomChanges: {
      beach: 4290,
      beacon: 4291,
      boiler: 4292,
      boxdimension: 4293,
      party3: 4294,
      cave: 4295,
      coffee: 4296,
      cove: 4297,
      dock: 4298,
      dojo: 4299,
      dojoext: 4300,
      forest: 4301,
      berg: 4302,
      light: 4303,
      mine: 4304,
      shack: 4305,
      dance: 4306,
      dojohide: 4307,
      pizza: 4308,
      plaza: 4309,
      lodge: 4310,
      village: 4311,
      forts: 4312,
      town: 4313
    },
    music: {
      beach: 232,
      beacon: 201,
      boiler: 201,
      cave: 201,
      coffee: 201,
      cove: 232,
      dock: 232,
      forest: 232,
      berg: 232,
      light: 201,
      mine: 201,
      shack: 232,
      dance: 201,
      pizza: 201,
      plaza: 232,
      lodge: 201,
      village: 232,
      forts: 232,
      town: 232,
      party3: 264
    },
    localChanges: {
      'catalogues/party.swf': {
        'en': 4317
      },
      'membership/party3.swf': {
        'en': 4316
      }
    }
  },
  {
    name: 'Easter Egg Hunt',
    startDate: '2009-04-10',
    endDate: '2009-04-13',
    roomChanges: {
      beacon: 4974,
      cove: 4975,
      dojoext: 4976,
      shop: 4977,
      mtn: 4978,
      lodge: 4979,
      town: 4980
    },
    globalChanges: {
      'scavenger_hunt/hunt_ui.swf': [4982, 'easter_egg_hunt', 'easter_hunt'],
    },
    scavengerHunt2010: {
      'iconFileId': 4981
    }
  },
  {
    name: 'Medieval Party',
    startDate: '2009-05-08',
    endDate: '2009-05-17',
    roomChanges: {
      beach: 2403,
      rink: 2410,
      lodge: 2407,
      beacon: 4318,
      boiler: 4319,
      book: 4320,
      cave: 4321,
      coffee: 4322,
      cove: 4323,
      lounge: 4324,
      dock: 4325,
      forest: 4326,
      shop: 4327,
      light: 4328,
      attic: 4329,
      shack: 4330,
      dance: 4331,
      pet: 4332,
      pizza: 4333,
      plaza: 4334,
      mtn: 4335,
      village: 4336,
      forts: 4337,
      town: 4338,
      party1: 4339,
      party2: 4340,
      party3: 4341,
      party4: 4342,
      party5: 4343,
      party6: 4344,
      party7: 4350,
      party8: 4345,
      party9: 4346,
      party10: 4347,
      party11: 4348,
      party12: 4349,
      party13: 4351
    },
    music: {
      beach: 233,
      beacon: 235,
      boiler: 236,
      book: 234,
      cave: 236,
      coffee: 234,
      cove: 235,
      lounge: 235,
      dock: 233,
      forest: 235,
      shop: 234,
      rink: 236,
      light: 235,
      attic: 235,
      shack: 237,
      pet: 234,
      pizza: 234,
      plaza: 233,
      mtn: 236,
      lodge: 235,
      forts: 236,
      town: 233,
      party1: 235,
      party2: 266,
      party3: 266,
      party4: 266,
      party5: 266,
      party6: 266,
      party7: 266,
      party8: 266,
      party9: 266,
      party10: 266,
      party11: 266,
      party12: 266,
      party13: 265,
      village: 235
    },
    localChanges: {
      'catalogues/party.swf': {
        'en': 4352
      }
    }
  },
  {
    name: 'Adventure Party',
    startDate: '2009-06-12',
    endDate: '2009-06-16',
    roomChanges: {
      beach: 4356,
      cave: 4357,
      cove: 4358,
      dock: 4359,
      forest: 4360,
      berg: 4361,
      mine: 4362,
      dance: 4363,
      plaza: 4364,
      forts: 4365,
      rink: 4366,
      town: 4367,
      party: 4368
    },
    music: {
      beach: 267,
      cave: 268,
      cove: 267,
      dock: 267,
      forest: 267,
      berg: 268,
      mine: 268,
      dance: 269,
      plaza: 267,
      forts: 267,
      rink: 267,
      town: 267,
      party1: 267
    },
    construction: {
      date: '2009-06-05',
      changes: {
        beach: 4372,
        shipnest: 4373,
        cove: 4374,
        dock: 4375,
        forest: 4376,
        ship: 4377,
        plaza: 4378,
        shiphold: 4379,
        forts: 4380,
        town: 4381
      }
    }
  },
  {
    name: 'Music Jam',
    startDate: '2009-07-17',
    endDate: '2009-07-26',
    roomChanges: {
      party: 2451,
      party3: 4382,
      beach: 4383,
      cave: 4384,
      coffee: 4385,
      cove: 4386,
      lounge: 4387,
      dock: 4388,
      forest: 4389,
      berg: 4390,
      light: 4391,
      dance: 4392,
      party2: 4393,
      pizza: 4394,
      plaza: 4395,
      mtn: 4396,
      village: 4397,
      forts: 4398,
      rink: 4399,
      town: 4400
    },
    music: {
      dance: 242,
      forts: 240,
      lounge: 242,
      mtn: 232,
      pizza: 210,
      plaza: 271,
      town: 271,
      party3: 272
    },
    construction: {
      date: '2009-07-10',
      changes: {
        beach: 2464,
        coffee: 2466,
        cove: 2467,
        dock: 2468,
        forest: 2469,
        berg: 2470,
        light: 2471,
        village: 2472,
        forts: 2473,
        rink: 4405
      }
    }
  },
  {
    name: 'Festival of Flight',
    startDate: '2009-08-14',
    endDate: '2009-08-20',
    roomChanges: {
      beach: 4406,
      beacon: 4407,
      cave: 4408,
      cove: 4409,
      dock: 4410,
      forest: 4411,
      party: 4412,
      berg: 4413,
      dance: 4414,
      plaza: 4415,
      mtn: 4416,
      village: 4417,
      forts: 4418,
      party2: 4419,
      town: 4420
    },
    music: {
      beach: 277,
      beacon: 277,
      cave: 277,
      cove: 277,
      dance: 279,
      dock: 277,
      forest: 277,
      forts: 277,
      mtn: 277,
      plaza: 277,
      village: 277,
      town: 277,
      party: 278,
      party2: 278
    },
    construction: {
      date: '2009-08-07',
      changes: {
        beach: 4424,
        beacon: 4425,
        dock: 4426,
        forest: 4427,
        plaza: 4428,
        forts: 4429,
        town: 4430
      }
    }
  },
  {
    name: 'The Fair',
    startDate: '2009-09-04',
    endDate: '2009-09-14',
    roomChanges: {
      coffee: 2490,
      lounge: 2492,
      beach: 4431,
      beacon: 4432,
      party: 4433,
      cave: 4434,
      cove: 4435,
      dock: 4436,
      forest: 4437,
      party3: 4438,
      party2: 4439,
      berg: 4440,
      dance: 4441,
      pizza: 4442,
      plaza: 4443,
      mtn: 4444,
      village: 4445,
      forts: 4446,
      town: 4447
    },
    music: {
      coffee: 221,
      lounge: 221,
      beach: 221,
      beacon: 221,
      party: 221,
      cave: 221,
      cove: 221,
      dock: 221,
      forest: 221,
      party3: 221,
      party2: 221,
      berg: 221,
      dance: 221,
      pizza: 221,
      plaza: 221,
      mtn: 221,
      village: 221,
      forts: 221,
      town: 221
    },
    localChanges: {
      'catalogues/prizebooth.swf': {
        'en': 4448
      },
      'catalogues/prizeboothmember.swf': {
        'en': 4450
      }
    },
    fairCpip: {
      iconFileId: 4449
    }
  },
  {
    name: 'Sensei\'s Fire Scavenger Hunt',
    startDate: '2009-09-14',
    endDate: '2009-09-28',
    roomChanges: {
      beach: 4454,
      beacon: 4455,
      cave: 4456,
      coffee: 4457,
      cove: 4458,
      dock: 4459,
      dojo: 4460,
      dojoext: 4461,
      shop: 4462,
      agent: 4463,
      berg: 4464,
      attic: 4465,
      forest: 4466,
      shack: 4467,
      dojohide: 4468,
      pizza: 4469,
      plaza: 4470,
      pet: 4471,
      mtn: 4472,
      lodge: 4473,
      village: 4474,
      forts: 4475,
      sport: 4476,
      rink: 4477,
      town: 4478
    },
    globalChanges: {
      'scavenger_hunt/hunt_ui.swf': [4480, 'easter_egg_hunt', 'easter_hunt'],
    },
    scavengerHunt2010: {
      iconFileId: 4479
    }
  },
  {
    name: 'The Great Storm of 2009',
    event: true,
    startDate: '2009-10-11',
    endDate: '2009-11-02',
    roomChanges: {
      dojoext: 4983,
      shack: 4984,
      dojohide: 4985,
      mtn: 4986,
      village: 4987,
      beach: 4988,
      berg: 4989,
      dock: 4990,
      dojo: 4991,
      forts: 4992,
      plaza: 4993,
      town: 4994
    }
  },
  {
    name: '4th Anniversary Party',
    startDate: '2009-10-24',
    endDate: '2009-10-26',
    roomChanges: {
      book: 4451,
      coffee: 4452,
      town: 4453
    },
    music: {
      book: 250,
      coffee: 250,
      town: 250
    }
  },
  {
    name: 'Halloween Party',
    startDate: '2009-10-26',
    endDate: '2009-11-01',
    roomChanges: {
      mtn: 2533,
      beach: 4481,
      beacon: 4482,
      book: 4483,
      cave: 4484,
      coffee: 4485,
      cove: 4486,
      lounge: 4487,
      dock: 4488,
      dojo: 4489,
      dojoext: 4490,
      forest: 4491,
      shop: 4492,
      berg: 4493,
      party2: 4494,
      light: 4495,
      attic: 4496,
      mine: 4497,
      shack: 4498,
      dance: 4499,
      dojohide: 4500,
      pet: 4501,
      pizza: 4502,
      plaza: 4503,
      party: 4504,
      lodge: 4505,
      village: 4506,
      forts: 4507,
      rink: 4508,
      sport: 4509,
      town: 4510
    },
    music: {
      beach: 251,
      beacon: 251,
      book: 252,
      cave: 252,
      coffee: 252,
      cove: 251,
      lounge: 224,
      dock: 251,
      forest: 251,
      shop: 252,
      berg: 251,
      light: 252,
      attic: 252,
      mine: 252,
      shack: 274,
      dance: 224,
      pet: 252,
      pizza: 253,
      plaza: 251,
      mtn: 251,
      lodge: 252,
      village: 251,
      forts: 251,
      rink: 251,
      sport: 252,
      town: 251,
      party: 253,
      party2: 252
    },
    globalChanges: {
      'rooms/NOTLS3EN.swf': 4511
    }
  },
  {
    name: 'Celebration of Fire',
    startDate: FIRE_CELEBRATION_START,
    endDate: '2009-11-27',
    roomChanges: {
      // I actually don't know if this dojo exterior
      // is from this date, archives lists it as being from later one
      dojoext: 4995,
      dojohide: 4998,
      dojofire: 4999
    },
    construction: {
      date: '2009-11-05',
      comment: 'Construction for Card-Jitsu Fire in the Ninja Hideout begins',
      changes: {
        dojohide: 5000,
        dojoext: 5002
      },
      updates: [
        {
          comment: 'Construction for the Fire Dojo begins',
          date: '2009-11-13',
          changes: {
            dojofire: 5001,
            // reverting back to normality
            dojohide: 5092
          }
        }
      ]
    },
    updates: [
      {
        date: '2009-11-23',
        comment: 'Card-Jitsu Fire is now available',
        roomChanges: {
          dojohide: 4996,
          dojofire: 4997
        }
      }
    ]
  },
  {
    name: 'Winter Party',
    startDate: '2009-11-27',
    endDate: '2009-11-30',
    roomChanges: {
      mtn: 4512,
      village: 4513,
      rink: 4514,
      party: 4515,
      party2: 4516,
      party3: 4517,
      party4: 4518,
      party5: 4519,
      party6: 4520,
      party7: 4521,
      party8: 4522,
      party9: 4523,
      party10: 4524,
      party11: 4525
    },
    music: {
      rink: 280,
      village: 280,
      mtn: 280,
      party: 280,
      party2: 280,
      party3: 280,
      party4: 280,
      party5: 280,
      party6: 280,
      party7: 280,
      party8: 280,
      party9: 280,
      party10: 280,
      party11: 247
    },
    localChanges: {
      'close_ups/maze_map.swf': {
        'en': 4526
      }
    }
  },
  {
    name: 'New Year\'s Day 2010',
    startComment: 'New Year\'s Fireworks appear on the island',
    endComment: 'The New Year\'s celebration ends',
    startDate: NEW_YEARS_2010_UPDATE,
    endDate: '2010-01-04',
    roomChanges: {
      mtn: 2295,
      berg: 2296
    }
  },
  {
    name: 'Holiday Party',
    startDate: '2009-12-18',
    endDate: '2009-12-29',
    roomChanges: {
      ship: 2613,
      shipnest: 2601,
      shipquarters: 2598,
      shiphold: 2619,
      beach: 4540,
      cove: 4541,
      dojofire: 4542,
      light: 4543,
      village: 4544,
      beacon: 4545,
      forest: 4546,
      attic: 4547,
      pizza: 4548,
      forts: 4549,
      book: 4550,
      lounge: 4551,
      shop: 4552,
      party: 4553,
      plaza: 4554,
      town: 4555,
      dock: 4556,
      agent: 4557,
      shack: 4558,
      coffee: 4559,
      dojo: 4560,
      berg: 4561,
      dance: 4562,
      mtn: 4563,
      agentcom: 4564,
      dojoext: 4565,
      rink: 4566,
      dojohide: 4567,
      lodge: 4568
    },
    music: {
      attic: 255,
      beach: 254,
      beacon: 254,
      berg: 227,
      book: 255,
      coffee: 255,
      cove: 254,
      dance: 400,
      dock: 254,
      forest: 254,
      forts: 254,
      lodge: 255,
      lounge: 226,
      mtn: 254,
      pizza: 255,
      plaza: 254,
      rink: 254,
      shack: 254,
      town: 254,
      village: 254,
      party: 281
    },
    activeMigrator: true,
    construction: {
      date: '2009-12-11',
      changes: {
        beach: 4529,
        shipquarters: 4530,
        shipnest: 4531,
        lounge: 4532,
        dance: 4534,
        ship: 4535,
        plaza: 4536,
        shiphold: 4537,
        village: 4538,
        town: 4539
      }
    }
  },
  {
    name: 'Cave Expedition',
    startDate: '2010-01-22',
    endDate: CAVE_EXPEDITION_END,
    endComment: 'The Cave Expedition ends and the cave mine is temporarily closed',
    roomChanges: {
      'mine': 2297,
      'party1': 2298,
      'party2': 2299,
      'party3': 2300
    },
    'localChanges': {
      'catalogues/party.swf': {
        'en': 2301
      },
      'close_ups/digposter.swf': {
        'en': 2307
      },
      'close_ups/digposter2.swf': {
        'en': 2302
      },
      'close_ups/treasurepin1.swf': {
        'en': 2303
      },
      'close_ups/treasurepin2.swf': {
        'en': 2304
      },
      'close_ups/treasurepin3.swf': {
        'en': 2305
      },
      'close_ups/treasurepin4.swf': {
        'en': 2306
      }
    },
    consequences: {
      roomChanges: {
        mine: 2665
      }
    }
  },
  {
    name: 'Puffle Party 2010',
    startDate: '2010-02-18',
    endDate: '2010-02-25',
    roomChanges: {
      'beach': 2308,
      'beacon': 2309,
      'berg': 2310,
      'boxdimension': 2311,
      'cave': 2312,
      'cove': 2313,
      'dance': 2314,
      'dock': 2315,
      'forest': 2316,
      'forts': 2317,
      'light': 2318,
      'lodge': 2319,
      'mine': 2320,
      'party1': 2321,
      'party2': 2322,
      'pet': 2323,
      'town': 2325,
      'village': 2326
    },
    music: {
      'beach': 282,
      'beacon': 282,
      'berg': 282,
      'cave': 260,
      'cove': 282,
      'dance': 282,
      'dock': 282,
      'forest': 282,
      'forts': 282,
      'light': 282,
      'mine': 260,
      'pet': 282,
      'plaza': 282,
      'town': 282,
      'village': 282,
      'party1': 261,
      'party2': 261
    },
    construction: {
      date: PUFFLE_PARTY_10_CONST_START,
      changes: {
        'beacon': 2327,
        'berg': 2328,
        'cave': 2329,
        'dance': 2320,
        'forest': 2331,
        'light': 2332,
        'mine': 2333
      }
    }
  },
  {
    name: 'Penguin Play Awards 2010',
    startDate: '2010-03-18',
    endDate: '2010-03-29',
    music: {
      'pizza': 283,
      'plaza': 40,
      'stage': 40,
      'party': 40
    },
    roomChanges: {
      'dock': 2344,
      'mtn': 2345,
      'party': 2346,
      'pizza': 2347,
      'plaza': 2348,
      'stage': 2349,
      'town': 2350
    },
    globalChanges: {
      'content/shorts/fairyFables.swf': 2338,
      'content/shorts/goldenPuffle.swf': 2339,
      'content/shorts/ruby.swf': 2340,
      'content/shorts/squidzoid.swf': 2341,
      'content/shorts/underwater.swf': [2342, 'underwaterShort'],
      'content/winners.swf': [2343, 'voting_booth']
    },
    localChanges: {
      'catalogues/costume.swf': {
        'en': 2678
      }
    }
  },
  {
    name: 'April Fools\' Party 2010',
    startDate: '2010-03-31',
    endDate: '2010-04-05',
    roomChanges: {
      'dock': 2358,
      'forest': 2359,
      'shop': 2360,
      'berg': 2361,
      'light': 2362,
      'dance': 2363,
      'mine': 2364,
      'shack': 2365,
      'pizza': 2366,
      'lodge': 2367,
      'village': 2368,
      'forts': 2369,
      'town': 2370,
      'party': 2351,
      plaza: 5082
    },
    music: {
      'shop': 201,
      'beach': 232,
      'berg': 232,
      'boiler': 201,
      'cave': 201,
      'coffee': 201,
      'cove': 232,
      'dance': 231,
      'dock': 232,
      'forest': 232,
      'forts': 232,
      'light': 201,
      'lodge': 201,
      'mine': 201,
      'plaza': 232,
      'pizza': 201,
      'town': 232,
      'village': 232,
      'party': 261
    },
    localChanges: {
      'membership/oops_april_fools.swf': {
        'en': [2371, 'oops_party_room']
      }
    }
  },
  {
    name: 'Earth Day 2010',
    startDate: EARTH_DAY_2010_START,
    endDate: EARTH_DAY_2010_END,
    roomChanges: {
      'town': 2372,
      'coffee': 2373,
      'book': 2374,
      'plaza': 2375,
      'pet': 2376,
      'mtn': 2377,
      'village': 2378,
      'forest': 2379,
      'cove': 2380,
      'shack': 2381,
      'dojoext': 2382
    },
    music: {
      'town': 219,
      'plaza': 219
    },
    globalChanges: {
      'scavenger_hunt/recycle.swf': [2385, 'easter_egg_hunt', 'recycle_hunt']
    },
    scavengerHunt2010: {
      // file to this one was potentially named recycle_icon.swf, this info will be lost here though
      iconFileId: 2386,
      iconFilePath: 'scavenger_hunt/recycle_icon.swf'
    },
    construction: {
      date: '2010-04-15',
      changes: {
        'shack': 2387
      }
    },
    permanentChanges: {
      roomChanges: {
        forest: 2658
      }
    },
    consequences: {
      roomChanges: {
        // this file is from June, but it is being placed here as a placeholder for the file from april which is missing
        shack: 2669
      }
    }
  },
  {
    name: 'Medieval Party 2010',
    startDate: '2010-05-07',
    endDate: '2010-05-16',
    roomChanges: {
      'town': 2388,
      'coffee': 2389,
      'book': 2390,
      'dance': 2391,
      'lounge': 2392,
      'shop': 2393,
      'forts': 2394,
      'plaza': 2395,
      'pet': 2396,
      'pizza': 2397,
      'boiler': 2398,
      'cave': 2399,
      'forest': 2400,
      'cove': 2401,
      'dock': 2402,
      'beach': 2403,
      'light': 2404,
      'beacon': 2405,
      'village': 2406,
      'lodge': 2407,
      'attic': 2408,
      'mtn': 2409,
      'rink': 2410
    },
    music: {
      'beach': 233,
      'beacon': 233,
      'boiler': 233,
      'book': 233,
      'cave': 237,
      'coffee': 233,
      'cove': 235,
      'dance': 233,
      'dock': 233,
      'forest': 235,
      'forts': 236,
      'light': 233,
      'lodge': 233,
      'lounge': 233,
      'mine': 236,
      'mtn': 233,
      'pet': 233,
      'pizza': 233,
      'plaza': 233,
      'rink': 236,
      'shop': 234,
      'town': 233,
      'village': 233,
      'party1': 235,
      'party2': 266,
      'party3': 266,
      'party4': 266,
      'party5': 266,
      'party6': 266,
      'party7': 266,
      'party8': 266,
      'party9': 266,
      'party10': 266,
      'party11': 266,
      'party12': 266,
      'party13': 265,
      'party14': 286,
      'party15': 286,
      'party16': 287,
      'party17': 288,
      'party18': 265
    },
    construction: {
      date: '2010-04-29',
      changes: {
        'beach': 2411,
        'cave': 2412,
        'forts': 2413,
        'plaza': 2414,
        'town': 2415,
        'village': 2416
      }
    }
  },
  {
    name: 'Popcorn Explosion',
    startDate: '2010-05-18',
    endDate: EPF_RELEASE,
    roomChanges: {
      'agent': 2417,
      'village': 2418,
      'sport': 2419
    },
    updates: [
      {
        comment: 'Sports Shop closed for reconstruction',
        date: '2010-05-25',
        roomChanges: {
          'agent': 2420,
          'village': 2421
        }
      }
    ]
  },
  {
    name: 'Island Adventure Party 2010',
    startDate: '2010-06-18',
    endDate: '2010-06-28',
    roomChanges: {
      'town': 2426,
      'dance': 2427,
      'forts': 2428,
      'plaza': 2429,
      'forest': 2430,
      'lake': 2431,
      'cove': 2432,
      'dock': 2433,
      'beach': 2434,
      'village': 2435,
      'berg': 2436,
      'party': 2437,
      'party2': 2438
    },
    music: {
      'beach': 41,
      'cove': 291,
      'dance': 269,
      'dock': 41,
      'forest': 290,
      'forts': 291,
      'plaza': 291,
      'town': 268,
      'village': 291,
      'party': 267,
      'party2': 289
    },
    construction: {
      date: '2010-06-10',
      changes: {
        'beach': 2422,
        'cove': 2423,
        'plaza': 2424,
        'town': 2425
      }
    }
  },
  {
    name: 'Music Jam 2010',
    startDate: MUSIC_JAM_2010_START,
    endDate: '2010-07-19',
    roomChanges: {
      'party3': 2439,
      'beach': 2440,
      'party4': 2441,
      'cave': 2442,
      'coffee' :2443,
      'cove': 2444,
      'lounge': 2445,
      'dock': 2446,
      'forest': 2447,
      'berg': 2448,
      'light': 2449,
      'mine': 2450,
      'party': 2451,
      'dance': 2452,
      'party2': 2453,
      'pizza': 2454,
      'plaza': 2455,
      'forts': 2456,
      'rink': 2457,
      'village': 2458,
      'town': 2459
    },
    music: {
      'lounge': 271,
      'berg': 244,
      'mine': 247,
      'dance': 242,
      'pizza': 271,
      'plaza': 271,
      'forts': 271,
      'rink': 240,
      'village': 292,
      'town': 271,
      'party3': 293,
      'coffee': 0
    },
    localChanges: {
      'catalogues/merch.swf': {
        'en': 2460
      },
      'close_ups/poster.swf': {
        'en': 2461
      },
      'close_ups/music.swf': {
        'en': 2463
      }
    },
    updates: [
      {
        date: '2010-07-14',
        comment: 'The Penguin Band is taking a break',
        roomChanges: {
          berg: 5081
        }
      },
      {
        date: '2010-07-15',
        comment: 'New instruments are available in the Catalog',
        roomChanges: {},
        localChanges: {
          'catalogues/music.swf': {
            'en': 2462
          }
        }
      }
    ],
    construction: {
      date: MUSIC_JAM_2010_CONST_START,
      changes: {
        'beach': 2464,
        'coffee': 2466,
        'cove': 2467,
        'dock': 2468,
        'forest': 2469,
        'berg': 2470,
        'light': 2471,
        'village': 2472,
        'forts': 2473
      }
    }
  },
  {
    name: 'Mountain Expedition',
    startDate: '2010-08-12',
    endDate: '2010-08-19',
    roomChanges: {
      'party3': 2475,
      'party6': 2476,
      'party2': 2477,
      'party4': 2478,
      'plaza': 2479,
      'village': 2480,
      'party1': 2481,
      'party5': 2482,
      'town': 2483
    },
    localChanges: {
      'catalogues/merch.swf': {
        'en': 2485
      },
      'close_ups/poster.swf': {
        'en': 2487
      },
      'membership/party3.swf': {
        'en': 2486
      }
    },
    music: {
      'party2': 294,
      'party3': 295,
      'party4': 295,
      'party6': 256
    },
    construction: {
      date: '2010-08-05',
      changes: {
        'village': 2484
      }
    }
  },
  {
    name: 'The Fair 2010',
    startDate: FAIR_2010_START,
    endDate: '2010-09-13',
    roomChanges: {
      'town': 2489,
      'coffee': 2490,
      'dance': 2491,
      'lounge': 2492,
      'forts': 2493,
      'plaza': 2494,
      'forest': 2495,
      'cove': 2496,
      'berg': 2497,
      'dock': 2498,
      'beach': 2499,
      'beacon': 2500,
      'village': 2501,
      'mtn': 2502,
      'party': 2503,
      'party2': 2504,
      'party3': 2505
    },
    music: {
      'town': 297,
      'coffee': 221,
      'dance': 243,
      'lounge': 243,
      'plaza': 297,
      'village': 297,
      'mtn': 297,
      'forts': 297,
      'dock': 297,
      'beach': 297,
      'beacon': 221,
      'forest': 297,
      'berg': 297,
      'cove': 297,
      'party': 221,
      'party1': 221,
      'party2': 221,
      'party3': 221
    },
    fairCpip: {
      iconFileId: 2507
    },
    generalChanges: {
      'web_service/worldachievements.xml': 2515
    },
    localChanges: {
      'catalogues/prizebooth.swf': {
        'en': 2509
      },
      'catalogues/prizeboothmember.swf': {
        'en': 2510
      },
      'close_ups/poster.swf': {
        'en': 2508
      }
    },
    construction: {
      date: '2010-08-26',
      changes: {
        'beach': 2488
      }
    },
    updates: [
      {
        comment: 'New items were added to the prize booths',
        date: '2010-09-10',
        roomChanges: {},
        localChanges: {
          'catalogues/prizebooth.swf': {
            'en': 2511
          },
          'catalogues/prizeboothmember.swf': {
            'en': 2512
          }
        }
      }
    ]
  },
  {
    name: '5th Anniversary Party',
    startDate: ANNIVERSARY_5_START,
    endDate: '2010-10-25',
    roomChanges: {
      'book': 2521,
      'coffee': 2522,
      'town': 2523
    },
    music: {
      'town': 218,
      'coffee': 218,
      'book': 218
    }
  },
  {
    name: 'Halloween Party 2010',
    startDate: HALLOWEEN_2010_START,
    endDate: '2010-11-04',
    roomChanges: {
      'beach': 2524,
      'light': 2525,
      'beacon': 2526,
      'berg': 2527,
      'book': 2528,
      'cave': 2529,
      'forts': 2530,
      'rink': 2531,
      'village': 2532,
      'mtn': 2533,
      'lodge': 2534,
      'attic': 2535,
      'cove': 2536,
      'party4': 2537,
      'party3': 2538,
      'dock': 2539,
      'dojo': 2540,
      'dojoext': 2541,
      'dojofire': 2542,
      'plaza': 2543,
      'pet': 2544,
      'pizza': 2545,
      'shack': 2546,
      'forest': 2547,
      'party2': 2548,
      'party1': 2549,
      'party5': 2550,
      'town': 2551,
      'dance': 2553,
      'lounge': 2554,
      'shop': 2555,
      'dojohide': 2556
    },
    globalChanges: {
      'content/map.swf': 2560,
      'scavenger_hunt/hunt_ui.swf': [2562, 'hunt_ui', 'halloween_hunt'],
      'binoculars/empty.swf': 2563, // from 2007 party
      'igloo/assets/igloo_background.swf': 2564, // from 2011 party
      'rooms/NOTLS3EN.swf': 2565,
      'telescope/empty.swf': 2566
    },
    localChanges: {
      'catalogues/party.swf': {
        'en': 2558
      },
      'close_ups/halloweenposter.swf': {
        'en': 2557
      },
      'membership/membership_party3.swf': {
        'en': 2558
      }
    },
    generalChanges: {
      'web_service/worldachievements.xml': 2567
    },
    music: {
      'town': 251,
      'coffee': 252,
      'book': 252,
      'dance': 223,
      'lounge': 223,
      'shop': 252,
      'plaza': 251,
      'pet': 252,
      'pizza': 253,
      'village': 251,
      'lodge': 252,
      'attic': 252,
      'mtn': 251,
      'forts': 251,
      'rink': 251,
      'dock': 251,
      'beach': 251,
      'light': 252,
      'beacon': 251,
      'forest': 251,
      'berg': 251,
      'cove': 251,
      'cave': 252,
      'shack': 251,
      'party1': 251,
      'party2': 253,
      'party3': 299,
      'party4': 300,
      'party5': 298
    },
    scavengerHunt2010: {
      iconFileId: 2561
    }
  },
  {
    name: 'Sensei\'s Water Scavenger Hunt',
    startDate: '2010-11-16',
    endDate: WATER_HUNT_END,
    roomChanges: {
      'beach': 2568,
      'boiler': 2569,
      'book': 2570,
      'cave': 2571,
      'cavemine': 2572,
      'coffee': 2573,
      'cove': 2574,
      'lounge': 2575,
      'dock': 2576,
      'dojoext': 2577,
      'forest': 2578,
      'lake': 2579,
      'mine': 2580,
      'dojohide': 2581,
      'plaza': 2582,
      'pet': 2583,
      'rink': 2584,
      'forts': 2585,
      'town': 2586,
      'dojowater': 2587
    },
    globalChanges: {
      'scavenger_hunt/hunt_ui.swf': [2588, 'easter_egg_hunt', 'scavenger_hunt']
    },
    updates: [
      {
        date: PLANET_Y_2010,
        roomChanges: {
          'plaza': 2590
        }
      }
    ],
    scavengerHunt2010: {
      iconFileId: 2589
    }
  },
  {
    name: 'Celebration of Water',
    startDate: WATER_HUNT_END,
    endDate: WATER_CELEBRATION_END,
    roomChanges: {
      'dojoext': 2591,
      'dojohide': 2592,
      'dojowater': 2593
    },
    consequences: {
      roomComment: 'A video about Card-Jitsu Water is now on display at the Dojo Courtyard',
      roomChanges: {
        dojoext: 2655
      }
    }
  },
  {
    name: 'Holiday Party 2010',
    startDate: '2010-12-16',
    endDate: '2010-12-28',
    roomChanges: {
      'party99': 2594,
      'beach': 2595,
      'beacon': 2596,
      'book': 2597,
      'shipquarters': 2598,
      'coffee': 2599,
      'cove': 2600,
      'shipnest': 2601,
      'lounge': 2602,
      'dock': 2603,
      'dojo': 2604,
      'dojoext': 2605,
      'dojofire': 2606,
      'forest': 2607,
      'shop': 2608,
      'berg': 2609,
      'light': 2610,
      'attic': 2611,
      'party': 2612,
      'ship': 2613,
      'shack': 2614,
      'dance': 2615,
      'dojohide': 2616,
      'pizza': 2617,
      'plaza': 2618,
      'shiphold': 2619,
      'mtn': 2620,
      'lodge': 2621,
      'village': 2622,
      'forts': 2623,
      'rink': 2625,
      'town': 2627
    },
    globalChanges: {
      'content/map.swf': 2633
    },
    localChanges: {
      'close_ups/christmasposter.swf': {
        'en': 2629
      },
      'close_ups/poster.swf': {
        'en': 2630
      },
      'forms/coins_for_change.swf': {
        'en': 2631
      }
    },
    music: {
      'attic': 255,
      'beach': 254,
      'beacon': 254,
      'berg': 227,
      'book': 255,
      'coffee': 255,
      'cove': 254,
      'dance': 400,
      'dock': 254,
      'forest': 254,
      'forts': 254,
      'lodge': 255,
      'lounge': 226,
      'mtn': 254,
      'pizza': 255,
      'plaza': 254,
      'rink': 254,
      'shack': 254,
      'shop': 255,
      'village': 254,
      'town': 254,
      'party': 281,
      'party99': 254
    },
    activeMigrator: true,
    updates: [
      {
        date: STADIUM_GAMES_END,
        roomChanges: {
          'forts': 2624,
          'rink': 2626,
          'town': 2628
        },
        globalChanges: {
          'content/map.swf': 2632
        }
      }
    ]
  }
];