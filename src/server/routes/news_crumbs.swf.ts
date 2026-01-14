import { emitSwf } from "../../common/flash/emitter";
import { monthNames } from "../../common/utils";
import { Action, createBytecode, PCodeRep } from "../../common/flash/avm1";
import { findEarliestDateHitIndex } from "../game-data";
import { As3Newspaper, BoilerRoomPaper, PreBoilerRoomPaper } from "../game-data/newspapers";
import { NEWSPAPER_TIMELINE } from "../timelines/newspapers";
import { getMinifiedDate } from "../timelines/route";
import { processVersion, Version } from "./versions";

function generateNewsPathAssign(n: number, date: Version, type: 'as3' | 'as2'): PCodeRep {
  let varname = ''
  if (n === -1) {
    varname = 'current_news'
  } else {
    varname = `old_news${n}`
  }

  const minifiedDate = getMinifiedDate(date);

  const newspaperPath = type === 'as3' ? (
    minifiedDate
  ) : (
    // TODO not sure why legacy media was setup like this, local_crumbs
    // from Dec 2010 show just news/date.swf
    `${minifiedDate}/${minifiedDate}.swf`
  );

  //
  return [
    [Action.Push, "news_paths"],
    Action.GetVariable,
    [Action.Push, varname, `news/${newspaperPath}`],
    Action.SetMember,
  ]
}

function getNewspaperType(newspaper: PreBoilerRoomPaper | BoilerRoomPaper | As3Newspaper): 'as2' | 'as3' {
  if (typeof newspaper === 'string') {
    throw new Error('Pre boiler room newspapers are never requested by news_crumbs')
  }
  
  return 'file' in newspaper ? 'as2' : 'as3';
}

function getFullDate(date: Version): string {
  const [year, month, day] = processVersion(date);
  let monthname = monthNames[month - 1];

  return `${monthname} ${day}, ${year}`
}

function generateNewsArrayAdd(index: number, issue: number, date: Version, title: string): PCodeRep {
  return [
    [Action.Push, "news_crumbs"],
    Action.GetVariable,
    [Action.Push, index, "key", `old_news${index}`, "issue", `Issue:${issue}`, "date", getFullDate(date), "title", title, 4],
    Action.InitObject,
    Action.SetMember
  ]
}

export function getNewsCrumbsSwf(version: Version): Buffer {
  const newspaperIndex = findEarliestDateHitIndex(version, NEWSPAPER_TIMELINE); 

  const code: PCodeRep = [
    [Action.Push, "SHELL", 0, "_global"],
    Action.GetVariable,
    [Action.Push, "getCurrentShell"],
    Action.CallMethod,
    Action.DefineLocal,
    [Action.Push, "root_path", 0, "SHELL"],
    Action.GetVariable,
    [Action.Push, "getRootPath"],
    Action.CallMethod,
    Action.DefineLocal,
    [Action.Push, "language_folder", 0, "SHELL"],
    Action.GetVariable,
    [Action.Push, "getLocalizedFolder"],
    Action.CallMethod,
    Action.DefineLocal,
    [Action.Push, "local_content", "root_path"],
    Action.GetVariable,
    [Action.Push, "content/local/"],
    Action.Add2,
    [Action.Push, "language_folder"],
    Action.GetVariable,
    Action.Add2,
    Action.DefineLocal,
    [Action.Push, "news_paths", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal
  ];

  for (let i = 0; i < 7; i++) {
    const newspaper = NEWSPAPER_TIMELINE[newspaperIndex - i];
    code.push(...generateNewsPathAssign(i - 1, newspaper.date, getNewspaperType(newspaper.info)))
  }
  code.push(
    [Action.Push, "news_crumbs", 0, "Array"],
    Action.NewObject,
    Action.DefineLocal
  );
  for (let i = 0; i < 6; i++) {
    const newspaper = NEWSPAPER_TIMELINE[newspaperIndex - i - 1];
    if (typeof newspaper.info === 'string') {
      throw new Error('Invalid newspaper without a headline');
    }
    code.push(...generateNewsArrayAdd(i, newspaperIndex - i, newspaper.date, newspaper.info.title))
  }

  return Buffer.from(emitSwf(createBytecode(code)));
}