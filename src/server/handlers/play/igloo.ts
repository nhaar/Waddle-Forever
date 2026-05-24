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

function getModernIglooString(igloo: Igloo, index: number): string {
  const likeCount = 0;
  return [
    igloo.id,
    index,
    0, // TODO don't know what this is
    igloo.locked ? 1 : 0,
    igloo.music,
    igloo.flooring,
    igloo.location,
    igloo.type,
    likeCount,
    getFurnitureString(igloo.furniture)
  ].join(':');
}

// get igloo information
handler.xt('s', 'g#gm', ['number'], ({ world, penguin, msg, data }, penguinId) => {
  const host = world.getById(penguinId);
  if (host !== undefined) {
    // const igloo = host.getOwnIglooString();
    const igloo = host.igloo.activeIgloo;
    
    if (!data.isVanillaEngine()) {
      msg.send(penguin, 'gm', penguinId, igloo.type, igloo.music, igloo.flooring, getFurnitureString(igloo.furniture));
    } else {
      msg.send(penguin, 'gm', penguinId, getModernIglooString(igloo, 1));
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
  const { penguin, msg, prst, data } = ctx;
  const cost = getIglooCost(iglooId);
  
  if (data.isAfterOwnedIgloos()) {
    penguin.igloo.addIglooType(iglooId);
  } else {
    // unknown if music was reset or not in the original
    penguin.igloo.updateIgloo({ type: iglooId, music: 0, flooring: 0, furniture: [] });
  }
  
  msg.send(penguin, 'au', iglooId, penguin.currency.discount(cost));
  prst(penguin);
}

const handleUpdateIglooType: IglooHandler<[number]> = ({ prst, penguin }, iglooType) => {
  // is it not required to remove flooring etc?
  penguin.igloo.updateIgloo({ type: iglooType });
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

const handleUpdateIglooNew: IglooHandler<[number, number, number, number, number, string]> = (ctx, layoutId, type, flooring, location, music, furnitureData) => {
  const { prst, penguin } = ctx;
  penguin.igloo.setActiveIgloo(layoutId);
  const furniture = furnitureData === '' ? [] : processFurniture(furnitureData.split(','));
  if (furniture.length >= 99) {
    addFullHouseStamp(ctx);
  }

  penguin.igloo.updateIgloo({ type, music, flooring, location, furniture });
  prst(penguin);
}

const handleUpdateIglooOld: IglooHandler<string[]> = (ctx, type, ...rest) => {
  const { penguin, prst } = ctx;
  
  // music ID is placed at the start, though it may not be present
  const [furnitureItems, music] = rest[0].includes('|')
    ? [rest, 0]
    : [rest.slice(1), Number(rest[0])];
  
  const igloo = processFurniture(furnitureItems);
  penguin.igloo.updateIgloo({ furniture: igloo, type: Number(type), music });
  prst(penguin);
}

const handleGetFurniture: IglooHandler<[]> = (ctx) => {
  const { msg, penguin } = ctx;
  const furniture = penguin.igloo.getAllFurniture().flatMap(([id, amount]) => new Array(amount).fill(id));
  msg.send(penguin, 'gf', ...furniture);
}

const handleGetFurnitureNew: IglooHandler<[]> = ({ msg, penguin }) => {
  msg.send(penguin, 'gf', ...penguin.igloo.getAllFurniture().map(pair => pair.join('|')));
}

const handleOpenIgloo: IglooHandler<[number]> = (ctx) => {
  const { world, penguin } = ctx;

  world.openIgloo(penguin);
}

const handleCloseIgloo: IglooHandler<[number]> = (ctx) => {
  const { world, penguin } = ctx;

  world.closeIgloo(penguin);
}

const handleGetOpenIgloos: IglooHandler<[]> = (ctx) => {
  const { msg, penguin, world } = ctx;

  // TODO need to figure out how to make this penguin "nickname" properly display
  // on showHint, without modding. Seems to require an old shell
  // (and for the newer shells, what is the proper map SWF to use?)
  //TODO sendXtEmptyLast?
  msg.send(penguin, 'gr', ...world.getOpenIglooPlayers().map(p => `${p.id}|${p.name}`));
}

const handleUpdateMusic: IglooHandler<[number]> = (ctx, music) => {
  const { penguin, prst } = ctx;
  penguin.igloo.updateIgloo({ music });
  prst(penguin);
}

const handleGetIglooTypes: IglooHandler<[]> = ({ msg, penguin }) => {
  msg.send(penguin, 'go', penguin.igloo.types.join('|'));
}

const handleGetIglooLikes: IglooHandler<[]> = ({ msg, penguin }) => {
  const id = 1; // TODO Unsure what this ID is
  const likeCount = 0; // TODO like system
  // TODO unsure what this 200 is
  msg.send(penguin, 'gili', id, 200, JSON.stringify({
    likedby: {
      counts: {
        count: likeCount,
        maxCount: likeCount,
        accumCount: likeCount
      },
      IDs: []
    }
  }));
}

const handleGetDj3kTracks: IglooHandler<[]> = ({ msg, penguin }) => {
  msg.send(penguin, 'ggd', '');
}

const handleGetAllIglooLayouts: IglooHandler<[]> = ({ msg, penguin }) => {
  const layouts = penguin.igloo.getAllLayouts().map(([index, layout]) => {
    return getModernIglooString(layout, index);
  });
  // TODO unsure what the 0 is
  msg.send(penguin, 'gail', penguin.id, 0, ...layouts);
}

const handleAddIglooLayout: IglooHandler<[]> = ({ msg, penguin, prst }) => {
  const [id, igloo] = penguin.igloo.addIglooLayout();
  // TODO document better what this slot-index is for in the engine 3 string
  msg.send(penguin, 'al', penguin.id, getModernIglooString(igloo, id));
  prst(penguin);
}

const handleUpdateIglooLayout: IglooHandler<[number, string]> = ({ prst, penguin }, layoutId, locks) => {
  penguin.igloo.setActiveIgloo(layoutId);
  
  locks.split(',').map(str => str.split('|')).forEach(([i, locked]) => {
    penguin.igloo.setLocked(Number(i), locked === '1');
  });
  
  prst(penguin);
}

const handleAddIglooLocation: IglooHandler<[number]> = ({ prst, penguin, msg }, location) => {
  penguin.igloo.addIglooLocation(location);
  // TODO cost deducting
  msg.send(penguin, 'aloc', location, penguin.currency.coins);
  prst(penguin);
}

handler.xt([['s', 'af'], ['r', 'af'], ['s', 'g#af']], ['number'], handleAddFurniture);
handler.xt([['s', 'au'], ['r', 'au'], ['s', 'g#au']], ['number'], handleAddIgloo);
handler.xt([['r', 'ag'], ['s', 'g#ag']], ['number'], handleAddFlooring);
handler.xt([['r', 'ur'], ['s', 'g#ur']], 'string', handleUpdateIgloo);
handler.xt('s', 'g#ao', ['number'], handleUpdateIglooType);
handler.xt([['s', 'gf'], ['r', 'gf']], [], handleGetFurniture);
handler.xt('s', 'g#gf', [], handleGetFurnitureNew);
handler.xt('s', 'g#go', [], handleGetIglooTypes);
handler.xt('s', 'ur', 'string', handleUpdateIglooOld);
handler.xt('r', 'or', ['number'], handleOpenIgloo);
handler.xt('s', 'g#or', ['number', 'string'], handleOpenIgloo);
handler.xt([['r', 'cr'], ['s', 'g#cr']], ['number'], handleCloseIgloo);
handler.xt([['r', 'gr'], ['s', 'g#gr']], [], handleGetOpenIgloos);
handler.xt([['r', 'um'], ['s', 'g#um']], ['number'], handleUpdateMusic);
handler.xt('s', 'g#gili', [], handleGetIglooLikes);
handler.xt('s', 'g#ggd', [], handleGetDj3kTracks);
handler.xt('s', 'g#gail', [], handleGetAllIglooLayouts);
handler.xt('s', 'g#uic', ['number', 'number', 'number', 'number', 'number', 'string'], handleUpdateIglooNew);
handler.xt('s', 'g#al', [], handleAddIglooLayout);
handler.xt('s', 'g#uiss', ['number', 'string'], handleUpdateIglooLayout);
handler.xt('s', 'g#aloc', ['number'], handleAddIglooLocation);

export {
  handler as iglooHandler
};