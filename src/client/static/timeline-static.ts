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
  } else if (version.events.roomOpen !== undefined) {
    return `Room "${version.events.roomOpen}" opens`
  } else if (version.events.minigameRelease !== undefined) {
    return `New minigame: "${version.events.minigameRelease}"`
  } else if (version.events.newIssue !== undefined) {
    return `CPT Issue ${version.events.newIssue} released`
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
    newIssue?: number | string
    roomOpen?: string
    minigameRelease?: string
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
    value: '2005-09-12',
    events: {
      roomOpen: 'Snow Forts'
    }
  },
  {
    value: '2005-09-21',
    events: {
      partyStart: 'Beta Test Party'
    }
  },
  {
    value: '2005-09-22',
    events: {
      partyEnd: 'Beta Test Party'
    }
  },
  {
    value: '2005-10-24',
    events: {
      newIssue: 1
    }
  },
  {
    value: '2005-10-27',
    events: {
      partyStart: 'Halloween Party 2005'
    }
  },
  {
    value: '2005-10-28',
    events: {
      newIssue: 'fan'
    }
  },
  {
    value: '2005-11-01',
    events: {
      partyEnd: 'Halloween Party 2005'
    }
  },
  {
    value: '2005-11-03',
    events: {
      roomOpen: 'Sport Shop',
      newIssue: 2
    }
  },
  {
    value: '2005-11-08',
    events: {
      newIssue: 3
    }
  },
  {
    value: '2005-11-11',
    events: {
      newIssue: 4
    }
  },
  {
    value: '2005-11-15',
    events: {
      partyStart: 'Puffle Discovery'
    }
  },
  {
    value: '2005-11-16',
    events: {
      newIssue: 5
    }
  },
  {
    value: '2005-11-18',
    events: {
      roomOpen: 'Mountain'
    }
  },
  {
    value: '2005-11-21',
    events: {
      newIssue: 6
    }
  },
  {
    value: '2005-12-01',
    events: {
      newIssue: 7
    }
  },
  {
    value: '2005-12-05',
    events: {
      partyEnd: 'Puffle Discovery'
    }
  },
  {
    value: '2005-12-08',
    events: {
      newIssue: 8
    }
  },
  {
    value: '2005-12-14',
    events: {
      minigameRelease: 'Puffle Roundup'
    }
  },
  {
    value: '2005-12-15',
    events: {
      newIssue: 9
    }
  },
  {
    value: '2005-12-22',
    events: {
      partyStart: 'Christmas Party 2005',
      roomOpen: 'Ski Lodge',
      newIssue: 10
    }
  },
  {
    value: '2005-12-26',
    events: {
      partyEnd: 'Christmas Party 2005'
    }
  },
  {
    value: '2005-12-29',
    events: {
      newIssue: 11
    }
  },
  {
    value: '2006-01-05',
    events: {
      newIssue: 12
    }
  },
  {
    value: '2006-01-12',
    events: {
      newIssue: 13
    }
  },
  {
    value: '2006-01-19',
    events: {
      newIssue: 14
    }
  },
  {
    value: '2006-01-26',
    events: {
      newIssue: 15
    }
  },
  {
    value: '2006-01-27',
    events: {
      partyStart: 'Winter Luau'
    }
  },
  {
    value: '2006-01-30',
    events: {
      partyEnd: 'Winter Luau'
    }
  },
  {
    value: '2006-02-02',
    events: {
      newIssue: 16
    }
  },
  {
    value: '2006-02-09',
    events: {
      newIssue: 17
    }
  },
  {
    value: '2006-02-14',
    events: {
      partyStart: 'Valentine\'s Day Celebration'
    }
  },
  {
    value: '2006-02-15',
    events: {
      partyEnd: 'Valentine\'s Day Celebration'
    }
  },
  {
    value: '2006-02-16',
    events: {
      newIssue: 18
    }
  },
  {
    value: '2006-02-23',
    events: {
      newIssue: 19
    }
  },
  {
    value: '2006-02-24',
    events: {
      partyStart: 'Pizza Parlor Opening Party',
      roomOpen: 'Plaza, Pizza Parlor'
    }
  },
  {
    value: '2006-02-28',
    events: {
      partyEnd: 'Pizza Parlor Opening Party'
    }
  },
  {
    value: '2006-03-02',
    events: {
      newIssue: 20
    }
  },
  {
    value: '2006-03-09',
    events: {
      newIssue: 21
    }
  },
  {
    value: '2006-03-16',
    events: {
      newIssue: 22
    }
  },
  {
    value: '2006-03-17',
    events: {
      roomOpen: 'Pet Shop'
    }
  },
  {
    value: '2006-03-23',
    events: {
      newIssue: 23
    }
  },
  {
    value: '2006-03-29',
    events: {
      roomOpen: 'Iceberg'
    }
  },
  {
    value: '2006-03-30',
    events: {
      newIssue: 24
    }
  },
  {
    value: '2006-03-31',
    events: {
      partyStart: 'April Fools Party 2006'
    }
  },
  {
    value: '2006-04-03',
    events: {
      partyEnd: 'April Fools Party 2006'
    }
  },
  {
    value: '2006-04-06',
    events: {
      newIssue: 25
    }
  },
  {
    value: '2006-04-13',
    events: {
      newIssue: 26
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
