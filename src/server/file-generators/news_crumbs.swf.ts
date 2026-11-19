import { emitCrumbSwf } from "@common/flash/emitter";
import { monthNames } from "@common/utils";
import { add2, callMethod, createBytecode, createJsonDeclaration, defineLocal, getVar, newObject, PCodeRep, setMember } from "@common/flash/avm1";
import { GameData, getNewspaperDate } from "@server/timelines/game-data";

function generateNewsPathAssign(n: number, year: number, month: number, day: number, as3: boolean, compositePaths: boolean): PCodeRep {
  const varname = n === -1 ? 'current_news' : `old_news${n}`;

  const minifiedDate = getNewspaperDate(year, month, day);

  const newspaperPath = as3 ? (
    minifiedDate
  ) : (
    // TODO not sure why legacy media was setup like this, local_crumbs
    // from Dec 2010 show just news/date.swf
    `${minifiedDate}/${minifiedDate}.swf`
  );

  if (compositePaths) {
    return setMember(getVar("news_paths"), varname, add2(
      getVar('local_content'),
      createJsonDeclaration(`/news/${newspaperPath}`)
    ))
  }

  return setMember(getVar("news_paths"), varname, createJsonDeclaration(`news/${newspaperPath}`))
}

export function getFullDate(year: number, month: number, day: number): string {
  let monthname = monthNames[month - 1];
  return `${monthname} ${day}, ${year}`
}

function generateNewsArrayAdd(index: number, issue: number, year: number, month: number, day: number, title: string): PCodeRep {
  return setMember(getVar("news_crumbs"), index, createJsonDeclaration({
    key: `old_news${index}`, 
    issue: `Issue:${issue}`,
    date: getFullDate(year, month, day),
    title
  }))
}

export function getNewsCrumbsSwf(d: GameData): Buffer {
  const issues = d.getActiveIssues();

  const useCompositePaths = d.useCompositePaths();

  const code: PCodeRep = [
    ...defineLocal("SHELL", callMethod(getVar("_global"), "getCurrentShell", false)),
    ...defineLocal("root_path", callMethod(getVar("SHELL"), "getRootPath", false)),
    ...defineLocal("language_folder", callMethod(getVar("SHELL"), "getLocalizedFolder", false))
  ];

  if (useCompositePaths) {
    code.push(
      ...defineLocal("local_content", add2(
        getVar("root_path"),
        createJsonDeclaration("content/local/"),
        getVar("language_folder"),
      ))
    )
  }

  code.push(...defineLocal("news_paths", newObject()));

  for (let i = 0; i < issues.length; i++) {
    const newspaper = issues[i];
    code.push(...generateNewsPathAssign(i - 1, newspaper.year, newspaper.month, newspaper.day, newspaper.as3, useCompositePaths))
  }
  code.push(...defineLocal("news_crumbs", newObject("Array")));
  for (let i = 1; i < issues.length; i++) {
    const newspaper = issues[i];
    code.push(...generateNewsArrayAdd(i - 1, Number(newspaper.edition), newspaper.year, newspaper.month, newspaper.day, newspaper.title));
  }

  return Buffer.from(emitCrumbSwf(createBytecode(code)));
}