import { findIndexLeftOf } from "../../common/utils";
import { PRE_CPIP_CATALOGS } from "../data/catalogues";
import { FAN_ISSUE_DATE, AS2_NEWSPAPERS, PRE_BOILER_ROOM_PAPERS } from "../data/newspapers";
import { RoomName, ROOMS } from "../data/rooms";
import { CHAT_339, FIRST_BOILER_ROOM_PAPER } from "../data/updates";
import { findCurrentParty, findEarliestDateHitIndex, getFileDateSignature, getMusicForDate, getPinFrames } from "./client-files";
import { isGreaterOrEqual, Version, isLower } from "./versions";

type OldRoom = {
  roomName: RoomName
  name: string,
  file: string
  music?: number,
  frame?: number
};

function patchMusic(rooms: OldRoom[], music: Partial<Record<RoomName, number>>) {
  for (const room of rooms) {
    const musicId = music[room.roomName];
    if (musicId !== undefined) {
      room.music = musicId;
    }
  }
}

function patchFrame(rooms: OldRoom[], frames: Partial<Record<RoomName, number>>) {
  for (const room of rooms) {
    const frameId = frames[room.roomName];
    if (frameId !== undefined) {
      room.frame = frameId;
    }
  }
}

/**
 * Get clothing filename
 * 
 * Clothing filenames looked like 0508 (2005-August)
 * */
export function getClothingFileName(date: Version): string {
  let latest = '';
  for (const catalogRelease in PRE_CPIP_CATALOGS) {
    if (isLower(date, catalogRelease)) {
      break;
    }
    latest = catalogRelease;
  }
  if (latest === '') {
    return latest;
  }


  return getFileDateSignature(latest);
}

function getFileName(name: string, date: Version): string {
  // the way the client reads this XML changed
  if (isLower(date, CHAT_339)) {
    return `<File>${name}</File>`;
  } else {
    return name;
  }
}

export function getSetupXml(version: Version) {
  let news: string | Number;
  // this has to be fixed at some point, it's not accounting for everything
  if (version === FAN_ISSUE_DATE) {
    news = 'fan';
  } else {
    if (isLower(version, FIRST_BOILER_ROOM_PAPER)) {
      const index = findIndexLeftOf(version, PRE_BOILER_ROOM_PAPERS, (version, newspapers, index) => isGreaterOrEqual(version, newspapers[index]));
      news = index + 1;
    } else {
      const findIndex = findEarliestDateHitIndex(version, AS2_NEWSPAPERS);
      news = findIndex + 1 + PRE_BOILER_ROOM_PAPERS.length;
    }
  }

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

  const baseMusic = getMusicForDate(version);
  patchMusic(rooms, baseMusic);

  // pin related frame change
  // should be before party, as party has priority
  const pinFrame = getPinFrames(version);
  if (pinFrame !== null) {
    const [room, frame] = pinFrame;
    patchFrame(rooms, { [room]: frame });
  }

  const currentParty = findCurrentParty(version);
  if (currentParty !== null) {
    if (currentParty.music !== undefined) {
      patchMusic(rooms, currentParty.music);
    }
    if (currentParty.roomFrames !== undefined) {
      patchFrame(rooms, currentParty.roomFrames);
    }
  }

  const clothing = getClothingFileName(version);

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
      <Clothing>${getFileName('clothing' + clothing, version)}</Clothing>
      <Furniture>
         <File>furniture0603</File>
      </Furniture>
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