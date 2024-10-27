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

export default handler;