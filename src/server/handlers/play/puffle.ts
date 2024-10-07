import { Puffle } from "../../database";
import { XtHandler } from "..";

const handler = new XtHandler()

const getPuffleString = (puffle: Puffle): string => {
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

handler.xt('p#pn', (client, puffleType, puffleName) => {
  const PUFFLE_COST = 800
  if (client.penguin.coins < PUFFLE_COST) {
    // TODO no coins error
  } else if (false) {
    // TODO too many puffles error
  }
  client.removeCoins(PUFFLE_COST)
  const puffle = client.addPuffle(Number(puffleType), puffleName);
  client.sendXt('pn', client.penguin.coins, getPuffleString(puffle));

  // TODO send puffle postcard
  // TODO favorite item code in houdini?
  // TODO 'pgu'
})

// get puffles in igloo
handler.xt('p#pg', (client, id) => {
  const puffles = client.penguin.puffles.map((puffle) => {
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

  client.sendXt('pg', ...puffles);
})

// walking puffle
handler.xt('p#pw', (client, puffleId, walking) => {
  const id = Number(puffleId);
  const isWalking = walking === '1';

  // TODO add puffle refusing to walk

  client.walkPuffle(id);

  // TODO make the room send XT to everyone
  client.sendXt('pw', client.id, `${id}||||||||||||${walking}`);
})

handler.xt('s#upa', (client, item) => {
  const itemId = Number(item);
  
  client.penguin.hand = itemId;
  client.update()
  // TODO make the room send XT to everyone
  client.sendXt('upa', client.id, itemId)
})

export default handler