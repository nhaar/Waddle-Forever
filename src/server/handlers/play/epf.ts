import { ITEMS } from "../../game-logic/items";
import { Handler } from "..";

const handler = new Handler();

// check if is an epf agent
handler.xt('f#epfga', (client) => {
  client.sendXt('epfga', client.penguin.isAgent ? 1 : 0);
});

// check if there is an active field ops
handler.xt('f#epfgf', (client) => {
  // sends an integer boolean, FALSE if there is an active field ops
  // that wasn't done
  client.sendXt('epfgf', 0);
});

// client requesting epf medals
handler.xt('f#epfgr', (client) => {
  client.sendXt('epfgr', client.penguin.careerMedals, client.penguin.ownedMedals);
});

// buying item from EPF catalogue
handler.xt('f#epfai', (client, itemId) => {
  const item = ITEMS.get(Number(itemId));
  if (item === undefined) {
    throw new Error(`Item not found in database ${itemId}`);
  }
  if (!item.isEPF) {
    throw new Error(`Item ${itemId} is marked as not being from EPF, but is being bought through it`);
  }

  client.penguin.addItem(item.id);
  client.penguin.removeEpfMedals(client.getCost(item));

  client.sendXt('epfai', client.penguin.ownedMedals);
  client.update();
})

// becoming an agent
handler.xt('f#epfsa', (client) => {
  client.penguin.makeAgent();
  client.sendXt('epfsa', 1); // 1 is "true" for being agent
  client.update();
})

// add medals from completing PSA mission
handler.xt('f#epfgrantreward', (client, medals) => {
  client.penguin.addEpfMedals(Number(medals));
  client.update();
});

export default handler