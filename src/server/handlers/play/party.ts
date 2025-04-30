import { Handler } from "..";

const handler = new Handler();

// donate coins for coins for change
handler.xt('e#dc', (client, choice, coins) => {
  // choice is useless, since we are not trying to rewrite history unfortunately
  const donationAmount = Number(coins);

  // client doesn't check if can donate
  if (client.penguin.coins >= donationAmount) {
    client.penguin.removeCoins(donationAmount);
  } else {
    client.sendError(401);
  }

  client.sendXt('dc', client.penguin.coins);
  client.update();
})

export default handler;