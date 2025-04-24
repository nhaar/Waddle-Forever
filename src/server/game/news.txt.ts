import { AS2_NEWSPAPERS } from "../data/newspapers";
import { findEarliestDateHitIndex } from "../routes/client-files";
import { processVersion, Version } from "../routes/versions";

export function getNewspaperName(date: Version): string {
  const [year, month, day] = processVersion(date);

  return `${year}|${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}

/** Handles the news.txt file from the Pre-CPIP rewrite */
export function getNewsTxt(date: Version): string {
  const index = findEarliestDateHitIndex(date, AS2_NEWSPAPERS);
  const paper = AS2_NEWSPAPERS[index];

  return `
&archive=1&


&p0=${getNewspaperName(paper.date)}|82|${paper.headline}&

&a0=&
&a1=&
&a2=&
&a3=&

&e=0&`;
}