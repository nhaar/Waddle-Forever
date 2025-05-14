import { WaddleName } from "../../../server/game-logic/waddles";
import { Client, WaddleGame, WaddleRoom } from "../../../server/client";
import { WaddleHandler } from "./waddle";
import { choose, iterateEntries, randomInt } from "../../../common/utils";
import { Card, CardColor, CardElement, CARDS } from "../../../server/game-logic/cards";
import { Handle } from "../handles";
import { CardJitsuProgress } from "../../../server/game-logic/ninja-progress";

class Hand {
  private _canDrawCards: number[];
  private _cantDrawCards: number[];
  
  constructor(cards: [number, number][]) {
    this._canDrawCards = [];
    cards.forEach((card) => {
      for (let i = 0; i < card[1]; i++) {
        this._canDrawCards.push(card[0]);
      }
    });
    this._cantDrawCards = [];
  }

  draw(): number {
    const index = randomInt(0, this._canDrawCards.length - 1);
    const card = this._canDrawCards.splice(index, 1)[0];
    this._cantDrawCards.push(card);
    if (this._canDrawCards.length === 0) {
      this._canDrawCards = this._cantDrawCards;
      this._cantDrawCards = [];
    }
    return card;
  }
}

abstract class Ninja {
  /** Card currently chosen, using session ID */
  private _chosen: number | undefined;

  /** For all elements, map all the card's session IDs */
  private _scores: Record<CardElement, number[]>;

  private _seat: number;

  /** Reference to opponent ninja */
  private _opponent: Ninja | undefined;

  protected _game: CardJitsu;

  protected _cardsOnHand: number[];

  constructor(seat: number, game: CardJitsu) {
    this._seat = seat;
    this._scores = {
      'f': [],
      'w': [],
      's': []
    };

    this._game = game;
    this._cardsOnHand = [];
  }

  /**
   * Function to implement that handles what to do when drawing a new card
   * Receiving ID is Session ID of card, must return ID of the card-jitsu card
   */
  abstract onDraw(id: number): number;

  draw(id: number): number {
    this._cardsOnHand.push(id);
    return this.onDraw(id);
  }

  choose(id: number): void {
    this._chosen = id;
    this._cardsOnHand = this._cardsOnHand.filter(id => id !== id);
    this._game.sendXt('zm', CardJitsu.PICK_ACTION, this.seat, id);
  }

  unchoose(): void {
    this._chosen = undefined;
  }

  hasChosen(): boolean {
    return this._chosen !== undefined;
  }

  get chosen(): number {
    if (this._chosen === undefined) {
      throw new Error('Accessing chosen card but none are chosen!');
    }
    return this._chosen;
  }

  get scores(): Record<CardElement, number[]> {
    return this._scores;
  }

  get seat(): number {
    return this._seat;
  }

  set opponent(ninja: Ninja) {
    this._opponent = ninja;
  }

  get opponent(): Ninja {
    if (this._opponent === undefined) {
      throw new Error('Accessing opponent before it is initialized');
    }
    return this._opponent;
  }

  get otherSeat(): number {
    return this.opponent.seat;
  }

  score(element: CardElement, id: number): void {
    this._scores[element].push(id);
  }

  removeCards(cards: number[]): void {
    const toDiscard = new Set(cards);
    iterateEntries(this._scores, (element, cards) => {
      this._scores[element] = cards.filter((id) => !toDiscard.has(id));
    });
  }

  deal(amount: number) {
    const cards: string[] = [];
    for (let i = 0; i < amount; i++) {
      cards.push(this._game.draw(this));
    }

    this._game.sendXt('zm', CardJitsu.DEAL_ACTION, this.seat, ...cards);
  }

  get cards(): number[] {
    return this._cardsOnHand;
  }
}

class NinjaPlayer extends Ninja {
  private _player: Client;

  private _hand: Hand;

  constructor(player: Client, seat: number, game: CardJitsu) {
    super(seat, game);

    this._hand = new Hand(player.penguin.getCards());
    this._player = player;
  }

  get player(): Client {
    return this._player;
  }

  onDraw(id: number): number {
    return this._hand.draw();
  }
}

class Sensei extends Ninja {
  private _unbeatable: boolean;

  /**
   * A map that takes session ID of cards from the opponent and session ID of cards Sensei has
   * indicating that when the opponent plays that card, Sensei must use this card to beat it
   * (only used in unbeatable mode)
   * */
  private _cardsToUse: Map<number, number>;

  constructor(game: CardJitsu, unbeatable: boolean) {
    super(0, game);
    this._unbeatable = unbeatable;
    this._cardsToUse = new Map<number, number>;
  }

