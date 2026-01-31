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
    file: 'archives:ENNews181Original.swf'
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
    title: 'New Color Vote!',
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
  },
  {
    title: 'NEW EXPEDITION ANNOUNCEMENT',
    headerFront: 'archives:News325HeaderFront.swf',
    featureStory: 'archives:News325FeatureStory.swf',
    supportStory: 'archives:News325SupportStory.swf',
    upcomingEvents: 'archives:News325UpcomingEvents.swf',
    newsFlash: 'archives:News325NewsFlash.swf',
    askFront: 'archives:News325AskAuntArcticFront.swf',
    headerBack: 'archives:News325HeaderBack.swf',
    askBack: 'archives:News325AskAuntArcticBack.swf',
    jokes: 'archives:News325JokesAndRiddles.swf',
    secret: 'archives:News325SecretOverlay.swf',
    featureMore: 'archives:News325FeatureMore.swf',
    navigationBack: 'archives:News325NavigationBack.swf',
    navigationFront: 'archives:News325NavigationFront.swf',
    secrets: 'archives:News325Secrets.swf',
    submit: 'archives:News325SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'UNDERWATER FURNITURE MAKING A SPLASH',
    headerFront: 'archives:News326HeaderFront.swf',
    featureStory: 'archives:News326FeatureStory.swf',
    supportStory: 'archives:News326SupportStory.swf',
    upcomingEvents: 'archives:News326UpcomingEvents.swf',
    newsFlash: 'archives:News326NewsFlash.swf',
    askFront: 'archives:News326AskAuntArcticFront.swf',
    headerBack: 'archives:News326HeaderBack.swf',
    askBack: 'archives:News326AskAuntArcticBack.swf',
    jokes: 'archives:News326JokesAndRiddles.swf',
    secret: 'archives:News326SecretOverlay.swf',
    featureMore: 'archives:News326FeatureMore.swf',
    navigationBack: 'archives:News326NavigationBack.swf',
    navigationFront: 'archives:News326NavigationFront.swf',
    secrets: 'archives:News326Secrets.swf',
    submit: 'archives:News326SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null,
  },
  {
    title: 'CLUB PENGUIN IS TIPPING!',
    headerFront: 'archives:News327HeaderFront.swf',
    featureStory: 'archives:News327FeatureStory.swf',
    supportStory: 'archives:News327SupportStory.swf',
    upcomingEvents: 'archives:News327UpcomingEvents.swf',
    newsFlash: 'archives:News327NewsFlash.swf',
    askFront: 'archives:News327AskAuntArcticFront.swf',
    headerBack: 'archives:News327HeaderBack.swf',
    askBack: 'archives:News327AskAuntArcticBack.swf',
    jokes: 'archives:News327JokesAndRiddles.swf',
    secret: 'archives:News327SecretOverlay.swf',
    featureMore: 'archives:News327FeatureMore.swf',
    navigationBack: 'archives:News327NavigationBack.swf',
    navigationFront: 'archives:News327NavigationFront.swf',
    secrets: 'archives:News327Secrets.swf',
    submit: 'archives:News327SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null,
  },
  {
    title: 'FASHION SHOW ON NOW!',
    headerFront: 'archives:News328HeaderFront.swf',
    featureStory: 'archives:News328FeatureStory.swf',
    supportStory: 'archives:News328SupportStory.swf',
    upcomingEvents: 'archives:News328UpcomingEvents.swf',
    newsFlash: 'archives:News328NewsFlash.swf',
    askFront: 'archives:News328AskAuntArcticFront.swf',
    headerBack: 'archives:News328HeaderBack.swf',
    askBack: 'archives:News328AskAuntArcticBack.swf',
    jokes: 'archives:News328JokesAndRiddles.swf',
    secret: 'archives:News328SecretOverlay.swf',
    featureMore: 'archives:News328FeatureMore.swf',
    navigationBack: 'archives:News328NavigationBack.swf',
    navigationFront: 'archives:News328NavigationFront.swf',
    answers: 'archives:News328RiddlesAnswers.swf',
    secrets: 'archives:News328Secrets.swf',
    submit: 'archives:News328SubmitYourContent.swf',
    supportMore: 'archives:News328SupportMore.swf',
    dividersBack: null,
    dividersFront: null,
  },
  {
    title: 'FASHION SHOW ROCKS THE GIFT SHOP',
    headerFront: 'archives:News329HeaderFront.swf',
    featureStory: 'archives:News329FeatureStory.swf',
    supportStory: 'archives:News329SupportStory.swf',
    upcomingEvents: 'archives:News329UpcomingEvents.swf',
    newsFlash: 'archives:News329NewsFlash.swf',
    askFront: 'archives:News329AskAuntArcticFront.swf',
    headerBack: 'archives:News329HeaderBack.swf',
    askBack: 'archives:News329AskAuntArcticBack.swf',
    jokes: 'archives:News329JokesAndRiddles.swf',
    secret: 'archives:News329SecretOverlay.swf',
    featureMore: 'archives:News329FeatureMore.swf',
    navigationBack: 'archives:News329NavigationBack.swf',
    navigationFront: 'archives:News329NavigationFront.swf',
    secrets: 'archives:News329Secrets.swf',
    submit: 'archives:News329SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'ROCKHOPPER NEEDS YOU!',
    headerFront: 'archives:News330HeaderFront.swf',
    featureStory: 'archives:News330FeatureStory.swf',
    supportStory: 'archives:News330SupportStory.swf',
    upcomingEvents: 'archives:News330UpcomingEvents.swf',
    newsFlash: 'archives:News330NewsFlash.swf',
    askFront: 'archives:News330AskAuntArcticFront.swf',
    headerBack: 'archives:News330HeaderBack.swf',
    askBack: 'archives:News330AskAuntArcticBack.swf',
    jokes: 'archives:News330JokesAndRiddles.swf',
    secret: 'archives:News330SecretOverlay.swf',
    featureMore: 'archives:News330FeatureMore.swf',
    navigationBack: 'archives:News330NavigationBack.swf',
    navigationFront: 'archives:News330NavigationFront.swf',
    secrets: 'archives:News330Secrets.swf',
    submit: 'archives:News330SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'SET COURSE FOR ADVENTURE!',
    headerFront: 'archives:News331HeaderFront.swf',
    featureStory: 'archives:News331FeatureStory.swf',
    supportStory: 'archives:News331SupportStory.swf',
    upcomingEvents: 'archives:News331UpcomingEvents.swf',
    newsFlash: 'archives:News331NewsFlash.swf',
    askFront: 'archives:News331AskAuntArcticFront.swf',
    headerBack: 'archives:News331HeaderBack.swf',
    askBack: 'archives:News331AskAuntArcticBack.swf',
    jokes: 'archives:News331JokesAndRiddles.swf',
    secret: 'archives:News331SecretOverlay.swf',
    featureMore: 'archives:News331FeatureMore.swf',
    navigationBack: 'archives:News331NavigationBack.swf',
    navigationFront: 'archives:News331NavigationFront.swf',
    secrets: 'archives:News331Secrets.swf',
    submit: 'archives:News331SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'AVAST! THE QUEST BE ENDING MAR. 6!',
    headerFront: 'archives:News332HeaderFront.swf',
    featureStory: 'archives:News332FeatureStory.swf',
    supportStory: 'archives:News332SupportStory.swf',
    upcomingEvents: 'archives:News332UpcomingEvents.swf',
    newsFlash: 'archives:News332NewsFlash.swf',
    askFront: 'archives:News332AskAuntArcticFront.swf',
    headerBack: 'archives:News332HeaderBack.swf',
    askBack: 'archives:News332AskAuntArcticBack.swf',
    jokes: 'archives:News332JokesAndRiddles.swf',
    secret: 'archives:News332SecretOverlay.swf',
    featureMore: 'archives:News332FeatureMore.swf',
    navigationBack: 'archives:News332NavigationBack.swf',
    navigationFront: 'archives:News332NavigationFront.swf',
    secrets: 'archives:News332Secrets.swf',
    submit: 'archives:News332SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'PUFFLE PARTY BEGINS MAR. 15!',
    headerFront: 'archives:News333HeaderFront.swf',
    featureStory: 'archives:News333FeatureStory.swf',
    supportStory: 'archives:News333SupportStory.swf',
    upcomingEvents: 'archives:News333UpcomingEvents.swf',
    newsFlash: 'archives:News333NewsFlash.swf',
    askFront: 'archives:News333AskAuntArcticFront.swf',
    headerBack: 'archives:News333HeaderBack.swf',
    askBack: 'archives:News333AskAuntArcticBack.swf',
    jokes: 'archives:News333JokesAndRiddles.swf',
    secret: 'archives:News333SecretOverlay.swf',
    featureMore: 'archives:News333FeatureMore.swf',
    navigationBack: 'archives:News333NavigationBack.swf',
    navigationFront: 'archives:News333NavigationFront.swf',
    secrets: 'archives:News333Secrets.swf',
    submit: 'archives:News333SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'PUFFLE PARTY PANDEMONIUM!',
    headerFront: 'archives:News334HeaderFront.swf',
    featureStory: 'archives:News334FeatureStory.swf',
    supportStory: 'archives:News334SupportStory.swf',
    upcomingEvents: 'archives:News334UpcomingEvents.swf',
    newsFlash: 'archives:News334NewsFlash.swf',
    askFront: 'archives:News334AskAuntArcticFront.swf',
    headerBack: 'archives:News334HeaderBack.swf',
    askBack: 'archives:News334AskAuntArcticBack.swf',
    jokes: 'archives:News334JokesAndRiddles.swf',
    secret: 'archives:News334SecretOverlay.swf',
    featureMore: 'archives:News334FeatureMore.swf',
    navigationBack: 'archives:News334NavigationBack.swf',
    navigationFront: 'archives:News334NavigationFront.swf',
    secrets: 'archives:News334Secrets.swf',
    submit: 'archives:News334SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'PUFFLE PARTY POWERS ON!',
    headerFront: 'archives:News335HeaderFront.swf',
    featureStory: 'archives:News335FeatureStory.swf',
    supportStory: 'archives:News335SupportStory.swf',
    upcomingEvents: 'archives:News335UpcomingEvents.swf',
    newsFlash: 'archives:News335NewsFlash.swf',
    askFront: 'archives:News335AskAuntArcticFront.swf',
    headerBack: 'archives:News335HeaderBack.swf',
    askBack: 'archives:News335AskAuntArcticBack.swf',
    jokes: 'archives:News335JokesAndRiddles.swf',
    secret: 'archives:News335SecretOverlay.swf',
    featureMore: 'archives:News335FeatureMore.swf',
    navigationBack: 'archives:News335NavigationBack.swf',
    navigationFront: 'archives:News335NavigationFront.swf',
    secrets: 'archives:News335Secrets.swf',
    submit: 'archives:News335SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'APRIL FOOL\'S DAY PARTY!',
    headerFront: 'archives:News336HeaderFront.swf',
    featureStory: 'archives:News336FeatureStory.swf',
    supportStory: 'archives:News336SupportStory.swf',
    upcomingEvents: 'archives:News336UpcomingEvents.swf',
    newsFlash: 'archives:News336NewsFlash.swf',
    askFront: 'archives:News336AskAuntArcticFront.swf',
    headerBack: 'archives:News336HeaderBack.swf',
    askBack: 'archives:News336AskAuntArcticBack.swf',
    jokes: 'archives:News336JokesAndRiddles.swf',
    secret: 'archives:News336SecretOverlay.swf',
    featureMore: 'archives:News336FeatureMore.swf',
    navigationBack: 'archives:News336NavigationBack.swf',
    navigationFront: 'archives:News336NavigationFront.swf',
    answers: 'archives:News336RiddlesAnswers.swf',
    secrets: 'archives:News336Secrets.swf',
    submit: 'archives:News336SubmitYourContent.swf',
    supportMore: 'archives:News336SupportMore.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'EASTER EGG HUNT ON NOW!',
    headerFront: 'archives:News337HeaderFront.swf',
    featureStory: 'archives:News337FeatureStory.swf',
    supportStory: 'archives:News337SupportStory.swf',
    upcomingEvents: 'archives:News337UpcomingEvents.swf',
    newsFlash: 'archives:News337NewsFlash.swf',
    askFront: 'archives:News337AskAuntArcticFront.swf',
    headerBack: 'archives:News337HeaderBack.swf',
    askBack: 'archives:News337AskAuntArcticBack.swf',
    jokes: 'archives:News337JokesAndRiddles.swf',
    secret: 'archives:News337SecretOverlay.swf',
    featureMore: 'archives:News337FeatureMore.swf',
    navigationBack: 'archives:News337NavigationBack.swf',
    navigationFront: 'archives:News337NavigationFront.swf',
    secrets: 'archives:News337Secrets.swf',
    submit: 'archives:News337SubmitYourContent.swf',
    supportMore: 'archives:News337SupportMore.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'EARTH DAY PARTY NEXT WEEK!',
    headerFront: 'archives:News338HeaderFront.swf',
    featureStory: 'archives:News338FeatureStory.swf',
    supportStory: 'archives:News338SupportStory.swf',
    upcomingEvents: 'archives:News338UpcomingEvents.swf',
    newsFlash: 'archives:News338NewsFlash.swf',
    askFront: 'archives:News338AskAuntArcticFront.swf',
    headerBack: 'archives:News338HeaderBack.swf',
    askBack: 'archives:News338AskAuntArcticBack.swf',
    jokes: 'archives:News338JokesAndRiddles.swf',
    secret: 'archives:News338SecretOverlay.swf',
    featureMore: 'archives:News338FeatureMore.swf',
    supportMore: 'archives:News338SupportMore.swf',
    navigationBack: 'archives:News338NavigationBack.swf',
    navigationFront: 'archives:News338NavigationFront.swf',
    answers: 'archives:News338RiddlesAnswers.swf',
    secrets: 'archives:News338Secrets.swf',
    submit: 'archives:News338SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'EARTH DAY IS HERE!',
    headerFront: 'archives:News339HeaderFront.swf',
    featureStory: 'archives:News339FeatureStory.swf',
    supportStory: 'archives:News339SupportStory.swf',
    upcomingEvents: 'archives:News339UpcomingEvents.swf',
    newsFlash: 'archives:News339NewsFlash.swf',
    askFront: 'archives:News339AskAuntArcticFront.swf',
    headerBack: 'archives:News339HeaderBack.swf',
    askBack: 'archives:News339AskAuntArcticBack.swf',
    jokes: 'archives:News339JokesAndRiddles.swf',
    secret: 'archives:News339SecretOverlay.swf',
    featureMore: 'archives:News339FeatureMore.swf',
    navigationBack: 'archives:News339NavigationBack.swf',
    navigationFront: 'archives:News339NavigationFront.swf',
    secrets: 'archives:News339Secrets.swf',
    submit: 'archives:News339SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'CAN YOU CRACK THE CASE?',
    headerFront: 'archives:News340HeaderFront.swf',
    featureStory: 'archives:News340FeatureStory.swf',
    supportStory: 'archives:News340SupportStory.swf',
    upcomingEvents: 'archives:News340UpcomingEvents.swf',
    newsFlash: 'archives:News340NewsFlash.swf',
    askFront: 'archives:News340AskAuntArcticFront.swf',
    headerBack: 'archives:News340HeaderBack.swf',
    askBack: 'archives:News340AskAuntArcticBack.swf',
    jokes: 'archives:News340JokesAndRiddles.swf',
    secret: 'archives:News340SecretOverlay.swf',
    featureMore: 'archives:News340FeatureMore.swf',
    navigationBack: 'archives:News340NavigationBack.swf',
    navigationFront: 'archives:News340NavigationFront.swf',
    answers: 'archives:News340RiddlesAnswers.swf',
    secrets: 'archives:News340Secrets.swf',
    submit: 'archives:News340SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'LEGEND OF THE DARK DRAGON',
    headerFront: 'archives:News341HeaderFront.swf',
    featureStory: 'archives:News341FeatureStory.swf',
    supportStory: 'archives:News341SupportStory.swf',
    upcomingEvents: 'archives:News341UpcomingEvents.swf',
    newsFlash: 'archives:News341NewsFlash.swf',
    askFront: 'archives:News341AskAuntArcticFront.swf',
    headerBack: 'archives:News341HeaderBack.swf',
    askBack: 'archives:News341AskAuntArcticBack.swf',
    jokes: 'archives:News341JokesAndRiddles.swf',
    secret: 'archives:News341SecretOverlay.swf',
    featureMore: 'archives:News341FeatureMore.swf',
    navigationBack: 'archives:News341NavigationBack.swf',
    navigationFront: 'archives:News341NavigationFront.swf',
    secrets: 'archives:News341Secrets.swf',
    submit: 'archives:News341SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'MEDIEVAL METAMORPHOSIS',
    headerFront: 'archives:News342HeaderFront.swf',
    featureStory: 'archives:News342FeatureStory.swf',
    supportStory: 'archives:News342SupportStory.swf',
    upcomingEvents: 'archives:News342UpcomingEvents.swf',
    newsFlash: 'archives:News342NewsFlash.swf',
    askFront: 'archives:News342AskAuntArcticFront.swf',
    headerBack: 'archives:News342HeaderBack.swf',
    askBack: 'archives:News342AskAuntArcticBack.swf',
    jokes: 'archives:News342JokesAndRiddles.swf',
    secret: 'archives:News342SecretOverlay.swf',
    featureMore: 'archives:News342FeatureMore.swf',
    navigationBack: 'archives:News342NavigationBack.swf',
    navigationFront: 'archives:News342NavigationFront.swf',
    secrets: 'archives:News342Secrets.swf',
    submit: 'archives:News342SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'DRAGON KING CONQUERS',
    headerFront: 'archives:News343HeaderFront.swf',
    featureStory: 'archives:News343FeatureStory.swf',
    supportStory: 'archives:News343SupportStory.swf',
    upcomingEvents: 'archives:News343UpcomingEvents.swf',
    newsFlash: 'archives:News343NewsFlash.swf',
    askFront: 'archives:News343AskAuntArcticFront.swf',
    headerBack: 'archives:News343HeaderBack.swf',
    askBack: 'archives:News343AskAuntArcticBack.swf',
    jokes: 'archives:News343JokesAndRiddles.swf',
    secret: 'archives:News343SecretOverlay.swf',
    featureMore: 'archives:News343FeatureMore.swf',
    navigationBack: 'archives:News343NavigationBack.swf',
    navigationFront: 'archives:News343NavigationFront.swf',
    secrets: 'archives:News343Secrets.swf',
    submit: 'archives:News343SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
  {
    title: 'THE DRAGON KING FALLS',
    headerFront: 'archives:News344HeaderFront.swf',
    featureStory: 'archives:News344FeatureStory.swf',
    supportStory: 'archives:News344SupportStory.swf',
    upcomingEvents: 'archives:News344UpcomingEvents.swf',
    newsFlash: 'archives:News344NewsFlash.swf',
    askFront: 'archives:News344AskAuntArcticFront.swf',
    headerBack: 'archives:News344HeaderBack.swf',
    askBack: 'archives:News344AskAuntArcticBack.swf',
    jokes: 'archives:News344JokesAndRiddles.swf',
    secret: 'archives:News344SecretOverlay.swf',
    featureMore: 'archives:News344FeatureMore.swf',
    navigationBack: 'archives:News344NavigationBack.swf',
    navigationFront: 'archives:News344NavigationFront.swf',
    secrets: 'archives:News344Secrets.swf',
    submit: 'archives:News344SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
	{
		title: 'INCOMING METEOR!',
		headerFront: 'archives:News345HeaderFront.swf',
		featureStory: 'archives:News345FeatureStory.swf',
		supportStory: 'archives:News345SupportStory.swf',
		upcomingEvents: 'archives:News345UpcomingEvents.swf',
		newsFlash: 'archives:News345NewsFlash.swf',
		askFront: 'archives:News345AskAuntArcticFront.swf',
		headerBack: 'archives:News345HeaderBack.swf',
		askBack: 'archives:News345AskAuntArcticBack.swf',
		jokes: 'archives:News345JokesAndRiddles.swf',
		secret: 'archives:News345SecretOverlay.swf',
		featureMore: 'archives:News345FeatureMore.swf',
    navigationBack: 'archives:News345NavigationBack.swf',
    navigationFront: 'archives:News345NavigationFront.swf',
    secrets: 'archives:News345Secrets.swf',
    submit: 'archives:News345SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'METEOR HITS CLUB PENGUIN!',
		headerFront: 'archives:News346HeaderFront.swf',
		featureStory: 'archives:News346FeatureStory.swf',
		supportStory: 'archives:News346SupportStory.swf',
		upcomingEvents: 'archives:News346UpcomingEvents.swf',
		newsFlash: 'archives:News346NewsFlash.swf',
		askFront: 'archives:News346AskAuntArcticFront.swf',
		headerBack: 'archives:News346HeaderBack.swf',
		askBack: 'archives:News346AskAuntArcticBack.swf',
		jokes: 'archives:News346JokesAndRiddles.swf',
		secret: 'archives:News346SecretOverlay.swf',
		featureMore: 'archives:News346FeatureMore.swf',
    navigationBack: 'archives:News346NavigationBack.swf',
    navigationFront: 'archives:News346NavigationFront.swf',
    secrets: 'archives:News346Secrets.swf',
    submit: 'archives:News346SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'SUPER HEROES ASSEMBLE!',
		headerFront: 'archives:News347HeaderFront.swf',
		featureStory: 'archives:News347FeatureStory.swf',
		supportStory: 'archives:News347SupportStory.swf',
		upcomingEvents: 'archives:News347UpcomingEvents.swf',
		newsFlash: 'archives:News347NewsFlash.swf',
		askFront: 'archives:News347AskAuntArcticFront.swf',
		headerBack: 'archives:News347HeaderBack.swf',
		askBack: 'archives:News347AskAuntArcticBack.swf',
		jokes: 'archives:News347JokesAndRiddles.swf',
		secret: 'archives:News347SecretOverlay.swf',
		featureMore: 'archives:News347FeatureMore.swf',
    supportMore: 'archives:News347SupportMore.swf',
    navigationBack: 'archives:News347NavigationBack.swf',
    navigationFront: 'archives:News347NavigationFront.swf',
    secrets: 'archives:News347Secrets.swf',
    submit: 'archives:News347SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'THE SHOWDOWN CONTINUES!',
		headerFront: 'archives:News348HeaderFront.swf',
		featureStory: 'archives:News348FeatureStory.swf',
		supportStory: 'archives:News348SupportStory.swf',
		upcomingEvents: 'archives:News348UpcomingEvents.swf',
		newsFlash: 'archives:News348NewsFlash.swf',
		askFront: 'archives:News348AskAuntArcticFront.swf',
		headerBack: 'archives:News348HeaderBack.swf',
		askBack: 'archives:News348AskAuntArcticBack.swf',
		jokes: 'archives:News348JokesAndRiddles.swf',
		secret: 'archives:News348SecretOverlay.swf',
		featureMore: 'archives:News348FeatureMore.swf',
    supportMore: 'archives:News348SupportMore.swf',
    navigationBack: 'archives:News348NavigationBack.swf',
    navigationFront: 'archives:News348NavigationFront.swf',
    secrets: 'archives:News348Secrets.swf',
    submit: 'archives:News348SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
  },
	{
		title: 'FINAL SHOWDOWN!',
		headerFront: 'archives:News349HeaderFront.swf',
		featureStory: 'archives:News349FeatureStory.swf',
		supportStory: 'archives:News349SupportStory.swf',
		upcomingEvents: 'archives:News349UpcomingEvents.swf',
		newsFlash: 'archives:News349NewsFlash.swf',
		askFront: 'archives:News349AskAuntArcticFront.swf',
		headerBack: 'archives:News349HeaderBack.swf',
		askBack: 'archives:News349AskAuntArcticBack.swf',
		jokes: 'archives:News349JokesAndRiddles.swf',
		secret: 'archives:News349SecretOverlay.swf',
		featureMore: 'archives:News349FeatureMore.swf',
    supportMore: 'archives:News349SupportMore.swf',
    navigationBack: 'archives:News349NavigationBack.swf',
    navigationFront: 'archives:News349NavigationFront.swf',
    secrets: 'archives:News349Secrets.swf',
    submit: 'archives:News349SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'CLUB PENGUIN SAVED!',
		headerFront: 'archives:News350HeaderFront.swf',
		featureStory: 'archives:News350FeatureStory.swf',
		supportStory: 'archives:News350SupportStory.swf',
		upcomingEvents: 'archives:News350UpcomingEvents.swf',
		newsFlash: 'archives:News350NewsFlash.swf',
		askFront: 'archives:News350AskAuntArcticFront.swf',
		headerBack: 'archives:News350HeaderBack.swf',
		askBack: 'archives:News350AskAuntArcticBack.swf',
		jokes: 'archives:News350JokesAndRiddles.swf',
		secret: 'archives:News350SecretOverlay.swf',
		featureMore: 'archives:News350FeatureMore.swf',
    navigationBack: 'archives:News350NavigationBack.swf',
    navigationFront: 'archives:News350NavigationFront.swf',
    secrets: 'archives:News350Secrets.swf',
    submit: 'archives:News350SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'CADENCE CONCERT COMING!',
		headerFront: 'archives:News351HeaderFront.swf',
		featureStory: 'archives:News351FeatureStory.swf',
		supportStory: 'archives:News351SupportStory.swf',
		upcomingEvents: 'archives:News351UpcomingEvents.swf',
		newsFlash: 'archives:News351NewsFlash.swf',
		askFront: 'archives:News351AskAuntArcticFront.swf',
		headerBack: 'archives:News351HeaderBack.swf',
		askBack: 'archives:News351AskAuntArcticBack.swf',
		jokes: 'archives:News351JokesAndRiddles.swf',
		secret: 'archives:News351SecretOverlay.swf',
		featureMore: 'archives:News351FeatureMore.swf',
    navigationBack: 'archives:News351NavigationBack.swf',
    navigationFront: 'archives:News351NavigationFront.swf',
    secrets: 'archives:News351Secrets.swf',
    submit: 'archives:News351SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'THE PARTY STARTS NOW!',
		headerFront: 'archives:News352HeaderFront.swf',
		featureStory: 'archives:News352FeatureStory.swf',
		supportStory: 'archives:News352SupportStory.swf',
		upcomingEvents: 'archives:News352UpcomingEvents.swf',
		newsFlash: 'archives:News352NewsFlash.swf',
		askFront: 'archives:News352AskAuntArcticFront.swf',
		headerBack: 'archives:News352HeaderBack.swf',
		askBack: 'archives:News352AskAuntArcticBack.swf',
		jokes: 'archives:News352JokesAndRiddles.swf',
		secret: 'archives:News352SecretOverlay.swf',
		featureMore: 'archives:News352FeatureMore.swf',
    navigationBack: 'archives:News352NavigationBack.swf',
    navigationFront: 'archives:News352NavigationFront.swf',
    answers: 'archives:News352RiddlesAnswers.swf',
    secrets: 'archives:News352Secrets.swf',
    submit: 'archives:News352SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'THE JAM CONTINUES!',
		headerFront: 'archives:News353HeaderFront.swf',
		featureStory: 'archives:News353FeatureStory.swf',
		supportStory: 'archives:News353SupportStory.swf',
		upcomingEvents: 'archives:News353UpcomingEvents.swf',
		newsFlash: 'archives:News353NewsFlash.swf',
		askFront: 'archives:News353AskAuntArcticFront.swf',
		headerBack: 'archives:News353HeaderBack.swf',
		askBack: 'archives:News353AskAuntArcticBack.swf',
		jokes: 'archives:News353JokesAndRiddles.swf',
		secret: 'archives:News353SecretOverlay.swf',
		featureMore: 'archives:News353FeatureMore.swf',
    navigationBack: 'archives:News353NavigationBack.swf',
    navigationFront: 'archives:News353NavigationFront.swf',
    secrets: 'archives:News353Secrets.swf',
    submit: 'archives:News353SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'WARM WEATHER WELCOMED',
		headerFront: 'archives:News354HeaderFront.swf',
		featureStory: 'archives:News354FeatureStory.swf',
		supportStory: 'archives:News354SupportStory.swf',
		upcomingEvents: 'archives:News354UpcomingEvents.swf',
		newsFlash: 'archives:News354NewsFlash.swf',
		askFront: 'archives:News354AskAuntArcticFront.swf',
		headerBack: 'archives:News354HeaderBack.swf',
		askBack: 'archives:News354AskAuntArcticBack.swf',
		jokes: 'archives:News354JokesAndRiddles.swf',
		secret: 'archives:News354SecretOverlay.swf',
		featureMore: 'archives:News354FeatureMore.swf',
    navigationBack: 'archives:News354NavigationBack.swf',
    navigationFront: 'archives:News354NavigationFront.swf',
    secrets: 'archives:News354Secrets.swf',
    submit: 'archives:News354SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'ROCKHOPPER INCOMING!',
		headerFront: 'archives:News355HeaderFront.swf',
		featureStory: 'archives:News355FeatureStory.swf',
		supportStory: 'archives:News355SupportStory.swf',
		upcomingEvents: 'archives:News355UpcomingEvents.swf',
		newsFlash: 'archives:News355NewsFlash.swf',
		askFront: 'archives:News355AskAuntArcticFront.swf',
		headerBack: 'archives:News355HeaderBack.swf',
		askBack: 'archives:News355AskAuntArcticBack.swf',
		jokes: 'archives:News355JokesAndRiddles.swf',
		secret: 'archives:News355SecretOverlay.swf',
		featureMore: 'archives:News355FeatureMore.swf',
    navigationBack: 'archives:News355NavigationBack.swf',
    navigationFront: 'archives:News355NavigationFront.swf',
    secrets: 'archives:News355Secrets.swf',
    submit: 'archives:News355SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'ANCIENT TOTEM CURSE?',
		headerFront: 'archives:News356HeaderFront.swf',
		featureStory: 'archives:News356FeatureStory.swf',
		supportStory: 'archives:News356SupportStory.swf',
		upcomingEvents: 'archives:News356UpcomingEvents.swf',
		newsFlash: 'archives:News356NewsFlash.swf',
		askFront: 'archives:News356AskAuntArcticFront.swf',
		headerBack: 'archives:News356HeaderBack.swf',
		askBack: 'archives:News356AskAuntArcticBack.swf',
		jokes: 'archives:News356JokesAndRiddles.swf',
		secret: 'archives:News356SecretOverlay.swf',
		featureMore: 'archives:News356FeatureMore.swf',
    navigationBack: 'archives:News356NavigationBack.swf',
    navigationFront: 'archives:News356NavigationFront.swf',
    secrets: 'archives:News356Secrets.swf',
    submit: 'archives:News356SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'BIG BIG KAHUNA AWAKENS!',
		headerFront: 'archives:News357HeaderFront.swf',
		featureStory: 'archives:News357FeatureStory.swf',
		supportStory: 'archives:News357SupportStory.swf',
		upcomingEvents: 'archives:News357UpcomingEvents.swf',
		newsFlash: 'archives:News357NewsFlash.swf',
		askFront: 'archives:News357AskAuntArcticFront.swf',
		headerBack: 'archives:News357HeaderBack.swf',
		askBack: 'archives:News357AskAuntArcticBack.swf',
		jokes: 'archives:News357JokesAndRiddles.swf',
		secret: 'archives:News357SecretOverlay.swf',
		featureMore: 'archives:News357FeatureMore.swf',
    navigationBack: 'archives:News357NavigationBack.swf',
    navigationFront: 'archives:News357NavigationFront.swf',
    answers: 'archives:News357RiddlesAnswers.swf',
    secrets: 'archives:News357Secrets.swf',
    submit: 'archives:News357SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'SMOOTHIE SMASHING FUN!',
		headerFront: 'archives:News358HeaderFront.swf',
		featureStory: 'archives:News358FeatureStory.swf',
		supportStory: 'archives:News358SupportStory.swf',
		upcomingEvents: 'archives:News358UpcomingEvents.swf',
		newsFlash: 'archives:News358NewsFlash.swf',
		askFront: 'archives:News358AskAuntArcticFront.swf',
		headerBack: 'archives:News358HeaderBack.swf',
		askBack: 'archives:News358AskAuntArcticBack.swf',
		jokes: 'archives:News358JokesAndRiddles.swf',
		secret: 'archives:News358SecretOverlay.swf',
		featureMore: 'archives:News358FeatureMore.swf',
    secrets: 'archives:News358Secret.swf',
    navigationBack: 'archives:News358NavigationBack.swf',
    navigationFront: 'archives:News358NavigationFront.swf',
    submit: 'archives:News358SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'THE FAIR IS IN THE AIR!',
		headerFront: 'archives:News359HeaderFront.swf',
		featureStory: 'archives:News359FeatureStory.swf',
		supportStory: 'archives:News359SupportStory.swf',
		upcomingEvents: 'archives:News359UpcomingEvents.swf',
		newsFlash: 'archives:News359NewsFlash.swf',
		askFront: 'archives:News359AskAuntArcticFront.swf',
		headerBack: 'archives:News359HeaderBack.swf',
		askBack: 'archives:News359AskAuntArcticBack.swf',
		jokes: 'archives:News359JokesAndRiddles.swf',
		secret: 'archives:News359SecretOverlay.swf',
		featureMore: 'archives:News359FeatureMore.swf',
    navigationBack: 'archives:News359NavigationBack.swf',
    navigationFront: 'archives:News359NavigationFront.swf',
    secrets: 'archives:News359Secrets.swf',
    submit: 'archives:News359SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'COUNTDOWN TO THE FAIR!',
		headerFront: 'archives:News360HeaderFront.swf',
		featureStory: 'archives:News360FeatureStory.swf',
		supportStory: 'archives:News360SupportStory.swf',
		upcomingEvents: 'archives:News360UpcomingEvents.swf',
		newsFlash: 'archives:News360NewsFlash.swf',
		askFront: 'archives:News360AskAuntArcticFront.swf',
		headerBack: 'archives:News360HeaderBack.swf',
		askBack: 'archives:News360AskAuntArcticBack.swf',
		jokes: 'archives:News360JokesAndRiddles.swf',
		secret: 'archives:News360SecretOverlay.swf',
		featureMore: 'archives:News360FeatureMore.swf',
    navigationBack: 'archives:News360NavigationBack.swf',
    navigationFront: 'archives:News360NavigationFront.swf',
    secrets: 'archives:News360Secrets.swf',
    submit: 'archives:News360SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'WELCOME TO THE FAIR!',
		headerFront: 'archives:News361HeaderFront.swf',
		featureStory: 'archives:News361FeatureStory.swf',
		supportStory: 'archives:News361SupportStory.swf',
		upcomingEvents: 'archives:News361UpcomingEvents.swf',
		newsFlash: 'archives:News361NewsFlash.swf',
		askFront: 'archives:News361AskAuntArcticFront.swf',
		headerBack: 'archives:News361HeaderBack.swf',
		askBack: 'archives:News361AskAuntArcticBack.swf',
		jokes: 'archives:News361JokesAndRiddles.swf',
		secret: 'archives:News361SecretOverlay.swf',
		featureMore: 'archives:News361FeatureMore.swf',
    navigationBack: 'archives:News361NavigationBack.swf',
    navigationFront: 'archives:News361NavigationFront.swf',
    answers: 'archives:News361RiddlesAnswers.swf',
    secrets: 'archives:News361Secrets.swf',
    submit: 'archives:News361SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'MORE FAIR! MORE PRIZES!',
		headerFront: 'archives:News362HeaderFront.swf',
		featureStory: 'archives:News362FeatureStory.swf',
		supportStory: 'archives:News362SupportStory.swf',
		upcomingEvents: 'archives:News362UpcomingEvents.swf',
		newsFlash: 'archives:News362NewsFlash.swf',
		askFront: 'archives:News362AskAuntArcticFront.swf',
		headerBack: 'archives:News362HeaderBack.swf',
		askBack: 'archives:News362AskAuntArcticBack.swf',
		jokes: 'archives:News362JokesAndRiddles.swf',
		secret: 'archives:News362SecretOverlay.swf',
		featureMore: 'archives:News362FeatureMore.swf',
    navigationBack: 'archives:News362NavigationBack.swf',
    navigationFront: 'archives:News362NavigationFront.swf',
    answers: 'archives:News362RiddlesAnswers.swf',
    secrets: 'archives:News362Secrets.swf',
    submit: 'archives:News362SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'HALLOWEEN MYSTERIES!',
		headerFront: 'archives:ENNews363HeaderFront.swf',
		featureStory: 'archives:ENNews363FeatureStory.swf',
		supportStory: 'archives:ENNews363SupportStory.swf',
		upcomingEvents: 'archives:ENNews363UpcomingEvents.swf',
		newsFlash: 'archives:ENNews363NewsFlash.swf',
		askFront: 'archives:ENNews363AskAuntArctic.swf',
		headerBack: 'archives:ENNews363HeaderBack.swf',
		askBack: 'archives:ENNews363AskAuntArcticBack.swf',
		jokes: 'archives:ENNews363JokesandRiddles.swf',
		secret: 'archives:ENNews363SecretOverlay.swf',
		featureMore: 'archives:ENNews363FeatureMore.swf',
    secrets: 'archives:ENNews363Secrets.swf',
    navigationBack: 'archives:ENNews363NavigationBack.swf',
    navigationFront: 'archives:ENNews363NavigationFront.swf',
    answers: 'archives:ENNews363RiddlesAnswers.swf',
    submit: 'archives:ENNews363SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'HAVE YOU SEEN THIS INVENTOR?',
		headerFront: 'archives:News364HeaderFront.swf',
		featureStory: 'archives:News364FeatureStory.swf',
		supportStory: 'archives:News364SupportStory.swf',
		upcomingEvents: 'archives:News364UpcomingEvents.swf',
		newsFlash: 'archives:News364NewsFlash.swf',
		askFront: 'archives:News364AskAuntArcticFront.swf',
		headerBack: 'archives:News364HeaderBack.swf',
		askBack: 'archives:News364AskAuntArcticBack.swf',
		jokes: 'archives:News364JokesAndRiddles.swf',
		secret: 'archives:News364SecretOverlay.swf',
		featureMore: 'archives:News364FeatureMore.swf',
    supportMore: 'archives:News364SupportMore.swf',
    answers: 'archives:News364RiddlesAnswers.swf',
    navigationBack: 'archives:ENNews364NavigationBack.swf',
    navigationFront: 'archives:ENNews364NavigationFront.swf',
    secrets: 'archives:ENNews364Secrets.swf',
    submit: 'archives:ENNews364SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'HAUNTED MANSION APPEARS...',
		headerFront: 'archives:News365HeaderFront.swf',
		featureStory: 'archives:News365FeatureStory.swf',
		supportStory: 'archives:News365SupportStory.swf',
		upcomingEvents: 'archives:News365UpcomingEvents.swf',
		newsFlash: 'archives:News365NewsFlash.swf',
		askFront: 'archives:News365AskAuntArcticFront.swf',
		headerBack: 'archives:News365HeaderBack.swf',
		askBack: 'archives:News365AskAuntArcticBack.swf',
		jokes: 'archives:News365JokesAndRiddles.swf',
		secret: 'archives:News365SecretOverlay.swf',
		featureMore: 'archives:News365FeatureMore.swf',
    navigationBack: 'archives:ENNews365NavigationBack.swf',
    navigationFront: 'archives:ENNews365NavigationFront.swf',
    secrets: 'archives:ENNews365Secrets.swf',
    submit: 'archives:ENNews365SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'A GHOSTLY INTERVIEW...',
		headerFront: 'archives:News366HeaderFront.swf',
		featureStory: 'archives:News366FeatureStory.swf',
		supportStory: 'archives:News366SupportStory.swf',
		upcomingEvents: 'archives:News366UpcomingEvents.swf',
		newsFlash: 'archives:News366NewsFlash.swf',
		askFront: 'archives:News366AskAuntArcticFront.swf',
		headerBack: 'archives:News366HeaderBack.swf',
		askBack: 'archives:News366AskAuntArcticBack.swf',
		jokes: 'archives:News366JokesAndRiddles.swf',
		secret: 'archives:News366SecretOverlay.swf',
		featureMore: 'archives:News366FeatureMore.swf',
    navigationBack: 'archives:ENNews366NavigationBack.swf',
    navigationFront: 'archives:ENNews366NavigationFront.swf',
    secrets: 'archives:ENNews366Secrets.swf',
    submit: 'archives:ENNews366SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'GARIWALD DEPARTS',
		headerFront: 'archives:News367HeaderFront.swf',
		featureStory: 'archives:News36FeatureStory.swf',
		supportStory: 'archives:News367SupportStory.swf',
		upcomingEvents: 'archives:News367UpcomingEvents.swf',
		newsFlash: 'archives:News367NewsFlash.swf',
		askFront: 'archives:News367AskAuntArcticFront.swf',
		headerBack: 'archives:News367HeaderBack.swf',
		askBack: 'archives:News367AskAuntArcticBack.swf',
		jokes: 'archives:News367JokesAndRiddles.swf',
		secret: 'archives:News367SecretOverlay.swf',
		featureMore: 'archives:News367FeatureMore.swf',
    supportMore: 'archives:News367SupportMore.swf',
    navigationBack: 'archives:ENNews367NavigationBack.swf',
    navigationFront: 'archives:ENNews367NavigationFront.swf',
    answers: 'archives:ENNews367RiddlesAnswers.swf',
    secrets: 'archives:ENNews367Secrets.swf',
    submit: 'archives:ENNews367SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'GARY KIDNAPPED?',
		headerFront: 'archives:News368HeaderFront.swf',
		featureStory: 'archives:News368FeatureStory.swf',
		supportStory: 'archives:News368SupportStory.swf',
		upcomingEvents: 'archives:News368UpcomingEvents.swf',
		newsFlash: 'archives:News368NewsFlash.swf',
		askFront: 'archives:News368AskAuntArcticFront.swf',
		headerBack: 'archives:News368HeaderBack.swf',
		askBack: 'archives:News368AskAuntArcticBack.swf',
		jokes: 'archives:News368JokesAndRiddles.swf',
		secret: 'archives:News368SecretOverlay.swf',
		featureMore: 'archives:News368FeatureMore.swf',
    navigationBack: 'archives:ENNews368NavigationBack.swf',
    navigationFront: 'archives:ENNews368NavigationFront.swf',
    secrets: 'archives:ENNews368Secrets.swf',
    submit: 'archives:ENNews368SubmitYourContent.swf',
    supportMore: 'archives:ENNews368SupportMore.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'CLUB PENGUIN IS NO MORE',
		headerFront: 'archives:News369HeaderFront.swf',
		featureStory: 'archives:News369FeatureStory.swf',
		supportStory: 'archives:News369SupportStory.swf',
		upcomingEvents: 'archives:News369UpcomingEvents.swf',
		newsFlash: 'archives:News369NewsFlash.swf',
		askFront: 'archives:News369AskAuntArcticFront.swf',
		headerBack: 'archives:News369HeaderBack.swf',
		askBack: 'archives:News369AskAuntArcticBack.swf',
		jokes: 'archives:News369JokesAndRiddles.swf',
		secret: 'archives:News369SecretOverlay.swf',
		featureMore: 'archives:News369FeatureMore.swf',
    secrets: 'archives:News369Secrets.swf',
    navigationBack: 'archives:ENNews369NavigationBack.swf',
    navigationFront: 'archives:ENNews369NavigationFront.swf',
    answers: 'archives:ENNews369RiddlesAnswers.swf',
    submit: 'archives:ENNews369SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'BLACKOUT CONTINUES?',
		headerFront: 'archives:News370HeaderFront.swf',
		featureStory: 'archives:News370FeatureStory.swf',
		supportStory: 'archives:News370SupportStory.swf',
		upcomingEvents: 'archives:News370UpcomingEvents.swf',
		newsFlash: 'archives:News370NewsFlash.swf',
		askFront: 'archives:News370AskAuntArcticFront.swf',
		headerBack: 'archives:News370HeaderBack.swf',
		askBack: 'archives:News370AskAuntArcticBack.swf',
		jokes: 'archives:News370JokesAndRiddles.swf',
		secret: 'archives:News370SecretOverlay.swf',
		featureMore: 'archives:News370FeatureMore.swf',
    submit: 'archives:News370SubmitYourContent.swf',
    answers: 'archives:News370RiddlesAnswers.swf',
    navigationBack: 'archives:ENNews370NavigationBack.swf',
    navigationFront: 'archives:ENNews370NavigationFront.swf',
    secrets: 'archives:ENNews370Secrets.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'IS HERBERT\'S PLAIN FAILING?',
		headerFront: 'archives:News371HeaderFront.swf',
		featureStory: 'archives:News371FeatureStory.swf',
		supportStory: 'archives:News371SupportStory.swf',
		upcomingEvents: 'archives:News371UpcomingEvents.swf',
		newsFlash: 'archives:News371NewsFlash.swf',
		askFront: 'archives:News371AskAuntArcticFront.swf',
		headerBack: 'archives:News371HeaderBack.swf',
		askBack: 'archives:News371AskAuntArcticBack.swf',
		jokes: 'archives:News371JokesAndRiddles.swf',
		secret: 'archives:News371SecretOverlay.swf',
		featureMore: 'archives:News371FeatureMore.swf',
    navigationBack: 'archives:ENNews371NavigationBack.swf',
    navigationFront: 'archives:ENNews371NavigationFront.swf',
    secrets: 'archives:ENNews371Secrets.swf',
    submit: 'archives:ENNews371SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'CLUB PENGUIN IS SAVED!',
		headerFront: 'archives:ENNews372HeaderFront.swf',
		featureStory: 'archives:ENNews372FeatureStory.swf',
		supportStory: 'archives:ENNews372SupportStory.swf',
		upcomingEvents: 'archives:ENNews372UpcomingEvents.swf',
		newsFlash: 'archives:ENNews372NewsFlash.swf',
		askFront: 'archives:ENNews372AskAuntArctic.swf',
		headerBack: 'archives:ENNews372HeaderBack.swf',
		askBack: 'archives:ENNews372AskAuntArcticBack.swf',
		jokes: 'archives:ENNews372JokesandRiddles.swf',
		secret: 'archives:ENNews372SecretOverlay.swf',
		featureMore: 'archives:ENNews372FeatureMore.swf',
    navigationFront: 'archives:ENNews372NavigationFront.swf',
    dividersFront: 'archives:ENNews372Dividers.swf',
    navigationBack: 'archives:ENNews372NavigationBack.swf',
    secrets: 'archives:ENNews372Secrets.swf',
    dividersBack: 'archives:ENNews372DividersBack.swf',
    submit: 'archives:ENNews372SubmitYourContent.swf'
	},
	{
		title: 'COOKIES FOR CHANGE',
		headerFront: 'archives:News373HeaderFront.swf',
		featureStory: 'archives:News373FeatureStory.swf',
		supportStory: 'archives:News373SupportStory.swf',
		upcomingEvents: 'archives:News373UpcomingEvents.swf',
		newsFlash: 'archives:News373NewsFlash.swf',
		askFront: 'archives:News373AskAuntArcticFront.swf',
		headerBack: 'archives:News373HeaderBack.swf',
		askBack: 'archives:News373AskAuntArcticBack.swf',
		jokes: 'archives:News373JokesAndRiddles.swf',
		secret: 'archives:News373SecretOverlay.swf',
		featureMore: 'archives:News373FeatureMore.swf',
    supportMore: 'archives:News373SupportMore.swf',
    answers: 'archives:News373RiddleAnswers.swf',
    navigationBack: 'archives:ENNews373NavigationBack.swf',
    navigationFront: 'archives:ENNews373NavigationFront.swf',
    secrets: 'archives:ENNews373Secrets.swf',
    submit: 'archives:ENNews373SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'AVAST! HOLIDAY PARTY!',
		headerFront: 'archives:News374HeaderFront.swf',
		featureStory: 'archives:News374FeatureStory.swf',
		supportStory: 'archives:News374SupportStory.swf',
		upcomingEvents: 'archives:News374UpcomingEvents.swf',
		newsFlash: 'archives:News374NewsFlash.swf',
		askFront: 'archives:News374AskAuntArcticFront.swf',
		headerBack: 'archives:News374HeaderBack.swf',
		askBack: 'archives:News374AskAuntArcticBack.swf',
		jokes: 'archives:News374JokesAndRiddles.swf',
		secret: 'archives:News374SecretOverlay.swf',
		featureMore: 'archives:News374FeatureMore.swf',
    navigationBack: 'archives:ENNews374NavigationBack.swf',
    navigationFront: 'archives:ENNews374NavigationFront.swf',
    secrets: 'archives:ENNews374Secrets.swf',
    submit: 'archives:ENNews374SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	},
	{
		title: 'HAPPY HOLIDAYS EVERYONE!',
		headerFront: 'archives:News375HeaderFront.swf',
		featureStory: 'archives:News375FeatureStory.swf',
		supportStory: 'archives:News375SupportStory.swf',
		upcomingEvents: 'archives:News375UpcomingEvents.swf',
		newsFlash: 'archives:News375NewsFlash.swf',
		askFront: 'archives:News375AskAuntArcticFront.swf',
		headerBack: 'archives:News375HeaderBack.swf',
		askBack: 'archives:News375AskAuntArcticBack.swf',
		jokes: 'archives:News375JokesAndRiddles.swf',
		secret: 'archives:News375SecretOverlay.swf',
		featureMore: 'archives:News375FeatureMore.swf',
    navigationBack: 'archives:ENNews375NavigationBack.swf',
    navigationFront: 'archives:ENNews375NavigationFront.swf',
    secrets: 'archives:ENNews375Secrets.swf',
    submit: 'archives:ENNews375SubmitYourContent.swf',
    dividersBack: null,
    dividersFront: null
	}
];