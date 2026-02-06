import { monthNames } from "@common/utils";
import { findEarliestDateHitIndex} from "../game-data";
import { NEWSPAPER_TIMELINE } from "../timelines/newspapers";
import { processVersion, Version } from "./versions";

export function getNewspapersJson(version: Version): string {
  const target = findEarliestDateHitIndex(version, NEWSPAPER_TIMELINE);
  if (target === undefined) {
    throw new Error('Could not find newspaper');
  }
  const paper = NEWSPAPER_TIMELINE[target];
  if (typeof paper.info === 'string' || 'file' in paper.info) {
    throw new Error('Non AS3 newspaper in JSON');
  }
  paper.info;

  const issueNumber = target + 1;

  const papers = NEWSPAPER_TIMELINE.slice(target - 6, target + 1).reverse();
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

    if (typeof paper.info === 'string') {
      throw new Error('Non AS3 Newspaper in JSON');
    }

    json[String(i)] = {
      title: paper.info.title,
      path: `news\/papers\/${year}${String(month).padStart(2, '0')}${padMonthDay}`,
      issue: `Issue:${issueNumber - i}`,
      date: `${monthNames[month - 1]} ${padMonthDay}, ${year}`,
      key: i === 0 ? 'current_news' : `old_news${i - 1}`
    }
  });

  return JSON.stringify(json);
}