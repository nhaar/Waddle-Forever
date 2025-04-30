import { FIRST_STAGE_PLAY, PLANET_Y_2010 } from "../data/updates";
import { Version } from "../routes/versions";

/** All stage names */
type StageName = 'Space Adventure' |
  'The Twelfth Fish' |
  'Team Blue\'s Rally Debut' |
  'Quest for the Golden Puffle' |
  'Squidzoid vs. Shadow Guy and Gamma Gal' |
  'The Penguins that Time Forgot' |
  'Ruby and the Ruby' |
  'Team Blue vs. Team Red' |
  'The Haunting of the Viking Opera' |
  'Underwater Adventure' |
  'Fairy Fables' |
  'Space Adventure Planet Y' |
  'Norman Swarm Has Been Transformed' |
  'Secrets of the Bamboo Forest';

/** Data for each stage play */
export const STAGE_PLAYS: Array<{
  name: StageName,
  musicId: number
}> = [
  {
    name: 'Space Adventure',
    // we know this music was not the same in the second premiere,
    // but that SWF is completely lost, possibly it wasn't in the normal music directory
    musicId: 30
  },
  {
    name: 'The Twelfth Fish',
    musicId: 31
  },
  {
    name: 'Team Blue\'s Rally Debut',
    musicId: 33
  },
  {
    name: 'Quest for the Golden Puffle',
    musicId: 34
  },
  {
    name: 'The Penguins that Time Forgot',
    musicId: 35
  },
  {
    name: 'Team Blue vs. Team Red',
    musicId: 36
  },
  {
    name: 'The Haunting of the Viking Opera',
    musicId: 41
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
    name: 'Norman Swarm Has Been Transformed',
    musicId: 42
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
  name: StageName,
  stageFileId: number;
  costumeTrunkFileId: number;
  plazaFileId: number | null;
  party1?: number;
  /** If a stage's premiere is not in the timeline, add this as true to the first appearance in the timeline */
  notPremiere?: true
}> = [
  {
    date: FIRST_STAGE_PLAY,
    name: 'Space Adventure',
    plazaFileId: 4874,
    // stage from March
    stageFileId: 4875,
    costumeTrunkFileId: 4877
  },
  {
    date: '2007-12-14',
    name: 'The Twelfth Fish',
    // lost SWF
    plazaFileId: null,
    stageFileId: 4878,
    // costume trunk from may
    costumeTrunkFileId: 4879
  },
  // squidzoid in Jan 2008 is completely lost to time
  {
    date: '2008-02-08',
    name: 'Team Blue\'s Rally Debut',
    // lost
    plazaFileId: null,
    stageFileId: 4881,
    costumeTrunkFileId: 4882
  },
  // quest for golden puffle debut is lost, except its costume trunk
  // still won't add it though
  {
    date: '2008-03-14',
    name: 'Space Adventure',
    // plaza from 2007
    plazaFileId: 4874,
    stageFileId: 4875,
    // costume trunk from 2007
    costumeTrunkFileId: 4877
  },
  {
    date: '2008-05-09',
    name: 'The Twelfth Fish',
    // stage from 2007
    stageFileId: 4878,
    plazaFileId: null,
    costumeTrunkFileId: 4879
  },
  {
    date: '2008-06-13',
    name: 'The Penguins that Time Forgot',
    plazaFileId: null,
    stageFileId: 4883,
    costumeTrunkFileId: 4885
  },
  // squidzoid july is also completely lost
  // team blue rally 2 is completely lost
  // ruby and the red ruby debut in Pre-CPIP is completely lost/
  // post CPIP could be reconstructed
  {
    date: '2008-10-10',
    name: 'Space Adventure Planet Y',
    // from 2010
    stageFileId: 2294,
    // from 2010
    plazaFileId: 2286,
    costumeTrunkFileId: 4886
  },
  {
    date: '2008-11-21',
    name: 'Fairy Fables',
    // from 2009
    stageFileId: 2289,
    plazaFileId: 2284,
    // from 2010
    costumeTrunkFileId: 2280
  },
  {
    date: '2008-12-12',
    name: 'Quest for the Golden Puffle',
    // from 2010
    stageFileId: 2288,
    // from 2011 inaccurate
    plazaFileId: 2282,
    costumeTrunkFileId: 2275,
    notPremiere: true
  },
  {
    date: '2009-01-09',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    stageFileId: 2293, // from october 2009
    // I think this plaza is accurate (with sign)
    plazaFileId: 4887,
    costumeTrunkFileId: 4888,
    notPremiere: true
  },
  {
    date: '2009-02-13',
    name: 'Team Blue vs. Team Red',
    stageFileId: 4889, // from 2011
    plazaFileId: null, //lost
    costumeTrunkFileId: 4890
  },
  {
    date: '2009-04-10',
    name: 'Quest for the Golden Puffle',
    stageFileId: 2288, // from 2010
    plazaFileId: 2282, // from 2011 inaccurate
    costumeTrunkFileId: 2275
  },
  {
    date: '2009-05-08',
    name: 'The Haunting of the Viking Opera',
    stageFileId: 4892, // from 2011
    plazaFileId: null,
    costumeTrunkFileId: 4893
  },
  {
    date: '2009-06-12',
    name: 'Fairy Fables',
    stageFileId: 2289,
    plazaFileId: 2284,
    costumeTrunkFileId: 2280
  },
  {
    date: '2009-07-10',
    name: 'Ruby and the Ruby',
    // both 2 below are inaccurate
    stageFileId: 2291,
    plazaFileId: 2283,
    costumeTrunkFileId: 2277,
    notPremiere: true
  },
  {
    date: '2009-08-21',
    name: 'Underwater Adventure',
    stageFileId: 2292, // recreation
    plazaFileId: null,
    costumeTrunkFileId: 2278 // 2011
  },
  {
    date: '2009-09-11',
    name: 'The Penguins that Time Forgot',
    stageFileId: 4895,
    plazaFileId: 4896,
    costumeTrunkFileId: 4885
  },
  {
    date: '2009-10-09',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    stageFileId: 2293,
    plazaFileId: 2287,
    costumeTrunkFileId: 4888 // from jan 2009
  },
  {
    date: '2009-11-13',
    name: 'Norman Swarm Has Been Transformed',
    stageFileId: 4897,
    plazaFileId: 4898,
    costumeTrunkFileId: 4899, // from april 2011,
    party1: 4900
  },
  {
    date: '2009-12-25',
    name: 'Quest for the Golden Puffle',
    costumeTrunkFileId: 2275, // from 2008 unknown if accurate,
    plazaFileId: 2282, // from 2011, inaccurate
    stageFileId: 2288 // from March, unknown if accurate
  },
  {
    date: '2010-01-08',
    name: 'Fairy Fables',
    costumeTrunkFileId: 2280,
    plazaFileId: 2284, // accuracy unknown
    stageFileId: 2289 // from 2009, unknown if accurate
  },
  {
    date: '2010-02-11',
    name: 'Secrets of the Bamboo Forest',
    costumeTrunkFileId: 2276, // from October, unknown if accurate
    plazaFileId: 2285, // from 2011, unknown if accurate
    stageFileId: 2290 // from October 10, unknown if accurate
  },
  {
    date: '2010-03-29',
    name: 'Quest for the Golden Puffle',
    costumeTrunkFileId: 2275, // from 2008 unknown if accurate 
    plazaFileId: 2282, // from 2011, inaccurate
    stageFileId: 2288 // accurate
  },
  {
    date: '2010-06-10',
    name: 'Ruby and the Ruby',
    costumeTrunkFileId: 2277, // From 2009, unknown if accurate
    plazaFileId: 2283, // from 2011, inaccurate
    stageFileId: 2291 // from Dec 2010, unknown if accurate
  },
  {
    date: '2010-07-21',
    name: 'Underwater Adventure',
    costumeTrunkFileId: 2278, // frmo 2011 unknown if accurate
    plazaFileId: null, // LOST FILE
    stageFileId: 2292
  },
  {
    date: '2010-08-26',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    costumeTrunkFileId: 2279, // from march 2011 unknown if accurate
    plazaFileId: 2287, // no sign, unknown if accurate
    stageFileId: 2293 // frmo 2009, unknown if accurate
  },
  {
    date: '2010-09-16',
    name: 'Fairy Fables',
    costumeTrunkFileId: 2280, // from january 10, unknown if accurate
    plazaFileId: 2284, // accuracy unknown
    stageFileId: 2289 // from 2009, unknown if accurate
  },
  {
    date: '2010-10-08',
    name: 'Secrets of the Bamboo Forest',
    costumeTrunkFileId: 2276,
    plazaFileId: 2285, // from 2011, unknown if accurate
    stageFileId: 2290
  },
  {
    date: PLANET_Y_2010,
    name: 'Space Adventure Planet Y',
    costumeTrunkFileId: 2281,
    plazaFileId: 2286, // accurate
    stageFileId: 2294
  },
  {
    date: '2010-12-28',
    name: 'Ruby and the Ruby',
    costumeTrunkFileId: 2277, // From 2009, unknown if accurate
    plazaFileId: 2283, // from 2011, inaccurate
    stageFileId: 2291 // accurate
  }
];