  pickCard() {
    if (this._unbeatable) {
      // it's cheating time

      // NOTE: this is an unbeatable algorithm. But the original sensei seems to lose sometimes
      // even if he is unbeatable

      const cardToTuse = this._cardsToUse.get(this.opponent.chosen);
      if (cardToTuse === undefined) {
        throw new Error('Logic error: Sensei hasn\'t registered what card to use');
      }
      this.choose(cardToTuse);
    } else {
      // no criteria
      this.choose(choose(this._cardsOnHand));
    }
  }

  onDraw(id: number): number {
    if (this._unbeatable) {
      let unbeatableCard: number;

      const cardsWithoutCounter = this.opponent.cards.filter(id => {
        return !this._cardsToUse.has(id);
      });
      if (cardsWithoutCounter.length === 0) {
        // sensei must always draw after the opponent
        throw new Error('Logic error: Sensei is drawing a new card, but the opponent has no new card');
      }
      const cardToCounterId = cardsWithoutCounter[0]
      const cardToCounter = this._game.getCard(cardToCounterId);
      // finding a card that can beat this card.
      // if a cheater card, for now we will use the same card to make tie
      // otherwise, pick any card of opposite element
      if (cardToCounter.powerId in CardJitsu.REPLACEMENT_POWER_CARDS) {
        unbeatableCard = cardToCounter.id;
      } else {
        const winningElement = CardJitsu.RULES[CardJitsu.RULES[cardToCounter.element]];
        const card = choose(CARDS.rows.filter(card => card.element === winningElement));
        unbeatableCard = card.id;
      }
      this._cardsToUse.set(cardToCounterId, id);
      return unbeatableCard
    } else {
      return choose(CARDS.rows).id;
    }
  }
}

export class CardJitsu extends WaddleGame {
  public roomId: number = 998;

  public name: WaddleName = 'card';

  private _cardId: number;

  private _ninjaSeats: [Ninja, Ninja];

  private _ninjas: Map<Client, NinjaPlayer>;

  private _cards: Map<number, Card>;

  /** If in Sensei fight */
  private _sensei: boolean;

  static DEAL_ACTION = 'deal';

  static PICK_ACTION = 'pick';

  static RULES: Record<CardElement, CardElement> = {
    'f': 's',
    'w': 'f',
    's': 'w'
  };

  static ON_PLAYED_POWER_CARDS = new Set([1, 16, 17, 18]);
  static AFFECTS_PLAYER_POWER_CARDS = new Set([2]);

  static REPLACEMENT_POWER_CARDS: Record<number, [CardElement, CardElement] | undefined> = {
    16: ['w', 'f'],
    17: ['s', 'w'],
    18: ['f', 's']
  };
  static COLOR_DISCARD_POWER_CARDS: Record<number, CardColor | undefined> = {
    7: 'r',
    8: 'b',
    9: 'g',
    10: 'y',
    11: 'o',
    12: 'p'
  };
  static ELEMENT_DISCARD_POWER_CARDS: Record<number, CardElement | undefined> = {
    4: 's',
    5: 'w',
    6: 'f'
  };

  /** Whether or not lowest value wins this round */
  private _swapValue: boolean = false;

  /** Number modifiers to apply in next score */
  private _valueModifier: [number, number] = [0, 0];

  constructor(players: Client[]) {    
    super(players);

    this._sensei = players.length === 1;
    this._ninjas = new Map<Client, NinjaPlayer>;

    const ninjas: Ninja[] = [];

    if (this._sensei) {
      const player = players[0];
      // 5 is estimate from research
      ninjas.push(new Sensei(this, player.penguin.ninjaProgress.senseiAttempts < 5));
    }

    players.forEach((p, i) => {
      const seat = this._sensei ? i + 1 : i;
      const ninja = new NinjaPlayer(p, seat, this);
      ninjas.push(ninja);
      this._ninjas.set(p, ninja);
    });

    // initializing
    ninjas.forEach((ninja, i) => {
      ninja.opponent = ninjas[(i + 1) % 2];
    });

    this._ninjaSeats = ninjas as [Ninja, Ninja];

    this._cardId = 0;
    this._cards = new Map<number, Card>();
  }

  get server() {
    return this.players[0].server;
  }

  get sensei() {
    return this._sensei;
  }

