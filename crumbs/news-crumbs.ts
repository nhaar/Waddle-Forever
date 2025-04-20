import path from 'path'
import fs from 'fs'
import { replacePcode } from '../src/common/ffdec/ffdec';
import { processVersion } from '../src/server/routes/versions';
import { NEWS_CRUMBS_PATH } from '../src/server/routes/client-files';
import { Newspaper, NEWSPAPERS, PRE_BOILER_ROOM_PAPERS } from '../src/server/data/newspapers';


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
// this issue number should be first issue number in a boiler room -1, 
// which matches with the length of this array
let issueNumber = PRE_BOILER_ROOM_PAPERS.length;

const BASE_NEWS_CRUMBS = path.join(__dirname, 'base_news_crumbs.swf');

console.log('Beginning exporting...');

let promises: Array<Promise<void>> = [];

const autoDir = path.join(__dirname, '..', 'media', NEWS_CRUMBS_PATH);
if (!fs.existsSync(autoDir)) {
  fs.mkdirSync(autoDir, { recursive: true });
}

const previousFiles = fs.readdirSync(autoDir);
previousFiles.forEach((file) => {
  fs.unlinkSync(path.join(autoDir, file));
});

(async () => {
  for (const newspaper of NEWSPAPERS) {
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
      const filePath = path.join(autoDir, fileName);
      console.log(`Exporting: ${fileName}`);
      
      const promise = replacePcode(BASE_NEWS_CRUMBS, filePath, '\\frame 1\\DoAction', filecontent);
      promises.push(promise);
    }
  }
})();