/** Module for all newspapers in the game */

import { FileRef } from "./files";

export type PreBoilerRoomPaper = FileRef;

export type BoilerRoomPaper = {
  file: FileRef;
  title: string;
}

export type As3Newspaper = {
  title: string;
  askFront: string;
  dividersFront: string | null;
  featureStory: string;
  featureMore?: string | null;
  headerFront: string | null;
  navigationFront: string | null;
  newsFlash: string;
  supportStory: string;
  supportMore?: string | null;
  upcomingEvents: string;
  askBack: string;
  dividersBack: string | null;
  headerBack: string | null;
  jokes: string | null;
  navigationBack: string | null;
  submit: string | null;
  answers?: string;
  secrets: string | null;
  extraJokes?: string;
  secret: string | undefined | null;
  iglooWinners?: string;
  extra?: string;
}

export const PRE_BOILER_ROOM_PAPERS: PreBoilerRoomPaper[] = [
  'archives:News1.swf',
  'archives:News2.swf',
  'archives:News3.swf',
  'archives:News4.swf',
  'archives:News5.swf',
  'archives:News6.swf',
  'archives:News7.swf',
  'archives:News8.swf',
  'archives:News9.swf',
  'archives:News10.swf',
  'archives:News11.swf',
  'archives:News12.swf',
  'archives:News13.swf',
  'archives:News14.swf',
  'archives:News15.swf',
  'archives:News16.swf',
  'archives:News17.swf',
  'archives:News18.swf',
  'archives:News19.swf',
  'archives:News20.swf',
  'archives:News21.swf',
  'archives:News22.swf',
  'archives:News23.swf',
  'archives:News24.swf',
  'archives:News25.swf'
];

