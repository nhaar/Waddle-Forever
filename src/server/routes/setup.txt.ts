import { findInVersion, VersionsTimeline } from "../game-data";
import { RoomName, ROOMS } from "../game-data/rooms";
import { START_DATE } from "../timelines/dates";
import { ROOM_FRAME_TIMELINE } from "../timelines/frame";
import { IGLOO_VERSION_TIMELINE } from "../timelines/igloo-version";
import { MIGRATOR_TIMELINE } from "../timelines/migrator";
import { MUSIC_TIMELINE } from "../timelines/music";
import { UPDATES } from "../updates/updates";
import { Version } from "./versions";

const eggTimeline = getEggTimeline();

function getEggTimeline() {
  const timeline = new VersionsTimeline<number>();
  timeline.add({
    date: START_DATE,
    info: 0
  });
  UPDATES.forEach(update => {
    if (update.update.scavengerHunt2007 !== undefined && update.end !== undefined) {
      timeline.add({
        date: update.date,
        end: update.end,
        info : 1
      });
    }
  });

  return timeline.getVersions();
}

/** Handles setup.txt, from the Pre-CPIP rewrite */
export function getSetupTxt(date: Version, ip: string, port: number): string {
  let roomMusic: Partial<Record<RoomName, number>> = {};

  let frames: Partial<Record<RoomName, number>> = {};

  MUSIC_TIMELINE.forEach((versions, room) => {
    roomMusic[room] = findInVersion(date, versions);
  });
  ROOM_FRAME_TIMELINE.forEach((versions, room) => {
    frames[room] = findInVersion(date, versions);
  });

  const activeMigrator = findInVersion(date, MIGRATOR_TIMELINE);

  // enabling scavenger hunt, by passing an ID you can choose a file. Right now we are always just
  // sending the ID of 1 because we don't have any information about these scavenger hunts
  const eggId = findInVersion(date, eggTimeline);

  const rooms = Object.entries(ROOMS).map((pair) => {
    const [room, info] = pair;
    const music = roomMusic[room as RoomName] ?? 0;
    const frame = frames[room as RoomName] ?? 1;
    return `&r${info.id}=|${frame}|${music}&`
  }).join('\n');

  return `&v=1&

&paper=86&
&penguin=16&
&puffle=2&
&igloo=${findInVersion(date, IGLOO_VERSION_TIMELINE)}&
&basic=3&
&map=16_forest&
&phone=2&
&telescope=0&
&binoculars=1&
&missions=&
&journal=11&
&crumbs=21&
&interface=&
&errors=4&
&join=14&
&edit=9&
&library=6&
&script=2&
&music=1&

&agentform=1&
&newsform=2&

&clothing=&
&sport=0711&
&hair=0710&
&furniture=&
&upgrade=&
&adopt=0711&
&pets=0711&
&fish=0703&
&cards=0712&
&pirate=0&
&costume=0712&

&ship=${Number(activeMigrator)}&
&eggs=${eggId}&
&maxcards=50&

${rooms}

&g1=&
&g2=&
&g3=&
&g4=&
&g5=&
&g6=&
&g7=&
&g8=&
&g9=&
&g10=&
&g11=&
&g12=&
&g13=&

&q1=&
&q2=&
&q3=&
&q4=&
&q5=&

&e=0&

&ip=${ip}&
&port=${port}&` // IP and port are custom, need to mod chat.swf. Only way to make this work in WF
}

/**&r100=|1|0&
&r110=|1|1|&
&r111=|1|1&
&r120=|1|5&
&r121=|1|6&
&r130=|1|0&
&r200=|1|0&
&r210=|2|0&
&r220=|1|0&
&r221=|1|0&
&r230=|1|0&
&r300=|1|0&
&r310=|1|0&
&r320=|1|0&
&r330=|1|20&
&r340=|1|31&
&r400=|1|0&
&r410=|1|221&
&r411=|1|0&
&r420=|1|0&
&r421=|1|0&
&r800=|1|0&
&r801=|1|0&
&r802=|1|0&
&r803=|1|7&
&r804=|1|6&
&r805=|1|0&
&r806=|1|0&
&r807=|1|0&
&r808=|1|0&
&r809=|1|0&
&r810=|1|0& */