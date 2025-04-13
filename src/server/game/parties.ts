import { isGreater, Version } from "../routes/versions";

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
};

export const PARTIES: Party[] = [
  {
    name: 'Beta Test Party',
    start: '2005-Sep-21',
    end: '2005-Sep-22',
  },
  {
    name: 'Halloween Party 2005',
    start: '2005-Oct-27',
    end: '2005-Nov-01',
  },
  {
    name: 'The Great Puffle Discovery',
    start: '2005-Nov-15',
    end: '2005-Dec-05',
  },
  {
    name: 'Christmas Party 2005',
    start: '2005-Dec-22',
    end: '2005-Dec-26',
  },
  {
    name: 'Valentine\'s Day Celebration',
    start: '2006-Feb-14',
    end: '2006-Feb-15',
  },
  {
    name: 'Pizza Parlor Opening Party',
    start: '2006-Feb-24',
    end: '2006-Feb-28',
  },
  {
    name: 'April Fools Party 2006',
    start: '2006-Mar-31',
    end: '2006-Apr-03',
  },
  {
    name: 'Music Jam 2010 Construction',
    start: '2010-Jul-01',
    end: null,
    updates: [
      {
        update: {
          description: '4th of July Fireworks Removed',
          date: '2010-Jul-05'
        },
      }
    ]
  },
  {
    name: 'Music Jam 2010',
    start: '2010-Jul-09',
    end: '2010-Jul-19',
    hideEnd: true
  },
  {
    name: 'Mountain Expedition',
    start: '2010-Aug-12',
    end: '2010-Aug-19',
    hideEnd: true
  },
  {
    name: 'The Fair 2010',
    start: '2010-Sep-03',
    end: '2010-Sep-13',
    hideEnd: true,
    updates: [
      {
        update: {
          description: 'New items were added to the prize booths',
          date: '2010-Sep-10'
        },
      }
    ]
  },
  {
    name: '5th Anniversary',
    start: '2010-Oct-23',
    end: '2010-Oct-25',
    hideEnd: true
  },
  {
    name: 'Halloween Party 2010',
    start: '2010-Oct-28',
    end: '2010-Nov-04',
    hideEnd: true
  }
];

// code to enforce PARTIES being sorted, at runtime
for (let i = 1; i < PARTIES.length; i++) {
  const prev = PARTIES[i - 1];
  const curr = PARTIES[i];
  if (!isGreater(curr.start, prev.start)) {
    throw new Error(`Party ${curr.name} is out of order`);
  }
}