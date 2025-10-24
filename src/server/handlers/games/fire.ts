import { WaddleName } from "../../../server/game-logic/waddles";
import { Client, WaddleGame } from "../../../server/client";
import { WaddleHandler } from "./waddle";
import { Handle } from "../handles";
import { randomInt } from "../../../common/utils";
import { CardJitsu, Hand } from "./card";
import { CardElement, CARDS } from "../../../server/game-logic/cards";

/** Descriptor used to know what end round animation the player is going through */
enum NinjaState {
  LosingRound = 1,
  TyingRound = 2,
  WinnningRound = 4
}

abstract class Ninja {
  private _energy: number;
  /** Cards not on hand */
  private _deck: Hand;
  /** Cards the ninja can play */
  private _hand: number[];
  private _seat: number;

  /** Coordinate of tile, being the index of the BOARD array the tile is */
  private _currentTile: number;

  /** Current chosen card or undefined, if the card exists then the number is the index of the card in the player's hand */
  private _chosen: number | undefined;

  private _state: NinjaState | undefined;

  /** Whether the ninja is ready after a battle occured */
  ready: boolean = false;

  constructor(deck: number[], seat: number, tile: number) {
    this._energy = 6;
    this._deck = new Hand(deck);
    this._seat = seat;
    this._hand = [];
    this._currentTile = tile;
    for (let i = 0; i < 5; i++) {
      this._hand.push(this._deck.draw());
    }
  }

  get energy() {
    return this._energy;
  }

  get hand() {
    return this._hand;
  }

  get seat() {
    return this._seat;
  }

  get tile() {
    return this._currentTile;
  }

  move(tile: number) {
    this._currentTile = tile;
  }

  get chosen() {
    return this._chosen ?? (() => { throw new Error('Did not initialize card');})();
  }

  choose(cardIndex: number) {
    this._chosen = cardIndex;
  }

  setState(state: number) {
    this._state = state;
  }

  addEnergy(energy: number) {
    this._energy += energy;
  }

  getCard(index: number) {
    return CARDS.getStrict(this._hand[index]);
  }

  get state() {
    if (this._state === undefined) {
      throw new Error('Ninja state not initialized');
    }
    return this._state;
  }

  hasChosen() {
    return this._chosen !== undefined;
  }

  draw() {
    this._hand[this.chosen] = this._deck.draw();
  }

  unchoose() {
    this._chosen = undefined;
  }
}

/** Ninja that is controllable by a player */
class NinjaPlayer extends Ninja {
  private _player: Client;
  
  constructor(player: Client, seat: number, tile: number) {
    super(player.penguin.getDeck(), seat, tile);
    this._player = player;
  }

  get player() {
    return this._player;
  }
}

/** Represents the different tiles. There are the elemental tiles, and then the one for a card-jitsu battle ('b')
 * and one for choosing the elements 'c'
 */
type TileType = CardElement | 'b' | 'c';

enum BattleType {
  /** Represents the battle of cards of the same elements, which acts like "trump" */
  BattleTrump = 'bt',
  /** Represents a Card-Jitsu type battle across elements */
  BattleElements = 'be'
};

/** Class that handles the winning order of the players */
class Podium {
  private _position: number;
  private _podium: Array<number>;

  constructor(capacity: number) {
    this._position = capacity;
    this._podium = new Array(capacity).fill(undefined);
  }

  /** Add player of a given index to the topmost available position */
  addPlayer(seatIndex: number) {
    this._podium[seatIndex] = this._position;
    this._position--;

    if (this._position === 1) {
      // find the remaining one and set as 1
      const winner = this._podium.findIndex(v => v === undefined);
      this._podium[winner] = 1;
    }
  }

  get positions() {
    return this._podium;
  }

  get isFinished() {
    return this._position === 1;
  }

  getPosition(seat: number) {
    return this._podium[seat];
  }
}

export class CardJitsuFire extends WaddleGame {
  public roomId = 997;

  public name: WaddleName = 'fire';

  private _ninjas: Ninja[] = [];

