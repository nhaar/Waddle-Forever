import { GameVersion } from "../settings"
import { isGreaterOrEqual, isLower } from "./versions"

type Category = {
  name: string
  description: string
  parent_group_id: number
  display: string
  stamps: Record<string, Stamp> | []
}

type Stamp = {
  stamp_id: number
  name: string
  is_member: boolean
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

type Stampbook = Record<string, Category>

const originalStampbook = {
  "7": {
    "name": "Activities",
    "description": "Doing things in-game",
    "parent_group_id": 0,
    "display": "Activities",
    "stamps": {
      "14": {
        "stamp_id": 14,
        "name": "183 days! ",
        "is_member": false,
        "rank": 2,
        "description": "Log in with a penguin 183 days old or older",
        "rank_token": "medium"
      },
      "20": {
        "stamp_id": 20,
        "name": "365 days!",
        "is_member": false,
        "rank": 3,
        "description": "Log in with a penguin 365 days old or older",
        "rank_token": "hard"
      },
      "26": {
        "stamp_id": 26,
        "name": "Berg Drill!",
        "is_member": false,
        "rank": 3,
        "description": "Dance with 30 penguins wearing hard hats at the Berg",
        "rank_token": "hard"
      },
      "13": {
        "stamp_id": 13,
        "name": "Clock Target",
        "is_member": false,
        "rank": 1,
        "description": "Hit the Clock target 10 times in a row",
        "rank_token": "easy"
      },
      "18": {
        "stamp_id": 18,
        "name": "Coffee Server",
        "is_member": false,
        "rank": 2,
        "description": "Serve 5 coffees, using the apron and emote",
        "rank_token": "medium"
      },
      "16": {
        "stamp_id": 16,
        "name": "Dance Party",
        "is_member": false,
        "rank": 2,
        "description": "Party in the Night Club with 10 penguins",
        "rank_token": "medium"
      },
      "22": {
        "stamp_id": 22,
        "name": "Floor Filler",
        "is_member": false,
        "rank": 3,
        "description": "Dance in the Night Club with 25 penguins",
        "rank_token": "hard"
      },
      "27": {
        "stamp_id": 27,
        "name": "Fort Battle",
        "is_member": false,
        "rank": 3,
        "description": "Throw snow at the Forts with 5 penguins of the same color",
        "rank_token": "hard"
      },
      "23": {
        "stamp_id": 23,
        "name": "Full House",
        "is_member": true,
        "rank": 3,
        "description": "Fill your igloo with 99 furniture items",
        "rank_token": "hard"
      },
      "12": {
        "stamp_id": 12,
        "name": "Go Swimming",
        "is_member": false,
        "rank": 1,
        "description": "Swim in water with a rubber duck",
        "rank_token": "easy"
      },
      "15": {
        "stamp_id": 15,
        "name": "Going Places",
        "is_member": false,
        "rank": 2,
        "description": "Waddle around 30 rooms",
        "rank_token": "medium"
      },
      "29": {
        "stamp_id": 29,
        "name": "Hockey Team",
        "is_member": false,
        "rank": 3,
        "description": "Form a team with 5 penguins in the same jersey",
        "rank_token": "hard"
      },
      "17": {
        "stamp_id": 17,
        "name": "Igloo Party",
        "is_member": false,
        "rank": 2,
        "description": "Throw an igloo party for 10 penguins",
        "rank_token": "medium"
      },
      "30": {
        "stamp_id": 30,
        "name": "Ninja Meeting",
        "is_member": false,
        "rank": 4,
        "description": "Meet 10 black belts in the Ninja Hideout",
        "rank_token": "extreme"
      },
      "28": {
        "stamp_id": 28,
        "name": "Party Host ",
        "is_member": false,
        "rank": 4,
        "description": "Throw an igloo party for 30 penguins",
        "rank_token": "extreme"
      },
      "19": {
        "stamp_id": 19,
        "name": "Pizza Waiter",
        "is_member": false,
        "rank": 2,
        "description": "Serve 5 pizzas, using the apron and emote",
        "rank_token": "medium"
      },
      "24": {
        "stamp_id": 24,
        "name": "Play It Loud! ",
        "is_member": false,
        "rank": 3,
        "description": "Form a full band at the Lighthouse",
        "rank_token": "hard"
      },
      "21": {
        "stamp_id": 21,
        "name": "Puffle Owner",
        "is_member": false,
        "rank": 3,
        "description": "Adopt and care for 16 puffles",
        "rank_token": "hard"
      },
      "11": {
        "stamp_id": 11,
        "name": "Snapshot",
        "is_member": false,
        "rank": 1,
        "description": "Use a camera on top of the Ski Hill",
        "rank_token": "easy"
      },
      "25": {
        "stamp_id": 25,
        "name": "Soccer Team ",
        "is_member": false,
        "rank": 4,
        "description": "Form a team with 5 penguins in the same jersey",
        "rank_token": "extreme"
      },
      "9": {
        "stamp_id": 9,
        "name": "Stage Crew",
        "is_member": false,
        "rank": 1,
        "description": "Operate the Switchbox 3000",
        "rank_token": "easy"
      },
      "10": {
        "stamp_id": 10,
        "name": "Underground",
        "is_member": false,
        "rank": 1,
        "description": "Find the secret entrance to the underground",
        "rank_token": "easy"
      }
    }
  },
  "5": {
    "name": "Events",
    "description": "Events",
    "parent_group_id": 0,
    "display": "Events",
    "stamps": [] as []
  },
  "6": {
    "name": "Characters",
    "description": "Characters",
    "parent_group_id": 5,
    "display": "Events : Characters",
    "stamps": {
      "33": {
        "stamp_id": 33,
        "name": "Aunt Arctic",
        "is_member": false,
        "rank": 4,
        "description": "Be in the same room as Aunt Arctic",
        "rank_token": "extreme"
      },
      "31": {
        "stamp_id": 31,
        "name": "Cadence ",
        "is_member": false,
        "rank": 3,
        "description": "Be in the same room as Cadence",
        "rank_token": "hard"
      },
      "8": {
        "stamp_id": 8,
        "name": "Gary",
        "is_member": false,
        "rank": 3,
        "description": "Be in the same room as Gary the Gadget Guy",
        "rank_token": "hard"
      },
      "32": {
        "stamp_id": 32,
        "name": "Franky",
        "is_member": false,
        "rank": 3,
        "description": "Be in the same room as Franky",
        "rank_token": "hard"
      },
      "34": {
        "stamp_id": 34,
        "name": "G Billy",
        "is_member": false,
        "rank": 3,
        "description": "Be in the same room as G Billy",
        "rank_token": "hard"
      },
      "35": {
        "stamp_id": 35,
        "name": "Petey K",
        "is_member": false,
        "rank": 3,
        "description": "Be in the same room as Petey K",
        "rank_token": "hard"
      },
      "36": {
        "stamp_id": 36,
        "name": "Stompin' Bob",
        "is_member": false,
        "rank": 3,
        "description": "Be in the same room as Stompin' Bob",
        "rank_token": "hard"
      },
      "7": {
        "stamp_id": 7,
        "name": "Rockhopper ",
        "is_member": false,
        "rank": 2,
        "description": "Be in the same room as Rockhopper",
        "rank_token": "medium"
      }
    }
  },
  "8": {
    "name": "Games",
    "description": "Parent group only",
    "parent_group_id": 0,
    "display": "Games",
    "stamps": [] as []
  },
  "13": {
    "name": "Aqua Grabber",
    "description": "Aqua Grabber related stamps",
    "parent_group_id": 8,
    "display": "Games : Aqua Grabber",
    "stamps": {
      "73": {
        "stamp_id": 73,
        "name": "Aqua Puffle",
        "is_member": false,
        "rank": 1,
        "description": "Take your pink puffle for a deep-sea dive",
        "rank_token": "easy"
      },
      "80": {
        "stamp_id": 80,
        "name": "Bubble Catch",
        "is_member": false,
        "rank": 2,
        "description": "Collect a pink puffle's bubble",
        "rank_token": "medium"
      },
      "84": {
        "stamp_id": 84,
        "name": "Clam Compress",
        "is_member": false,
        "rank": 3,
        "description": "Complete the Clam Waters compressed air mode",
        "rank_token": "hard"
      },
      "77": {
        "stamp_id": 77,
        "name": "Clam Master",
        "is_member": false,
        "rank": 2,
        "description": "Complete Clam Waters levels without losing a life",
        "rank_token": "medium"
      },
      "86": {
        "stamp_id": 86,
        "name": "Clam Pressure",
        "is_member": false,
        "rank": 3,
        "description": "Master the Clam Waters compressed air mode without losing a life",
        "rank_token": "hard"
      },
      "75": {
        "stamp_id": 75,
        "name": "Clam Success",
        "is_member": false,
        "rank": 2,
        "description": "Complete Clam Waters levels",
        "rank_token": "medium"
      },
      "88": {
        "stamp_id": 88,
        "name": "Clam Timer",
        "is_member": false,
        "rank": 3,
        "description": "Complete the Clam Waters time trial",
        "rank_token": "hard"
      },
      "82": {
        "stamp_id": 82,
        "name": "Clam Treasure",
        "is_member": false,
        "rank": 3,
        "description": "Discover secret treasure in Clam Waters levels",
        "rank_token": "hard"
      },
      "91": {
        "stamp_id": 91,
        "name": "Crab's Treasure",
        "is_member": true,
        "rank": 3,
        "description": "Capture all the crab's treasure",
        "rank_token": "hard"
      },
      "78": {
        "stamp_id": 78,
        "name": "Get Fluffy",
        "is_member": true,
        "rank": 2,
        "description": "Catch the yellow fish and return to your net",
        "rank_token": "medium"
      },
      "79": {
        "stamp_id": 79,
        "name": "Get the Worm",
        "is_member": true,
        "rank": 2,
        "description": "Catch a worm and return to your net",
        "rank_token": "medium"
      },
      "92": {
        "stamp_id": 92,
        "name": "Mullet Capture",
        "is_member": true,
        "rank": 4,
        "description": "Capture the large red fish and return to the net",
        "rank_token": "extreme"
      },
      "81": {
        "stamp_id": 81,
        "name": "Pearl Capture",
        "is_member": false,
        "rank": 2,
        "description": "Collect all the white pearls in Clam Waters levels",
        "rank_token": "medium"
      },
      "85": {
        "stamp_id": 85,
        "name": "Soda Compress",
        "is_member": true,
        "rank": 3,
        "description": "Complete the Soda Seas compressed air mode",
        "rank_token": "hard"
      },
      "76": {
        "stamp_id": 76,
        "name": "Soda Master",
        "is_member": true,
        "rank": 2,
        "description": "Complete Soda Seas levels without losing a life",
        "rank_token": "medium"
      },
      "87": {
        "stamp_id": 87,
        "name": "Soda Pressure",
        "is_member": true,
        "rank": 3,
        "description": "Master the Soda Seas compressed air mode without losing a life",
        "rank_token": "hard"
      },
      "74": {
        "stamp_id": 74,
        "name": "Soda Success",
        "is_member": true,
        "rank": 2,
        "description": "Complete Soda Seas levels",
        "rank_token": "medium"
      },
      "89": {
        "stamp_id": 89,
        "name": "Soda Timer",
        "is_member": true,
        "rank": 3,
        "description": "Complete the Soda Seas time trial",
        "rank_token": "hard"
      },
      "83": {
        "stamp_id": 83,
        "name": "Soda Treasure",
        "is_member": true,
        "rank": 3,
        "description": "Discover secret treasure in Soda Seas levels",
        "rank_token": "hard"
      },
      "72": {
        "stamp_id": 72,
        "name": "Squid Spotter",
        "is_member": false,
        "rank": 1,
        "description": "Spot the squid",
        "rank_token": "easy"
      }
    }
  },
  "14": {
    "name": "Astro Barrier",
    "description": "Astro Barrier related stamps",
    "parent_group_id": 8,
    "display": "Games : Astro Barrier",
    "stamps": {
      "55": {
        "stamp_id": 55,
        "name": "1-up Blast",
        "is_member": true,
        "rank": 2,
        "description": "Use a Blaster to shoot a 1-up",
        "rank_token": "medium"
      },
      "61": {
        "stamp_id": 61,
        "name": "Astro 1-up",
        "is_member": true,
        "rank": 3,
        "description": "Collect 8 1-ups",
        "rank_token": "hard"
      },
      "59": {
        "stamp_id": 59,
        "name": "Astro Expert",
        "is_member": true,
        "rank": 3,
        "description": "Complete the Expert Levels",
        "rank_token": "hard"
      },
      "62": {
        "stamp_id": 62,
        "name": "Astro Master",
        "is_member": true,
        "rank": 4,
        "description": "Complete 25 levels + Secret and Expert",
        "rank_token": "extreme"
      },
      "56": {
        "stamp_id": 56,
        "name": "Astro Secret",
        "is_member": true,
        "rank": 2,
        "description": "Complete all Secret Levels",
        "rank_token": "medium"
      },
      "57": {
        "stamp_id": 57,
        "name": "Astro10 Max",
        "is_member": true,
        "rank": 2,
        "description": "Complete levels 1-10 without missing a shot",
        "rank_token": "medium"
      },
      "58": {
        "stamp_id": 58,
        "name": "Astro20 Max",
        "is_member": true,
        "rank": 2,
        "description": "Complete levels 1-20 without missing a shot",
        "rank_token": "medium"
      },
      "60": {
        "stamp_id": 60,
        "name": "Astro30 Max",
        "is_member": true,
        "rank": 3,
        "description": "Complete levels 1-30 without missing a shot",
        "rank_token": "hard"
      },
      "53": {
        "stamp_id": 53,
        "name": "Astro40",
        "is_member": true,
        "rank": 2,
        "description": "Complete levels 1-40",
        "rank_token": "medium"
      },
      "51": {
        "stamp_id": 51,
        "name": "Astro5",
        "is_member": false,
        "rank": 1,
        "description": "Finish 5 levels",
        "rank_token": "easy"
      },
      "52": {
        "stamp_id": 52,
        "name": "Astro5 Max",
        "is_member": false,
        "rank": 1,
        "description": "Finish 5 levels without missing a shot",
        "rank_token": "easy"
      },
      "54": {
        "stamp_id": 54,
        "name": "Ship Blast",
        "is_member": true,
        "rank": 2,
        "description": "Use a Blaster to shoot a ship",
        "rank_token": "medium"
      }
    }
  },
  "15": {
    "name": "Catchin' Waves",
    "description": "Stamps related to surfing",
    "parent_group_id": 8,
    "display": "Games : Catchin' Waves",
    "stamps": {
      "95": {
        "stamp_id": 95,
        "name": "Easy Flip",
        "is_member": false,
        "rank": 1,
        "description": "Perform 1 flip",
        "rank_token": "easy"
      },
      "97": {
        "stamp_id": 97,
        "name": "Easy Grind",
        "is_member": false,
        "rank": 1,
        "description": "Hit 100 point combo while grinding the wave",
        "rank_token": "easy"
      },
      "102": {
        "stamp_id": 102,
        "name": "Easy Jump",
        "is_member": false,
        "rank": 2,
        "description": "Jump the height of 8 penguins",
        "rank_token": "medium"
      },
      "104": {
        "stamp_id": 104,
        "name": "Easy Spin",
        "is_member": false,
        "rank": 1,
        "description": "Perform a 3 spin jump",
        "rank_token": "easy"
      },
      "96": {
        "stamp_id": 96,
        "name": "Easy Tube",
        "is_member": false,
        "rank": 1,
        "description": "Hit 100 point combo while shooting the tube",
        "rank_token": "easy"
      },
      "108": {
        "stamp_id": 108,
        "name": "First Place",
        "is_member": true,
        "rank": 3,
        "description": "Win first place in a competition",
        "rank_token": "hard"
      },
      "93": {
        "stamp_id": 93,
        "name": "First Trick",
        "is_member": false,
        "rank": 1,
        "description": "Master your first trick on the board",
        "rank_token": "easy"
      },
      "101": {
        "stamp_id": 101,
        "name": "Flip Star",
        "is_member": false,
        "rank": 2,
        "description": "Jump and flip 3 times",
        "rank_token": "medium"
      },
      "98": {
        "stamp_id": 98,
        "name": "Graduate",
        "is_member": false,
        "rank": 1,
        "description": "Finish the surf lesson",
        "rank_token": "easy"
      },
      "110": {
        "stamp_id": 110,
        "name": "High Jump",
        "is_member": true,
        "rank": 3,
        "description": "Jump the height of 20 penguins",
        "rank_token": "hard"
      },
      "109": {
        "stamp_id": 109,
        "name": "Max Flips",
        "is_member": true,
        "rank": 3,
        "description": "Flip 10 times",
        "rank_token": "hard"
      },
      "107": {
        "stamp_id": 107,
        "name": "Max Grind",
        "is_member": true,
        "rank": 3,
        "description": "Hit 1200 point combo while grinding the wave",
        "rank_token": "hard"
      },
      "112": {
        "stamp_id": 112,
        "name": "Max Spin",
        "is_member": false,
        "rank": 3,
        "description": "Do a 10 spin jump",
        "rank_token": "hard"
      },
      "111": {
        "stamp_id": 111,
        "name": "Max Tube",
        "is_member": false,
        "rank": 3,
        "description": "Hit 5000 point combo while shooting the tube",
        "rank_token": "hard"
      },
      "100": {
        "stamp_id": 100,
        "name": "Podium Puffle",
        "is_member": true,
        "rank": 2,
        "description": "Finish in 1st, 2nd or 3rd place with your puffle",
        "rank_token": "medium"
      },
      "94": {
        "stamp_id": 94,
        "name": "Puffle Surfin'",
        "is_member": false,
        "rank": 1,
        "description": "Take your red puffle for a surf lesson",
        "rank_token": "easy"
      },
      "113": {
        "stamp_id": 113,
        "name": "Shark!",
        "is_member": true,
        "rank": 4,
        "description": "Spot the shark",
        "rank_token": "extreme"
      },
      "106": {
        "stamp_id": 106,
        "name": "Super Grind",
        "is_member": false,
        "rank": 2,
        "description": "Hit 700 point combo while grinding the wave",
        "rank_token": "medium"
      },
      "105": {
        "stamp_id": 105,
        "name": "Super Spin",
        "is_member": false,
        "rank": 2,
        "description": "Perform a 7 spin jump",
        "rank_token": "medium"
      },
      "103": {
        "stamp_id": 103,
        "name": "Super Tube",
        "is_member": false,
        "rank": 2,
        "description": "Hit 1000 point combo while shooting the tube",
        "rank_token": "medium"
      },
      "114": {
        "stamp_id": 114,
        "name": "Survivor",
        "is_member": true,
        "rank": 4,
        "description": "Complete Survival Mode",
        "rank_token": "extreme"
      },
      "99": {
        "stamp_id": 99,
        "name": "Trick Star",
        "is_member": false,
        "rank": 2,
        "description": "Master 13 different tricks in a surf",
        "rank_token": "medium"
      }
    }
  },
  "11": {
    "name": "Jet Pack Adventure",
    "description": "All stamps for flying",
    "parent_group_id": 8,
    "display": "Games : Jet Pack Adventure",
    "stamps": {
      "49": {
        "stamp_id": 49,
        "name": "1-up Captain",
        "is_member": true,
        "rank": 3,
        "description": "Find all 1-ups in one game",
        "rank_token": "hard"
      },
      "45": {
        "stamp_id": 45,
        "name": "1-up Leader",
        "is_member": true,
        "rank": 2,
        "description": "Collect 2 x 1-ups",
        "rank_token": "medium"
      },
      "50": {
        "stamp_id": 50,
        "name": "Ace Pilot ",
        "is_member": true,
        "rank": 4,
        "description": "Complete the game without collecting coins",
        "rank_token": "extreme"
      },
      "40": {
        "stamp_id": 40,
        "name": "Crash!",
        "is_member": true,
        "rank": 2,
        "description": "Crash land your jet pack at the Forest",
        "rank_token": "medium"
      },
      "47": {
        "stamp_id": 47,
        "name": "Fuel Command",
        "is_member": true,
        "rank": 3,
        "description": "Collect all fuel cans in 1 game",
        "rank_token": "hard"
      },
      "38": {
        "stamp_id": 38,
        "name": "Fuel Rank 1",
        "is_member": false,
        "rank": 1,
        "description": "Collect all fuel cans in Level 1",
        "rank_token": "easy"
      },
      "41": {
        "stamp_id": 41,
        "name": "Fuel Rank 2",
        "is_member": true,
        "rank": 2,
        "description": "Collect all fuel cans in Level 2",
        "rank_token": "medium"
      },
      "42": {
        "stamp_id": 42,
        "name": "Fuel Rank 3",
        "is_member": true,
        "rank": 2,
        "description": "Collect all fuel cans in Level 3",
        "rank_token": "medium"
      },
      "43": {
        "stamp_id": 43,
        "name": "Fuel Rank 4",
        "is_member": true,
        "rank": 2,
        "description": "Collect all fuel cans in Level 4",
        "rank_token": "medium"
      },
      "44": {
        "stamp_id": 44,
        "name": "Fuel Rank 5",
        "is_member": true,
        "rank": 2,
        "description": "Collect all fuel cans in Level 5",
        "rank_token": "medium"
      },
      "48": {
        "stamp_id": 48,
        "name": "Fuel Wings",
        "is_member": false,
        "rank": 3,
        "description": "Collect a fuel can while falling",
        "rank_token": "hard"
      },
      "39": {
        "stamp_id": 39,
        "name": "Jet Pack 5",
        "is_member": true,
        "rank": 2,
        "description": "Complete 5 levels",
        "rank_token": "medium"
      },
      "46": {
        "stamp_id": 46,
        "name": "Kerching!",
        "is_member": true,
        "rank": 3,
        "description": "Collect 650 coins",
        "rank_token": "hard"
      },
      "37": {
        "stamp_id": 37,
        "name": "Lift Off!",
        "is_member": false,
        "rank": 1,
        "description": "Take off and return to the launch pad",
        "rank_token": "easy"
      }
    }
  },
  "16": {
    "name": "Thin Ice",
    "description": "Don't fall through!",
    "parent_group_id": 8,
    "display": "Games : Thin Ice",
    "stamps": {
      "63": {
        "stamp_id": 63,
        "name": "1 Coin Bag",
        "is_member": false,
        "rank": 1,
        "description": "Collect 1 coin bag",
        "rank_token": "easy"
      },
      "67": {
        "stamp_id": 67,
        "name": "10 Coin Bags",
        "is_member": true,
        "rank": 3,
        "description": "Collect 10 coin bags",
        "rank_token": "hard"
      },
      "64": {
        "stamp_id": 64,
        "name": "3 Coin Bags",
        "is_member": false,
        "rank": 2,
        "description": "Collect 3 coin bags",
        "rank_token": "medium"
      },
      "65": {
        "stamp_id": 65,
        "name": "6 Coin Bags",
        "is_member": false,
        "rank": 2,
        "description": "Collect 6 coin bags",
        "rank_token": "medium"
      },
      "70": {
        "stamp_id": 70,
        "name": "All Coin Bags",
        "is_member": true,
        "rank": 4,
        "description": "Collect all coin bags on every level",
        "rank_token": "extreme"
      },
      "68": {
        "stamp_id": 68,
        "name": "Ice Bonus",
        "is_member": false,
        "rank": 3,
        "description": "Completely melt 480 ice tiles",
        "rank_token": "hard"
      },
      "71": {
        "stamp_id": 71,
        "name": "Ice Master",
        "is_member": true,
        "rank": 4,
        "description": "Master all the mazes",
        "rank_token": "extreme"
      },
      "69": {
        "stamp_id": 69,
        "name": "Ice Trekker",
        "is_member": true,
        "rank": 3,
        "description": "Push all blocks to the correct position",
        "rank_token": "hard"
      },
      "66": {
        "stamp_id": 66,
        "name": "Iced Treasure",
        "is_member": true,
        "rank": 2,
        "description": "Find the hidden treasure room",
        "rank_token": "medium"
      }
    }
  }
}

enum CategoryID {
  Activities = "7",
  Events = "5",
  Characters = "6",
  Party = "23",
  Games = "8",
  AquaGrabber = "13",
  JetPackAdventure = "11",
  PuffleRescue = "19",
  PSAMissions = "22",
  VideoGames = "25",
  GameDay = "26",
  CartSurfer = "28",
  CardJitsu = "38",
  CardJitsuFire = "32",
  CardJitsuWater = "34"
}

function addStamps(category: Category, stamps: Stamp[]) {
  const newStamps: Record<string, Stamp> = {}
  for (const stamp of stamps) {
    newStamps[String(stamp.stamp_id)] = stamp
  }
  const oldStamps = category.stamps

  category.stamps = {
    ...oldStamps,
    ...newStamps
  }
}

export function getStampbook(version: GameVersion): string {
  if (isLower(version, '2010-Jul-26')) {
    return '{}'
  }
  
  const newStampbook = JSON.parse(JSON.stringify(originalStampbook)) as Stampbook

  if (isGreaterOrEqual(version, '2010-Aug-12')) {
    newStampbook[CategoryID.Party] = {
      "name": "Party",
      "description": "Party Stamps",
      "parent_group_id": 5,
      "display": "Events : Party",
      "stamps": {
        "183": {
          "stamp_id": 183,
          "name": "Party Puzzle",
          "is_member": true,
          "rank": 2,
          "description": "Solve a puzzle at a party",
          "rank_token": "medium"
        },
        "182": {
          "stamp_id": 182,
          "name": "Happy Room",
          "is_member": false,
          "rank": 2,
          "description": "Make 10 penguins smile in a room",
          "rank_token": "medium"
        }
      }
    }
  }

  if (isGreaterOrEqual(version, '2010-Aug-31')) {
    newStampbook[CategoryID.PSAMissions] = {
      "name": "Missions",
      "description": "PSA Missions 1 to 11",
      "parent_group_id": 8,
      "display": "Games : Missions",
      "stamps": {
        "160": {
          "stamp_id": 160,
          "name": "Aunt Arctic Letter",
          "is_member": false,
          "rank": 0,
          "description": "Complete the secret task in Mission 1",
          "rank_token": "none specified"
        },
        "170": {
          "stamp_id": 170,
          "name": "Blueprint",
          "is_member": false,
          "rank": 0,
          "description": "Complete the secret task in Mission 6",
          "rank_token": "none specified"
        },
        "176": {
          "stamp_id": 176,
          "name": "Chocolate Box",
          "is_member": false,
          "rank": 0,
          "description": "Complete the secret task in Mission 9",
          "rank_token": "none specified"
        },
        "174": {
          "stamp_id": 174,
          "name": "Cool Gift",
          "is_member": false,
          "rank": 0,
          "description": "Complete the secret task in Mission 8",
          "rank_token": "none specified"
        },
        "178": {
          "stamp_id": 178,
          "name": "Employee Award",
          "is_member": false,
          "rank": 0,
          "description": "Complete the secret task in Mission 10",
          "rank_token": "none specified"
        },
        "162": {
          "stamp_id": 162,
          "name": "G's Letter",
          "is_member": false,
          "rank": 0,
          "description": "Complete the secret task in Mission 2",
          "rank_token": "none specified"
        },
        "166": {
          "stamp_id": 166,
          "name": "Handy Award",
          "is_member": false,
          "rank": 0,
          "description": "Complete the secret task in Mission 4",
          "rank_token": "none specified"
        },
        "159": {
          "stamp_id": 159,
          "name": "Mission 1 Medal",
          "is_member": false,
          "rank": 0,
          "description": "Complete Case of the Missing Puffles",
          "rank_token": "none specified"
        },
        "177": {
          "stamp_id": 177,
          "name": "Mission 10 Medal",
          "is_member": false,
          "rank": 0,
          "description": "Complete Waddle Squad",
          "rank_token": "none specified"
        },
        "179": {
          "stamp_id": 179,
          "name": "Mission 11 Medal",
          "is_member": false,
          "rank": 0,
          "description": "Complete The Veggie Villain",
          "rank_token": "none specified"
        },
        "161": {
          "stamp_id": 161,
          "name": "Mission 2 Medal",
          "is_member": false,
          "rank": 0,
          "description": "Complete G's Secret Mission",
          "rank_token": "none specified"
        },
        "163": {
          "stamp_id": 163,
          "name": "Mission 3 Medal",
          "is_member": false,
          "rank": 0,
          "description": "Complete Case of the Missing Coins",
          "rank_token": "none specified"
        },
        "165": {
          "stamp_id": 165,
          "name": "Mission 4 Medal",
          "is_member": false,
          "rank": 0,
          "description": "Complete Avalanche Rescue",
          "rank_token": "none specified"
        },
        "167": {
          "stamp_id": 167,
          "name": "Mission 5 Medal",
          "is_member": false,
          "rank": 0,
          "description": "Complete Secret of the Fur",
          "rank_token": "none specified"
        },
        "169": {
          "stamp_id": 169,
          "name": "Mission 6 Medal",
          "is_member": false,
          "rank": 0,
          "description": "Complete Questions for a Crab",
          "rank_token": "none specified"
        },
        "171": {
          "stamp_id": 171,
          "name": "Mission 7 Medal",
          "is_member": false,
          "rank": 0,
          "description": "Complete Clockwork Repairs",
          "rank_token": "none specified"
        },
        "173": {
          "stamp_id": 173,
          "name": "Mission 8 Medal",
          "is_member": false,
          "rank": 0,
          "description": "Complete Mysterious Tremors",
          "rank_token": "none specified"
        },
        "175": {
          "stamp_id": 175,
          "name": "Mission 9 Medal",
          "is_member": false,
          "rank": 0,
          "description": "Complete Operation: Spy and Seek",
          "rank_token": "none specified"
        },
        "172": {
          "stamp_id": 172,
          "name": "Pennant",
          "is_member": false,
          "rank": 0,
          "description": "Complete the secret task in Mission 7",
          "rank_token": "none specified"
        },
        "168": {
          "stamp_id": 168,
          "name": "Pizza Box",
          "is_member": false,
          "rank": 0,
          "description": "Complete the secret task in Mission 5",
          "rank_token": "none specified"
        },
        "180": {
          "stamp_id": 180,
          "name": "Snow Globe",
          "is_member": false,
          "rank": 0,
          "description": "Complete the secret task in Mission 11",
          "rank_token": "none specified"
        },
        "164": {
          "stamp_id": 164,
          "name": "Thank You Card",
          "is_member": false,
          "rank": 0,
          "description": "Complete the secret task in Mission 3",
          "rank_token": "none specified"
        }
      }
    }
    newStampbook[CategoryID.PuffleRescue] = {
      "name": "Puffle Rescue",
      "description": "Puffle Rescue Stamps",
      "parent_group_id": 8,
      "display": "Games : Puffle Rescue",
      "stamps": {
        "132": {
          "stamp_id": 132,
          "name": "1 Coin Bag",
          "is_member": false,
          "rank": 1,
          "description": "Find 1 coin bag in the snow levels",
          "rank_token": "easy"
        },
        "155": {
          "stamp_id": 155,
          "name": "1 Coin Bubble",
          "is_member": true,
          "rank": 1,
          "description": "Find 1 coin bag in a bubble in the sea levels",
          "rank_token": "easy"
        },
        "152": {
          "stamp_id": 152,
          "name": "10 Sea Levels",
          "is_member": true,
          "rank": 2,
          "description": "Reach 10 sea levels with 5 full lives",
          "rank_token": "medium"
        },
        "133": {
          "stamp_id": 133,
          "name": "2 Coin Bags ",
          "is_member": false,
          "rank": 2,
          "description": "Find 2 coin bags in the snow levels",
          "rank_token": "medium"
        },
        "156": {
          "stamp_id": 156,
          "name": "2 Coin Bubbles",
          "is_member": true,
          "rank": 2,
          "description": "Find 2 coin bags in a bubble in the sea levels",
          "rank_token": "medium"
        },
        "153": {
          "stamp_id": 153,
          "name": "20 Sea Levels",
          "is_member": true,
          "rank": 3,
          "description": "Reach 20 sea levels with 5 full lives",
          "rank_token": "hard"
        },
        "134": {
          "stamp_id": 134,
          "name": "3 Coin Bags",
          "is_member": false,
          "rank": 3,
          "description": "Find 3 coin bags in the snow levels",
          "rank_token": "hard"
        },
        "157": {
          "stamp_id": 157,
          "name": "3 Coin Bubbles",
          "is_member": true,
          "rank": 3,
          "description": "Find 3 coin bags in a bubble in the sea levels",
          "rank_token": "hard"
        },
        "154": {
          "stamp_id": 154,
          "name": "30 Sea Levels",
          "is_member": true,
          "rank": 4,
          "description": "Reach 30 sea levels with 5 full lives",
          "rank_token": "extreme"
        },
        "138": {
          "stamp_id": 138,
          "name": "Cave Coins",
          "is_member": true,
          "rank": 2,
          "description": "Find hidden coins on level 1 in the caves",
          "rank_token": "medium"
        },
        "140": {
          "stamp_id": 140,
          "name": "Cave Coins Max",
          "is_member": true,
          "rank": 3,
          "description": "Find hidden coins on Level 7 in the caves",
          "rank_token": "hard"
        },
        "139": {
          "stamp_id": 139,
          "name": "Cave Coins Plus",
          "is_member": true,
          "rank": 2,
          "description": "Find hidden coins on level 4 in the caves",
          "rank_token": "medium"
        },
        "148": {
          "stamp_id": 148,
          "name": "Close Call",
          "is_member": true,
          "rank": 2,
          "description": "Dodge the giant snowball",
          "rank_token": "medium"
        },
        "145": {
          "stamp_id": 145,
          "name": "Easy Cannon",
          "is_member": true,
          "rank": 2,
          "description": "Destroy 8 snowball cannons in cave levels",
          "rank_token": "medium"
        },
        "144": {
          "stamp_id": 144,
          "name": "Expert Catch",
          "is_member": true,
          "rank": 3,
          "description": "Catch 3 coin bags before they fall",
          "rank_token": "hard"
        },
        "150": {
          "stamp_id": 150,
          "name": "Express Rescue",
          "is_member": true,
          "rank": 2,
          "description": "Complete 10 sea levels in 30 seconds each",
          "rank_token": "medium"
        },
        "147": {
          "stamp_id": 147,
          "name": "Extreme Cannon",
          "is_member": true,
          "rank": 4,
          "description": "Destroy 15 snowball cannons in cave levels",
          "rank_token": "extreme"
        },
        "151": {
          "stamp_id": 151,
          "name": "Extreme Rescue",
          "is_member": true,
          "rank": 3,
          "description": "Complete 20 sea levels in 30 seconds each",
          "rank_token": "hard"
        },
        "141": {
          "stamp_id": 141,
          "name": "Quick Catch",
          "is_member": true,
          "rank": 1,
          "description": "Catch 1 coin bag before it falls",
          "rank_token": "easy"
        },
        "149": {
          "stamp_id": 149,
          "name": "Rapid Rescue",
          "is_member": true,
          "rank": 1,
          "description": "Complete 5 sea levels in 30 seconds each",
          "rank_token": "easy"
        },
        "130": {
          "stamp_id": 130,
          "name": "SOS 30",
          "is_member": false,
          "rank": 2,
          "description": "Rescue 30 puffles in snow levels",
          "rank_token": "medium"
        },
        "131": {
          "stamp_id": 131,
          "name": "SOS 60",
          "is_member": false,
          "rank": 3,
          "description": "Rescue 60 Puffles in snow levels",
          "rank_token": "hard"
        },
        "137": {
          "stamp_id": 137,
          "name": "Snow Hero",
          "is_member": false,
          "rank": 4,
          "description": "Complete 9 snow levels in no more than 270 moves",
          "rank_token": "extreme"
        },
        "136": {
          "stamp_id": 136,
          "name": "Snow Master",
          "is_member": false,
          "rank": 3,
          "description": "Complete 6 snow levels in no more than 160 moves",
          "rank_token": "hard"
        },
        "135": {
          "stamp_id": 135,
          "name": "Snow Student",
          "is_member": false,
          "rank": 2,
          "description": "Complete 3 snow levels in no more than 70 moves",
          "rank_token": "medium"
        },
        "146": {
          "stamp_id": 146,
          "name": "Super Cannon",
          "is_member": true,
          "rank": 3,
          "description": "Destroy 12 snowball cannons in cave levels",
          "rank_token": "hard"
        },
        "142": {
          "stamp_id": 142,
          "name": "Super Catch",
          "is_member": true,
          "rank": 2,
          "description": "Catch 2 coin bags before they fall",
          "rank_token": "medium"
        }
      }
    }
  }

  if (isGreaterOrEqual(version, '2010-Sep-03')) {
    addStamps(newStampbook[CategoryID.Party] as Category, [
      {
        "stamp_id": 184,
        "name": "Snack Shack",
        "is_member": false,
        "rank": 1,
        "description": "Serve snacks from a booth, using any food emote",
        "rank_token": "easy"
      },
      {
        "stamp_id": 185,
        "name": "Target Champion",
        "is_member": false,
        "rank": 2,
        "description": "Hit 50 targets in a task at a party",
        "rank_token": "medium"
      }
    ])
  }

  if (isGreaterOrEqual(version, '2010-Sep-10')) {
    addStamps(newStampbook[CategoryID.Activities] as Category, [
      {
        "stamp_id": 197,
        "name": "Field Agent",
        "is_member": false,
        "rank": 1,
        "description": "Earn 1 EPF medal",
        "rank_token": "easy"
      },
      {
        "stamp_id": 198,
        "name": "Special Agent",
        "is_member": false,
        "rank": 2,
        "description": "Earn 5 EPF medals",
        "rank_token": "medium"
      },
      {
        "stamp_id": 199,
        "name": "Special Forces",
        "is_member": false,
        "rank": 2,
        "description": "Earn 10 EPF medals",
        "rank_token": "medium"
      },
      {
        "stamp_id": 200,
        "name": "Elite Protector",
        "is_member": false,
        "rank": 3,
        "description": "Earn 25 EPF medals",
        "rank_token": "hard"
      },
      {
        "stamp_id": 201,
        "name": "Island Guardian",
        "is_member": false,
        "rank": 4,
        "description": "Earn 50 EPF medals",
        "rank_token": "extreme"
      }
    ])
  }

  if (isGreaterOrEqual(version, '2010-Sep-24')) {
    addStamps(newStampbook[CategoryID.JetPackAdventure] as Category, [
      {
        "stamp_id": 202,
        "name": "Puffle Pilot ",
        "is_member": false,
        "rank": 1,
        "description": "Bring a green puffle into the game",
        "rank_token": "easy"
      },
      {
        "stamp_id": 203,
        "name": "Puffle Bonus ",
        "is_member": false,
        "rank": 2,
        "description": "Your green puffle collects 200 coins",
        "rank_token": "medium"
      },
      {
        "stamp_id": 205,
        "name": "Puffle Boost",
        "is_member": false,
        "rank": 4,
        "description": "Your green puffle gets a gas can when you run out of fuel",
        "rank_token": "extreme"
      },
      {
        "stamp_id": 204,
        "name": "Puffle Plus ",
        "is_member": false,
        "rank": 3,
        "description": "Your green puffle collects 450 coins",
        "rank_token": "hard"
      }
    ])

    newStampbook[CategoryID.VideoGames] = {
      "name": "Video Games",
      "description": "Video Game Stamps",
      "parent_group_id": 0,
      "display": "Video Games",
      "stamps": [] as []
    }

    newStampbook[CategoryID.GameDay] = {
      "name": "Game Day",
      "description": "Wii Game 'Game Day'",
      "parent_group_id": 25,
      "display": "Video Games : Game Day",
      "stamps": {
        "125": {
          "stamp_id": 125,
          "name": "2 Vs. 2",
          "is_member": false,
          "rank": 3,
          "description": "Come 1st in all 2 vs. 2 matches",
          "rank_token": "hard"
        },
        "126": {
          "stamp_id": 126,
          "name": "2 Vs. 2 Max",
          "is_member": false,
          "rank": 4,
          "description": "Win all 2 vs. 2 matches against the Wii at hard level",
          "rank_token": "extreme"
        },
        "124": {
          "stamp_id": 124,
          "name": "Bean Balance",
          "is_member": false,
          "rank": 2,
          "description": "Balance 30 bags in a 4-player game",
          "rank_token": "medium"
        },
        "116": {
          "stamp_id": 116,
          "name": "Blue Win",
          "is_member": false,
          "rank": 1,
          "description": "Conquer the island as Team Blue",
          "rank_token": "easy"
        },
        "120": {
          "stamp_id": 120,
          "name": "Collector",
          "is_member": false,
          "rank": 3,
          "description": "Collect all the items",
          "rank_token": "hard"
        },
        "119": {
          "stamp_id": 119,
          "name": "Conquer the Island",
          "is_member": false,
          "rank": 2,
          "description": "Conquer the island as each team",
          "rank_token": "medium"
        },
        "128": {
          "stamp_id": 128,
          "name": "Goalie",
          "is_member": false,
          "rank": 4,
          "description": "Win a game without letting a puck in your net",
          "rank_token": "extreme"
        },
        "117": {
          "stamp_id": 117,
          "name": "Green Win",
          "is_member": false,
          "rank": 1,
          "description": "Conquer the island as Team Green",
          "rank_token": "easy"
        },
        "123": {
          "stamp_id": 123,
          "name": "Puffle Paddle",
          "is_member": false,
          "rank": 2,
          "description": "Play 4-player mode without dropping any puffles",
          "rank_token": "medium"
        },
        "115": {
          "stamp_id": 115,
          "name": "Red Win",
          "is_member": false,
          "rank": 1,
          "description": "Conquer the island as Team Red",
          "rank_token": "easy"
        },
        "121": {
          "stamp_id": 121,
          "name": "Remote Upload",
          "is_member": false,
          "rank": 1,
          "description": "Upload another penguin to your Wii remote",
          "rank_token": "easy"
        },
        "122": {
          "stamp_id": 122,
          "name": "Sumo Smash",
          "is_member": false,
          "rank": 4,
          "description": "Win a 4-player game without being knocked out",
          "rank_token": "extreme"
        },
        "127": {
          "stamp_id": 127,
          "name": "White Puffle",
          "is_member": false,
          "rank": 1,
          "description": "Feed a white puffle in Feed a Puffle",
          "rank_token": "easy"
        },
        "118": {
          "stamp_id": 118,
          "name": "Yellow Win",
          "is_member": false,
          "rank": 1,
          "description": "Conquer the island as Team Yellow",
          "rank_token": "easy"
        }
      }
    }
  }

  if (isGreaterOrEqual(version, '2010-Oct-23')) {
    addStamps(newStampbook[CategoryID.Party] as Category, [{
      "stamp_id": 186,
      "name": "Celebration",
      "is_member": false,
      "rank": 1,
      "description": "Blow out the candles on the Anniversary Cake",
      "rank_token": "easy"
    }])

    newStampbook[CategoryID.CartSurfer] = {
      "name": "Cart Surfer",
      "description": "Cart Surfer Stamps",
      "parent_group_id": 8,
      "display": "Games : Cart Surfer",
      "stamps": {
        "208": {
          "stamp_id": 208,
          "name": "Cart Expert",
          "is_member": false,
          "rank": 3,
          "description": "Earn 250 coins in one game",
          "rank_token": "hard"
        },
        "210": {
          "stamp_id": 210,
          "name": "Cart Master",
          "is_member": false,
          "rank": 4,
          "description": "Earn 350 coins in one game",
          "rank_token": "extreme"
        },
        "206": {
          "stamp_id": 206,
          "name": "Cart Pro",
          "is_member": false,
          "rank": 2,
          "description": "Earn 150 coins in one game",
          "rank_token": "medium"
        },
        "224": {
          "stamp_id": 224,
          "name": "Flip Mania",
          "is_member": false,
          "rank": 3,
          "description": "Flip 20 times in a row without crashing",
          "rank_token": "hard"
        },
        "212": {
          "stamp_id": 212,
          "name": "Great Balance",
          "is_member": false,
          "rank": 1,
          "description": "Recover from a wobble",
          "rank_token": "easy"
        },
        "220": {
          "stamp_id": 220,
          "name": "Mine Grind",
          "is_member": false,
          "rank": 3,
          "description": "Grind around 8 corners",
          "rank_token": "hard"
        },
        "214": {
          "stamp_id": 214,
          "name": "Mine Marvel",
          "is_member": false,
          "rank": 2,
          "description": "Perform 10 tricks in the cart",
          "rank_token": "medium"
        },
        "216": {
          "stamp_id": 216,
          "name": "Mine Mission",
          "is_member": false,
          "rank": 2,
          "description": "Perform 10 tricks out of the cart",
          "rank_token": "medium"
        },
        "228": {
          "stamp_id": 228,
          "name": "Puffle Power",
          "is_member": false,
          "rank": 2,
          "description": "Recover from a wobble with a puffle",
          "rank_token": "medium"
        },
        "222": {
          "stamp_id": 222,
          "name": "Surf's Up",
          "is_member": false,
          "rank": 3,
          "description": "Surf around 8 corners",
          "rank_token": "hard"
        },
        "218": {
          "stamp_id": 218,
          "name": "Trick Master",
          "is_member": false,
          "rank": 2,
          "description": "Perform 14 different tricks",
          "rank_token": "medium"
        },
        "226": {
          "stamp_id": 226,
          "name": "Ultimate Duo",
          "is_member": false,
          "rank": 3,
          "description": "Perform 20 tricks with your puffle",
          "rank_token": "hard"
        }
      }
    }
  }

  if (isGreaterOrEqual(version, '2010-Oct-28')) {
    addStamps(newStampbook[CategoryID.Party] as Category, [
      {
        "stamp_id": 187,
        "name": "Monster Mash",
        "is_member": false,
        "rank": 2,
        "description": "Wear a monster outfit at the Halloween Party",
        "rank_token": "medium"
      },
      {
        "stamp_id": 188,
        "name": "Scavenger Hunt",
        "is_member": false,
        "rank": 2,
        "description": "Complete a Scavenger Hunt",
        "rank_token": "medium"
      }
    ])
  }

  if (isGreaterOrEqual(version, '2010-Nov-24')) {
    addStamps(newStampbook[CategoryID.Party] as Category, [
      {
        "stamp_id": 189,
        "name": "Construction",
        "is_member": false,
        "rank": 1,
        "description": "Join in construction at a party with your jackhammer",
        "rank_token": "easy"
      },
      {
        "stamp_id": 190,
        "name": "Explorer",
        "is_member": true,
        "rank": 1,
        "description": "Visit all the decorated party rooms",
        "rank_token": "easy"
      }
    ])

    addStamps(newStampbook[CategoryID.Characters] as Category, [
      {
        "stamp_id": 290,
        "name": "Sensei",
        "is_member": false,
        "rank": 4,
        "description": "Be in the same room as Sensei",
        "rank_token": "extreme"
      }
    ])

    newStampbook[CategoryID.CardJitsu] ={
      "name": "Card-Jitsu",
      "description": "Card-Jitsu Original",
      "parent_group_id": 8,
      "display": "Games : Card-Jitsu",
      "stamps": {
        "242": {
          "stamp_id": 242,
          "name": "Elemental Win",
          "is_member": false,
          "rank": 1,
          "description": "Win a match with 3 different elements",
          "rank_token": "easy"
        },
        "232": {
          "stamp_id": 232,
          "name": "Fine Student ",
          "is_member": false,
          "rank": 2,
          "description": "Reach half way. Earn your blue belt",
          "rank_token": "medium"
        },
        "238": {
          "stamp_id": 238,
          "name": "Flawless Victory ",
          "is_member": false,
          "rank": 2,
          "description": "Win without letting your opponent gain any cards",
          "rank_token": "medium"
        },
        "248": {
          "stamp_id": 248,
          "name": "Full Dojo",
          "is_member": false,
          "rank": 4,
          "description": "Score 9 cards before you win",
          "rank_token": "extreme"
        },
        "230": {
          "stamp_id": 230,
          "name": "Grasshopper",
          "is_member": false,
          "rank": 1,
          "description": "Begin your journey. Earn your white belt",
          "rank_token": "easy"
        },
        "240": {
          "stamp_id": 240,
          "name": "Match Master",
          "is_member": false,
          "rank": 3,
          "description": "Win 25 matches",
          "rank_token": "hard"
        },
        "236": {
          "stamp_id": 236,
          "name": "Ninja Master ",
          "is_member": false,
          "rank": 3,
          "description": "Defeat Sensei and become a Ninja",
          "rank_token": "hard"
        },
        "244": {
          "stamp_id": 244,
          "name": "One Element ",
          "is_member": false,
          "rank": 2,
          "description": "Win a match with 3 cards of the same element",
          "rank_token": "medium"
        },
        "246": {
          "stamp_id": 246,
          "name": "Sensei Card",
          "is_member": false,
          "rank": 4,
          "description": "See the Sensei Power Card",
          "rank_token": "extreme"
        },
        "234": {
          "stamp_id": 234,
          "name": "True Ninja ",
          "is_member": false,
          "rank": 3,
          "description": "Prove your ninja skills. Earn your black belt",
          "rank_token": "hard"
        }
      }
    }
    newStampbook[CategoryID.CardJitsuFire] = {
      "name": "Card-Jitsu : Fire",
      "description": "Card-Jitsu Fire",
      "parent_group_id": 8,
      "display": "Games : Card-Jitsu : Fire",
      "stamps": {
        "268": {
          "stamp_id": 268,
          "name": "Fire Expert ",
          "is_member": true,
          "rank": 4,
          "description": "Win 50 matches",
          "rank_token": "extreme"
        },
        "256": {
          "stamp_id": 256,
          "name": "Fire Midway",
          "is_member": true,
          "rank": 2,
          "description": "Earn the coat. Finish 50% of your Fire Ninja journey",
          "rank_token": "medium"
        },
        "264": {
          "stamp_id": 264,
          "name": "Fire Ninja",
          "is_member": true,
          "rank": 3,
          "description": "Defeat Sensei and become a Fire Ninja",
          "rank_token": "hard"
        },
        "262": {
          "stamp_id": 262,
          "name": "Fire Suit",
          "is_member": true,
          "rank": 3,
          "description": "Complete your Fire Suit",
          "rank_token": "hard"
        },
        "266": {
          "stamp_id": 266,
          "name": "Max Energy",
          "is_member": true,
          "rank": 4,
          "description": "Win 3 energy points in a match",
          "rank_token": "extreme"
        },
        "254": {
          "stamp_id": 254,
          "name": "Score Fire ",
          "is_member": true,
          "rank": 1,
          "description": "Win 1 energy point in a match",
          "rank_token": "easy"
        },
        "260": {
          "stamp_id": 260,
          "name": "Strong Defence",
          "is_member": true,
          "rank": 3,
          "description": "Win a match without losing any energy",
          "rank_token": "hard"
        },
        "252": {
          "stamp_id": 252,
          "name": "Warm Up",
          "is_member": true,
          "rank": 1,
          "description": "Win 10 Fire matches",
          "rank_token": "easy"
        }
      }
    }
    newStampbook[CategoryID.CardJitsuWater] = {
      "name": "Card-Jitsu : Water",
      "description": "Card-Jitsu Water",
      "parent_group_id": 8,
      "display": "Games : Card-Jitsu : Water",
      "stamps": {
        "270": {
          "stamp_id": 270,
          "name": "Gong!",
          "is_member": true,
          "rank": 1,
          "description": "Win a match and sound the gong",
          "rank_token": "easy"
        },
        "288": {
          "stamp_id": 288,
          "name": "Skipping Stones",
          "is_member": true,
          "rank": 4,
          "description": "Clear 28 stones of any element in a match",
          "rank_token": "extreme"
        },
        "286": {
          "stamp_id": 286,
          "name": "Two Close",
          "is_member": true,
          "rank": 4,
          "description": "Drift to the edge twice and still win the match",
          "rank_token": "extreme"
        },
        "276": {
          "stamp_id": 276,
          "name": "Water Expert",
          "is_member": true,
          "rank": 2,
          "description": "Win 100 matches",
          "rank_token": "medium"
        },
        "278": {
          "stamp_id": 278,
          "name": "Water Midway",
          "is_member": true,
          "rank": 2,
          "description": "Earn the coat. Finish 50% of your Water Ninja journey",
          "rank_token": "medium"
        },
        "284": {
          "stamp_id": 284,
          "name": "Water Ninja",
          "is_member": true,
          "rank": 3,
          "description": "Defeat Sensei and become a Water Ninja",
          "rank_token": "hard"
        },
        "282": {
          "stamp_id": 282,
          "name": "Water Suit",
          "is_member": true,
          "rank": 3,
          "description": "Complete your Water Suit",
          "rank_token": "hard"
        },
        "274": {
          "stamp_id": 274,
          "name": "Watery Fall",
          "is_member": true,
          "rank": 1,
          "description": "Take the plunge! Fall off the Waterfall",
          "rank_token": "easy"
        }
      }
    }
  }

  return JSON.stringify(newStampbook)
}
