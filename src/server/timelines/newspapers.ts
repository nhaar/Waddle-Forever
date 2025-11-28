import { As3Newspaper, AS3_PAPERS, BoilerRoomPaper, BOILER_ROOM_PAPERS, PreBoilerRoomPaper, PRE_BOILER_ROOM_PAPERS } from "../game-data/newspapers";
import { addDays, isLowerOrEqual, Version } from "../routes/versions";
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
let periodStart: string | undefined = undefined;

function pushPaper(date: Version) {
    NEWSPAPER_TIMELINE.push({
    date,
    info: papers[issue - 1]
  });
  issue++;
}

let fanDate: string = '';

UPDATES.forEach(update => {
  if (update.update.newspaper !== undefined) {
    if (update.update.newspaper === 'irregular') {
      if (periodStart !== undefined) {
        throw new Error('Irregular newspaper in the middle of a period');
      }
      pushPaper(update.date);
    } else if (update.update.newspaper === 'period-start') {
      periodStart = update.date;
    } else if (update.update.newspaper === 'period-end') {
      if (periodStart === undefined) {
        throw new Error('Period of newspaper ending without having a start');
      }
      let current = periodStart;
      while (isLowerOrEqual(current, update.date)) {
        const next = addDays(current, 7);
        pushPaper(current);
        current = next;
      }
      periodStart = undefined;
    } else if (update.update.newspaper === 'fan') {
      fanDate = update.date;
    }
  }
});

if (fanDate === '') {
  throw new Error('No fan issue found');
}

export const FAN_ISSUE_DATE = fanDate;