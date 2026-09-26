import { SnowPlayer } from "./snow/snow";
import { WorldPenguin } from "./world-penguin";

type Penguin = WorldPenguin | SnowPlayer;

type MatchedCallback = (players: Penguin[]) => void;

type TickCallback = (players: Penguin[], time: number) => void;

type FindAvailableRoomCallback = (room: MatchmakingRoom, p: Penguin | undefined) => boolean;

/**
 * Handles a room that will be used for making a match  of games that have queueing
 * */
class MatchmakingRoom {
  private _players: Penguin[];
  private _time = 0;
  private _timer: NodeJS.Timeout;

  constructor(private _max: number, private _matchedCallback: MatchedCallback, private _tickCallback: TickCallback) {
    this._players = [];
    this.resetTime();
    this._timer = setInterval(() => {
      this._tickCallback(this._players, this._time);
      this._time--;
      if (this._time < 0) {
        if (this._players.length >= this._max) {
          clearInterval(this._timer);
          this._matchedCallback(this._players);
        } else {
          this.resetTime();
        }
      }
    }, 1000);
  }

  private resetTime() {
    this._time = 10;
  }

  addPlayer(player: Penguin) {
    this._players.push(player);
  }

  public removePlayer(player: Penguin): void {
    this._players = this._players.filter(p => p !== player);
  }

  public allPlayersMeetCondition(predicate: (p: Penguin) => boolean) {
    return this._players.every(predicate);
  }

  public clearTimer(): void {
    clearTimeout(this._timer);
  }

  public isEmpty(): boolean {
    return this._players.length === 0;
  }

  get full() {
    return this._players.length === this._max;
  }
}

export class MatchMaker {
  /** Max number of players each match supports */
  protected _maxPlayers: number;
  /** All rooms available */
  protected _rooms: MatchmakingRoom[];
  /** Callback to run when a match is found */
  protected _onMatched: MatchedCallback | null = null;
  /** Callback to run each second that ticks while matchmaking */
  protected _onTick: TickCallback | null = null;
  /** Predicate run for each room in _rooms, to determine if a penguin can be inserted in it */
  protected _findAvailableRoom: FindAvailableRoomCallback = (r) => !r.full;

  constructor(max: number) {
    this._maxPlayers = max;
    this._rooms = [];
  }

  get capacity() {
    return this._maxPlayers;
  }

  /** Add a player to matchmaking with others in the server */
  addPlayer(player: Penguin) {
    if (this._onMatched === null || this._onTick === null) {
      throw new Error('Adding player to matchmaking without listeners');
    }
    const availableIndex = this._rooms.findIndex(r => this._findAvailableRoom(r, player));
    if (availableIndex === -1) {
      const room = new MatchmakingRoom(this._maxPlayers, players => {
        this._rooms = this._rooms.filter(candidate => candidate !== room);
        this._onMatched?.(players);
      }, this._onTick);
      room.addPlayer(player);
      this._rooms.push(room);
    } else {
      const firstOnQueue = this._rooms[availableIndex];
      firstOnQueue.addPlayer(player);
    }
  }

  public removePlayer(player: Penguin): void {
    this._rooms.forEach(room => {
      room.removePlayer(player);
      if (room.isEmpty()) {
        room.clearTimer();
      }
    });
    this._rooms = this._rooms.filter(r => !r.isEmpty());
  }

  public setMatchListener(callback: MatchedCallback): void {
    this._onMatched = callback;
  }

  public setTickListener(callback: TickCallback): void {
    this._onTick = callback;
  }

  public setAvailableRoomPredicate(callback: FindAvailableRoomCallback): void {
    this._findAvailableRoom = callback;
  }
}
