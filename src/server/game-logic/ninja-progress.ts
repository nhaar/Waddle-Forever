/** Manages EXP for Card-Jitsu */
export class CardJitsuProgress {
  private _xp: number;
  private _rank: number;

  constructor(xp: number) {
    this._xp = xp;
    this._rank = this.calculateRank();
  }

  private calculateRank(): number {
    // can be optimized, but unecessary
    let rank = 0;
    while (CardJitsuProgress.getThresholdForRank(rank) < this._xp) {
      rank++;
    }
    return rank;
  }

  get xp(): number {
    return this._xp;
  }

  set xp(amount: number) {
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
    const curRank = CardJitsuProgress.getThresholdForRank(this._rank);
    const delta = CardJitsuProgress.getThresholdForRank(this._rank + 1) - curRank;
    return Math.floor((this._xp - curRank) / delta * 100);
  }
}