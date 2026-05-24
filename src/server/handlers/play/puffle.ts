import { WorldContext } from "@server/socket-server/world/world";
import { XtHandler } from "../xt";
import { PenguinMessenger } from "../messenger";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";
import { GameData } from "@server/timelines/game-data";
import { PUFFLES } from "@server/game-logic/puffle";
import { JoinHandler } from "./join";
import { PlayerPuffle } from "@server/database/database";

const handler = new XtHandler<WorldContext, ['data', 'penguin', 'msg', 'world', 'prst', 'db']>(['data', 'penguin', 'msg', 'world', 'prst', 'db']);

const BASE_CARE_INVENTORY = [1, 8, 37];

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

function getPuffleString(puffle: PlayerPuffle): string {
  return [
    puffle.id,
    puffle.name,
    puffle.type,
    100,
    100,
    100,
    100,
    100,
    100
  ].join('|')
}

const sendModernPuffleCheck: JoinHandler<[string]> = ({ msg, penguin }, name) => {
  msg.send(penguin, 'checkpufflename', name, 1);
}

const sendPuffleCheck: JoinHandler<[string]> = ({ msg, penguin }, name) => {
  msg.send(penguin, 'pcn', name, 1);
}

enum PuffleCategory {
  Normal,
  Rainbow,
  Gold,
  Creature
};

const sendBuyPuffleItem: JoinHandler<[number, number, number]> = ({ msg, penguin }, itemId, cost, amount) => {
  const owned = penguin.puffle.addItem(itemId, amount);
  msg.send(penguin, 'papi', penguin.currency.discount(cost * amount), itemId, owned);
}

const handleAdoptPuffle: JoinHandler<[number, string, number]> = (ctx, puffleType, puffleName, puffleSubtype) => {
  const { data, penguin, msg, prst } = ctx;
  
  const category = puffleSubtype > 0 ? PuffleCategory.Creature :
    { 10: PuffleCategory.Rainbow, 11: PuffleCategory.Gold }[puffleType] ?? PuffleCategory.Normal;

  const isFreeBrownPuffle = puffleType === 9 && data.isBrownPuffleFree();

  const cost =
    (isFreeBrownPuffle || category === PuffleCategory.Gold) ? 0 :
    (data.isVanillaEngine() && category !== PuffleCategory.Creature) ? 400 : 800;

  const puffleTypeId = puffleSubtype === 0 ? puffleType : puffleSubtype;
  const puffleInfo = PUFFLES.getStrict(puffleTypeId);

  // TODO -> add proper dates (as opposed to vanilla engine)
  if (data.isVanillaEngine()) {
    if (category === PuffleCategory.Rainbow) {
      // upon adopting a puffle, its progress resests meaning
      // you'd need to redo the quest for a new one
      penguin.rainbow.resetQuest();
    } else if (category === PuffleCategory.Gold) {
      penguin.gold.reset();
    } else if (category === PuffleCategory.Normal) {
      if (puffleInfo.favouriteToy === undefined) {
        throw new Error(`Non creature puffle did not have a favorite toy: ${puffleInfo}`);
      }
      sendBuyPuffleItem(ctx, 3, 0, 5);
      sendBuyPuffleItem(ctx, 79, 0, 1);
      sendBuyPuffleItem(ctx, puffleInfo.favouriteToy, 0, 1);
    }
  }

  const puffle = penguin.puffle.addPuffle(puffleName, puffleTypeId);
  const coins = penguin.currency.discount(cost);

  if (data.isVanillaEngine()) {
    msg.send(penguin, 'pn', coins, [
        puffle.id,
        ...getClientPuffleIds(puffleInfo.id),
        puffleInfo.name,
        Math.floor(Date.now() / 1000),
        100, 100, 100, 100, 0, 0 // TODO no clue what these number are
      ].join('|')
    );
  } else {
    msg.send(penguin, 'pn', coins, getPuffleString(puffle));
  }

  penguin.mail.receivePostcard(111, { details: puffleName });

  // TODO: this has two assumptions about how backyard reallocation worked. If possible it would be nice to verify them
  // assumption 1: if you have 10 puffles and adopt one, a backyward slot is immediately freed
  // even before the walking puffle is sent to the igloo
  // assumption 2: the puffle to be reallocated is chosen as the first puffle you've adopted that is not in the backyard
  const pufflesInIgloo = penguin.puffle.puffles.filter((puffle) => !penguin.puffle.isInBackyard(puffle.id));
  if (pufflesInIgloo.length > 10) {
    penguin.puffle.toBackyard(pufflesInIgloo[0].id);
  }

  prst(penguin);
  // TODO favorite item code in houdini?
  // TODO 'pgu' is necessary?
}

const handleGetPuffleInventory: JoinHandler<[]> = ({ msg, penguin }) => {
  msg.send(
    penguin, 'pgpi',
    ...BASE_CARE_INVENTORY.map((item) => `${item}|1`),
    ...penguin.puffle.getAllItems().map((entry) => `${entry[0]}|${entry[1]}`)
  );
}

const handlePuffleWalk: JoinHandler<[number, number]> = ({ msg, prst, penguin, room, data }, penguinPuffleId, walking) => {
  // TODO add puffle refusing to walk
  // TODO add removing puffle

  if (walking === 1) {
    penguin.puffle.walk(penguinPuffleId);
  } else {
    penguin.puffle.unwalk();
  }

  const penguins = room?.players ?? [penguin];

  if (data.isVanillaEngine()) {
    const playerPuffle = penguin.puffle.getPuffle(penguinPuffleId);
    if (playerPuffle !== undefined) {
      // TODO hat (last one)
      msg.send(penguin, 'pw', penguin.id, playerPuffle.id, ...getClientPuffleIds(playerPuffle.type), walking, 0);
    }
  } else {
    msg.send(penguins, 'pw', penguin.id, `${penguinPuffleId}||||||||||||${walking}`);
  }
  prst(penguin);
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
});

handler.xt('s', 'p#pn', ['number', 'string', 'number'], handleAdoptPuffle, {
  // without cooldown, this can be spammed in the modern client,
  // allowing a second puffle to be bought
  // It is unknown if the original had this issue so we are correcting it
  cooldown: 2000
});
handler.xt('s', 'p#pn', ['number', 'string'], (ctx, type, name) => handleAdoptPuffle(ctx, type, name, 0));
handler.xt('s', 'p#pgpi', [], handleGetPuffleInventory);
handler.xt('s', 'p#checkpufflename', ['string'], sendModernPuffleCheck);
handler.xt('s', 'p#pcn', ['string'], sendPuffleCheck);
handler.xt('s', 'p#pw', ['number', 'number'], handlePuffleWalk);

export {
  handler as puffleHandler
};