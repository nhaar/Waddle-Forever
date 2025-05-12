/** Manages EXP for Card-Jitsu */
export class CardJitsuProgress {
  private _xp: number;
  private _rank: number;

  /**
   * Index is the item you gain from reaching rank - 1
   * Eg index 0 means you are becoming rank 1
   */
  static ITEM_AWARDS: number[] = [4025, 4026, 4027, 4028, 4029, 4030, 4031, 4032, 4033, 104]
  /** Map a rank to the postcard you gain from reaching the rank */
  static POSTCARD_AWARDS: Record<number, number | undefined> = {1: 177, 5: 178, 9: 179};
  /** Map a rank to the stamp you earn frmo reaching the rank */
  static STAMP_AWARDS: Record<number, number | undefined> = {
    1: 230,
    5: 232,
    9: 234,
    10: 236
  };

  static MAX_RANK: number = 9;

  constructor(xp: number) {
    this._xp = xp;
    this._rank = this.calculateRank();
  }

  private calculateRank(): number {
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
    const curRank = CardJitsuProgress.getThresholdForRank(this._rank);
    const delta = CardJitsuProgress.getThresholdForRank(this._rank + 1) - curRank;
    return Math.floor((this._xp - curRank) / delta * 100);
  }
}