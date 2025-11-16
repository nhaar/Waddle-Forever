import { Version } from "../routes/versions"
import { Update } from "./updates"

enum CategoryID {
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

type StampUpdate = {
  date: Version;
  updates: Array<NewCategoryUpdate | NewStampsUpdate>
};

export const STAMP_TIMELINE: StampUpdate[] = [
  {
    date: '2010-08-12',
    updates: [
      {
        category: {
          "name": "Party",
          "description": "Party Stamps",
          "parent_group_id": 5,
          "display": "Events : Party",
          group_id: CategoryID.Party,
          "stamps": [
            {
              "stamp_id": 183,
              "name": "Party Puzzle",
              "is_member": 1,
              "rank": 2,
              "description": "Solve a puzzle at a party",
              "rank_token": "medium"
            },
            {
              "stamp_id": 182,
              "name": "Happy Room",
              "is_member": 0,
              "rank": 2,
              "description": "Make 10 penguins smile in a room",
              "rank_token": "medium"
            }
          ]
        }
      }
    ]
  },
  {
    date: '2010-08-31',
    updates: [
      {
        category: {
          "name": "Missions",
          "description": "PSA Missions 1 to 11",
          "parent_group_id": 8,
          "display": "Games : Missions",
          group_id: CategoryID.PSAMissions,
          "stamps": [
            {
              "stamp_id": 160,
              "name": "Aunt Arctic Letter",
              "is_member": 0,
              "rank": 0,
              "description": "Complete the secret task in Mission 1",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 170,
              "name": "Blueprint",
              "is_member": 0,
              "rank": 0,
              "description": "Complete the secret task in Mission 6",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 176,
              "name": "Chocolate Box",
              "is_member": 0,
              "rank": 0,
              "description": "Complete the secret task in Mission 9",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 174,
              "name": "Cool Gift",
              "is_member": 0,
              "rank": 0,
              "description": "Complete the secret task in Mission 8",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 178,
              "name": "Employee Award",
              "is_member": 0,
              "rank": 0,
              "description": "Complete the secret task in Mission 10",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 162,
              "name": "G's Letter",
              "is_member": 0,
              "rank": 0,
              "description": "Complete the secret task in Mission 2",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 166,
              "name": "Handy Award",
              "is_member": 0,
              "rank": 0,
              "description": "Complete the secret task in Mission 4",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 159,
              "name": "Mission 1 Medal",
              "is_member": 0,
              "rank": 0,
              "description": "Complete Case of the Missing Puffles",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 177,
              "name": "Mission 10 Medal",
              "is_member": 0,
              "rank": 0,
              "description": "Complete Waddle Squad",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 179,
              "name": "Mission 11 Medal",
              "is_member": 0,
              "rank": 0,
              "description": "Complete The Veggie Villain",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 161,
              "name": "Mission 2 Medal",
              "is_member": 0,
              "rank": 0,
              "description": "Complete G's Secret Mission",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 163,
              "name": "Mission 3 Medal",
              "is_member": 0,
              "rank": 0,
              "description": "Complete Case of the Missing Coins",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 165,
              "name": "Mission 4 Medal",
              "is_member": 0,
              "rank": 0,
              "description": "Complete Avalanche Rescue",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 167,
              "name": "Mission 5 Medal",
              "is_member": 0,
              "rank": 0,
              "description": "Complete Secret of the Fur",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 169,
              "name": "Mission 6 Medal",
              "is_member": 0,
              "rank": 0,
              "description": "Complete Questions for a Crab",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 171,
              "name": "Mission 7 Medal",
              "is_member": 0,
              "rank": 0,
              "description": "Complete Clockwork Repairs",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 173,
              "name": "Mission 8 Medal",
              "is_member": 0,
              "rank": 0,
              "description": "Complete Mysterious Tremors",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 175,
              "name": "Mission 9 Medal",
              "is_member": 0,
              "rank": 0,
              "description": "Complete Operation: Spy and Seek",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 172,
              "name": "Pennant",
              "is_member": 0,
              "rank": 0,
              "description": "Complete the secret task in Mission 7",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 168,
              "name": "Pizza Box",
              "is_member": 0,
              "rank": 0,
              "description": "Complete the secret task in Mission 5",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 180,
              "name": "Snow Globe",
              "is_member": 0,
              "rank": 0,
              "description": "Complete the secret task in Mission 11",
              "rank_token": "none specified"
            },
            {
              "stamp_id": 164,
              "name": "Thank You Card",
              "is_member": 0,
              "rank": 0,
              "description": "Complete the secret task in Mission 3",
              "rank_token": "none specified"
            }
          ]
        }
      },
      {
        category: {
          "name": "Puffle Rescue",
          "description": "Puffle Rescue Stamps",
          "parent_group_id": 8,
          "display": "Games : Puffle Rescue",
          group_id: CategoryID.PuffleRescue,
          "stamps": [
            {
              "stamp_id": 132,
              "name": "1 Coin Bag",
              "is_member": 0,
              "rank": 1,
              "description": "Find 1 coin bag in the snow levels",
              "rank_token": "easy"
            },
            {
              "stamp_id": 155,
              "name": "1 Coin Bubble",
              "is_member": 1,
              "rank": 1,
              "description": "Find 1 coin bag in a bubble in the sea levels",
              "rank_token": "easy"
            },
            {
              "stamp_id": 152,
              "name": "10 Sea Levels",
              "is_member": 1,
              "rank": 2,
              "description": "Reach 10 sea levels with 5 full lives",
              "rank_token": "medium"
            },
            {
              "stamp_id": 133,
              "name": "2 Coin Bags ",
              "is_member": 0,
              "rank": 2,
              "description": "Find 2 coin bags in the snow levels",
              "rank_token": "medium"
            },
            {
              "stamp_id": 156,
              "name": "2 Coin Bubbles",
              "is_member": 1,
              "rank": 2,
              "description": "Find 2 coin bags in a bubble in the sea levels",
              "rank_token": "medium"
            },
            {
              "stamp_id": 153,
              "name": "20 Sea Levels",
              "is_member": 1,
              "rank": 3,
              "description": "Reach 20 sea levels with 5 full lives",
              "rank_token": "hard"
            },
            {
              "stamp_id": 134,
              "name": "3 Coin Bags",
              "is_member": 0,
              "rank": 3,
              "description": "Find 3 coin bags in the snow levels",
              "rank_token": "hard"
            },
            {
              "stamp_id": 157,
              "name": "3 Coin Bubbles",
              "is_member": 1,
              "rank": 3,
              "description": "Find 3 coin bags in a bubble in the sea levels",
              "rank_token": "hard"
            },
            {
              "stamp_id": 154,
              "name": "30 Sea Levels",
              "is_member": 1,
              "rank": 4,
              "description": "Reach 30 sea levels with 5 full lives",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 138,
              "name": "Cave Coins",
              "is_member": 1,
              "rank": 2,
              "description": "Find hidden coins on level 1 in the caves",
              "rank_token": "medium"
            },
            {
              "stamp_id": 140,
              "name": "Cave Coins Max",
              "is_member": 1,
              "rank": 3,
              "description": "Find hidden coins on Level 7 in the caves",
              "rank_token": "hard"
            },
            {
              "stamp_id": 139,
              "name": "Cave Coins Plus",
              "is_member": 1,
              "rank": 2,
              "description": "Find hidden coins on level 4 in the caves",
              "rank_token": "medium"
            },
            {
              "stamp_id": 148,
              "name": "Close Call",
              "is_member": 1,
              "rank": 2,
              "description": "Dodge the giant snowball",
              "rank_token": "medium"
            },
            {
              "stamp_id": 145,
              "name": "Easy Cannon",
              "is_member": 1,
              "rank": 2,
              "description": "Destroy 8 snowball cannons in cave levels",
              "rank_token": "medium"
            },
            {
              "stamp_id": 144,
              "name": "Expert Catch",
              "is_member": 1,
              "rank": 3,
              "description": "Catch 3 coin bags before they fall",
              "rank_token": "hard"
            },
            {
              "stamp_id": 150,
              "name": "Express Rescue",
              "is_member": 1,
              "rank": 2,
              "description": "Complete 10 sea levels in 30 seconds each",
              "rank_token": "medium"
            },
            {
              "stamp_id": 147,
              "name": "Extreme Cannon",
              "is_member": 1,
              "rank": 4,
              "description": "Destroy 15 snowball cannons in cave levels",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 151,
              "name": "Extreme Rescue",
              "is_member": 1,
              "rank": 3,
              "description": "Complete 20 sea levels in 30 seconds each",
              "rank_token": "hard"
            },
            {
              "stamp_id": 141,
              "name": "Quick Catch",
              "is_member": 1,
              "rank": 1,
              "description": "Catch 1 coin bag before it falls",
              "rank_token": "easy"
            },
            {
              "stamp_id": 149,
              "name": "Rapid Rescue",
              "is_member": 1,
              "rank": 1,
              "description": "Complete 5 sea levels in 30 seconds each",
              "rank_token": "easy"
            },
            {
              "stamp_id": 130,
              "name": "SOS 30",
              "is_member": 0,
              "rank": 2,
              "description": "Rescue 30 puffles in snow levels",
              "rank_token": "medium"
            },
            {
              "stamp_id": 131,
              "name": "SOS 60",
              "is_member": 0,
              "rank": 3,
              "description": "Rescue 60 Puffles in snow levels",
              "rank_token": "hard"
            },
            {
              "stamp_id": 137,
              "name": "Snow Hero",
              "is_member": 0,
              "rank": 4,
              "description": "Complete 9 snow levels in no more than 270 moves",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 136,
              "name": "Snow Master",
              "is_member": 0,
              "rank": 3,
              "description": "Complete 6 snow levels in no more than 160 moves",
              "rank_token": "hard"
            },
            {
              "stamp_id": 135,
              "name": "Snow Student",
              "is_member": 0,
              "rank": 2,
              "description": "Complete 3 snow levels in no more than 70 moves",
              "rank_token": "medium"
            },
            {
              "stamp_id": 146,
              "name": "Super Cannon",
              "is_member": 1,
              "rank": 3,
              "description": "Destroy 12 snowball cannons in cave levels",
              "rank_token": "hard"
            },
            {
              "stamp_id": 142,
              "name": "Super Catch",
              "is_member": 1,
              "rank": 2,
              "description": "Catch 2 coin bags before they fall",
              "rank_token": "medium"
            }
          ]
        }
      }
    ]
  },
  {
    date: '2010-09-03',
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            "stamp_id": 184,
            "name": "Snack Shack",
            "is_member": 0,
            "rank": 1,
            "description": "Serve snacks from a booth, using any food emote",
            "rank_token": "easy"
          },
          {
            "stamp_id": 185,
            "name": "Target Champion",
            "is_member": 0,
            "rank": 2,
            "description": "Hit 50 targets in a task at a party",
            "rank_token": "medium"
          }
        ]
      }
    ]
  },
  {
    date: '2010-09-07',
    updates: [
      {
        categoryId: CategoryID.Activities,
        stamps: [
          {
            "stamp_id": 197,
            "name": "Field Agent",
            "is_member": 0,
            "rank": 1,
            "description": "Earn 1 EPF medal",
            "rank_token": "easy"
          },
          {
            "stamp_id": 198,
            "name": "Special Agent",
            "is_member": 0,
            "rank": 2,
            "description": "Earn 5 EPF medals",
            "rank_token": "medium"
          },
          {
            "stamp_id": 199,
            "name": "Special Forces",
            "is_member": 0,
            "rank": 2,
            "description": "Earn 10 EPF medals",
            "rank_token": "medium"
          },
          {
            "stamp_id": 200,
            "name": "Elite Protector",
            "is_member": 0,
            "rank": 3,
            "description": "Earn 25 EPF medals",
            "rank_token": "hard"
          },
          {
            "stamp_id": 201,
            "name": "Island Guardian",
            "is_member": 0,
            "rank": 4,
            "description": "Earn 50 EPF medals",
            "rank_token": "extreme"
          }
        ]
      }
    ]
  },
  {
    date: '2010-09-13',
    updates: [
      {
        categoryId: CategoryID.JetPackAdventure,
        stamps: [
          {
            "stamp_id": 202,
            "name": "Puffle Pilot ",
            "is_member": 0,
            "rank": 1,
            "description": "Bring a green puffle into the game",
            "rank_token": "easy"
          },
          {
            "stamp_id": 203,
            "name": "Puffle Bonus ",
            "is_member": 0,
            "rank": 2,
            "description": "Your green puffle collects 200 coins",
            "rank_token": "medium"
          },
          {
            "stamp_id": 205,
            "name": "Puffle Boost",
            "is_member": 0,
            "rank": 4,
            "description": "Your green puffle gets a gas can when you run out of fuel",
            "rank_token": "extreme"
          },
          {
            "stamp_id": 204,
            "name": "Puffle Plus ",
            "is_member": 0,
            "rank": 3,
            "description": "Your green puffle collects 450 coins",
            "rank_token": "hard"
          }
        ]
      },
      {
        category: {
          "name": "Video Games",
          "description": "Video Game Stamps",
          "parent_group_id": 0,
          "display": "Video Games",
          group_id: CategoryID.VideoGames,
          "stamps": []
        }
      },
      {
        category: {
          "name": "Game Day",
          "description": "Wii Game 'Game Day'",
          "parent_group_id": 25,
          "display": "Video Games : Game Day",
          group_id: CategoryID.GameDay,
          "stamps": [
            {
              "stamp_id": 125,
              "name": "2 Vs. 2",
              "is_member": 0,
              "rank": 3,
              "description": "Come 1st in all 2 vs. 2 matches",
              "rank_token": "hard"
            },
            {
              "stamp_id": 126,
              "name": "2 Vs. 2 Max",
              "is_member": 0,
              "rank": 4,
              "description": "Win all 2 vs. 2 matches against the Wii at hard level",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 124,
              "name": "Bean Balance",
              "is_member": 0,
              "rank": 2,
              "description": "Balance 30 bags in a 4-player game",
              "rank_token": "medium"
            },
            {
              "stamp_id": 116,
              "name": "Blue Win",
              "is_member": 0,
              "rank": 1,
              "description": "Conquer the island as Team Blue",
              "rank_token": "easy"
            },
            {
              "stamp_id": 120,
              "name": "Collector",
              "is_member": 0,
              "rank": 3,
              "description": "Collect all the items",
              "rank_token": "hard"
            },
            {
              "stamp_id": 119,
              "name": "Conquer the Island",
              "is_member": 0,
              "rank": 2,
              "description": "Conquer the island as each team",
              "rank_token": "medium"
            },
            {
              "stamp_id": 128,
              "name": "Goalie",
              "is_member": 0,
              "rank": 4,
              "description": "Win a game without letting a puck in your net",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 117,
              "name": "Green Win",
              "is_member": 0,
              "rank": 1,
              "description": "Conquer the island as Team Green",
              "rank_token": "easy"
            },
            {
              "stamp_id": 123,
              "name": "Puffle Paddle",
              "is_member": 0,
              "rank": 2,
              "description": "Play 4-player mode without dropping any puffles",
              "rank_token": "medium"
            },
            {
              "stamp_id": 115,
              "name": "Red Win",
              "is_member": 0,
              "rank": 1,
              "description": "Conquer the island as Team Red",
              "rank_token": "easy"
            },
            {
              "stamp_id": 121,
              "name": "Remote Upload",
              "is_member": 0,
              "rank": 1,
              "description": "Upload another penguin to your Wii remote",
              "rank_token": "easy"
            },
            {
              "stamp_id": 122,
              "name": "Sumo Smash",
              "is_member": 0,
              "rank": 4,
              "description": "Win a 4-player game without being knocked out",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 127,
              "name": "White Puffle",
              "is_member": 0,
              "rank": 1,
              "description": "Feed a white puffle in Feed a Puffle",
              "rank_token": "easy"
            },
            {
              "stamp_id": 118,
              "name": "Yellow Win",
              "is_member": 0,
              "rank": 1,
              "description": "Conquer the island as Team Yellow",
              "rank_token": "easy"
            }
          ]
        }
      }
    ]
  },
  {
    date: '2010-10-04',
    updates: [
      {
        category: {
          "name": "Cart Surfer",
          "description": "Cart Surfer Stamps",
          "parent_group_id": 8,
          "display": "Games : Cart Surfer",
          group_id: CategoryID.CartSurfer,
          "stamps": [
            {
              "stamp_id": 208,
              "name": "Cart Expert",
              "is_member": 0,
              "rank": 3,
              "description": "Earn 250 coins in one game",
              "rank_token": "hard"
            },
            {
              "stamp_id": 210,
              "name": "Cart Master",
              "is_member": 0,
              "rank": 4,
              "description": "Earn 350 coins in one game",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 206,
              "name": "Cart Pro",
              "is_member": 0,
              "rank": 2,
              "description": "Earn 150 coins in one game",
              "rank_token": "medium"
            },
            {
              "stamp_id": 224,
              "name": "Flip Mania",
              "is_member": 0,
              "rank": 3,
              "description": "Flip 20 times in a row without crashing",
              "rank_token": "hard"
            },
            {
              "stamp_id": 212,
              "name": "Great Balance",
              "is_member": 0,
              "rank": 1,
              "description": "Recover from a wobble",
              "rank_token": "easy"
            },
            {
              "stamp_id": 220,
              "name": "Mine Grind",
              "is_member": 0,
              "rank": 3,
              "description": "Grind around 8 corners",
              "rank_token": "hard"
            },
            {
              "stamp_id": 214,
              "name": "Mine Marvel",
              "is_member": 0,
              "rank": 2,
              "description": "Perform 10 tricks in the cart",
              "rank_token": "medium"
            },
            {
              "stamp_id": 216,
              "name": "Mine Mission",
              "is_member": 0,
              "rank": 2,
              "description": "Perform 10 tricks out of the cart",
              "rank_token": "medium"
            },
            {
              "stamp_id": 228,
              "name": "Puffle Power",
              "is_member": 0,
              "rank": 2,
              "description": "Recover from a wobble with a puffle",
              "rank_token": "medium"
            },
            {
              "stamp_id": 222,
              "name": "Surf's Up",
              "is_member": 0,
              "rank": 3,
              "description": "Surf around 8 corners",
              "rank_token": "hard"
            },
            {
              "stamp_id": 218,
              "name": "Trick Master",
              "is_member": 0,
              "rank": 2,
              "description": "Perform 14 different tricks",
              "rank_token": "medium"
            },
            {
              "stamp_id": 226,
              "name": "Ultimate Duo",
              "is_member": 0,
              "rank": 3,
              "description": "Perform 20 tricks with your puffle",
              "rank_token": "hard"
            }
          ]
        }
      }
    ]
  },
  {
    date: '2010-10-23',
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [{
          "stamp_id": 186,
          "name": "Celebration",
          "is_member": 0,
          "rank": 1,
          "description": "Blow out the candles on the Anniversary Cake",
          "rank_token": "easy"
        }]
      }
    ]
  },
  {
    date: '2010-10-28',
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            "stamp_id": 187,
            "name": "Monster Mash",
            "is_member": 0,
            "rank": 2,
            "description": "Wear a monster outfit at the Halloween Party",
            "rank_token": "medium"
          },
          {
            "stamp_id": 188,
            "name": "Scavenger Hunt",
            "is_member": 0,
            "rank": 2,
            "description": "Complete a Scavenger Hunt",
            "rank_token": "medium"
          }
        ]
      }
    ]
  },
  {
    date: Update.WATER_HUNT_START,
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            "stamp_id": 189,
            "name": "Construction",
            "is_member": 0,
            "rank": 1,
            "description": "Join in construction at a party with your jackhammer",
            "rank_token": "easy"
          },
          {
            "stamp_id": 190,
            "name": "Explorer",
            "is_member": 1,
            "rank": 1,
            "description": "Visit all the decorated party rooms",
            "rank_token": "easy"
          }
        ]
      },
      {
        categoryId: CategoryID.Characters,
        stamps: [
          {
            "stamp_id": 290,
            "name": "Sensei",
            "is_member": 0,
            "rank": 4,
            "description": "Be in the same room as Sensei",
            "rank_token": "extreme"
          }
        ]
      }
    ]
  },
  {
    date: '2010-11-24',
    updates: [
      {
        category: {
          "name": "Card-Jitsu",
          "description": "Card-Jitsu Original",
          "parent_group_id": 8,
          "display": "Games : Card-Jitsu",
          group_id: CategoryID.CardJitsu,
          "stamps": [
            {
              "stamp_id": 242,
              "name": "Elemental Win",
              "is_member": 0,
              "rank": 1,
              "description": "Win a match with 3 different elements",
              "rank_token": "easy"
            },
            {
              "stamp_id": 232,
              "name": "Fine Student ",
              "is_member": 0,
              "rank": 2,
              "description": "Reach half way. Earn your blue belt",
              "rank_token": "medium"
            },
            {
              "stamp_id": 238,
              "name": "Flawless Victory ",
              "is_member": 0,
              "rank": 2,
              "description": "Win without letting your opponent gain any cards",
              "rank_token": "medium"
            },
            {
              "stamp_id": 248,
              "name": "Full Dojo",
              "is_member": 0,
              "rank": 4,
              "description": "Score 9 cards before you win",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 230,
              "name": "Grasshopper",
              "is_member": 0,
              "rank": 1,
              "description": "Begin your journey. Earn your white belt",
              "rank_token": "easy"
            },
            {
              "stamp_id": 240,
              "name": "Match Master",
              "is_member": 0,
              "rank": 3,
              "description": "Win 25 matches",
              "rank_token": "hard"
            },
            {
              "stamp_id": 236,
              "name": "Ninja Master ",
              "is_member": 0,
              "rank": 3,
              "description": "Defeat Sensei and become a Ninja",
              "rank_token": "hard"
            },
            {
              "stamp_id": 244,
              "name": "One Element ",
              "is_member": 0,
              "rank": 2,
              "description": "Win a match with 3 cards of the same element",
              "rank_token": "medium"
            },
            {
              "stamp_id": 246,
              "name": "Sensei Card",
              "is_member": 0,
              "rank": 4,
              "description": "See the Sensei Power Card",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 234,
              "name": "True Ninja ",
              "is_member": 0,
              "rank": 3,
              "description": "Prove your ninja skills. Earn your black belt",
              "rank_token": "hard"
            }
          ]
        }
      },
      {
        category: {
          "name": "Card-Jitsu : Fire",
          "description": "Card-Jitsu Fire",
          "parent_group_id": 8,
          "display": "Games : Card-Jitsu : Fire",
          group_id: CategoryID.CardJitsuFire,
          "stamps": [
            {
              "stamp_id": 268,
              "name": "Fire Expert ",
              "is_member": 1,
              "rank": 4,
              "description": "Win 50 matches",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 256,
              "name": "Fire Midway",
              "is_member": 1,
              "rank": 2,
              "description": "Earn the coat. Finish 50% of your Fire Ninja journey",
              "rank_token": "medium"
            },
            {
              "stamp_id": 264,
              "name": "Fire Ninja",
              "is_member": 1,
              "rank": 3,
              "description": "Defeat Sensei and become a Fire Ninja",
              "rank_token": "hard"
            },
            {
              "stamp_id": 262,
              "name": "Fire Suit",
              "is_member": 1,
              "rank": 3,
              "description": "Complete your Fire Suit",
              "rank_token": "hard"
            },
            {
              "stamp_id": 266,
              "name": "Max Energy",
              "is_member": 1,
              "rank": 4,
              "description": "Win 3 energy points in a match",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 254,
              "name": "Score Fire ",
              "is_member": 1,
              "rank": 1,
              "description": "Win 1 energy point in a match",
              "rank_token": "easy"
            },
            {
              "stamp_id": 260,
              "name": "Strong Defence",
              "is_member": 1,
              "rank": 3,
              "description": "Win a match without losing any energy",
              "rank_token": "hard"
            },
            {
              "stamp_id": 252,
              "name": "Warm Up",
              "is_member": 1,
              "rank": 1,
              "description": "Win 10 Fire matches",
              "rank_token": "easy"
            }
          ]
        }
      },
      {
        category: {
          "name": "Card-Jitsu : Water",
          "description": "Card-Jitsu Water",
          "parent_group_id": 8,
          "display": "Games : Card-Jitsu : Water",
          group_id: CategoryID.CardJitsuWater,
          "stamps": [
            {
              "stamp_id": 270,
              "name": "Gong!",
              "is_member": 1,
              "rank": 1,
              "description": "Win a match and sound the gong",
              "rank_token": "easy"
            },
            {
              "stamp_id": 288,
              "name": "Skipping Stones",
              "is_member": 1,
              "rank": 4,
              "description": "Clear 28 stones of any element in a match",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 286,
              "name": "Two Close",
              "is_member": 1,
              "rank": 4,
              "description": "Drift to the edge twice and still win the match",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 276,
              "name": "Water Expert",
              "is_member": 1,
              "rank": 2,
              "description": "Win 100 matches",
              "rank_token": "medium"
            },
            {
              "stamp_id": 278,
              "name": "Water Midway",
              "is_member": 1,
              "rank": 2,
              "description": "Earn the coat. Finish 50% of your Water Ninja journey",
              "rank_token": "medium"
            },
            {
              "stamp_id": 284,
              "name": "Water Ninja",
              "is_member": 1,
              "rank": 3,
              "description": "Defeat Sensei and become a Water Ninja",
              "rank_token": "hard"
            },
            {
              "stamp_id": 282,
              "name": "Water Suit",
              "is_member": 1,
              "rank": 3,
              "description": "Complete your Water Suit",
              "rank_token": "hard"
            },
            {
              "stamp_id": 274,
              "name": "Watery Fall",
              "is_member": 1,
              "rank": 1,
              "description": "Take the plunge! Fall off the Waterfall",
              "rank_token": "easy"
            }
          ]
        }
      }
    ]
  },
  {
    date: '2010-12-16',
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            "stamp_id": 191,
            "name": "Volunteer",
            "is_member": 0,
            "rank": 1,
            "description": "Donate to a Coins For Change cause","rank_token": "easy"
          },
          {
            "stamp_id": 294,
            "name": "Top Volunteer",
            "is_member": 0,
            "rank":3,
            "description": "Give a 5000 coin donation to Coins For Change",
            "rank_token": "hard"
          }
        ]
      }
    ]
  },
  {
    date: '2011-01-14',
    updates: [
      {
        category:   {
          "name": "System Defender",
          "description": "System Defender",
          "parent_group_id": 8,
          "display": "Games : System Defender",
          group_id: CategoryID.SystemDefender,
          "stamps": [
            {
              "stamp_id": 320,
              "name": "Bug Overload",
              "is_member": 0,
              "rank": 1,
              "description": "Protect the EPF mainframe from rogue bugs",
              "rank_token": "easy"
            },
            {
              "stamp_id": 300,
              "name": "Garbage Disposal",
              "is_member": 0,
              "rank": 1,
              "description": "Destroy 100 enemies in 1 level",
              "rank_token": "easy"
            },
            {
              "stamp_id": 308,
              "name": "Master Mechanic",
              "is_member": 0,
              "rank": 2,
              "description": "Fill every open socket with a cannon",
              "rank_token": "medium"
            },
            {
              "stamp_id": 304,
              "name": "Mono Mechanic",
              "is_member": 0,
              "rank": 2,
              "description": "Complete a game with only one type of cannon",
              "rank_token": "medium"
            },
            {
              "stamp_id": 328,
              "name": "Protobot Attack",
              "is_member": 0,
              "rank": 3,
              "description": "Protect the EPF mainframe from Ultimate Protobot",
              "rank_token": "hard"
            },
            {
              "stamp_id": 298,
              "name": "Ready For Duty",
              "is_member": 0,
              "rank": 1,
              "description": "Finish G's tutorial",
              "rank_token": "easy"
            },
            {
              "stamp_id": 310,
              "name": "Strategic Master",
              "is_member": 0,
              "rank": 3,
              "description": "Destroy 250 enemies without upgrading",
              "rank_token": "hard"
            },
            {
              "stamp_id": 302,
              "name": "Strategic Success",
              "is_member": 0,
              "rank": 2,
              "description": "Destroy 100 enemies without upgrading cannons",
              "rank_token": "medium"
            },
            {
              "stamp_id": 312,
              "name": "Tactical Ace",
              "is_member": 0,
              "rank": 3,
              "description": "Destroy 250 enemies without taking damage",
              "rank_token": "hard"
            },
            {
              "stamp_id": 306,
              "name": "Tactical Pro",
              "is_member": 0,
              "rank": 2,
              "description": "Destroy 100 enemies without taking damage",
              "rank_token": "medium"
            }
          ]
        }
      }
    ]
  },
  {
    date: Update.WILDERNESS_EXPEDITION_START,
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            "stamp_id": 193,
            "name": "Path Finder",
            "is_member": 0,
            "rank": 2,
            description: 'Complete a maze at a party',
            rank_token: 'medium'
          },
          {
            "stamp_id": 292,
            "name": "Out At Sea",
            "is_member": 1,
            "rank": 1,
            "description": "Sail away from the island in a boat",
            "rank_token": "easy"
          }
        ]
      }
    ]
  },
  {
    date: '2011-01-27',
    updates: [
      {
        categoryId: CategoryID.SystemDefender,
        stamps: [
          {
            "stamp_id": 322,
            "name": "Herbert Attacks",
            "is_member": 0,
            "rank": 2,
            "description": "Complete the level 'Herbert Attacks'",
            "rank_token": "medium"
          }
        ]
      }
    ]
  },
  {
    date: '2011-02-10',
    updates: [
      {
        categoryId: CategoryID.SystemDefender,
        stamps: [{
        "stamp_id": 326,
        "name": "Test Bot Trio",
        "is_member": 1,
        "rank": 3,
        "description": "Protect the EPF mainframe from the Test Bots",
        "rank_token": "hard"
      }]}
    ]
  },
  {
    date: Update.PUFFLE_PARTY_11_START,
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            stamp_id: 330,
            name: 'Party Puffle',
            is_member: 0,
            rank: 1,
            description: 'Walk your puffle to their party room',
            rank_token: 'easy'
          }
        ]
      }
    ]
  },
  {
    date: '2011-02-24',
    updates: [
      {
        categoryId: CategoryID.SystemDefender,
        stamps: [
          {
            "stamp_id": 324,
            "name": "Klutzy Attack",
            "is_member": 0,
            "rank": 2,
            "description": "Protect the EPF mainframe from Klutzy",
            "rank_token": "medium"
          }
        ]
      }
    ]
  },
  {
    date: Update.PUFFLE_LAUNCH,
    updates: [
      {
        category: {
          "name": "Puffle Launch",
          "description": "Puffle Launch",
          "parent_group_id": 8,
          "display": "Games : Puffle Launch",
          group_id: CategoryID.PuffleLaunch,
          "stamps": [
            {
              "stamp_id": 334,
              "name": "Begin Build",
              "is_member": 0,
              "rank": 1,
              "description": "Collect your first cannon piece",
              "rank_token": "easy"
            },
            {
              "stamp_id": 340,
              "name": "Crab Attack",
              "is_member": 0,
              "rank": 2,
              "description": "Defeat a crab boss once",
              "rank_token": "medium"
            },
            {
              "stamp_id": 344,
              "name": "Crab Battle",
              "is_member": 1,
              "rank": 3,
              "description": "Defeat 6 crab bosses in a single play session",
              "rank_token": "hard"
            },
            {
              "stamp_id": 342,
              "name": "Crab Crash",
              "is_member": 1,
              "rank": 3,
              "description": "Defeat 3 crab bosses in a single play session",
              "rank_token": "hard"
            },
            {
              "stamp_id": 338,
              "name": "Epic Cannon ",
              "is_member": 1,
              "rank": 3,
              "description": "Build the Epic Cannon",
              "rank_token": "hard"
            },
            {
              "stamp_id": 336,
              "name": "Launch Ready",
              "is_member": 0,
              "rank": 2,
              "description": "Build a cannon",
              "rank_token": "medium"
            },
            {
              "stamp_id": 350,
              "name": "Light Speed Launch",
              "is_member": 1,
              "rank": 4,
              "description": "Complete all 36 levels in under 18 minutes",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 346,
              "name": "Quick Launch",
              "is_member": 1,
              "rank": 2,
              "description": "Complete all 36 levels in under 35 minutes",
              "rank_token": "medium"
            },
            {
              "stamp_id": 348,
              "name": "Supersonic Launch",
              "is_member": 1,
              "rank": 3,
              "description": "Complete all 36 levels in under 25 minutes",
              "rank_token": "hard"
            },
            {
              "stamp_id": 354,
              "name": "Turbo Battle",
              "is_member": 1,
              "rank": 3,
              "description": "Defeat the crab in turbo mode",
              "rank_token": "hard"
            },
            {
              "stamp_id": 356,
              "name": "Turbo Master",
              "is_member": 1,
              "rank": 4,
              "description": "Complete all 36 levels in turbo mode",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 352,
              "name": "Turbo Time",
              "is_member": 1,
              "rank": 2,
              "description": "Complete a level in turbo mode",
              "rank_token": "medium"
            }
          ]
        },
      }
    ]
  },
  {
    date: Update.APRIL_FOOLS_11_START,
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            stamp_id: 332,
            name: 'Food Fight',
            is_member: 0,
            rank: 1,
            description: 'Throw your meal in a place where food is found',
            rank_token: 'easy'
          }
        ]
      }
    ]
  },
  {
    date: '2011-03-28',
    updates: [
      {
        categoryId: CategoryID.Characters,
        stamps: [
          {
            stamp_id: 358,
            name: 'Rookie',
            is_member: 0,
            rank: 4,
            description: 'Be in the same room as Rookie',
            rank_token: 'extreme'
          }
        ]
      }
    ]
  },
  {
    date: '2011-04-20',
    updates: [
      {
        category: {
          "name": "Treasure Hunt",
          "description": "Treasure Hunt Stamps",
          "parent_group_id": 8,
          "display": "Games : Treasure Hunt",
          group_id: CategoryID.TreasureHunt,
          "stamps": [
            {
              "stamp_id": 416,
              "name": "Collector",
              "is_member": 0,
              "rank": 2,
              "description": "Collect 8 coins in a single game",
              "rank_token": "medium"
            },
            {
              "stamp_id": 420,
              "name": "Gem Expert",
              "is_member": 0,
              "rank": 3,
              "description": "Uncover a gem in only 3 moves",
              "rank_token": "hard"
            },
            {
              "stamp_id": 422,
              "name": "Gem Pro",
              "is_member": 0,
              "rank": 4,
              "description": "Uncover 2 gems in only 7 moves",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 414,
              "name": "Gem Skills",
              "is_member": 0,
              "rank": 2,
              "description": "Uncover 2 gems in a single game",
              "rank_token": "medium"
            },
            {
              "stamp_id": 418,
              "name": "In the Rough",
              "is_member": 0,
              "rank": 3,
              "description": "Find a rare treasure",
              "rank_token": "hard"
            }
          ]
        },
      }
    ]
  },
  {
    date: Update.EARTH_DAY_2011_START,
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            name: 'Go Green',
            stamp_id: 362,
            description: 'Recycle 10 objects at the Recycling Plant',
            rank: 1,
            rank_token: 'easy',
            is_member: 0
          },
          {
            name: 'Tree Mob',
            stamp_id: 364,
            description: 'Get 10 or more friends to dress up as trees',
            rank: 2,
            is_member: 1,
            rank_token: 'medium'
          }
        ]
      }
    ]
  },
  {
    date: '2011-04-26',
    updates: [
      {
        category:   {
          "name": "Pizzatron 3000",
          "description": "Pizzatron Stamps",
          "parent_group_id": 8,
          "display": "Games : Pizzatron 3000",
          "group_id": 54,
          "stamps": [
            {
              "stamp_id": 404,
              "name": "Candy Land",
              "is_member": 0,
              "rank": 3,
              "description": "Make 3 pink sauce and marshmallow pizzas to order",
              "rank_token": "hard"
            },
            {
              "stamp_id": 396,
              "name": "Chef's Hat",
              "is_member": 0,
              "rank": 2,
              "description": "Make 20 pizzas without any mistakes",
              "rank_token": "medium"
            },
            {
              "stamp_id": 400,
              "name": "Cocoa Beans",
              "is_member": 0,
              "rank": 2,
              "description": "Make 3 jellybean and chocolate pizzas to order",
              "rank_token": "medium"
            },
            {
              "stamp_id": 410,
              "name": "Dessert Chef",
              "is_member": 0,
              "rank": 4,
              "description": "Make 40 candy pizzas without any mistakes",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 402,
              "name": "Fiery Squids",
              "is_member": 0,
              "rank": 3,
              "description": "Make 3 hot sauce and squid pizzas to order",
              "rank_token": "hard"
            },
            {
              "stamp_id": 392,
              "name": "Food Fiasco",
              "is_member": 0,
              "rank": 1,
              "description": "Make a mess of the kitchen with 3 wrong pizzas",
              "rank_token": "easy"
            },
            {
              "stamp_id": 394,
              "name": "Just Dessert",
              "is_member": 0,
              "rank": 1,
              "description": "Play Pizzatron in Candy Mode",
              "rank_token": "easy"
            },
            {
              "stamp_id": 406,
              "name": "Pizza Chef",
              "is_member": 0,
              "rank": 3,
              "description": "Make 30 pizzas without any mistakes",
              "rank_token": "hard"
            },
            {
              "stamp_id": 408,
              "name": "Pizza Master",
              "is_member": 0,
              "rank": 4,
              "description": "Make 40 pizzas without any mistakes",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 398,
              "name": "Spice Sea",
              "is_member": 0,
              "rank": 2,
              "description": "Make 3 hot sauce and shrimp pizzas to order",
              "rank_token": "medium"
            }
          ]
        }
      },
      {
        category:   {
          "name": "Ice Fishing",
          "description": "Ice Fishing",
          "parent_group_id": 8,
          "display": "Games : Ice Fishing",
          "group_id": 52,
          "stamps": [
            {
              "stamp_id": 390,
              "name": "Ace Angler",
              "is_member": 1,
              "rank": 4,
              "description": "Hook 15 gray fish and Mullet with no worm lost",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 382,
              "name": "Afishionado",
              "is_member": 0,
              "rank": 3,
              "description": "Catch 45 fish without any mistakes",
              "rank_token": "hard"
            },
            {
              "stamp_id": 380,
              "name": "Crab Cuts",
              "is_member": 0,
              "rank": 3,
              "description": "Have 3 crabs cut your line and finish the game",
              "rank_token": "hard"
            },
            {
              "stamp_id": 376,
              "name": "Fishtastic",
              "is_member": 0,
              "rank": 2,
              "description": "Catch 15 fish without any mistakes",
              "rank_token": "medium"
            },
            {
              "stamp_id": 388,
              "name": "Fly Fisher",
              "is_member": 0,
              "rank": 3,
              "description": "Catch 63 fish in under 5 minutes",
              "rank_token": "hard"
            },
            {
              "stamp_id": 384,
              "name": "Gray Goodies",
              "is_member": 1,
              "rank": 3,
              "description": "Catch 15 gray fish",
              "rank_token": "hard"
            },
            {
              "stamp_id": 386,
              "name": "Prize Mullet",
              "is_member": 0,
              "rank": 3,
              "description": "Capture Mullet",
              "rank_token": "hard"
            },
            {
              "stamp_id": 374,
              "name": "Shock King",
              "is_member": 0,
              "rank": 2,
              "description": "Get 3 shocks from jellyfish and finish the game",
              "rank_token": "medium"
            },
            {
              "stamp_id": 372,
              "name": "Snack Attack",
              "is_member": 0,
              "rank": 1,
              "description": "Feed a fish to a shark",
              "rank_token": "easy"
            },
            {
              "stamp_id": 378,
              "name": "Worm Win",
              "is_member": 0,
              "rank": 3,
              "description": "Finish the game without losing a worm",
              "rank_token": "hard"
            }
          ]
        }
      }
    ]
  },
  {
    date: Update.MEDIEVAL_11_START,
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            stamp_id: 360,
            name: 'Noble Knight',
            is_member: 1,
            rank: 2,
            description: 'Wear a knight costume at the Medieval party',
            rank_token: 'medium'
          }
        ]
      }
    ]
  },
  {
    date: Update.ISLAND_ADVENTURE_11_START,
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            stamp_id: 426,
            name: 'Music Maestro',
            is_member: 0,
            rank: 2,
            description: 'Solve a musical challenge at a party',
            rank_token: 'medium'
          }
        ]
      }
    ]
  },
  {
    date: '2011-08-18',
    updates: [
      {
        categoryId: CategoryID.SystemDefender,
        stamps: [
          {
            "stamp_id": 443,
            "name": "Track Herbert ",
            "is_member": 0,
            "rank": 4,
            "description": "Complete the level 'Track Herbert'",
            "rank_token": "extreme"
          }
        ]
      }
    ]
  },
  {
    date: Update.GREAT_SNOW_RACE_START,
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            stamp_id: 440,
            name: 'Snowboarder',
            is_member: 1,
            rank: 1,
            description: 'Do a snowboard dance at a party',
            rank_token: 'easy'
          },
          {
            stamp_id: 439,
            name: 'Mountaineer',
            is_member: 0,
            rank: 3,
            description: 'Reach a mountain peak',
            rank_token: 'hard'
          },
          {
            stamp_id: 438,
            name: 'Stunt Penguin',
            is_member: 0,
            rank: 3,
            description: 'Complete an obstacle course',
            rank_token: 'hard'
          }
        ]
      }
    ]
  },
  {
    date: Update.HALLOWEEN_2011_START,
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            stamp_id: 444,
            name: 'Trick-or-treat',
            is_member: 0,
            rank: 2,
            description: 'See 10 Trick-or-Treat igloos at the Halloween Party',
            rank_token: 'medium'
          }
        ]
      }
    ]
  },
  {
    date: '2011-11-03',
    updates: [
      {
        category: {
          "name": "Pufflescape",
          "description": "Pufflescape",
          "parent_group_id": 8,
          "display": "Games : Pufflescape",
          group_id: CategoryID.Pufflescape,
          "stamps": [
            {
              "stamp_id": 429,
              "name": "Bite in Time",
              "is_member": 0,
              "rank": 2,
              "description": "Eat a disappearing Puffle O",
              "rank_token": "medium"
            },
            {
              "stamp_id": 427,
              "name": "Bonus Snack",
              "is_member": 0,
              "rank": 1,
              "description": "Eat a bonus Puffle O",
              "rank_token": "easy"
            },
            {
              "stamp_id": 436,
              "name": "Epic Roller",
              "is_member": 1,
              "rank": 3,
              "description": "Complete level 22",
              "rank_token": "hard"
            },
            {
              "stamp_id": 434,
              "name": "Extreme Puzzler",
              "is_member": 1,
              "rank": 2,
              "description": "Complete level 12",
              "rank_token": "medium"
            },
            {
              "stamp_id": 431,
              "name": "Fast Food",
              "is_member": 0,
              "rank": 3,
              "description": "Eat all disappearing O's in one set of levels",
              "rank_token": "hard"
            },
            {
              "stamp_id": 437,
              "name": "Ice Master",
              "is_member": 1,
              "rank": 3,
              "description": "Complete the final level",
              "rank_token": "hard"
            },
            {
              "stamp_id": 435,
              "name": "Master Roller",
              "is_member": 1,
              "rank": 2,
              "description": "Complete level 17",
              "rank_token": "medium"
            },
            {
              "stamp_id": 432,
              "name": "On a Roll",
              "is_member": 0,
              "rank": 1,
              "description": "Complete level 4",
              "rank_token": "easy"
            },
            {
              "stamp_id": 428,
              "name": "Puffle O Feast",
              "is_member": 0,
              "rank": 2,
              "description": "Eat all regular Puffle O's in one set of levels",
              "rank_token": "medium"
            },
            {
              "stamp_id": 433,
              "name": "Puzzle Pro",
              "is_member": 0,
              "rank": 1,
              "description": "Complete level 8",
              "rank_token": "easy"
            },
            {
              "stamp_id": 430,
              "name": "Quick Snack",
              "is_member": 0,
              "rank": 3,
              "description": "Eat all disappearing O's in one level",
              "rank_token": "hard"
            }
          ]
        },
      }
    ]
  },
  {
    date: Update.HOLIDAY_11_START,
    updates: [
      {
        categoryId: CategoryID.Party,
        stamps: [
          {
            name: 'Epic Volunteer',
            description: 'Give a 10,000 coin donation to Coins For Change.',
            rank: 4,
            rank_token: 'extreme',
            is_member: 0,
            stamp_id: 296
          }
        ]
      }
    ]
  }
];