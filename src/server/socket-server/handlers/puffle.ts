import { PenguinMessenger } from "../../socket-server/messenger";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";
import { GameData } from "@server/timelines/game-data";
import { PUFFLES } from "@server/game-logic/puffle";
import { PlayerPuffle } from "@server/database/database";
import { choose, randomInt } from "@common/utils";
import { PUFFLE_ITEMS } from "@server/game-logic/puffle-item";
import { PenguinHandler, PenguinGuard } from "./handlers";
import { handleReceiveMail } from "./mail";


const BASE_CARE_INVENTORY = [1, 8, 37];

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

export const handleGetMyPufflesOld: PenguinHandler<[]> = ({ msg, penguin }) => {
  msg.send(penguin, 'pgu', ...penguin.puffle.puffles.map(getPuffleString));
}

export const sendModernPuffleCheck: PenguinHandler<[string]> = ({ msg, penguin }, name) => {
  msg.send(penguin, 'checkpufflename', name, 1);
}

export const sendPuffleCheck: PenguinHandler<[string]> = ({ msg, penguin }, name) => {
  msg.send(penguin, 'pcn', name, 1);
}

enum PuffleCategory {
  Normal,
  Rainbow,
  Gold,
  Creature
};

const sendBuyPuffleItem: PenguinHandler<[number, number, number]> = ({ msg, penguin }, itemId, cost, amount) => {
  const owned = penguin.puffle.addItem(itemId, amount);
  msg.send(penguin, 'papi', penguin.currency.discount(cost * amount), itemId, owned);
}

