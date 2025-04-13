import { findIndexLeftOf } from "../../common/utils";
import { isGreater, isGreaterOrEqual, Version } from "../routes/versions";

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
    hideEnd: true
  },
  {
    name: 'Mountain Expedition',
    start: '2010-Aug-12',
    end: '2010-Aug-19',
    paths: '2010/mountain_expedition',
    hideEnd: true
  },
  {
    name: 'The Fair 2010',
    start: '2010-Sep-03',
    end: '2010-Sep-13',
    paths: '2010/fair_2010',
    hideEnd: true,
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
    hideEnd: true
  },
  {
    name: 'Halloween Party 2010',
    start: '2010-Oct-28',
    end: '2010-Nov-04',
    paths: '2010/halloween_party_2010',
    hideEnd: true
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