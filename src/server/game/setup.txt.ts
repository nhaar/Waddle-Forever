import { RoomName, ROOMS } from "../data/rooms";
import { findCurrentParty } from "../routes/client-files";
import { Version } from "../routes/versions";

/** Handles setup.txt, from the Pre-CPIP rewrite */
export function getSetupTxt(date: Version): string {
  let roomMusic: Partial<Record<RoomName, number>> = {};
  Object.entries(ROOMS).forEach((pair) => {
    const [room, info] = pair;
    if (info.preCpipSong !== undefined) {
      roomMusic[room as RoomName] = info.preCpipSong;
    }
  });

  let frames: Partial<Record<RoomName, number>> = {};
  
  const currentParty = findCurrentParty(date);
  if (currentParty !== null) {
    roomMusic = { ...roomMusic, ...currentParty.music };
    frames = { ...frames, ...currentParty.roomFrames };
  
    if (currentParty.updates !== null) {
      currentParty.updates?.forEach((update) => {
        frames = { ...frames, ...update.roomFrames };
      })
    }
  }

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
&igloo=73&
&basic=3&
&map=16_forest&
&phone=2&
&telescope=0&
&binoculars=1&
&missions=4&
&journal=11&
&crumbs=21&
&interface=41&
&errors=4&
&join=14&
&edit=9&
&library=6&
&script=2&
&music=1&

&agentform=1&
&newsform=2&

&clothing=0708&
&sport=0711&
&hair=0710&
&furniture=0712&
&upgrade=0712&
&adopt=0711&
&pets=0711&
&fish=0703&
&cards=0712&
&pirate=0&
&costume=0712&

&ship=0&
&eggs=0&
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

&e=0&`
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