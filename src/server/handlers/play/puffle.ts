import { PlayerPuffle } from "../../database";
import { Handler } from "..";
import { isAs2, isAs3 } from "../../../server/routes/versions";
import { PUFFLES } from "../../../server/game/puffle";
import { Client } from "../../../server/penguin";
import { choose, randomInt } from "../../../common/utils";

const handler = new Handler()

/** Brush, bath, sleep, basically functionalities disguised as items */
const BASE_CARE_INVENTORY = [1, 8, 37];

/** ID of all items that are a puffle's favorite food */
const PUFFLE_FOOD = [105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 128];

// currently all item lists BELOW come from the Wiki, there's no way to verify
// their veracity, or if they all had the same chance of being found

/** ID of all clothing a normal puffle can dig out */
const REGULAR_PUFFLE_CLOTHING = [
  3028,
  232,
  412,
  112,
  184,
  1056,
  6012,
  118,
  774,
  366,
  103,
  498,
  469,
  1082,
  5196,
  790,
  4039,
  326,
  105,
  122,
  5080,
  111
];

const REGULAR_PUFFLE_FURNITURE = [
  305,
  313,
  504,
  506,
  500,
  503,
  501,
  507,
  505,
  502,
  616,
  542,
  340,
  150,
  149,
  369,
  370,
  300
];

const GOLD_PUFFLE_CLOTHING = [
  2139,
  2137,
  5385,
  3185,
  5384,
  5386,
  6209,
  2138,
  1735,
  3186,
  1734,
  2136,
  4994,
  4993,
  3187
];

const GOLD_PUFFLE_FURNITURE = [
  2132,
  2131,
  2130,
  2129
];

const PUFFLE_CREATURE_CLOTHING = [
  24073,
  24075,
  24078,
  24074,
  24080,
  24076,
  24081,
  24071,
  24072,
  24077,
  24079,
  24070,
  24031, // TODO Originally dinossaur only
  24030, // Originally dinossaur only
  24033, // Originally dinossaur only
  24029, // Originally dinossaur only
  4414,
  122,
  366,
  790,
  232
];

const PUFFLE_CREATURE_FURNITURE = [
  2180, // Originally dinossaur only
  2182, // Originally dinossaur only
  2183, // Originally dinossaur only
  506,
  504,
  501,
  507,
  505,
  503,
  500,
  502,
  340,
  305,
  150,
  370,
  300,
  616,
  313
];

/** Possible treasure types and their client-side IDs */
enum TreasureType {
  Coins = 0,
  Food = 1,
  Furniture = 2,
  Clothing = 3
};

function sendPuffleDig(client: Client, treasureType: TreasureType.Coins, coins: number): void;
function sendPuffleDig(client: Client, treasureType: TreasureType.Clothing | TreasureType.Furniture | TreasureType.Food, itemId: number): void;

/** Send packet for client to dig */
function sendPuffleDig(client: Client, treasureType: TreasureType, target: number): void {
  let coins: number = 0;
  let itemId: number = 0;
  if (treasureType === TreasureType.Coins) {
    coins = target;
  } else {
    itemId = target;
  }
  // TODO multiplayer logic so it sneds to everyone in room
  client.sendXt('puffledig', client.id, client.walkingPuffle, treasureType, itemId, coins, client.penguin.hasDug ? 0 : 1);
}

/**
 * Carries out the action of a client to dig with a puffle
 * @param client 
 * @param onCommand Whether or not the dig happened by command or randomly
 */
