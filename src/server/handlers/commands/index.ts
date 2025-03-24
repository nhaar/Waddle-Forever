import { Client } from "../../../server/penguin";
import { XtHandler } from "..";
import { items } from "../../game/item";
import { Room } from "../../game/rooms";
import { isAs1 } from "../../../server/routes/versions";


const handler = new XtHandler();

export const commandsHandler = (client: Client, id: string, message: string) => {
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
      if (isAs1(client.version)) {
        client.sendAs1Coins();
      } else {
        client.sendPenguinInfo();
      }
    }
  } else if (message.startsWith('!jr')) {
    const numberMatch = message.match(/!jr\s+(\d+)/);
    if (numberMatch !== null) {
      client.joinRoom(Number(numberMatch[1]));
    }
  } else if (message.startsWith('!systemdefender')) {
    client.joinRoom(950);
  } else if (message.startsWith('!pufflelaunch')) {
    client.joinRoom(955);
  } else if (message.startsWith('!plunlocklevels')) {
    client.unlockPuffleLaunchLevels();
  } else if(message.startsWith('!plunlocktimeattack')) {
    client.unlockPuffleLaunchTimeAttack();
  } else if (message.startsWith('!plunlockturbo')) {
    client.unlockTurboMode();
  } else if (message.startsWith('!plunlockslowmode')) {
    client.unlockSlowMode();
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
  } else if (message.startsWith('!af')) {
    // add 1 in-case there was no amount supplied
    const numberMatches = (message + ' 1').match(/!af\s+(\d+)\s+(\d+)/)
    if (numberMatches !== null) {
      const furniture = Number(numberMatches[1])
      const amount = Number(numberMatches[2])
      if (client.penguin.furniture[furniture] === undefined) {
        client.penguin.furniture[furniture] = 0
      }
      const addAmount = Math.max(Math.min(amount, 99 - client.penguin.furniture[furniture]), 0);
      client.penguin.furniture[furniture] += addAmount;
      client.update();
      for (let i = 0; i < addAmount; i++) {
        client.sendXt('af', furniture, client.penguin.coins);
      }
    }
  }
}

// TODO better system here
handler.xt('m#sm', commandsHandler);

export default handler;