  private _currentPlayerIndex: number = 0;

  /** How many tiles away from current the player can choose from */
  private _spinAmount: number | undefined;
  /** Coordinate of pickable tile on clockwise position */
  private _moveClockwise: number | undefined;
  /** Coordinate of pickable tile on anticlockwise position */
  private _moveAnticlockwise: number | undefined;

  private _battleType: BattleType = BattleType.BattleTrump;
  private _battleNinjas: Ninja[] = [];
  private _battleElement: CardElement | undefined;

  private _podium: Podium;

  /** Position the players spawn in */
  static DEFAULT_TILES = [0, 8, 4, 12];

  static CLICK_SPINNER_ACTION = 'is';
  static CHOOSE_TILE = 'cb';
  static CHOOSE_CARD = 'cc';
  static INFO_READY = 'ir';
  static CHOOSE_ELEMENT_ACTION = 'ct';
  static BOARD: TileType[] = [
    'b', 's', 'w', 'f', 'c',
    's', 'f', 'w', 'b', 's',
    'w', 'f', 'c', 'w', 's', 'f'
  ];

  constructor(players: Client[]) {
    super(players);

    players.forEach((p, i) => {
      this._ninjas.push(new NinjaPlayer(p, i, CardJitsuFire.DEFAULT_TILES[i]));
    });

    this._podium = new Podium(this._ninjas.length);
  
    this.spinBoard();
  }

  get ninjas() {
    return this._ninjas;
  }

  get spin() {
    if (this._spinAmount === undefined || this._moveClockwise === undefined || this._moveAnticlockwise === undefined) {
      throw new Error('Has not initialized spins');
    }
    return [this._spinAmount, this._moveClockwise, this._moveAnticlockwise];
  }

  nextPlayer() {
    this._currentPlayerIndex++;
    if (this._currentPlayerIndex >= this._ninjas.length) {
      this._currentPlayerIndex = 0;
    }
  }

  /** Spins the board internally, the player has yet to make a choice but the pickable options are chosen */
  spinBoard() {
    // TODO research how the spin worked!
    this._spinAmount = randomInt(1, 6);

    const playerPosition = this.currentPlayer.tile;

    // finding tiles that are spin amount away from player in each direction
    this._moveClockwise = (playerPosition + this._spinAmount) % 16;
    this._moveAnticlockwise = (((playerPosition - this._spinAmount) % 16) + 16) % 16;
  }

  /** A player clicks on a specific spinner stone (one of the 6 stones in the middle) */
  clickSpinner(tile: number) {
    this.sendXt('zm', CardJitsuFire.CLICK_SPINNER_ACTION, this.currentPlayer.seat, tile);
  }

  private get currentPlayer() {
    return this._ninjas[this._currentPlayerIndex];
  }

  /** The current player chooses a tile to jump to */
  chooseTile(tile: number) {
    let tileType: TileType;
    this.currentPlayer.move(tile);
    
    // TODO what is this 1 at the end? tab Id?
    // updating the board for the client
    this.sendXt('zm', 'ub', this.currentPlayer.seat, this.tileIds.join(','), 1);

    this._battleType = BattleType.BattleTrump;
    this._battleNinjas = this._ninjas;

    tileType = CardJitsuFire.BOARD[tile];

    const ninjasOnTile = this.getNinjasOnTile(tile);

    // card-jitsu battle
    if (ninjasOnTile.length > 1 || tileType === 'b') {
      const battleNinjas = ninjasOnTile.length > 1 ? ninjasOnTile : this._ninjas;

      // choosing which player to fight
      if (battleNinjas.length > 2) {
        // TODO refactor "ZM" spam
        // client choosing the opponent
        this.sendXt('zm', 'co', 0, ninjasOnTile.map(n => n.seat).join(','));
      } else {
        const opponent = battleNinjas.find(n => n !== this.currentPlayer);
        if (opponent === undefined) {
          throw new Error('Logic error');
        }
        this.chooseOpponent(opponent);
      }
    } else if (tileType === 'c') {
      // choosing the element
      this.sendXt('zm', 'ct');
    } else {
      this._battleElement = tileType;
      this._battleNinjas = this._ninjas;
      this._battleType = BattleType.BattleTrump;
      this.sendBattle();
    }
  }