export const BOILER_ROOM_PAPERS: BoilerRoomPaper[] = [
  {
    title: 'EASTER EGG HUNT!!',
    file: 'archives:News26.swf'
  },
  {
    title: 'GO GREEN FOR THE SPRING!',
    file: 'archives:News27.swf'
  },
  {
    title: 'UNDERGROUND CAVES FOUND!!',
    file: 'archives:News28.swf'
  },
  {
    title: 'CAVE CONSTRUCTION!!',
    file: 'archives:News29.swf'
  },
  {
    title: 'CAVE EXCLUSIVE',
    file: 'archives:News30.swf'
  },
  {
    title: 'IGLOO DECORATING SPECIAL',
    file: 'archives:News31.swf'
  },
  {
    title: 'MINE SHAFTS',
    file: 'archives:News32.swf'
  },
  {
    title: 'UNDERGROUND OPENING',
    file: 'archives:News33.swf'
  },
  {
    title: 'SUMMER PARTY!!',
    file: 'archives:News34.swf'
  },
  {
    title: 'SUMMER PARTY!!',
    file: 'archives:News35.swf'
  },
  {
    title: 'SUMMER PARTY CONTINUES!!',
    file: 'archives:News36.swf'
  },
  {
    title: 'WESTERN THEME',
    file: 'archives:News37.swf'
  },
  {
    title: 'WADDLE IN THE WEST',
    file: 'archives:News38.swf'
  },
  {
    title: 'BAND REUNION',
    file: 'archives:News39.swf'
  },
  {
    title: 'FIND THE MISSING INSTRUMENTS',
    file: 'archives:News40.swf'
  },
  {
    title: 'HISTORY OF MANCALA',
    file: 'archives:News41.swf'
  },
  {
    title: 'LET THE GAMES BEGIN!!',
    file: 'archives:News42.swf'
  },
  {
    title: 'SECRET AGENT MAKES TOWN SAFE',
    file: 'archives:News43.swf'
  },
  {
    title: 'NEW FITNESS EQUIPMENT',
    file: 'archives:News44.swf'
  },
  {
    title: 'PURPLE PUFFLES FOR ADOPTION',
    file: 'archives:News45.swf'
  },
  {
    title: 'LIGHTHOUSE UNDER THE SPOTLIGHT',
    file: 'archives:News46.swf'
  },
  {
    title: 'SAVE THE LIGHTHOUSE!!',
    file: 'archives:News47.swf'
  },
  {
    title: 'LIVING IN STYLE',
    file: 'archives:News48.swf'
  },
  {
    title: 'LIGHT UP THE HOUSE',
    file: 'archives:News49.swf'
  },
    {
    title: 'WALKING PUFFLES!',
    file: 'archives:News50.swf'
  },
  {
    title: 'HALLOWEEN HULLABALOO',
    file: 'archives:News51.swf'
  },
  {
    title: 'SHIP ASHORE',
    file: 'archives:News52.swf'
  },
  {
    title: 'HAUNTED IGLOO DECOR',
    file: 'archives:News53.swf'
  },
  {
    title: 'CRASH LANDING',
    file: 'archives:News54.swf'
  },
  {
    title: 'PENGUINS TAKE FLIGHT',
    file: 'archives:News55.swf'
  },
  {
    title: 'A COLORFUL MISTAKE',
    file: 'archives:News56.swf'
  },
  {
    title: 'MAKING WAVES',
    file: 'archives:News57.swf'
  },
  {
    title: 'GRIN FOR GREEN',
    file: 'archives:News58.swf'
  },
  {
    title: 'ROCKHOPPER\'S SHIP SPOTTED',
    file: 'archives:News59.swf'
  },
  {
    title: 'ROCKHOPPER LANDS TOMORROW',
    file: 'archives:News60.swf'
  },
  {
    title: 'IGLOO DECORATING CONTEST',
    file: 'archives:News61.swf'
  },
  {
    title: 'A VERY WHITE CHRISTMAS',
    file: 'archives:News62.swf'
  },
  {
    title: 'HAPPY NEW YEAR!',
    file: 'archives:News63.swf'
  },
  {
    title: 'WINTER FIESTA!',
    file: 'archives:News64.swf'
  },
  {
    title: 'TOUR GUIDES TO ARRIVE',
    file: 'archives:News65.swf'
  },
  {
    title: 'GET FLOORED!',
    file: 'archives:News66.swf'
  },
  {
    title: 'TOUR GUIDES NEEDED',
    file: 'archives:News67.swf'
  },
  {
    title: 'FESTIVAL OF SNOW',
    file: 'archives:News68.swf'
  },
  {
    title: 'WINNERS ANNOUNCED',
    file: 'archives:News69.swf'
  },
  {
    title: 'GARY THE GADGET GUY',
    file: 'archives:News70.swf'
  },
  {
    title: 'PIZZATRON 3000',
    file: 'archives:News71.swf'
  },
  {
    title: 'MESSAGE IN A BOTTLE',
    file: 'archives:News72.swf'
  },
  {
    title: 'ST. PATRICK\'S DAY 07',
    file: 'archives:News73.swf'
  },
  {
    title: 'CHARMED CELEBRATIONS',
    file: 'archives:News74.swf'
  },
  {
    title: 'PUMPED UP PUFFLE PLAY',
    file: 'archives:News75.swf'
  },
  {
    title: 'APRIL FOOL\'S DAY',
    file: 'archives:News76.swf'
  },
  {
    title: 'EASTER EGG HUNT',
    file: 'archives:News77.swf'
  },
  {
    title: 'STAGED FUN',
    file: 'archives:News78.swf'
  },
  {
    title: 'PIRATE PARTY PARADISE',
    file: 'archives:News79.swf'
  },
  {
    title: 'PARTY ON (DECK)!',
    file: 'archives:News80.swf'
  },
  {
    title: 'SHIPSHAPE SURPRISE',
    file: 'archives:News81.swf'
  },
  {
    title: 'LOCATION LOST',
    file: 'archives:News82.swf'
  },
  {
    title: 'THE MAP QUEST',
    file: 'archives:News83.swf'
  },
  {
    title: 'PATH TO THE COVE',
    file: 'archives:News84.swf'
  },
  {
    title: 'CURIOUS CONSTRUCTION EXPLAINED',
    file: 'archives:News85.swf'
  },
  {
    title: 'BIG SUMMER BASH',
    file: 'archives:News86.swf'
  },
  {
    title: 'SUMMER PARTY CONTINUES',
    file: 'archives:News87.swf'
  },
  {
    title: 'PIRATE PUFFLE ON BOARD',
    file: 'archives:News88.swf'
  },
  {
    title: 'FAR OUT SURFING',
    file: 'archives:News89.swf'
  },
  {
    title: 'WATER PARTY',
    file: 'archives:News90.swf'
  },
  {
    title: 'UNDERGROUND CLOSED',
    file: 'archives:News91.swf'
  },
  {
    title: 'WATER PARTY EXTENDED',
    file: 'archives:News92.swf'
  },
  {
    title: 'WATER PARTY A BIG SPLASH',
    file: 'archives:News93.swf'
  },
  {
    title: 'WINNERS ANNOUNCED',
    file: 'archives:News94.swf'
  },
  {
    title: 'OUTFIT CONTEST WINNERS ANNOUNCED',
    file: 'archives:News95.swf'
  },
  {
    title: 'CAMP PENGUIN',
    file: 'archives:News96.swf'
  },
  {
    title: 'CAMP PENGUIN!',
    file: 'archives:News97.swf'
  },
  {
    title: 'SPORT SHOP UPDATE',
    file: 'archives:News98.swf'
  },
  {
    title: 'CARGO CONTENTS DISCOVERED!',
    file: 'archives:News99.swf'
  },
  {
    title: 'FALL FAIR APPROACHING',
    file: 'archives:News100.swf'
  },
  {
    title: 'FALL FAIR STARTS FRIDAY!',
    file: 'archives:News101.swf'
  },
  {
    title: 'FALL FAIR FUN!',
    file: 'archives:News102.swf'
  },
  {
    title: 'COSTUME CONTEST!!!',
    file: 'archives:News103.swf'
  },
  {
    title: 'HEADS UP!',
    file: 'archives:News104.swf'
  },
  {
    title: 'STARLIGHT? DARKNIGHT?',
    file: 'archives:News105.swf'
  },
  {
    title: 'HALLOWEEN PARTY',
    file: 'archives:News106.swf'
  },
  {
    title: 'WIGGIN\' OUT!',
    file: 'archives:News107.swf'
  },
  {
    title: 'SURPRISE PARTY!',
    file: 'archives:News108.swf'
  },
  {
    title: 'GRAND OPENING',
    file: 'archives:News109.swf'
  },
  {
    title: 'YELLOW PUFFLES DISCOVERED!',
    file: 'archives:News110.swf'
  },
  {
    title: 'GOOD HOMES FOR YELLOW PUFFLES',
    file: 'archives:News111.swf'
  },
  {
    title: 'COINS FOR CHANGE',
    file: 'archives:ENNews112.swf'
  },
  {
    title: 'COINS FOR CHANGE',
    file: 'archives:News113.swf'
  },
  {
    title: 'CONTEST WINNERS ANNOUNCED',
    file: 'archives:News114.swf'
  },
  {
    title: 'DONATION ANNOUNCEMENT',
    file: 'archives:News115.swf'
  },
  {
    title: 'HAPPY NEW YEAR!',
    file: 'archives:News116.swf'
  },
  {
    title: 'NEW PLAY AT THE STAGE',
    file: 'archives:News117.swf'
  },
  {
    title: 'MIGRATOR CRASHES!',
    file: 'archives:News118.swf'
  },
  {
    title: 'ROCKHOPPER IS OKAY',
    file: 'archives:News119.swf'
  },
  {
    title: 'RALLY FOR ROCKHOPPER',
    file: 'archives:News120.swf'
  },
  {
    title: 'SAVE THE MIGRATOR',
    file: 'archives:News121.swf'
  },
  {
    title: 'SEA SALVAGING SUB TO SAVE SHIP',
    file: 'archives:News122.swf'
  },
  {
    title: 'SAVE THE MIGRATOR',
    file: 'archives:News123.swf'
  },
  {
    title: 'RECONSTRUCTION TO BEGIN SOON',
    file: 'archives:News124.swf'
  },
  {
    title: 'ST. PATRICK\'S DAY PARTY!',
    file: 'archives:ENNews125.swf'
  },
  {
    title: 'SALVAGED SHIP SLOWLY SURFACING',
    file: 'archives:News126.swf'
  },
  {
    title: 'FRONT-END FINALLY FISHED',
    file: 'archives:News127.swf'
  },
  {
    title: 'APRIL FOOLS!!!',
    file: 'archives:News128.swf'
  },
  {
    title: 'AUNT ARCTIC ASKED TO BE EDITOR',
    file: 'archives:News129.swf'
  },
  {
    title: 'READY REPORTERS READILY REQUESTED',
    file: 'archives:News130.swf'
  },
  {
    title: 'MIGRATOR MENDED - A PROJECT REVIEW',
    file: 'archives:News131.swf'
  },
  {
    title: 'ROCKHOPPER\'S GRAND RETURN',
    file: 'archives:News132.swf'
  },
  {
    title: 'BOAT SWEET BOAT',
    file: 'archives:News133.swf'
  },
  {
    title: 'PARTY PLANNERS PLAN SHINDIG!',
    file: 'archives:News134.swf'
  },
  {
    title: 'THE ADVENTURE BEGINS',
    file: 'archives:News135.swf'
  },
  {
    title: 'YE OLDE IGLOO CONTEST',
    file: 'archives:News136.swf'
  },
  {
    title: 'A NOVEL IDEA',
    file: 'archives:News137.swf'
  },
  {
    title: 'SUMMER KICK OFF PARTY',
    file: 'archives:News138.swf'
  },
  {
    title: 'WATER PARTY STARTS JUNE 13',
    file: 'archives:News139.swf'
  },
  {
    title: 'WATER PARTY! REVIEW',
    file: 'archives:News140.swf'
  },
  {
    title: 'TREMORS SHAKE UP THE TOWN CENTER',
    file: 'archives:News141.swf'
  },
  {
    title: 'CAPTAIN COMES BACK!',
    file: 'archives:News142.swf'
  },
  {
    title: 'SEE THE PENGUIN BAND JULY 25',
    file: 'archives:News143.swf'
  },
  {
    title: 'SUPERHEROES RETURN!',
    file: 'archives:News144.swf'
  },
  {
    title: 'IT\'S TIME TO ROCK!',
    file: 'archives:News145.swf'
  },
  {
    title: 'HARD-CORE ENCORE!',
    file: 'archives:News146.swf'
  },
  {
    title: 'MUSIC JAM REVIEW',
    file: 'archives:News147.swf'
  },
  {
    title: 'PREPARING FOR THE PENGUIN GAMES',
    file: 'archives:News148.swf'
  },
  {
    title: 'WELCOME TO THE PENGUIN GAMES',
    file: 'archives:News149.swf'
  },
  {
    title: 'PENGUIN GAMES CLOSING CEREMONIES',
    file: 'archives:News150.swf'
  },
  {
    title: 'CONSTRUCTION AT THE STAGE',
    file: 'archives:News151.swf'
  },
  {
    title: 'NEW PLAY IS A MYSTERY',
    file: 'archives:News152.swf'
  },
  {
    title: 'FALL FAIR PARTY!',
    file: 'archives:News153.swf'
  },
  {
    title: 'FALL FAIR FESTIVITIES!',
    file: 'archives:News154.swf'
  },
  {
    title: 'FALL FAIR FINISHING WITH FLAIR',
    file: 'archives:ENNews155.swf'
  },
  {
    title: 'HALLOWEEN PARTY',
    file: 'archives:ENNews156.swf'
  },
  {
    title: '3 YEAR ANNIVERSARY APPROACHES',
    file: 'archives:ENNews157.swf'
  },
  {
    title: 'ROCKHOPPER\'S READY FOR THE PARTY',
    file: 'archives:ENNews158.swf'
  },
  {
    title: 'HALLOWEEN IS HERE',
    file: 'archives:ENNews159.swf'
  },
  {
    title: 'A SHOCKING SURPRISE',
    file: 'archives:ENNews160.swf'
  },
  {
    title: 'DOJO GRAND RE-OPENING',
    file: 'archives:ENNews161.swf'
  },
  {
    title: 'NINJA TRAINING AT THE DOJO',
    file: 'archives:ENNews162.swf'
  },
  {
    title: 'THE SENSEI SPEAKS',
    file: 'archives:ENNews163.swf'
  },
  {
    title: 'THE CAPTAIN & COINS FOR CHANGE',
    file: 'archives:ENNews164.swf'
  },
  {
    title: 'CHRISTMAS WITH THE CAPTAIN',
    file: 'archives:ENNews165.swf'
  },
  {
    title: 'CHRISTMAS PARTY',
    file: 'archives:ENNews166.swf'
  },
  {
    title: 'MERRY CHRISTMAS CLUB PENGUIN!',
    file: 'archives:ENNews167.swf'
  },
  {
    title: 'DANCE FASHIONS AT THE GIFT SHOP!',
    file: 'archives:ENNews168.swf'
  },
  {
    title: 'DANCE-A-THON - A MEMBER EVENT',
    file: 'archives:ENNews169.swf'
  },
  {
    title: 'DANCE-A-THON FOR MEMBERS',
    file: 'archives:ENNews170.swf'
  },
  {
    title: 'FIESTA! PARTY',
    file: 'archives:ENNews171.swf'
  },
  {
    title: 'MUST-PLAY MULTIPLAYER GAMES',
    file: 'archives:ENNews172.swf'
  },
  {
    title: 'PUFFLES PLAY WITH THEIR FURNITURE',
    file: 'archives:ENNews173.swf'
  },
  {
    title: 'PUFFLE PARTY!',
    file: 'archives:ENNews174.swf'
  },
  {
    title: 'PUFFLE PARTY',
    file: 'archives:ENNews175.swf'
  },
  {
    title: 'ROCKHOPPER RETURNS ON FEBRUARY 27!',
    file: 'archives:ENNews176.swf'
  },
  {
    title: 'PRESENTING THE PENGUIN PLAY AWARDS',
    file: 'archives:ENNews177.swf'
  },
  {
    title: 'ST. PATRICK\'S PARTY 09',
    file: 'archives:ENNews178.swf'
  },
  {
    title: 'PENGUIN PLAY AWARDS',
    file: 'archives:ENNews179.swf'
  },
  {
    title: 'PENGUIN PLAY AWARDS CONTINUE!',
    file: 'archives:ENNews180.swf'
  },
  {
    title: 'APRIL FOOLS PARTY',
    file: 'archives:ENNews181.swf'
  },
  {
    title: 'PRESENTING THE TOP PLAYS!',
    file: 'archives:ENNews182.swf'
  },
  {
    title: 'SLEDDING NEWS!',
    file: 'archives:ENNews183.swf'
  },
  {
    title: 'A MEDIEVAL STORY...',
    file: 'archives:ENNews184.swf'
  },
  {
    title: 'A MEDIEVAL STORY PART 2...',
    file: 'archives:ENNews185.swf'
  },
  {
    title: 'MEDIEVAL PARTY',
    file: 'archives:ENNews186.swf'
  },
  {
    title: 'MEDIEVAL PARTY CONTINUES',
    file: 'archives:ENNews187.swf'
  },
  {
    title: 'ROCKHOPPER ARRIVES MAY 22',
    file: 'archives:ENNews188.swf'
  },
  {
    title: 'ROCKHOPPER\'S HERE!',
    file: 'archives:ENNews189.swf'
  },
  {
    title: 'FORECAST CALLS FOR...PARTY!',
    file: 'archives:ENNews190.swf'
  },
  {
    title: 'DISCOVER THE ADVENTURE PARTY',
    file: 'archives:ENNews191.swf'
  },
  {
    title: '101 DAYS OF FUN',
    file: 'archives:ENNews192.swf'
  },
  {
    title: 'NEW MUSIC FOR DJ3K',
    file: 'archives:ENNews193.swf'
  },
  {
    title: 'MUSIC JAM 09 IS AMPING UP',
    file: 'archives:ENNews194.swf'
  },
  {
    title: 'GETTING READY TO ROCK',
    file: 'archives:ENNews195.swf'
  },
  {
    title: 'MUSIC JAM 09 BEGINS JULY 17',
    file: 'archives:ENNews196.swf'
  },
  {
    title: 'MUSIC JAM 09 ENDS JULY 26!',
    file: 'archives:ENNews197.swf'
  },
  {
    title: 'LAST CHANCE FOR PENGUIN TALES',
    file: 'archives:ENNews198.swf'
  },
  {
    title: 'NEW COLOR IS IN!',
    file: 'archives:ENNews199.swf'
  },
  {
    title: 'FESTIVAL OF FLIGHT',
    file: 'archives:ENNews200.swf'
  },
  {
    title: 'FESTIVAL OF FLIGHT FINISHED!',
    file: 'archives:ENNews201.swf'
  },
  {
    title: 'FUN AT THE FAIR!',
    file: 'archives:ENNews202.swf'
  },
  {
    title: 'THE FAIR - JOIN IN THE FUN',
    file: 'archives:ENNews203.swf'
  },
  {
    title: 'PENGUINS THAT TIME FORGOT',
    file: 'archives:ENNews204.swf'
  },
  {
    title: 'SENSEI STARTS SCAVENGER HUNT',
    file: 'archives:ENNews205.swf'
  },
  {
    title: 'NINJAS AWAKEN VOLCANO',
    file: 'archives:ENNews206.swf'
  },
  {
    title: 'HALLOWEEN COSTUMES! OCTOBER 2',
    file: 'archives:ENNews207.swf'
  },
  {
    title: 'HALLOWEEN IGLOO CONTEST OCTOBER 16',
    file: 'archives:ENNews208.swf'
  },
  {
    title: 'HALLOWEEN IGLOO CONTEST',
    file: 'archives:ENNews209.swf'
  },
  {
    title: 'HAPPY 4TH ANNIVERSARY! OCTOBER 24',
    file: 'archives:ENNews210.swf'
  },
  {
    title: 'HALLOWEEN PARTY',
    file: 'archives:ENNews211.swf'
  },
  {
    title: 'VOLCANO TAMED - NINJAS NEEDED',
    file: 'archives:ENNews212.swf'
  },
  {
    title: 'VOLCANO CONSTRUCTION ANNOUNCED',
    file: 'archives:ENNews213.swf'
  },
  {
    title: 'CARD-JITSU FIRE',
    file: 'archives:ENNews214.swf'
  },
  {
    title: 'CARD-JITSU FIRE REVEALED',
    file: 'archives:ENNews215.swf'
  },
  {
    title: 'COINS FOR CHANGE',
    file: 'archives:ENNews216.swf'
  },
  {
    title: 'MAKE A DIFFERENCE!',
    file: 'archives:ENNews217.swf'
  },
  {
    title: 'HOLIDAY PARTY',
    file: 'archives:ENNews218.swf'
  },
  {
    title: 'HAPPY HOLIDAYS CLUB PENGUIN!',
    file: 'archives:ENNews219.swf'
  },
  {
    title: 'HAPPY NEW YEAR CLUB PENGUIN!',
    file: 'archives:ENNews220.swf'
  },
  {
    title: 'CREATE YOUR OWN T-SHIRT',
    file: 'archives:News221.swf'
  },
  {
    title: 'ROCKSLIDE AT THE MINE!',
    file: 'archives:News222.swf'
  },
  {
    title: 'SECRET CAVE DISCOVERED!',
    file: 'archives:ENNews223.swf'
  },
  {
    title: 'CAVES CLOSING UNTIL FURTHER NOTICE',
    file: 'archives:ENNews224.swf'
  },
  {
    title: 'PUFFLE PARTY',
    file: 'archives:ENNews225.swf'
  },
  {
    title: 'SECRETS OF THE BAMBOO FOREST',
    file: 'archives:ENNews226.swf'
  },
  {
    title: 'PUFFLE PARTY',
    file: 'archives:ENNews227.swf'
  },
  {
    title: 'ORANGE PUFFLES READY TO ADOPT!',
    file: 'archives:ENNews228.swf'
  },
  {
    title: 'WHERE\'S YARR?',
    file: 'archives:ENNews229.swf'
  },
  {
    title: 'PUFFLES TRAPPED UNDERGROUND!',
    file: 'archives:ENNews230.swf'
  },
  {
    title: 'PUFFLE RESCUE',
    file: 'archives:ENNews231.swf'
  },
  {
    title: 'PENGUIN PLAY AWARDS',
    file: 'archives:ENNews232.swf'
  },
  {
    title: 'HAPPY APRIL FOOLS!',
    file: 'archives:ENNews233.swf'
  },
  {
    title: 'EARTH DAY IS COMING!',
    file: 'archives:ENNews234.swf'
  },
  {
    title: 'CELEBRATE EARTH DAY!',
    file: 'archives:ENNews235.swf'
  },
  {
    title: 'EARTH DAY CELEBRATIONS BEGIN!',
    file: 'archives:ENNews236.swf'
  },
  {
    title: 'YE PENGUIN STYLE',
    file: 'archives:ENNews237.swf'
  },
  {
    title: 'MEDIEVAL PARTY',
    file: 'archives:ENNews238.swf'
  },
  {
    title: 'YOUR IGLOO-MEDIEVAL STYLE',
    file: 'archives:ENNews239.swf'
  },
  {
    title: 'POPCORN EVERYWHERE AT SPORT SHOP',
    file: 'archives:ENNews240.swf'
  },
  {
    title: 'SKI VILLAGE UNDER CONSTRUCTION',
    file: 'archives:ENNews241.swf'
  },
  {
    title: 'PENGUINS SEEKING ADVENTURE',
    file: 'archives:ENNews242.swf'
  },
  {
    title: 'ISLAND ADVENTURE PLANS REVEALED',
    file: 'archives:ENNews243.swf'
  },
  {
    title: 'THE ADVENTURE BEGINS!',
    file: 'archives:ENNews244.swf'
  },
  {
    title: 'CONTINUE YOUR ADVENTURE!',
    file: 'archives:ENNews245.swf'
  },
  {
    title: 'GET READY FOR MUSIC JAM 2010',
    file: 'archives:ENNews246.swf'
  },
  {
    title: 'MUSIC JAM!',
    file: 'archives:ENNews247.swf'
  },
  {
    title: 'KEEP JAMMIN\'',
    file: 'archives:ENNews248.swf'
  },
  {
    title: 'STAMPS ARRIVE JULY 27',
    file: 'archives:ENNews249.swf'
  },
  {
    title: 'STAMPS - CAN YOU EARN THEM ALL?',
    file: 'archives:ENNews250.swf'
  },
  {
    title: 'STAMP BOOK STYLE',
    file: 'archives:ENNews251.swf'
  },
  {
    title: 'MOUNTAIN EXPEDITION BEGINS',
    file: 'archives:ENNews252.swf'
  },
  {
    title: 'DESIGN YOUR OWN FURNITURE',
    file: 'archives:ENNews253.swf'
  },
  {
    title: 'PREPARE FOR THE FAIR',
    file: 'archives:ENNews254.swf'
  },
  {
    title: 'THE FAIR - BE THERE',
    file: 'archives:ENNews255.swf'
  },
  {
    title: 'NEW ITEMS AT PRIZE BOOTH',
    file: 'archives:ENNews256.swf'
  },
  {
    title: 'SHOWDOWN AT THE STADIUM',
    file: 'archives:ENNews257.swf'
  },
  {
    title: 'GAME ON AT THE STADIUM',
    file: 'archives:ENNews258.swf'
  },
  {
    title: 'NEW SPOOKY COSTUMES COMING!',
    file: 'archives:ENNews259.swf'
  },
  {
    title: 'HALLOWEEN IGLOO CONTEST',
    file: 'archives:ENNews260.swf'
  },
  {
    title: 'HALLOWEEN IGLOO CONTEST',
    file: 'archives:ENNews261.swf'
  },
  {
    title: 'ANNIVERSARY PARTY OCTOBER 24',
    file: 'archives:ENNews262.swf'
  },
  {
    title: 'THE HALLOWEEN PARTY IS HERE',
    file: 'archives:ENNews263.swf'
  },
  {
    title: 'NEW OUTDOOR OUTFITS',
    file: 'archives:ENNews264.swf'
  },
  {
    title: 'FIRST RAINSTORM ON RECORD',
    file: 'archives:ENNews265.swf'
  }
]

