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
  AquaGrabber = 916,
  MyPuffle = 917,
  BurntOutBulbs = 918,
  LimeGreenDojoClean = 919,
  Mission7 = 920,
  Mission8 = 921,
  Mission9 = 922,
  Mission10 = 923,
  DJ3K = 926,
  Mission11 = 927,
  PuffleSoaker = 941,
  BalloonPop = 942,
  RingTheBell = 943,
  FeedAPuffle = 944,
  MemoryCardGame = 945,
  PufflePaddle = 946,
  PuffleShuffle = 947,
  PuffleRescue = 949,
  SystemDefender = 950,
  DanceContest = 952,
  PuffleLaunch = 955,
  PuffleScape = 957,
  CardJitsu = 998
}

/** If the game's score is converted to coins exactly */
export const isLiteralScoreGame = (room: Room): boolean => {
  return [
    Room.IceFishing,
    Room.CartSurfer,
    Room.JetPackAdventure,
    Room.CatchinWaves,
    Room.AquaGrabber,
    Room.DanceContest,
    Room.MyPuffle,
    Room.BurntOutBulbs,
    Room.LimeGreenDojoClean,
    Room.PuffleScape
  ].includes(room);
}

export const isGameRoom = (room: Room): boolean => {
  // from what I know, 900 and forward is only minigames
  // 1000 and above however is reserved for igloos
  return room >= 900 && room < 1000;
};