export const handleAdoptPuffle: PenguinHandler<[number, string, number]> = (ctx, puffleType, puffleName, puffleSubtype) => {
  // without cooldown, this can be spammed in the modern client,
  // allowing a second puffle to be bought
  // It is unknown if the original had this issue so we are correcting it
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

  handleReceiveMail(ctx, penguin.mail.receivePostcard(111, { details: puffleName }));

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

export const handleGetPuffleInventory: PenguinHandler<[]> = ({ msg, penguin }) => {
  msg.send(
    penguin, 'pgpi',
    ...BASE_CARE_INVENTORY.map((item) => `${item}|1`),
    ...penguin.puffle.getAllItems().map((entry) => `${entry[0]}|${entry[1]}`)
  );
}

export const handlePuffleWalk: PenguinHandler<[number, number]> = (ctx, penguinPuffleId, walking) => {
  // TODO add puffle refusing to walk
  // TODO add removing puffle
  const { msg, prst, penguin, data } = ctx

  if (walking === 1) {
    penguin.puffle.walk(penguinPuffleId);
  } else {
    penguin.puffle.unwalk();
  }

  const penguins = 'room' in ctx ? ctx.room.players : [penguin];

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

export const handlePuffleBackyardSwap: PenguinHandler<[number, string]> = ({ msg, penguin, prst }, playerPuffleId, destination) => {
  if (destination === 'backyard') {
    penguin.puffle.toBackyard(playerPuffleId);
  } else {
    penguin.puffle.fromBackyard(playerPuffleId);
  }
  // TODO is this to room?
  msg.send(penguin, 'puffleswap', playerPuffleId, destination);
  prst(penguin);
}

enum TreasureType {
  Coins = 0,
  Food = 1,
  Furniture = 2,
  Clothing = 3,
  Gold = 4
};

const sendPuffleDig: PenguinHandler<[TreasureType, number]> = ({ msg, penguin }, treasureType, target) => {
  const [coins, itemId] =
    treasureType === TreasureType.Coins ? [target, 0] :
    treasureType === TreasureType.Gold ? [target, 1] : [0, target];

  // TODO multiplayer logic so it sneds to everyone in room
  msg.send(penguin, 'puffledig', penguin.id, penguin.puffle.walking ?? 0, treasureType, itemId, coins, penguin.dig.hasDug ? 0 : 1);
}

const sendGoldNuggets: PenguinHandler<[]> = ({ msg, penguin }) => {
  // TODO what is the first 1?
  msg.send(penguin, 'currencies', `1|${penguin.gold.nuggets}`);
}

const puffleDig: PenguinHandler<[boolean]> = (ctx, onCommand: boolean) => {
  const { msg, penguin, data, prst } = ctx;
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
      msg.send(penguin, 'nodig', penguin.id, 1);
      return;
    }
  }

  // "Puffle Dig" stamp
  // Stamp for digging for the first time
  // Note: It is unknown if command allows this to happen, but due to the complete lack of footage
  // we will stick with what is reasonable, and it probably did work, it would've been weird
  // for them to make an exception in the code for this
  getStamp(data, msg, penguin, 489);

  const playerPuffle = penguin.puffle.getWalking();
  if (playerPuffle === undefined) {
    throw new Error('Digging, but no walking puffle');
  }
  const puffleType = playerPuffle.type;

  // every color stamp, which requires you to dig with
  // 11 different color puffles (excludes puffle creatures)
  // it is unknown if this is per session
  // or not, unless evidence is found otherwise
  // it will remain in session
  penguin.dig.addColor(puffleType);
  if (penguin.dig.colorsDug >= 11) {
    getStamp(data, msg, penguin, 491);
  }

  // dig all day stamp, which reportedly kept track of everything in the past 24hrs
  // it is likely that it persisted sessions although there's no concrete evidence
  // (finding evidence for this would be very hard)
  // there is also no evidence saying that coins count but 
  // it is known it counted with puffle nuggets, so it probably
  // did count with coins too
  const DIG_ALL_DAY_STAMP = 492;
  if (!penguin.stampbook.has(DIG_ALL_DAY_STAMP)) {
    penguin.dig.addFind();
    // client.penguin.addTreasureFind();

    if (penguin.dig.treasuresInLastDay >= 5) {
      getStamp(data, msg, penguin, DIG_ALL_DAY_STAMP);
      penguin.dig.clearFinds();
    }
  }

  // Save that have done digging
  if (!penguin.dig.hasDug) {
    penguin.dig.setDug();
  }

  // digging for gold nuggets
  // when you are in this state, only nuggets can show up. It seems that
  // you can get 1-3 nuggets per dig (proven by client files)
  // no concrete proof of the distribution but from looking at a few videos,
  // it feels uniformly distributed
  if (penguin.gold.goldNuggetState) {
    const nuggets = randomInt(1, 3);
    penguin.gold.add(nuggets);
    
    sendGoldNuggets(ctx);
    sendPuffleDig(ctx, TreasureType.Gold, nuggets);
    
    prst(penguin);
    return;
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
  if (!penguin.membership.isMember || Math.random() > 0.5) {
    // this video shows that on a fresh account you can get up to 256 coins
    // https://youtu.be/EKf9E9Wg058?t=419
    // On the wiki sits an image of someone receiveing 1133 coins, but it is likely not a fresh Puffle
    // Since we have no clues on how this algorithm works and WF is focused on speedrunning eg. fresh states
    // we will maintain this basic algorithm between 1 and 256.
    // TODO: Add a system which would increase coins with bigger age. (Granted, it wouldn't be very useful in a singleplayer client)
    const coins = randomInt(1, 256);
    if (coins >= 50) {
      // Big Dig stamp
      getStamp(data, msg, penguin, 493);
    }
    penguin.currency.add(coins);
    sendPuffleDig(ctx, TreasureType.Coins, coins);
    prst(penguin);
    return;
  }

  // Options array will store all the possible remaining item types and the option will be chosen from this
  // array randomly with equal chances since we don't know if there are specific chance
  // it's also unknown if golden puffle had
  // equal odds for clothing and furniture
  type PoolType = 'clothing' | 'furniture' | 'food';

  // It is unknown what happens exactly if you reach the limit of items in a category
  // Eg, if you have all possible clothing, does the clothing probability not get accounted, eg.
  // the probability of the others become more likely, or does it still get accounted
  // and if you get clothing you just "fail" or it goes to coins or something?
  // We will be assuming the first. There's no evidence for either

  // This map stores for each type all the possible values that can be chosen
  const originalItemPools: Record<PoolType, number[]> = 
    puffleType === 11 ? { clothing: GOLD_PUFFLE_CLOTHING, furniture: GOLD_PUFFLE_FURNITURE, food: [] } :
    puffleType > 1000 ? { clothing: PUFFLE_CREATURE_CLOTHING, furniture: PUFFLE_CREATURE_FURNITURE, food: [ ]} :
    { clothing: REGULAR_PUFFLE_CLOTHING, furniture: REGULAR_PUFFLE_FURNITURE, food: PUFFLE_FOOD };

  const itemPools: Record<PoolType, number[]> = {
    clothing: originalItemPools.clothing.filter((clothing) => {
      return !penguin.inventory.has(clothing);
    }),
    furniture: originalItemPools.furniture.filter((furniture) => {
      const ownedAmount = penguin.igloo.getFurnitureAmount(furniture);
      return ownedAmount !== 99;
    }),
    food: originalItemPools.food.filter((food) => {
      const ownedAmount = penguin.puffle.getItemAmount(food);
      // can only hold one of each, even though that is not true
      // for puffle items in general
      return ownedAmount === 0;
    })
  }

  const options = Object.entries(itemPools).filter(([_, pool]) => pool.length > 0).map(([name]) => name) as PoolType[];

  const option = choose(options);
  const treasure = {
    'furniture': TreasureType.Furniture,
    'clothing': TreasureType.Clothing,
    'food': TreasureType.Food
  }[option];
  const itemId = choose(itemPools[option]);
  if (treasure === TreasureType.Clothing || treasure === TreasureType.Furniture) {
    // Treasure Box stamp, find item in dig
    // wiki claims that furnitures are included, no solid evidence though
    getStamp(data, msg, penguin, 494);
  }

  if (treasure === TreasureType.Clothing) {
    penguin.inventory.add(itemId);
  } else if (treasure === TreasureType.Food) {
    // TODO notify = false?
    penguin.puffle.addItem(itemId, 1);
    if (itemId === PUFFLES.get(playerPuffle.type)?.favouriteFood) {
      // Tasty Treasure stamp
      getStamp(data, msg, penguin, 495);
    }
  } else if (treasure === TreasureType.Furniture) {
    penguin.igloo.addFurniture(itemId, 1);
  }
  sendPuffleDig(ctx, treasure, itemId);
  prst(penguin);
}

export const handleEatPuffleItem: PenguinHandler<[number, number]> = (ctx, playerPuffleId, itemId) => {
  const { penguin, msg, prst } = ctx;
  const puffleItem = PUFFLE_ITEMS.getStrict(itemId);
  const puffle = penguin.puffle.getPuffle(playerPuffleId);

  if (puffle === undefined) {
    throw new Error('No puffle but eating puffle item');
  }

  // TODO non golden puffle handling
  // code here only accounts for the gold puffle berry you get
  msg.send(penguin, 'pcid', penguin.id, [
    puffle.id,
    puffle.food,
    100, // TODO puffle.play
    puffle.rest,
    puffle.clean,
    Number(false) // TODO "celebration" (apparently when puffle is maxed out?)
  ].join('|'));
  
  // starting golden puffle quest
  const goldBerry = PUFFLE_ITEMS.get(126);
  if (puffleItem.id === goldBerry?.id) {
    penguin.currency.discount(goldBerry.cost);
    penguin.gold.setState();
    msg.send(penguin, 'oberry', penguin.id, puffle.id);
    sendGoldNuggets(ctx);
  }
  prst(penguin);
}

export const handleRevealGoldPuffle: PenguinHandler<[]> = ({ msg, penguin }) => {
  // TODO multiplayer logic
  msg.send(penguin, 'revealgoldpuffle', penguin.id);
}

export const handleGetIglooPufflesOld: PenguinHandler<number[]> = (ctx, id = 0) => {
  handleGetIglooPuffles(ctx, id, '');
}

export const handleGetIglooPuffles: PenguinHandler<[number, string]> = ({ data, penguin, msg }, id, iglooType) => {
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
        Math.round((puffle.clean + puffle.food + puffle.rest) / 3),
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
}

export const handleAdoptPuffleOld: PenguinHandler<[number, string]> = (ctx, type, name) => {
  handleAdoptPuffle(ctx, type, name, 0);
}

export const isAfterPuffleCreatureGuard: PenguinGuard = ({ data }) => {
  return data.isVanillaEngine();
}

export const isBeforePuffleCreatureGuard: PenguinGuard = (ctx) => {
  return !isAfterPuffleCreatureGuard(ctx);
}

export const handlePuffleDigRandom: PenguinHandler<[]> = (ctx) => puffleDig(ctx, false);
export const handlePuffleDigOnCommand: PenguinHandler<[]> = (ctx) => puffleDig(ctx, true);
