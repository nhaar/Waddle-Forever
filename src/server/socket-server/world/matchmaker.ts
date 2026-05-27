import { WorldPenguin } from "./world-penguin";

type MatchedCallback = (players: WorldPenguin[]) => void;

type TickCallback = (players: WorldPenguin[], time: number) => void;

/**
 * Handles a room that will be used for making a match  of games that have queueing
 * */
class MatchmakingRoom {
  private _players: WorldPenguin[];
  private _time = 0;
  private _timer: NodeJS.Timeout;

  constructor(private _max: number, private _matchedCallback: MatchedCallback, private _tickCallback: TickCallback) {
    this._players = [];
    this.resetTime();
    this._timer = setInterval(() => {
      this._tickCallback(this._players, this._time);
      this._time--;
      if (this._time < 0) {
        if (this._players.length >= 2) {
          this._matchedCallback(this._players);
          clearInterval(this._timer);
        } else {
          this.resetTime();
        }
      }
    }, 1000);
  }

  private resetTime() {
    this._time = 10;
  }

  addPlayer(player: WorldPenguin) {
    this._players.push(player);
  }

  get full() {
    return this._players.length === this._max;
  }
}

export class MatchMaker {
  /** Max number of players each match supports */
  private _maxPlayers: number;
  /** All rooms available */
  private _rooms: MatchmakingRoom[];
  /** Callback to run when a match is found */
  private _onMatched: MatchedCallback | null = null;
  /** Callback to run each second that ticks while matchmaking */
  private _onTick: TickCallback | null = null;

  constructor(max: number) {
    this._maxPlayers = max;
    this._rooms = [];
  }

  get capacity() {
    return this._maxPlayers;
  }

  /** Add a player to matchmaking with others in the server */
  addPlayer(player: WorldPenguin) {
    if (this._onMatched === null || this._onTick === null) {
      throw new Error('Adding player to matchmaking without listeners');
    }
    const availableIndex = this._rooms.findIndex(room => !room.full);
    if (availableIndex === -1) {
      const room = new MatchmakingRoom(this._maxPlayers, this._onMatched, this._onTick);
      room.addPlayer(player);
      this._rooms.push(room);
    } else {
      const firstOnQueue = this._rooms[availableIndex];
      firstOnQueue.addPlayer(player);
    }
  }

  public addMatchListener(callback: MatchedCallback): void {
    this._onMatched = callback;
  }

  public addTickListener(callback: TickCallback): void {
    this._onTick = callback;
  }
}