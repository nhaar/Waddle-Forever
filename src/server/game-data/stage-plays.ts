import { Update } from "./updates";
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
  stageFileRef: string;
  costumeTrunkFileRef: string;
  plazaFileRef: string | null;
  party1?: string;
  /** If a stage's premiere is not in the timeline, add this as true to the first appearance in the timeline */
  notPremiere?: true
}> = [
  {
    date: Update.FIRST_STAGE_PLAY,
    name: 'Space Adventure',
    plazaFileRef: 'archives:ArtworkRoomsPlaza47.swf',
    // stage from March
    stageFileRef: 'archives:SpaceAdventure1Stage.swf',
    costumeTrunkFileRef: 'archives:SpaceAdventurePlanetXCostumeTrunk.swf'
  },
  {
    date: '2007-12-14',
    name: 'The Twelfth Fish',
    // lost SWF
    plazaFileRef: null,
    stageFileRef: 'archives:RoomsStage-Christmas2007.swf',
    // costume trunk from may
    costumeTrunkFileRef: 'archives:May2008Costume.swf'
  },
  // squidzoid in Jan 2008 is completely lost to time
  {
    date: '2008-02-08',
    name: 'Team Blue\'s Rally Debut',
    // lost
    plazaFileRef: null,
    stageFileRef: 'archives:RoomsStage-February2008.swf',
    costumeTrunkFileRef: 'archives:February2008Costume.swf'
  },
  // quest for golden puffle debut is lost, except its costume trunk
  // still won't add it though
  {
    date: '2008-03-14',
    name: 'Space Adventure',
    // plaza from 2007
    plazaFileRef: 'archives:ArtworkRoomsPlaza47.swf',
    stageFileRef: 'archives:SpaceAdventure1Stage.swf',
    // costume trunk from 2007
    costumeTrunkFileRef: 'archives:SpaceAdventurePlanetXCostumeTrunk.swf'
  },
  {
    date: '2008-05-09',
    name: 'The Twelfth Fish',
    // stage from 2007
    stageFileRef: 'archives:RoomsStage-Christmas2007.swf',
    plazaFileRef: null,
    costumeTrunkFileRef: 'archives:May2008Costume.swf'
  },
  {
    date: '2008-06-13',
    name: 'The Penguins that Time Forgot',
    plazaFileRef: null,
    stageFileRef: 'archives:RoomsStage-June2008.swf',
    costumeTrunkFileRef: 'archives:June08Costume.swf'
  },
  // squidzoid july is also completely lost
  // team blue rally 2 is completely lost
  // post CPIP could be reconstructed
  {
    date: Update.RUBY_DEBUT,
    name: 'Ruby and the Ruby',
    stageFileRef: 'recreation:ruby_play_debut.swf',
    plazaFileRef: 'recreation:plaza_ruby_no_weather.swf',
    // this might be inaccurate
    costumeTrunkFileRef: 'archives:July09Costume.swf'
  },
  {
    date: '2008-10-10',
    name: 'Space Adventure Planet Y',
    // from 2010
    stageFileRef: 'archives:RoomsStage-November2010.swf',
    // from 2010
    plazaFileRef: 'archives:RoomsPlaza-Play9.swf',
    costumeTrunkFileRef: 'archives:October2008Costume.swf'
  },
  {
    date: '2008-11-21',
    name: 'Fairy Fables',
    // from 2009
    stageFileRef: 'archives:RoomsStage-June2009.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play10.swf',
    // from 2010
    costumeTrunkFileRef: 'archives:Jan10Stage.swf'
  },
  {
    date: '2008-12-12',
    name: 'Quest for the Golden Puffle',
    // from 2010
    stageFileRef: 'archives:RoomsStage-May2010.swf',
    plazaFileRef: 'recreation:plaza_golden_puffle_no_weather.swf',
    costumeTrunkFileRef: 'archives:December2008Costume.swf',
    notPremiere: true
  },
  {
    date: '2009-01-09',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    stageFileRef: 'archives:RoomsStage-October2009.swf', // from october 2009
    // I think this plaza is accurate (with sign)
    plazaFileRef: 'recreation:plaza_squidzoid_sign.swf',
    costumeTrunkFileRef: 'archives:January2009Costume.swf',
    notPremiere: true
  },
  {
    date: '2009-02-13',
    name: 'Team Blue vs. Team Red',
    stageFileRef: 'archives:Stage2011Aug17.swf', // from 2011
    plazaFileRef: null, //lost
    costumeTrunkFileRef: 'archives:February2009Costume.swf'
  },
  {
    date: '2009-04-10',
    name: 'Quest for the Golden Puffle',
    stageFileRef: 'archives:RoomsStage-May2010.swf', // from 2010
    plazaFileRef: 'recreation:plaza_golden_puffle_no_weather.swf',
    costumeTrunkFileRef: 'archives:December2008Costume.swf'
  },
  {
    date: '2009-05-08',
    name: 'The Haunting of the Viking Opera',
    stageFileRef: 'archives:RoomsStage-February2011.swf', // from 2011
    plazaFileRef: null,
    costumeTrunkFileRef: 'archives:February2011HauntingOfTheVikingOperaCostumeTrunk.swf'
  },
  {
    date: '2009-06-12',
    name: 'Fairy Fables',
    stageFileRef: 'archives:RoomsStage-June2009.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play10.swf',
    costumeTrunkFileRef: 'archives:Jan10Stage.swf'
  },
  {
    date: '2009-07-10',
    name: 'Ruby and the Ruby',
    // both 2 below are inaccurate
    stageFileRef: 'archives:RoomsStage-December2010.swf',
    plazaFileRef: 'recreation:plaza_ruby_no_weather.swf',
    costumeTrunkFileRef: 'archives:July09Costume.swf',
    notPremiere: true
  },
  {
    date: '2009-08-21',
    name: 'Underwater Adventure',
    stageFileRef: 'recreation:underwater_adventure_no_pin.swf', // recreation
    plazaFileRef: null,
    costumeTrunkFileRef: 'archives:May2011UnderwaterAdventureCostume.swf' // 2011
  },
  {
    date: '2009-09-11',
    name: 'The Penguins that Time Forgot',
    stageFileRef: 'archives:RoomsStage-September2009.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play6.swf',
    costumeTrunkFileRef: 'archives:June08Costume.swf'
  },
  {
    date: '2009-10-09',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    stageFileRef: 'archives:RoomsStage-October2009.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play3-2.swf',
    costumeTrunkFileRef: 'archives:January2009Costume.swf' // from jan 2009
  },
  {
    date: '2009-11-13',
    name: 'Norman Swarm Has Been Transformed',
    stageFileRef: 'archives:RoomsStage-December2009.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play14.swf',
    costumeTrunkFileRef: 'archives:Apr2011NormanSwarmHasBeenTransformedCostume.swf', // from april 2011,
    party1: 'archives:RoomsParty1-December2009.swf'
  },
  {
    date: '2009-12-25',
    name: 'Quest for the Golden Puffle',
    costumeTrunkFileRef: 'archives:December2008Costume.swf', // from 2008 unknown if accurate,
    plazaFileRef: 'recreation:plaza_golden_puffle_no_weather.swf',
    stageFileRef: 'archives:RoomsStage-May2010.swf' // from March, unknown if accurate
  },
  {
    date: '2010-01-08',
    name: 'Fairy Fables',
    costumeTrunkFileRef: 'archives:Jan10Stage.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play10.swf', // accuracy unknown
    stageFileRef: 'archives:RoomsStage-June2009.swf' // from 2009, unknown if accurate
  },
  {
    date: '2010-02-11',
    name: 'Secrets of the Bamboo Forest',
    costumeTrunkFileRef: 'archives:October2010Costume.swf', // from October, unknown if accurate
    plazaFileRef: 'archives:RoomsPlaza-August2011.swf', // from 2011, unknown if accurate
    stageFileRef: 'archives:HalloweenParty2010Stage.swf' // from October 10, unknown if accurate
  },
  {
    date: '2010-03-29',
    name: 'Quest for the Golden Puffle',
    costumeTrunkFileRef: 'archives:December2008Costume.swf', // from 2008 unknown if accurate 
    plazaFileRef: 'recreation:plaza_golden_puffle_no_weather.swf',
    stageFileRef: 'archives:RoomsStage-May2010.swf' // accurate
  },
  {
    date: '2010-06-10',
    name: 'Ruby and the Ruby',
    costumeTrunkFileRef: 'archives:July09Costume.swf', // From 2009, unknown if accurate
    plazaFileRef: 'recreation:plaza_ruby_no_weather.swf',
    stageFileRef: 'archives:RoomsStage-December2010.swf' // from Dec 2010, unknown if accurate
  },
  {
    date: '2010-07-21',
    name: 'Underwater Adventure',
    costumeTrunkFileRef: 'archives:May2011UnderwaterAdventureCostume.swf', // frmo 2011 unknown if accurate
    plazaFileRef: null, // LOST FILE
    stageFileRef: 'recreation:underwater_adventure_no_pin.swf'
  },
  {
    date: '2010-08-26',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    costumeTrunkFileRef: 'archives:March2011SquidzoidVsShadowGuyAndGammaGalCostume.swf', // from march 2011 unknown if accurate
    plazaFileRef: 'archives:RoomsPlaza-Play3-2.swf', // no sign, unknown if accurate
    stageFileRef: 'archives:RoomsStage-October2009.swf' // frmo 2009, unknown if accurate
  },
  {
    date: '2010-09-16',
    name: 'Fairy Fables',
    costumeTrunkFileRef: 'archives:Jan10Stage.swf', // from january 10, unknown if accurate
    plazaFileRef: 'archives:RoomsPlaza-Play10.swf', // accuracy unknown
    stageFileRef: 'archives:RoomsStage-June2009.swf' // from 2009, unknown if accurate
  },
  {
    date: '2010-10-08',
    name: 'Secrets of the Bamboo Forest',
    costumeTrunkFileRef: 'archives:October2010Costume.swf',
    plazaFileRef: 'archives:RoomsPlaza-August2011.swf', // from 2011, unknown if accurate
    stageFileRef: 'archives:HalloweenParty2010Stage.swf'
  },
  {
    date: Update.PLANET_Y_2010,
    name: 'Space Adventure Planet Y',
    costumeTrunkFileRef: 'archives:2010SpacePlanetAdventureYCostumeTrunk.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play9.swf', // accurate
    stageFileRef: 'archives:RoomsStage-November2010.swf'
  },
  {
    date: '2010-12-28',
    name: 'Ruby and the Ruby',
    costumeTrunkFileRef: 'archives:July09Costume.swf', // From 2009, unknown if accurate
    plazaFileRef: 'recreation:plaza_ruby_no_weather.swf',
    stageFileRef: 'archives:RoomsStage-December2010.swf' // accurate
  }
];