import { ITEMS } from "../../game-logic/items";
import { Handler } from "..";
import { Handle } from "../handles";

const handler = new Handler();

// check if is an epf agent
handler.xt(Handle.GetEpfStatus, (client) => {
  client.sendXt('epfga', client.penguin.isAgent ? 1 : 0);
});

// check if there is an active field ops
handler.xt(Handle.GetFieldOps, (client) => {
  // sends an integer boolean, FALSE if there is an active field ops
  // that wasn't done
  client.sendXt('epfgf', 0);
});

// client requesting epf medals
handler.xt(Handle.GetEpfMedals, (client) => {
  client.sendXt('epfgr', client.penguin.careerMedals, client.penguin.ownedMedals);
});

// buying item from EPF catalogue
handler.xt(Handle.AddEpfItem, (client, itemId) => {
  const item = ITEMS.get(itemId);
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
handler.xt(Handle.BecomeEpfAgent, (client) => {
  client.penguin.makeAgent();
  client.sendXt('epfsa', 1); // 1 is "true" for being agent
  client.update();
})

// add medals from completing PSA mission
handler.xt(Handle.GrantEpfMedals, (client, medals) => {
  client.penguin.addEpfMedals(medals);
  client.update();
});

// epf stamps, a seemingly unused system that was only implemented for one stamp of system defender
handler.xt(Handle.EPFStamps, (client, stamp) => {
  if (!client.penguin.isAgent) {
    client.sendXt('epfsf', 'naa'); // TODO document
  }

  if (client.penguin.hasStamp(stamp)) {
    client.sendXt('epfsf', 'ahm'); // TODO document
  } else {
    client.sendXt('epfsf', 'nem', stamp); // giving the stamp
  }
});

export default handler