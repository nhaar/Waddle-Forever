import { emitCrumbSwf } from "@common/flash/emitter";
import { monthNames } from "@common/utils";
import { Action, createBytecode, PCodeRep } from "@common/flash/avm1";
import { GameData } from "@server/timelines/game-data";

function getMinifiedDate(year: number, month: number, day: number) {
  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}

function generateNewsPathAssign(n: number, year: number, month: number, day: number, as3: boolean, compositePaths: boolean): PCodeRep {
  let varname = ''
  if (n === -1) {
    varname = 'current_news'
  } else {
    varname = `old_news${n}`
  }

  const minifiedDate = getMinifiedDate(year, month, day);

  const newspaperPath = as3 ? (
    minifiedDate
  ) : (
    // TODO not sure why legacy media was setup like this, local_crumbs
    // from Dec 2010 show just news/date.swf
    `${minifiedDate}/${minifiedDate}.swf`
  );

  if (compositePaths) {
    return [
      [Action.Push, "news_paths"],
      Action.GetVariable,
      [Action.Push, varname, 'local_content'],
      Action.GetVariable,
      [Action.Push, `/news/${newspaperPath}`],
      Action.Add2,
      Action.SetMember
    ]
  }
  return [
    [Action.Push, "news_paths"],
    Action.GetVariable,
    [Action.Push, varname, `news/${newspaperPath}`],
    Action.SetMember,
  ]
}

function getFullDate(year: number, month: number, day: number): string {
  let monthname = monthNames[month - 1];
  return `${monthname} ${day}, ${year}`
}

function generateNewsArrayAdd(index: number, issue: number, year: number, month: number, day: number, title: string): PCodeRep {
  return [
    [Action.Push, "news_crumbs"],
    Action.GetVariable,
    [Action.Push, index, "key", `old_news${index}`, "issue", `Issue:${issue}`, "date", getFullDate(year, month, day), "title", title, 4],
    Action.InitObject,
    Action.SetMember
  ]
}

export function getNewsCrumbsSwf(d: GameData): Buffer {
  const issues = d.getActiveIssues();

  const useCompositePaths = d.useCompositePaths();

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
    Action.DefineLocal
  ];

  if (useCompositePaths) {
    code.push(
      [Action.Push, "local_content", "root_path"],
      Action.GetVariable,
      [Action.Push, "content/local/"],
      Action.Add2,
      [Action.Push, "language_folder"],
      Action.GetVariable,
      Action.Add2,
      Action.DefineLocal
    );
  }

  code.push(
    [Action.Push, "news_paths", 0, "Object"],
    Action.NewObject,
    Action.DefineLocal
  );

  for (let i = 0; i < issues.length; i++) {
    const newspaper = issues[i];
    code.push(...generateNewsPathAssign(i - 1, newspaper.year, newspaper.month, newspaper.day, newspaper.as3, useCompositePaths))
  }
  code.push(
    [Action.Push, "news_crumbs", 0, "Array"],
    Action.NewObject,
    Action.DefineLocal
  );
  for (let i = 1; i < issues.length; i++) {
    const newspaper = issues[i];
    code.push(...generateNewsArrayAdd(i - 1, Number(newspaper.edition), newspaper.year, newspaper.month, newspaper.day, newspaper.title));
  }

  return Buffer.from(emitCrumbSwf(createBytecode(code)));
}