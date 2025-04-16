import path from 'path'
import fs from 'fs'
import { replacePcode } from '../src/common/ffdec/ffdec';
import { DEFAULT_DIRECTORY } from '../src/common/utils';
import { processVersion, Version } from '../src/server/routes/versions';

type Newspaper = {
  date: Version,
  headline: string
}

// issue number of the very first newspaper in the list below
const FIRST_ISSUE_NUMBER = 26;

const newspapers: Newspaper[] = [
  {
    date: '2006-04-13',
    headline: 'EASTER EGG HUNT!!'
  },
  {
    date: '2006-04-20',
    headline: 'GO GREEN FOR THE SPRING!'
  },
  {
    date: '2006-04-27',
    headline: 'UNDERGROUND CAVES FOUND!!'
  },
  {
    date: '2006-05-04',
    headline: 'CAVE CONSTRUCTION!!'
  },
  {
    date: '2006-05-11',
    headline: 'CAVE EXCLUSIVE'
  },
  {
    date: '2006-05-18',
    headline: 'IGLOO DECORATING SPECIAL'
  },
  {
    date: '2006-05-25',
    headline: 'MINE SHAFTS'
  },
  {
    date: '2006-06-01',
    headline: 'UNDERGROUND OPENING'
  },
  {
    date: '2006-06-08',
    headline: 'SUMMER PARTY!!'
  },
  {
    date: '2006-06-15',
    headline: 'SUMMER PARTY!!'
  },
  {
    date: '2006-06-22',
    headline: 'SUMMER PARTY CONTINUES!!'
  },
  {
    date: '2006-06-29',
    headline: 'WESTERN THEME'
  },
  {
    date: '2006-07-06',
    headline: 'WADDLE IN THE WEST'
  },
  {
    date: '2006-07-13',
    headline: 'BAND REUNION'
  },
  {
    date: '2006-07-20',
    headline: 'FIND THE MISSING INSTRUMENTS'
  },
  {
    date: '2006-07-27',
    headline: 'HISTORY OF MANCALA'
  },
  {
    date: '2006-08-03',
    headline: 'LET THE GAMES BEGIN!!'
  },
  {
    date: '2006-08-10',
    headline: 'SECRET AGENT MAKES TOWN SAFE'
  },
  {
    date: '2006-08-17',
    headline: 'NEW FITNESS EQUIPMENT'
  },
  {
    date: '2006-08-24',
    headline: 'PURPLE PUFFLES FOR ADOPTION'
  },
  {
    date: '2006-08-31',
    headline: 'LIGHTHOUSE UNDER THE SPOTLIGHT'
  },
  {
    date: '2006-09-07',
    headline: 'SAVE THE LIGHTHOUSE!!'
  },
  {
    date: '2006-09-14',
    headline: 'LIVING IN STYLE'
  },
  {
    date: '2006-09-21',
    headline: 'LIGHT UP THE HOUSE'
  },
  {
    date: '2006-09-28',
    headline: 'WALKING PUFFLES!'
  },
  {
    date: '2006-10-05',
    headline: 'HALLOWEEN HULLABALOO'
  },
  {
    date: '2006-10-12',
    headline: 'SHIP ASHORE'
  },
  {
    date: '2006-10-19',
    headline: 'HAUNTED IGLOO DECOR'
  },
  {
    date: '2006-10-26',
    headline: 'CRASH LANDING'
  },
  {
    date: '2006-11-02',
    headline: 'PENGUINS TAKE FLIGHT'
  },
  {
    date: '2006-11-09',
    headline: 'A COLORFUL MISTAKE'
  },
  {
    date: '2006-11-16',
    headline: 'MAKING WAVES'
  },
  {
    date: '2006-11-23',
    headline: 'GRIN FOR GREEN'
  },
  {
    date: '2006-11-30',
    headline: 'ROCKHOPPER\'S SHIP SPOTTED'
  },
  {
    date: '2006-12-07',
    headline: 'ROCKHOPPER LANDS TOMORROW'
  },
  {
    date: '2006-12-14',
    headline: 'IGLOO DECORATING CONTEST'
  },
  {
    date: '2006-12-21',
    headline: 'A VERY WHITE CHRISTMAS'
  },
  {
    date: '2006-12-28',
    headline: 'HAPPY NEW YEAR!'
  },
  {
    date: '2007-01-04',
    headline: 'WINTER FIESTA!'
  },
  {
    date: '2007-01-11',
    headline: 'TOUR GUIDES TO ARRIVE'
  },
  {
    date: '2007-01-18',
    headline: 'GET FLOORED!'
  },
  {
    date: '2007-01-25',
    headline: 'TOUR GUIDES NEEDED'
  },
  {
    date: '2007-02-01',
    headline: 'FESTIVAL OF SNOW'
  },
  {
    date: '2007-02-08',
    headline: 'WINNERS ANNOUNCED'
  },
  {
    date: '2007-02-15',
    headline: 'GARY THE GADGET GUY'
  },
  {
    date: '2007-02-22',
    headline: 'PIZZATRON 3000'
  },
  {
    date: '2007-03-01',
    headline: 'MESSAGE IN A BOTTLE'
  },
  {
    date: '2007-03-08',
    headline: 'ST. PATRICK\'S DAY 07'
  },
  {
    date: '2007-03-15',
    headline: 'CHARMED CELEBRATIONS'
  },
  {
    date: '2007-03-22',
    headline: 'PUMPED UP PUFFLE PLAY'
  },
  {
    date: '2007-03-29',
    headline: 'APRIL FOOL\'S DAY'
  },
  {
    date: '2007-04-05',
    headline: 'EASTER EGG HUNT'
  },
  {
    date: '2007-04-12',
    headline: 'STAGED FUN'
  },
  {
    date: '2007-04-19',
    headline: 'PIRATE PARTY PARADISE'
  },
  {
    date: '2007-04-26',
    headline: 'PARTY ON (DECK)!'
  },
  {
    date: '2007-05-03',
    headline: 'SHIPSHAPE SURPRISE'
  },
  {
    date: '2007-05-10',
    headline: 'LOCATION LOST'
  },
  {
    date: '2007-05-17',
    headline: 'THE MAP QUEST'
  },
  {
    date: '2007-05-24',
    headline: 'PATH TO THE COVE'
  },
  {
    date: '2007-05-31',
    headline: 'CURIOUS CONSTRUCTION EXPLAINED'
  },
  {
    date: '2007-06-07',
    headline: 'BIG SUMMER BASH'
  },
  {
    date: '2007-06-14',
    headline: 'SUMMER PARTY CONTINUES'
  },
  {
    date: '2007-06-21',
    headline: 'PIRATE PUFFLE ON BOARD'
  },
  {
    date: '2007-06-28',
    headline: 'FAR OUT SURFING'
  },
  {
    date: '2007-07-05',
    headline: 'WATER PARTY'
  },
  {
    date: '2007-07-12',
    headline: 'UNDERGROUND CLOSED'
  },
  {
    date: '2007-07-19',
    headline: 'WATER PARTY EXTENDED'
  },
  {
    date: '2007-07-26',
    headline: 'WATER PARTY A BIG SPLASH'
  },
  {
    date: '2007-08-02',
    headline: 'WINNERS ANNOUNCED'
  },
  {
    date: '2007-08-09',
    headline: 'OUTFIT CONTEST WINNERS ANNOUNCED'
  },
  {
    date: '2007-08-16',
    headline: 'CAMP PENGUIN'
  },
  {
    date: '2007-08-23',
    headline: 'CAMP PENGUIN!'
  },
  {
    date: '2007-08-30',
    headline: 'SPORT SHOP UPDATE'
  },
  {
    date: '2007-09-06',
    headline: 'CARGO CONTENTS DISCOVERED!'
  },
  {
    date: '2007-09-13',
    headline: 'FALL FAIR APPROACHING'
  },
  {
    date: '2007-09-20',
    headline: 'FALL FAIR STARTS FRIDAY!'
  },
  {
    date: '2007-09-27',
    headline: 'FALL FAIR FUN!'
  },
  {
    date: '2007-10-04',
    headline: 'COSTUME CONTEST!!!'
  },
  {
    date: '2007-10-11',
    headline: 'HEADS UP!'
  },
  {
    date: '2007-10-18',
    headline: 'STARLIGHT? DARKNIGHT?'
  },
  {
    date: '2007-10-25',
    headline: 'HALLOWEEN PARTY'
  },
  {
    date: '2007-11-01',
    headline: 'WIGGIN\' OUT!'
  },
  {
    date: '2007-11-08',
    headline: 'SURPRISE PARTY!'
  },
  {
    date: '2007-11-15',
    headline: 'GRAND OPENING'
  },
  {
    date: '2007-11-22',
    headline: 'YELLOW PUFFLES DISCOVERED!'
  },
  {
    date: '2007-11-29',
    headline: 'GOOD HOMES FOR YELLOW PUFFLES'
  },
  {
    date: '2007-12-06',
    headline: 'COINS FOR CHANGE'
  },
  {
    date: '2007-12-13',
    headline: 'COINS FOR CHANGE'
  },
  {
    date: '2007-12-20',
    headline: 'CONTEST WINNERS ANNOUNCED'
  },
  {
    date: '2007-12-25',
    headline: 'DONATION ANNOUNCEMENT'
  },
  {
    date: '2008-01-03',
    headline: 'HAPPY NEW YEAR!'
  },
  {
    date: '2008-01-10',
    headline: 'NEW PLAY AT THE STAGE'
  },
  {
    date: '2008-01-17',
    headline: 'MIGRATOR CRASHES!'
  },
  {
    date: '2008-01-24',
    headline: 'ROCKHOPPER IS OKAY'
  },
  {
    date: '2008-01-31',
    headline: 'RALLY FOR ROCKHOPPER'
  },
  {
    date: '2008-02-07',
    headline: 'SAVE THE MIGRATOR'
  },
  {
    date: '2008-02-14',
    headline: 'SEA SALVAGING SUB TO SAVE SHIP'
  },
  {
    date: '2008-02-21',
    headline: 'SAVE THE MIGRATOR'
  },
  {
    date: '2008-02-28',
    headline: 'RECONSTRUCTION TO BEGIN SOON'
  },
  {
    date: '2008-03-06',
    headline: 'ST. PATRICK\'S DAY PARTY!'
  },
  {
    date: '2008-03-13',
    headline: 'SALVAGED SHIP SLOWLY SURFACING'
  },
  {
    date: '2008-03-20',
    headline: 'FRONT-END FINALLY FISHED'
  },
  {
    date: '2008-03-27',
    headline: 'APRIL FOOLS!!!'
  },
  {
    date: '2008-04-03',
    headline: 'AUNT ARCTIC ASKED TO BE EDITOR'
  },
  {
    date: '2008-04-10',
    headline: 'READY REPORTERS READILY REQUESTED'
  },
  {
    date: '2008-04-17',
    headline: 'MIGRATOR MENDED - A PROJECT REVIEW'
  },
  {
    date: '2008-04-24',
    headline: 'ROCKHOPPER\'S GRAND RETURN'
  },
  {
    date: '2008-05-01',
    headline: 'BOAT SWEET BOAT'
  },
  {
    date: '2008-05-08',
    headline: 'PARTY PLANNERS PLAN SHINDIG!'
  },
  {
    date: '2008-05-15',
    headline: 'THE ADVENTURE BEGINS'
  },
  {
    date: '2008-05-22',
    headline: 'YE OLDE IGLOO CONTEST'
  },
  {
    date: '2008-05-29',
    headline: 'A NOVEL IDEA'
  },
  {
    date: '2008-06-05',
    headline: 'SUMMER KICK OFF PARTY'
  },
  {
    date: '2008-06-12',
    headline: 'WATER PARTY STARTS JUNE 13'
  },
  {
    date: '2008-06-19',
    headline: 'WATER PARTY! REVIEW'
  },
  {
    date: '2008-06-26',
    headline: 'TREMORS SHAKE UP THE TOWN CENTER'
  },
  {
    date: '2008-07-03',
    headline: 'CAPTAIN COMES BACK!'
  },
  {
    date: '2008-07-10',
    headline: 'SEE THE PENGUIN BAND JULY 25'
  },
  {
    date: '2008-07-17',
    headline: 'SUPERHEROES RETURN!'
  },
  {
    date: '2008-07-24',
    headline: 'IT\'S TIME TO ROCK!'
  },
  {
    date: '2008-07-31',
    headline: 'HARD-CORE ENCORE!'
  },
  {
    date: '2008-08-07',
    headline: 'MUSIC JAM REVIEW'
  },
  {
    date: '2008-08-14',
    headline: 'PREPARING FOR THE PENGUIN GAMES'
  },
  {
    date: '2008-08-21',
    headline: 'WELCOME TO THE PENGUIN GAMES'
  },
  {
    date: '2008-08-28',
    headline: 'PENGUIN GAMES CLOSING CEREMONIES'
  },
  {
    date: '2008-09-04',
    headline: 'CONSTRUCTION AT THE STAGE'
  },
  {
    date: '2008-09-11',
    headline: 'NEW PLAY IS A MYSTERY'
  },
  {
    date: '2008-09-18',
    headline: 'FALL FAIR PARTY!'
  },
  {
    date: '2008-09-25',
    headline: 'FALL FAIR FESTIVITIES!'
  },
  {
    date: '2008-10-02',
    headline: 'FALL FAIR FINISHING WITH FLAIR'
  },
  {
    date: '2008-10-09',
    headline: 'HALLOWEEN PARTY'
  },
  {
    date: '2008-10-16',
    headline: '3 YEAR ANNIVERSARY APPROACHES'
  },
  {
    date: '2008-10-23',
    headline: 'ROCKHOPPER\'S READY FOR THE PARTY'
  },
  {
    date: '2008-10-30',
    headline: 'HALLOWEEN IS HERE'
  },
  {
    date: '2008-11-06',
    headline: 'A SHOCKING SURPRISE'
  },
  {
    date: '2008-11-13',
    headline: 'DOJO GRAND RE-OPENING'
  },
  {
    date: '2008-11-20',
    headline: 'NINJA TRAINING AT THE DOJO'
  },
  {
    date: '2008-11-27',
    headline: 'THE SENSEI SPEAKS'
  },
  {
    date: '2008-12-04',
    headline: 'THE CAPTAIN & COINS FOR CHANGE'
  },
  {
    date: '2008-12-11',
    headline: 'CHRISTMAS WITH THE CAPTAIN'
  },
  {
    date: '2008-12-18',
    headline: 'CHRISTMAS PARTY'
  },
  {
    date: '2008-12-25',
    headline: 'MERRY CHRISTMAS CLUB PENGUIN!'
  },
  {
    date: '2009-01-01',
    headline: 'DANCE FASHIONS AT THE GIFT SHOP!'
  },
  {
    date: '2009-01-08',
    headline: 'DANCE-A-THON - A MEMBER EVENT'
  },
  {
    date: '2009-01-15',
    headline: 'DANCE-A-THON FOR MEMBERS'
  },
  {
    date: '2009-01-22',
    headline: 'FIESTA! PARTY'
  },
  {
    date: '2009-01-29',
    headline: 'MUST-PLAY MULTIPLAYER GAMES'
  },
  {
    date: '2009-02-05',
    headline: 'PUFFLES PLAY WITH THEIR FURNITURE'
  },
  {
    date: '2009-02-12',
    headline: 'PUFFLE PARTY!'
  },
  {
    date: '2009-02-19',
    headline: 'PUFFLE PARTY'
  },
  {
    date: '2009-02-26',
    headline: 'ROCKHOPPER RETURNS ON FEBRUARY 27!'
  },
  {
    date: '2009-03-05',
    headline: 'PRESENTING THE PENGUIN PLAY AWARDS'
  },
  {
    date: '2009-03-12',
    headline: 'ST. PATRICK\'S PARTY 09'
  },
  {
    date: '2009-03-19',
    headline: 'PENGUIN PLAY AWARDS'
  },
  {
    date: '2009-03-26',
    headline: 'PENGUIN PLAY AWARDS CONTINUE!'
  },
  {
    date: '2009-04-02',
    headline: 'APRIL FOOLS PARTY'
  },
  {
    date: '2009-04-09',
    headline: 'PRESENTING THE TOP PLAYS!'
  },
  {
    date: '2009-04-16',
    headline: 'SLEDDING NEWS!'
  },
  {
    date: '2009-04-23',
    headline: 'A MEDIEVAL STORY...'
  },
  {
    date: '2009-04-30',
    headline: 'A MEDIEVAL STORY PART 2...'
  },
  {
    date: '2009-05-07',
    headline: 'MEDIEVAL PARTY'
  },
  {
    date: '2009-05-14',
    headline: 'MEDIEVAL PARTY CONTINUES'
  },
  {
    date: '2009-05-21',
    headline: 'ROCKHOPPER ARRIVES MAY 22'
  },
  {
    date: '2009-05-28',
    headline: 'ROCKHOPPER\'S HERE!'
  },
  {
    date: '2009-06-04',
    headline: 'FORECAST CALLS FOR...PARTY!'
  },
  {
    date: '2009-06-11',
    headline: 'DISCOVER THE ADVENTURE PARTY'
  },
  {
    date: '2009-06-18',
    headline: '101 DAYS OF FUN'
  },
  {
    date: '2009-06-25',
    headline: 'NEW MUSIC FOR DJ3K'
  },
  {
    date: '2009-07-02',
    headline: 'MUSIC JAM 09 IS AMPING UP'
  },
  {
    date: '2009-07-09',
    headline: 'GETTING READY TO ROCK'
  },
  {
    date: '2009-07-16',
    headline: 'MUSIC JAM 09 BEGINS JULY 17'
  },
  {
    date: '2009-07-23',
    headline: 'MUSIC JAM 09 ENDS JULY 26!'
  },
  {
    date: '2009-07-30',
    headline: 'LAST CHANCE FOR PENGUIN TALES'
  },
  {
    date: '2009-08-06',
    headline: 'NEW COLOR IS IN!'
  },
  {
    date: '2009-08-13',
    headline: 'FESTIVAL OF FLIGHT'
  },
  {
    date: '2009-08-20',
    headline: 'FESTIVAL OF FLIGHT FINISHED!'
  },
  {
    date: '2009-08-27',
    headline: 'FUN AT THE FAIR!'
  },
  {
    date: '2009-09-03',
    headline: 'THE FAIR - JOIN IN THE FUN'
  },
  {
    date: '2009-09-10',
    headline: 'PENGUINS THAT TIME FORGOT'
  },
  {
    date: '2009-09-17',
    headline: 'SENSEI STARTS SCAVENGER HUNT'
  },
  {
    date: '2009-09-24',
    headline: 'NINJAS AWAKEN VOLCANO'
  },
  {
    date: '2009-10-01',
    headline: 'HALLOWEEN COSTUMES! OCTOBER 2'
  },
  {
    date: '2009-10-08',
    headline: 'HALLOWEEN IGLOO CONTEST OCTOBER 16'
  },
  {
    date: '2009-10-15',
    headline: 'HALLOWEEN IGLOO CONTEST'
  },
  {
    date: '2009-10-22',
    headline: 'HAPPY 4TH ANNIVERSARY! OCTOBER 24'
  },
  {
    date: '2009-10-29',
    headline: 'HALLOWEEN PARTY'
  },
  {
    date: '2009-11-05',
    headline: 'VOLCANO TAMED - NINJAS NEEDED'
  },
  {
    date: '2009-11-12',
    headline: 'VOLCANO CONSTRUCTION ANNOUNCED'
  },
  {
    date: '2009-11-19',
    headline: 'CARD-JITSU FIRE'
  },
  {
    date: '2009-11-26',
    headline: 'CARD-JITSU FIRE REVEALED'
  },
  {
    date: '2009-12-03',
    headline: 'COINS FOR CHANGE'
  },
  {
    date: '2009-12-10',
    headline: 'MAKE A DIFFERENCE!'
  },
  {
    date: '2009-12-17',
    headline: 'HOLIDAY PARTY'
  },
  {
    date: '2009-12-24',
    headline: 'HAPPY HOLIDAYS CLUB PENGUIN!'
  },
  {
    date: '2009-12-31',
    headline: 'HAPPY NEW YEAR CLUB PENGUIN!'
  },
  {
    date: '2010-01-07',
    headline: 'CREATE YOUR OWN T-SHIRT'
  },
  {
    date: '2010-01-14',
    headline: 'ROCKSLIDE AT THE MINE!'
  },
  {
    date: '2010-01-21',
    headline: 'SECRET CAVE DISCOVERED!'
  },
  {
    date: '2010-01-28',
    headline: 'CAVES CLOSING UNTIL FURTHER NOTICE'
  },
  {
    date: '2010-02-04',
    headline: 'PUFFLE PARTY'
  },
  {
    date: '2010-02-11',
    headline: 'SECRETS OF THE BAMBOO FOREST'
  },
  {
    date: '2010-02-18',
    headline: 'PUFFLE PARTY'
  },
  {
    date: '2010-02-25',
    headline: 'ORANGE PUFFLES READY TO ADOPT!'
  },
  {
    date: '2010-03-04',
    headline: 'WHERE\'S YARR?'
  },
  {
    date: '2010-03-11',
    headline: 'PUFFLES TRAPPED UNDERGROUND!'
  },
  {
    date: '2010-03-18',
    headline: 'PUFFLE RESCUE'
  },
  {
    date: '2010-03-25',
    headline: 'PENGUIN PLAY AWARDS'
  },
  {
    date: '2010-04-01',
    headline: 'HAPPY APRIL FOOLS!'
  },
  {
    date: '2010-04-08',
    headline: 'EARTH DAY IS COMING!'
  },
  {
    date: '2010-04-15',
    headline: 'CELEBRATE EARTH DAY!'
  },
  {
    date: '2010-04-22',
    headline: 'EARTH DAY CELEBRATIONS BEGIN!'
  },
  {
    date: '2010-04-29',
    headline: 'YE PENGUIN STYLE'
  },
  {
    date: '2010-05-06',
    headline: 'MEDIEVAL PARTY'
  },
  {
    date: '2010-05-13',
    headline: 'YOUR IGLOO-MEDIEVAL STYLE'
  },
  {
    date: '2010-05-20',
    headline: 'POPCORN EVERYWHERE AT SPORT SHOP'
  },
  {
    date: '2010-05-27',
    headline: 'SKI VILLAGE UNDER CONSTRUCTION'
  },
  {
    date: '2010-06-03',
    headline: 'PENGUINS SEEKING ADVENTURE'
  },
  {
    date: '2010-06-10',
    headline: 'ISLAND ADVENTURE PLANS REVEALED'
  },
  {
    date: '2010-06-17',
    headline: 'THE ADVENTURE BEGINS!'
  },
  {
    date: '2010-06-24',
    headline: 'CONTINUE YOUR ADVENTURE!'
  },
  {
    date: '2010-07-01',
    headline: 'GET READY FOR MUSIC JAM 2010'
  },
  {
    date: '2010-07-08',
    headline: 'MUSIC JAM!'
  },
  {
    date: '2010-07-15',
    headline: 'KEEP JAMMIN\''
  },
  {
    date: '2010-07-22',
    headline: 'STAMPS ARRIVE JULY 27'
  },
  {
    date: '2010-07-29',
    headline: 'STAMPS - CAN YOU EARN THEM ALL?'
  },
  {
    date: '2010-08-05',
    headline: 'STAMP BOOK STYLE'
  },
  {
    date: '2010-08-12',
    headline: 'MOUNTAIN EXPEDITION BEGINS'
  },
  {
    date: '2010-08-19',
    headline: 'DESIGN YOUR OWN FURNITURE'
  },
  {
    date: '2010-08-26',
    headline: 'PREPARE FOR THE FAIR'
  },
  {
    date: '2010-09-02',
    headline: 'THE FAIR - BE THERE'
  },
  {
    date: '2010-09-09',
    headline: 'NEW ITEMS AT PRIZE BOOTH'
  },
  {
    date: '2010-09-16',
    headline: 'SHOWDOWN AT THE STADIUM'
  },
  {
    date: '2010-09-23',
    headline: 'GAME ON AT THE STADIUM'
  },
  {
    date: '2010-09-30',
    headline: 'NEW SPOOKY COSTUMES COMING!'
  },
  {
    date: '2010-10-07',
    headline: 'HALLOWEEN IGLOO CONTEST'
  },
  {
    date: '2010-10-14',
    headline: 'HALLOWEEN IGLOO CONTEST'
  },
  {
    date: '2010-10-21',
    headline: 'ANNIVERSARY PARTY OCTOBER 24'
  },
  {
    date: '2010-10-28',
    headline: 'THE HALLOWEEN PARTY IS HERE'
  },
  {
    date: '2010-11-04',
    headline: 'NEW OUTDOOR OUTFITS'
  },
  {
    date: '2010-11-11',
    headline: 'FIRST RAINSTORM ON RECORD'
  }
]

