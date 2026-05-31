import { choose, iterateEntries, randomInt } from "@common/utils";
import { Card, CardColor, CardElement, CARDS } from "@server/game-logic/cards";
import { CardJitsuProgress } from "@server/game-logic/ninja-progress";
import { Room } from "@server/game-logic/rooms";
import { WaddleName } from "@server/game-logic/waddles";
import { WaddleGame } from "./waddle-game";
import { WaddleRoom } from "./waddle-room";
import { ContextAdder, ContextRemover } from "./world-penguin";
import { WorldPenguin } from "./world-penguin";

export class Hand {
  private _canDrawCards: number[];
  private _cantDrawCards: number[];
  
  constructor(cards: number[]) {
    this._canDrawCards = [...cards];
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

  protected _cardsOnHand: number[];

  private _flawless: boolean;

  protected _blockedElement: CardElement | undefined;

  constructor(seat: number) {
    this._seat = seat;
    this._scores = {
      'f': [],
      'w': [],
      's': []
    };

    this._cardsOnHand = [];
    this._flawless = true;
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

  // set opponent(ninja: Ninja) {
  //   this._opponent = ninja;
  // }

  // get opponent(): Ninja {
  //   if (this._opponent === undefined) {
  //     throw new Error('Accessing opponent before it is initialized');
  //   }
  //   return this._opponent;
  // }

  // get otherSeat(): number {
  //   return this.opponent.seat;
  // }

  score(element: CardElement, id: number): void {
    this._scores[element].push(id);
  }

  removeCards(cards: number[]): void {
    const toDiscard = new Set(cards);
    iterateEntries(this._scores, (element, cards) => {
      this._scores[element] = cards.filter((id) => !toDiscard.has(id));
    });
  }

  get cards(): number[] {
    return this._cardsOnHand;
  }

  public get blockedElement() {
    return this._blockedElement;
  }

  removeFlawless() {
    this._flawless = false;
  }

  get isFlawless() {
    return this._flawless;
  }

  blockElement(element: CardElement) {
    this._blockedElement = element;
  }

  unblockElement() {
    this._blockedElement = undefined;
  }
}

export class NinjaPlayer extends Ninja {
  private _player: WorldPenguin;

  private _hand: Hand;

  private _sessionToCard = new Map<number, number>();

  constructor(player: WorldPenguin, seat: number) {
    super(seat);

    this._hand = new Hand(player.ninja.getDeck());
    this._player = player;
  }

  get player(): WorldPenguin {
    return this._player;
  }

  onDraw(id: number): number {
    const cardId = this._hand.draw();
    this._sessionToCard.set(id, cardId);
    return cardId;
  }

  public getCardInfo(sessionId: number): Card {
    const cardId = this._sessionToCard.get(sessionId);
    if (cardId === undefined) {
      throw new Error('Couldn\'t find card');
    }
    return CARDS.getStrict(cardId);
  }
}

export class Sensei extends Ninja {
  private _unbeatable: boolean;

  /**
   * A map that takes session ID of cards from the opponent and session ID of cards Sensei has
   * indicating that when the opponent plays that card, Sensei must use this card to beat it
   * (only used in unbeatable mode)
   * */
  private _cardsToUse = new Map<number, number>();
  
  private _pupil: NinjaPlayer;

  constructor(unbeatable: boolean, opponent: NinjaPlayer) {
    super(0);
    this._unbeatable = unbeatable;
    this._pupil = opponent;
  }

  private _sessionToElement = new Map<number, string>();

  pickCard() {
    if (this._unbeatable) {
      // it's cheating time

      // NOTE: this is an unbeatable algorithm. But the original sensei seems to lose sometimes
      // even if he is unbeatable

      const cardToTuse = this._cardsToUse.get(this._pupil.chosen);
      if (cardToTuse === undefined) {
        throw new Error('Logic error: Sensei hasn\'t registered what card to use');
      }
      this.choose(cardToTuse);
    } else {
      // no criteria
      const canPlayCards = this._cardsOnHand.filter(id => {
        if (this._blockedElement) {
          return true;
        }
        return this._sessionToElement.get(id) !== this._blockedElement;
      });
      this.choose(choose(canPlayCards));
    }
  }

  onDraw(id: number): number {
    let cardId: number;
    if (this._unbeatable) {
      let unbeatableCard: number;

      const cardsWithoutCounter = this._pupil.cards.filter(id => {
        return !this._cardsToUse.has(id);
      });
      if (cardsWithoutCounter.length === 0) {
        // sensei must always draw after the opponent
        throw new Error('Logic error: Sensei is drawing a new card, but the opponent has no new card');
      }
      const cardToCounterId = cardsWithoutCounter[0]
      const cardToCounter = this._pupil.getCardInfo(cardToCounterId);
      // this._game.getCard(cardToCounterId);
      // finding a card that can beat this card.
      // if a cheater card, for now we will use the same card to make tie
      // otherwise, pick any card of opposite element
      if (cardToCounter.powerId in REPLACEMENT_POWER_CARDS) {
        unbeatableCard = cardToCounter.id;
      } else {
        const winningElement = RULES[RULES[cardToCounter.element]];
        const card = choose(CARDS.rows.filter(card => card.element === winningElement));
        unbeatableCard = card.id;
      }
      this._cardsToUse.set(cardToCounterId, id);
      cardId = unbeatableCard;
    } else {
      cardId = choose(CARDS.rows).id;
    }

    this._sessionToElement.set(cardId, CARDS.getStrict(cardId).element);
    return cardId;
  }
}

function getNinjasWithSensei(player: WorldPenguin): [Ninja, Ninja] {
  const ninja = new NinjaPlayer(player, 1);
  const sensei = new Sensei(player.ninja.senseiAttempts < 5, ninja);
  return [ninja, sensei];
}

const REPLACEMENT_POWER_CARDS: Record<number, [CardElement, CardElement] | undefined> = {
  16: ['w', 'f'],
  17: ['s', 'w'],
  18: ['f', 's']
};

const RULES: Record<CardElement, CardElement> = {
  'f': 's',
  'w': 'f',
  's': 'w'
};

export const COLOR_DISCARD_POWER_CARDS: Record<number, CardColor | undefined> = {
  7: 'r',
  8: 'b',
  9: 'g',
  10: 'y',
  11: 'o',
  12: 'p'
};

export const ON_PLAYED_POWER_CARDS = new Set([1, 16, 17, 18]);

export const ELEMENT_DISCARD_POWER_CARDS: Record<number, CardElement | undefined> = {
  4: 's',
  5: 'w',
  6: 'f'
};

export const ELEMENT_BLOCK_POWER_CARDS: Record<number, CardElement | undefined> = {
  13: 's',
  14: 'f',
  15: 'w'
};

export const SELF_EFFECT_POWER_CARDS = new Set([2]);

export function getWinner(firstElement: CardElement, secondElement: CardElement, firstValue: number, secondValue: number): -1 | 0 | 1 {
  if (firstElement === secondElement) {
    if (firstValue === secondValue) {
      return -1;
    } else {
      if (firstValue > secondValue) {
        return 0;
      } else {
        return 1;
      }
    }
  } else if (RULES[firstElement] === secondElement) {
    return 0;
  } else {
    return 1;
  }
}

export class CardJitsu extends WaddleGame {
  public roomId = Room.CardJitsu;

  // public name: WaddleName = 'card';

  private _cardId = 0;

  private _ninjaSeats: [Ninja, Ninja];

  private _ninjas = new Map<WorldPenguin, NinjaPlayer>();

  private _cards = new Map<number, Card>();

  /** If in Sensei fight */
  private _sensei: boolean;

  // static DEAL_ACTION = 'deal';

  // static PICK_ACTION = 'pick';

  // static RULES: Record<CardElement, CardElement> = {
  //   'f': 's',
  //   'w': 'f',
  //   's': 'w'
  // };

  // static ON_PLAYED_POWER_CARDS = new Set([1, 16, 17, 18]);
  // static SELF_EFFECT_POWER_CARDS = new Set([2]);
  // static ELEMENT_BLOCK_POWER_CARDS: Record<number, CardElement | undefined> = {
  //   13: 's',
  //   14: 'f',
  //   15: 'w'
  // };

  // static REPLACEMENT_POWER_CARDS: Record<number, [CardElement, CardElement] | undefined> = {
  //   16: ['w', 'f'],
  //   17: ['s', 'w'],
  //   18: ['f', 's']
  // };
  // static COLOR_DISCARD_POWER_CARDS: Record<number, CardColor | undefined> = {
  //   7: 'r',
  //   8: 'b',
  //   9: 'g',
  //   10: 'y',
  //   11: 'o',
  //   12: 'p'
  // };
  // static ELEMENT_DISCARD_POWER_CARDS: Record<number, CardElement | undefined> = {
  //   4: 's',
  //   5: 'w',
  //   6: 'f'
  // };

  /** Whether or not lowest value wins this round */
  private _swapValue: boolean = false;

  /** Number modifiers to apply in next score */
  private _valueModifier: [number, number] = [0, 0];

  private _opponents = new Map<Ninja, Ninja>();

  constructor(players: WorldPenguin[]) {    
    super(players);

    this._sensei = players.length === 1;

    const ninjas: [Ninja, Ninja] = this._sensei
      ? getNinjasWithSensei(players[0])
      : [new NinjaPlayer(players[0], 0), new NinjaPlayer(players[1], 1)];

    players.forEach((p, i) => this._ninjas.set(p, ninjas[i] as NinjaPlayer));

    this._opponents.set(ninjas[0], ninjas[1]);
    this._opponents.set(ninjas[1], ninjas[0]);

    this._ninjaSeats = ninjas;
  }

  get sensei() {
    return this._sensei;
  }

  public getOpponent(ninja: Ninja): Ninja {
    const op = this._opponents.get(ninja);
    if (op === undefined) {
      throw new Error('No opponent found');
    }
    return op;
  }

  // /** Starts a match that is being started from matchmaking */
  // startMatch() {
  //   const waddleRoom = new WaddleRoom(1000 + this.players[0].id, this.players.length, 'card');
  //   // const gameRoom = this.server.getRoom(this.roomId);
    
  //   const playerInfo = this.players.map(p => `${p.info.name}|${p.info.color}`);
    
  //   // gameRoom.waddles.set(waddleRoom.id, waddleRoom);
    
  //   this.players.forEach((p) => {
  //     // don't know what the 0 : 10 thing is for, and what the difference is
  //     p.sendXt('scard', this.roomId, waddleRoom.getId(), this._sensei ? 1 : this.players.length, this._sensei ? 0 : 10, ...playerInfo);
  //   });
  // }

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

  deal(ninja: Ninja, amount: number): string[] {
    return new Array(amount).fill(null).map(() => this.draw(ninja));
  }

  // chooseCard(ninja: NinjaPlayer, id: number): void {
  //   ninja.choose(id);
  // }

  getNinja(player: WorldPenguin): NinjaPlayer {
    const ninja = this._ninjas.get(player);
    if (ninja === undefined) {
      throw new Error('Penguin doesn\'t have a ninja');
    }
    return ninja
  }

  // get swapEffect() {
  //   return this._swapValue;
  // }

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

  getWinningHand(): {
    seat: number;
    cards: number[];
    oneElement: boolean;
  } | undefined {
    let i = 0;
    for (const ninja of this._ninjaSeats) {

      // check for elemental win
      for (const [_, cards] of Object.entries(ninja.scores)) {
        const noDupe = this.removeColorDuplicates(cards);
        if (noDupe.length >= 3) {
          return {
            seat: i,
            cards: noDupe.slice(0, 3),
            oneElement: true
          }
        }
      }
  
      // check for all elements win
      const combos = Array.from(Object.values(ninja.scores).map(set => [...set])).reduce<number[][]>((acc, current) => {
        return acc.flatMap(a => current.map(b => [...a, b]));
      }, [[]]);
  
      for (const combo of combos) {
        const noDupes = this.removeColorDuplicates(combo);
        if (noDupes.length >= 3) {
          return {
            seat: i,
            cards: noDupes.slice(0, 3),
            oneElement: false
          }
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
      const replacement = REPLACEMENT_POWER_CARDS[card.powerId];
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
    let [firstValue, secondValue] = cardInfo.map((card, i) => card.value + this._valueModifier[i]);
    this._valueModifier = [0, 0];
    if (this._swapValue) {
      [firstValue, secondValue] = [secondValue, firstValue];
    }

    const winIndex = getWinner(firstElement, secondElement, firstValue, secondValue);

    if (winIndex !== -1) {
      this._ninjaSeats[winIndex].score(cardInfo[winIndex].element, cards[winIndex]);
    }

    // resetting effects
    if (this._swapValue) {
      this._swapValue = false;
    }
    this._ninjaSeats.forEach(n => n.unblockElement());

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

  playerCanPlay(ninja: Ninja): boolean {
    // the only condition for not being able to play is an element being blocked
    const blockedElement = ninja.blockedElement;
    if (blockedElement) {
      return true;
    }

    const cards = ninja.cards;

    return cards.some(c => this.getCard(c)?.element !== blockedElement);
  }

  // removePlayer(penguin: WorldPenguin) {
  //   // for when the player got stamps in older versions
  //   for (let i = 0; i <= penguin.info.ninjaProgress.rank; i++) {
  //     const stamp = CardJitsuProgress.STAMP_AWARDS[i];
  //     if (stamp !== undefined) {
  //       penguin.giveStamp(stamp);
  //     }
  //   }

  //   penguin.sendCardJitsuStampInfo();
  //   // client.leaveWaddleRoom();
  // }

  // setWinner(winnerSeat: number, ...winningCards: number[]) {
  //   // players are removed so that they don't get the "player quit" popup even though the game ended normally
  //   this.players.forEach(p => {
  //     this.removePlayer(p)
  //   });
  //   this.sendXt('czo', 0, winnerSeat, ...winningCards);
  // }
}