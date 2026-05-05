// ZA WAAAAARUDO!

import { Vector } from "@common/utils";
import { JsonDatabase } from "@server/database";
import { WaddleName, WADDLE_ROOMS } from "@server/game-logic/waddles";
import { Penguin } from "@server/penguin";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { ClientSocket } from "..";
import { Bakery } from "./bakery";
import { CardJitsu } from "./card";
import { CardJitsuFire } from "./fire";
import { MatchMaker } from "./matchmaker";
import { SledRace } from "./sled";
import { WaddleGame } from "./waddle-game";
import { WaddleRoom } from "./waddle-room";
import { PenguinMessenger } from "./world-client";
import { WorldGame } from "./world-game";
import { WorldPenguin } from "./world-penguin";
import { WorldRoom } from "./world-room";
import { WorldTable } from "./world-table";

export class World {
  private clients = new Map<ClientSocket, ValidCtxObj<WorldContext>>();
  private penguins = new Map<number, WorldPenguin>();
  private rooms = new Map<number, WorldRoom>();
  private games = new Map<number, WorldGame>();
  private spectators = new Set<WorldPenguin>();
  private igloos = new Set<WorldPenguin>();
  private bakery = new Bakery(this.getRoom(853));
  
  // take this ugly thing away from my face at some point
  private matchmaker = new MatchMaker(2, (players) => {
    const game = this.getWaddleGame('card', players) as CardJitsu;
    game.startMatch();
  }, (players, time) => {
    const nicknames = players.map(p => p.info.name);
    players.forEach(p => p.sendXt('tmm', time, ...nicknames));
  });

  public get cardMatchmaker() {
    return this.matchmaker;
  }

  // create class responsible for the puck
  private _puckPosition = new Vector(0, 0);
  private _puckPositionParty = new Vector(0, 0);

  constructor(private gameData: GameData, private settings: SettingsManager, private db: JsonDatabase) {
    this.init();
  }

  public get data() {
    return this.gameData;
  }

  public getSettings() {
    return this.settings;
  }

  public getDb() {
    return this.db;
  }

  public getRoom(id: number): WorldRoom {
    let room = this.rooms.get(id);
    if (room === undefined) {
      room = new WorldRoom((c, e) => this.addContext(c, 'room', e as WorldRoom), (c) => this.removeContext(c, 'room'), id);
      this.rooms.set(id, room);
    }
    return room;
  }

  public addPenguin(messenger: PenguinMessenger, penguin: WorldPenguin): void {
    const client = [...this.clients.entries()].find(([_, ctx]) => {
      return ctx.messenger === messenger;
    });
    if (client !== undefined) {
      this.penguins.set(penguin.id, penguin);
      this.addContext(client[0], 'penguin', penguin);
    }
  }

  public getContext(client: ClientSocket): ValidCtxObj<WorldContext>;
  public getContext(penguin: WorldPenguin): ValidCtxObj<WorldContext>;

  public getContext(arg: ClientSocket | WorldPenguin): ValidCtxObj<WorldContext> {
    if (arg instanceof WorldPenguin) {
      const ctx = [...this.clients.values()].find((ctx) => ctx.penguin === arg);
      if (ctx === undefined) {
        throw new Error('Penguin has no context');
      }
      return ctx;
    }
    let ctx = this.clients.get(arg);
    if (ctx !== undefined) {
      return ctx;
    }
    const messenger = new PenguinMessenger(arg);
    ctx = { messenger };
    this.clients.set(arg, ctx);
    return ctx;
  }

  private addContext<T extends keyof WorldContext & string>(client: ClientSocket, name: T, entity: WorldContext[T]): void;
  private addContext<T extends keyof WorldContext & string>(penguin: WorldPenguin, name: T, entity: WorldContext[T]): void;

  private addContext<T extends keyof WorldContext & string>(target: ClientSocket | WorldPenguin, name: T, entity: WorldContext[T]) {
    let ctx;
    if (target instanceof WorldPenguin) {
      ctx = this.getContext(target);
    } else {
      ctx = this.getContext(target);
    }
    ctx[name] = entity;
  }

  private removeContext<T extends keyof WorldContext & string>(penguin: WorldPenguin, name: T): void {
    const ctx = this.getContext(penguin);
    ctx[name] = undefined;
  }

  public getPenguin(id: number): WorldPenguin | undefined {
    return this.penguins.get(id);
  }

  public getGame(id: number): WorldGame {
    let game = this.games.get(id);
    if (game === undefined) {
      game = new WorldGame((c, e) => this.addContext(c, 'game', e), (c) => this.removeContext(c, 'game'), id);
      this.games.set(id, game);
    }
    return game;
  }

