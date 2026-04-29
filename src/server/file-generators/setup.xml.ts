import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { RoomName, ROOMS } from "../game-data/rooms";

type OldRoom = {
  roomName: RoomName
  name: string,
  file: string
  music?: number,
  frame?: number
};

function getFileName(chat: number, content: string): string {
  return chat === 339 ? content : `<File>${content}</File>`
}

function getCatalog(header: string, chat: number, content: string): string {
  return `<${header}>${getFileName(chat, content)}</${header}>`;
}

function patchMusic(rooms: OldRoom[], music: Map<RoomName, number>) {
  for (const room of rooms) {
    const musicId = music.get(room.roomName);
    if (musicId !== undefined) {
      room.music = musicId;
    }
  }
}

function patchFrame(rooms: OldRoom[], frames: Map<RoomName, number>) {
  for (const room of rooms) {
    const frameId = frames.get(room.roomName);
    if (frameId !== undefined) {
      room.frame = frameId;
    }
  }
}

export function getSetupXml(d: GameData, s: SettingsManager) {
  const news = d.getIssue();
  // const news = findInVersion(version, newspaperTimeline);

  const rooms: OldRoom[] = Object.entries(ROOMS).filter((pair) => {
    return pair[1].preCpipName !== null;
  }).map((pair) => {
    const [ name, info ] = pair;
    return {
      roomName: name as RoomName,
      name: info.preCpipName ?? '',
      file: name
    }
  });

  patchMusic(rooms, d.getRoomsMusic());
  patchFrame(rooms, d.getRoomsFrame());

  const chat = d.getChatVersion();

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
        <IP>${s.targetIP}</IP>
        <Port>${s.worldPort}</Port>
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
      <Four>
         <File>four</File>
         <Music>0</Music>
         <Frame>1</Frame>
      </Four>
      <Mine>
        <File>mine</File>
        <Music>105</Music>
        <Frame>1</Frame>
      </Mine>
   </Games>

   <Catalogues>
      <Clothing>${getFileName(chat, 'clothing')}</Clothing>
      <Furntiture>${getFileName(chat, 'furniture')}</Furntiture>
      <Igloo>${getFileName(chat, 'igloo_')}</Igloo>
      ${getCatalog(chat === 339 ? 'Adopt' : 'Pets', chat, 'adopt_')}
      ${getCatalog(chat === 339 ? 'Pets' : 'Pets2', chat, 'pets_')}
      <Cards>cards</Cards>
   </Catalogues>

   <Edit>6</Edit>

   <Igloo>${d.getIglooVersion()}</Igloo>

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