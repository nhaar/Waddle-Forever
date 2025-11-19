
export enum CategoryID {
  Activities = 7,
  Events = 5,
  Characters = 6,
  Party = 23,
  Games = 8,
  AquaGrabber = 13,
  JetPackAdventure = 11,
  PuffleRescue = 19,
  PSAMissions = 22,
  VideoGames = 25,
  GameDay = 26,
  CartSurfer = 28,
  CardJitsu = 38,
  CardJitsuFire = 32,
  CardJitsuWater = 34,
  SystemDefender = 46,
  PuffleLaunch = 48,
  TreasureHunt = 56,
  Pufflescape = 57
}

export type StampCategory = {
  name: string
  description: string
  parent_group_id: number
  display: string
  group_id: number;
  stamps: Stamp[]
}

export type Stamp = {
  stamp_id: number
  name: string
  is_member: 0 | 1
  description: string
} & ({
  rank: 1
  rank_token: 'easy'
} | {
  rank: 2
  rank_token: 'medium'
} | {
  rank: 3
  rank_token: 'hard'
} | {
  rank: 4
  rank_token: 'extreme'
} | {
  rank: 0
  rank_token: 'none specified'
})

type NewCategoryUpdate = { category: StampCategory };
type NewStampsUpdate = {
  categoryId: CategoryID;
  stamps: Stamp[]
};

export type StampUpdates = Array<NewCategoryUpdate | NewStampsUpdate>;