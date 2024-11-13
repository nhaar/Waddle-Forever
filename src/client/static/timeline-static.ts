const timelineApi = (window as any).api;

function getMonthName(month: number): string {
  return [
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
  ][month - 1];
}

function getFullDate(value: string) {
  const year = Number(value.slice(0, 4))
  const monthNum = Number(value.slice(5, 7))
  const day = Number(value.slice(8, 10))

  return `${getMonthName(monthNum)} ${day}, ${year}`;
}

function getGameVersion(value: string) {
  const year = value.slice(0, 4)
  const monthNum = Number(value.slice(5, 7))
  const day = value.slice(8, 10)

  return `${year}-${getMonthName(monthNum).slice(0, 3)}-${day}`;
}

function getDescription(version: Version): string {
  if (version.events.partyStart !== undefined) {
    return `Party "${version.events.partyStart}" starts`
  } else if (version.events.partyEnd !== undefined) {
    return `Party "${version.events.partyEnd}" ends`
  } else if (version.events.partyUpdate !== undefined) {
    return version.events.partyUpdate
  } else if (version.events.other !== undefined) {
    return version.events.other
  }

  return ''
}

type Version = {
  value: string
  events: {
    partyStart?: string
    partyEnd?: string
    partyUpdate?: string
    other?: string
  }
}

const versions: Version[] = [
  {
    value: '2005-08-22',
    events: {
      other: 'Beta release'
    }
  },
  {
    value: '2010-09-03',
    events: {
      partyStart: 'The Fair 2010'
    }
  },
  {
    value: '2010-09-10',
    events: {
      partyUpdate: 'New items were added to the prize booths'
    }
  },
  {
    value: '2010-09-24',
    events: {
      partyStart: 'Stadium Games'
    }
  },
  {
    value: '2010-10-23',
    events: {
      partyStart: '5th Anniversary'
    }
  },
  {
    value: '2010-10-28',
    events: {
      partyStart: 'Halloween 2010'
    }
  },
  {
    value: '2010-11-24',
    events: {
      partyEnd: 'Sensei\'s Water Scavenger Hunt'
    }
  }
]

const timelineElement = document.getElementById('timeline');

timelineElement.innerHTML = versions.map((version) => {
  return `
      <input type="radio" id="${version.value}" name="version" value="${getGameVersion(version.value)}">
      <label for="${version.value}">${getFullDate(version.value)} (${getDescription(version)})</label><br>
  `
}).join('')

const radioButtons = document.querySelectorAll('input[name="version"]');

// Add an event listener to each radio button
radioButtons.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    if (event.target instanceof HTMLInputElement) {
      if (event.target.checked) {
        timelineApi.update(event.target.value);
      }
    }
  });
});

window.addEventListener('receive-version', (e: any) => {
  for (const button of radioButtons) {
    if (button instanceof HTMLInputElement) {
      if (button.value === e.detail) {
        button.checked = true;
      }
    }
  }
})
