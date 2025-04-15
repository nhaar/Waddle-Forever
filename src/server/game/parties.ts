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
  paths: string | string[];

  /** If the party changes the music, all changes that happened */
  music?: MusicUpdate
  /** If the party has new global paths, all of them */
  globalPaths?: PathsUpdate

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
  path: string
};

export const PARTIES: Party[] = [
  {
    name: 'Beta Test Party',
    start: '2005-Sep-21',
    end: '2005-Sep-22',
    paths: '2005/beta_test_party'
  },
  {
    name: 'Halloween Party 2005',
    start: '2005-Oct-27',
    end: '2005-Nov-01',
    paths: '2005/halloween_2005'
  },
  {
    name: 'The Great Puffle Discovery',
    start: '2005-Nov-15',
    end: '2005-Dec-05',
    paths: '2005/puffle_discovery'
  },
  {
    name: 'Christmas Party 2005',
    start: '2005-Dec-22',
    end: '2005-Dec-26',
    paths: '2005/christmas_2005'
  },
  {
    name: 'Valentine\'s Day Celebration',
    start: '2006-Feb-14',
    end: '2006-Feb-15',
    paths: '2006/valentine_day_celebration'
  },
  {
    name: 'Pizza Parlor Opening Party',
    start: '2006-Feb-24',
    end: '2006-Feb-28',
    paths: '2006/pizza_parlor_opening_party'
  },
  {
    name: 'April Fools Party 2006',
    start: '2006-Mar-31',
    end: '2006-Apr-03',
    paths: '2006/april_fools_2006'
  },
  {
    name: 'Music Jam 2010 Construction',
    start: '2010-Jul-01',
    end: null,
    paths: '2010/music_jam_construction',
    updates: [
      {
        update: null,
        path: '2010/4th_of_july',
      },
      {
        update: {
          description: '4th of July Fireworks Removed',
          date: '2010-Jul-05'
        },
        path: '2010/music_jam_construction_no_fireworks'
      }
    ]
  },
  {
    name: 'Music Jam 2010',
    start: '2010-Jul-09',
    end: '2010-Jul-19',
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
    start: '2010-Aug-12',
    end: '2010-Aug-19',
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
    start: '2010-Sep-03',
    end: '2010-Sep-13',
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
          date: '2010-Sep-10'
        },
        path: '2010/fair_2010_end'
      }
    ]
  },
  {
    name: '5th Anniversary',
    start: '2010-Oct-23',
    end: '2010-Oct-25',
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
    start: '2010-Oct-28',
    end: '2010-Nov-04',
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
    start: '2010-Nov-16',
    end: '2010-Nov-24',
    paths: ['2010/water_scavenger_hunt', '2010_scavenger_hunt'],
    globalPaths: {
      'scavenger_hunt_icon': 'scavenger_hunt/scavenger_hunt_icon.swf',
      'hunt_ui': 'scavenger_hunt/hunt_ui.swf',
      'easter_egg_hunt': 'scavenger_hunt/hunt_ui.swf',
      'scavenger_hunt': 'scavenger_hunt/hunt_ui.swf'
    }
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