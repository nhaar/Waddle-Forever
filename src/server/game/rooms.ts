import { Stamp } from "./stamps";

export enum Room {
  Town = 100,
  GiftShop = 130,
  VRRoom = 213,
  PizzaParlor = 330,
  AstroBarrier = 900,
  BeanCounters = 901,
  PuffleRoundup = 902,
  HydroHopper = 903,
  IceFishing = 904,
  CartSurfer = 905,
  JetPackAdventure = 906,
  Mission1 = 907,
  Mission2 = 908,
  ThinIce = 909,
  Pizzatron = 910,
  Mission3 = 911,
  CatchinWaves = 912,
  Mission4 = 913,
  Mission5 = 914,
  Mission6 = 915,
  Aquagrabber = 916,
  Mission7 = 920,
  Mission8 = 921,
  Mission9 = 922,
  Mission10 = 923,
  DJ3K = 926,
  Mission11 = 927,
  PuffleRescue = 949,
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
  Room.Mission1,
  Room.Mission2,
  Room.Mission3,
  Room.Mission4,
  Room.Mission5,
  Room.Mission6,
  Room.Mission7,
  Room.Mission8,
  Room.Mission9,
  Room.Mission10,
  Room.Mission11,
  Room.PuffleRescue,
  Room.DanceContest
];
export const roomStamps: Record<number, number[]> = {
  [Room.ThinIce]: [
    Stamp.OneCoinBag,
    Stamp.ThreeCoinBags,
    Stamp.SixCoinBags,
    Stamp.IcedTreasure,
    Stamp.TenCoinBags,
    Stamp.IceBonus,
    Stamp.IceTrekker,
    Stamp.AllCoinBags,
    Stamp.IceMaster
  ]
};

export const isGameRoom = (room: Room): boolean => {
  return gameRooms.includes(room);
};
