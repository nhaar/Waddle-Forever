import { isLiteralScoreGame } from "@server/game-logic/rooms";
import { getPenguinString } from "./join";
import { GameGuard, GameHandler, } from "../handlers";

export const handleLeaveGame: GameHandler<[number]> = (ctx, score) => {
  const { game, data, penguin, msg, prst } = ctx;

  const rawCoins = isLiteralScoreGame(game.getId()) ? (
    Number(score)
  ) : (
    Math.floor(Number(score) / 10)
  );
  
  if (data.isPreCpip()) {
    penguin.currency.add(rawCoins);
    msg.send(penguin, 'zo');
  } else {
    const gameStamps = data.getGameStamps(game.getId());
    const sessionStamps = penguin.stampbook.sessionStamps.filter(stamp => gameStamps.has(stamp));
    const collectedCount = [...gameStamps.values()].filter(stamp => penguin.stampbook.has(stamp)).length;
    const totalCount = gameStamps.size;
    const coins = ((totalCount > 0 && collectedCount === totalCount) ? 2 : 1) * rawCoins;

    penguin.stampbook.resetSessionStamps();

    // unknown what last 0 means
    msg.send(penguin, 'zo', penguin.currency.add(coins), sessionStamps.join('|'), collectedCount, totalCount, 0);
  }

  prst(penguin);
}

export const isGameGuard: GameGuard = (ctx) => ctx.game !== undefined;

export const handleRoomRefresh: GameHandler<[]> = ({ msg, data, penguin }) => {
  msg.send(penguin, 'grs', penguin.id, getPenguinString(data, penguin, { x:0,y:0,frame:1 }));
}