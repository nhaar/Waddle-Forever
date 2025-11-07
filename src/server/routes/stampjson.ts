import { StampCategory, STAMP_TIMELINE, Stamp } from "../game-data/stamps"
import { Update } from "../game-data/updates"
import { isLower, Version } from "./versions"



type Stampbook = Record<string, StampCategory>

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

function addStamps(category: StampCategory, stamps: Stamp[]) {
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

export function getStampbook(version: Version): string {
  if (isLower(version, Update.STAMPS_RELEASE)) {
    return '{}'
  }
  
  const newStampbook = JSON.parse(JSON.stringify(originalStampbook)) as Stampbook

  for (let i = 0; i < STAMP_TIMELINE.length; i++) {
    const update = STAMP_TIMELINE[i];
    if (isLower(version, update.date)) {
      break;
    }

    update.updates.forEach(u => {
      if ('category' in u) {
        newStampbook[u.id] = u.category;
      } else {
        addStamps(newStampbook[u.categoryId] as StampCategory, u.stamps);
      }
    });
  }

  return JSON.stringify(newStampbook)
}
