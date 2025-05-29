import { Update } from "../game-data/updates";
import { isGreaterOrEqual, isLower, Version } from "./versions";

type AchievementCode = {
  event: string;
  conditions: string[];
  optionalConditions?: string[];
}

type WorldAchievements = Array<AchievementCode & {
  stamp: number;
  subId?: number;
  name: string;
}>;

type WorldStamp = {
  name: string;
  id: number;
  declarations: AchievementCode[];
}

class WorldAchievementsXml {
  private _worldAchievements: WorldAchievements = [];

  addWorldStamps(stamps: WorldStamp[]) {
    stamps.forEach(stamp => {
      stamp.declarations.forEach((declaration, i) => {
        this._worldAchievements.push({
          stamp: stamp.id,
          name: stamp.name,
          subId: stamp.declarations.length > 1 ? i : undefined,
          conditions: declaration.conditions,
          event: declaration.event,
          optionalConditions: declaration.optionalConditions
        })
      });
    });
    
  }

  serialize(): string {
    return `<achievementDocument>
      ${this._worldAchievements.map(a => {
        return `<achievement name="${a.name}" id="${a.stamp}${a.subId === undefined ? '' : `.${a.subId}`}">
      <event>${a.event}</event>
      ${a.conditions.map(c => {
        return `<condition>${c}</condition>`
      }).join('\n')}
      ${a.optionalConditions?.map(c => {
        return `<optionalCondition>${c}</optionalCondition>`
      })?.join('\n') ?? ''}
      <result>stampEarned ${a.stamp}</result>
    </achievement>`
      }).join('\n')}
    </achievementDocument>`;
  }
}

