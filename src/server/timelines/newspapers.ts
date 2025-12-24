import { As3Newspaper, AS3_PAPERS, BoilerRoomPaper, BOILER_ROOM_PAPERS, PreBoilerRoomPaper, PRE_BOILER_ROOM_PAPERS } from "../game-data/newspapers";
import { addDays, isLower, Version } from "../routes/versions";
import { UPDATES } from "../updates/updates";

PRE_BOILER_ROOM_PAPERS
BOILER_ROOM_PAPERS
AS3_PAPERS

const papers = [...PRE_BOILER_ROOM_PAPERS, ...BOILER_ROOM_PAPERS, ...AS3_PAPERS];

export const NEWSPAPER_TIMELINE: Array<{
  date: Version;
  info: PreBoilerRoomPaper | BoilerRoomPaper | As3Newspaper
}> = [];

let issue = 1;
let current = '';
let inPeriod = false;

function pushPaper(irregular?: Version) {
  let next = '';
  if (irregular === undefined) {
    next = addDays(current, 7);
  }
  NEWSPAPER_TIMELINE.push({
    date: irregular ?? current,
    info: papers[issue - 1]
  });
  if (irregular === undefined) {
    current = next;
  }
  issue++;
  if (issue > papers.length) {
    inPeriod = false;
  }
}

let fanDate: string = '';

UPDATES.forEach(update => {
  if (inPeriod) {
    while (isLower(current, update.date) && inPeriod) {
      pushPaper();
    }
  }
  if (update.update.newspaper !== undefined) {
    if (update.update.newspaper === 'irregular') {
      if (inPeriod) {
        throw new Error('Irregular newspaper in the middle of a period');
      }
      pushPaper(update.date);
    } else if (update.update.newspaper === 'period-start') {
      inPeriod = true;
      current = update.date;
      pushPaper();
    } else if (update.update.newspaper === 'period-end') {
      if (!inPeriod) {
        throw new Error('Period of newspaper ending without having a start');
      }
      pushPaper();
      inPeriod = false;
    } else if (update.update.newspaper === 'fan') {
      fanDate = update.date;
    }
  }
});

if (fanDate === '') {
  throw new Error('No fan issue found');
}

export const FAN_ISSUE_DATE = fanDate;