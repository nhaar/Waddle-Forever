import { Version } from "../routes/versions";
import { ICE_FISHING_RELEASE, PUFFLE_ROUNDUP_RELEASE, THIN_ICE_RELEASE } from "./updates";

type GameRelease = {
  date?: Version
}

type PreCpipGameRelease = GameRelease & {
  '2006'?: string;
  directory: string;
  fileId: number;
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
      fileId: 5088
    }
  ],
  'Astro Barrier': [
    {
      '2006': 'astro.swf',
      directory: 'astro/astro.swf',
      fileId: 19
    }
  ],
  'Bean Counters': [
    {
      '2006': 'beans.swf',
      directory: 'beans/beans.swf',
      fileId: 20
    }
  ],
  'Pizzatron 3000': [
    {
      date: '2007-02-26',
      directory: 'pizza/game.swf',
      fileId: 5089
    }
  ],
  'Ice Fishing': [
    {
      date: ICE_FISHING_RELEASE,
      directory: 'fish/fish.swf',
      fileId: 22
    }
  ],
  'Hydro Hopper': [
    {
      directory: 'bbiscuit/bbiscuit.swf',
      fileId: 21
    }
  ],
  'Puffle Roundup': [
    {
      date: PUFFLE_ROUNDUP_RELEASE,
      fileId: 23,
      directory: 'roundup/roundup.swf'
    }
  ]
};