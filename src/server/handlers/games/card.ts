import { WaddleName } from "../../../server/game-logic/waddles";
import { Client, WaddleGame } from "../../../server/client";
import { WaddleHandler } from "./waddle";
import { randomInt } from "../../../common/utils";
import { Card, CardElement, CARDS } from "../../../server/game-logic/cards";

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

  /** Card currently chosen */
  private _chosen: Card | undefined;

  constructor(player: Client, seat: number) {
    this._hand = new Hand(player.penguin.getCards());
    this._seat = seat;
  }

  get hand(): Hand {
    return this._hand;
  }

  choose(card: Card): void {
    this._chosen = card;
  }

  unchoose(): void {
    this._chosen = undefined;
  }

  hasChosen(): boolean {
    return this._chosen !== undefined;
  }

  chosen(): Card {
    if (this._chosen === undefined) {
      throw new Error('Accessing chosen card but none are chosen!');
    }
    return this._chosen;
  }

  get seat(): number {
    return this._seat;
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
    const card = this._cards.get(id);
    if (card === undefined) {
      throw new Error('Invalid card ID');
    }
    ninja.choose(card);
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

  judgeWinner(): number {
    const ninjas = this.players.map((p) => this.getNinja(p));
    const [firstCard, secondCard] = ninjas.map((n) => n.chosen());

    if (firstCard.element === secondCard.element) {
      if (firstCard.value > secondCard.value) {
        return 0;
      } else if (firstCard.value < secondCard.value) {
        return 1;
      } else {
        return -1;
      }
    } else if (CardJitsu.RULES[firstCard.element] === secondCard.element) {
      return 0;
    } else {
      return 1;
    }
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
      otherNinja.unchoose();
      ninja.unchoose();

      client.sendWaddleXt('zm', 'judge', winner);
    }
  }
})

export default handler;