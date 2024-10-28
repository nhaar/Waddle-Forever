import { XtHandler } from "..";

const handler = new XtHandler();

// get igloo information
handler.xt('g#gm', (client, id) => {
  client.sendXt('gm', id, client.getIglooString());
})

// unsure what this does atm
handler.xt('g#go', (client) => {
  client.sendXt('go', '0')
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

export default handler;