  startMatch() {
    const waddleRoom = new WaddleRoom(1000 + this.players[0].penguin.id, this.players.length, 'card');
    const gameRoom = this.server.getRoom(this.roomId);
    
    this.players.forEach((p) => {
      waddleRoom.addPlayer(p);
    });
    
    const playerInfo = this.players.map(p => `${p.penguin.name}|${p.penguin.color}`);
    
    gameRoom.waddles.set(waddleRoom.id, waddleRoom);
    
    this.players.forEach((p) => {
      // don't know what the 0 / 10 thing is for
      p.sendXt('scard', this.roomId, waddleRoom.id, this._sensei ? 1 : this.players.length, this._sensei ? 0 : 10, ...playerInfo);
    });
  }

  draw(ninja: Ninja): string {
    this._cardId++;
    const card = ninja.draw(this._cardId) ?? -1;
    const cardInfo = CARDS.getStrict(card);
    this._cards.set(this._cardId, cardInfo);
    return `${this._cardId}|${[
      cardInfo.id,
      cardInfo.element,
      cardInfo.value,
      cardInfo.color,
      cardInfo.powerId
    ].join('|')}`;
  }

  chooseCard(ninja: NinjaPlayer, id: number): void {
    ninja.choose(id);
  }

  getNinja(player: Client): NinjaPlayer {
    const ninja = this._ninjas.get(player);
    if (ninja === undefined) {
      throw new Error('Client doesn\'t have a ninja');
    }
    return ninja
  }

  get swapEffect() {
    return this._swapValue;
  }

  /** Get card using session ID */
  getCard(id: number): Card {
    const card = this._cards.get(id);
    if (card === undefined) {
      throw new Error('Invalid card id');
    }
    return card;
  }

  private removeColorDuplicates(cards: number[]) {
    const colors = new Set<CardColor>();
    const noDuplicates: number[] = [];
    cards.forEach(card => {
      const color = this.getCard(card).color;
      if (!colors.has(color)) {
        noDuplicates.push(card);
        colors.add(color);
      }
    })
    return noDuplicates;
  }

  hasWinningHand(): [number, number[]] | undefined {
    let i = 0;
    for (const ninja of this._ninjaSeats) {

      // check for elemental win
      for (const [_, cards] of Object.entries(ninja.scores)) {
        const noDupe = this.removeColorDuplicates(cards);
        if (noDupe.length >= 3) {
          return [i, noDupe.slice(0, 3)];
        }
      }
  
      // check for all elements win
      const combos = Array.from(Object.values(ninja.scores).map(set => [...set])).reduce<number[][]>((acc, current) => {
        return acc.flatMap(a => current.map(b => [...a, b]));
      }, [[]]);
  
      for (const combo of combos) {
        const noDupes = this.removeColorDuplicates(combo);
        if (noDupes.length >= 3) {
          return [i, noDupes.slice(0, 3)];
        }
      }
  
      
      i++;
    }
    return undefined;
  }

  judgeWinner(): number {
    const cards = this._ninjaSeats.map((n) => n.chosen);
    const cardInfo = cards.map(id => this.getCard(id));
    const elements = cardInfo.map((c) => c.element);

    // applying element replacement from powercards
    cardInfo.forEach((card, i) => {
      const replacement = CardJitsu.REPLACEMENT_POWER_CARDS[card.powerId];
      if (replacement !== undefined) {
        const [original, target] = replacement;
        const other = (i + 1) % 2;
        if (elements[other] === original) {
          elements[other] = target;
        }
      }
    });
    const [firstElement, secondElement] = elements;

    // adding modifier from power cards
    const [firstValue, secondValue] = cardInfo.map((card, i) => card.value + this._valueModifier[i]);
    this._valueModifier = [0, 0];

    let winIndex = -1;
    if (firstElement === secondElement) {
      if (firstValue === secondValue) {
        winIndex = -1;
      } else {
        if (firstValue > secondValue) {
          winIndex = 0;
        } else {
          winIndex = 1;
        }

        // trick for swapping the winner for swap power cards
        if (this._swapValue) {
          winIndex = (winIndex + 1) % 2;
        }
      }
    } else if (CardJitsu.RULES[firstElement] === secondElement) {
      winIndex = 0;
    } else {
      winIndex = 1;
    }

    if (winIndex !== -1) {
      this._ninjaSeats[winIndex].score(cardInfo[winIndex].element, cards[winIndex]);
    }

    if (this._swapValue) {
      this._swapValue = false;
    }

    return winIndex;
  }

  setValueSwap() {
    this._swapValue = true;
  }

  alterModifier(seat: number, delta: number) {
    this._valueModifier[seat] += delta;
  }

  getNinjaBySeatIndex(index: number): Ninja {
    return this._ninjaSeats[index];
  }
}

const handler = new WaddleHandler<CardJitsu>('card');