export const AS3_PAPERS: As3Newspaper[] = [
  {
    title: 'READY FOR CARD-JITSU WATER?',
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
    title: 'NINJAS SEEK TO MASTER WATER',
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
    title: 'GIFT SHOP FULL OF FESTIVE FASHION',
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
    title: 'COINS FOR CHANGE IS COMING',
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
    title: 'HOLIDAY PARTY IS HERE',
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
    title: 'LIGHTHOUSE FILLING FAST!',
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
    title: 'HAPPY NEW YEAR!',
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
    title: 'ARE ELITE AGENTS AMONG US?',
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
    title: 'EXCITED EXPLORERS PREPARE FOR EXPEDITION',
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
    title: 'BROWN PUFFLES DISCOVERED',
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
    title: 'PUFFLE FANS PREPARING',
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
    title: 'CELEBRATIONS FOR EVERY PUFFLE',
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
    title: 'PUFFLE PARTY UNDER CONSTRUCTION',
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
    title: 'PUFFLE PARTY IN FULL SWING',
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
    title: 'PUFFLES WANT MORE!',
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
    title: 'GET READY TO SHOP WITH YOUR PUFFLE',
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
    title: 'PUFFLE LAUNCH STARTS MARCH 15',
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
    title: 'APRIL FOOL\'S PARTY TO START EARLY!',
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
    title: 'EXPLORE THE BOX DIMENSION',
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
    title: 'BOX DIMENSION CAN\'T BE MAPPED',
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
    title: 'IGLOOS GO GREEN',
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
    title: 'EARTH DAY SURPRISES ARE COMING',
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
    title: 'THE ISLAND CELEBRATES EARTH DAY!',
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
    title: 'HARK! YE NEW PENGUIN STYLE!',
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
    title: 'PREPARE YE KINGDOM TO PARTY',
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
    title: 'KINGDOM CONSTRUCTION HATH BEGUN',
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
    title: 'THE QUEST HATH BEGUN!',
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
    title: 'PURPLE DRAGONS SIGHTED!',
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
    title: 'NEW MUSIC CLOTHING OUT NOW!',
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
    title: 'NEW MUSIC JAM FURNITURE!',
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
    title: 'MAKE SOME NOISE FOR MUSIC JAM!',
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
    title: 'NEW NINJA ITEMS REVEALED!',
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
    title: 'MERMAIDS SIGHTED! PIRATES TOO!',
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
    title: 'CALL ROCKHOPPER TO THE PARTY!',
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
    title: 'CREAM SODA MISSING! JOIN THE SEARCH!',
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
    title: 'CREAM SODA FOUND! MYSTERY REMAINS...',
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
    title: 'THE GREAT SNOW RACE ANNOUNCED!',
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
    title: 'AWESOME ADVENTURING AHEAD!',
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
    title: 'WORKERS NEEDED IN THE SKI VILLAGE',
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
    title: 'THE GREAT SNOW RACE IS ON!',
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
    title: 'THE ISLAND IS SAFE!',
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
    title: 'IT\'S TIME TO PREPARE FOR THE FAIR!',
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
    title: 'FAIR GAMES ARE COMING SOON!',
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
    title: 'THE FAIR IS HERE! STEP RIGHT UP!',
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
    title: 'TRAFFIC JAM AT THE STADIUM!',
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
    title: 'PUFFLE HATS IN THE PET SHOP!',
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
    title: 'HALLOWEEN IS COMING...',
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
    title: 'HALLOWEEN PARTY ON NOW!',
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
    title: 'CREEPY CASTING CALL!',
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
    title: 'NEW PUFFLESCAPE GAME OUT NOW!',
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
    title: 'CARD-JITSU CHANGES COMING!',
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
    title: 'PARTY CONSTRUCTION IS ON!',
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
    title: 'LET THE BATTLE BEGIN!',
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
    title: 'NINJA HIDEOUT OPEN TO ALL!',
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
    title: 'COINS FOR CHANGE IS COMING!',
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
    title: 'COINS FOR CHANGE IS HERE!',
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
    title: 'DONATE YE TREASURE TO COINS FOR CHANGE',
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
    title: 'COINS FOR CHANGE FILLS THE LIGHTHOUSE!',
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
  },
  {
    title: 'COINS FOR CHANGE RESULTS ARE IN!',
    headerFront: 'archives:News324HeaderFront.swf',
    featureStory: 'archives:News324FeatureStory.swf',
    supportStory: 'archives:News324SupportStory.swf',
    upcomingEvents: 'archives:News324UpcomingEvents.swf',
    newsFlash: 'archives:News324NewsFlash.swf',
    askFront: 'archives:News324AskAuntArcticFront.swf',
    headerBack: 'archives:News324HeaderBack.swf',
    askBack: 'archives:News324AskAuntArcticBack.swf',
    jokes: 'archives:News324JokesAndRiddles.swf',
    secrets: 'archives:News324Secret.swf',
    secret: 'archives:News324SecretOverlay.swf',
    featureMore: 'archives:News324FeatureMore.swf',
    navigationBack: 'archives:News324NavigationBack.swf',
    navigationFront: 'archives:News324NavigationFront.swf',
    answers: 'archives:News324RiddlesAnswers.swf',
    submit: 'archives:News324SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  }
];