import fs from 'fs'
import path from 'path'

function loadBaseCrumbs(): string {
  return fs.readFileSync(path.join(__dirname, 'base_global_crumbs'), { encoding: 'utf-8' })
}

function changeRoomMusic(crumbs: string, roomName: string, newMusicId: number): string {
  const lines = crumbs.split('\n')
  for (let i = 0; i < lines.length; i++) {
    // search for room_crumbs instructions
    if (lines[i].startsWith('Push "room_crumbs"')) {
      i += 2
      // check that it is the same room we want
      if (lines[i].startsWith(`Push "${roomName}"`)) {
        // find the original ID
        const musicMatch = lines[i].match(/"music_id", \d+/)
        if (musicMatch !== null) {
          // replacing the old ID
          lines[i] = lines[i].replace(musicMatch[0], `"music_id", ${newMusicId}`)
        }

        // there will be no other room of interest
        break;
      }
    }
  }
  return lines.join('\n')
}

function changeItemCost(crumbs: string, itemId: number, newCost: number): string {
  const lines = crumbs.split('\n');
  for (let i = 0; i < lines.length; i++) {
    // search for paper_crumbs instruction
    if (lines[i].startsWith('Push "paper_crumbs"')) {
      // skip to line with ID
      i += 2
      if (lines[i].startsWith(`Push ${itemId}`)) {
        // skip to line with cost
        i += 2
        const costMatch = lines[i].match(/Push "cost", \d+/)
        if (costMatch !== null) {
          lines[i] = lines[i].replace(costMatch[0], `Push "cost", ${newCost}`)
        }

        // there will be no other item of interest
        break;
      }
    }
  }

  return lines.join('\n');
}

function addGlobalPath(crumbs: string, pathName: string, path: string): string {
  const lines = crumbs.split('\n');
  let insertIndex: number | undefined = undefined;
  for (let i = 0; i < lines.length; i++) {
    // find global paths variable declaration
    if (lines[i].startsWith('Push "global_path", 0, "Object"')) {
      insertIndex = i + 3;
    }
  }
  if (insertIndex !== undefined) {
    lines.splice(insertIndex, 0,
      'Push "global_path"',
      'GetVariable',
      `Push "${pathName}", "${path}"`,
      'SetMember'
    );
  }
  return lines.join('\n');
}

type Modifications = {
  music?: Record<string, number>,
  prices?: Record<number, number>,
  globalPaths?: Record<string, string>
}

const crumbs: Array<{
  filename: string,
  changes?: Modifications
}> = [
  { filename: '2010-Nov-24' },
  { filename: '2010-Halloween', changes: {
      music: {
        'town': 251,
        'coffe': 252,
        'book': 252,
        'dance': 223,
        'lounge': 223,
        'shop': 252,
        'plaza': 251,
        'pet': 252,
        'pizza': 253,
        'stage': 43,
        'village': 251,
        'lodge': 252,
        'attic': 252,
        'mtn': 251,
        'forts': 251,
        'rink': 251,
        'dock': 251,
        'beach': 251,
        'light': 252,
        'beacon': 251,
        'forest': 251,
        'berg': 251,
        'cove': 251,
        'cave': 252,
        'shack': 251,
        'party1': 251,
        'party2': 253,
        'party3': 299,
        'party4': 300,
        'party5': 298
      },
      prices: {
        5081: 0,
        9077: 0
      },
      globalPaths: {
        'scavenger_hunt_icon': 'scavenger_hunt/scavenger_hunt_icon.swf',
        'hunt_ui': 'scavenger_hunt/hunt_ui.swf',
        'halloween_hunt': 'scavenger_hunt/hunt_ui.swf'
      }
    }
  },
  { filename: '2010-Anniversary', changes: {
    music: {
      'town': 218,
      'coffee': 218,
      'book': 218,
      'stage': 43
    }
  }},
  { filename: '2010-Fair', changes: {
    music: {
      'town': 297,
      'coffee': 221,
      'dance': 243,
      'lounge': 243,
      'plaza': 297,
      'stage': 32,
      'village': 297,
      'mtn': 297,
      'forts': 297,
      'dock': 297,
      'beach': 297,
      'beacon': 221,
      'forest': 297,
      'berg': 297,
      'cove': 297,
      'party': 221,
      'party1': 221,
      'party2': 221,
      'party3': 221
    },
    prices: {
      5077: 0,
      6052: 0
    },
    globalPaths: {
      'tickets': 'tickets.swf',
      'ticket_icon': 'ticket_icon.swf'
    }
  }},
  { filename: '2010-StadiumGames', changes: {
    music: {
      'stage': 39
    }
  }}
]

const outDir = path.join(__dirname, 'out')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}


for (const crumb of crumbs) {
  let newCrumbs = loadBaseCrumbs();
  if (crumb.changes !== undefined) {
    if (crumb.changes.music !== undefined) {
      for (const room in crumb.changes.music) {
        newCrumbs = changeRoomMusic(newCrumbs, room, crumb.changes.music[room]);
      }
    }

    if (crumb.changes.prices !== undefined) {
      for (const item in crumb.changes.prices) {
        newCrumbs = changeItemCost(newCrumbs, Number(item), crumb.changes.prices[item]);
      }
    }

    if (crumb.changes.globalPaths !== undefined) {
      for (const path in crumb.changes.globalPaths) {
        newCrumbs = addGlobalPath(newCrumbs, path, crumb.changes.globalPaths[path]);
      }
    }
  }


  fs.writeFileSync(path.join(outDir, crumb.filename), newCrumbs);
}
