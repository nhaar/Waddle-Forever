import { Client } from "../../../server/client";
import { Handler } from "..";
import { ITEMS } from "../../game-logic/items";
import { Room } from "../../game-logic/rooms";

const handler = new Handler();

export const commandsHandler = (client: Client, id: string, message: string) => {
  // Map the name of the command, and the function that runs when it is called
  const commands: Record<string, () => void> = {
    'ai': () => {
      if (message.match(/!ai\s+all/) !== null) {
        const allItems = ITEMS.rows;
        client.addItems(allItems.map((item) => item.id));
      } else {
        const numberMatch = message.match(/!ai\s+(\d+)/);
        if (numberMatch !== null) {
          const itemId = Number(numberMatch[1]);
          client.buyItem(itemId);
        }
      }
      client.update();
    },
    'ac': () => {
      const numberMatch = message.match(/!ac\s+(\d+)/);
      // TODO user data validation! (in all commands)
      if (numberMatch !== null) {
        client.penguin.addCoins(Number(numberMatch[1]));
        if (client.isEngine1) {
          client.sendEngine1Coins();
        } else {
          client.sendPenguinInfo();
        }
      }
      client.update();
    },
    'jr': () => {
      const numberMatch = message.match(/!jr\s+(\d+)/);
      if (numberMatch !== null) {
        client.joinRoom(Number(numberMatch[1]));
      }
    },
    'systemdefender': () => {
      client.joinRoom(950);
    },
    'pufflelaunch': () => {
      client.joinRoom(955);
    },
    'plunlocklevels': () => {
      client.unlockPuffleLaunchLevels();
    },
    'plunlocktimeattack': () => {
      client.unlockPuffleLaunchTimeAttack();
    },
    'plunlockturbo': () => {
      client.unlockTurboMode();
    },
    'plunlockslowmode': () => {
      client.unlockSlowMode();
    },
    'epf': () => {
      client.joinRoom(Room.VRRoom);
    },
    'awards': () => {
      // grant m7-m11 awards for speedrunning
      const awards = [815, 817, 819, 822, 8007];
      awards.forEach((award) => {
        client.buyItem(award);
      });
      client.update();
    },
    'age': () => {
      const numberMatch = message.match(/!age\s+(\d+)/);
      if (numberMatch !== null) {
        client.penguin.setAge(Number(numberMatch[1]));
        client.sendPenguinInfo();
      }
      client.update();
    },
    'rename': () => {
      const nameMatch = message.match(/!rename\s+([\d\w]+)/);
      if (nameMatch !== null) {
        client.penguin.changeName(nameMatch[1]);
        client.sendPenguinInfo();
      }
      client.update();
    },
    'member': () => {
      client.penguin.swapMember();
      client.sendPenguinInfo();
      client.update();
    },
    'af': () => {
      // add 1 in-case there was no amount supplied
      const numberMatches = (message + ' 1').match(/!af\s+(\d+)\s+(\d+)/)
      if (numberMatches !== null) {
        const furniture = Number(numberMatches[1])
        const amount = Number(numberMatches[2])

        const ownedAmount = client.penguin.getFurnitureOwnedAmount(furniture);
        const addAmount = Math.max(Math.min(amount, 99 - ownedAmount), 0);
        client.penguin.addFurniture(furniture, addAmount);
        client.update();
        for (let i = 0; i < addAmount; i++) {
          client.sendXt('af', furniture, client.penguin.coins);
        }
      }
      client.update();
    }
  }

  const commandMatch = message.match(/^\!(\w+)/);
  if (commandMatch !== null) {
    const keyword = commandMatch[1];
    const callback = commands[keyword];
    if (callback !== undefined) {
      callback();
    } else {
      console.log(`Attempted to use command ${keyword}, but it doesn't exist`);
    }
  }
}

handler.xt('m#sm', commandsHandler);

handler.xt('m#sm', (client, id, message) => {
  client.sendRoomXt('sm', id, message);
});

export default handler;