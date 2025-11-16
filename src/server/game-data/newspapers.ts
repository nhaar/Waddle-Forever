/** Module for all newspapers in the game */

import { Version } from "../routes/versions";
import { FileRef } from "./files";
import { Update } from "./updates";

/** Fan issue is the only exceptional newspaper */
export const FAN_ISSUE_DATE = '2005-10-28';

/** Array that lists all the newspapers that were never in the boiler room (index number + 1 matches the issue number) */
export const PRE_BOILER_ROOM_PAPERS: Version[] = [
  '2005-10-24',
  '2005-11-03',
  '2005-11-08',
  '2005-11-11',
  '2005-11-16',
  '2005-11-21',
  '2005-12-01',
  '2005-12-08',
  '2005-12-15',
  '2005-12-22',
  '2005-12-29',
  '2006-01-05',
  '2006-01-12',
  '2006-01-19',
  '2006-01-26',
  '2006-02-02',
  '2006-02-09',
  '2006-02-16',
  '2006-02-23',
  '2006-03-02',
  '2006-03-09',
  '2006-03-16',
  '2006-03-23',
  '2006-03-30',
  '2006-04-06'
];

/** Represent an AS2 newspaper (which were single file newspapers) */
export type As2Newspaper = {
  /** Issue date */
  date: Version;
  /** Headline that was available in the Boiler Room */
  headline: string;
  /** Newspaper file */
  fileReference: FileRef;
}

/** Represents an AS3 newspaper (which had many files). Null properties are unarchived */
export type As3Newspaper = {
  date: Version;
  headline: string;
  askFront: string;
  dividersFront: string | null;
  featureStory: string;
  headerFront: string | null;
  navigationFront: string | null;
  newsFlash: string;
  supportStory: string;
  upcomingEvents: string;
  askBack: string;
  supportMore?: string | null;
  dividersBack: string | null;
  headerBack: string | null;
  jokes: string | null;
  navigationBack: string | null;
  submit: string | null;
  answers?: string;
  // seems like this is otherwise called topTips early on?
  secrets: string | null;
  extraJokes?: string;
  secret: string | undefined | null;
  iglooWinners?: string;
  featureMore?: string | null;
  extra?: string;
}

