import { PlayerPuffle } from "../../database";
import { Handler } from "..";
import { PUFFLES } from "../../game-logic/puffle";
import { Client } from "../../../server/client";
import { choose, randomInt } from "../../../common/utils";
import { PUFFLE_ITEMS } from "../../game-logic/puffle-item";
import { Handle } from "../handles";

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
  Clothing = 3,
  Gold = 4
};


/**
 * Send packet for client to dig
 * @param target For coins, it is how many coins earned, for nuggets, how many nuggets, for items, the item ID
 * */
function sendPuffleDig(client: Client, treasureType: TreasureType, target: number): void {
  let coins: number = 0;
  let itemId: number = 0;
  if (treasureType === TreasureType.Coins) {
    coins = target;
  } else if (treasureType === TreasureType.Gold) {
    // TODO not sure why 1.
    itemId = 1;
    coins = target;
  } else {
    itemId = target;
  }
  // TODO multiplayer logic so it sneds to everyone in room
  client.sendXt('puffledig', client.penguin.id, client.walkingPuffle, treasureType, itemId, coins, client.penguin.hasDug ? 0 : 1);
}

function sendGoldNuggets(client: Client): void {
  // TODO what is the first 1?
  client.sendXt('currencies', `1|${client.penguin.nuggets}`);
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
      client.sendXt('nodig', client.penguin.id, 1);
      return;
    }
  }

  // "Puffle Dig" stamp
  // Stamp for digging for the first time
  // Note: It is unknown if command allows this to happen, but due to the complete lack of footage
  // we will stick with what is reasonable, and it probably did work, it would've been weird
  // for them to make an exception in the code for this
  client.giveStamp(489);

  const playerPuffle = client.penguin.getPuffles().find((puffle) => puffle.id === client.walkingPuffle);
  if (playerPuffle === undefined) {
    throw new Error(`Player is walking puffle ${client.walkingPuffle} which they don't have`);
  }
  const puffleType = playerPuffle.type;

  // every color stamp, which requires you to dig with
  // 11 different color puffles (excludes puffle creatures)
  // it is unknown if this is per session
  // or not, unless evidence is found otherwise
  // it will remain in session
  client.addDugPuffleColor(puffleType);
  if (client.getTotalColorsDug() >= 11) {
    client.giveStamp(491);
  }

  // dig all day stamp, which reportedly kept track of everything in the past 24hrs
  // it is likely that it persisted sessions although there's no concrete evidence
  // (finding evidence for this would be very hard)
  // there is also no evidence saying that coins count but 
  // it is known it counted with puffle nuggets, so it probably
  // did count with coins too
  const DIG_ALL_DAY_STAMP = 492;
  if (!client.penguin.hasStamp(DIG_ALL_DAY_STAMP)) {
    client.penguin.addTreasureFind();

    if (client.penguin.getTreasureFindsInLastDay() >= 5) {
      client.giveStamp(DIG_ALL_DAY_STAMP);
      client.penguin.clearTreasureFinds();
    }
  }

  // Save that have done digging
  if (!client.penguin.hasDug) {
    client.penguin.setHaveDug();
  }

  // digging for gold nuggets
  // when you are in this state, only nuggets can show up. It seems that
  // you can get 1-3 nuggets per dig (proven by client files)
  // no concrete proof of the distribution but from looking at a few videos,
  // it feels uniformly distributed
  if (client.isGoldNuggetState) {
    const nuggets = randomInt(1, 3);
    client.penguin.addNuggets(nuggets);
    
    sendGoldNuggets(client);
    sendPuffleDig(client, TreasureType.Gold, nuggets);
    
    client.update();
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
  if (!client.penguin.isMember || Math.random() > 0.5) {
    // this video shows that on a fresh account you can get up to 256 coins
    // https://youtu.be/EKf9E9Wg058?t=419
    // On the wiki sits an image of someone receiveing 1133 coins, but it is likely not a fresh Puffle
    // Since we have no clues on how this algorithm works and WF is focused on speedrunning eg. fresh states
    // we will maintain this basic algorithm between 1 and 256.
    // TODO: Add a system which would increase coins with bigger age. (Granted, it wouldn't be very useful in a singleplayer client)
    const coins = randomInt(1, 256);
    sendPuffleDig(client, TreasureType.Coins, coins);
    client.update();
    return;
  }

  // Options array will store all the possible remaining item types and the option will be chosen from this
  // array randomly with equal chances since we don't know if there are specific chance
  // it's also unknown if golden puffle had
  // equal odds for clothing and furniture
  type PoolType = 'clothing' | 'furniture' | 'food';
  const options: PoolType[] = [];

  // It is unknown what happens exactly if you reach the limit of items in a category
  // Eg, if you have all possible clothing, does the clothing probability not get accounted, eg.
  // the probability of the others become more likely, or does it still get accounted
  // and if you get clothing you just "fail" or it goes to coins or something?
  // We will be assuming the first. There's no evidence for either

  // This map stores for each type all the possible values that can be chosen
  const itemPools: Record<PoolType, number[]> = {
    clothing: [],
    furniture: [],
    food: []
  };
  // Gold puffle only has its own gold items pool, and no food
  if (puffleType === 11) {
    itemPools.clothing = GOLD_PUFFLE_CLOTHING;
    itemPools.furniture = GOLD_PUFFLE_FURNITURE;
  } else if (puffleType > 1000) { // puffle creatures have a different item pool and no puffle food
    itemPools.clothing = PUFFLE_CREATURE_CLOTHING;
    itemPools.furniture = PUFFLE_CREATURE_FURNITURE;
  } else {
    itemPools.food = PUFFLE_FOOD;
    itemPools.clothing = REGULAR_PUFFLE_CLOTHING;
    itemPools.furniture = REGULAR_PUFFLE_FURNITURE;
  }

  // assign to each type of item a function that will check if the item in question
  // CAN be found on this dig
  const filters: Record<PoolType, (n: number) => boolean> = {
    'food': (food) => {
      const ownedAmount = client.penguin.getPuffleItemOwnedAmount(food);
      // can only hold one of each, even though that is not true
      // for puffle items in general
      return ownedAmount === 0;
    },
    'furniture': (furniture) => {
      const ownedAmount = client.penguin.getFurnitureOwnedAmount(furniture);
      return ownedAmount !== 99;
    },
    'clothing': (clothing) => {
      return !client.penguin.hasItem(clothing);
    }
  }

  // going through everything, removing the items we can't get
  // and adding to the random option if there's still items to get
  for (const pool in itemPools) {
    const itemPool = pool as PoolType
    itemPools[itemPool] = itemPools[itemPool].filter(filters[itemPool]);
    if (itemPools[itemPool].length > 0) {
      options.push(itemPool);
    }
  }

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
    client.giveStamp(494);
  }

  if (treasure === TreasureType.Clothing) {
    client.buyItem(itemId, { notify: false });
  } else if (treasure === TreasureType.Food) {
    // TODO notify = false?
    client.buyPuffleItem(itemId, 0, 1);
    if (itemId === PUFFLES.get(playerPuffle.type)?.favouriteFood) {
      // Tasty Treasure stamp
      client.giveStamp(495);
    }
  } else if (treasure === TreasureType.Furniture) {
    client.buyFurniture(itemId, { notify: false });
  }
  sendPuffleDig(client, treasure, itemId);
  client.update();
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