  get tileIds() {
    return this._ninjas.map(n => n.tile);
  }

  getNinjasOnTile(tile: number) {
    return this._ninjas.filter(n => n.tile === tile);
  }

  get battleElement() {
    return this._battleElement ?? (() => { throw new Error('Battle element is not initialized'); })();
  }

  sendBattle() {
    this.sendXt('zm', 'sb', this._battleType, this._ninjas.map(n => n.seat).join(','), this.battleElement);
    // TODO timeouts?
  }

  chooseOpponent(opponent: Ninja) {
    this._battleNinjas = [this.currentPlayer, opponent];
    this._battleType = BattleType.BattleElements;
    this.sendBattle();
  }

  /** A ninja chooses which card to play from their hand in the current battle */
  chooseCard(ninja: Ninja, cardIndex: number) {
    ninja.choose(cardIndex);

    // sending to other clients that the card was picked
    this._ninjas.filter((n): n is NinjaPlayer => n !== ninja && n instanceof NinjaPlayer).forEach(n => {
      n.player.sendXt('zm', 'ic', ninja.seat);
    });

    // judging results
    if (this._ninjas.every(n => n.hasChosen())) {
      // TODO timeouts
      this.resolveBattle();

      // add to podium, and ninja will be removed
      this._ninjas.forEach(n => {
        if (n.energy === 0) {
          this._podium.addPlayer(n.seat);
        }
      });

      [...this._ninjas].forEach(n => {
        if (n instanceof NinjaPlayer) {
          n.player.sendXt(
            'zm', 'rb',
            ...[
              this._battleNinjas.map(n => n.seat),
              this._battleNinjas.map(n => n.getCard(n.chosen).id),
              this._battleNinjas.map(n => n.energy),
              this._battleNinjas.map(n => n.state),
              [this._battleType, this._battleElement],
              n.hand,
              this._podium.positions
            ].map(array => array.join(','))
          );

          if (n.energy === 0 || this._podium.isFinished) {
            // TODO end game stamps
            // TODO fire ninja progress
            n.player.sendXt('zm', 'zo', this._podium.positions.join(','));
            this.removeNinja(n)
          }
        }
      });
    }
  }

  removeNinja(ninja: Ninja) {
    this._ninjas = this._ninjas.filter(n => n !== ninja);
  }

  /** End the ongoing battle after all players have played */
  resolveBattle() {
    if (this._battleType === BattleType.BattleElements) {
      const cards = this._battleNinjas.map(n => {
        return n.getCard(n.chosen);
      });

      const [firstElement, secondElement] = cards.map(c => c.element);
      const [firstValue, secondValue] = cards.map(c => c.value);
      const winner = CardJitsu.getWinner(firstElement, secondElement, firstValue, secondValue);

      let states: [number, number];
      let energyChange: [number, number];
      if (winner === -1) {
        // TODO use enum
        states = [NinjaState.TyingRound, NinjaState.TyingRound];
        energyChange = [0, 0];
      } else {
        // default for index 0
        states = [NinjaState.WinnningRound, NinjaState.LosingRound];
        energyChange = [1, -1];
        if (winner === 1) {
          // swapping all values
          [states, energyChange] = [states, energyChange].map(t => {
            return [t[1], t[0]];
          });
        }
      }
      const [firstNinja, secondNinja] = this._battleNinjas;
      firstNinja.setState(states[0]);
      secondNinja.setState(states[1]);
      firstNinja.addEnergy(energyChange[0]);
      secondNinja.addEnergy(energyChange[1]);

      this._battleElement = winner === 0 ? firstElement : secondElement;
    } else if (this._battleType === BattleType.BattleTrump) {
      const battleCardValues = this._battleNinjas.map(n => {
        const card = n.getCard(n.chosen);
        if (card.element === this._battleElement) {
          return card.value;
        } else {
          return 0;
        }
      });

      const highestValue = Math.max(...battleCardValues);
      const hasTie = battleCardValues.filter(v => v === highestValue).length > 1;
      this._battleNinjas.forEach(n => {
        const card = n.getCard(n.chosen);
        if (card.value === highestValue) {
          if (hasTie) {
            n.setState(2);
          } else {
            n.setState(3);
          }
        } else {
          n.setState(1);
          n.addEnergy(-1);
        }
      });
    }
  }

