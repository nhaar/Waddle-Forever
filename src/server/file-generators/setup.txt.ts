import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { RoomName, ROOMS } from "../game-data/rooms";

/** Handles setup.txt, from the Pre-CPIP rewrite */
export function getSetupTxt(d: GameData, s: SettingsManager): string {
  const roomMusic = d.getRoomsMusic();
  const frames = d.getRoomsFrame();


  const activeMigrator = d.getMigrator();

  // enabling scavenger hunt, by passing an ID you can choose a file. Right now we are always just
  // sending the ID of 1 because we don't have any information about these scavenger hunts
  const eggId = d.getEgg();

  const rooms = Object.entries(ROOMS).map((pair) => {
    const [room, info] = pair;
    const music = roomMusic.get(room as RoomName) ?? 0;
    const frame = frames.get(room as RoomName) ?? 1;
    return `&r${info.id}=|${frame}|${music}&`
  }).join('\n');

  return `&v=1&

&paper=86&
&penguin=16&
&puffle=&
&igloo=${d.getIglooVersion()}&
&basic=3&
&map=16_forest&
&phone=2&
&telescope=0&
&binoculars=1&
&missions=&
&journal=&
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
&sport=&
&hair=0710&
&furniture=&
&upgrade=&
&adopt=&
&pets=&
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

&ip=${s.targetIP}&
&port=${s.worldPort}&` // IP and port are custom, need to mod chat.swf. Only way to make this work in WF
}