handler.waddleXt(Handle.EnterWaddleGame, (game, client) => {
  const seatNumber = game.sensei ? 1 : game.getSeatId(client);
  // TODO why is seats duplicated?
  client.sendXt('gz', game.seats, game.seats);
  client.sendXt('jz', seatNumber, client.penguin.name, client.penguin.color, client.penguin.ninjaProgress.rank)
});

handler.waddleXt(Handle.UpdateWaddleGameSeats, (game, client) => {
  const playersInfo: Array<[number, string, number, number]> = [];
  let seat = 0;
  if (game.sensei) {
    playersInfo.push([0, 'Sensei', 14, 10]);
    seat++;
  }
  for (const p of game.players) {
    playersInfo.push([seat, p.penguin.name, p.penguin.color, p.penguin.ninjaProgress.rank]);
    seat++;
  }
  client.sendXt('uz', ...playersInfo.map(info => info.join('|')));
  client.sendXt('sz');
});

// dealing new card to the player
handler.waddleXt(Handle.CardJitsuDeal, (game, client, action, amount) => {
  if (action === CardJitsu.DEAL_ACTION) {
    const ninja = game.getNinja(client);

    ninja.deal(amount);
    if (game.sensei) {
      ninja.opponent.deal(amount);
    }
  }
});

// player picks a card
handler.waddleXt(Handle.CardJitsuPick, (game, client, action, sessionId) => {
  if (action === CardJitsu.PICK_ACTION) {
    const ninja = game.getNinja(client);
    const otherNinja = ninja.opponent;

    game.chooseCard(ninja, sessionId);
    
    if (otherNinja instanceof Sensei) {
      otherNinja.pickCard();
    }

    if (otherNinja.hasChosen()) {
      const winner = game.judgeWinner();

      const winningHand = game.hasWinningHand();

      const ninjas = [ninja, otherNinja];

      ninjas.forEach((n) => {
        const card = game.getCard(n.chosen);
        if (CardJitsu.ON_PLAYED_POWER_CARDS.has(card.powerId) || (card.powerId > 0 && n.seat === winner)) {
          const cardsToDiscard: number[] = [];
          if (card.powerId === 1) {
            game.setValueSwap();
          } else if (card.powerId === 2) {
            game.alterModifier(n.seat, 2);
          } else if (card.powerId === 3) {
            game.alterModifier(n.otherSeat, -2);
          }

          const colorToDiscard = CardJitsu.COLOR_DISCARD_POWER_CARDS[card.powerId];
          if (colorToDiscard !== undefined) {
            Object.values(n.opponent.scores).forEach((cards) => {
              cards.forEach((sessionId) => {
                if (game.getCard(sessionId).color === colorToDiscard) {
                  cardsToDiscard.push(sessionId);
                }
              })
            });
            n.opponent.removeCards(cardsToDiscard);
          }
          const elementToDiscard = CardJitsu.ELEMENT_DISCARD_POWER_CARDS[card.powerId];
          if (elementToDiscard !== undefined) {
            const cards = ninja.opponent.scores[elementToDiscard];
            const last = cards[cards.length - 1];
            cardsToDiscard.push(last);
            ninja.opponent.removeCards(cardsToDiscard);
          }

          const [sender, recipient] =  CardJitsu.AFFECTS_PLAYER_POWER_CARDS.has(card.powerId) ? [n.seat, n.seat] : [n.seat, n.otherSeat];
          client.sendWaddleXt('zm', 'power', sender, recipient, card.powerId, ...cardsToDiscard);
        }
        n.unchoose();
      });
      otherNinja.unchoose();
      ninja.unchoose();

      client.sendWaddleXt('zm', 'judge', winner);

      if (winningHand !== undefined) {
        const winnerNinja = game.getNinjaBySeatIndex(winner);
        if (winnerNinja instanceof NinjaPlayer) {
          winnerNinja.player.gainNinjaProgress(true);

          // beating Sensei without Ninja Mask
          if (game.sensei && !client.penguin.ninjaProgress.isNinja) {
            client.becomeNinja();
          }
        }
        if (winnerNinja.opponent instanceof NinjaPlayer) {
          winnerNinja.opponent.player.gainNinjaProgress(false);
          // losing to Sensei as a black belt
          if (winnerNinja instanceof Sensei) {
            if (winnerNinja.opponent.player.penguin.ninjaProgress.rank >= CardJitsuProgress.MAX_RANK) {
              winnerNinja.opponent.player.penguin.ninjaProgress.addAttempt();
              winnerNinja.opponent.player.update();
            }
          }
        }

        const [seat, hand] = winningHand;
        client.sendWaddleXt('czo', 0, seat, ...hand);
      }
    }
  }
})

export default handler;