function dig(client: Client, onCommand: boolean) {
  // PUFFLE DIG MECHANICS
  // Puffle digging is a completely server-side feature and with a big amount of variables,
  // and for that it is very hard to accurately implement it
  // Finding gameplay footage of this is extremely difficult, and as such, the amount of practical
  // documentation is low, mostly of what we know is a few videos and just word of mouth from people
  // Here everything known and not known will be documented in an effort to make this algorithm as
  // clear and transparent as possible to what might've been implemented in the game at some point

  // # Probability of the event failing
  // when you don't command the puffle dig, there seems to be a chance that no dig will happen
  // which is meant to be responded with a "nodig" packet. It is completely unknown
  // what influences this
  // For WF, we will consider this chance to be 1/2
  // TODO investigate client-side what this packet is. Since it has no response, it is hard to know
  // if it happened or not while watching videos, so studying the client will be important
  if (!onCommand) {
    if (Math.random() > 0.5) {
      // TODO Not sure what the last 1 is
      client.sendXt('nodig', client.id, 1);
      return;
    }
  }

  // "Puffle Dig" stamp
  // Stamp for digging for the first time
  // Note: It is unknown if command allows this to happen, but due to the complete lack of footage
  // we will stick with what is reasonable, and it probably did work, it would've been weird
  // for them to make an exception in the code for this
  client.giveStamp(489);

  // Save that have done digging
  if (!client.penguin.hasDug) {
    client.penguin.hasDug = true;
    client.update();
  }

  // # Probability of each dig type
  // There are four main types of things that can be obtained from puffle digging, which depend
  // on which puffle you have
  // 1. Coins
  // 2. Furniture
  // 3. Items
  // 4. Food (Except Puffle Creatures)
  // 
  // Aditionally, non-members can only get COINS, and if you have a golden puffle, there are only two types,
  // which are coins and the golden items
  //
  // The probabilities of the events are widely unresearched. The club penguin wiki and solero claims that
  // these chances are influenced by age of the puffle and its health. It is however unknown how they
  // are influenced, the wiki claims that age influences the "rarity" of items and the amount of coins,
  // while also claiming that the health increases the amount of coins and the number of rare items you can get
  // (it is possible that rarity is just a miswrite, and it just increases the chances of getting items)
  // Supermanover made some research and found the odds to be somewhere along 1/2 coins, 1/2 the remaining items
  // Since we don't have much to work with it, we are not really making any assumptions about how much
  // the puffle stats influence, and we are giving basic probabilities

  // getting coins: 50% if member, guaranteed otherwise
  // NOTE/TODO: There are certain footages that may indicate that puffle creatures are less likely
  // to get coins, while normal puffle might have as high as 80% coin rate, but this is still
  // not founded with great evidence
  if (!client.penguin.is_member || Math.random() > 0.5) {
    // this video shows that on a fresh account you can get up to 256 coins
    // https://youtu.be/EKf9E9Wg058?t=419
    // On the wiki sits an image of someone receiveing 1133 coins, but it is likely not a fresh Puffle
    // Since we have no clues on how this algorithm works and WF is focused on speedrunning eg. fresh states
    // we will maintain this basic algorithm between 1 and 256.
    // TODO: Add a system which would increase coins with bigger age. (Granted, it wouldn't be very useful in a singleplayer client)
    const coins = randomInt(1, 256);
    sendPuffleDig(client, TreasureType.Coins, coins);
    return;
  }

  // Options array will store all the possible remaining item types and the option will be chosen from this
  // array randomly with equal chances since we don't know if there are specific chance
  const options = [];

  const playerPuffle = client.penguin.puffles.find((puffle) => puffle.id === client.walkingPuffle);
  const puffleType = playerPuffle.type;

  // It is unknown what happens exactly if you reach the limit of items in a category
  // Eg, if you have all possible clothing, does the clothing probability not get accounted, eg.
  // the probability of the others become more likely, or does it still get accounted
  // and if you get clothing you just "fail" or it goes to coins or something?
  // We will be assuming the first. There's no evidence for either

  // getting all food that can be found
  let canDigFood: number[] = [];
  // Puffle creatures (ID of 1000 and forward) can't get food
  if (puffleType < 1000) {
    canDigFood = PUFFLE_FOOD.filter((food) => {
      const inInventory = client.penguin.puffleItems[food];
      // can only hold one of each, even though that is not true
      // for puffle items in general
      return inInventory === undefined || inInventory === 0;   
    });
    if (canDigFood.length > 0) {
      options.push(TreasureType.Food);
    }
  }

  const furnitureSample = puffleType < 1000 ? REGULAR_PUFFLE_FURNITURE : PUFFLE_CREATURE_FURNITURE;
  const canDigFurniture = furnitureSample.filter((furniture) => {
    const inInventory = client.penguin.furniture[furniture];
    return inInventory !== 99;
  });
  if (canDigFurniture.length > 0) {
    options.push(TreasureType.Furniture);
  }

  const clothingSample = puffleType < 1000 ? REGULAR_PUFFLE_CLOTHING : PUFFLE_CREATURE_CLOTHING;
  const canDigClothing = clothingSample.filter((clothing) => {
    return client.penguin.inventory[clothing] === undefined;
  });
  if (canDigClothing.length > 0) {
    options.push(TreasureType.Clothing);
  }

  // TODO golden puffles

  const option = choose(options);
  if (option === TreasureType.Clothing || TreasureType.Furniture) {
    // Treasure Box stamp, find item in dig
    // wiki claims that furnitures are included, no solid evidence though
    client.giveStamp(494);
  }

  if (option === TreasureType.Clothing) {
    const itemId = choose(canDigClothing);
    client.addItem(itemId, { notify: false });
    sendPuffleDig(client, option, itemId);
  } else if (option === TreasureType.Food) {
    const foodId = canDigFood[randomInt(0, canDigFood.length - 1)];
    // TODO notify = false?
    client.addPuffleItem(foodId, 0, 1);
    if (foodId === PUFFLES.get(playerPuffle.type).favouriteFood) {
      // Tasty Treasure stamp
      client.giveStamp(495);
    }
    sendPuffleDig(client, option, foodId);
  } else if (option === TreasureType.Furniture) {
    const furnitureId = canDigFurniture[randomInt(0, canDigFurniture.length - 1)];
    client.addFurniture(furnitureId, { notify: false });
    sendPuffleDig(client, option, furnitureId);
  }
}

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
  // without cooldown, this can be spammed in the AS3 client,
  // allowing a second puffle to be bought
  // It is unknown if the original had this issue so we are correcting it
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

// puffle dig no command
handler.xt('p#puffledig', (client) => {
  dig(client, false);
})

// puffle dig via the puffle tricks
handler.xt('p#puffledigoncommand', (client) => {
  dig(client, true);
})

export default handler