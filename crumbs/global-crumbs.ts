/**
 * This script is used for generating global_crumbs.swf
 */

import path from 'path'
import { extractPcode, replacePcode } from '../src/common/ffdec/ffdec';
import { getGlobalCrumbsOutput, GLOBAL_CRUMBS_PATH, GlobalCrumbContent } from '../src/server/timelines/crumbs';
import { generateCrumbFiles } from './base-crumbs';
import { iterateEntries } from '../src/common/utils';
import { GlobalHuntCrumbs } from '../src/server/game-data/parties';

const BASE_GLOBAL_CRUMBS = path.join(__dirname, 'base_global_crumbs.swf');

async function loadBaseCrumbs(): Promise<string> {
  return await extractPcode(BASE_GLOBAL_CRUMBS, 'frame_1/DoAction.pcode');
}

function setMigratorStatus(crumbs: string, status: boolean): string {
  const lines = crumbs.split('\n');
  const allocationStart = 'Push "migrator_active"';
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(allocationStart)) {
      lines[i] = allocationStart + ', ' + (status ? 'true' : 'false');
      break;
    }
  }

  return lines.join('\n');
}

type RoomInfoChange = Record<string, {
  newMusicId?: number;
  newMemberStatus?: boolean;
}>

function changeRoomInfo(crumbs: string, roomInfo: RoomInfoChange): string {
  const lines = crumbs.split('\n')
  for (let i = 0; i < lines.length; i++) {
    // search for room_crumbs instructions
    if (lines[i].startsWith('Push "room_crumbs"')) {
      i += 2
      // check that it is a room instruction
      const match = lines[i].match(/^Push "([\d\w]+)"/);
      if (match !== null && typeof match[1] === 'string') {
        const roomName = match[1];
  
        if (roomName in roomInfo) {
          const info = roomInfo[roomName];
          if (info.newMusicId !== undefined) {
            // find the original ID
            const musicMatch = lines[i].match(/"music_id", \d+/)
            if (musicMatch !== null) {
              // replacing the old ID
              lines[i] = lines[i].replace(musicMatch[0], `"music_id", ${info.newMusicId}`)
            }
          }
          if (info.newMemberStatus !== undefined) {
            // find the original status
            const memberMatch = lines[i].match(/"is_member", \w+/);
            if (memberMatch === null && info.newMemberStatus === true) {
              // property doesn't exist: we have to add it
              // the line always ends with ", \d+" where number is how many properties there are
              const propertiesMatch = lines[i].match(/^(.*), (\d+)\s*$/);
              if (propertiesMatch === null || propertiesMatch.length !== 3) {
                throw new Error('Invalid global crumbs: Expected to find properties line definition with number at the end\nPerhaps deobfuscation is on?');
              }
              lines[i] = `${propertiesMatch[1]}, "is_member", true, ${Number(propertiesMatch[2]) + 1}`;
            } else if (memberMatch !== null) {
              // replacing the old value
              lines[i] = lines[i].replace(memberMatch[0], `"is_member", ${info.newMemberStatus ? 'true' : 'false'}`)
            }
          }
        }
      }
    }
  }
  return lines.join('\n')
}

function changeCostsBase(crumbs: string, prices: Record<number, number | undefined>, lineSkips: number, name: string): string {
  // map ID of item to the index of its line that contains the cost
  const itemCrumbs = new Map<number, number>();

  const lines = crumbs.split('\n');
  for (let i = 0; i < lines.length; i++) {
    // search for paper_crumbs instruction
    if (lines[i].startsWith(`Push "${name}_crumbs"`)) {
      // skip to line with ID
      i += 2;
      // get id (some lines will push paper_crumbs and not have this id)
      // so the filter is useful
      const idMatch = lines[i].match(/Push (\d+)/);
      if (idMatch !== null) {
        const id = idMatch[1];

        // skip to line with cost
        i += lineSkips;
        itemCrumbs.set(Number(id), i);
      }
    }
  }

  itemCrumbs.forEach((index, id) => {
    const price = prices[id];
    if (price !== undefined) {
      // remove cost from the start, insert new cost
      const newInstruction = `Push "cost", ${price}` + lines[index].replace(/Push "cost", \d+/, '');
      lines[index] = newInstruction;
    }
  });

  return lines.join('\n');
}

function changeItemCosts(crumbs: string, prices: Record<number, number | undefined>): string {
  return changeCostsBase(crumbs, prices, 2, 'paper');
}

function changeFurnitureCosts(crumbs: string, prices: Record<number, number | undefined>): string {
  return changeCostsBase(crumbs, prices, 4, 'furniture');
  
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

function addScavengerHunt(crumb: string, hunt: GlobalHuntCrumbs): string {
  return `${crumb}
Push "scavenger_hunt_crumbs", 0.0, "Object"
NewObject
DefineLocal
Push "scavenger_hunt_crumbs"
GetVariable
Push "hunt_active", true
SetMember
Push "scavenger_hunt_crumbs"
GetVariable
Push "member_hunt", ${hunt.member ? 'true' : 'false'}
SetMember
Push "scavenger_hunt_crumbs"
GetVariable
Push "itemRewardID", ${hunt.reward}
SetMember`;
}

/**
 * Creates a new global_crumbs.swf file
 * @param outputPath Path the SWF will be saved in
 * @param crumbsContent The P-Code code content of the file
 */
async function createCrumbs(outputPath: string, crumbsContent: string): Promise<void> {
  await replacePcode(BASE_GLOBAL_CRUMBS, outputPath, path.join('/frame_1', 'DoAction'), crumbsContent);
}

function applyChanges(crumbs: string, changes: Partial<GlobalCrumbContent>): string {
  let newCrumbs = crumbs;
  const roomInfo: RoomInfoChange = {};
  if (changes.music !== undefined) {
    Object.entries(changes.music).forEach((pair) => {
      const [room, music] = pair;
      if (!(room in roomInfo)) {
        roomInfo[room] = {};
      }
      roomInfo[room].newMusicId = music;
    });
  }
  if (changes.member !== undefined) {
    iterateEntries(changes.member, (room, isMember) => {
      if (!(room in roomInfo)) {
        roomInfo[room] = {};
      }
      roomInfo[room].newMemberStatus = isMember;
    });
  }

  newCrumbs = changeRoomInfo(newCrumbs, roomInfo);

  if (changes.prices !== undefined) {
    newCrumbs = changeItemCosts(newCrumbs, changes.prices);
  }

  if (changes.furniturePrices !== undefined) {
    newCrumbs = changeFurnitureCosts(newCrumbs, changes.furniturePrices);
  }

  if (changes.paths !== undefined) {
    for (const path in changes.paths) {
      const pathName = changes.paths[path];
      if (pathName !== undefined) {
        newCrumbs = addGlobalPath(newCrumbs, path, pathName);
      }
    }
  }

  if (changes.newMigratorStatus !== undefined) {
    newCrumbs = setMigratorStatus(newCrumbs, changes.newMigratorStatus);
  }

  if (changes.hunt !== undefined) {
    newCrumbs = addScavengerHunt(newCrumbs, changes.hunt);
  }

  return newCrumbs;
}

export async function generateGlobalCrumbs() {
  await generateCrumbFiles(loadBaseCrumbs, getGlobalCrumbsOutput, applyChanges, createCrumbs, GLOBAL_CRUMBS_PATH);
}

if (require.main === module) {
  generateGlobalCrumbs();
}
