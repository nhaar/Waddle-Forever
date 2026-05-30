import { logdebugerr } from "@server/logger";
import { BOARD, getAllPlayers, STARTER_ENERGY } from "../world/fire";
import { FireGuard, FireHandler } from "./handlers";
import { chooseN } from "@common/utils";

export const isFireGuard: FireGuard = () => true;

export const handleEnterFireGame: FireHandler<[]> = async ({ fire, penguin, msg }) => {
  const seatId = fire.getSeatId(penguin);
  
  await msg.send(penguin, 'jz', seatId);
  
  const players = fire.getPlayers();

  await msg.send(
    penguin, 'sz',
    0, // id of player that is playing, which is always 0?
    players.map(p => p.name).join(','),
    players.map(p => p.inventory.color).join(','),
    players.map(_ => STARTER_ENERGY).join(','),
    fire.positions.join(','),
    chooseN(penguin.ninja.getDeck(), 5).join(','),
    fire.spin.join(','),
    players.map(p => p.ninja.cardRank).join(','),
    '' // unused
  );
}

const handleClickSpinner: FireHandler<[number]> = ({ msg, fire }, tablet) => {
  msg.send(fire.getPlayers(), 'zm', 'is', '' /* unused */, tablet);
}

const handleStartBattle: FireHandler<['b' | 'f' | 'w' | 's', number[]]> = async ({ fire, msg }, type, players) => {
  const [battle, trump] = type === 'b' ? ['be', ''] : ['bt', type];
  await msg.send(fire.getPlayers(), 'zm', 'sb', battle, players.join(','), trump);
}

const handleChooseOpponent: FireHandler<[number[]]> = async ({ msg, fire }, pool) => {
  msg.send(fire.getPlayers(), 'zm', 'co', '' /* unused */, pool.join(','));
}

const handleClickBoard: FireHandler<[number]> = async (ctx, tile) => {
  const { msg, fire, penguin } = ctx;
  const playersInTile = fire.positions
    .map((t, i) => t === tile ? i : null)
    .filter((i): i is number => i !== null);
  
  fire.updatePosition(fire.getSeatId(penguin), tile);
  
  await msg.send(
    fire.getPlayers(), 'zm', 'ub',
    fire.getSeatId(penguin),
    fire.positions.join(','),
    0 // unknown, more testing needed
  );

  if (playersInTile.length > 0) {
    if (playersInTile.length === 1) {
      await handleStartBattle(ctx, 'b', playersInTile);
    } else {
      await handleChooseOpponent(ctx, playersInTile);
    }
  } else {
    const type = BOARD[tile];

    if (type === 'b') {
      if (fire.getPlayers().length > 2) {
        await handleChooseOpponent(ctx, getAllPlayers(fire.getPlayers()));
      } else {
        await handleStartBattle(ctx, type, getAllPlayers(fire.getPlayers()));
      }
    } else if (type === 'c') {
      await msg.send(fire.getPlayers(), 'zm', 'ct');
    } else {
      await handleStartBattle(ctx, type, getAllPlayers(fire.getPlayers()));
    }
  }
}

export const handleFireMove: FireHandler<string[]> = (ctx, action, ...rest) => {
  switch (action) {
    case 'is':
      handleClickSpinner(ctx, Number(rest[1]));
      break;
    case 'cb':
      handleClickBoard(ctx, Number(rest[0]));
      break;
    default:
      logdebugerr('unknown cjfire action: ' + action);
  }
}
