import { World, WorldContext } from "@server/socket-server/world/world";
import { HandlerFunction, XtHandler } from "../xt";
import { Igloo, IglooFurniture, PenguinJson, PenguinRepository } from "@server/database/database";
import { FURNITURE } from "@server/game-logic/furniture";
import { getFlooringCost, getIglooCost } from "@server/game-logic/iglooItems";
import { getStamp } from "./puffle";

const handler = new XtHandler<WorldContext, ['penguin', 'msg', 'world', 'data', 'db', 'prst']>(['penguin', 'msg', 'world', 'data', 'db', 'prst']);
type IglooHandler<T extends any[]> = HandlerFunction<WorldContext, ['penguin', 'msg', 'world', 'data', 'db', 'prst'], T>;

export async function getIglooFromId(world: World, db: PenguinRepository, ownerId: number): Promise<Igloo | undefined> {
  return world.getById(ownerId)?.igloo.activeIgloo ??
    ((data: PenguinJson | null): Igloo | undefined => {
      if (data === null) {
        return undefined;
      }
      return data.igloos.find(igloo => igloo.id === data.igloo);
    })(await db.get(ownerId));
}

export function getFurnitureString(furniture: IglooFurniture): string {
  return furniture.map((furniture) => {
    return [
      furniture.id,
      furniture.x,
      furniture.y,
      furniture.rotation,
      furniture.frame
    ].join('|')
  }).join(',');
}

handler.xt('r', 'gm', ['number'], async (ctx, ownerId) => {
  const { world, db, msg, penguin } = ctx;
  const igloo = await getIglooFromId(world, db, ownerId);
  if (igloo === undefined) {
    return;
  }

  msg.send(penguin, 'gm', ownerId, igloo.type, igloo.music, igloo.flooring, getFurnitureString(igloo.furniture));
});

// get igloo information
handler.xt('s', 'g#gm', ['number'], ({ world, penguin, msg, data }, penguinId) => {
  const host = world.getById(penguinId);
  if (host !== undefined) {
    // const igloo = host.getOwnIglooString();
    const igloo = host.igloo.activeIgloo;
    
    if (!data.isVanillaEngine()) {
      msg.send(penguin, 'gm', penguinId, igloo.type, igloo.music, igloo.flooring, getFurnitureString(igloo.furniture));
    } else {
      const likeCount = 0;
      const iglooString = [
        igloo.id,
        1, // TODO what is this 1?
        0, // TODO don't know what this is
        igloo.locked ? 1 : 0,
        igloo.music,
        igloo.flooring,
        igloo.location,
        igloo.type,
        likeCount,
        getFurnitureString(igloo.furniture)
      ].join(':');
      msg.send(penguin, 'gm', penguinId, iglooString);
    }
  }
});

handler.xt('s', 'g#gii', [], ({ msg, penguin }) => {
  // No idea what these zeros are used for
  const zeros = '0000000000';
  const furnitureInfo = penguin.igloo.furniture.map((pair) => {
    const [id, amount] = pair;
    return `${id}|${zeros}|${amount}`;
  });
  
  const floorings = penguin.igloo.floorings;
  const igloos = penguin.igloo.types;
  const locations = penguin.igloo.locations;
  const information = [
    furnitureInfo,
    // this ... is for the other types which don't have "amount"
    ...[
      floorings,
      igloos,
      locations
    ].map((items) => {
      return items.map(item => `${item}|${zeros}`)
    })
  ].map((infoArray) => {
    return infoArray.join(',');
  })
  msg.send(penguin, 'gii', ...information);
});

const handleAddFurniture: IglooHandler<[number]> = (ctx, furnitureId) => {
  const { penguin, msg, prst } = ctx;
  const item = FURNITURE.getStrict(furnitureId);
  penguin.igloo.addFurniture(furnitureId, 1);
  msg.send(penguin, 'af', furnitureId, penguin.currency.discount(item.cost));
  prst(penguin);
};

const handleAddIgloo: IglooHandler<[number]> = (ctx, iglooId) => {
  const { penguin, msg, prst } = ctx;
  const cost = getIglooCost(iglooId);
  ;
  penguin.igloo.addIglooType(iglooId);
  // unknown if music was reset or not in the original
  penguin.igloo.updateIgloo({ type: iglooId, music: 0, flooring: 0, furniture: [] });
  msg.send(penguin, 'au', iglooId, penguin.currency.discount(cost));
  prst(penguin);
}

const handleAddFlooring: IglooHandler<[number]> = (ctx, flooring) => {
  const { msg, penguin, prst, data } = ctx;
  const cost = getFlooringCost(flooring);

  if (data.isVanillaEngine()) {
    // placeholder for when flooring inventory was added (before it was auto updated)
    penguin.igloo.addFlooring(flooring);
  } else {
    penguin.igloo.updateIgloo({ flooring });
  }

  msg.send(penguin, 'ag', flooring, penguin.currency.discount(cost));
  prst(penguin);
};

export function processFurniture(furnitureItems: string[]): IglooFurniture {
  return furnitureItems.map((furnitureString) => {
    const [furniture, x, y, rotation, frame] = furnitureString.split('|').map((str) => Number(str))
    return {
      id: furniture,
      x,
      y,
      rotation,
      frame
    }
  })
}

const addFullHouseStamp: IglooHandler<[]> = (ctx) => {
  getStamp(ctx.data, ctx.msg, ctx.penguin, 23);
}

const handleUpdateIgloo: IglooHandler<string[]> = (ctx, ...furnitureItems) => {
  const { prst, penguin } = ctx;
  const igloo = processFurniture(furnitureItems);
  if (igloo.length === 99) {
    addFullHouseStamp(ctx);
  }

  penguin.igloo.updateIgloo({ furniture: igloo });
  prst(penguin);
}

handler.xt([['s', 'af'], ['r', 'af'], ['s', 'g#af']], ['number'], handleAddFurniture);
handler.xt([['s', 'au'], ['r', 'au']], ['number'], handleAddIgloo);
handler.xt([['r', 'ag'], ['s', 'g#ag']], ['number'], handleAddFlooring);
handler.xt('s', 'g#ur', 'string', handleUpdateIgloo);

export {
  handler as iglooHandler
};