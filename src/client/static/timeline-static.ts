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

function getFullDate(value: string) {
  const month = Number(value.slice(5, 7))
  const day = Number(value.slice(8, 10))

  return `${MONTHS[month - 1]} ${day}`;
}

function getDescription(version: Day): string {
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

type Day = {
  date: string;
  events: string[];
}

// saving selected version globally
let currentVersion = '';

const timelineElement = document.getElementById('timeline')!;
const yearElement = document.getElementById('year')! as HTMLSelectElement;
const monthElement = document.getElementById('month')! as HTMLSelectElement;

function updateTimeline(days: Day[], scroll: boolean = true) {
  timelineElement.innerHTML = days.filter((day) => {
    const correctYear = day.date.slice(0, 4) === yearElement.value;
    const month = Number(day.date.slice(5, 7));
    const monthIndex = MONTHS.indexOf(monthElement.value);
    const correctMonth = monthIndex === -1 || (monthIndex === (month - 1));
    return correctYear && correctMonth;
  }).map((day) => {

    const selected = day.date === currentVersion;

    return `
      <div class="${selected ? 'selected-day' : 'unselected-day'} timeline-row" data-date="${day.date}">
        <div class="center">
          ${selected ? (
            '[SELECTED]'
          ) : (
            '[Click to select]'
          )}
        </div>
        <div class="center">${getFullDate(day.date)}</div>
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
  const days = e.detail as Day[];
  getSettings().then((settings) => {
    currentVersion = settings.version;
    const year = currentVersion.slice(0, 4);
    yearElement.value = year;
    updateTimeline(days);
  })
  
  yearElement.addEventListener('change', () => updateTimeline(days));
  monthElement.addEventListener('change', () => updateTimeline(days));
});