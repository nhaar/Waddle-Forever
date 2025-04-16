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
const FIRST_ISSUE_NUMBER = 221;

const newspapers: Newspaper[] = [
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
    headline: '2010-04-08'
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
    headline: 'THANKS FOR JAMMING'
  },
  {
    date: '2010-07-29',
    headline: 'CUSTOMIZE YOUR STAMP BOOK'
  },
  {
    date: '2010-08-05',
    headline: 'EXPLORATION EVENT'
  },
  {
    date: '2010-08-12',
    headline: 'ALL ABOUT IGLOOS'
  },
  {
    date: '2010-08-19',
    headline: 'ENERGETIC PHONING FACILITY'
  },
  {
    date: '2010-08-26',
    headline: 'IGLOO IMPROVEMENTS'
  },
  {
    date: '2010-09-02',
    headline: 'WHAT\'S ON AT THE FAIR?'
  },
  {
    date: '2010-09-09',
    headline: 'PILOTS SEEK ASSISTANTS'
  },
  {
    date: '2010-09-16',
    headline: 'NEW IGLOO ITEMS'
  },
  {
    date: '2010-09-23',
    headline: 'BLACK PUFFLES IN CARTS'
  },
  {
    date: '2010-09-30',
    headline: 'MYSTERIES IN OCTOBER'
  },
  {
    date: '2010-10-07',
    headline: 'ANNIVERSARY PARTY'
  },
  {
    date: '2010-10-14',
    headline: 'STORM INCOMING'
  },
  {
    date: '2010-10-21',
    headline: 'HALLOWEEN\'S ALMOST HERE'
  },
  {
    date: '2010-10-28',
    headline: 'IGLOO CONTEST WINNERS'
  },
  {
    date: '2010-11-04',
    headline: 'CLOUDY SKIES STAY'
  },
  {
    date: '2010-11-11',
    headline: 'NEW LOOK FOR NEWSPAPER'
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