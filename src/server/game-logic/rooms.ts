import { Version } from "../routes/versions";
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

export const roomStamps: Record<number, number[]> = {
  [Room.JetPackAdventure]: [
    Stamp.LiftOff,
    Stamp.FuelRank1,
    Stamp.PufflePilot,
    Stamp.JetPack5,
    Stamp.Crash,
    Stamp.FuelRank2,
    Stamp.FuelRank3,
    Stamp.FuelRank4,
    Stamp.FuelRank5,
    Stamp.OneUpLeader,
    Stamp.PuffleBonus,
    Stamp.Kerching,
    Stamp.FuelCommand,
    Stamp.FuelWings,
    Stamp.OneUpCaptain,
    Stamp.PufflePlus,
    Stamp.AcePilot,
    Stamp.PuffleBoost,
  ],
  [Room.AstroBarrier]: [
    Stamp.Astro5,
    Stamp.Astro5Max,
    Stamp.Astro40,
    Stamp.ShipBlast,
    Stamp.OneUpBlast,
    Stamp.AstroSecret,
    Stamp.Astro10Max,
    Stamp.Astro20Max,
    Stamp.AstroExpert,
    Stamp.Astro30Max,
    Stamp.Astro1Up,
    Stamp.AstroMaster,
  ],
  [Room.ThinIce]: [
    Stamp.OneCoinBagThinIce,
    Stamp.ThreeCoinBagsThinIce,
    Stamp.SixCoinBags,
    Stamp.IcedTreasure,
    Stamp.TenCoinBags,
    Stamp.IceBonus,
    Stamp.IceTrekker,
    Stamp.AllCoinBags,
    Stamp.IceMaster
  ],
  [Room.AquaGrabber]: [
    Stamp.SquidSpotter,
    Stamp.AquaPuffle,
    Stamp.SodaSucces,
    Stamp.ClamSuccess,
    Stamp.SodaMaster,
    Stamp.ClamMaster,
    Stamp.GetFluffy,
    Stamp.GetTheWorm,
    Stamp.BubbleCatch,
    Stamp.PearlCapture,
    Stamp.ClamTreasure,
    Stamp.SodaTreasure,
    Stamp.ClamCompress,
    Stamp.SodaCompress,
    Stamp.ClamPressure,
    Stamp.SodaPressure,
    Stamp.ClamTimer,
    Stamp.SodaTimer,
    Stamp.CrabsTreasure,
    Stamp.MulletCapture
  ],
  [Room.CatchinWaves]: [
    Stamp.FirstTrick,
    Stamp.PuffleSurfin,
    Stamp.EasyFlip,
    Stamp.EasyTube,
    Stamp.EasyGrind,
    Stamp.Graduate,
    Stamp.EasySpin,
    Stamp.TrickStar,
    Stamp.PodiumPuffle,
    Stamp.FlipStar,
    Stamp.EasyJump,
    Stamp.SuperTube,
    Stamp.SuperSpin,
    Stamp.SuperGrind,
    Stamp.MaxGrind,
    Stamp.FirstPlace,
    Stamp.MaxFlips,
    Stamp.HighJump,
    Stamp.MaxTube,
    Stamp.MaxSpin,
    Stamp.Shark,
    Stamp.Survivor
  ],
  [Room.PuffleRescue]: [
    Stamp.OneCoinBagPuffleRescue,
    Stamp.QuickCatch,
    Stamp.RapidRescue,
    Stamp.OneCoinBubble,
    Stamp.SOS30,
    Stamp.TwoCoinBags,
    Stamp.SnowStudent,
    Stamp.CaveCoins,
    Stamp.CaveCoinsPlus,
    Stamp.SuperCatch,
    Stamp.EasyCannon,
    Stamp.CloseCall,
    Stamp.ExpressRescue,
    Stamp.TenSeaLevels,
    Stamp.TwoCoinBubbles,
    Stamp.SOS60,
    Stamp.ThreeCoinBagsPuffleRescue,
    Stamp.SnowMaster,
    Stamp.CaveCoinsMax,
    Stamp.ExpertCatch,
    Stamp.SuperCannon,
    Stamp.ExtremeRescue,
    Stamp.TwentySeaLevels,
    Stamp.ThreeCoinBubbles,
    Stamp.SnowHero,
    Stamp.ExtremeCannon,
    Stamp.ThirtySeaLevels,
  ],
  [Room.CartSurfer]: [
    Stamp.GreatBalance,
    Stamp.CartPro,
    Stamp.MineMarvel,
    Stamp.MineMission,
    Stamp.TrickMaster,
    Stamp.PufflePower,
    Stamp.CartExpert,
    Stamp.MineGrind,
    Stamp.SurfsUp,
    Stamp.FlipMania,
    Stamp.UltimateDuo,
    Stamp.CartMaster
  ],
  [Room.CardJitsu]: [
    Stamp.Grasshopper,
    Stamp.ElementalWin,
    Stamp.FineStudent,
    Stamp.FlawlessVictory,
    Stamp.OneElement,
    Stamp.TrueNinja,
    Stamp.MatchMaster,
    Stamp.NinjaMaster,
    Stamp.SenseiCard,
    Stamp.FullDojo
  ],
  [Room.PuffleLaunch]: [
    334,
    340,
    344,
    342,
    338,
    336,
    350,
    346,
    348,
    354,
    356,
    352
  ],
  [Room.PuffleScape]: [
    429,
    427,
    436,
    434,
    431,
    437,
    435,
    432,
    428,
    433,
    430
  ]
};

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
    Room.LimeGreenDojoClean
  ].includes(room);
}

