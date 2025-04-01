import path from 'path'
import fs from 'fs'
import { replacePcode } from '../src/common/ffdec/ffdec';
import { DEFAULT_DIRECTORY } from '../src/common/utils';

type Newspaper = {
  year: number,
  month: number,
  day: number,
  headline: string
}

// issue number of the very first newspaper in the list below
const FIRST_ISSUE_NUMBER = 246;

const newspapers: Newspaper[] = [
  {
    year: 2010,
    month: 7,
    day: 1,
    headline: 'GET READY FOR MUSIC JAM 2010'
  },
  {
    year: 2010,
    month: 7,
    day: 8,
    headline: 'MUSIC JAM!'
  },
  {
    year: 2010,
    month: 7,
    day: 15,
    headline: 'KEEP JAMMIN\''
  },
  {
    year: 2010,
    month: 7,
    day: 22,
    headline: 'THANKS FOR JAMMING'
  },
  {
    year: 2010,
    month: 7,
    day: 29,
    headline: 'CUSTOMIZE YOUR STAMP BOOK'
  },
  {
    year: 2010,
    month: 8,
    day: 5,
    headline: 'EXPLORATION EVENT'
  },
  {
    year: 2010,
    month: 8,
    day: 12,
    headline: 'ALL ABOUT IGLOOS'
  },
  {
    year: 2010,
    month: 8,
    day: 19,
    headline: 'ENERGETIC PHONING FACILITY'
  },
  {
    year: 2010,
    month: 8,
    day: 26,
    headline: 'IGLOO IMPROVEMENTS'
  },
  {
    year: 2010,
    month: 9,
    day: 2,
    headline: 'WHAT\'S ON AT THE FAIR?'
  },
  {
    year: 2010,
    month: 9,
    day: 9,
    headline: 'PILOTS SEEK ASSISTANTS'
  },
  {
    year: 2010,
    month: 9,
    day: 16,
    headline: 'NEW IGLOO ITEMS'
  },
  {
    year: 2010,
    month: 9,
    day: 23,
    headline: 'BLACK PUFFLES IN CARTS'
  },
  {
    year: 2010,
    month: 9,
    day: 30,
    headline: 'MYSTERIES IN OCTOBER'
  },
  {
    year: 2010,
    month: 10,
    day: 7,
    headline: 'ANNIVERSARY PARTY'
  },
  {
    year: 2010,
    month: 10,
    day: 14,
    headline: 'STORM INCOMING'
  },
  {
    year: 2010,
    month: 10,
    day: 21,
    headline: 'HALLOWEEN\'S ALMOST HERE'
  },
  {
    year: 2010,
    month: 10,
    day: 28,
    headline: 'IGLOO CONTEST WINNERS'
  },
  {
    year: 2010,
    month: 11,
    day: 4,
    headline: 'CLOUDY SKIES STAY'
  },
  {
    year: 2010,
    month: 11,
    day: 11,
    headline: 'NEW LOOK FOR NEWSPAPER'
  }
]

// number at the end is issue of the first
// first is newest, last is oldest
type NewsSet = [Newspaper, Newspaper, Newspaper, Newspaper, Newspaper, Newspaper, Newspaper, number]

function getMinifiedDate(news: Newspaper): string {
  const month = news.month < 10 ? `0${news.month}` : String(news.month)
  const day = news.day < 10 ? `0${news.day}` : String(news.day)
  return `${news.year}${month}${day}`
}

function getFileDate(news: Newspaper): string {
  const month = news.month < 10 ? `0${news.month}` : String(news.month)
  const day = news.day < 10 ? `0${news.day}` : String(news.day)
  return `${news.year}_${month}_${day}`
}

function getFullDate(news: Newspaper): string {
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
  ][news.month - 1]

  return `${monthname} ${news.day}, ${news.year}`
}

function getDateFileName(news: Newspaper): string {
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ][news.month - 1];

  // must be 2 digits for day
  const day = news.day < 10 ? '0' + String(news.day) : news.day;

  return `${news.year}-${month}-${day}`;
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

for (const newspaper of newspapers) {
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
    replacePcode(BASE_NEWS_CRUMBS, filePath, '\\frame 1\\DoAction', filecontent);
  }
}