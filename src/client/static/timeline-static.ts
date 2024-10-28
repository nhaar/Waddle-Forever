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
  }

  return ''
}

type Version = {
  value: string
  events: {
    partyStart?: string
    partyEnd?: string
  }
}

const versions: Version[] = [
  {
    value: '2010-09-03',
    events: {
      partyStart: 'The Fair 2010'
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

// // TODO better system, less anys?

// const fpsInput = document.querySelector<HTMLInputElement>('.js-fps-input');
// const thinIceIgtInput = document.querySelector<HTMLInputElement>('.js-thin-ice-igt-input');
// const clothingInput = document.querySelector<HTMLInputElement>('.js-clothing-input');
// const myPuffleInput = document.querySelector<HTMLInputElement>('.js-my-puffle-input');
// const idleInput = document.querySelector<HTMLInputElement>('.js-idle-input');
// const jpaInput = document.querySelector<HTMLInputElement>('.js-jpa-level-input');
// const danceInput = document.querySelector<HTMLInputElement>('.js-dance-arrow-input');

// fpsInput.addEventListener('change', (e) => {
//   if (e.target instanceof HTMLInputElement) {
//     api.update({ fps30: e.target.checked });
//     api.reloadCacheless();
//   }
// });

// thinIceIgtInput.addEventListener('change', (e) => {
//   if (e.target instanceof HTMLInputElement) {
//     api.update({ thin_ice_igt: e.target.checked });
//     api.clearCache();
//   }
// });

// clothingInput.addEventListener('change', (e) => {
//   if (e.target instanceof HTMLInputElement) {
//     if (e.target.checked) {
//       const download = window.confirm('Do you want to download the clothing package (around 600 MB)?');
//       if (download) {
//         api.download('clothing')
//       }
//       e.target.checked = false;
//     } else {
//       const remove = window.confirm('Do you want to remove the clothing package (you will need to download it again if you wish to use it)');
//       if (remove) {
//         api.delete('clothing')
//       }
//       e.target.checked = true;
//     }
//   }
// })

// myPuffleInput.addEventListener('change', (e) => {
//   if (e.target instanceof HTMLInputElement) {
//     api.update({ modern_my_puffle: e.target.checked });
//     api.clearCache();
//   }
// })

// idleInput.addEventListener('change', (e) => {
//   if (e.target instanceof HTMLInputElement) {
//     api.update({ remove_idle: e.target.checked });
//     api.reloadCacheless();
//   }
// })

// jpaInput.addEventListener('change', (e) => {
//   if (e.target instanceof HTMLInputElement) {
//     api.update({ jpa_level_selector: e.target.checked })
//     api.clearCache();
//   }
// })

// danceInput.addEventListener('change', (e) => {
//   if (e.target instanceof HTMLInputElement) {
//     api.update({ swap_dance_arrow: e.target.checked })
//     api.clearCache();
//   }
// })

// window.addEventListener('receive-settings', (e: any) => {
//   const settings = e.detail;
//   fpsInput.checked = settings['fps30'];
//   thinIceIgtInput.checked = settings['thin_ice_igt'];
//   clothingInput.checked = settings['clothing'];
//   myPuffleInput.checked = settings['modern_my_puffle'];
//   idleInput.checked = settings['remove_idle'];
//   jpaInput.checked = settings['jpa_level_selector'];
//   danceInput.checked = settings['swap_dance_arrow'];
// });

// window.addEventListener('finish-download', (e: any) => {
//   const pack = e.detail;

//   if (pack === 'clothing') {
//     window.alert('Clothing downloaded successfully');
//     clothingInput.checked = true;
//   }
// })

// window.addEventListener('finish-deleting', (e: any) => {
//   const pack = e.detail;

//   if (pack === 'clothing') {
//     window.alert('Clothing removed succesfully');
//     clothingInput.checked = false;
//   }
// })

// window.addEventListener('download-fail', () => {
//   window.alert('Can\'t download the package. Please check your internet connection or if the Waddle Forever webservices are functioning.')
// })