import { GameVersion } from "../settings";
import { findProperInterval, inInterval } from "./versions";

type As1Room = {
  name: string,
  file: string
  music?: number,
  frame?: number
};

function patchMusic(rooms: As1Room[], music: Record<string, number>) {
  for (const room of rooms) {
    if (music[room.name] !== undefined) {
      room.music = music[room.name]
    }
  }
}

function patchFrame(rooms: As1Room[], frames: Record<string, number>) {
  for (const room of rooms) {
    if (frames[room.name] !== undefined) {
      room.frame = frames[room.name]
    }
  }
}

export function getSetupXml(version: GameVersion) {
  let news = findProperInterval<string | number>(version, [
    ['2005-Oct-24', 1],
    ['2005-Oct-28', 'fan'],
    ['2005-Nov-03', 2],
    ['2005-Nov-08', 3],
    ['2005-Nov-11', 4],
    ['2005-Nov-16', 5],
    ['2005-Nov-21', 6],
    ['2005-Dec-01', 7],
    ['2005-Dec-08', 8],
    ['2005-Dec-15', 9],
    ['2005-Dec-22', 10],
    ['2005-Dec-29', 11],
    ['2006-Jan-05', 12],
    ['2006-Jan-12', 13],
    ['2006-Jan-19', 14],
    ['2006-Jan-26', 15],
    ['2006-Feb-02', 16],
    ['2006-Feb-09', 17],
    ['2006-Feb-16', 18],
    ['2006-Feb-23', 19],
    ['2006-Mar-02', 20],
    ['2006-Mar-09', 21],
    ['2006-Mar-16', 22],
    ['2006-Mar-23', 23],
    ['2006-Mar-30', 24],
    ['2006-Apr-06', 25],
    ['2006-Apr-13', 26]
  ])

  const rooms: As1Room[] = [
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

  const clothing = findProperInterval<string>(version, [
    ['2005-Aug-22', '0508'],
    ['2005-Sep-21', '0509'],
    ['2005-Oct-24', '0510'],
    ['2005-Nov-01', '0511'],
    ['2005-Dec-01', '0512'],
    ['2006-Jan-01', '0601'],
    ['2006-Feb-03', '0602'],
    ['2006-Mar-03', '0603'],
    ['2006-Apr-07', '0604']
  ])

  return `<?xml version="1.0" encoding="UTF-8"?>

<setup>

   <Worlds>
      <Blizzard>
         <IP>localhost</IP>
         <Port>6114</Port>
         <Zone>w1</Zone>
      </Blizzard>
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