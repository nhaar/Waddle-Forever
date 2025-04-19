import { Version } from "../routes/versions";

/** All stage names */
type StageName = 'Quest for the Golden Puffle' |
  'Squidzoid vs. Shadow Guy and Gamma Gal' |
  'Ruby and the Ruby' |
  'Underwater Adventure' |
  'Fairy Fables' |
  'Space Adventure Planet Y' |
  'Secrets of the Bamboo Forest';

/** Data for each stage play */
export const STAGE_PLAYS: Array<{
  name: StageName,
  musicId: number
}> = [
  {
    name: 'Quest for the Golden Puffle',
    musicId: 34
  },
  {
    name: 'Ruby and the Ruby',
    musicId: 37
  },
  {
    name: 'Underwater Adventure',
    musicId: 230
  },
  {
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    musicId: 32
  },
  {
    name: 'Fairy Fables',
    musicId: 39
  },
  {
    name: 'Secrets of the Bamboo Forest',
    musicId: 43
  },
  {
    name: 'Space Adventure Planet Y',
    musicId: 38
  }
];

/** Timeline of stage play debuts */
export const STAGE_TIMELINE: Array<{
  date: Version;
  updateId: number;
  name: StageName,
  stageFileId: number;
  costumeTrunkFileId: number;
  plazaFileId: number | null;
}> = [
  {
    date: '2009-12-25',
    name: 'Quest for the Golden Puffle',
    updateId: 40,
    costumeTrunkFileId: 2275, // from 2008 unknown if accurate,
    plazaFileId: 2282, // from 2011, inaccurate
    stageFileId: 2288 // from March, unknown if accurate
  },
  {
    date: '2010-01-08',
    name: 'Fairy Fables',
    updateId: 41,
    costumeTrunkFileId: 2280,
    plazaFileId: 2284, // accuracy unknown
    stageFileId: 2289 // from 2009, unknown if accurate
  },
  {
    date: '2010-02-11',
    name: 'Secrets of the Bamboo Forest',
    updateId: 42,
    costumeTrunkFileId: 2276, // from October, unknown if accurate
    plazaFileId: 2285, // from 2011, unknown if accurate
    stageFileId: 2290 // from October 10, unknown if accurate
  },
  {
    date: '2010-03-29',
    name: 'Quest for the Golden Puffle',
    updateId: 43,
    costumeTrunkFileId: 2275, // from 2008 unknown if accurate 
    plazaFileId: 2282, // from 2011, inaccurate
    stageFileId: 2288 // accurate
  },
  {
    date: '2010-06-10',
    name: 'Ruby and the Ruby',
    updateId: 44,
    costumeTrunkFileId: 2277, // From 2009, unknown if accurate
    plazaFileId: 2283, // from 2011, inaccurate
    stageFileId: 2291 // from Dec 2010, unknown if accurate
  },
  {
    date: '2010-07-21',
    name: 'Underwater Adventure',
    updateId: 45,
    costumeTrunkFileId: 2278, // frmo 2011 unknown if accurate
    plazaFileId: null, // LOST FILE
    stageFileId: 2292
  },
  {
    date: '2010-08-26',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    updateId: 46,
    costumeTrunkFileId: 2279, // from march 2011 unknown if accurate
    plazaFileId: 2287, // no sign, unknown if accurate
    stageFileId: 2293 // frmo 2009, unknown if accurate
  },
  {
    date: '2010-09-16',
    name: 'Fairy Fables',
    updateId: 47,
    costumeTrunkFileId: 2280, // from january 10, unknown if accurate
    plazaFileId: 2284, // accuracy unknown
    stageFileId: 2289 // from 2009, unknown if accurate
  },
  {
    date: '2010-10-08',
    name: 'Secrets of the Bamboo Forest',
    updateId: 48,
    costumeTrunkFileId: 2276,
    plazaFileId: 2285, // from 2011, unknown if accurate
    stageFileId: 2290
  },
  {
    date: '2010-11-18',
    name: 'Space Adventure Planet Y',
    updateId: 49,
    costumeTrunkFileId: 2281,
    plazaFileId: 2286, // accurate
    stageFileId: 2294
  },
  {
    date: '2010-12-28',
    name: 'Ruby and the Ruby',
    updateId: 50,
    costumeTrunkFileId: 2277, // From 2009, unknown if accurate
    plazaFileId: 2283, // from 2011, inaccurate
    stageFileId: 2291 // accurate
  }
];