export const AS2_NEWSPAPERS: As2Newspaper[] = [
  {
    date: Update.FIRST_BOILER_ROOM_PAPER,
    headline: 'EASTER EGG HUNT!!',
    fileReference: 'archives:News26.swf'
  },
  {
    date: '2006-04-20',
    headline: 'GO GREEN FOR THE SPRING!',
    fileReference: 'archives:News27.swf'
  },
  {
    date: '2006-04-27',
    headline: 'UNDERGROUND CAVES FOUND!!',
    fileReference: 'archives:News28.swf'
  },
  {
    date: '2006-05-04',
    headline: 'CAVE CONSTRUCTION!!',
    fileReference: 'archives:News29.swf'
  },
  {
    date: '2006-05-11',
    headline: 'CAVE EXCLUSIVE',
    fileReference: 'archives:News30.swf'
  },
  {
    date: '2006-05-18',
    headline: 'IGLOO DECORATING SPECIAL',
    fileReference: 'archives:News31.swf'
  },
  {
    date: '2006-05-25',
    headline: 'MINE SHAFTS',
    fileReference: 'archives:News32.swf'
  },
  {
    date: '2006-06-01',
    headline: 'UNDERGROUND OPENING',
    fileReference: 'archives:News33.swf'
  },
  {
    date: '2006-06-08',
    headline: 'SUMMER PARTY!!',
    fileReference: 'archives:News34.swf'
  },
  {
    date: '2006-06-15',
    headline: 'SUMMER PARTY!!',
    fileReference: 'archives:News35.swf'
  },
  {
    date: '2006-06-22',
    headline: 'SUMMER PARTY CONTINUES!!',
    fileReference: 'archives:News36.swf'
  },
  {
    date: '2006-06-29',
    headline: 'WESTERN THEME',
    fileReference: 'archives:News37.swf'
  },
  {
    date: '2006-07-06',
    headline: 'WADDLE IN THE WEST',
    fileReference: 'archives:News38.swf'
  },
  {
    date: '2006-07-13',
    headline: 'BAND REUNION',
    fileReference: 'archives:News39.swf'
  },
  {
    date: '2006-07-20',
    headline: 'FIND THE MISSING INSTRUMENTS',
    fileReference: 'archives:News40.swf'
  },
  {
    date: '2006-07-27',
    headline: 'HISTORY OF MANCALA',
    fileReference: 'archives:News41.swf'
  },
  {
    date: '2006-08-03',
    headline: 'LET THE GAMES BEGIN!!',
    fileReference: 'archives:News42.swf'
  },
  {
    date: '2006-08-10',
    headline: 'SECRET AGENT MAKES TOWN SAFE',
    fileReference: 'archives:News43.swf'
  },
  {
    date: '2006-08-17',
    headline: 'NEW FITNESS EQUIPMENT',
    fileReference: 'archives:News44.swf'
  },
  {
    date: '2006-08-24',
    headline: 'PURPLE PUFFLES FOR ADOPTION',
    fileReference: 'archives:News45.swf'
  },
  {
    date: '2006-08-31',
    headline: 'LIGHTHOUSE UNDER THE SPOTLIGHT',
    fileReference: 'archives:News46.swf'
  },
  {
    date: '2006-09-07',
    headline: 'SAVE THE LIGHTHOUSE!!',
    fileReference: 'archives:News47.swf'
  },
  {
    date: '2006-09-14',
    headline: 'LIVING IN STYLE',
    fileReference: 'archives:News48.swf'
  },
  {
    date: '2006-09-21',
    headline: 'LIGHT UP THE HOUSE',
    fileReference: 'archives:News49.swf'
  },
    {
    date: '2006-09-28',
    headline: 'WALKING PUFFLES!',
    fileReference: 'archives:News50.swf'
  },
  {
    date: '2006-10-05',
    headline: 'HALLOWEEN HULLABALOO',
    fileReference: 'archives:News51.swf'
  },
  {
    date: '2006-10-12',
    headline: 'SHIP ASHORE',
    fileReference: 'archives:News52.swf'
  },
  {
    date: '2006-10-19',
    headline: 'HAUNTED IGLOO DECOR',
    fileReference: 'archives:News53.swf'
  },
  {
    date: '2006-10-26',
    headline: 'CRASH LANDING',
    fileReference: 'archives:News54.swf'
  },
  {
    date: '2006-11-02',
    headline: 'PENGUINS TAKE FLIGHT',
    fileReference: 'archives:News55.swf'
  },
  {
    date: '2006-11-09',
    headline: 'A COLORFUL MISTAKE',
    fileReference: 'archives:News56.swf'
  },
  {
    date: '2006-11-16',
    headline: 'MAKING WAVES',
    fileReference: 'archives:News57.swf'
  },
  {
    date: '2006-11-23',
    headline: 'GRIN FOR GREEN',
    fileReference: 'archives:News58.swf'
  },
  {
    date: '2006-11-30',
    headline: 'ROCKHOPPER\'S SHIP SPOTTED',
    fileReference: 'archives:News59.swf'
  },
  {
    date: '2006-12-07',
    headline: 'ROCKHOPPER LANDS TOMORROW',
    fileReference: 'archives:News60.swf'
  },
  {
    date: '2006-12-14',
    headline: 'IGLOO DECORATING CONTEST',
    fileReference: 'archives:News61.swf'
  },
  {
    date: '2006-12-21',
    headline: 'A VERY WHITE CHRISTMAS',
    fileReference: 'archives:News62.swf'
  },
  {
    date: '2006-12-28',
    headline: 'HAPPY NEW YEAR!',
    fileReference: 'archives:News63.swf'
  },
  {
    date: '2007-01-04',
    headline: 'WINTER FIESTA!',
    fileReference: 'archives:News64.swf'
  },
  {
    date: '2007-01-11',
    headline: 'TOUR GUIDES TO ARRIVE',
    fileReference: 'archives:News65.swf'
  },
  {
    date: '2007-01-18',
    headline: 'GET FLOORED!',
    fileReference: 'archives:News66.swf'
  },
  {
    date: '2007-01-25',
    headline: 'TOUR GUIDES NEEDED',
    fileReference: 'archives:News67.swf'
  },
  {
    date: '2007-02-01',
    headline: 'FESTIVAL OF SNOW',
    fileReference: 'archives:News68.swf'
  },
  {
    date: '2007-02-08',
    headline: 'WINNERS ANNOUNCED',
    fileReference: 'archives:News69.swf'
  },
  {
    date: '2007-02-15',
    headline: 'GARY THE GADGET GUY',
    fileReference: 'archives:News70.swf'
  },
  {
    date: '2007-02-22',
    headline: 'PIZZATRON 3000',
    fileReference: 'archives:News71.swf'
  },
  {
    date: '2007-03-01',
    headline: 'MESSAGE IN A BOTTLE',
    fileReference: 'archives:News72.swf'
  },
  {
    date: '2007-03-08',
    headline: 'ST. PATRICK\'S DAY 07',
    fileReference: 'archives:News73.swf'
  },
  {
    date: '2007-03-15',
    headline: 'CHARMED CELEBRATIONS',
    fileReference: 'archives:News74.swf'
  },
  {
    date: '2007-03-22',
    headline: 'PUMPED UP PUFFLE PLAY',
    fileReference: 'archives:News75.swf'
  },
  {
    date: '2007-03-29',
    headline: 'APRIL FOOL\'S DAY',
    fileReference: 'archives:News76.swf'
  },
  {
    date: '2007-04-05',
    headline: 'EASTER EGG HUNT',
    fileReference: 'archives:News77.swf'
  },
  {
    date: '2007-04-12',
    headline: 'STAGED FUN',
    fileReference: 'archives:News78.swf'
  },
  {
    date: '2007-04-19',
    headline: 'PIRATE PARTY PARADISE',
    fileReference: 'archives:News79.swf'
  },
  {
    date: '2007-04-26',
    headline: 'PARTY ON (DECK)!',
    fileReference: 'archives:News80.swf'
  },
  {
    date: '2007-05-03',
    headline: 'SHIPSHAPE SURPRISE',
    fileReference: 'archives:News81.swf'
  },
  {
    date: '2007-05-10',
    headline: 'LOCATION LOST',
    fileReference: 'archives:News82.swf'
  },
  {
    date: '2007-05-17',
    headline: 'THE MAP QUEST',
    fileReference: 'archives:News83.swf'
  },
  {
    date: '2007-05-24',
    headline: 'PATH TO THE COVE',
    fileReference: 'archives:News84.swf'
  },
  {
    date: '2007-05-31',
    headline: 'CURIOUS CONSTRUCTION EXPLAINED',
    fileReference: 'archives:News85.swf'
  },
  {
    date: '2007-06-07',
    headline: 'BIG SUMMER BASH',
    fileReference: 'archives:News86.swf'
  },
  {
    date: '2007-06-14',
    headline: 'SUMMER PARTY CONTINUES',
    fileReference: 'archives:News87.swf'
  },
  {
    date: '2007-06-21',
    headline: 'PIRATE PUFFLE ON BOARD',
    fileReference: 'archives:News88.swf'
  },
  {
    date: '2007-06-28',
    headline: 'FAR OUT SURFING',
    fileReference: 'archives:News89.swf'
  },
  {
    date: '2007-07-05',
    headline: 'WATER PARTY',
    fileReference: 'archives:News90.swf'
  },
  {
    date: '2007-07-12',
    headline: 'UNDERGROUND CLOSED',
    fileReference: 'archives:News91.swf'
  },
  {
    date: '2007-07-19',
    headline: 'WATER PARTY EXTENDED',
    fileReference: 'archives:News92.swf'
  },
  {
    date: '2007-07-26',
    headline: 'WATER PARTY A BIG SPLASH',
    fileReference: 'archives:News93.swf'
  },
  {
    date: '2007-08-02',
    headline: 'WINNERS ANNOUNCED',
    fileReference: 'archives:News94.swf'
  },
  {
    date: '2007-08-09',
    headline: 'OUTFIT CONTEST WINNERS ANNOUNCED',
    fileReference: 'archives:News95.swf'
  },
  {
    date: '2007-08-16',
    headline: 'CAMP PENGUIN',
    fileReference: 'archives:News96.swf'
  },
  {
    date: '2007-08-23',
    headline: 'CAMP PENGUIN!',
    fileReference: 'archives:News97.swf'
  },
  {
    date: '2007-08-30',
    headline: 'SPORT SHOP UPDATE',
    fileReference: 'archives:News98.swf'
  },
  {
    date: '2007-09-06',
    headline: 'CARGO CONTENTS DISCOVERED!',
    fileReference: 'archives:News99.swf'
  },
  {
    date: '2007-09-13',
    headline: 'FALL FAIR APPROACHING',
    fileReference: 'archives:News100.swf'
  },
  {
    date: '2007-09-20',
    headline: 'FALL FAIR STARTS FRIDAY!',
    fileReference: 'archives:News101.swf'
  },
  {
    date: '2007-09-27',
    headline: 'FALL FAIR FUN!',
    fileReference: 'archives:News102.swf'
  },
  {
    date: '2007-10-04',
    headline: 'COSTUME CONTEST!!!',
    fileReference: 'archives:News103.swf'
  },
  {
    date: '2007-10-11',
    headline: 'HEADS UP!',
    fileReference: 'archives:News104.swf'
  },
  {
    date: '2007-10-18',
    headline: 'STARLIGHT? DARKNIGHT?',
    fileReference: 'archives:News105.swf'
  },
  {
    date: '2007-10-25',
    headline: 'HALLOWEEN PARTY',
    fileReference: 'archives:News106.swf'
  },
  {
    date: '2007-11-01',
    headline: 'WIGGIN\' OUT!',
    fileReference: 'archives:News107.swf'
  },
  {
    date: '2007-11-08',
    headline: 'SURPRISE PARTY!',
    fileReference: 'archives:News108.swf'
  },
  {
    date: '2007-11-15',
    headline: 'GRAND OPENING',
    fileReference: 'archives:News109.swf'
  },
  {
    date: '2007-11-22',
    headline: 'YELLOW PUFFLES DISCOVERED!',
    fileReference: 'archives:News110.swf'
  },
  {
    date: '2007-11-29',
    headline: 'GOOD HOMES FOR YELLOW PUFFLES',
    fileReference: 'archives:News111.swf'
  },
  {
    date: '2007-12-06',
    headline: 'COINS FOR CHANGE',
    fileReference: 'archives:ENNews112.swf'
  },
  {
    date: '2007-12-13',
    headline: 'COINS FOR CHANGE',
    fileReference: 'archives:News113.swf'
  },
  {
    date: '2007-12-20',
    headline: 'CONTEST WINNERS ANNOUNCED',
    fileReference: 'archives:News114.swf'
  },
  {
    date: '2007-12-25',
    headline: 'DONATION ANNOUNCEMENT',
    fileReference: 'archives:News115.swf'
  },
  {
    date: '2008-01-03',
    headline: 'HAPPY NEW YEAR!',
    fileReference: 'archives:News116.swf'
  },
  {
    date: '2008-01-10',
    headline: 'NEW PLAY AT THE STAGE',
    fileReference: 'archives:News117.swf'
  },
  {
    date: '2008-01-17',
    headline: 'MIGRATOR CRASHES!',
    fileReference: 'archives:News118.swf'
  },
  {
    date: '2008-01-24',
    headline: 'ROCKHOPPER IS OKAY',
    fileReference: 'archives:News119.swf'
  },
  {
    date: '2008-01-31',
    headline: 'RALLY FOR ROCKHOPPER',
    fileReference: 'archives:News120.swf'
  },
  {
    date: '2008-02-07',
    headline: 'SAVE THE MIGRATOR',
    fileReference: 'archives:News121.swf'
  },
  {
    date: '2008-02-14',
    headline: 'SEA SALVAGING SUB TO SAVE SHIP',
    fileReference: 'archives:News122.swf'
  },
  {
    date: '2008-02-21',
    headline: 'SAVE THE MIGRATOR',
    fileReference: 'archives:News123.swf'
  },
  {
    date: '2008-02-28',
    headline: 'RECONSTRUCTION TO BEGIN SOON',
    fileReference: 'archives:News124.swf'
  },
  {
    date: '2008-03-06',
    headline: 'ST. PATRICK\'S DAY PARTY!',
    fileReference: 'archives:ENNews125.swf'
  },
  {
    date: '2008-03-13',
    headline: 'SALVAGED SHIP SLOWLY SURFACING',
    fileReference: 'archives:News126.swf'
  },
  {
    date: '2008-03-20',
    headline: 'FRONT-END FINALLY FISHED',
    fileReference: 'archives:News127.swf'
  },
  {
    date: '2008-03-27',
    headline: 'APRIL FOOLS!!!',
    fileReference: 'archives:News128.swf'
  },
  {
    date: '2008-04-03',
    headline: 'AUNT ARCTIC ASKED TO BE EDITOR',
    fileReference: 'archives:News129.swf'
  },
  {
    date: '2008-04-10',
    headline: 'READY REPORTERS READILY REQUESTED',
    fileReference: 'archives:News130.swf'
  },
  {
    date: '2008-04-17',
    headline: 'MIGRATOR MENDED - A PROJECT REVIEW',
    fileReference: 'archives:News131.swf'
  },
  {
    date: '2008-04-24',
    headline: 'ROCKHOPPER\'S GRAND RETURN',
    fileReference: 'archives:News132.swf'
  },
  {
    date: '2008-05-01',
    headline: 'BOAT SWEET BOAT',
    fileReference: 'archives:News133.swf'
  },
  {
    date: '2008-05-08',
    headline: 'PARTY PLANNERS PLAN SHINDIG!',
    fileReference: 'archives:News134.swf'
  },
  {
    date: '2008-05-15',
    headline: 'THE ADVENTURE BEGINS',
    fileReference: 'archives:News135.swf'
  },
  {
    date: '2008-05-22',
    headline: 'YE OLDE IGLOO CONTEST',
    fileReference: 'archives:News136.swf'
  },
  {
    date: '2008-05-29',
    headline: 'A NOVEL IDEA',
    fileReference: 'archives:News137.swf'
  },
  {
    date: '2008-06-05',
    headline: 'SUMMER KICK OFF PARTY',
    fileReference: 'archives:News138.swf'
  },
  {
    date: '2008-06-12',
    headline: 'WATER PARTY STARTS JUNE 13',
    fileReference: 'archives:News139.swf'
  },
  {
    date: '2008-06-19',
    headline: 'WATER PARTY! REVIEW',
    fileReference: 'archives:News140.swf'
  },
  {
    date: '2008-06-26',
    headline: 'TREMORS SHAKE UP THE TOWN CENTER',
    fileReference: 'archives:News141.swf'
  },
  {
    date: '2008-07-03',
    headline: 'CAPTAIN COMES BACK!',
    fileReference: 'archives:News142.swf'
  },
  {
    date: '2008-07-10',
    headline: 'SEE THE PENGUIN BAND JULY 25',
    fileReference: 'archives:News143.swf'
  },
  {
    date: '2008-07-17',
    headline: 'SUPERHEROES RETURN!',
    fileReference: 'archives:News144.swf'
  },
  {
    date: '2008-07-24',
    headline: 'IT\'S TIME TO ROCK!',
    fileReference: 'archives:News145.swf'
  },
  {
    date: '2008-07-31',
    headline: 'HARD-CORE ENCORE!',
    fileReference: 'archives:News146.swf'
  },
  {
    date: '2008-08-07',
    headline: 'MUSIC JAM REVIEW',
    fileReference: 'archives:News147.swf'
  },
  {
    date: '2008-08-14',
    headline: 'PREPARING FOR THE PENGUIN GAMES',
    fileReference: 'archives:News148.swf'
  },
  {
    date: '2008-08-21',
    headline: 'WELCOME TO THE PENGUIN GAMES',
    fileReference: 'archives:News149.swf'
  },
  {
    date: '2008-08-28',
    headline: 'PENGUIN GAMES CLOSING CEREMONIES',
    fileReference: 'archives:News150.swf'
  },
  {
    date: '2008-09-04',
    headline: 'CONSTRUCTION AT THE STAGE',
    fileReference: 'archives:News151.swf'
  },
  {
    date: '2008-09-11',
    headline: 'NEW PLAY IS A MYSTERY',
    fileReference: 'archives:News152.swf'
  },
  {
    date: '2008-09-18',
    headline: 'FALL FAIR PARTY!',
    fileReference: 'archives:News153.swf'
  },
  {
    date: '2008-09-25',
    headline: 'FALL FAIR FESTIVITIES!',
    fileReference: 'archives:News154.swf'
  },
  {
    date: '2008-10-02',
    headline: 'FALL FAIR FINISHING WITH FLAIR',
    fileReference: 'archives:ENNews155.swf'
  },
  {
    date: '2008-10-09',
    headline: 'HALLOWEEN PARTY',
    fileReference: 'archives:ENNews156.swf'
  },
  {
    date: '2008-10-16',
    headline: '3 YEAR ANNIVERSARY APPROACHES',
    fileReference: 'archives:ENNews157.swf'
  },
  {
    date: '2008-10-23',
    headline: 'ROCKHOPPER\'S READY FOR THE PARTY',
    fileReference: 'archives:ENNews158.swf'
  },
  {
    date: '2008-10-30',
    headline: 'HALLOWEEN IS HERE',
    fileReference: 'archives:ENNews159.swf'
  },
  {
    date: '2008-11-06',
    headline: 'A SHOCKING SURPRISE',
    fileReference: 'archives:ENNews160.swf'
  },
  {
    date: '2008-11-13',
    headline: 'DOJO GRAND RE-OPENING',
    fileReference: 'archives:ENNews161.swf'
  },
  {
    date: '2008-11-20',
    headline: 'NINJA TRAINING AT THE DOJO',
    fileReference: 'archives:ENNews162.swf'
  },
  {
    date: '2008-11-27',
    headline: 'THE SENSEI SPEAKS',
    fileReference: 'archives:ENNews163.swf'
  },
  {
    date: '2008-12-04',
    headline: 'THE CAPTAIN & COINS FOR CHANGE',
    fileReference: 'archives:ENNews164.swf'
  },
  {
    date: '2008-12-11',
    headline: 'CHRISTMAS WITH THE CAPTAIN',
    fileReference: 'archives:ENNews165.swf'
  },
  {
    date: '2008-12-18',
    headline: 'CHRISTMAS PARTY',
    fileReference: 'archives:ENNews166.swf'
  },
  {
    date: '2008-12-25',
    headline: 'MERRY CHRISTMAS CLUB PENGUIN!',
    fileReference: 'archives:ENNews167.swf'
  },
  {
    date: '2009-01-01',
    headline: 'DANCE FASHIONS AT THE GIFT SHOP!',
    fileReference: 'archives:ENNews168.swf'
  },
  {
    date: '2009-01-08',
    headline: 'DANCE-A-THON - A MEMBER EVENT',
    fileReference: 'archives:ENNews169.swf'
  },
  {
    date: '2009-01-15',
    headline: 'DANCE-A-THON FOR MEMBERS',
    fileReference: 'archives:ENNews170.swf'
  },
  {
    date: '2009-01-22',
    headline: 'FIESTA! PARTY',
    fileReference: 'archives:ENNews171.swf'
  },
  {
    date: '2009-01-29',
    headline: 'MUST-PLAY MULTIPLAYER GAMES',
    fileReference: 'archives:ENNews172.swf'
  },
  {
    date: '2009-02-05',
    headline: 'PUFFLES PLAY WITH THEIR FURNITURE',
    fileReference: 'archives:ENNews173.swf'
  },
  {
    date: '2009-02-12',
    headline: 'PUFFLE PARTY!',
    fileReference: 'archives:ENNews174.swf'
  },
  {
    date: '2009-02-19',
    headline: 'PUFFLE PARTY',
    fileReference: 'archives:ENNews175.swf'
  },
  {
    date: '2009-02-26',
    headline: 'ROCKHOPPER RETURNS ON FEBRUARY 27!',
    fileReference: 'archives:ENNews176.swf'
  },
  {
    date: '2009-03-05',
    headline: 'PRESENTING THE PENGUIN PLAY AWARDS',
    fileReference: 'archives:ENNews177.swf'
  },
  {
    date: '2009-03-12',
    headline: 'ST. PATRICK\'S PARTY 09',
    fileReference: 'archives:ENNews178.swf'
  },
  {
    date: '2009-03-19',
    headline: 'PENGUIN PLAY AWARDS',
    fileReference: 'archives:ENNews179.swf'
  },
  {
    date: '2009-03-26',
    headline: 'PENGUIN PLAY AWARDS CONTINUE!',
    fileReference: 'archives:ENNews180.swf'
  },
  {
    date: '2009-04-02',
    headline: 'APRIL FOOLS PARTY',
    fileReference: 'archives:ENNews181.swf'
  },
  {
    date: '2009-04-09',
    headline: 'PRESENTING THE TOP PLAYS!',
    fileReference: 'archives:ENNews182.swf'
  },
  {
    date: '2009-04-16',
    headline: 'SLEDDING NEWS!',
    fileReference: 'archives:ENNews183.swf'
  },
  {
    date: '2009-04-23',
    headline: 'A MEDIEVAL STORY...',
    fileReference: 'archives:ENNews184.swf'
  },
  {
    date: '2009-04-30',
    headline: 'A MEDIEVAL STORY PART 2...',
    fileReference: 'archives:ENNews185.swf'
  },
  {
    date: '2009-05-07',
    headline: 'MEDIEVAL PARTY',
    fileReference: 'archives:ENNews186.swf'
  },
  {
    date: '2009-05-14',
    headline: 'MEDIEVAL PARTY CONTINUES',
    fileReference: 'archives:ENNews187.swf'
  },
  {
    date: '2009-05-21',
    headline: 'ROCKHOPPER ARRIVES MAY 22',
    fileReference: 'archives:ENNews188.swf'
  },
  {
    date: '2009-05-28',
    headline: 'ROCKHOPPER\'S HERE!',
    fileReference: 'archives:ENNews189.swf'
  },
  {
    date: '2009-06-04',
    headline: 'FORECAST CALLS FOR...PARTY!',
    fileReference: 'archives:ENNews190.swf'
  },
  {
    date: '2009-06-11',
    headline: 'DISCOVER THE ADVENTURE PARTY',
    fileReference: 'archives:ENNews191.swf'
  },
  {
    date: '2009-06-18',
    headline: '101 DAYS OF FUN',
    fileReference: 'archives:ENNews192.swf'
  },
  {
    date: '2009-06-25',
    headline: 'NEW MUSIC FOR DJ3K',
    fileReference: 'archives:ENNews193.swf'
  },
  {
    date: '2009-07-02',
    headline: 'MUSIC JAM 09 IS AMPING UP',
    fileReference: 'archives:ENNews194.swf'
  },
  {
    date: '2009-07-09',
    headline: 'GETTING READY TO ROCK',
    fileReference: 'archives:ENNews195.swf'
  },
  {
    date: '2009-07-16',
    headline: 'MUSIC JAM 09 BEGINS JULY 17',
    fileReference: 'archives:ENNews196.swf'
  },
  {
    date: '2009-07-23',
    headline: 'MUSIC JAM 09 ENDS JULY 26!',
    fileReference: 'archives:ENNews197.swf'
  },
  {
    date: '2009-07-30',
    headline: 'LAST CHANCE FOR PENGUIN TALES',
    fileReference: 'archives:ENNews198.swf'
  },
  {
    date: '2009-08-06',
    headline: 'NEW COLOR IS IN!',
    fileReference: 'archives:ENNews199.swf'
  },
  {
    date: '2009-08-13',
    headline: 'FESTIVAL OF FLIGHT',
    fileReference: 'archives:ENNews200.swf'
  },
  {
    date: '2009-08-20',
    headline: 'FESTIVAL OF FLIGHT FINISHED!',
    fileReference: 'archives:ENNews201.swf'
  },
  {
    date: '2009-08-27',
    headline: 'FUN AT THE FAIR!',
    fileReference: 'archives:ENNews202.swf'
  },
  {
    date: '2009-09-03',
    headline: 'THE FAIR - JOIN IN THE FUN',
    fileReference: 'archives:ENNews203.swf'
  },
  {
    date: '2009-09-10',
    headline: 'PENGUINS THAT TIME FORGOT',
    fileReference: 'archives:ENNews204.swf'
  },
  {
    date: '2009-09-17',
    headline: 'SENSEI STARTS SCAVENGER HUNT',
    fileReference: 'archives:ENNews205.swf'
  },
  {
    date: '2009-09-24',
    headline: 'NINJAS AWAKEN VOLCANO',
    fileReference: 'archives:ENNews206.swf'
  },
  {
    date: '2009-10-01',
    headline: 'HALLOWEEN COSTUMES! OCTOBER 2',
    fileReference: 'archives:ENNews207.swf'
  },
  {
    date: '2009-10-08',
    headline: 'HALLOWEEN IGLOO CONTEST OCTOBER 16',
    fileReference: 'archives:ENNews208.swf'
  },
  {
    date: '2009-10-15',
    headline: 'HALLOWEEN IGLOO CONTEST',
    fileReference: 'archives:ENNews209.swf'
  },
  {
    date: '2009-10-22',
    headline: 'HAPPY 4TH ANNIVERSARY! OCTOBER 24',
    fileReference: 'archives:ENNews210.swf'
  },
  {
    date: '2009-10-29',
    headline: 'HALLOWEEN PARTY',
    fileReference: 'archives:ENNews211.swf'
  },
  {
    date: '2009-11-05',
    headline: 'VOLCANO TAMED - NINJAS NEEDED',
    fileReference: 'archives:ENNews212.swf'
  },
  {
    date: '2009-11-12',
    headline: 'VOLCANO CONSTRUCTION ANNOUNCED',
    fileReference: 'archives:ENNews213.swf'
  },
  {
    date: '2009-11-19',
    headline: 'CARD-JITSU FIRE',
    fileReference: 'archives:ENNews214.swf'
  },
  {
    date: '2009-11-26',
    headline: 'CARD-JITSU FIRE REVEALED',
    fileReference: 'archives:ENNews215.swf'
  },
  {
    date: '2009-12-03',
    headline: 'COINS FOR CHANGE',
    fileReference: 'archives:ENNews216.swf'
  },
  {
    date: '2009-12-10',
    headline: 'MAKE A DIFFERENCE!',
    fileReference: 'archives:ENNews217.swf'
  },
  {
    date: '2009-12-17',
    headline: 'HOLIDAY PARTY',
    fileReference: 'archives:ENNews218.swf'
  },
  {
    date: '2009-12-24',
    headline: 'HAPPY HOLIDAYS CLUB PENGUIN!',
    fileReference: 'archives:ENNews219.swf'
  },
  {
    date: '2009-12-31',
    headline: 'HAPPY NEW YEAR CLUB PENGUIN!',
    fileReference: 'archives:ENNews220.swf'
  },
  {
    date: '2010-01-07',
    headline: 'CREATE YOUR OWN T-SHIRT',
    fileReference: 'archives:News221.swf'
  },
  {
    date: '2010-01-14',
    headline: 'ROCKSLIDE AT THE MINE!',
    fileReference: 'archives:News222.swf'
  },
  {
    date: '2010-01-21',
    headline: 'SECRET CAVE DISCOVERED!',
    fileReference: 'archives:ENNews223.swf'
  },
  {
    date: '2010-01-28',
    headline: 'CAVES CLOSING UNTIL FURTHER NOTICE',
    fileReference: 'archives:ENNews224.swf'
  },
  {
    date: '2010-02-04',
    headline: 'PUFFLE PARTY',
    fileReference: 'archives:ENNews225.swf'
  },
  {
    date: '2010-02-11',
    headline: 'SECRETS OF THE BAMBOO FOREST',
    fileReference: 'archives:ENNews226.swf'
  },
  {
    date: '2010-02-18',
    headline: 'PUFFLE PARTY',
    fileReference: 'archives:ENNews227.swf'
  },
  {
    date: '2010-02-25',
    headline: 'ORANGE PUFFLES READY TO ADOPT!',
    fileReference: 'archives:ENNews228.swf'
  },
  {
    date: '2010-03-04',
    headline: 'WHERE\'S YARR?',
    fileReference: 'archives:ENNews229.swf'
  },
  {
    date: '2010-03-11',
    headline: 'PUFFLES TRAPPED UNDERGROUND!',
    fileReference: 'archives:ENNews230.swf'
  },
  {
    date: '2010-03-18',
    headline: 'PUFFLE RESCUE',
    fileReference: 'archives:ENNews231.swf'
  },
  {
    date: '2010-03-25',
    headline: 'PENGUIN PLAY AWARDS',
    fileReference: 'archives:ENNews232.swf'
  },
  {
    date: '2010-04-01',
    headline: 'HAPPY APRIL FOOLS!',
    fileReference: 'archives:ENNews233.swf'
  },
  {
    date: '2010-04-08',
    headline: 'EARTH DAY IS COMING!',
    fileReference: 'archives:ENNews234.swf'
  },
  {
    date: '2010-04-15',
    headline: 'CELEBRATE EARTH DAY!',
    fileReference: 'archives:ENNews235.swf'
  },
  {
    date: '2010-04-22',
    headline: 'EARTH DAY CELEBRATIONS BEGIN!',
    fileReference: 'archives:ENNews236.swf'
  },
  {
    date: '2010-04-29',
    headline: 'YE PENGUIN STYLE',
    fileReference: 'archives:ENNews237.swf'
  },
  {
    date: '2010-05-06',
    headline: 'MEDIEVAL PARTY',
    fileReference: 'archives:ENNews238.swf'
  },
  {
    date: '2010-05-13',
    headline: 'YOUR IGLOO-MEDIEVAL STYLE',
    fileReference: 'archives:ENNews239.swf'
  },
  {
    date: '2010-05-20',
    headline: 'POPCORN EVERYWHERE AT SPORT SHOP',
    fileReference: 'archives:ENNews240.swf'
  },
  {
    date: '2010-05-27',
    headline: 'SKI VILLAGE UNDER CONSTRUCTION',
    fileReference: 'archives:ENNews241.swf'
  },
  {
    date: '2010-06-03',
    headline: 'PENGUINS SEEKING ADVENTURE',
    fileReference: 'archives:ENNews242.swf'
  },
  {
    date: '2010-06-10',
    headline: 'ISLAND ADVENTURE PLANS REVEALED',
    fileReference: 'archives:ENNews243.swf'
  },
  {
    date: '2010-06-17',
    headline: 'THE ADVENTURE BEGINS!',
    fileReference: 'archives:ENNews244.swf'
  },
  {
    date: '2010-06-24',
    headline: 'CONTINUE YOUR ADVENTURE!',
    fileReference: 'archives:ENNews245.swf'
  },
  {
    date: '2010-07-01',
    headline: 'GET READY FOR MUSIC JAM 2010',
    fileReference: 'archives:ENNews246.swf'
  },
  {
    date: '2010-07-08',
    headline: 'MUSIC JAM!',
    fileReference: 'archives:ENNews247.swf'
  },
  {
    date: '2010-07-15',
    headline: 'KEEP JAMMIN\'',
    fileReference: 'archives:ENNews248.swf'
  },
  {
    date: '2010-07-22',
    headline: 'STAMPS ARRIVE JULY 27',
    fileReference: 'archives:ENNews249.swf'
  },
  {
    date: '2010-07-29',
    headline: 'STAMPS - CAN YOU EARN THEM ALL?',
    fileReference: 'archives:ENNews250.swf'
  },
  {
    date: '2010-08-05',
    headline: 'STAMP BOOK STYLE',
    fileReference: 'archives:ENNews251.swf'
  },
  {
    date: '2010-08-12',
    headline: 'MOUNTAIN EXPEDITION BEGINS',
    fileReference: 'archives:ENNews252.swf'
  },
  {
    date: '2010-08-19',
    headline: 'DESIGN YOUR OWN FURNITURE',
    fileReference: 'archives:ENNews253.swf'
  },
  {
    date: '2010-08-26',
    headline: 'PREPARE FOR THE FAIR',
    fileReference: 'archives:ENNews254.swf'
  },
  {
    date: '2010-09-02',
    headline: 'THE FAIR - BE THERE',
    fileReference: 'archives:ENNews255.swf'
  },
  {
    date: '2010-09-09',
    headline: 'NEW ITEMS AT PRIZE BOOTH',
    fileReference: 'archives:ENNews256.swf'
  },
  {
    date: '2010-09-16',
    headline: 'SHOWDOWN AT THE STADIUM',
    fileReference: 'archives:ENNews257.swf'
  },
  {
    date: '2010-09-23',
    headline: 'GAME ON AT THE STADIUM',
    fileReference: 'archives:ENNews258.swf'
  },
  {
    date: '2010-09-30',
    headline: 'NEW SPOOKY COSTUMES COMING!',
    fileReference: 'archives:ENNews259.swf'
  },
  {
    date: '2010-10-07',
    headline: 'HALLOWEEN IGLOO CONTEST',
    fileReference: 'archives:ENNews260.swf'
  },
  {
    date: '2010-10-14',
    headline: 'HALLOWEEN IGLOO CONTEST',
    fileReference: 'archives:ENNews261.swf'
  },
  {
    date: '2010-10-21',
    headline: 'ANNIVERSARY PARTY OCTOBER 24',
    fileReference: 'archives:ENNews262.swf'
  },
  {
    date: '2010-10-28',
    headline: 'THE HALLOWEEN PARTY IS HERE',
    fileReference: 'archives:ENNews263.swf'
  },
  {
    date: '2010-11-04',
    headline: 'NEW OUTDOOR OUTFITS',
    fileReference: 'archives:ENNews264.swf'
  },
  {
    date: '2010-11-11',
    headline: 'FIRST RAINSTORM ON RECORD',
    fileReference: 'archives:ENNews265.swf'
  }
]