const WORLD_STAMPS_TIMELINE: Array<{
  stamps: WorldStamp[],
  start: Version,
  end?: Version
}> = [
  {
    stamps: [
      {
        "name": "Stage Crew",
        "id": 9,
        "declarations": [
          {
            "event": "user hasAchievementEvent",
            "conditions": [
              "user in 340",
              "event hasEventID stageCrew"
            ]
          }
        ]
      },
      {
        "name": "Snapshot",
        "id": 11,
        "declarations": [
          {
            "event": "user playerAction",
            "conditions": [
              "user in 230",
              "event isOnFrame 25",
              "user wearing only 195 or 10195"
            ]
          }
        ]
      },
      {
        "name": "Go Swimming",
        "id": 12,
        "declarations": [
          {
            "event": "user changesFrame",
            "conditions": [
              "user in 810",
              "event isOnFrame 26",
              "event hasProperty x greaterThan 283",
              "event hasProperty y greaterThan 329",
              "user wearing only 274 or 292 or 4257"
            ]
          },
          {
            "event": "user changesFrame",
            "conditions": [
              "user in 806",
              "event isOnFrame 26",
              "event hasProperty x greaterThan 204",
              "event hasProperty x lessThan 590",
              "event hasProperty y greaterThan 317",
              "event hasProperty y lessThan 410",
              "user wearing only 274 or 292 or 4257"
            ]
          },
          {
            "event": "user changesFrame",
            "conditions": [
              "user in 814",
              "event isOnFrame 26",
              "event hasProperty x greaterThan 307",
              "event hasProperty y greaterThan 236",
              "event hasProperty y lessThan 431",
              "user wearing only 274 or 292 or 4257"
            ]
          },
          {
            "event": "user changesFrame",
            "conditions": [
              "user in 815",
              "event isOnFrame 26",
              "user wearing only 274 or 292 or 4257"
            ]
          }
        ]
      },
      {
        "name": "Clock Target",
        "id": 13,
        "declarations": [
          {
            "event": "user snowballHit",
            "conditions": [
              "user in 801",
              "event hasProperty x greaterThan 660",
              "event hasProperty x lessThan 685",
              "event hasProperty y greaterThan 61",
              "event hasProperty y lessThan 93",
              "event occurs 10"
            ]
          }
        ]
      },
      {
        "name": "Going Places",
        "id": 15,
        "declarations": [
          {
            "event": "user enterRoom",
            "conditions": [
              "event occursUniquely room 30"
            ]
          }
        ]
      },
      {
        "name": "Dance Party",
        "id": 16,
        "declarations": [
          {
            "event": "every 2 seconds",
            "conditions": [
              "user in 120",
              "anyWithUser 10 penguins isOnFrame 26"
            ]
          }
        ]
      },
      {
        "name": "Igloo Party",
        "id": 17,
        "declarations": [
          {
            "event": "any penguin enterRoom",
            "conditions": [
              "user in myIgloo",
              "any 10 penguins in myIgloo"
            ]
          }
        ]
      },
      {
        "name": "Coffee Server",
        "id": 18,
        "declarations": [
          {
            "event": "user sendEmote",
            "conditions": [
              "user in 110",
              "event hasEmoteID 13",
              "user wearing 262 or 10262",
              "event occurs 5"
            ]
          }
        ]
      },
      {
        "name": "Pizza Waitor",
        "id": 19,
        "declarations": [
          {
            "event": "user sendEmote",
            "conditions": [
              "user in 330",
              "event hasEmoteID 24",
              "user wearing 263 or 240 or 10263",
              "event occurs 5"
            ]
          }
        ]
      },
      {
        "name": "Puffle Owner",
        "id": 21,
        "declarations": [
          {
            "event": "user enterIgloo",
            "conditions": [
              "user in myIgloo",
              "user puffles countGreaterThan 15"
            ]
          }
        ]
      },
      {
        "name": "Floor Filler",
        "id": 22,
        "declarations": [
          {
            "event": "every 2 seconds",
            "conditions": [
              "user in 120",
              "anyWithUser 25 penguins isOnFrame 26"
            ]
          }
        ]
      },
      {
        "name": "Full House",
        "id": 23,
        "declarations": [
          {
            "event": "user iglooFurnitureLoaded",
            "conditions": [
              "user in 1108SS",
              "event hasProperty furnitureCount greaterThan 98"
            ]
          },
          {
            "event": "user iglooEdited",
            "conditions": [
              "user in myIgloo",
              "event hasProperty furnitureCount greaterThan 98",
              "event hasProperty active lessThan 1"
            ]
          }
        ]
      },
      {
        "name": "Play it loud!",
        "id": 24,
        "declarations": [
          {
            "event": "user hasAchievementEvent",
            "conditions": [
              "user in 410",
              "event hasEventID playItLoud"
            ]
          }
        ]
      },
      {
        "name": "Soccer Team",
        "id": 25,
        "declarations": [
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 775"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 10775"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 778"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 4088"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 4091"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 10778"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 778 or 10778"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 775 or 10775"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 4346"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 4347"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 4348"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 4349"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 4350"
            ]
          }
        ]
      },
      {
        "name": "Berg Drill!",
        "id": 26,
        "declarations": [
          {
            "event": "every 2 seconds",
            "conditions": [
              "user in 805",
              "anyWithUser 30 penguins wearing only 403 or 429 or 674 or 10403 or 1133 or 10429",
              "sameSubjects isOnFrame 26"
            ]
          }
        ]
      },
      {
        "name": "Snow Forts",
        "id": 27,
        "declarations": [
          {
            "event": "every 2 seconds",
            "conditions": [
              "user in 801",
              "anyWithUser 5 penguins hasProperty thrownSnowballInCurrentRoom greaterThan 0",
              "sameSubjects hasPenguinColourID myPenguinColourID"
            ]
          }
        ]
      },
      {
        "name": "Party Host",
        "id": 28,
        "declarations": [
          {
            "event": "any penguin enterRoom",
            "conditions": [
              "user in myIgloo",
              "any 30 penguins in myIgloo"
            ]
          }
        ]
      },
      {
        "name": "Hockey Team",
        "id": 29,
        "declarations": [
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 5 penguins wearing 277 or 278 or 4143 or 10277 or 14143 or 14204 or 4204"
            ]
          }
        ]
      },
      {
        "name": "Ninja Meeting",
        "id": 30,
        "declarations": [
          {
            "event": "every 2 seconds",
            "conditions": [
              "user in 322",
              "anyWithUser 10 penguins wearing 4033"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "user in 322",
              "anyWithUser 10 penguins wearing 4034"
            ]
          },
          {
            "event": "every 2 seconds",
            "conditions": [
              "user in 322",
              "anyWithUser 10 penguins wearing 4075"
            ]
          }
        ]
      }
    ],
    start: Update.STAMPS_RELEASE
  },
  {
    stamps: [
      {
        "name": "Happy Party Room",
        "id": 182,
        "declarations": [
          {
            "event": "every 2 seconds",
            "conditions": [
              "user in 200 or 400 or 410 or 800 or 810 or 851 or 852 or 853 or 854 or 855 or 856 or 857",
              "anyWithUser 10 penguins hasProperty emoteIDDisplayedInCurrentRoom equals 1 or 2"
            ]
          }
        ]
      }
    ],
    start: Update.MOUNTAIN_EXPEDITION
  },
  {
    stamps: [
      {
        "name": "Go Green",
        "id": 362,
        "declarations": [
          {
            "event": "user snowballHit",
            "conditions": [
              "user in 122",
              "event hasProperty x greaterThan 92",
              "event hasProperty x lessThan 203",
              "event hasProperty y greaterThan 48",
              "event hasProperty y lessThan 128",
              "event occurs 10"
            ]
          }
        ]
      },
      {
        "name": "Tree Mob",
        "id": 364,
        "declarations": [
          {
            "event": "every 2 seconds",
            "conditions": [
              "anyWithUser 10 penguins wearing only 4147 or 14147"
            ]
          }
        ]
      }
    ],
    start: '2011-04-21'
  },
  {
    stamps: [
      {
        "name": "Tend A Concession Stand",
        "id": 184,
        "declarations": [
          {
            "event": "user sendEmote",
            "conditions": [
              "user in 810",
              "user hits or popcornsign_mc",
              "event hasEmoteID 13 or 24 or 28 or 29 or 26 or 27"
            ]
          }
        ]
      }
    ],
    start: Update.FAIR_2010_START,
    end: Update.FAIR_2010_END
  },
  {
    stamps: [
      {
        name: 'Monster Mash',
        id: 187,
        declarations: [
          {
            event: 'every 2 seconds',
            conditions: [],
            optionalConditions: ['user wearing 244'] // Ghost Costume
          }
        ]
      }
    ],
    start: Update.HALLOWEEN_2010_START,
    end: Update.HALLOWEEN_2010_END
  },
  {
    stamps: [
      {
        name: 'Construction',
        id: 189,
        declarations: [
          {
            event: 'every 2 seconds',
            conditions: [
              'user in 816',
              'user wearing only 342 or 5069 or 403 or 10403 or 429 or 10429 or 674 or 1133 or 11133',
              'user isOnFrame 26'
            ]
          }
        ]
      },
      {
        name: 'Explorer',
        id: 190,
        declarations: [
          {
            event: 'every 2 seconds',
            conditions: [
              'user hasProperty is_member equals 1',
              'user in 100 300 321 322 800 801 804 806 808 809 813 814 816'
            ]
          }
        ]
      }
    ],
    start: Update.WATER_HUNT_START,
    end: Update.WATER_HUNT_END
  },
  {
    stamps: [
      {
        "name": "Snowboarder",
        "id": 440,
        "declarations": [
          {
            "event": "every 2 seconds",
            "conditions": [
              "user wearing only 3083 or 3084 or 3085",
              "user isOnFrame 26",
              "user in 300 or 100 or 200 or 851 or 852 or 853 or 854 or 855 or 856 or 857 or 858 or 859 or 860"
            ]
          }
        ]
      }
    ],
    start: '2011-08-25'
  }
];

export function getWorldAchievementsXml(version: Version): string {
  const worldAchievements = new WorldAchievementsXml();

  WORLD_STAMPS_TIMELINE.forEach(update => {
    if (isGreaterOrEqual(version, update.start) && (update.end === undefined || isLower(version, update.end))) {
      worldAchievements.addWorldStamps(update.stamps);
    }
  });

  return worldAchievements.serialize();
}