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

export default handler