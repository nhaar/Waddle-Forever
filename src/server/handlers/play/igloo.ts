import { getFlooringCost, getIglooCost } from "../../game/iglooItems";
import { Handler } from "..";
import { Client } from "../../../server/client";
import { IglooFurniture } from "../../../server/database";

const handler = new Handler();

// get igloo information
handler.xt('g#gm', (client, id) => {
  client.sendXt('gm', id, client.getIglooString());
})

// get all owned igloo types
handler.xt('g#go', (client) => {
  const iglooTypes = client.penguin.getIglooTypes()
  client.sendXt('go', iglooTypes.join('|'))
})

handler.xt('g#gf', (client) => {
  client.sendXt('gf', client.getFurnitureString())
})

// COST is not in normal files, needs to be added manually to client
handler.xt('g#af', (client, furniture, cost) => {
  client.buyFurniture(Number(furniture), { cost: Number(cost) });
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
handler.xt('g#ur', (client, ...furnitureItems) => {
  const igloo = processFurniture(furnitureItems);
  if (igloo.length === 99) {
    addFullHouseStamp(client);
  }
  client.penguin.updateIgloo({ furniture: igloo });
  client.update();
})

// save the igloo music (v2)
handler.xt('g#um', (client, music) => {
  client.penguin.updateIgloo({ music: Number(music) });
  client.update();
})

// buying flooring
handler.xt('g#ag', (client, floor) => {
  const flooring = Number(floor);
  const cost = getFlooringCost(flooring);
  if (client.isEngine2) {
    // in this engine, flooring inventory did not exist
    // and buying immediately applied the flooring
    client.penguin.updateIgloo({ flooring });
  } else {
    client.penguin.addFlooring(flooring);
  }
  client.penguin.removeCoins(cost);

  client.sendXt('ag', floor, client.penguin.coins);
  client.update();
})

// buying igloo
handler.xt('g#au', (client, igloo) => {
  const iglooId = Number(igloo);
  // TODO refactoring igloo cost
  const cost = getIglooCost(iglooId);
  if (cost !== undefined) {
    client.penguin.removeCoins(cost);
  }
  client.penguin.addIgloo(iglooId);
  client.sendXt('au', igloo, client.penguin.coins);
  client.update();
})

// saving igloo type
handler.xt('g#ao', (client, igloo) => {
  client.penguin.updateIgloo({ type: Number(igloo)});
  client.update();
})

handler.xt('musictrack#getmymusictracks', (client) => {
  const playerTracks: string[] = []; // TODO player tracks
  client.sendXt('getmymusictracks', playerTracks.length, playerTracks.join(','));
})

// get igloo likes
handler.xt('g#gili', (client) => {
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
handler.xt('g#ggd', (client) => {
  client.sendXt('ggd', '');
})

// get all igloo layouts
handler.xt('g#gail', (client) => {
  const layouts = client.penguin.getAllIglooLayouts().map((layout, index) => {
    return Client.getEngine3IglooString(layout, index);
  });
  // TODO unsure what the 0 is
  client.sendXt('gail', client.penguin.id, 0, ...layouts);
})

// update igloo (v3)
handler.xt('g#uic', (client, layoutId, type, flooring, location, music, furnitureData) => {
  client.penguin.setActiveIgloo(Number(layoutId));

  // if empty, the split function used will cause issues with ghost furniture
  const furniture = furnitureData === '' ? [] : processFurniture(furnitureData.split(','));
  if (furniture.length >= 99) {
    addFullHouseStamp(client);
  }
  client.penguin.updateIgloo({ type: Number(type), music: Number(music), flooring: Number(flooring), location: Number(location), furniture });
  client.update();
});

// add layout
handler.xt('g#al', (client) => {
  const igloo = client.penguin.addIglooLayout();
  
  // TODO document better what this slot-index is for in the engine 3 string
  const slot = client.penguin.getAllIglooLayouts().length;
  
  client.sendXt('al', client.penguin.id, Client.getEngine3IglooString(igloo, slot));
  client.update();
});

// update active igloo layout
handler.xt('g#uiss', (client, layoutId) => {
  // TODO what is 2nd argument for? (combination of slots and if they are locked)
  client.penguin.setActiveIgloo(Number(layoutId));
  client.update();
});

// add location
handler.xt('g#aloc', (client, location) => {
  // TODO adding cost deducting
  client.penguin.addIglooLocation(Number(location));
  client.sendXt('aloc', location, client.penguin.coins);
  client.update();
});

export default handler;