import { findInVersion, VersionsTimeline } from "../data/changes";
import { AS2_NEWSPAPERS } from "../data/newspapers";
import { processVersion, Version } from "../routes/versions";

function getNewspaperTimeline() {
  const timeline = new VersionsTimeline<{ date: Version; headline: string; }>();
  AS2_NEWSPAPERS.forEach((news) => {
    timeline.add({ date: news.date, info: {
      date: news.date,
      headline: news.headline
    } });
  });

  return timeline.getVersion();
}

const newspaperTimeline = getNewspaperTimeline();

export function getNewspaperName(date: Version): string {
  const [year, month, day] = processVersion(date);

  return `${year}|${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}

/** Handles the news.txt file from the Pre-CPIP rewrite */
export function getNewsTxt(date: Version): string {
  const paper = findInVersion(date, newspaperTimeline);
  const papterString = paper === undefined ? (
    ''
  ) : (
    `&p0=${getNewspaperName(paper.date)}|82|${paper.headline}&`
  );

  return `
&archive=1&


${papterString}

&a0=&
&a1=&
&a2=&
&a3=&

&e=0&`;
}