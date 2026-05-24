// ZA WAAAAARUDO!

import { Vector } from "@common/utils";
import { PenguinRepository } from "@server/database/database";
import { WaddleName, WADDLE_ROOMS } from "@server/game-logic/waddles";
import { PenguinMessenger } from "@server/handlers/messenger";
import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";
import { ClientSocket } from "..";
import { SledRace } from "./sled";
import { WaddleGame } from "./waddle-game";
import { WaddleRoom } from "./waddle-room";
import { WorldGame } from "./world-game";
import { WorldPenguin } from "./world-penguin";
import { WorldRoom } from "./world-room";
import { CardJitsu } from "./card";
import { Bakery } from "./bakery";

type PenguinState = {
  room?: WorldRoom;
  game?: WorldGame;
  sled?: SledRace;
  card?: CardJitsu;
};

export class World {
  private penguins = new Map<number, WorldPenguin>();
  private states = new Map<WorldPenguin, PenguinState>
  private rooms = new Map<number, WorldRoom>();
  private games = new Map<number, WorldGame>();
  private spectators = new Set<WorldPenguin>();
  private igloos = new Set<WorldPenguin>();
  private _bakery: Bakery;
  
  // create class responsible for the puck
  private _puckPosition = new Vector(0, 0);
  private _puckPositionParty = new Vector(0, 0);
  private _teamsScore: [number, number] = [0, 0];

  constructor(private gameData: GameData) {
    this.init();
    this._bakery = new Bakery(this.getRoom(853));
  }

  public getRoom(id: number): WorldRoom {
    let room = this.rooms.get(id);
    if (room === undefined) {
      room = new WorldRoom((c, e) => this.addContext(c, 'room', e as WorldRoom), (c) => this.removeContext(c, 'room'), id);
      this.rooms.set(id, room);
    }
    return room;
  }

  public addPenguin(penguin: WorldPenguin): void {
    this.penguins.set(penguin.id, penguin);
    this.states.set(penguin, {});
  }

  public getContext(p: WorldPenguin): PenguinState | undefined {
    return this.states.get(p);
  }

  private addContext<T extends keyof PenguinState>(penguin: WorldPenguin, name: T, entity: PenguinState[T]): void {
    const ctx = this.getContext(penguin);
    if (ctx !== undefined) {
      ctx[name] = entity;
    }
  }

  private removeContext<T extends keyof PenguinState>(penguin: WorldPenguin, name: T): void {
    const ctx = this.getContext(penguin);
    if (ctx !== undefined) {
      ctx[name] = undefined;
    }
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

  public disconnect(penguin: WorldPenguin) {
    this.penguins.delete(penguin.id);
    this.states.delete(penguin);
  }

  public init() {
    const extraWaddleRooms = this.gameData.getExtraWaddleRooms();
    [...WADDLE_ROOMS, ...extraWaddleRooms].forEach((waddle) => {
      const room = this.getRoom(waddle.roomId);
      room.addWaddle(waddle.waddleId, new WaddleRoom(waddle.waddleId, waddle.seats, waddle.game));
    });
  }

  public getWaddleGame(name: WaddleName, players: WorldPenguin[]): WaddleGame {
    let game: WaddleGame;

    switch (name) {
      case 'card':
        game = new CardJitsu(players, (c, e) => this.addContext(c, 'card', e as CardJitsu), (c) => this.removeContext(c, 'card'));
        break;
    //   case 'fire':
    //     game = new CardJitsuFire(players, (c, e) => this.addContext(c, 'fire', e as CardJitsuFire), (c) => this.removeContext(c, 'fire'));
    //     break;
      case 'sled':
        game = new SledRace(players, (c, e) => this.addContext(c, 'sled', e as SledRace), (c) => this.removeContext(c, 'sled'));
        break;
      default:
        throw new Error('No waddle game constructor set');
    }
    
    return game;
  }

  public getById(id: number) {
    return this.penguins.get(id);
  }

  public removeSpectator(penguin: WorldPenguin) {
    return this.spectators.delete(penguin);
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

  public getPuckPosition() {
    return this._puckPosition.vector;
  }

  public getPuckPositionParty() {
    return this._puckPositionParty.vector;
  }

  public get players() {
    return [...this.penguins.values()];
  }

  public get teamScores() {
    return [...this._teamsScore];
  }

  public getPuck(room: WorldRoom): [number, number] | null {
    return {
      802: this.getPuckPosition(),
      898: this.getPuckPositionParty()
    }[room.id] ?? null;
  }

  public updatePuck(x: number, y: number, room: WorldRoom): boolean {
    if (room.id === 802) {
      this._puckPosition = new Vector(x, y);
      return true;
    } else if (room.id === 898) {
      this._puckPositionParty = new Vector(x, y);
      return true;
    } else {
      return false;
    }
  }

  public updateTeamScore(team: number): void {
    this._teamsScore[team]++;
    if (this._teamsScore[team] >= 10) {
      this._teamsScore = [0, 0];
    }
  }

  public addBakeryListener(callback: () => void) {
    this._bakery.addListener(callback);
  }

  public get bakery() {
    return this._bakery;
  }
}

export type PenguinPersister = (p: WorldPenguin, force?: boolean) => void;

export interface WorldContext {
  'world': World;
  'penguin': WorldPenguin;
  'msg': PenguinMessenger;
  'room': WorldRoom;
  'game': WorldGame;
  'data': GameData;
  'client': ClientSocket;
  'settings': SettingsManager;
  'db': PenguinRepository;
  'prst': PenguinPersister;
  // 'fire': CardJitsuFire;
  'sled': SledRace;
  'card': CardJitsu;
}