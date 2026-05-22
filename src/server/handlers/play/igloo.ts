import { World, WorldContext } from "@server/socket-server/world/world";
import { XtHandler } from "../xt";
import { Igloo, IglooFurniture, PenguinJson, PenguinRepository } from "@server/database/database";

const handler = new XtHandler<WorldContext, ['penguin', 'msg', 'world', 'data', 'db']>(['penguin', 'msg', 'world', 'data', 'db']);

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

export {
  handler as iglooHandler
};