import { findInVersion, VersionsTimeline } from "../game-data";
import { RoomName, ROOMS } from "../game-data/rooms";
import { Update } from "../game-data/updates";
import { START_DATE } from "../timelines/dates";
import { getRoomFrameTimeline } from "../timelines/frame";
import { IGLOO_VERSION_TIMELINE } from "../timelines/igloo-version";
import { getMusicTimeline } from "../timelines/music";
import { NEWSPAPER_TIMELINE, FAN_ISSUE_DATE } from "../timelines/newspapers";
import { Version } from "./versions";

const musicTimeline = getMusicTimeline();

const frameTimeline = getRoomFrameTimeline();

type OldRoom = {
  roomName: RoomName
  name: string,
  file: string
  music?: number,
  frame?: number
};

function getNewspapersTimeline() {
  // info is the issue ID ('fan' or number)
  const timeline = new VersionsTimeline<string>();
  NEWSPAPER_TIMELINE.forEach((news, i) => {
    const date = typeof news === 'string' ? news : news.date;
    timeline.add({
      date,
      info: String(i + 1)
    });
  })
  timeline.add({
    date: FAN_ISSUE_DATE,
    info: 'fan'
  });
  timeline.add({
    date: START_DATE,
    info: 'beta'
  });
  return timeline.getVersions();
}

const newspaperTimeline = getNewspapersTimeline();

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

export function getSetupXml(version: Version, ip: string, port: number) {
  const news = findInVersion(version, newspaperTimeline);

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

  musicTimeline.forEach((versions, room) => {
    patchMusic(rooms, { [room]: findInVersion(version, versions) });
  });

  frameTimeline.forEach((versions, room) => {
    patchFrame(rooms, { [room]: findInVersion(version, versions) });
  });

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
        <IP>${ip}</IP>
        <Port>${port}</Port>
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
      <Mine>
        <File>mine</File>
        <Music>105</Music>
        <Frame>1</Frame>
      </Mine>
   </Games>

   <Catalogues>
      <Clothing>
          <File>clothing</File>
      </Clothing>
      <Furntiture>
         <File>furniture</File>
      </Furntiture>
      <Igloo>
         <File>igloo0604</File>
      </Igloo>
      <Pets>
         <File>adopt0703</File>
      </Pets>
   </Catalogues>

   <Edit>6</Edit>

   <Igloo>${findInVersion(version, IGLOO_VERSION_TIMELINE)}</Igloo>

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