import { Version } from "../routes/versions";

/** All stage names */
type StageName = 'Squidzoid vs. Shadow Guy and Gamma Gal' |
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
  date: Version
  name: StageName,
}> = [
  {
    date: '2010-06-10',
    name: 'Ruby and the Ruby'
  },
  {
    date: '2010-07-21',
    name: 'Underwater Adventure'
  },
  {
    date: '2010-08-26',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal'
  },
  {
    date: '2010-09-16',
    name: 'Fairy Fables'
  },
  {
    date: '2010-10-08',
    name: 'Secrets of the Bamboo Forest'
  },
  {
    date: '2010-11-18',
    name: 'Space Adventure Planet Y'
  }
];