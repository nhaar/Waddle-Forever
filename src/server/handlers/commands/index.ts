import { XtHandler } from "..";
import { items } from "../../game/item";
import { Room } from "../../game/rooms";


const handler = new XtHandler();

handler.xt('m#sm', (client, id, message) => {
  if (message.startsWith('!ai')) {
    if (message.match(/!ai\s+all/) !== null) {
      const allItems = Object.values(items);
      client.addItems(allItems.map((item) => item.id));
    } else {
      const numberMatch = message.match(/!ai\s+(\d+)/);
      if (numberMatch !== null) {
        const itemId = Number(numberMatch[1]);
        client.addItem(itemId);
      }
    }
  } else if (message.startsWith('!ac')) {
    const numberMatch = message.match(/!ac\s+(\d+)/);
    if (numberMatch !== null) {
      client.addCoins(Number(numberMatch[1]));
      client.sendPenguinInfo();
    }
  } else if (message.startsWith('!jr')) {
    const numberMatch = message.match(/!jr\s+(\d+)/);
    if (numberMatch !== null) {
      client.joinRoom(Number(numberMatch[1]));
    }
  } else if (message.startsWith('!epf')) {
    client.joinRoom(Room.VRRoom);
  } else if (message.startsWith('!awards')) {
    // grant m7-m11 awards for speedrunning
    const awards = [815, 817, 819, 822, 8007];
    awards.forEach((award) => {
      client.addItem(award);
    });
  } else if (message.startsWith('!age')) {
    const numberMatch = message.match(/!age\s+(\d+)/);
    if (numberMatch !== null) {
      client.setAge(Number(numberMatch[1]));
      client.sendPenguinInfo();
    }
  } else if (message.startsWith('!rename')) {
    const nameMatch = message.match(/!rename\s+([\d\w]+)/);
    if (nameMatch !== null) {
      client.setName(nameMatch[1]);
      client.sendPenguinInfo();
    }
  } else if (message.startsWith('!member')) {
    client.swapMember();
    client.sendPenguinInfo();
  }
});

export default handler;