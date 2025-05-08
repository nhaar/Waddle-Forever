import { WaddleName } from "../../../server/game-logic/waddles";
import { Client, WaddleGame } from "../../../server/client";
import { WaddleHandler } from "./waddle";
import { randomInt } from "../../../common/utils";
import { Card, CardColor, CardElement, CARDS } from "../../../server/game-logic/cards";

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

class Ninja {
  private _hand: Hand;

  private _seat: number;

  /** Card currently chosen, using session ID */
  private _chosen: number | undefined;

  /** For all elements, map all the card's session IDs */
  private _scores: Record<CardElement, number[]>;

  constructor(player: Client, seat: number) {
    this._hand = new Hand(player.penguin.getCards());
    this._seat = seat;
    this._scores = {
      'f': [],
      'w': [],
      's': []
    };
  }

  get hand(): Hand {
    return this._hand;
  }

  choose(id: number): void {
    this._chosen = id;
  }

  unchoose(): void {
    this._chosen = undefined;
  }

  hasChosen(): boolean {
    return this._chosen !== undefined;
  }

  chosen(): number {
    if (this._chosen === undefined) {
      throw new Error('Accessing chosen card but none are chosen!');
    }
    return this._chosen;
  }

  score(element: CardElement, id: number): void {
    this._scores[element] = [...this._scores[element], id];
  }

  get seat(): number {
    return this._seat;
  }

  get scores(): Record<CardElement, number[]> {
    return this._scores;
  }
}

export class CardJitsu extends WaddleGame {
  public roomId: number = 998;

  public name: WaddleName = 'card';

  private _cardId: number;

  private _ninjas: Map<Client, Ninja>;

  private _cards: Map<number, Card>;

  static RULES: Record<CardElement, CardElement> = {
    'f': 's',
    'w': 'f',
    's': 'w'
  };

  constructor(players: Client[]) {
    super(players);

    this._ninjas = new Map<Client, Ninja>;

    players.forEach((p, i) => {
      this._ninjas.set(p, new Ninja(p, i));
    });

    this._cardId = 0;
    this._cards = new Map<number, Card>();
  }

  draw(ninja: Ninja): string {
    this._cardId++;
    const card = ninja.hand.draw() ?? -1;
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

  chooseCard(ninja: Ninja, id: number): void {
    ninja.choose(id);
  }

  getNinja(player: Client): Ninja {
    const ninja = this._ninjas.get(player);
    if (ninja === undefined) {
      throw new Error('Client doesn\'t have a ninja');
    }
    return ninja
  }

  getOpponent(player: Client): Ninja {
    const opponent = Array.from(this._ninjas.keys()).filter((p) => p !== player)[0];
    return this.getNinja(opponent);
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
    for (const player of this.players) {
      const ninja = this.getNinja(player);

      // check for elemental win
      for (const [_, cards] of Object.entries(ninja.scores)) {
        const noDupe = this.removeColorDuplicates(cards);
        if (noDupe.length >= 3) {
          return [i, noDupe.slice(0, 3)];
        }
      }
  
      // check for all elements win
      const combos = Array.from(Object.values(ninja.scores)).reduce<number[][]>((acc, current) => {
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
    const ninjas = this.players.map((p) => this.getNinja(p));
    const cards = ninjas.map((n) => n.chosen());
    const cardInfo = cards.map(id => this.getCard(id));
    const [firstCard, secondCard] = cardInfo;

    let winIndex = -1;
    if (firstCard.element === secondCard.element) {
      if (firstCard.value > secondCard.value) {
        winIndex = 0;
      } else if (firstCard.value < secondCard.value) {
        winIndex = 1;
      } else {
        winIndex = -1;
      }
    } else if (CardJitsu.RULES[firstCard.element] === secondCard.element) {
      winIndex = 0;
    } else {
      winIndex = 1;
    }

    if (winIndex !== -1) {
      ninjas[winIndex].score(cardInfo[winIndex].element, cards[winIndex]);
    }

    return winIndex;
  }
}

const handler = new WaddleHandler<CardJitsu>('card');

handler.waddleXt('z', 'gz', (game, client) => {
  const seatNumber = game.getSeatId(client);
  // TODO why is seats duplicated?
  client.sendXt('gz', game.seats, game.seats);
  client.sendXt('jz', seatNumber, client.penguin.name, client.penguin.color, client.penguin.ninjaRank)
});

handler.waddleXt('z', 'uz', (game, client) => {
  client.sendXt('uz', ...game.players.map((p, i) => {
    return [i, p.penguin.name, p.penguin.color, client.penguin.ninjaRank].join('|');
  }));
  client.sendXt('sz');
});

// dealing new card to the player
handler.waddleXt('z', 'zm', (game, client, action, amount) => {
  if (action === 'deal') {
    const ninja = game.getNinja(client);

    const cards: string[] = [];
    for (let i = 0; i < Number(amount); i++) {
      cards.push(game.draw(ninja));
    }

    client.sendWaddleXt('zm', action, ninja.seat, ...cards);
  }
});

// player picks a card
handler.waddleXt('z', 'zm', (game, client, action, id) => {
  if (action === 'pick') {
    const ninja = game.getNinja(client);
    const otherNinja = game.getOpponent(client);
    game.chooseCard(ninja, Number(id));

    client.sendWaddleXt('zm', action, ninja.seat, id);
    
    if (otherNinja.hasChosen()) {
      const winner = game.judgeWinner();

      const winningHand = game.hasWinningHand();
      otherNinja.unchoose();
      ninja.unchoose();

      client.sendWaddleXt('zm', 'judge', winner);

      if (winningHand !== undefined) {
        const [seat, hand] = winningHand;
        client.sendWaddleXt('czo', 0, seat, ...hand);
      }
    }
  }
})

export default handler;