export const AS3_NEWSPAPERS: As3Newspaper[] = [
  {
    date: Update.FIRST_AS3_NEWSPAPER,
    headline: 'READY FOR CARD-JITSU WATER?',
    askBack: 'archives:News266AskAuntArcticBack.swf',
    askFront: 'archives:News266AskAuntArcticFront.swf',
    featureStory: 'archives:News266FeatureStory.swf',
    headerBack: 'archives:News266HeaderBack.swf',
    headerFront: 'archives:News266HeaderFront.swf',
    jokes: 'archives:News266JokesAndRiddles.swf',
    newsFlash: 'archives:News266NewsFlash.swf',
    answers: 'archives:News266RiddlesAnswers.swf',
    supportStory: 'archives:News266SupportStory.swf',
    secrets: 'archives:News266TopTips.swf',
    upcomingEvents: 'archives:News266UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    navigationBack: null,
    navigationFront: null,
    submit: null,
    extraJokes: undefined,
    secret: undefined
  },
  {
    date: '2010-11-26',
    headline: 'NINJAS SEEK TO MASTER WATER',
    askBack: 'archives:News267AskAuntArcticBack.swf',
    askFront: 'archives:News267AskAuntArcticFront.swf',
    featureStory: 'archives:News267FeatureStory.swf',
    headerBack: 'archives:News267HeaderBack.swf',
    headerFront: 'archives:News267HeaderFront.swf',
    jokes: 'archives:News267JokesAndRiddles.swf',
    newsFlash: 'archives:News267NewsFlash.swf',
    answers: 'archives:News267RiddlesAnswers.swf',
    supportStory: 'archives:News267SupportStory.swf',
    secrets: 'archives:News267TopTips.swf',
    upcomingEvents: 'archives:News267UpcomingEvents.swf',
    dividersBack: 'archives:News267DividersBack.swf',
    dividersFront: 'archives:News267DividersFront.swf',
    navigationBack: 'archives:News267DividersBack.swf',
    navigationFront: 'archives:News267NavigationFront.swf',
    submit: 'archives:News267SubmitYourContent.swf',
    extraJokes: 'archives:News267ExtraJokes.swf',
    secret: undefined
  },
  {
    date: '2010-12-03',
    headline: 'GIFT SHOP FULL OF FESTIVE FASHION',
    secrets: 'archives:News268Secrets.swf',
    dividersFront: 'archives:News268DividersFront.swf',
    dividersBack: 'archives:News268DividersBack.swf',
    navigationFront: 'archives:News268NavigationFront.swf',
    navigationBack: 'archives:News268NavigationBack.swf',
    submit: 'archives:News268SubmitYourContent.swf',
    askBack: 'archives:News268AskAuntArcticBack.swf',
    askFront: 'archives:News268AskAuntArcticFront.swf',
    featureStory: 'archives:News268FeatureStory.swf',
    headerBack: 'archives:News268HeaderBack.swf',
    headerFront: 'archives:News268HeaderFront.swf',
    jokes: 'archives:News268JokesAndRiddles.swf',
    newsFlash: 'archives:News268NewsFlash.swf',
    answers: 'archives:News268RiddlesAnswers.swf',
    supportStory: 'archives:News268SupportStory.swf',
    upcomingEvents: 'archives:News268UpcomingEvents.swf',
    extraJokes: undefined,
    secret: undefined
  },
  {
    date: '2010-12-10',
    headline: 'COINS FOR CHANGE IS COMING',
    askBack: 'archives:News269AskAuntArcticBack.swf',
    askFront: 'archives:News269AskAuntArcticFront.swf',
    featureStory: 'archives:News269FeatureStory.swf',
    headerBack: 'archives:News269HeaderBack.swf',
    headerFront: 'archives:News269HeaderFront.swf',
    jokes: 'archives:News269JokesAndRiddles.swf',
    newsFlash: 'archives:News269NewsFlash.swf',
    answers: 'archives:News269RiddlesAnswers.swf',
    supportStory: 'archives:News269SupportStory.swf',
    secrets: 'archives:News269TopTips.swf',
    upcomingEvents: 'archives:News269UpcomingEvents.swf',
    navigationBack: null,
    navigationFront: null,
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    secret: undefined
  },
  {
    date: '2010-12-17',
    headline: 'HOLIDAY PARTY IS HERE',
    askBack: 'archives:News270AskAuntArcticBack.swf',
    askFront: 'archives:News270AskAuntArcticFront.swf',
    featureStory: 'archives:News270FeatureStory.swf',
    headerBack: 'archives:News270HeaderBack.swf',
    headerFront: 'archives:News270HeaderFront.swf',
    jokes: 'archives:News270JokesAndRiddles.swf',
    newsFlash: 'archives:News270NewsFlash.swf',
    answers: 'archives:News270RiddlesAnswers.swf',
    secrets: 'archives:News270Secrets.swf',
    supportStory: 'archives:News270SupportStory.swf',
    upcomingEvents: 'archives:News270UpcomingEvents.swf',
    dividersBack: 'archives:News270DividersBack.swf',
    navigationBack: 'archives:News270NavigationBack.swf',
    submit: 'archives:News270SubmitYourContent.swf',
    dividersFront: 'archives:News270DividersFront.swf',
    navigationFront: 'archives:News270NavigationFront.swf',
    extraJokes: undefined,
    secret: 'archives:News270Secret.swf'
  },
  {
    date: '2010-12-24',
    headline: 'LIGHTHOUSE FILLING FAST!',
    dividersBack: 'archives:News267DividersBack.swf',
    navigationBack: 'archives:News267NavigationBack.swf',
    submit: 'archives:News267SubmitYourContent.swf',
    dividersFront: 'archives:News267DividersFront.swf',
    navigationFront: 'archives:News267NavigationFront.swf',
    askBack: 'archives:News271AskAuntArcticBack.swf',
    askFront: 'archives:News271AskAuntArcticFront.swf',
    featureStory: 'archives:News271FeatureStory.swf',
    headerBack: 'archives:News271HeaderBack.swf',
    headerFront: 'archives:News271HeaderFront.swf',
    iglooWinners: 'archives:News271IglooWinners.swf',
    jokes: 'archives:News271JokesAndRiddles.swf',
    newsFlash: 'archives:News271NewsFlash.swf',
    answers: 'archives:News271RiddlesAnswers.swf',
    secret: 'archives:News271Secret.swf',
    secrets: 'archives:News271Secrets.swf',
    supportStory: 'archives:News271SupportStory.swf',
    upcomingEvents: 'archives:News271UpcomingEvents.swf',
    extraJokes: undefined
  },
  {
    date: '2010-12-31',
    headline: 'HAPPY NEW YEAR!',
    askBack: 'archives:News272AskAuntArcticBack.swf',
    askFront: 'archives:News272AskAuntArcticFront.swf',
    featureStory: 'archives:News272FeatureStory.swf',
    headerBack: 'archives:News272HeaderBack.swf',
    headerFront: 'archives:News272HeaderFront.swf',
    iglooWinners: 'archives:News272IglooWinners.swf',
    jokes: 'archives:News272JokesAndRiddles.swf',
    newsFlash: 'archives:News272NewsFlash.swf',
    answers: 'archives:News272RiddlesAnswers.swf',
    secret: 'archives:News272Secret.swf',
    secrets: 'archives:News272Secrets.swf',
    supportStory: 'archives:News272SupportStory.swf',
    upcomingEvents: 'archives:News272UpcomingEvents.swf',
    navigationBack: null,
    navigationFront: null,
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined
  },
  {
    date: '2011-01-07',
    headline: 'ARE ELITE AGENTS AMONG US?',
    askBack: 'archives:News273AskAuntArcticBack.swf',
    askFront: 'archives:News273AskAuntArcticFront.swf',
    featureMore: 'archives:News273FeatureMore.swf',
    featureStory: 'archives:News273FeatureStory.swf',
    headerBack: 'archives:News273HeaderBack.swf',
    headerFront: 'archives:News273HeaderFront.swf',
    jokes: 'archives:News273JokesAndRiddles.swf',
    newsFlash: 'archives:News273NewsFlash.swf',
    answers: 'archives:News273RiddlesAnswers.swf',
    secret: 'archives:News273SecretOverlay.swf',
    secrets: 'archives:News273Secrets.swf',
    supportStory: 'archives:News273SupportStory.swf',
    upcomingEvents: 'archives:News273UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-01-14',
    headline: 'EXCITED EXPLORERS PREPARE FOR EXPEDITION',
    askBack: 'archives:News274AskAuntArcticBack.swf',
    askFront: 'archives:News274AskAuntArcticFront.swf',
    featureMore: 'archives:News274FeatureMore.swf',
    featureStory: 'archives:News274FeatureStory.swf',
    headerBack: 'archives:News274HeaderBack.swf',
    headerFront: 'archives:News274HeaderFront.swf',
    jokes: 'archives:News274JokesAndRiddles.swf',
    newsFlash: 'archives:News274NewsFlash.swf',
    answers: 'archives:News274RiddlesAnswers.swf',
    secret: 'archives:News274SecretOverlay.swf',
    secrets: 'archives:News274Secrets.swf',
    supportStory: 'archives:News274SupportStory.swf',
    upcomingEvents: 'archives:News274UpcomingEvents.swf',
    extra: 'archives:News274EpfInterview.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-01-21',
    headline: 'BROWN PUFFLES DISCOVERED',
    askBack: 'archives:News275AskAuntArcticBack.swf',
    askFront: 'archives:News275AskAuntArcticFront.swf',
    featureMore: 'archives:News275FeatureMore.swf',
    featureStory: 'archives:News275FeatureStory.swf',
    headerBack: 'archives:News275HeaderBack.swf',
    headerFront: 'archives:News275HeaderFront.swf',
    jokes: 'archives:News275JokesAndRiddles.swf',
    newsFlash: 'archives:News275NewsFlash.swf',
    answers: 'archives:News275RiddlesAnswers.swf',
    secret: 'archives:News275SecretOverlay.swf',
    secrets: 'archives:News275Secrets.swf',
    supportStory: 'archives:News275SupportStory.swf',
    upcomingEvents: 'archives:News275UpcomingEvents.swf',
    extra: 'archives:News275FeatureTech.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-01-28',
    headline: 'PUFFLE FANS PREPARING',
    askBack: 'archives:News276AskAuntArcticBack.swf',
    askFront: 'archives:News276AskAuntArcticFront.swf',
    featureMore: 'archives:News276FeatureMore.swf',
    featureStory: 'archives:News276FeatureStory.swf',
    headerBack: 'archives:News276HeaderBack.swf',
    headerFront: 'archives:News276HeaderFront.swf',
    jokes: 'archives:News276JokesAndRiddles.swf',
    newsFlash: 'archives:News276NewsFlash.swf',
    answers: 'archives:News276RiddlesAnswers.swf',
    secret: 'archives:News276SecretOverlay.swf',
    secrets: 'archives:News276Secrets.swf',
    supportStory: 'archives:News276SupportStory.swf',
    upcomingEvents: 'archives:News276UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-02-04',
    headline: 'CELEBRATIONS FOR EVERY PUFFLE',
    askBack: 'archives:News277AskAuntArcticBack.swf',
    askFront: 'archives:News277AskAuntArcticFront.swf',
    featureMore: 'archives:News277FeatureMore.swf',
    featureStory: 'archives:News277FeatureStory.swf',
    headerBack: 'archives:News277HeaderBack.swf',
    headerFront: 'archives:News277HeaderFront.swf',
    jokes: 'archives:News277JokesAndRiddles.swf',
    newsFlash: 'archives:News277NewsFlash.swf',
    answers: 'archives:News277RiddlesAnswers.swf',
    secret: 'archives:News277SecretOverlay.swf',
    secrets: 'archives:News277Secrets.swf',
    supportStory: 'archives:News277SupportStory.swf',
    upcomingEvents: 'archives:News277UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-02-11',
    headline: 'PUFFLE PARTY UNDER CONSTRUCTION',
    askBack: 'archives:News278AskAuntArcticBack.swf',
    askFront: 'archives:News278AskAuntArcticFront.swf',
    featureMore: 'archives:News278FeatureMore.swf',
    featureStory: 'archives:News278FeatureStory.swf',
    headerBack: 'archives:News278HeaderBack.swf',
    headerFront: 'archives:News278HeaderFront.swf',
    jokes: 'archives:News278JokesAndRiddles.swf',
    newsFlash: 'archives:News278NewsFlash.swf',
    answers: 'archives:News278RiddlesAnswers.swf',
    secret: 'archives:News278SecretOverlay.swf',
    secrets: 'archives:News278Secrets.swf',
    supportStory: 'archives:News278SupportStory.swf',
    upcomingEvents: 'archives:News278UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-02-18',
    headline: 'PUFFLE PARTY IN FULL SWING',
    askBack: 'archives:News279AskAuntArcticBack.swf',
    askFront: 'archives:News279AskAuntArcticFront.swf',
    featureMore: 'archives:News279FeatureMore.swf',
    featureStory: 'archives:News279FeatureStory.swf',
    headerBack: 'archives:News279HeaderBack.swf',
    headerFront: 'archives:News279HeaderFront.swf',
    jokes: 'archives:News279JokesAndRiddles.swf',
    newsFlash: 'archives:News279NewsFlash.swf',
    answers: 'archives:News279RiddlesAnswers.swf',
    secret: 'archives:News279SecretOverlay.swf',
    secrets: 'archives:News279Secrets.swf',
    supportStory: 'archives:News279SupportStory.swf',
    upcomingEvents: 'archives:News279UpcomingEvents.swf',
    extra: 'archives:News279FeaturePuffles.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-02-25',
    headline: 'PUFFLES WANT MORE!',
    askBack: 'archives:News280AskAuntArcticBack.swf',
    askFront: 'archives:News280AskAuntArcticFront.swf',
    featureMore: 'archives:News280FeatureMore.swf',
    featureStory: 'archives:News280FeatureStory.swf',
    headerBack: 'archives:News280HeaderBack.swf',
    headerFront: 'archives:News280HeaderFront.swf',
    jokes: 'archives:News280JokesAndRiddles.swf',
    newsFlash: 'archives:News280NewsFlash.swf',
    answers: 'archives:News280RiddlesAnswers.swf',
    secret: 'archives:News280SecretOverlay.swf',
    secrets: 'archives:News279Secrets.swf',
    supportStory: 'archives:News280SupportStory.swf',
    upcomingEvents: 'archives:News280UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-03-04',
    headline: 'GET READY TO SHOP WITH YOUR PUFFLE',
    askBack: 'archives:News281AskAuntArcticBack.swf',
    askFront: 'archives:News281AskAuntArcticFront.swf',
    featureMore: 'archives:News281FeatureMore.swf',
    featureStory: 'archives:News281FeatureStory.swf',
    headerBack: 'archives:News281HeaderBack.swf',
    headerFront: 'archives:News281HeaderFront.swf',
    jokes: 'archives:News281JokesAndRiddles.swf',
    newsFlash: 'archives:News281NewsFlash.swf',
    answers: 'archives:News281RiddlesAnswers.swf',
    secret: 'archives:News281SecretOverlay.swf',
    secrets: 'archives:News281Secrets.swf',
    supportStory: 'archives:News281SupportStory.swf',
    upcomingEvents: 'archives:News281UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-03-11',
    headline: 'PUFFLE LAUNCH STARTS MARCH 15',
    askBack: 'archives:News282AskAuntArcticBack.swf',
    askFront: 'archives:News282AskAuntArcticFront.swf',
    featureMore: 'archives:News282FeatureMore.swf',
    featureStory: 'archives:News282FeatureStory.swf',
    headerBack: 'archives:News282HeaderBack.swf',
    headerFront: 'archives:News282HeaderFront.swf',
    jokes: 'archives:News282JokesAndRiddles.swf',
    newsFlash: 'archives:News282NewsFlash.swf',
    answers: 'archives:News282RiddlesAnswers.swf',
    secret: 'archives:News282SecretOverlay.swf',
    secrets: 'archives:News282Secrets.swf',
    supportStory: 'archives:News282SupportStory.swf',
    upcomingEvents: 'archives:News282UpcomingEvents.swf',
    supportMore: 'archives:News282SupportMore.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-03-18',
    headline: 'APRIL FOOL\'S PARTY TO START EARLY!',
    askBack: 'archives:News283AskAuntArcticBack.swf',
    askFront: 'archives:News283AskAuntArcticFront.swf',
    featureMore: 'archives:News283FeatureMore.swf',
    featureStory: 'archives:News283FeatureStory.swf',
    headerBack: 'archives:News283HeaderBack.swf',
    headerFront: 'archives:News283HeaderFront.swf',
    jokes: 'archives:News283JokesAndRiddles.swf',
    newsFlash: 'archives:News283NewsFlash.swf',
    answers: 'archives:News283RiddlesAnswers.swf',
    secret: 'archives:News283SecretOverlay.swf',
    secrets: 'archives:News283Secrets.swf',
    supportStory: 'archives:News283SupportStory.swf',
    upcomingEvents: 'archives:News283UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-03-25',
    headline: 'EXPLORE THE BOX DIMENSION',
    askBack: 'archives:News284AskAuntArcticBack.swf',
    askFront: 'archives:News284AskAuntArcticFront.swf',
    featureMore: 'archives:News284FeatureMore.swf',
    featureStory: 'archives:News284FeatureStory.swf',
    headerBack: 'archives:News284HeaderBack.swf',
    headerFront: 'archives:News284HeaderFront.swf',
    jokes: 'archives:News284JokesAndRiddles.swf',
    newsFlash: 'archives:News284NewsFlash.swf',
    answers: 'archives:News284RiddlesAnswers.swf',
    secret: 'archives:News284SecretOverlay.swf',
    secrets: 'archives:News284Secrets.swf',
    supportStory: 'archives:News284SupportStory.swf',
    upcomingEvents: 'archives:News284UpcomingEvents.swf',
    iglooWinners: 'archives:News284IglooWinners.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-04-01',
    headline: 'BOX DIMENSION CAN\'T BE MAPPED',
    askBack: 'archives:News285AskAuntArcticBack.swf',
    askFront: 'archives:News285AskAuntArcticFront.swf',
    featureStory: 'archives:News285FeatureStory.swf',
    headerBack: 'archives:News285HeaderBack.swf',
    headerFront: 'archives:News285HeaderFront.swf',
    jokes: 'archives:News285JokesAndRiddles.swf',
    newsFlash: 'archives:News285NewsFlash.swf',
    answers: 'archives:News285RiddlesAnswers.swf',
    secret: null,
    secrets: 'archives:News285Secrets.swf',
    supportStory: 'archives:News285SupportStory.swf',
    upcomingEvents: 'archives:News285UpcomingEvents.swf',
    dividersBack: 'archives:News285DividersBack.swf',
    dividersFront: 'archives:News285DividersFront.swf',
    submit: 'archives:News285SubmitYourContent.swf',
    extraJokes: undefined,
    navigationBack: 'archives:News285NavigationBack.swf',
    navigationFront: 'archives:News285NavigationFront.swf'
  },
  {
    date: '2011-04-08',
    headline: 'IGLOOS GO GREEN',
    askBack: 'archives:News286AskAuntArcticBack.swf',
    askFront: 'archives:News286AskAuntArcticFront.swf',
    featureMore: null,
    featureStory: 'archives:News286FeatureStory.swf',
    headerBack: null,
    headerFront: null,
    jokes: null,
    newsFlash: 'archives:News286NewsFlash.swf',
    answers: 'archives:News286RiddlesAnswers.swf',
    secret: 'archives:News286SecretOverlay.swf',
    secrets: null,
    supportStory: 'archives:News286SupportStory.swf',
    upcomingEvents: 'archives:News286UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-04-15',
    headline: 'EARTH DAY SURPRISES ARE COMING',
    askBack: 'archives:News287AskAuntArcticBack.swf',
    askFront: 'archives:News287AskAuntArcticFront.swf',
    featureMore: null,
    featureStory: 'archives:News287FeatureStory.swf',
    headerBack: null,
    headerFront: null,
    jokes: null,
    newsFlash: 'archives:News287NewsFlash.swf',
    answers: 'archives:News287RiddlesAnswers.swf',
    secret: 'archives:News287SecretOverlay.swf',
    secrets: null,
    supportStory: 'archives:News287SupportStory.swf',
    supportMore: null,
    upcomingEvents: 'archives:News287UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-04-22',
    headline: 'THE ISLAND CELEBRATES EARTH DAY!',
    askBack: 'archives:News288AskAuntArcticBack.swf',
    askFront: 'archives:News288AskAuntArcticFront.swf',
    featureMore: null,
    featureStory: 'archives:News288FeatureStory.swf',
    headerBack: null,
    headerFront: null,
    jokes: null,
    newsFlash: 'archives:News288NewsFlash.swf',
    answers: 'archives:News288RiddlesAnswers.swf',
    secret: 'archives:News288SecretOverlay.swf',
    secrets: null,
    supportStory: 'archives:News288SupportStory.swf',
    upcomingEvents: 'archives:News288UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-04-29',
    headline: 'HARK! YE NEW PENGUIN STYLE!',
    askBack: 'archives:News289AskAuntArcticBack.swf',
    askFront: 'archives:News289AskAuntArcticFront.swf',
    featureMore: null,
    featureStory: 'archives:News289FeatureStory.swf',
    headerBack: null,
    headerFront: null,
    jokes: null,
    newsFlash: 'archives:News289NewsFlash.swf',
    answers: 'archives:News289RiddlesAnswers.swf',
    secret: 'archives:News289SecretOverlay.swf',
    secrets: null,
    supportStory: 'archives:News289SupportStory.swf',
    supportMore: null,
    upcomingEvents: 'archives:News289UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    submit: null,
    extraJokes: undefined,
    navigationBack: null,
    navigationFront: null
  },
  {
    date: '2011-05-06',
    headline: 'PREPARE YE KINGDOM TO PARTY',
    askBack: 'archives:News290AskAuntArcticBack.swf',
    askFront: 'archives:News290AskAuntArcticFront.swf',
    featureStory: 'archives:News290FeatureStory.swf',
    newsFlash: 'archives:News290NewsFlash.swf',
    secret: 'archives:News290SecretOverlay.swf',
    supportStory: 'archives:News290SupportStory.swf',
    upcomingEvents: 'archives:News290UpcomingEvents.swf',
    dividersBack: null,
    dividersFront: null,
    navigationBack: null,
    navigationFront: null,
    headerBack: null,
    headerFront: null,
    secrets: null,
    submit: null,
    jokes: null,
    featureMore: null,
    supportMore: null
  },
  {
    date: '2011-05-13',
    headline: 'KINGDOM CONSTRUCTION HATH BEGUN',
    askBack: 'archives:News291AskAuntArcticBack.swf',
    askFront: 'archives:News291AskAuntArcticFront.swf',
    featureStory: 'archives:News291FeatureStory.swf',
    newsFlash: 'archives:News291NewsFlash.swf',
    secret: 'archives:News291SecretOverlay.swf',
    supportStory: 'archives:News291SupportStory.swf',
    upcomingEvents: 'archives:News291UpcomingEvents.swf',
    headerBack: null,
    headerFront: null,
    navigationBack: null,
    navigationFront: null,
    secrets: null,
    submit: null,
    jokes: null,
    dividersBack: null,
    dividersFront: null,
    featureMore: null,
    supportMore: null
  },
  {
    date: '2011-05-20',
    headline: 'THE QUEST HATH BEGUN!',
    askBack: 'archives:News292AskAuntArcticBack.swf',
    askFront: 'archives:News292AskAuntArcticFront.swf',
    featureStory: 'archives:News292FeatureStory.swf',
    newsFlash: 'archives:News292NewsFlash.swf',
    secret: 'archives:News292SecretOverlay.swf',
    supportStory: 'archives:News292SupportStory.swf',
    upcomingEvents: 'archives:News292UpcomingEvents.swf',
    headerBack: null,
    headerFront: null,
    dividersBack: null,
    dividersFront: null,
    navigationBack: null,
    navigationFront: null,
    secrets: null,
    submit: null,
    jokes: null,
    featureMore: null,
    supportMore: null
  },
  {
    date: '2011-05-27',
    headline: 'PURPLE DRAGONS SIGHTED!',
    askBack: 'archives:News293AskAuntArcticBack.swf',
    askFront: 'archives:News293AskAuntArcticFront.swf',
    featureStory: 'archives:News293FeatureStory.swf',
    newsFlash: 'archives:News293NewsFlash.swf',
    secret: 'archives:News293SecretOverlay.swf',
    supportStory: 'archives:News293SupportStory.swf',
    upcomingEvents: 'archives:News293UpcomingEvents.swf',
    headerBack: null,
    headerFront: null,
    navigationBack: null,
    navigationFront: null,
    dividersBack: null,
    dividersFront: null,
    secrets: null,
    submit: null,
    jokes: null,
    featureMore: null
  },
  {
    date: '2011-06-03',
    headline: 'NEW MUSIC CLOTHING OUT NOW!',
    askBack: 'archives:News294AskAuntArcticBack.swf',
    askFront: 'archives:News294AskAuntArcticFront.swf',
    featureMore: 'archives:News294FeatureMore.swf',
    featureStory: 'archives:News294FeatureStory.swf',
    newsFlash: 'archives:News294NewsFlash.swf',
    secret: 'archives:News294SecretOverlay.swf',
    supportStory: 'archives:News294SupportStory.swf',
    upcomingEvents: 'archives:News294UpcomingEvents.swf',
    navigationBack: null,
    navigationFront: null,
    headerBack: null,
    headerFront: null,
    dividersBack: null,
    dividersFront: null,
    secrets: null,
    submit: null,
    jokes: null
  },
  {
    date: '2011-06-10',
    headline: 'NEW MUSIC JAM FURNITURE!',
    askBack: 'archives:News295AskAuntArcticBack.swf',
    askFront: 'archives:News295AskAuntArcticFront.swf',
    featureMore: 'archives:News295FeatureMore.swf',
    featureStory: 'archives:News295FeatureStory.swf',
    newsFlash: 'archives:News295NewsFlash.swf',
    secret: 'archives:News295SecretOverlay.swf',
    supportMore: 'archives:News295SupportMore.swf',
    supportStory: 'archives:News295SupportStory.swf',
    upcomingEvents: 'archives:News295UpcomingEvents.swf',
    headerBack: null,
    headerFront: null,
    navigationBack: null,
    navigationFront: null,
    dividersBack: null,
    dividersFront: null,
    secrets: null,
    submit: null,
    jokes: null
  },
  {
    date: '2011-06-17',
    headline: 'MAKE SOME NOISE FOR MUSIC JAM!',
    headerFront: 'archives:News296HeaderFront.swf',
    featureStory: 'archives:News296FeatureStory.swf',
    supportStory: 'archives:News296SupportStory.swf',
    upcomingEvents: 'archives:News296UpcomingEvents.swf',
    newsFlash: 'archives:News296NewsFlash.swf',
    askFront: 'archives:News296AskAuntArcticFront.swf',
    headerBack: 'archives:News296HeaderBack.swf',
    askBack: 'archives:News296AskAuntArcticBack.swf',
    jokes: 'archives:News296JokesAndRiddles.swf',
    secret: 'archives:News296SecretOverlay.swf',
    featureMore: 'archives:News296FeatureMore.swf',
    navigationFront: 'archives:News296NavigationFront.swf',
    navigationBack: 'archives:News296NavigationBack.swf',
    secrets: 'archives:News296Secrets.swf',
    submit: 'archives:News296SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-06-24',
    headline: 'NEW NINJA ITEMS REVEALED!',
    headerFront: 'archives:News297HeaderFront.swf',
    featureStory: 'archives:News297FeatureStory.swf',
    supportStory: 'archives:News297SupportStory.swf',
    upcomingEvents: 'archives:News297UpcomingEvents.swf',
    newsFlash: 'archives:News297NewsFlash.swf',
    askFront: 'archives:News297AskAuntArcticFront.swf',
    headerBack: 'archives:News297HeaderBack.swf',
    askBack: 'archives:News297AskAuntArcticBack.swf',
    jokes: 'archives:News297JokesAndRiddles.swf',
    secret: 'archives:News297SecretOverlay.swf',
    featureMore: 'archives:News297FeatureMore.swf',
    navigationFront: 'archives:News297NavigationFront.swf',
    navigationBack: 'archives:News297NavigationBack.swf',
    secrets: 'archives:News297Secrets.swf',
    submit: 'archives:News297SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-07-06',
    headline: 'MERMAIDS SIGHTED! PIRATES TOO!',
    headerFront: 'archives:News298HeaderFront.swf',
    featureStory: 'archives:News298FeatureStory.swf',
    supportStory: 'archives:News298SupportStory.swf',
    upcomingEvents: 'archives:News298UpcomingEvents.swf',
    newsFlash: 'archives:News298NewsFlash.swf',
    askFront: 'archives:News298AskAuntArcticFront.swf',
    headerBack: 'archives:News298HeaderBack.swf',
    askBack: 'archives:News298AskAuntArcticBack.swf',
    jokes: 'archives:News298JokesAndRiddles.swf',
    secret: 'archives:News298SecretOverlay.swf',
    featureMore: 'archives:News298FeatureMore.swf',
    navigationBack: 'archives:News298NavigationBack.swf',
    navigationFront: 'archives:News298NavigationFront.swf',
    dividersBack: null,
    dividersFront: null,
    secrets: 'archives:News298Secrets.swf',
    submit: 'archives:News298SubmitYourContent.swf',
  },
  {
    date: '2011-07-14',
    headline: 'CALL ROCKHOPPER TO THE PARTY!',
    headerFront: 'archives:News299HeaderFront.swf',
    featureStory: 'archives:News299FeatureStory.swf',
    supportStory: 'archives:News299SupportStory.swf',
    upcomingEvents: 'archives:News299UpcomingEvents.swf',
    newsFlash: 'archives:News299NewsFlash.swf',
    askFront: 'archives:News299AskAuntArcticFront.swf',
    headerBack: 'archives:News299HeaderBack.swf',
    askBack: 'archives:News299AskAuntArcticBack.swf',
    jokes: 'archives:News299JokesAndRiddles.swf',
    secret: 'archives:News299SecretOverlay.swf',
    featureMore: 'archives:News299FeatureMore.swf',
    navigationBack: 'archives:News299NavigationBack.swf',
    navigationFront: 'archives:News299NavigationFront.swf',
    secrets: 'archives:News299Secrets.swf',
    submit: 'archives:News299SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-07-22',
    headline: 'CREAM SODA MISSING! JOIN THE SEARCH!',
    headerFront: 'archives:News300HeaderFront.swf',
    featureStory: 'archives:News300FeatureStory.swf',
    supportStory: 'archives:News300SupportStory.swf',
    upcomingEvents: 'archives:News300UpcomingEvents.swf',
    newsFlash: 'archives:News300NewsFlash.swf',
    askFront: 'archives:News300AskAuntArcticFront.swf',
    headerBack: 'archives:News300HeaderBack.swf',
    askBack: 'archives:News300AskAuntArcticBack.swf',
    jokes: 'archives:News300JokesAndRiddles.swf',
    secret: 'archives:News300SecretOverlay.swf',
    featureMore: 'archives:News300FeatureMore.swf',
    navigationBack: 'archives:News300NavigationBack.swf',
    navigationFront: 'archives:News300NavigationFront.swf',
    secrets: 'archives:News300Secrets.swf',
    submit: 'archives:News300SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-07-28',
    headline: 'CREAM SODA FOUND! MYSTERY REMAINS...',
    headerFront: 'archives:News301HeaderFront.swf',
    featureStory: 'archives:News301FeatureStory.swf',
    supportStory: 'archives:News301SupportStory.swf',
    upcomingEvents: 'archives:News301UpcomingEvents.swf',
    newsFlash: 'archives:News301NewsFlash.swf',
    askFront: 'archives:News301AskAuntArcticFront.swf',
    headerBack: 'archives:News301HeaderBack.swf',
    askBack: 'archives:News301AskAuntArcticBack.swf',
    jokes: 'archives:News301JokesAndRiddles.swf',
    secret: 'archives:News301SecretOverlay.swf',
    featureMore: 'archives:News301FeatureMore.swf',
    navigationBack: 'archives:News301NavigationBack.swf',
    navigationFront: 'archives:News301NavigationFront.swf',
    secrets: 'archives:News301Secrets.swf',
    submit: 'archives:News301SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-08-04',
    headline: 'THE GREAT SNOW RACE ANNOUNCED!',
    headerFront: 'archives:News302HeaderFront.swf',
    featureStory: 'archives:News302FeatureStory.swf',
    supportStory: 'archives:News302SupportStory.swf',
    upcomingEvents: 'archives:News302UpcomingEvents.swf',
    newsFlash: 'archives:News302NewsFlash.swf',
    askFront: 'archives:News302AskAuntArcticFront.swf',
    headerBack: 'archives:News302HeaderBack.swf',
    askBack: 'archives:News302AskAuntArcticBack.swf',
    jokes: 'archives:News302JokesAndRiddles.swf',
    secret: 'archives:News302SecretOverlay.swf',
    featureMore: 'archives:News302FeatureMore.swf',
    navigationBack: 'archives:News302NavigationBack.swf',
    navigationFront: 'archives:News302NavigationFront.swf',
    secrets: 'archives:News302Secrets.swf',
    submit: 'archives:News302SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-08-11',
    headline: 'AWESOME ADVENTURING AHEAD!',
    headerFront: 'archives:News303HeaderFront.swf',
    featureStory: 'archives:News303FeatureStory.swf',
    supportStory: 'archives:News303SupportStory.swf',
    upcomingEvents: 'archives:News303UpcomingEvents.swf',
    newsFlash: 'archives:News303NewsFlash.swf',
    askFront: 'archives:News303AskAuntArcticFront.swf',
    headerBack: 'archives:News303HeaderBack.swf',
    askBack: 'archives:News303AskAuntArcticBack.swf',
    jokes: 'archives:News303JokesAndRiddles.swf',
    secret: 'archives:News303SecretOverlay.swf',
    featureMore: 'archives:News303FeatureMore.swf',
    navigationBack: 'archives:News303NavigationBack.swf',
    navigationFront: 'archives:News303NavigationFront.swf',
    secrets: 'archives:News303Secrets.swf',
    submit: 'archives:News303SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-08-18',
    headline: 'WORKERS NEEDED IN THE SKI VILLAGE',
    headerFront: 'archives:News304HeaderFront.swf',
    featureStory: 'archives:News304FeatureStory.swf',
    supportStory: 'archives:News304SupportStory.swf',
    upcomingEvents: 'archives:News304UpcomingEvents.swf',
    newsFlash: 'archives:News304NewsFlash.swf',
    askFront: 'archives:News304AskAuntArcticFront.swf',
    headerBack: 'archives:News304HeaderBack.swf',
    askBack: 'archives:News304AskAuntArcticBack.swf',
    jokes: 'archives:News304JokesAndRiddles.swf',
    secret: 'archives:News304SecretOverlay.swf',
    featureMore: 'archives:News304FeatureMore.swf',
    navigationBack: 'archives:News304NavigationBack.swf',
    navigationFront: 'archives:News304NavigationFront.swf',
    secrets: 'archives:News304Secrets.swf',
    submit: 'archives:News304SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null,
    supportMore: 'archives:News304SupportMore.swf'
  },
  {
    date: '2011-08-25',
    headline: 'THE GREAT SNOW RACE IS ON!',
    headerFront: 'archives:News305HeaderFront.swf',
    featureStory: 'archives:News305FeatureStory.swf',
    supportStory: 'archives:News305SupportStory.swf',
    upcomingEvents: 'archives:News305UpcomingEvents.swf',
    newsFlash: 'archives:News305NewsFlash.swf',
    askFront: 'archives:News305AskAuntArcticFront.swf',
    headerBack: 'archives:News305HeaderBack.swf',
    askBack: 'archives:News305AskAuntArcticBack.swf',
    jokes: 'archives:News305JokesAndRiddles.swf',
    secret: 'archives:News305SecretOverlay.swf',
    featureMore: 'archives:News305FeatureMore.swf',
    navigationBack: 'archives:News305NavigationBack.swf',
    navigationFront: 'archives:News305NavigationFront.swf',
    answers: 'archives:News305RiddlesAnswers.swf',
    secrets: 'archives:News305Secrets.swf',
    submit: 'archives:News305SubmitYourContent.swf',
    supportMore: 'archives:News305SupportMore.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-09-01',
    headline: 'THE ISLAND IS SAFE!',
    headerFront: 'archives:News306HeaderFront.swf',
    featureStory: 'archives:News306FeatureStory.swf',
    supportStory: 'archives:News306SupportStory.swf',
    upcomingEvents: 'archives:News306UpcomingEvents.swf',
    newsFlash: 'archives:News306NewsFlash.swf',
    askFront: 'archives:News306AskAuntArcticFront.swf',
    headerBack: 'archives:News306HeaderBack.swf',
    askBack: 'archives:News306AskAuntArcticBack.swf',
    jokes: 'archives:News306JokesAndRiddles.swf',
    secret: 'archives:News306SecretOverlay.swf',
    featureMore: 'archives:News306FeatureMore.swf',
    navigationBack: 'archives:News306NavigationBack.swf',
    navigationFront: 'archives:News306NavigationFront.swf',
    answers: 'archives:News306RiddlesAnswers.swf',
    secrets: 'archives:News306Secrets.swf',
    submit: 'archives:News306SubmitYourContent.swf',
    supportMore: 'archives:News306SupportMore.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-09-08',
    headline: 'IT\'S TIME TO PREPARE FOR THE FAIR!',
    headerFront: 'archives:News307HeaderFront.swf',
    featureStory: 'archives:News307FeatureStory.swf',
    supportStory: 'archives:News307SupportStory.swf',
    upcomingEvents: 'archives:News307UpcomingEvents.swf',
    newsFlash: 'archives:News307NewsFlash.swf',
    askFront: 'archives:News307AskAuntArcticFront.swf',
    headerBack: 'archives:News307HeaderBack.swf',
    askBack: 'archives:News307AskAuntArcticBack.swf',
    jokes: 'archives:News307JokesAndRiddles.swf',
    secret: 'archives:News307SecretOverlay.swf',
    featureMore: 'archives:News307FeatureMore.swf',
    navigationBack: 'archives:News307NavigationBack.swf',
    navigationFront: 'archives:News307NavigationFront.swf',
    answers: 'archives:News307RiddlesAnswers.swf',
    secrets: 'archives:News307Secrets.swf',
    submit: 'archives:News307SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-09-15',
    headline: 'FAIR GAMES ARE COMING SOON!',
    headerFront: 'archives:News308HeaderFront.swf',
    featureStory: 'archives:News308FeatureStory.swf',
    supportStory: 'archives:News308SupportStory.swf',
    upcomingEvents: 'archives:News308UpcomingEvents.swf',
    newsFlash: 'archives:News308NewsFlash.swf',
    askFront: 'archives:News308AskAuntArcticFront.swf',
    headerBack: 'archives:News308HeaderBack.swf',
    askBack: 'archives:News308AskAuntArcticBack.swf',
    jokes: 'archives:News308JokesAndRiddles.swf',
    secret: 'archives:News308SecretOverlay.swf',
    featureMore: 'archives:News308FeatureMore.swf',
    navigationBack: 'archives:News308NavigationBack.swf',
    navigationFront: 'archives:News308NavigationFront.swf',
    answers: 'archives:News308RiddlesAnswers.swf',
    secrets: 'archives:News308Secrets.swf',
    submit: 'archives:News308SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-09-22',
    headline: 'THE FAIR IS HERE! STEP RIGHT UP!',
    headerFront: 'archives:News309HeaderFront.swf',
    featureStory: 'archives:News309FeatureStory.swf',
    supportStory: 'archives:News309SupportStory.swf',
    upcomingEvents: 'archives:News309UpcomingEvents.swf',
    newsFlash: 'archives:News309NewsFlash.swf',
    askFront: 'archives:News309AskAuntArcticFront.swf',
    headerBack: 'archives:News309HeaderBack.swf',
    askBack: 'archives:News309AskAuntArcticBack.swf',
    jokes: 'archives:News309JokesAndRiddles.swf',
    secret: 'archives:News309SecretOverlay.swf',
    featureMore: 'archives:News309FeatureMore.swf',
    navigationBack: 'archives:News309NavigationBack.swf',
    navigationFront: 'archives:News309NavigationFront.swf',
    answers: 'archives:News309RiddlesAnswers.swf',
    secrets: 'archives:News309Secrets.swf',
    submit: 'archives:News309SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-09-29',
    headline: 'TRAFFIC JAM AT THE STADIUM!',
    headerFront: 'archives:News310HeaderFront.swf',
    featureStory: 'archives:News310FeatureStory.swf',
    supportStory: 'archives:News310SupportStory.swf',
    upcomingEvents: 'archives:News310UpcomingEvents.swf',
    newsFlash: 'archives:News310NewsFlash.swf',
    askFront: 'archives:News310AskAuntArcticFront.swf',
    headerBack: 'archives:News310HeaderBack.swf',
    askBack: 'archives:News310AskAuntArcticBack.swf',
    jokes: 'archives:News310JokesAndRiddles.swf',
    secret: 'archives:News310SecretOverlay.swf',
    featureMore: 'archives:News310FeatureMore.swf',
    navigationBack: 'archives:News310NavigationBack.swf',
    navigationFront: 'archives:News310NavigationFront.swf',
    answers: 'archives:News310RiddlesAnswers.swf',
    secrets: 'archives:News310Secrets.swf',
    submit: 'archives:News310SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-10-06',
    headline: 'PUFFLE HATS IN THE PET SHOP!',
    headerFront: 'archives:News311HeaderFront.swf',
    featureStory: 'archives:News311FeatureStory.swf',
    supportStory: 'archives:News311SupportStory.swf',
    upcomingEvents: 'archives:News311UpcomingEvents.swf',
    newsFlash: 'archives:News311NewsFlash.swf',
    askFront: 'archives:News311AskAuntArcticFront.swf',
    headerBack: 'archives:News311HeaderBack.swf',
    askBack: 'archives:News311AskAuntArcticBack.swf',
    jokes: 'archives:News311JokesAndRiddles.swf',
    secret: 'archives:News311SecretOverlay.swf',
    featureMore: 'archives:News311FeatureMore.swf',
    navigationBack: 'archives:News311NavigationBack.swf',
    navigationFront: 'archives:News311NavigationFront.swf',
    secrets: 'archives:News311Secrets.swf',
    submit: 'archives:News311SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-10-13',
    headline: 'HALLOWEEN IS COMING...',
    headerFront: 'archives:News312HeaderFront.swf',
    featureStory: 'archives:News312FeatureStory.swf',
    supportStory: 'archives:News312SupportStory.swf',
    upcomingEvents: 'archives:News312UpcomingEvents.swf',
    newsFlash: 'archives:News312NewsFlash.swf',
    askFront: 'archives:News312AskAuntArcticFront.swf',
    headerBack: 'archives:News312HeaderBack.swf',
    askBack: 'archives:News312AskAuntArcticBack.swf',
    jokes: 'archives:News312JokesAndRiddles.swf',
    secret: 'archives:News312SecretOverlay.swf',
    featureMore: 'archives:News312FeatureMore.swf',
    navigationBack: 'archives:News312NavigationBack.swf',
    navigationFront: 'archives:News312NavigationFront.swf',
    secrets: 'archives:News312Secrets.swf',
    submit: 'archives:News312SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-10-20',
    headline: 'HALLOWEEN PARTY ON NOW!',
    headerFront: 'archives:News313HeaderFront.swf',
    featureStory: 'archives:News313FeatureStory.swf',
    supportStory: 'archives:News313SupportStory.swf',
    upcomingEvents: 'archives:News313UpcomingEvents.swf',
    newsFlash: 'archives:News313NewsFlash.swf',
    askFront: 'archives:News313AskAuntArcticFront.swf',
    headerBack: 'archives:News313HeaderBack.swf',
    askBack: 'archives:News313AskAuntArcticBack.swf',
    jokes: 'archives:News313JokesAndRiddles.swf',
    secret: 'archives:News313SecretOverlay.swf',
    featureMore: 'archives:News313FeatureMore.swf',
    navigationBack: 'archives:News313NavigationBack.swf',
    navigationFront: 'archives:News313NavigationFront.swf',
    secrets: 'archives:News313Secrets.swf',
    submit: 'archives:News313SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-10-27',
    headline: 'CREEPY CASTING CALL!',
    headerFront: 'archives:News314HeaderFront.swf',
    featureStory: 'archives:News314FeatureStory.swf',
    supportStory: 'archives:News314SupportStory.swf',
    upcomingEvents: 'archives:News314UpcomingEvents.swf',
    newsFlash: 'archives:News314NewsFlash.swf',
    askFront: 'archives:News314AskAuntArcticFront.swf',
    headerBack: 'archives:News314HeaderBack.swf',
    askBack: 'archives:News314AskAuntArcticBack.swf',
    jokes: 'archives:News314JokesAndRiddles.swf',
    secret: 'archives:News314SecretOverlay.swf',
    featureMore: 'archives:News314FeatureMore.swf',
    navigationBack: 'archives:News314NavigationBack.swf',
    navigationFront: 'archives:News314NavigationFront.swf',
    secrets: 'archives:News314Secrets.swf',
    submit: 'archives:News314SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-11-03',
    headline: 'NEW PUFFLESCAPE GAME OUT NOW!',
    headerFront: 'archives:News315HeaderFront.swf',
    featureStory: 'archives:News315FeatureStory.swf',
    supportStory: 'archives:News315SupportStory.swf',
    upcomingEvents: 'archives:News315UpcomingEvents.swf',
    newsFlash: 'archives:News315NewsFlash.swf',
    askFront: 'archives:News315AskAuntArcticFront.swf',
    headerBack: 'archives:News315HeaderBack.swf',
    askBack: 'archives:News315AskAuntArcticBack.swf',
    jokes: 'archives:News315JokesAndRiddles.swf',
    secrets: 'archives:News315Secret.swf',
    featureMore: 'archives:News315FeatureMore.swf',
    navigationBack: 'archives:News315NavigationBack.swf',
    navigationFront: 'archives:News315NavigationFront.swf',
    submit: 'archives:News315SubmitYourContent.swf',
    supportMore: 'archives:News315SupportMore.swf',
    secret: undefined,
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-11-10',
    headline: 'CARD-JITSU CHANGES COMING!',
    headerFront: 'archives:News316HeaderFront.swf',
    featureStory: 'archives:News316FeatureStory.swf',
    supportStory: 'archives:News316SupportStory.swf',
    upcomingEvents: 'archives:News316UpcomingEvents.swf',
    newsFlash: 'archives:News316NewsFlash.swf',
    askFront: 'archives:News316AskAuntArcticFront.swf',
    headerBack: 'archives:News316HeaderBack.swf',
    askBack: 'archives:News316AskAuntArcticBack.swf',
    jokes: 'archives:News316JokesAndRiddles.swf',
    secret: 'archives:News316SecretOverlay.swf',
    featureMore: 'archives:News316FeatureMore.swf',
    navigationBack: 'archives:News316NavigationBack.swf',
    navigationFront: 'archives:News316NavigationFront.swf',
    answers: 'archives:News316RiddlesAnswers.swf',
    secrets: 'archives:News316Secrets.swf',
    submit: 'archives:News316SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-11-17',
    headline: 'PARTY CONSTRUCTION IS ON!',
    headerFront: 'archives:News317HeaderFront.swf',
    featureStory: 'archives:News317FeatureStory.swf',
    supportStory: 'archives:News317SupportStory.swf',
    upcomingEvents: 'archives:News317UpcomingEvents.swf',
    newsFlash: 'archives:News317NewsFlash.swf',
    askFront: 'archives:News317AskAuntArcticFront.swf',
    headerBack: 'archives:News317HeaderBack.swf',
    askBack: 'archives:News317AskAuntArcticBack.swf',
    jokes: 'archives:News317JokesAndRiddles.swf',
    secret: 'archives:News317SecretOverlay.swf',
    featureMore: 'archives:News317FeatureMore.swf',
    navigationBack: 'archives:News317NavigationBack.swf',
    navigationFront: 'archives:News317NavigationFront.swf',
    secrets: 'archives:News317Secrets.swf',
    submit: 'archives:News317SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-11-24',
    headline: 'LET THE BATTLE BEGIN!',
    headerFront: 'archives:News318HeaderFront.swf',
    featureStory: 'archives:News318FeatureStory.swf',
    supportStory: 'archives:News318SupportStory.swf',
    upcomingEvents: 'archives:News318UpcomingEvents.swf',
    newsFlash: 'archives:News318NewsFlash.swf',
    askFront: 'archives:News318AskAuntArcticFront.swf',
    headerBack: 'archives:News318HeaderBack.swf',
    askBack: 'archives:News318AskAuntArcticBack.swf',
    jokes: 'archives:News318JokesAndRiddles.swf',
    secret: 'archives:News318SecretOverlay.swf',
    featureMore: 'archives:News318FeatureMore.swf',
    navigationBack: 'archives:News318NavigationBack.swf',
    navigationFront: 'archives:News318NavigationFront.swf',
    answers: 'archives:News318RiddlesAnswers.swf',
    secrets: 'archives:News318Secrets.swf',
    submit: 'archives:News318SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-12-01',
    headline: 'NINJA HIDEOUT OPEN TO ALL!',
    headerFront: 'archives:News319HeaderFront.swf',
    featureStory: 'archives:News319FeatureStory.swf',
    supportStory: 'archives:News319SupportStory.swf',
    upcomingEvents: 'archives:News319UpcomingEvents.swf',
    newsFlash: 'archives:News319NewsFlash.swf',
    askFront: 'archives:News319AskAuntArcticFront.swf',
    headerBack: 'archives:News319HeaderBack.swf',
    askBack: 'archives:News319AskAuntArcticBack.swf',
    jokes: 'archives:News319JokesAndRiddles.swf',
    secret: 'archives:News319SecretOverlay.swf',
    featureMore: 'archives:News319FeatureMore.swf',
    navigationBack: 'archives:News319NavigationBack.swf',
    navigationFront: 'archives:News319NavigationFront.swf',
    secrets: 'archives:News319Secrets.swf',
    submit: 'archives:News319SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-12-08',
    headline: 'COINS FOR CHANGE IS COMING!',
    headerFront: 'archives:News320HeaderFront.swf',
    featureStory: 'archives:News320FeatureStory.swf',
    supportStory: 'archives:News320SupportStory.swf',
    upcomingEvents: 'archives:News320UpcomingEvents.swf',
    newsFlash: 'archives:News320NewsFlash.swf',
    askFront: 'archives:News320AskAuntArcticFront.swf',
    headerBack: 'archives:News320HeaderBack.swf',
    askBack: 'archives:News320AskAuntArcticBack.swf',
    jokes: 'archives:News320JokesAndRiddles.swf',
    secret: 'archives:News320SecretOverlay.swf',
    featureMore: 'archives:News320FeatureMore.swf',
    navigationBack: 'archives:News320NavigationBack.swf',
    navigationFront: 'archives:News320NavigationFront.swf',
    secrets: 'archives:News320Secrets.swf',
    submit: 'archives:News320SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-12-15',
    headline: 'COINS FOR CHANGE IS HERE!',
    headerFront: 'archives:News321HeaderFront.swf',
    featureStory: 'archives:News321FeatureStory.swf',
    supportStory: 'archives:News321SupportStory.swf',
    upcomingEvents: 'archives:News321UpcomingEvents.swf',
    newsFlash: 'archives:News321NewsFlash.swf',
    askFront: 'archives:News321AskAuntArcticFront.swf',
    headerBack: 'archives:News321HeaderBack.swf',
    askBack: 'archives:News321AskAuntArcticBack.swf',
    jokes: 'archives:News321JokesAndRiddles.swf',
    secret: 'archives:News321SecretOverlay.swf',
    featureMore: 'archives:News321FeatureMore.swf',
    navigationBack: 'archives:News321NavigationBack.swf',
    navigationFront: 'archives:News321NavigationFront.swf',
    secrets: 'archives:News321Secrets.swf',
    submit: 'archives:News321SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-12-22',
    headline: 'DONATE YE TREASURE TO COINS FOR CHANGE',
    headerFront: 'archives:News322HeaderFront.swf',
    featureStory: 'archives:News322FeatureStory.swf',
    supportStory: 'archives:News322SupportStory.swf',
    upcomingEvents: 'archives:News322UpcomingEvents.swf',
    newsFlash: 'archives:News322NewsFlash.swf',
    askFront: 'archives:News322AskAuntArcticFront.swf',
    headerBack: 'archives:News322HeaderBack.swf',
    askBack: 'archives:News322AskAuntArcticBack.swf',
    jokes: 'archives:News322JokesAndRiddles.swf',
    secret: 'archives:News322SecretOverlay.swf',
    featureMore: 'archives:News322FeatureMore.swf',
    navigationBack: 'archives:News322NavigationBack.swf',
    navigationFront: 'archives:News322NavigationFront.swf',
    secrets: 'archives:News322Secrets.swf',
    submit: 'archives:News322SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    date: '2011-12-29',
    headline: 'COINS FOR CHANGE FILLS THE LIGHTHOUSE!',
    headerFront: 'archives:News323HeaderFront.swf',
    featureStory: 'archives:News323FeatureStory.swf',
    supportStory: 'archives:News323SupportStory.swf',
    upcomingEvents: 'archives:News323UpcomingEvents.swf',
    newsFlash: 'archives:News323NewsFlash.swf',
    askFront: 'archives:News323AskAuntArcticFront.swf',
    headerBack: 'archives:News323HeaderBack.swf',
    askBack: 'archives:News323AskAuntArcticBack.swf',
    jokes: 'archives:News323JokesAndRiddles.swf',
    secret: 'archives:News323SecretOverlay.swf',
    featureMore: 'archives:News323FeatureMore.swf',
    navigationBack: 'archives:News323NavigationBack.swf',
    navigationFront: 'archives:News323NavigationFront.swf',
    secrets: 'archives:News323Secrets.swf',
    submit: 'archives:News323SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  }
];