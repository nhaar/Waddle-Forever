import { XtHandler } from "..";

const handler = new XtHandler();

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
  client.addFurniture(Number(furniture), Number(cost));
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
  client.penguin.igloo.flooring = Number(floor);
  client.update();

  client.sendXt('ag', floor, client.penguin.coins);
})

// buying igloo
handler.xt('g#au', (client, igloo) => {
  client.penguin.iglooTypes[igloo] = true;
  
  client.sendXt('au', igloo, client.penguin.coins);
})

// saving igloo type
handler.xt('g#ao', (client, igloo) => {
  client.penguin.igloo.type = Number(igloo);
  client.update();
})

export default handler;