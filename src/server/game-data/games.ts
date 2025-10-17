/** Module that handles all standalone game updates */

import { Version } from "../routes/versions";
import { FileRef } from "./files";
import { RoomMap } from "./rooms";

/** Base type for a game's release */
type GameRelease = {
  date?: Version
}

/** Information for a game releasing in Pre-CPIP */
type PreCpipGameRelease = GameRelease & {
  /** If a game from early 2006, the filename inside the games folder during that time */
  '2006'?: string;
  /** Directory of the game in the 2007 client (inside games) */
  directory: string;
  /** File of the minigame */
  fileRef: string;
  roomChanges?: RoomMap<FileRef>
};

/** Name of games supported in the module */
type GameName = 'Thin Ice' |
  'Astro Barrier' |
  'Bean Counters' |
  'Pizzatron 3000' |
  'Ice Fishing' |
  'Hydro Hopper' |
  'Puffle Roundup' |
  'Cart Surfer' |
  'Catchin\' Waves';

/** Timeline of minigames in Pre-CPIP */
export const PRE_CPIP_GAME_UPDATES: Record<GameName, [PreCpipGameRelease]> = {
  'Thin Ice': [
    {
      date: '2006-12-19',
      directory: 'thinice/game.swf',
      fileRef: 'archives:ThinIce.swf',
      roomChanges: {
        lounge: 'archives:ArtworkRoomsLounge40.swf'
      }
    }
  ],
  'Astro Barrier': [
    {
      '2006': 'astro.swf',
      directory: 'astro/astro.swf',
      fileRef: 'mammoth:games/astro.swf'
    }
  ],
  'Bean Counters': [
    {
      '2006': 'beans.swf',
      directory: 'beans/beans.swf',
      fileRef: 'mammoth:games/beans.swf'
    }
  ],
  'Pizzatron 3000': [
    {
      date: '2007-02-26',
      directory: 'pizza/game.swf',
      fileRef: 'fix:Pizzatron3000-2007.swf',
      roomChanges: {
        pizza: 'recreation:pizza_2007.swf'
      }
    }
  ],
  'Ice Fishing': [
    {
      date: '2006-03-10',
      directory: 'fish/fish.swf',
      fileRef: 'mammoth:games/fish.swf',
      roomChanges: {
        lodge: 'mammoth:artwork/rooms/lodge11.swf'
      }
    }
  ],
  'Hydro Hopper': [
    {
      directory: 'bbiscuit/bbiscuit.swf',
      fileRef: 'mammoth:games/biscuit.swf'
    }
  ],
  'Puffle Roundup': [
    {
      date: '2005-12-14',
      fileRef: 'mammoth:games/puffle.swf',
      directory: 'roundup/roundup.swf',
      roomChanges: {
        forts: 'fix:ArtworkRoomsForts3.swf'
      }
    }
  ],
  'Cart Surfer': [
    {
      date: '2006-06-06',
      fileRef: 'fix:CartSurfer2006.swf',
      directory: 'mine/mine.swf',
      '2006': 'mine.swf'
    }
  ],
  'Catchin\' Waves': [
    {
      date: '2007-06-04',
      fileRef: 'archives:CatchinWavesGame.swf',
      directory: 'waves/game.swf'
    }
  ]
};