// number at the end is issue of the first
// first is newest, last is oldest
type NewsSet = [Newspaper, Newspaper, Newspaper, Newspaper, Newspaper, Newspaper, Newspaper, number]

function getMinifiedDate(news: Newspaper): string {
  // same format but without dahses in-between
  return news.date.replaceAll('-', '');
}

function getFileDate(news: Newspaper): string {
  // same format but with _ separator
  return news.date.replaceAll('-', '_');
}

function getFullDate(news: Newspaper): string {
  const [year, month, day] = processVersion(news.date);
  let monthname = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ][month - 1];

  return `${monthname} ${day}, ${year}`
}

function getDateFileName(news: Newspaper): string {
  return news.date;
}

function generateNewsPathAssign(n: number, newspaper: Newspaper): string {
  let varname = ''
  if (n === -1) {
    varname = 'current_news'
  } else {
    varname = `old_news${n}`
  }

  const date = getMinifiedDate(newspaper)
  return `Push "news_paths"
GetVariable
Push "${varname}", "news/${date}/${date}.swf"
SetMember
Push "news_paths"
`
}

function generateNewsArrayAdd(main: number, index: number, newspaper: Newspaper): string {
  
  return `Push "news_crumbs"
GetVariable
Push ${index}, "key", "old_news${index}", "issue", "Issue:${main - 1 - index}", "date", "${getFullDate(newspaper)}", "title", "${newspaper.headline}", 4
InitObject
SetMember
`
}

