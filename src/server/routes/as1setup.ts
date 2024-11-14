import { GameVersion } from "../settings";

type As1Room = {
  name: string,
  file: string
  music?: number,
};

function patchMusic(rooms: As1Room[], music: Record<string, number>) {
  for (const room of rooms) {
    if (music[room.name] !== undefined) {
      room.music = music[room.name]
    }
  }
}

export function getSetupXml(version: GameVersion) {
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

  if (version === '2005-Dec-22') {
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

  if (version === '2006-Jan-27') {
    patchMusic(rooms, {
      'Dock': 10,
      'Forts': 11
    })
  }

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
            <Frame>1</Frame>
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
         <File>clothing0604</File>
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
      <File>news25</File>
   </News>

   <Penguin>penguin</Penguin>

   <screenWidth>760</screenWidth>
   <screenHeight>480</screenHeight>

   <Version>1</Version>

</setup>
  `
}