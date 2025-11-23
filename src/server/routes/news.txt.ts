import { findInVersionFull } from "../game-data";
import { NEWSPAPER_TIMELINE } from "../timelines/newspapers";
import { processVersion, Version } from "./versions";

export function getNewspaperName(date: Version): string {
  const [year, month, day] = processVersion(date);

  return `${year}|${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}

/** Handles the news.txt file from the Pre-CPIP rewrite */
export function getNewsTxt(date: Version): string {
  const paper = findInVersionFull(date, NEWSPAPER_TIMELINE);
  const papterString = (paper === undefined || !(typeof paper.info !== 'string' && 'file' in paper.info)) ? (
    ''
  ) : (
    `&p0=${getNewspaperName(paper.date)}|82|${paper.info.title}&`
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