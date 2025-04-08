import { getFlooringCost, getIglooCost } from "../../game/iglooItems";
import { Handler } from "..";

const handler = new Handler();

// get igloo information
handler.xt('g#gm', (client, id) => {
  client.sendXt('gm', id, client.getIglooString());
})

// get all owned igloo types
handler.xt('g#go', (client) => {
  const iglooTypes = Object.keys(client.penguin.iglooTypes)
  client.sendXt('go', iglooTypes.join('|'))
})

handler.xt('g#gf', (client) => {
  client.sendXt('gf', client.getFurnitureString())
})

// COST is not in normal files, needs to be added manually to client
handler.xt('g#af', (client, furniture, cost) => {
  client.addFurniture(Number(furniture), { cost: Number(cost) });
})

// saving client new igloo
handler.xt('g#ur', (client, ...furnitureItems) => {
  const igloo = furnitureItems.map((furnitureString) => {
    const [furniture, x, y, rotation, frame] = furnitureString.split('|').map((str) => Number(str))
    return {
      id: furniture,
      x,
      y,
      rotation,
      frame
    }
  })
  if (igloo.length === 99) {
    // FULL HOUSE
    client.giveStamp(23);
  }
  client.updateIglooFurniture(igloo);
})

// save the igloo music
handler.xt('g#um', (client, music) => {
  client.penguin.igloo.music = Number(music);
  client.update();
})

// buying flooring
handler.xt('g#ag', (client, floor) => {
  const flooring = Number(floor);
  const cost = getFlooringCost(flooring);
  client.removeCoins(cost);
  client.penguin.igloo.flooring = flooring;
  client.update();

  client.sendXt('ag', floor, client.penguin.coins);
})

// buying igloo
handler.xt('g#au', (client, igloo) => {
  const cost = getIglooCost(Number(igloo));
  client.removeCoins(cost);
  client.penguin.iglooTypes[igloo] = 1;
  client.update();
  client.sendXt('au', igloo, client.penguin.coins);
})

// saving igloo type
handler.xt('g#ao', (client, igloo) => {
  client.penguin.igloo.type = Number(igloo);
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

export default handler;