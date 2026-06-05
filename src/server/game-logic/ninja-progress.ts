import { Stamp } from "./stamps";

/** Manages EXP for Card-Jitsu */
export class CardJitsuProgress {
  private _xp: number;
  private _rank: number;
  private _ninja: boolean;
  /** Number of times that faced Sensei as a black belt without being a ninja */
  private _senseiAttempts: number;

  /**
   * Index is the item you gain from reaching rank - 1
   * Eg index 0 means you are becoming rank 1
   */
  static ITEM_AWARDS: number[] = [4025, 4026, 4027, 4028, 4029, 4030, 4031, 4032, 4033, 104]
  /** Map a rank to the postcard you gain from reaching the rank */
  static POSTCARD_AWARDS: Record<number, number | undefined> = {1: 177, 5: 178, 9: 179};
  /** Map a rank to the stamp you earn frmo reaching the rank */
  static STAMP_AWARDS: Record<number, number | undefined> = {
    1: Stamp.Grasshopper,
    5: Stamp.FineStudent,
    9: Stamp.TrueNinja,
    10: Stamp.NinjaMaster
  };

  /** Max rank XP-wise, ie ninja is a rank above this */
  static MAX_RANK: number = 9;

  constructor(xp: number, attempts: number, ninja: boolean) {
    this._xp = xp;
    this._ninja = ninja;
    this._senseiAttempts = attempts;
    this._rank = this.calculateRank();
  }

  private calculateRank(): number {
    if (this._ninja) {
      return CardJitsuProgress.MAX_RANK + 1;
    }

    // can be optimized, but unecessary
    let rank = 0;
    while (CardJitsuProgress.getThresholdForRank(rank + 1) <= this._xp) {
      rank++;
    }
    return rank;
  }

  get xp(): number {
    return this._xp;
  }

  earnXP(amount: number) {
    this._xp += amount;
    this._rank = this.calculateRank();
  }

  /** Gets how much XP is needed to be at this level */
  static getThresholdForRank(rank: number): number {
    return Math.floor(((rank + 1) * rank) / 2) * 5;
  }

  get rank(): number {
    return this._rank;
  }

  get percentage(): number {
    if (this._rank >= CardJitsuProgress.MAX_RANK) {
      return 0;
    }

    const curRankThreshold = CardJitsuProgress.getThresholdForRank(this._rank);
    const delta = CardJitsuProgress.getThresholdForRank(this._rank + 1) - curRankThreshold;
    return Math.floor((this._xp - curRankThreshold) / delta * 100);
  }

  becomeNinja() {
    this._ninja = true;
    this._rank = this.calculateRank();
  }

  addAttempt() {
    this._senseiAttempts++;
  }

  get senseiAttempts() {
    return this._senseiAttempts;
  }

  get isNinja() {
    return this._ninja;
  }
}

// threshold for rank of index + 1
const FIRE_RANK_THRESHOLD = [
  25,
  50,
  100,
  150
];

export const getFireReward = (rank: number): number | undefined => {
  return [6025, 4120, 2013, 1086, 3032][rank - 1];
}

export const getFireStampReward = (rank: number): number | undefined => {
  return {
    2: Stamp.FireMidWay,
    4: Stamp.FireSuit,
    5: Stamp.FireNinja
  }[rank];
}

export const MIN_SENSEI_RANK = FIRE_RANK_THRESHOLD.length;

// EXP manager using the modern system
export class CardJitsuFireProgress {
  private _xp: number;
  private _ninja: boolean;

  constructor(xp: number, ninja: boolean) {
    this._xp = xp;
    this._ninja = ninja;
  }

  public advanceFromPodium(position: number, playerCount: number): void {
    if (position < 1 || position > playerCount || playerCount < 2 || playerCount > 4) {
      return;
    }
    this._xp += [
      [9, 3],
      [12, 6, 3],
      [15, 9, 6, 3]
    ][playerCount - 2][position - 1];
  }

  public advanceFromOthersQuit(): void {
    this._xp += 2;
  }

  public setNinja() {
    this._ninja = true;
  }

  public getPercentage(): number {
    const rank = this.getRank();
    if (rank >= FIRE_RANK_THRESHOLD.length) {
      return 0;
    } else {
      const prevRankThreshold = FIRE_RANK_THRESHOLD[rank - 1] ?? 0;
      const nextTrankThreshold = FIRE_RANK_THRESHOLD[rank];

      return Math.floor(
        (this._xp - prevRankThreshold) / (nextTrankThreshold - prevRankThreshold) * 100
      );
    }
  }

  public getRank(): number {
    const unbeatenThreshold = FIRE_RANK_THRESHOLD.map((t, i) => [t, i]).find(([t]) => this._xp < t);

    return unbeatenThreshold === undefined
      ? FIRE_RANK_THRESHOLD.length + (this._ninja ? 1 : 0)
      : unbeatenThreshold[1];
  }

  public get xp(): number {
    return this._xp;
  }

  public get isFireNinja(): boolean {
    return this._ninja;
  }
}