handler.xt(Handle.AdoptPuffle, (client, puffleType, puffleName) => {
  if (!client.isEngine2) {
    return;
  }
  const PUFFLE_COST = 800
  if (client.penguin.coins < PUFFLE_COST) {
    // TODO no coins error
  } else if (false) {
    // TODO too many puffles error
  }
  client.penguin.removeCoins(PUFFLE_COST)
  const puffle = client.penguin.addPuffle(puffleName, puffleType);
  client.sendXt('pn', client.penguin.coins, getPuffleString(puffle));

  client.addPostcard(111, { details: puffleName });
  client.update();
  // TODO favorite item code in houdini?
  // TODO 'pgu' is necessary?
})

// seemingly the format in which client usually wants the puffle IDs
export function getClientPuffleIds(puffleId: number) {
  const parentId = PUFFLES.get(puffleId)?.parentId;
  if (parentId === undefined) {
    return [puffleId, ''];
  } else {
    return [parentId, puffleId];
  }
}

enum PuffleCategory {
  Normal,
  Rainbow,
  Gold,
  Creature
};

handler.xt(Handle.AdoptPuffleNew, (client, puffleType, puffleName, puffleSubType) => {
  if (!client.isEngine3) {
    return;
  }

  let category: PuffleCategory;
  if (puffleType === 10) {
    category = PuffleCategory.Rainbow;
  } else if (puffleType === 11) {
    category = PuffleCategory.Gold;
  } else if (puffleSubType === 0) {
    category = PuffleCategory.Normal;
  } else {
    category = PuffleCategory.Creature;
  }
  // TODO dynamic cost for eg creatures, changing to 800 for earlier times
  // gold puffles must be 0
  let puffleCost = 400;
  if (category === PuffleCategory.Creature) {
    puffleCost = 800;
  } else if (category === PuffleCategory.Gold) {
    puffleCost = 0;
  }

  const puffleId = Number(puffleSubType === 0 ? puffleType : puffleSubType);
  const puffle = PUFFLES.get(puffleId);
  if (puffle === undefined) {
    throw new Error(`Puffle of ID ${puffleId} was not found in the database`);
  }

  if (category === PuffleCategory.Rainbow) {
    // rainbow puffle
    // upon adopting a puffle, its progress resests meaning
    // you'd need to redo the quest for a new one
    client.penguin.resetRainbowQuest();
  } else if (category === PuffleCategory.Gold) {
    client.resetGoldNuggetState();
    client.penguin.removeGoldPuffleNuggets();
  } else if (category === PuffleCategory.Creature) {  
    client.buyPuffleItem(3, 0, 5);  
    client.buyPuffleItem(79, 0, 1);  
    if (puffle.favouriteToy !== undefined) {  
      client.buyPuffleItem(puffle.favouriteToy, 0, 1);  
    }  
  }

  client.penguin.removeCoins(puffleCost);
  const playerPuffle = client.penguin.addPuffle(puffleName, puffleId);

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
  const pufflesInIgloo = client.penguin.getPuffles().filter((puffle) => !client.penguin.isInBackyard(puffle.id));
  if (pufflesInIgloo.length > 10) {
    client.swapPuffleFromIglooAndBackyard(pufflesInIgloo[0].id, true);
  }

  client.update();
}, {
  // without cooldown, this can be spammed in the Engine 3 client,
  // allowing a second puffle to be bought
  // It is unknown if the original had this issue so we are correcting it
  cooldown: 2000
});

