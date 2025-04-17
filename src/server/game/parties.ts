import { findIndexLeftOf } from "../../common/utils";
import { isGreater, isGreaterOrEqual, Version } from "../routes/versions";
import { MusicUpdate, PathsUpdate } from "./crumbs";

/** Object for documenting a party/event from Club Penguin */
export type Party = {
  /** Name of the party that will be displayed in the timeline */
  name: string;
  /** Date party starts */
  start: Version;
  /** Date of the first day the party was removed. If null, this party ends when the next starts. */
  end: Version | null;
  /** List of changes in the party */
  updates?: PartyStage[];
  paths?: string | string[];

  /** If the party changes the music, all changes that happened */
  music?: MusicUpdate
  /** If the party has new global paths, all of them */
  globalPaths?: PathsUpdate
  /** If the party has new local paths, all of them */
  localPaths?: PathsUpdate
  activeMigrator?: true;

  // TODO temporary features for while the timeline is not complete
  hideEnd?: true;
};

export type PartyStage = {
  // null was for a path implementation, will be effectively used later
  /** null if this wasn't an update, but at the start of party */
  update: {
    /** Description of the update for the timeline */
    description: string;
    date: Version;
  } | null;
  path?: string
};

export const PARTIES: Party[] = [
  {
    name: 'Beta Test Party',
    start: '2005-09-21',
    end: '2005-09-22',
    paths: '2005/beta_test_party'
  },
  {
    name: 'Halloween Party 2005',
    start: '2005-10-27',
    end: '2005-11-01',
    paths: '2005/halloween_2005'
  },
  {
    name: 'The Great Puffle Discovery',
    start: '2005-11-15',
    end: '2005-12-05',
    paths: '2005/puffle_discovery'
  },
  {
    name: 'Christmas Party 2005',
    start: '2005-12-22',
    end: '2005-12-26',
    paths: '2005/christmas_2005'
  },
  {
    name: 'Valentine\'s Day Celebration',
    start: '2006-02-14',
    end: '2006-02-15',
    paths: '2006/valentine_day_celebration'
  },
  {
    name: 'Pizza Parlor Opening Party',
    start: '2006-02-24',
    end: '2006-02-28',
    paths: '2006/pizza_parlor_opening_party'
  },
  {
    name: 'April Fools Party 2006',
    start: '2006-03-31',
    end: '2006-04-03',
    paths: '2006/april_fools_2006'
  },
  {
    name: 'New Year\'s Day 2010',
    start: '2010-01-01',
    end: '2010-01-04'
  },
  {
    name: 'Cave Expedition',
    start: '2010-01-22',
    end: '2010-01-29',
    paths: '2010/cave_expedition'
  },
  {
    name: 'Puffle Party 2010 Construction',
    start: '2010-02-11',
    end: null,
    paths: '2010/puffle_party_const'
  },
  {
    name: 'Puffle Party 2010',
    start: '2010-02-18',
    end: '2010-02-25',
    paths: '2010/puffle_party',
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
    }
  },
  {
    name: 'Penguin Play Awards 2010',
    start: '2010-03-18',
    end: '2010-03-29',
    paths: '2010/penguin_play_awards',
    music: {
      'pizza': 283,
      'plaza': 40,
      'stage': 40,
      'party': 40
    },
    globalPaths: {
      'voting_booth': 'content/winners.swf',
      'underwaterShort': 'content/shorts/underwater.swf'
    }
  },
  {
    name: 'April Fools\' Party 2010',
    start: '2010-03-31',
    end: '2010-04-05',
    paths: '2010/april_fools',
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
    localPaths: {
      'oops_party_room': 'membership/oops_april_fools.swf'
    }
  },
  {
    name: 'Earth Day 2010 Construction',
    start: '2010-04-15',
    end: null,
    paths: '2010/earth_day_const'
  },
  {
    name: 'Earth Day 2010',
    start: '2010-04-21',
    end: '2010-04-27',
    paths: ['2010/earth_day', '2010_scavenger_hunt'],
    music: {
      'town': 219,
      'plaza': 219
    },
    globalPaths: {
      'scavenger_hunt_icon': 'scavenger_hunt/recycle_icon.swf',
      'hunt_ui': 'scavenger_hunt/recycle.swf',
      'easter_egg_hunt': 'scavenger_hunt/recycle.swf',
      'recycle_hunt': 'scavenger_hunt/recycle.swf'
    }
  },
  {
    name: 'Medieval Party 2010 Construction',
    start: '2010-04-29',
    end: null,
    paths: '2010/medieval_const'
  },
  {
    name: 'Medieval Party 2010',
    start: '2010-05-07',
    end: '2010-05-16',
    paths: '2010/medieval',
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
    }
  },
  {
    name: 'Popcorn Explosion',
    start: '2010-05-18',
    end: '2010-05-27',
    paths: '2010/popcorn_explosion',
    updates: [
      {
        update: {
          description: 'Sports Shop closed for reconstruction',
          date: '2010-05-25'
        }
      }
    ]
  },
  {
    name: 'Island Adventure Party 2010 Construction',
    start: '2010-06-10',
    end: null,
    paths: '2010/island_adventure_construction'
  },
  {
    name: 'Island Adventure Party 2010',
    start: '2010-06-18',
    end: '2010-06-28',
    paths: '2010/island_adventure',
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
    }
  },
  {
    name: 'Music Jam 2010 Construction',
    start: '2010-07-01',
    end: null,
    paths: '2010/music_jam_construction',
    updates: [
      {
        update: {
          description: '4th of July Fireworks Removed',
          date: '2010-07-05'
        }
      }
    ]
  },
  {
    name: 'Music Jam 2010',
    start: '2010-07-09',
    end: '2010-07-19',
    paths: '2010/music_jam',
    hideEnd: true,
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
    }
  },
  {
    name: 'Mountain Expedition',
    start: '2010-08-12',
    end: '2010-08-19',
    paths: '2010/mountain_expedition',
    hideEnd: true,
    music: {
      'party2': 294,
      'party3': 295,
      'party4': 295,
      'party6': 256
    }
  },
  {
    name: 'The Fair 2010',
    start: '2010-09-03',
    end: '2010-09-13',
    paths: '2010/fair_2010',
    hideEnd: true,
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
    globalPaths: {
      'tickets': 'tickets.swf',
      'ticket_icon': 'ticket_icon.swf'
    },
    updates: [
      {
        update: null,
        path: '2010/fair_2010_start'
      },
      {
        update: {
          description: 'New items were added to the prize booths',
          date: '2010-09-10'
        },
        path: '2010/fair_2010_end'
      }
    ]
  },
  {
    name: '5th Anniversary',
    start: '2010-10-23',
    end: '2010-10-25',
    paths: '2010/5th_anniversary_party',
    hideEnd: true,
    music: {
      'town': 218,
      'coffee': 218,
      'book': 218,
      'stage': 43
    }
  },
  {
    name: 'Halloween Party 2010',
    start: '2010-10-28',
    end: '2010-11-04',
    paths: ['2010/halloween_party_2010', '2010_scavenger_hunt'],
    hideEnd: true,
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
    globalPaths: {
      'scavenger_hunt_icon': 'scavenger_hunt/scavenger_hunt_icon.swf',
      'hunt_ui': 'scavenger_hunt/hunt_ui.swf',
      'halloween_hunt': 'scavenger_hunt/hunt_ui.swf'
    }
  },
  {
    name: 'Sensei\'s Water Scavenger Hunt',
    start: '2010-11-16',
    end: null,
    paths: ['2010/water_scavenger_hunt', '2010_scavenger_hunt'],
    globalPaths: {
      'scavenger_hunt_icon': 'scavenger_hunt/scavenger_hunt_icon.swf',
      'hunt_ui': 'scavenger_hunt/hunt_ui.swf',
      'easter_egg_hunt': 'scavenger_hunt/hunt_ui.swf',
      'scavenger_hunt': 'scavenger_hunt/hunt_ui.swf'
    }
  },
  {
    name: 'Celebration of Water',
    start: '2010-11-24',
    end: '2010-12-02',
    paths: '2010/water_celebration'
  },
  {
    name: 'Holiday Party 2010',
    start: '2010-12-16',
    end: '2010-12-28',
    paths: '2010/holiday_party',
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
    activeMigrator: true
  }
];

export function findCurrentParty(date: Version): Party | null {
  const partyIndex = findIndexLeftOf(date, PARTIES, (date, parties, i) => {
    return (isGreaterOrEqual(date, parties[i].start));
  });
  // no party has started
  if (partyIndex === -1) {
    return null;
  } else {
    const party = PARTIES[partyIndex];
    // latest party has ended already if date >= end
    if (isGreaterOrEqual(date, party.end ?? PARTIES[partyIndex + 1].start)) {
      return null;
    } else {
      return party;
    }
  }
}

export function findCurrentUpdateInParty(date: Version, updates: PartyStage[]): PartyStage {
  const index = findIndexLeftOf(date, updates, (date, updates, i) => {
    const cur = updates[i].update;
    return cur === null || isGreaterOrEqual(date, cur.date);
  });
  return updates[index];
}

// code to enforce PARTIES being sorted, at runtime
for (let i = 1; i < PARTIES.length; i++) {
  const prev = PARTIES[i - 1];
  const curr = PARTIES[i];
  if (!isGreater(curr.start, prev.start)) {
    throw new Error(`Party ${curr.name} is out of order`);
  }
}