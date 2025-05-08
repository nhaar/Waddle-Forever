import { WaddleName } from "../../../server/game-logic/waddles";
import { Client, WaddleGame } from "../../../server/client";
import { WaddleHandler } from "./waddle";
import { randomInt } from "../../../common/utils";
import { CARDS } from "../../../server/game-logic/cards";

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
  private _chosen: number | undefined;

  constructor(player: Client, seat: number) {
    this._hand = new Hand(player.penguin.getCards());
    this._seat = seat;
  }

  get hand(): Hand {
    return this._hand;
  }

  choose(card: number): void {
    this._chosen = card;
  }

  unchoose(): void {
    this._chosen = undefined;
  }

  hasChosen(): boolean {
    return this._chosen !== undefined;
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

  constructor(players: Client[]) {
    super(players);

    this._ninjas = new Map<Client, Ninja>;

    players.forEach((p, i) => {
      this._ninjas.set(p, new Ninja(p, i));
    });

    this._cardId = 0;
  }

  draw(ninja: Ninja): string {
    this._cardId++;
    const card = ninja.hand.draw() ?? -1;
    const cardInfo = CARDS.getStrict(card);
    return `${this._cardId}|${[
      cardInfo.id,
      cardInfo.element,
      cardInfo.value,
      cardInfo.color,
      cardInfo.powerId
    ].join('|')}`;
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
    ninja.choose(Number(id));

    client.sendWaddleXt('zm', action, ninja.seat, id);

    if (otherNinja.hasChosen()) {
      otherNinja.unchoose();
      ninja.unchoose();

      client.sendWaddleXt('zm', 'judge', 0);
    }
  }
})

export default handler;