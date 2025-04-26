/**
 * This script is used for generating global_crumbs.swf
 */

import path from 'path'
import { extractPcode, replacePcode } from '../src/common/ffdec/ffdec';
import { getGlobalCrumbsOutput, GLOBAL_CRUMBS_PATH, GlobalCrumbContent } from '../src/server/routes/client-files';
import { generateCrumbFiles } from './base-crumbs';

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

/**
 * Creates a new global_crumbs.swf file
 * @param outputPath Path the SWF will be saved in
 * @param crumbsContent The P-Code code content of the file
 */
async function createCrumbs(outputPath: string, crumbsContent: string): Promise<void> {
  await replacePcode(BASE_GLOBAL_CRUMBS, outputPath, '\\frame 1\\DoAction', crumbsContent);
}

function applyChanges(crumbs: string, changes: Partial<GlobalCrumbContent>): string {
  let newCrumbs = crumbs;
  if (changes.music !== undefined) {
    Object.entries(changes.music).forEach((pair) => {
      const [room, music] = pair;
      newCrumbs = changeRoomMusic(newCrumbs, room, music);
    });
  }

  if (changes.prices !== undefined) {
    for (const item in changes.prices) {
      newCrumbs = changeItemCost(newCrumbs, Number(item), changes.prices[item]);
    }
  }

  if (changes.paths !== undefined) {
    for (const path in changes.paths) {
      newCrumbs = addGlobalPath(newCrumbs, path, changes.paths[path]);
    }
  }

  if (changes.newMigratorStatus !== undefined) {
    newCrumbs = setMigratorStatus(newCrumbs, changes.newMigratorStatus);
  }

  return newCrumbs;
}

generateCrumbFiles(loadBaseCrumbs, getGlobalCrumbsOutput, applyChanges, createCrumbs, GLOBAL_CRUMBS_PATH);
