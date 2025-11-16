import fs from 'fs';
import path from 'path';
import { HTTP_PORT } from '../../common/constants';

export const WORLD_DELTA = 2;

export const LOGIN_DELTA = 1;

export const WORLD_PORT = HTTP_PORT + WORLD_DELTA;

export const LOGIN_PORT = HTTP_PORT + LOGIN_DELTA;

export function getServerPopulation(): number {
  const seed = Math.random()
  if (seed < 0.1) {
    return 1
  } else if (seed < 0.2) {
    return 2
  } else if (seed < 0.3) {
    return 3
  } else if (seed < 0.6) {
    return 4
  } else if (seed < 0.8) {
    return 5
  } else {
    return 6
  }
}

type PenguinServer = {
  name: string
  id: number
}

type ServerLang = 'en' | 'pt' | 'fr' | 'es'

type LanguageServer = Array<{
  servers: string[],
  lang: ServerLang
}>

type LanguageServerID = Array<{
  servers: Array<{ name: string, id: number }>,
  lang: ServerLang
}>

const Languages: LanguageServer = [
  { lang: 'en', servers: [
    'Blizzard',
    'Ice Berg',
    'White Out',
    'Slushy',
    'Flurry',
    'Snow Angel',
    'Snow Day',
    'Frostbite',
    'Icicle',
    'Tundra',
    'Snow Cone',
    'Alpine',
    'Ice Breaker',
    'Snow Globe',
    'Snow Fort',
    'Mammoth',
    'Grizzly',
    'Winter Land',
    'Freezer',
    'Avalanche',
    'Powder Ball',
    'Summit',
    'Flippers',
    'Yeti',
    'Sub Zero',
    'Ice Cold',
    'Crystal',
    'Snow Bank',
    'Ice Palace',
    'Tuxedo',
    'Abominable',
    'Half Pipe',
    'Snow Board',
    'Alaska',
    'Thermal',
    'Toboggan',
    'Husky',
    'Snow Plow',
    'Ice Age',
    'Sabertooth',
    'Parka',
    'Hibernate',
    'Sleet',
    'Vanilla',
    'Christmas',
    'Klondike',
    'Icebound',
    'White House',
    'Fjord',
    'Big Foot',
    'Rocky Road',
    'Rainbow',
    'Arctic',
    'Shiver',
    'Matterhorn',
    'Bobsled',
    'Ice Box',
    'Bunny Hill',
    'Walrus',
    'Deep Snow',
    'Snowmobile',
    'Northern Lights',
    'Southern Lights',
    'Ice Shelf',
    'Ascent',
    'Snowcap',
    'Hockey',
    'Jack Frost',
    'Oyster',
    'Pine Needles',
    'Hypothermia',
    'Zipline',
    'North Pole',
    'Glacier',
    'Aurora',
    'Mukluk',
    'Great White',
    'Snow Shoe',
    'Yukon',
    'Polar Bear',
    'Chinook',
    'Wool Socks',
    'Snowbound',
    'Ice Pond',
    'Snowfall',
    'Caribou',
    'Deep Freeze',
    'Cold Front',
    'Frozen',
    'Snow Flake',
    'Frosty',
    'Snow Drift',
    'Mittens',
    'Breeze',
    'Crunch',
    'Wind Chill',
    'Iceland',
    'Belly Slide',
    'Sherbet',
    'South Pole',
    'Big Surf',
    'Sasquatch',
    'Kosciuszko',
    'Down Under',
    'Beanie',
    'Outback',
    'Snowy River',
    'Big Snow',
    'Brumby',
    'Cold Snap',
    'Permafrost',
    'Below Zero',
    'Snow Ball',
    'Ice Pack',
    'Ice Cream',
    'Bubblegum',
    'Altitude',
    'Canoe',
    'Ice Rink',
    'Ice Cave',
    'Boots',
    'Ice Cube',
    'Bonza',
    'Polar',
    'Dry Ice',
    'Snow Covered',
    'Glacial',
    'Pantagonia',
    'Antarctic',
    'Downhill',
    'Elevation',
    'Tea',
    'Misty',
    'Adventure',
    'Beanbag',
    'Cream Soda',
    'Fiesta',
    'Grasshopper',
    'Hot Chocolate',
    'Jackhammer',
    'Migrator',
    'Mullet',
    'Puddle',
    'Sardine',
    'Skates',
    'Berg',
    'Cozy',
    'Sparkle',
    'Slippers',
    'Mountain',
    'Cabin',
    'Fog',
    'Cloudy',
    'Sled'
  ] },
  { lang: 'pt', servers: [
    'Avalanche'
  ] },
  { lang: 'fr', servers: [
    'Yeti'
  ] },
  { lang: 'es', servers: [
    'Glaciar'
  ] }
]

let i = 0;
const locales: LanguageServerID = Languages.map((locale) => {
  return {
    lang: locale.lang,
    servers: locale.servers.map((name) => {
      const id = 3000 + i
      i++
      return { name, id }
    })
  }
})

const serverList: PenguinServer[] = locales.reduce<PenguinServer[]>((accumulator, currentValue) => {
  return [ ...accumulator, ...currentValue.servers]
}, [])

export function getServersXml(ip: string, loginPort: number, worldPort: number): string {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<servers>
   <environment name="live">
      <login address="${ip}" port="${loginPort}" />
      <redemption address="${ip}" port="${worldPort}" />
      ${locales.map((locale) => {
        return `
          <language locale="${locale.lang}">
            ${locale.servers.map((server) => {
              return `<server id="${server.id}" name="${server.name}" safe="false" address="${ip}" port="${worldPort}" />`
            }).join('\n')}
          </language>
        `;
      }).join('')}
    </environment>
</servers>
`
}

export default serverList;
