import { getSettings, post } from "./common-static.js";

const timelineApi = (window as any).api;

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

function getFullDate({ day, month }: { day: number, month: number }) {
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
  selected?: boolean;
};

function getDateInfo(dateStr: string) : DateInfo {
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch === null) {
    throw new Error('Incorrect date string: ' + dateStr);
  }

  const [_, ...numbers] = dateMatch;
  const [year, month, day] = numbers.map((n) => Number(n));
  return {
    year,
    month,
    day,
    events: [] as string[]
  };
}

function getDateElement({ day, year, month, events, selected }: DateInfo,
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
  }
  if (right === undefined || right.year === 0 || (right.month > month || right.year > year)) {
    classes.push('right-edge');
  }
  if (bottom === undefined || (bottom.month > month || bottom.year > year)) {
    classes.push('bottom-edge');
  }
  if (top === undefined || top.month < month) {
    classes.push('top-edge');
  }

  if (events.length === 0) {
    classes.push('non-day');
  } else if (selected) {
    classes.push('selected-day');
  } else {
    classes.push('yes-day');
  }

  // data date will be important to be able to fetch what element is clicked
  return `
  <td class="${classes.join(' ')}" data-date="${getDateFormat({ year, month, day })}">
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

function getMonthClassName(month: number, year: number) {
  return `month-${year}${String(month).padStart(2, '0')}`;
}

function getWeekElement(days: DateInfo[], rowsSpan: number, previousWeek: DateInfo[] | undefined, nextWeek: DateInfo[] | undefined): string {
  const firstDay = getFirstDayOfWeek(days);

  return `
<tr>
  ${rowsSpan === 0 ? '' : (
    // month and year to identify region
    `
    <td rowspan="${rowsSpan}" class="month-name ${getMonthClassName(firstDay.month, firstDay.year)}" data-month="${firstDay.month}" data-year="${firstDay.year}">
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

function getDateFormat({ year, month, day}: { year: number; month: number; day: number; }): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDateFromDateInfo({ day, month, year}: DateInfo): Date {
  return new Date(year, month - 1, day);
}

enum CalendarScrollAction {
  ScrollToSelectedDay,
  NoScroll,
  ScrollToMonth
};

/** Render the calendar as the timeline */
function createCalendar(
  days: DateInfo[],
  scroll: CalendarScrollAction = CalendarScrollAction.ScrollToSelectedDay,
  dayTitle: string | undefined = undefined,
  dayDescription: string | undefined = undefined
) {

  /** Will be used to track which days have events */
  const dateMap: Record<string, DateInfo> = {};
  days.forEach((day) => {
    dateMap[getDateFormat(day)] = day;
  })

  // days only has all days with events, we need
  // to also have every day in between those
  const daysToUse: DateInfo[] = [];

  const endDate = new Date(2011, 0, 1);
  // iterating through every day between start and end
  for (let date = getDateFromDateInfo(days[0]); date < endDate; date.setDate(date.getDate() + 1)) {
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
      if (dateStr === currentVersion) {
        daysToUse.push({ ...day, selected: true });
      } else {
        daysToUse.push(day);
      }
    }
  }

  // padding with "dead" dates at the start
  const firstDayOfWeek = getDateFromDateInfo(days[0]).getDay();

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

  const DAY_TITLE_ID = 'calendar-title';
  const DAY_DESCRIPTION_ID = 'day-details';
  const NON_DAY_DESCRIPTION = 'Hover over a non grayed-out day to see its details';

  timelineElement.innerHTML = `
<div class="calendar-container">
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
  <!-- there needs to be a container for it to stick -->
  <div class="calendar-description-container">
    <div class="calendar-description">
      <div id="${DAY_TITLE_ID}">
        ${dayTitle === undefined ? NON_DAY_DESCRIPTION : dayTitle}
      </div>
      <div id="${DAY_DESCRIPTION_ID}">
        ${dayDescription ?? ''}
      </div>
    </div>
  </div>
</div>
  `;
  const scrollToMonth = (year: number, month: number) => {
    const selected = document.querySelector(`.${getMonthClassName(month, year)}`)!;
    const y = selected.getBoundingClientRect().top - 250 + window.scrollY;
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  
  // jumping to the right elementt
  if (scroll === CalendarScrollAction.ScrollToSelectedDay) {
    const currentDay = getDateInfo(currentVersion);
    scrollToMonth(currentDay.year, currentDay.month);
  } else if (scroll == CalendarScrollAction.ScrollToMonth) {
    const monthIndex = MONTHS.indexOf(monthElement.value);
    scrollToMonth(Number(yearElement.value), monthIndex + 1);
  }

  // scroll timeout is used to interrupt the function
  // scroll event will be called multiple times which would lead
  // to immense iteration times if not interrupted
  let scrollTimeout: NodeJS.Timeout;

  window.onscroll = () => {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {      
      const months = document.querySelectorAll('.month-name');
      for (const month of months) {
        if (month instanceof HTMLElement) {
          // first month that the user can read, could be adjusted slightly
          if (month.getBoundingClientRect().top > 0) {
            const year = month.dataset.year;
            const monthNumber = month.dataset.month;
            if (year !== undefined)
            {
              yearElement.value = year;
            }
            if (monthNumber !== undefined) {
              monthElement.value = MONTHS[Number(monthNumber) - 1];
            }
            break;
          }
        }
      }
      
    }, 150); // arbitrary delay that works well
  };

  // clicking on a day in the calendar
  timelineElement.onclick = (e) => {
    if (e.target instanceof HTMLElement) {
      const date = e.target.dataset.date;
      if (date !== undefined) {
        updateVersion(date);
        createCalendar(days, CalendarScrollAction.NoScroll, dayTitle, dayDescription);
      }
    }
  }

  const updateDayOverview = (title: string, description: string) => {
    const dayTitleElement = document.getElementById(DAY_TITLE_ID)!;
    const dayDescriptionElement = document.getElementById(DAY_DESCRIPTION_ID)!;
    dayTitleElement.innerText = title;
    dayDescriptionElement.innerHTML = description;
    dayTitle = title;
    dayDescription = description;
  }

  // updating information based on the day
  timelineElement.onmousemove = (e) => {
    console.log(e.target);
    if (e.target instanceof HTMLElement) {
      const date = e.target.dataset.date;
      if (date !== undefined) {
        const dateInfo = dateMap[date];
        // const dateInfo = dateMap['2008-10-09'];
        if (dateInfo === undefined) {
          updateDayOverview('This day has no registered updates', '');
        } else {
          updateDayOverview(getFullDate(dateInfo), getDescription(dateInfo));
        }
      }
    }
  }

  timelineElement.onmouseleave = () => {
    updateDayOverview(NON_DAY_DESCRIPTION, '');
  }

  yearElement.onchange = () => createCalendar(days, CalendarScrollAction.ScrollToMonth);
  monthElement.onchange = () => createCalendar(days, CalendarScrollAction.ScrollToMonth);

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
        <div class="list-description-container">
          ${getDescription(day)}
        </div>
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
          updateVersion(date);
          updateTimeline(days, false);
        }
      }
    })
  });

  yearElement.onchange = () => updateTimeline(days);
  monthElement.onchange = () => updateTimeline(days);
}

/** Update the timeline version */
function updateVersion(version: string) {
  currentVersion = version;
  timelineApi.update();
  post('update', { version });
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
});