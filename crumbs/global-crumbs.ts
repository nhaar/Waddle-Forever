/**
 * This script is used for generating global_crumbs.swf
 * 
 * If you want to create or edit a crumb file, what you want to
 * change is `CRUMBS_TIMELINE`
 */

import path from 'path'
import { extractPcode, replacePcode } from '../src/common/ffdec/ffdec';
import { DEFAULT_DIRECTORY } from '../src/common/utils'

const BASE_GLOBAL_CRUMBS = path.join(__dirname, 'base_global_crumbs.swf');

async function loadBaseCrumbs(): Promise<string> {
  return await extractPcode(BASE_GLOBAL_CRUMBS, 'frame_1/DoAction.pcode');
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

function applyChanges(crumbs: string, changes: Modifications): string {
  let newCrumbs = crumbs;
  if (changes.music !== undefined) {
    for (const room in changes.music) {
      newCrumbs = changeRoomMusic(newCrumbs, room, changes.music[room]);
    }
  }

  if (changes.prices !== undefined) {
    for (const item in changes.prices) {
      newCrumbs = changeItemCost(newCrumbs, Number(item), changes.prices[item]);
    }
  }

  if (changes.globalPaths !== undefined) {
    for (const path in changes.globalPaths) {
      newCrumbs = addGlobalPath(newCrumbs, path, changes.globalPaths[path]);
    }
  }

  return newCrumbs;
}

type SeasonalCrumbsChange = {
  type: 'seasonal',
  /** Valid version string */
  version: string
  changes: Modifications
};
type PartyCrumbsChange = {
  type: 'party',
  /** Path to event eg 2010/music_jam */
  event: string
  changes: Modifications
};

type CrumbsTimeline = Array<SeasonalCrumbsChange | PartyCrumbsChange>;

/** Timeline with all updates to global_crumbs, must be included in CHRONOLOGICAL ORDER! */
const CRUMBS_TIMELINE: CrumbsTimeline = [
  {
    type: 'seasonal',
    version: '2010-Jun-10',
    changes: {
      music: {
        'stage': 37
      }
    }
  },
  {
    type: 'seasonal',
    version: '2010-Jul-21',
    changes: {
      music: {
        'stage': 230
      }
    }
  },
  {
    type: 'party',
    event: '2010/music_jam',
    changes: {
      music: {
        'lounge': 271,
        'berg': 244,
        'mine': 247,
        'dance': 242,
        'pizza': 271,
        'plaza': 271,
        'forts': 271,
        'rink': 240,
        'village': 292,
        'town': 271,
        'party3': 293,
        'coffee': 0
      }
    }
  },
  {
    type: 'party',
    event: '2010/mountain_expedition',
    changes: {
      music: {
        'party2': 294,
        'party3': 295,
        'party4': 295,
        'party6': 256
      }
    }
  },
  {
    type: 'seasonal',
    version: '2010-Aug-26',
    changes: {
      music: {
        'stage': 32
      }
    }
  },
  {
    type: 'party',
    event: '2010/fair_2010',
    changes: {
      music: {
        'town': 297,
        'coffee': 221,
        'dance': 243,
        'lounge': 243,
        'plaza': 297,
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
    }
  },
  {
    type: 'seasonal',
    version: '2010-Sep-16',
    changes: {
      music: {
        'stage': 39
      }
    }
  },
  {
    type: 'seasonal',
    version: '2010-Oct-08',
    changes: {
      music: {
        'stage': 43
      }
    }
  },
  {
    type: 'party',
    event: '2010/5th_anniversary_party',
    changes: {
      music: {
        'town': 218,
        'coffee': 218,
        'book': 218,
        'stage': 43
      }
    }
  },
  {
    type: 'party',
    event: '2010/halloween_party_2010',
    changes: {
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
  {
    type: 'seasonal',
    version: '2010-Nov-18',
    changes: {
      music: {
        'stage': 38
      }
    }
  }
]

const SEASONAL_CRUMBS_PATH = path.join(DEFAULT_DIRECTORY, 'seasonal/play/v2/content/global/crumbs/global_crumbs.swf');

/**
 * Creates a new global_crumbs.swf file
 * @param outputPath Path the SWF will be saved in
 * @param crumbsContent The P-Code code content of the file
 */
function createCrumbs(outputPath: string, crumbsContent: string): void {
  replacePcode(BASE_GLOBAL_CRUMBS, outputPath, '\\frame 1\\DoAction', crumbsContent);
}

(async () => {
  console.log('Beginning exporting');
  let permanentCrumbs = await loadBaseCrumbs();
  for (const update of CRUMBS_TIMELINE) {
    if (update.type === 'seasonal') {
      console.log(`Exporting changes for day ${update.version}`);
      permanentCrumbs = applyChanges(permanentCrumbs, update.changes);
      const filePath = path.join(SEASONAL_CRUMBS_PATH, update.version + '.swf');
      createCrumbs(filePath, permanentCrumbs);
    } else {
      console.log(`Exporting changes for event "${update.event}"`);
      const partyCrumbs = applyChanges(permanentCrumbs, update.changes);
      const filePath = path.join(DEFAULT_DIRECTORY, 'event', update.event, 'play/v2/content/global/crumbs/global_crumbs.swf');
      createCrumbs(filePath, partyCrumbs);
    }
  }
})();