  public disconnect(client: ClientSocket): void {



    const context = this.getContext(client) ?? {};
    const { room, penguin } = context;
    if (room !== undefined && penguin !== undefined) {
      room.removePenguin(penguin);
    }
    if (penguin !== undefined) {
      if (penguin.isAgentPending()) {
        penguin.addItem(800);
      }
      if (room !== undefined) {
        const table = room.getPenguinTable(penguin);
        if (table !== null) {
          const seat = table.getSeatIndex(penguin);
          if (seat !== WorldTable.TABLE_SPECTATOR_SEAT && seat !== undefined) {
            if (table.hasStarted() && table.hasJoined(seat)) {
              table.sendXt('cz', penguin.info.name);
              table.resetRound();
              room.sendTableState(table);
            } else {
              table.removePlayer(penguin);
              const count = table.getCount();
              room.sendTableState(table);
              if (count === 0) {
                table.reset();
              }
            }
          }
          
        }
      }
  
    penguin.info.getBuddies().forEach((buddyId) => {
      const buddyClient = this.getPenguin(buddyId);
      if (buddyClient !== undefined) {
        this.sendBuddyOnlineList(buddyClient, penguin.id);
      }
    });

      const delta = Date.now() - penguin.sessionStart;
      const minutesDelta = delta / 1000 / 60;
      penguin.info.incrementPlayTime(minutesDelta);
      penguin.info.update();
      this.penguins.delete(penguin.id);
    }

    this.clients.delete(client);
    client.end();
  }

  public init() {
    const extraWaddleRooms = this.gameData.getExtraWaddleRooms();
    [...WADDLE_ROOMS, ...extraWaddleRooms].forEach((waddle) => {
      const room = this.getRoom(waddle.roomId);
      room.addWaddle(waddle.waddleId, new WaddleRoom(waddle.waddleId, waddle.seats, waddle.game));
    });

    // TODO this
    this._puckPosition = new Vector(0, 0);
    this._puckPositionParty = new Vector(0, 0);
  }

  public getWaddleGame(name: WaddleName, players: WorldPenguin[]): WaddleGame {
    let game: WaddleGame;

    switch (name) {
      case 'card':
        game = new CardJitsu(players, (c, e) => this.addContext(c, 'card', e as CardJitsu), (c) => this.removeContext(c, 'card'));
        break;
      case 'fire':
        game = new CardJitsuFire(players, (c, e) => this.addContext(c, 'fire', e as CardJitsuFire), (c) => this.removeContext(c, 'fire'));
        break;
      case 'sled':
        game = new SledRace(players, (c, e) => this.addContext(c, 'sled', e as SledRace), (c) => this.removeContext(c, 'sled'));
        break;
      default:
        throw new Error('No waddle game constructor set');
    }

    return game;
  }

  public formatBuddyEntry(id: number, includeOnlineFlag: boolean): string {
    const name = Penguin.getById(id)?.name ?? this.penguins.get(id)?.info.name ?? 'Unknown';
    if (!includeOnlineFlag) {
      return `${id}|${name}`;
    }
    const online = this.penguins.get(id) !== undefined;
    return online ? `${id}|${name}|1` : `${id}|${name}`;
  }

  public handleGetBuddies(penguin: WorldPenguin) {
    // TODO currently pre-cpip only
    if (!this.gameData.isPreCpip()) {
      return;
    }
    const buddies = penguin.info.getBuddies()
      .map((id) => this.formatBuddyEntry(id, true));
    if (buddies.length === 0) {
      penguin.sendXtEmptyLast('gb');
      return;
    }
    penguin.sendXt('gb', ...buddies);
  }

  public removeSpectator(penguin: WorldPenguin) {
    return this.spectators.delete(penguin);
  }

  public handleGetBuddyOnlineList(penguin: WorldPenguin) {
    if (!this.gameData.isPreCpip()) {
      return;
    }
    const onlineIds = penguin.info.getBuddies().filter((id) => this.penguins.get(id) !== undefined);
    if (onlineIds.length === 0) {
      penguin.sendXtEmptyLast('go');
      return;
    }
    penguin.sendXt('go', ...onlineIds);
  };

  public sendBuddyOnlineList(penguin: WorldPenguin, excludeId?: number): void {
    const onlineIds = penguin.info.getBuddies().filter((id) => {
      if (excludeId !== undefined && id === excludeId) {
        return false;
      }
      return this.penguins.get(id) !== undefined;
    });
    penguin.sendXt('go', ...onlineIds);
  }

  // maybe a class for managing open igloos 
  public openIgloo(penguin: WorldPenguin) {
    this.igloos.add(penguin);
  }

  public closeIgloo(penguin: WorldPenguin) {
    this.igloos.delete(penguin);
  }

  public getOpenIglooPlayers() {
    return [...this.igloos.values()];
  }

  public getBakery() {
    return this.bakery;
  }

  public getPuckPosition() {
    return this._puckPosition.vector;
  }

  public getPuckPositionParty() {
    return this._puckPositionParty.vector;
  }
}

export interface WorldContext {
  'world': World;
  'penguin': WorldPenguin;
  'room': WorldRoom;
  'game': WorldGame;
  'card': CardJitsu;
  'fire': CardJitsuFire;
  'sled': SledRace;
  'messenger': PenguinMessenger
}