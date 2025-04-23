import { getSettings, post } from "./common-static.js";

const timelineApi = (window as any).api;

/** Update the timeline version */
function updateVersion(version: string) {
  post('update', { version });
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function getFullDate({ day, month }: DateInfo) {
  return `${MONTHS[month - 1]} ${day}`;
}

function getDescription(version: DateInfo): string {
  return `
  <div class="date-description">
    <div>
    On this day
    </div>
    <ul>
      ${version.events.map((item) => {
        return `
        <li>
          ${item}
        </li>
        `
      }).join('')}
    </ul>
  </div>
  `;
}

// saving selected version globally
let currentVersion = '';

const timelineElement = document.getElementById('timeline')!;
const yearElement = document.getElementById('year')! as HTMLSelectElement;
const monthElement = document.getElementById('month')! as HTMLSelectElement;

/** Basic unit of information about a singular day in the timeline */
type DateInfo = {
  day: number;
  month: number;
  year: number;
  events: string[];
};

function getDateElement({ day, month, events }: DateInfo,
  left: DateInfo | undefined,
  right: DateInfo | undefined,
  top: DateInfo | undefined,
  bottom: DateInfo | undefined  
): string {
  const elements: boolean[] = [];
  for (let index = 0; index < 3; index++) {
    elements.push(true);
  }
  if (day === 0) {
    return `<td></td>`
  }

  let classes: string[] = [];
  if (left === undefined || left.year === 0) {
    classes.push('left-edge');
  } else if (right === undefined || right.year === 0 || right.month > month) {
    classes.push('right-edge');
  }
  if (bottom === undefined || bottom.month > month) {
    classes.push('bottom-edge');
  }
  if (top === undefined || top.month < month) {
    classes.push('top-edge');
  }

  if (events.length === 0) {
    classes.push('non-day');
  }

  return `
  <td class="${classes.join(' ')}">
  <div class="${events.length === 0 ? '' : 'clickable'}">
    ${day}
  </div>
  <div>
    
  </div>
  
  </td>
  `;
}

function getFirstDayOfWeek(week: DateInfo[]): DateInfo {
  let firstDay: DateInfo = week[0];
  for (const day of week) {
    if (day.year > 0) {
      firstDay = day;
      break;
    }
  }

  return firstDay;
}

function getWeekElement(days: DateInfo[], rowsSpan: number, previousWeek: DateInfo[] | undefined, nextWeek: DateInfo[] | undefined): string {
  const firstDay = getFirstDayOfWeek(days);

  return `
<tr>
  ${rowsSpan === 0 ? '' : (
    `
    <td rowspan="${rowsSpan}" class="month-name">
      ${MONTHS[firstDay.month - 1].slice(0, 3)}'${String(firstDay.year).slice(2)}
    </td>
    `
  )}
  ${days.map((day, i) => {
    const left = days[i - 1];
    const right = days[i + 1];
    const top = previousWeek === undefined ? undefined : previousWeek[i];
    const bottom = nextWeek === undefined ? undefined : nextWeek[i];
    return getDateElement(day, left, right, top, bottom);
  }).join('')}
</tr>
  `
}

function getDateFormat({ year, month, day}: DateInfo): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDateFromDateInfo({ day, month, year}: DateInfo): Date {
  return new Date(year, month - 1, day);
}

/** Render the calendar as the timeline */
function createCalendar(days: DateInfo[]) {

  /** Will be used to track which days have events */
  const dateMap: Record<string, DateInfo> = {};
  days.forEach((day) => {
    dateMap[getDateFormat(day)] = day;
  })

  // days only has all days with events, we need
  // to also have every day in between those
  const daysToUse: DateInfo[] = [];

  const startDate = getDateFromDateInfo(days[0]);
  const endDate = new Date(2011, 0, 1);
  // iterating through every day between start and end
  for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
    const dateInfoOfDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      events: [] as string[]
    };
    
    const dateStr = getDateFormat(dateInfoOfDate);
    const day = dateMap[dateStr];
    if (day === undefined) {
      daysToUse.push(dateInfoOfDate);
    } else {
      daysToUse.push(day);
    }
  }

  // padding with "dead" dates at the start
  const firstDayOfWeek = startDate.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysToUse.unshift({ day: 0, year: 0, month: 0, events: [] })
  }

  const weeks: DateInfo[][] = [];
  let curWeek: DateInfo[] = [];
  for (let i = 0; i < daysToUse.length; i++) {
    curWeek.push(daysToUse[i]);
    
    const weekDay = i % 7;
    if (weekDay === 6) {
      weeks.push(curWeek);
      curWeek = [];
    }
  }

  // padding with "dead" dates at the end
  while (curWeek.length < 7) {
    curWeek.push({ year: 0, month: 0, day: 0, events: []});
  }
  weeks.push(curWeek);

  // constructing a version in which each week has also how many rows it will span
  const weeksWithSpanInfo: Array<{ week: DateInfo[]; span: number; }> = [];
  let currentSpan = -1;
  let currentMonth = -1;
  let weekSpanStart = -1;
  weeks.forEach((week, i) => {
    const weeksMonth = getFirstDayOfWeek(week).month;
    if (weeksMonth !== currentMonth) {
      // -1 would be the very first, so no need to update spans
      if (currentMonth > 0) {
        weeksWithSpanInfo[weekSpanStart].span = currentSpan;
      }

      currentMonth = weeksMonth;
      weekSpanStart = i;
      currentSpan = 1;
    } else {
      currentSpan++;
    }
    weeksWithSpanInfo.push({ week, span: 0 });
  });

  timelineElement.innerHTML = `
<table>
<thead>
    <th></th>
    <th>
      Sun
    </th>
    <th>
      Mon
    </th>
    <th>
      Tue
    </th>
    <th>
      Wed
    </th>
    <th>
      Thu
    </th>
    <th>
      Fri
    </th>
    <th>
      Sat
    </th>
  </thead>
<tbody>
  ${weeksWithSpanInfo.map((week, i) => {
    return getWeekElement(
      week.week,
      week.span,
      weeksWithSpanInfo[i - 1]?.week,
      weeksWithSpanInfo[i + 1]?.week)
      ;
    }).join('')}
</tbody>
</table>
  `;
}

