import { GameData } from "@server/timelines/game-data";
import { getFullDate, getNewspaperDate } from "./news_crumbs.swf";

export function getNewspapersJson(d: GameData): string {
  const papers = d.getActiveIssues();
  const json: Record<string, {
    title: string;
    path: string;
    issue: string;
    date: string;
    key: string;
  }> = {};
  papers.forEach((paper, i) => {
    const { year, month, day } = paper;

    json[String(i)] = {
      title: paper.title,
      path: `news\/papers\/${getNewspaperDate(year, month, day)}`,
      issue: `Issue:${Number(paper.edition)}`,
      date: getFullDate(year, month, day),
      key: i === 0 ? 'current_news' : `old_news${i - 1}`
    }
  });

  return JSON.stringify(json);
}