  getNinja(player: Client) {
    return this._ninjas.find(n => {
      if (n instanceof NinjaPlayer) {
        return n.player === player;
      }
      return false;
    }) ?? (() => { throw new Error('Player has no ninja'); })();
  }

  isClientInGame(client: Client) {
    return this._ninjas.some(n => {
      if (n instanceof NinjaPlayer) {
        return n.player === client;
      }
      return false;
    });
  }

  chooseElement(element: CardElement) {
    this._battleElement = element;
    this.sendBattle();
  }

  ninjaReady(ninja: Ninja) {
    ninja.ready = true;

    if (this._ninjas.every(n => n.ready)) {
      this.nextPlayer();
      this.spinBoard();
      this._ninjas.forEach(n => {
        n.draw();
        n.unchoose();
        n.ready = false;

        if (n instanceof NinjaPlayer) {
          n.player.sendXt('zm', 'nt', this.currentPlayer.seat, ...[this.spin, n.hand].map(a => a.join(',')));
        }
      });
      // TODO board timeouts
    }
  }
}

const handler = new WaddleHandler<CardJitsuFire>('fire');

// client enters the game
handler.waddleXt(Handle.EnterWaddleGame, (game, client) => {
  const seatId = game.getSeatId(client);
  // TODO again why duplicated seats?
  // TODO same code as card-jitsu? but maybe shouldnt merge since different clients
  client.sendXt('gz', game.seats, game.seats);
  client.sendXt('jz', seatId);

  const info = [
    game.players.map(p => p.penguin.name),
    game.players.map(p => p.penguin.color),
    game.ninjas.map(n => n.energy),
    game.tileIds,
    game.ninjas[seatId].hand,
    game.spin,
    // TODO fire rank, also why need fire rank? are we sure it's not normal ninja rank?
    game.players.map(p => 0)
  ].map(info => info.join(','));

  // TODO what is 0 for?
  client.sendXt('sz', 0, ...info);
});

// client clicks on the spinner stone
handler.waddleXt(Handle.CardJitsuFireClickSpinner, (game, client, action, unknown, tile) => {
  if (action === CardJitsuFire.CLICK_SPINNER_ACTION) {
    game.clickSpinner(tile);
  }
});

// client chooses a tile to jump to
handler.waddleXt(Handle.CardJitsuFireChooseTile, (game, client, action, tile) => {
  if (action === CardJitsuFire.CHOOSE_TILE) {
    game.chooseTile(tile);
  }
});

// client chooses which card they will play
handler.waddleXt(Handle.CardJitsuFireChooseCard, (game, client, action, cardIndex) => {
  if (action === CardJitsuFire.CHOOSE_CARD) {
    game.chooseCard(game.getNinja(client), cardIndex);
  }
});

// client is ready for the next round (next spin)
handler.waddleXt(Handle.CardJitsuFireInfoReady, (game, client, action) => {
  if (action === CardJitsuFire.INFO_READY && game.isClientInGame(client)) {
    game.ninjaReady(game.getNinja(client));
  }
});

// client chooses the element of the next battle
handler.waddleXt(Handle.CardJitsuFireChooseElement, (game, client, action, element) => {
  if (action === CardJitsuFire.CHOOSE_ELEMENT_ACTION) {
    game.chooseElement(element as CardElement);
  }
})

// client leaves the game
handler.waddleXt(Handle.LeaveWaddleMatch, (game, client) => {
  client.sendCardJitsuStampInfo();
});

export default handler;