function updateTimeline(days: DateInfo[], scroll: boolean = true) {
  timelineElement.innerHTML = days.filter((day) => {
    const correctYear = String(day.year) === yearElement.value;
    const month = day.month;
    const monthIndex = MONTHS.indexOf(monthElement.value);
    const correctMonth = monthIndex === -1 || (monthIndex === (month - 1));
    return correctYear && correctMonth;
  }).map((day) => {

    const date = getDateFormat(day);

    const selected = date === currentVersion;

    return `
      <div class="${selected ? 'selected-day' : 'unselected-day'} timeline-row" data-date="${date}">
        <div class="center">
          ${selected ? (
            '[SELECTED]'
          ) : (
            '[Click to select]'
          )}
        </div>
        <div class="center">${getFullDate(day)}</div>
        ${getDescription(day)}
      </div>
    `
  }).join('')

  const timelineRows = document.querySelectorAll('.unselected-day');

  if (scroll) {
    const selected = document.querySelectorAll('.selected-day')[0];
  
    // is undefined if picked a range where nothing is selected
    if (selected === undefined) {
      // reset to the top
      window.scrollTo({ top: 0 });
    } else if (selected !== undefined) {
      // need to add some amount so that it doesn't get hidden at the top
      const y = selected.getBoundingClientRect().top - 150 + window.scrollY;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }


  timelineRows.forEach((row) => {
    row.addEventListener('click', () => {
      if (row instanceof HTMLDivElement) {
        const date = row.dataset.date;
        if (date !== undefined) {
          currentVersion = date;
          timelineApi.update();
          updateVersion(date);
          updateTimeline(days, false);
        }
      }
    })
  });

  const radioButtons = document.querySelectorAll('input[name="version"]');

  // Add an event listener to each radio button
  radioButtons.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      if (event.target instanceof HTMLInputElement) {
        if (event.target.checked) {
          updateVersion(event.target.value);
          currentVersion = event.target.value;
          timelineApi.update();
        }
      }
    });
  });

  for (const button of radioButtons) {
    if (button instanceof HTMLInputElement) {
      if (button.value === currentVersion) {
        button.checked = true;
      }
    }
  }
}

window.addEventListener('get-timeline', (e: any) => {
  const days = e.detail as DateInfo[];
  getSettings().then((settings) => {
    currentVersion = settings.version;
    const year = currentVersion.slice(0, 4);
    yearElement.value = year;
    // updateTimeline(days);
    createCalendar(days);
  })
  
  yearElement.addEventListener('change', () => updateTimeline(days));
  monthElement.addEventListener('change', () => updateTimeline(days));
});