// get puffles in igloo
handler.xt(Handle.GetIglooPuffles, (client, id, iglooType) => {
  if (client.isEngine2) {
    const puffles = client.penguin.getPuffles().map((puffle) => {
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
  } else if (client.isEngine3) {
    const isBackyard = iglooType === 'backyard';
    const puffles = client.penguin.getPuffles().filter((puffle) => {
      // filtering for backyard or igloo puffles
      return client.penguin.isInBackyard(puffle.id) === isBackyard;
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

// walking puffle engine 2
handler.xt(Handle.WalkPuffle, (client, puffleId, walking) => {
  if (!client.isEngine2) {
    return;
  }
  // TODO add puffle refusing to walk
  // TODO add removing puffle

  client.walkPuffle(puffleId);

  // enviar a toda la sala el nuevo estado del puffle caminante
  client.sendRoomXt('pw', client.penguin.id, `${puffleId}||||||||||||${walking}`);
  client.update();
})
// walking puffle Engine 3
handler.xt(Handle.WalkPuffle, (client, penguinPuffleId, walking) => {
  if (!client.isEngine3) {
    return;
  }

  const playerPuffle = client.penguin.getPuffles().find((puffle) => puffle.id === penguinPuffleId);
  if (playerPuffle === undefined) {
    throw new Error(`Walk puffle: could not find puffle in inventory: ${penguinPuffleId}`);
  }

  if (walking === 1) {
    client.walkPuffle(playerPuffle.id);
  } else {
    client.unwalkPuffle();
  }

  // notificar a todos en la sala que el jugador comenzó o dejó de caminar su puffle
  client.sendRoomXt('pw', client.penguin.id, playerPuffle.id, ...getClientPuffleIds(playerPuffle.type), walking, 0); // TODO hat stuff (last argument)
  client.update();
  // TODO removing puffle, other cases, properly walking puffle in penguin
})

// Engine 3 puffle name check
handler.xt(Handle.CheckPuffleName, (client, puffleName) => {
  // last argument is integer boolean
  client.sendXt('checkpufflename', puffleName, 1);
})

// endpoint that checks name used by some puffles (rainbow puffle, gold puffle)
// potentially a predecessor to the one above
handler.xt(Handle.CheckPuffleNameAlt, (client, puffleName) => {
  client.sendXt('pcn', puffleName, 1);
})

// get inventory for pet care items
handler.xt(Handle.GetPuffleInventory, (client) => {
  client.sendXt(
    'pgpi',
    ...BASE_CARE_INVENTORY.map((item) => `${item}|1`),
    ...client.penguin.getAllPuffleItems().map((entry) => `${entry[0]}|${entry[1]}`)
  );
})

// send a puffle to or from the backyard
handler.xt(Handle.PuffleBackyardSwap, (client, playerPuffleId, destination) => {
  client.swapPuffleFromIglooAndBackyard(playerPuffleId, destination === 'backyard');
  client.sendXt('puffleswap', playerPuffleId, destination);
  client.update();
})

// puffle dig no command
handler.xt(Handle.PuffleDigRandom, (client) => {
  dig(client, false);
})

// puffle dig via the puffle tricks
handler.xt(Handle.PuffleDigOnCommand, (client) => {
  dig(client, true);
})

// eating puffle care item
handler.xt(Handle.EatPuffleItem, (client, puffleId, puffleItemId) => {
  const puffleItem = PUFFLE_ITEMS.get(puffleItemId);
  const puffle = client.penguin.getPuffle(puffleId);
  if (puffleItem === undefined) {
    throw new Error(`Puffle item not in the database: ${puffleItem}`);
  }
  // TODO non golden puffle handling
  // code here only accounts for the gold puffle berry you get
  client.sendXt('pcid', client.penguin.id, [
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
    client.penguin.removeCoins(goldBerry.cost);

    client.activateGoldNuggetState();
    client.sendXt('oberry', client.penguin.id, client.walkingPuffle);
    sendGoldNuggets(client);
  }
  client.update();
});

// make gold puffle appear in the mine
handler.xt(Handle.RevealGoldPuffle, (client) => {
  // TODO multiplayer room logic
  client.sendXt('revealgoldpuffle', client.penguin.id);
});

handler.xt(Handle.Puffletrick, (client, trickId) => {  
  const trickMap = {  
    '1': 'jumpForward',  
    '2': 'jumpSpin',   
    '3': 'nuzzle',  
    '4': 'roll',  
    '5': 'speak',  
    '6': 'standOnHead'  
  } as const;  
    
  if (!(trickId in trickMap)) return;  
    
  const playerPuffle = client.penguin.getPuffles().find((puffle) => puffle.id === client.walkingPuffle);  
  if (playerPuffle === undefined) {  
    throw new Error(`Player is not walking a puffle`);  
  }  
    
  // Enviar más información como en el handler pw  
  client.sendXt('puffletrick', client.penguin.id, trickId);  
});

export default handler