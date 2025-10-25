import { getFlooringCost, getIglooCost } from "../../game-logic/iglooItems";
import { Handler } from "..";
import { Client } from "../../../server/client";
import { IglooFurniture } from "../../../server/database";
import { Handle } from "../handles";
import { isLower } from "../../../server/routes/versions";
import { FURNITURE } from "../../../server/game-logic/furniture";

const handler = new Handler();

// get igloo information
handler.xt(Handle.GetIgloo, (client, id) => {
  let igloo: string;
  if (client.penguin.id === id) {
    igloo = client.getOwnIglooString();
  } else {
    igloo = client.getIglooString(client.server.getIgloo(Number(id)));
  }
  client.sendXt('gm', id, igloo);
})

// get all owned igloo types
handler.xt(Handle.GetIglooTypes, (client) => {
  const iglooTypes = client.penguin.getIglooTypes()
  client.sendXt('go', iglooTypes.join('|'))
})

handler.xt(Handle.GetFurniture, (client) => {
  client.sendXt('gf', client.getFurnitureString())
})

handler.xt(Handle.AddFurniture, (client, furniture) => {
  const item = FURNITURE.getStrict(furniture);
  client.buyFurniture(furniture, { cost: item.cost });
  client.update();
})

function processFurniture(furnitureItems: string[]): IglooFurniture {
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

function addFullHouseStamp(client: Client) {
  client.giveStamp(23);
}

// saving client new igloo
handler.xt(Handle.UpdateIgloo, (client, ...furnitureItems) => {
  const igloo = processFurniture(furnitureItems);
  if (igloo.length === 99) {
    addFullHouseStamp(client);
  }
  client.penguin.updateIgloo({ furniture: igloo });
  client.update();
})

// save the igloo music (v2)
handler.xt(Handle.UpdateIglooMusic, (client, music) => {
  client.penguin.updateIgloo({ music });
  client.update();
})

// buying flooring
handler.xt(Handle.AddFlooring, (client, flooring) => {
  const cost = getFlooringCost(flooring);
  if (client.isEngine2) {
    // in this engine, flooring inventory did not exist
    // and buying immediately applied the flooring
    client.penguin.updateIgloo({ flooring });
  } else {
    client.penguin.addFlooring(flooring);
  }
  client.penguin.removeCoins(cost);

  client.sendXt('ag', flooring, client.penguin.coins);
  client.update();
})

function discountIglooTypeCost(client: Client, type: number): void {
  const cost = getIglooCost(type);
  if (cost !== undefined) {
    client.penguin.removeCoins(cost);
  }
}

// buying igloo
handler.xt(Handle.AddIgloo, (client, igloo) => {
  discountIglooTypeCost(client, igloo);
  client.penguin.addIgloo(igloo);
  client.sendXt('au', igloo, client.penguin.coins);
  client.update();
})

// saving igloo type
handler.xt(Handle.UpdateIglooType, (client, type) => {
  // adding support to the recreation of how it worked pre owned igloos (updating igloo type costed money)
  if (isLower(client.version, '2010-08-26')) {
    discountIglooTypeCost(client, type);
    // a bit of a hack to notify the client of the coin change
    client.sendXt('au', type, client.penguin.coins);
  }

  client.penguin.updateIgloo({ type });
  client.update();
})

handler.xt(Handle.GetMusicTracks, (client) => {
  const playerTracks: string[] = []; // TODO player tracks
  client.sendXt('getmymusictracks', playerTracks.length, playerTracks.join(','));
})

// get igloo likes
handler.xt(Handle.GetIglooLikes, (client) => {
  const id = 1; // TODO Unsure what this ID is
  const likeCount = 0; // TODO like system
  // TODO unsure what this 200 is
  client.sendXt('gili', id, 200, JSON.stringify({
    likedby: {
      counts: {
        count: likeCount,
        maxCount: likeCount,
        accumCount: likeCount
      },
      IDs: []
    }
  }));
})

// get DJ3K tracks
handler.xt(Handle.GetDj3kTracks, (client) => {
  client.sendXt('ggd', '');
})

// get all igloo layouts
handler.xt(Handle.GetAllIglooLayouts, (client) => {
  const layouts = client.penguin.getAllIglooLayouts().map((layout, index) => {
    return Client.getEngine3IglooString(layout, index);
  });
  // TODO unsure what the 0 is
  client.sendXt('gail', client.penguin.id, 0, ...layouts);
})

// update igloo (v3)
handler.xt(Handle.UpdateIglooNew, (client, layoutId, type, flooring, location, music, furnitureData) => {
  client.penguin.setActiveIgloo(layoutId);

  // if empty, the split function used will cause issues with ghost furniture
  const furniture = furnitureData === '' ? [] : processFurniture(furnitureData.split(','));
  if (furniture.length >= 99) {
    addFullHouseStamp(client);
  }
  client.penguin.updateIgloo({ type, music, flooring, location, furniture });
  client.update();
});

// add layout
handler.xt(Handle.AddIglooLayout, (client) => {
  const igloo = client.penguin.addIglooLayout();
  
  // TODO document better what this slot-index is for in the engine 3 string
  const slot = client.penguin.getAllIglooLayouts().length;
  
  client.sendXt('al', client.penguin.id, Client.getEngine3IglooString(igloo, slot));
  client.update();
});

// update active igloo layout
handler.xt(Handle.UpdateIglooLayout, (client, layoutId) => {
  // TODO what is 2nd argument for? (combination of slots and if they are locked)
  client.penguin.setActiveIgloo(layoutId);
  client.update();
});

// add location
handler.xt(Handle.AddIglooLocation, (client, location) => {
  // TODO adding cost deducting
  client.penguin.addIglooLocation(location);
  client.sendXt('aloc', location, client.penguin.coins);
  client.update();
});

// open igloo
handler.xt(Handle.OpenIgloo, (client, id, name) => {
  client.server.openIgloo(client.penguin.id, client.penguin.activeIgloo);
});

// close igloo
handler.xt(Handle.CloseIgloo, (client, id) => {
  client.server.closeIgloo(client.penguin.id);
});

// get all open igloos
handler.xt(Handle.GetOpenIgloos, (client) => {
  const players = client.server.getOpenIglooPlayers();

  // TODO need to figure out how to make this penguin "nickname" properly display
  // on showHint, without modding. Seems to require an old shell
  // (and for the newer shells, what is the proper map SWF to use?)
  client.sendXtEmptyLast('gr', ...players.map(p => `${p.penguin.id}|${p.penguin.name}`));
});

export default handler;