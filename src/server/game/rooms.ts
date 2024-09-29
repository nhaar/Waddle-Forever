export enum Room {
  Town = 100,
  GiftShop = 130,
  AstroBarrier = 900,
  BeanCounters = 901,
  PuffleRoundup = 902,
  HydroHopper = 903,
  IceFishing = 904,
  CartSurfer = 905,
  JetPackAdventure = 906,
  ThinIce = 909,
  Pizzatron = 910,
  CatchinWaves = 912,
  Aquagrabber = 916,
  DJ3K = 926,
  DanceContest = 952
}

const gameRooms = [
  Room.AstroBarrier,
  Room.BeanCounters,
  Room.PuffleRoundup,
  Room.HydroHopper,
  Room.IceFishing,
  Room.CartSurfer,
  Room.JetPackAdventure,
  Room.ThinIce,
  Room.Pizzatron,
  Room.CatchinWaves,
  Room.Aquagrabber,
  Room.DJ3K,
  Room.DanceContest
]

export function isGameRoom (room: Room): boolean {
  return gameRooms.includes(room)
}
