/**
 * This script is used for generating global_crumbs.swf
 */

import path from 'path'
import { extractPcode, replacePcode } from '../src/common/ffdec/ffdec';
import { getGlobalCrumbsOutput, GLOBAL_CRUMBS_PATH, GlobalCrumbContent } from '../src/server/timelines/crumbs';
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

function changeItemCosts(crumbs: string, prices: Record<number, number | undefined>): string {
  // map ID of item to the index of its line that contains the cost
  const paperCrumbs = new Map<number, number>();

  const lines = crumbs.split('\n');
  for (let i = 0; i < lines.length; i++) {
    // search for paper_crumbs instruction
    if (lines[i].startsWith('Push "paper_crumbs"')) {
      // skip to line with ID
      i += 2;
      // get id (some lines will push paper_crumbs and not have this id)
      // so the filter is useful
      const idMatch = lines[i].match(/Push (\d+)/);
      if (idMatch !== null) {
        const id = idMatch[1];

        // skip to line with cost
        i += 2;
        paperCrumbs.set(Number(id), i);
      }
    }
  }

  paperCrumbs.forEach((index, id) => {
    const price = prices[id];
    if (price !== undefined) {
      // remove cost from the start, insert new cost
      const newInstruction = `Push "cost", ${price}` + lines[index].replace(/Push "cost", \d+/, '');
      lines[index] = newInstruction;
    }
  });

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
  await replacePcode(BASE_GLOBAL_CRUMBS, outputPath, path.join('/frame_1', 'DoAction'), crumbsContent);
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
    newCrumbs = changeItemCosts(newCrumbs, changes.prices);
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

  return newCrumbs;
}

export async function generateGlobalCrumbs() {
  await generateCrumbFiles(loadBaseCrumbs, getGlobalCrumbsOutput, applyChanges, createCrumbs, GLOBAL_CRUMBS_PATH);
}

if (require.main === module) {
  generateGlobalCrumbs();
}
