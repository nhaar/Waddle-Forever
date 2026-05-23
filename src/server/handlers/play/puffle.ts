import { WorldContext } from "@server/socket-server/world/world";
import { XtHandler } from "../xt";
import { PenguinMessenger } from "../messenger";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";
import { GameData } from "@server/timelines/game-data";
import { PUFFLES } from "@server/game-logic/puffle";

const handler = new XtHandler<WorldContext, ['data', 'penguin', 'msg']>(['data', 'penguin', 'msg']);

// seemingly the format in which client usually wants the puffle IDs
export function getClientPuffleIds(puffleId: number) {
  const parentId = PUFFLES.get(puffleId)?.parentId;
  if (parentId === undefined) {
    return [puffleId, ''];
  } else {
    return [parentId, puffleId];
  }
}

export function getStamp(data: GameData, msg: PenguinMessenger, p: WorldPenguin, stamp: number) {
  if (data.isStampAvailable(stamp)) {
    p.stampbook.add(stamp);
    msg.send(p, 'aabs', stamp);
  }
}

// get puffles in igloo
handler.xt('s', 'p#pg', ['number', 'string'], ({ data, penguin, msg }, id, iglooType) => {
  if (!data.isVanillaEngine()) {
    const puffles = penguin.puffle.puffles.map((puffle) => {
      return [
        puffle.id,
        puffle.name,
        puffle.type,
        puffle.clean,
        puffle.food,
        puffle.rest,
        100,
        100,
        100,
        0,
        0,
        0,
        puffle.id === penguin.puffle.walking ? 1 : 0
      ].join('|')
    })
  
    if (puffles.length >= 16) {
      // PUFFLE OWNER
      getStamp(data, msg, penguin, 21);
    }
  
    msg.send(penguin, 'pg', ...puffles);
  } else {
    const isBackyard = iglooType === 'backyard';
    const puffles = penguin.puffle.puffles.filter((puffle) => {
      // filtering for backyard or igloo puffles
      return penguin.puffle.isInBackyard(puffle.id) === isBackyard;
    }).map((puffle) => {
      return [
        puffle.id,
        ...getClientPuffleIds(puffle.type),
        puffle.name,
        Math.round(Date.now()), // TODO puffle adoption date in puffle
        puffle.food,
        100, // TODO puffle play
        puffle.rest,
        puffle.clean,
        0, // TODO puffle hat
        0, 0, // TODO what are these 0?
        puffle.id === penguin.puffle.walking ? 1 : 0
      ].join('|')
    })
    msg.send(penguin, 'pg', puffles.length, ...puffles);
  }
})

export {
  handler as puffleHandler
};