import { PlayerPuffle } from "../../database";
import { Handler } from "..";
import { isAs2, isAs3 } from "../../../server/routes/versions";
import { PUFFLES } from "../../../server/game/puffle";

const handler = new Handler()

/** Brush, bath, sleep, basically functionalities disguised as items */
const BASE_CARE_INVENTORY = [1, 8, 37];

const getPuffleString = (puffle: PlayerPuffle): string => {
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

handler.xt('p#pn', (client, puffleType, puffleName) => {
  if (!isAs2(client.version)) {
    return;
  }
  const PUFFLE_COST = 800
  if (client.penguin.coins < PUFFLE_COST) {
    // TODO no coins error
  } else if (false) {
    // TODO too many puffles error
  }
  client.removeCoins(PUFFLE_COST)
  const puffle = client.addPuffle(Number(puffleType), puffleName);
  client.sendXt('pn', client.penguin.coins, getPuffleString(puffle));

  client.addPostcard(111, { details: puffleName });
  // TODO favorite item code in houdini?
  // TODO 'pgu' is necessary?
})

// seemingly the format in which client usually wants the puffle IDs
export function getClientPuffleIds(puffleId: number) {
  const parentId = PUFFLES.get(puffleId).parentId;
  if (parentId === undefined) {
    return [puffleId, ''];
  } else {
    return [parentId, puffleId];
  }
}

handler.xt('p#pn', (client, puffleType, puffleName, puffleSubType) => {
  if (!isAs3(client.version)) {
    return;
  }

  // TODO dynamic cost for eg creatures, changing to 800 for earlier times
  const PUFFLE_COST = 400;

  const puffleId = Number(puffleSubType === '0' ? puffleType : puffleSubType);
  const puffle = PUFFLES.get(puffleId);

  if (puffleType === '10') {
    // TODO rainbow puffle
  } else if (puffleType === '11') {
    // TODO gold puffle
  } else if (puffleSubType === '0') {
    client.addPuffleItem(3, 0, 5);
    client.addPuffleItem(79, 0, 1);
    client.addPuffleItem(puffle.favouriteToy, 0, 1);
  }

  client.removeCoins(PUFFLE_COST);
  const playerPuffle = client.addPuffle(puffleId, puffleName);

  client.sendXt('pn', client.penguin.coins, [
    playerPuffle.id,
    ...getClientPuffleIds(puffle.id),
    puffle.name,
    Math.floor(Date.now() / 1000),
    100, 100, 100, 100, 0, 0 // TODO no clue what these number are
  ].join('|'));
  client.addPostcard(111, { details: playerPuffle.name });

  // TODO: this has two assumptions about how backyard reallocation worked. If possible it would be nice to verify them
  // assumption 1: if you have 10 puffles and adopt one, a backyward slot is immediately freed
  // even before the walking puffle is sent to the igloo
  // assumption 2: the puffle to be reallocated is chosen as the first puffle you've adopted that is not in the backyard
  const pufflesInIgloo = client.penguin.puffles.filter((puffle) => client.penguin.backyard[puffle.id] !== 1);
  if (pufflesInIgloo.length > 10) {
    client.swapPuffleFromIglooAndBackyard(pufflesInIgloo[0].id, true);
  }
}, {
  cooldown: 2000
});

// get puffles in igloo
handler.xt('p#pg', (client, id, iglooType) => {
  if (isAs2(client.version)) {
    const puffles = client.penguin.puffles.map((puffle) => {
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
        puffle.id === client.walkingPuffle ? 1 : 0
      ].join('|')
    })
  
    if (puffles.length >= 16) {
      // PUFFLE OWNER
      client.giveStamp(21);
    }
  
    client.sendXt('pg', ...puffles);
  } else if (isAs3(client.version)) {
    const isBackyard = iglooType === 'backyard';
    const puffles = client.penguin.puffles.filter((puffle) => {
      // filtering for backyard or igloo puffles
      return (client.penguin.backyard[puffle.id] === 1) === isBackyard;
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
        puffle.id === client.walkingPuffle ? 1 : 0
      ].join('|')
    })
    client.sendXt('pg', puffles.length, ...puffles);
  }
})

// walking puffle AS2
handler.xt('p#pw', (client, puffleId, walking) => {
  if (!isAs2(client.version)) {
    return;
  }
  const id = Number(puffleId);
  const isWalking = walking === '1';

  // TODO add puffle refusing to walk
  // TODO add removing puffle

  client.walkPuffle(id);

  // TODO make the room send XT to everyone
  client.sendXt('pw', client.id, `${id}||||||||||||${walking}`);
})
// walking puffle AS3
handler.xt('p#pw', (client, penguinPuffleId, walking) => {
  if (!isAs3(client.version)) {
    return;
  }

  const playerPuffle = client.penguin.puffles.find((puffle) => puffle.id === Number(penguinPuffleId));

  if (walking === '1') {
    client.walkPuffle(playerPuffle.id);
  } else {
    client.unwalkPuffle();
  }

  client.sendXt('pw', client.id, playerPuffle.id, ...getClientPuffleIds(playerPuffle.type), walking, 0); // TODO hat stuff (last argument)
  // TODO removing puffle, other cases, properly walking puffle in penguin
})

// AS3 puffle name check
handler.xt('p#checkpufflename', (client, puffleName) => {
  // last argument is integer boolean
  client.sendXt('checkpufflename', puffleName, 1);
})

// get inventory for pet care items
handler.xt('p#pgpi', (client) => {
  client.sendXt(
    'pgpi',
    ...BASE_CARE_INVENTORY.map((item) => `${item}|1`),
    ...Object.entries(client.penguin.puffleItems).map((entry) => `${entry[0]}|${entry[1]}`)
  );
})

// send a puffle to or from the backyard
handler.xt('p#puffleswap', (client, playerPuffleId, destination) => {
  client.swapPuffleFromIglooAndBackyard(Number(playerPuffleId), destination === 'backyard');
  client.update();
  client.sendXt('puffleswap', playerPuffleId, destination);
})

export default handler