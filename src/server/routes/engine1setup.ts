import { findIndexLeftOf } from "../../common/utils";
import { OLD_CATALOGUES } from "../game/catalogues";
import { FAN_ISSUE, OLD_NEWSPAPERS } from "../game/newspapers";
import { GameVersion } from "../settings";
import { processVersion, inInterval, isGreaterOrEqual, Version } from "./versions";

type Engine1Room = {
  name: string,
  file: string
  music?: number,
  frame?: number
};

function patchMusic(rooms: Engine1Room[], music: Record<string, number>) {
  for (const room of rooms) {
    if (music[room.name] !== undefined) {
      room.music = music[room.name]
    }
  }
}

function patchFrame(rooms: Engine1Room[], frames: Record<string, number>) {
  for (const room of rooms) {
    if (frames[room.name] !== undefined) {
      room.frame = frames[room.name]
    }
  }
}

/**
 * Get clothing filename based on release of the  catalogue
 * 
 * Clothing filenames looked like 0508 (2005-August)
 * */
function getClothing(releaseVersion: Version) : string {
  const decomposed = processVersion(releaseVersion);
  if (decomposed === undefined) {
    throw new Error(`Invalid version: ${releaseVersion}`);
  }
  const [year, month] = decomposed;
  // the last 2 numbers of year, and month with a 0 on front if needed
  return `${String(year).slice(2)}${String(month).padStart(2, '0')}`;
}

export function getSetupXml(version: GameVersion) {
  let news: string | Number;
  if (version === FAN_ISSUE.date) {
    news = FAN_ISSUE.name;
  } else {
    const index = findIndexLeftOf(version, OLD_NEWSPAPERS, (version, newspapers, index) => isGreaterOrEqual(version, newspapers[index]));
    news = index + 1;
  }

  const rooms: Engine1Room[] = [
    {
      name: 'Town',
      file: 'town10'
    },
    {
      name: 'Coffee',
      file: 'coffee11',
      music: 1,
    },
    {
      name: 'Book',
      file: 'book11'
    },
    {
      name: 'Dance',
      file: 'dance10',
      music: 2
    },
    {
      name: 'Lounge',
      file: 'lounge10'
    },
    {
      name: 'Shop',
      file: 'shop10'
    },
    {
      name: 'Village',
      file: 'village11'
    },
    {
      name: 'Sport',
      file: 'sport11'
    },
    {
      name: 'Lodge',
      file: 'lodge11'
    },
    {
      name: 'Mtn',
      file: 'mtn10'
    },
    {
      name: 'Plaza',
      file: 'plaza12'
    },
    {
      name: 'Pet',
      file: 'pet11'
    },
    {
      name: 'Dojo',
      file: 'dojo10'
    },
    {
      name: 'Pizza',
      file: 'pizza12',
      music: 20
    },
    {
      name: 'Dock',
      file: 'dock11'
    },
    {
      name: 'Forts',
      file: 'forts12'
    },
    {
      name: 'Rink',
      file: 'rink10'
    },
    {
      name: 'Agent',
      file: 'agent11'
    },
    {
      name: 'Berg',
      file: 'berg10'
    }
  ]

  if (inInterval(version, '2005-Dec-22', '2005-Dec-26')) {
    patchMusic(rooms, {
      'Town': 200,
      'Coffee': 200,
      'Dance': 200,
      'Shop': 200,
      'Village': 200,
      'Lodge': 200,
      'Rink': 200
    })
  }

  if (inInterval(version, '2006-Feb-24', '2006-Feb-28')) {
    patchFrame(rooms, {
      'Town': 2
    })
  }

  if (inInterval(version, '2006-Mar-31', '2006-Apr-03')) {
    patchMusic(rooms, {
      'Dance': 201,
      'Forts': 201,
      'Rink': 201,
      'Town': 201,
      'Plaza': 201
    })

    patchFrame(rooms, {
      'Plaza': 3
    })
  }

  const clothingIndex = findIndexLeftOf(version, OLD_CATALOGUES, (date, catalogues, i) => isGreaterOrEqual(date, catalogues[i]));
  const clothing = getClothing(OLD_CATALOGUES[clothingIndex]);

  const servers = [
    'Blizzard',
    'Slushy',
    'Ice Berg',
    'Flurry',
    'White Out',
    'Snow Angel',
    'Snow Day',
    'Frostbite',
    'Icicle',
    'Tundra',
    'Snow Cone',
    'Alpine',
    'North Pole',
    'Glacier',
    'Aurora',
    'Deep Freeze',
    'Frozen',
    'Cold Front',
    'Snow Flake',
    'Frosty',
    'South Pole',
    'Big Surf'
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>

<setup>

   <Worlds>
      ${servers.map((server) => {
        server = server.replace(' ', ''); // it doesn't like spaces
        return `
      <${server}>
        <IP>localhost</IP>
        <Port>6114</Port>
        <Zone>w1</Zone>
      </${server}>
        `
      }).join('')}
   </Worlds>

   <Rooms>
      ${rooms.map((room) => {
        return `
        <${room.name}>
            <File>${room.file}</File>
            <Music>${room.music ?? 0}</Music>
            <Frame>${room.frame ?? 1}</Frame>
        </${room.name}>
        `
      }).join('')}
   </Rooms>
  
   <Games>
      <Astro>
         <File>astro</File>
         <Music>0</Music>
         <Frame>1</Frame>
      </Astro>
      <Beans>
         <File>beans</File>
         <Music>101</Music>
         <Frame>1</Frame>
      </Beans>
      <Puffle>
         <File>puffle</File>
         <Music>102</Music>
         <Frame>1</Frame>
      </Puffle>
      <Biscuit>
         <File>biscuit</File>
         <Music>100</Music>
         <Frame>1</Frame>
      </Biscuit>
      <Fish>
         <File>fish</File>
         <Music>103</Music>
         <Frame>1</Frame>
      </Fish>
      <Sled>
         <File>sled</File>
         <Music>0</Music>
         <Frame>1</Frame>
      </Sled>
      <Mancala>
         <File>mancala</File>
         <Music>0</Music>
         <Frame>1</Frame>
      </Mancala>
   </Games>

   <Catalogues>
      <Clothing>
         <File>clothing${clothing}</File>
      </Clothing>
      <Furntiture>
         <File>furniture0603</File>
      </Furntiture>
      <Igloo>
         <File>igloo0604</File>
      </Igloo>
      <Pets>
         <File>adopt0703</File>
      </Pets>
   </Catalogues>

   <Edit>6</Edit>

   <Igloo>20</Igloo>

   <Join>11</Join>

   <isSoundOn>true</isSoundOn>

   <Maps>
      <Island>5</Island>
   </Maps>

   <News>
      <File>news${news}</File>
   </News>

   <Penguin>penguin</Penguin>

   <screenWidth>760</screenWidth>
   <screenHeight>480</screenHeight>

   <Version>1</Version>

</setup>
  `
}