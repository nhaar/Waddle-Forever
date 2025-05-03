import { Version } from "../routes/versions";
import { ICE_FISHING_RELEASE, PUFFLE_ROUNDUP_RELEASE, THIN_ICE_RELEASE } from "./updates";

type GameRelease = {
  date?: Version
}

type PreCpipGameRelease = GameRelease & {
  '2006'?: string;
  directory: string;
  fileRef: string;
};

type GameUpdate = {

}

type GameName = 'Thin Ice' |
  'Astro Barrier' |
  'Bean Counters' |
  'Pizzatron 3000' |
  'Ice Fishing' |
  'Hydro Hopper' |
  'Puffle Roundup';

export const PRE_CPIP_GAME_UPDATES: Record<GameName, [PreCpipGameRelease, ...GameUpdate[]]> = {
  'Thin Ice': [
    {
      date: THIN_ICE_RELEASE,
      directory: 'thinice/game.swf',
      fileRef: 'archives:ThinIce.swf'
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
      fileRef: 'fix:Pizzatron3000-2007.swf'
    }
  ],
  'Ice Fishing': [
    {
      date: ICE_FISHING_RELEASE,
      directory: 'fish/fish.swf',
      fileRef: 'mammoth:games/fish.swf'
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
      date: PUFFLE_ROUNDUP_RELEASE,
      fileRef: 'mammoth:games/puffle.swf',
      directory: 'roundup/roundup.swf'
    }
  ]
};