export const isGameRoom = (room: Room): boolean => {
  // from what I know, 900 and forward is only minigames
  // 1000 and above however is reserved for igloos
  return room >= 900 && room < 1000;
};

type RoomName = 'Town' |
  'Snow Forts' |
  'Sport Shop' |
  'Mountain' |
  'Ski Lodge' |
  'Plaza' |
  'Pizza Parlor' |
  'Pet Shop' |
  'Iceberg' |
  'Ski Village' |
  'Everyday Phoning Facility';

type RoomOpening = {
  date: Version;
  rooms: RoomName | RoomName[];
  type: 'open'
};

type RoomUpdate = {
  date: Version;
  type: 'update';
  descriptions: string[];
}

type RoomEvent = RoomOpening | RoomUpdate;


export const ROOM_TIMELINE: RoomEvent[] = [
  { date: '2005-09-12', rooms: 'Snow Forts', type: 'open' },
  { date: '2005-11-03', rooms: 'Sport Shop', type: 'open' },
  { date: '2005-11-18', rooms: 'Mountain', type: 'open' },
  { date: '2005-12-22', rooms: 'Ski Lodge', type: 'open' },
  { date: '2006-02-24', rooms: ['Plaza', 'Pizza Parlor'], type: 'open' },
  { date: '2006-03-17', rooms: 'Pet Shop', type: 'open' },
  { date: '2006-03-29', rooms: 'Iceberg', type: 'open' },
  {
    date: '2010-04-21',
    descriptions: [
      'The Forest now has a path to the Mine Shack'
    ],
    type: 'update'
  },
  { date: '2010-05-27', rooms: 'Everyday Phoning Facility', type: 'open' },
  {
    date: '2010-05-27',
    descriptions: [
      'The Sport Shop is replaced with the Everyday Phoning Facility',
      'The Ice Rink was changed into the Stadium'
    ],
    type: 'update'
  },
  {
    date: '2010-06-17',
    descriptions: [
      'The Forest now has a path to the Hidden Lake'
    ],
    type: 'update'
  },
  {
    date: '2010-07-29',
    descriptions: [
      'Grass grew on the patch near the mine shack'
    ],
    type: 'update'
  },
  {
    date: '2010-08-26',
    descriptions: [
      'The tree near the mine shack grew longer'
    ],
    type: 'update'
  },
  {
    date: '2010-09-30',
    descriptions: [
      'The tree near the mine shack grew longer'
    ],
    type: 'update'
  },
  {
    date: '2010-12-20',
    descriptions: [
      'The Ice Rink showed up for the season'
    ],
    type: 'update'
  }
];