function generateNewsCrumbs(set: NewsSet) {
  let bytecode = `ConstantPool "SHELL", "_global", "getCurrentShell", "root_path", "getRootPath", "language_folder", "getLocalizedFolder", "local_content", "content/local/", "news_paths", "Object", "current_news", "news/20051121/20051121.swf", "old_news0", "news/20051116/20051116.swf", "old_news1", "news/20051111/20051111.swf", "old_news2", "news/20051108/20051108.swf", "old_news3", "news/20051103/20051103.swf", "old_news4", "news/20051028/20051028.swf", "old_news5", "news/20051024/20051024.swf", "news_crumbs", "Array", "key", "issue", "Issue:5", "date", "November 16, 2005", "title", "COINS INCREASED", "Issue:4", "November 11, 2005", "NEW GIFT SHOP OPENS", "Issue:3", "November 8, 2005", "Issue:2", "November 3, 2005", "HALLOWEEN PARTY", "Fan edition", "October 28, 2005", "SENT TO US BY YOU", "Issue:1", "October 24, 2005", "CLUB PENGUIN OPENS"
Push "SHELL", 0, "_global"
GetVariable
Push "getCurrentShell"
CallMethod
DefineLocal
Push "root_path", 0, "SHELL"
GetVariable
Push "getRootPath"
CallMethod
DefineLocal
Push "language_folder", 0, "SHELL"
GetVariable
Push "getLocalizedFolder"
CallMethod
DefineLocal
Push "local_content", "root_path"
GetVariable
Push "content/local/"
Add2
Push "language_folder"
GetVariable
Add2
DefineLocal
Push "news_paths", 0, "Object"
NewObject
DefineLocal
`

  bytecode += generateNewsPathAssign(-1, set[0])
  for (let i = 1; i < 7; i++) {
    bytecode += generateNewsPathAssign(i - 1, set[i] as Newspaper)
  }

  bytecode += `Push "news_crumbs", 0, "Array"
NewObject
DefineLocal
`

  for (let i = 1; i < 7; i++) {
    bytecode += generateNewsArrayAdd(set[7], i - 1, set[i] as Newspaper)
  }

  return bytecode
}

