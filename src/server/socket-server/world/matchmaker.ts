import { WorldPenguin } from "./world-penguin";

type MatchedCallback = (players: WorldPenguin[]) => void;

type TickCallback = (players: WorldPenguin[], time: number) => void;

/**
 * Handles a room that will be used for making a match  of games that have queueing
 * */
class MatchmakingRoom {
  private _matchmaker: MatchMaker;
  private _players: WorldPenguin[];
  private _time = 0;
  private _timer: NodeJS.Timeout;

  constructor(matchmaker: MatchMaker) {
    this._matchmaker = matchmaker;
    this._players = [];
    this.resetTime();
    this._timer = setInterval(() => {
      this._matchmaker.onTick(this._players, this._time);
      this._time--;
      if (this._time < 0) {
        if (this._players.length >= 2) {
          this._matchmaker.onMatched(this._players);
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
    return this._players.length === this._matchmaker.capacity;
  }
}

export class MatchMaker {
  /** Max number of players each match supports */
  private _maxPlayers: number;
  /** All rooms available */
  private _rooms: MatchmakingRoom[];
  /** Callback to run when a match is found */
  private _onMatched: MatchedCallback;
  /** Callback to run each second that ticks while matchmaking */
  private _onTick: TickCallback;

  constructor(max: number, onMatched: MatchedCallback, onTick: TickCallback) {
    this._maxPlayers = max;
    this._rooms = [];
    this._onMatched = onMatched;
    this._onTick = onTick;
  }

  get capacity() {
    return this._maxPlayers;
  }

  /** Add a player to matchmaking with others in the server */
  addPlayer(player: WorldPenguin) {
    const availableIndex = this._rooms.findIndex(room => !room.full);
    if (availableIndex === -1) {
      const room = new MatchmakingRoom(this);
      room.addPlayer(player);
      this._rooms.push(room);
    } else {
      const firstOnQueue = this._rooms[availableIndex];
      firstOnQueue.addPlayer(player);
    }
  }

  get onMatched() {
    return this._onMatched;
  }

  get onTick() {
    return this._onTick;
  }
}