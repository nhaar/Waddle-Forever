import { getSettings, post } from "./common-static.js";

const timelineApi = (window as any).api;

/** Update the timeline version */
function updateVersion(version: string) {
  post('update', { version });
}

const MONTHS = {
  'Jan': 'January',
  'Feb': 'February',
  'Mar': 'March',
  'Apr': 'April',
  'May': 'May',
  'Jun': 'June',
  'Jul': 'July',
  'Aug': 'August',
  'Sep': 'September',
  'Oct': 'October',
  'Nov': 'November',
  'Dec': 'December'
};

function getFullDate(value: string) {
  const year = Number(value.slice(0, 4))
  const monthName = value.slice(5, 8)
  const day = Number(value.slice(9, 11))

  return `${MONTHS[monthName as keyof typeof MONTHS]} ${day}, ${year}`;
}

function getDescription(version: Day): string {
  if (version.events.partyStart !== undefined) {
    return `Party "${version.events.partyStart}" starts`
  } else if (version.events.partyEnd !== undefined) {
    return `Party "${version.events.partyEnd}" ends`
  } else if (version.events.partyUpdate !== undefined) {
    return version.events.partyUpdate
  } else if (version.events.other !== undefined) {
    return version.events.other
  } else if (version.events.roomOpen !== undefined) {
    return `Room "${version.events.roomOpen}" opens`
  } else if (version.events.minigameRelease !== undefined) {
    return `New minigame: "${version.events.minigameRelease}"`
  } else if (version.events.newClothing === true) {
    return 'New Clothing Catalogue'
  } else if (version.events.newIssue !== undefined) {
    return `CPT Issue ${version.events.newIssue} released`
  }

  return ''
}

type Day = {
  date: string
  events: {
    partyStart?: string
    partyEnd?: string
    partyUpdate?: string
    other?: string
    newIssue?: number | string
    roomOpen?: string
    minigameRelease?: string
    newClothing?: boolean
  }
}

// saving selected version globally
let currentVersion = '';

const timelineElement = document.getElementById('timeline')!;
const yearElement = document.getElementById('year')! as HTMLSelectElement;

function updateTimeline(days: Day[]) {
  timelineElement.innerHTML = days.filter((day) => {
    return day.date.slice(0, 4) === yearElement.value;
  }).map((day) => {
    return `
        <input type="radio" id="${day.date}" name="version" value="${day.date}">
        <label for="${day.date}">${getFullDate(day.date)} (${getDescription(day)})</label><br>
    `
  }).join('')

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
});