const currentThings: Newspaper[] = [];
// subtract 1 since it will be incremented each time
let issueNumber = FIRST_ISSUE_NUMBER - 1;

const outDir = path.join(__dirname, 'news')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

const BASE_NEWS_CRUMBS = path.join(__dirname, 'base_news_crumbs.swf');

console.log('Beginning exporting...');

let promises: Array<Promise<void>> = [];

(async () => {
  for (const newspaper of newspapers) {
    // doing it 10 at a time otherwise FFDEC will not withstand it
    if (promises.length >= 10) {
      await Promise.all(promises);
      promises = [];
    }
    currentThings.push(newspaper)
    issueNumber++;
  
    if (currentThings.length > 7) {
      currentThings.shift()
    }
    if (currentThings.length === 7) {
      const filecontent = generateNewsCrumbs([currentThings[6], currentThings[5], currentThings[4], currentThings[3], currentThings[2], currentThings[1], currentThings[0], issueNumber])
      
      const recent = currentThings[6]
      const fileName = getDateFileName(recent) + '.swf';
      const filePath = path.join(DEFAULT_DIRECTORY, 'seasonal/play/v2/content/local/en/news/news_crumbs.swf/', fileName);
      console.log(`Exporting: ${fileName}`);
      
      const promise = replacePcode(BASE_NEWS_CRUMBS, filePath, '\\frame 1\\DoAction', filecontent);
      promises.push(promise);
    }
  }
})();