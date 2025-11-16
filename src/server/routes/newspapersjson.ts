import { monthNames } from "../../common/utils";
import { AS2_NEWSPAPERS, AS3_NEWSPAPERS, PRE_BOILER_ROOM_PAPERS } from "../game-data/newspapers";
import { isGreater, processVersion, Version } from "./versions";

export function getNewspapersJson(version: Version): string {
  let target: number | undefined;
  for (let i = 0; i < AS3_NEWSPAPERS.length; i++) {
    if (isGreater(AS3_NEWSPAPERS[i].date, version)) {
      target = i - 1;
      break;
    }
  }
  if (target === undefined) {
    target = AS3_NEWSPAPERS.length - 1;
  }

  const issueNumber = PRE_BOILER_ROOM_PAPERS.length + AS2_NEWSPAPERS.length + target + 1;

  const papers = AS3_NEWSPAPERS.slice(target - 6, target + 1).reverse();
  const json: Record<string, {
    title: string;
    path: string;
    issue: string;
    date: string;
    key: string;
  }> = {};
  papers.forEach((paper, i) => {
    const [year, month, monthDay] = processVersion(paper.date);
    const padMonthDay = String(monthDay).padStart(2, '0');


    json[String(i)] = {
      title: paper.headline,
      path: `news\/papers\/${year}${String(month).padStart(2, '0')}${padMonthDay}`,
      issue: `Issue:${issueNumber - i}`,
      date: `${monthNames[month - 1]} ${padMonthDay}, ${year}`,
      key: i === 0 ? 'current_news' : `old_news${i - 1}`
    }
  });

  return JSON.stringify(json);
}