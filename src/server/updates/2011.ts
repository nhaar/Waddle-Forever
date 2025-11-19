import { Update } from ".";
import { CategoryID } from "../game-data/stamps";

export const UPDATES_2011: Update[] = [
  {
    date: '2011-01-11',
    clothingCatalog: 'archives:January11Style.swf'
  },
  {
    date: '2011-01-14',
    furnitureCatalog: 'archives:Jan-Feb2011BetterIgloos.swf',
    stampUpdates: [
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
    date: '2011-01-17',
    fileChanges: {
      'play/v2/client/club_penguin.swf': 'archives:ClientClubPenguin2011-03-28.swf',
      'play/v2/client/world.swf': 'archives:ClientWorld.swf',
      'play/v2/client/login.swf': 'archives:ClientLogin2011-08-20.swf',
      'play/start/swf/start.swf': 'archives:PlayStartSwfStart.swf',
      'play/v2/client/newspaper.swf': 'approximation:newspaper_march_compatible.swf'
    },
    startscreens: [ 
      'archives:LoginAdopt_black.swf',
      'archives:LoginAdopt_green.swf',
      'archives:LoginAdopt_pink.swf',
      'archives:LocalEnLoginBackgroundsAdopt_yellow.swf',
      'archives:LoginDucky.swf',
      'archives:LoginJetpack.swf',
      'archives:LoginStamps3.swf'
    ],
    temp: {
      party: {
        partyName: 'Wilderness Expedition',
        freeBrownPuffle: true,
        rooms: {
          town: 'archives:RoomsTown-WildernessExpedition.swf',
          plaza: 'archives:WildernessExpeditionPlaza.swf',
          dock: 'archives:RoomsDock-WildernessExpedition.swf',
          cove: 'archives:RoomsCove-WildernessExpedition.swf',
          party1: 'archives:WildernessExpeditionParty1.swf',
          party2: 'archives:WildernessExpeditionParty2.swf',
          party3: 'archives:WildernessExpeditionParty3.swf',
          party4: 'archives:WildernessExpeditionParty4.swf',
          party5: 'archives:WildernessExpeditionParty5.swf',
          party6: 'archives:WildernessExpeditionParty6.swf',
          party7: 'archives:WildernessExpeditionParty7.swf',
          party8: 'archives:WildernessExpeditionParty8.swf',
          party9: 'archives:WildernessExpeditionParty9.swf',
          party10: 'archives:WildernessExpeditionParty10.swf',
          party11: 'archives:WildernessExpeditionParty11.swf',
          party12: 'archives:WildernessExpeditionParty12.swf',
          party13: 'archives:WildernessExpeditionParty13.swf'
        },
        music: {
          party1: 304,
          party2: 303,
          party3: 303,
          party4: 303,
          party5: 303,
          party6: 303,
          party7: 303,
          party8: 303,
          party9: 303,
          party10: 302,
          party11: 306,
          party12: 304,
          party13: 305
        },
        furniturePrices: {
          665: 0
        },
        localChanges: {
          'close_ups/poster.swf': {
            'en': 'archives:WildernessExpeditionPoster.swf'
          },
          'close_ups/party_note01.swf': {
            'en': 'archives:WildernessExpeditionPartyNote01.swf'
          },
          'close_ups/party_note02.swf': {
            'en': 'archives:WildernessExpeditionPartyNote02.swf'
          },
          'close_ups/party_note03.swf': {
            'en': 'archives:WildernessExpeditionPartyNote03.swf'
          },
          'close_ups/party_note04.swf': {
            'en': 'archives:WildernessExpeditionPartyNote04.swf'
          },
          'close_ups/party_note05.swf': {
            'en': 'archives:WildernessExpeditionPartyNote05.swf'
          },
          'catalogues/party.swf': {
            'en': ['archives:PartyCatalogWildernessExpedition.swf', 'party_purchase']
          },
          'membership/party1.swf': {
            'en': 'archives:WildernessExpeditionMembershipParty1.swf'
          },
          'membership/party2.swf': {
            'en': 'archives:WildernessExpeditionMembershipParty2.swf'
          }
        },
        // workaround shell and interface
        fileChanges: {
          'play/v2/client/interface.swf': 'approximation:wilderness_expedition/interface.swf',
          'play/v2/client/shell.swf': 'approximation:wilderness_expedition/shell.swf'
        },
        startscreens: [
          'archives:LoginWildernessExpedition.swf',
          'archives:LoginWildernessExpedition2.swf'
        ],
        worldStamps: [
          {
            name: 'Path Finder',
            id: 193,
            declarations: [
              {
                event: 'user enterRoom',
                conditions: [
                  'user in 860'
                ]
              }
            ]
          },
          {
            name: 'Out At Sea',
            id: 292,
            declarations: [
              {
                event: 'user enterRoom',
                conditions: [
                  'user in 862'
                ]
              }
            ]
          }
        ]
      }
    },
    stampUpdates: [
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
    date: '2011-01-24',
    temp: {
      party: {
        update: 'Brown Puffle Houses are available for free',
        rooms: {
          party13: 'archives:RoomsParty13-WildernessExpedition.swf'
        }
      }
    }
  },
  {
    date: '2011-01-27',
    stagePlay: {
      name: 'The Penguins that Time Forgot',
      costumeTrunk: 'archives:September2009Costume.swf'
    },
    rooms: {
      stage: 'archives:RoomsStage-Early2011.swf',
      plaza: 'archives:RoomsPlaza-Play6.swf'
    },
    stampUpdates: [
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
    date: '2011-01-31',
    end: ['party'],
    localChanges: {
      'catalogues/adopt.swf': {
        'en': 'archives:Feb2011Adopt.swf'
      },
    }
  },
  {
    date: '2011-02-10',
    temp: {
      const: {
        rooms: {
          'boxdimension': 'archives:PuffleParty2011ConstBoxDimension.swf',
          'dance': 'archives:PuffleParty2011ConstDance.swf',
          'mine': 'archives:PuffleParty2011ConstMine.swf',
          'berg': 'archives:PuffleParty2011ConstBerg.swf',
          'light': 'archives:PuffleParty2011ConstLight.swf',
          'forest': 'archives:PuffleParty2011ConstForest.swf',
          'lounge': 'archives:PuffleParty2011ConstLounge.swf',
          'beacon': 'archives:PuffleParty2011ConstBeacon.swf',
          'cave': 'archives:PuffleParty2010ConstCave.swf'
        }
      }
    },
    stampUpdates: [
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
    date: '2011-02-11',
    clothingCatalog: 'archives:PenguinStyleFeb2011.swf',
    furnitureCatalog: 'archives:Feb-Mar2011BetterIgloos.swf'
  },
  {
    date: '2011-02-17',
    localChanges: {
      'postcards/111.swf': {
        en: 'archives:Enm111.swf'
      }
    },
    temp: {
      party: {
        partyName: 'Puffle Party',
        rooms: {
          'town': 'archives:RoomsTown-PuffleParty2011.swf',
          'beach': 'archives:PuffleParty2011Beach.swf',
          'berg': 'archives:PuffleParty2011Berg.swf',
          'dock': 'archives:PuffleParty2011Dock.swf',
          'forest': 'archives:PuffleParty2011Forest.swf',
          'pet': 'archives:PuffleParty2011Pet.swf',
          'plaza': 'archives:PuffleParty2011Plaza(1).swf',
          'village': 'archives:PuffleParty2011Village.swf',
          'forts': 'archives:PuffleParty2011Forts.swf',
          'party1': 'archives:PuffleParty2011Party1.swf',
          'party2': 'archives:PuffleParty2011Party2.swf',
          'party3': 'archives:PuffleParty2011Party3.swf',
          'dance': 'archives:PuffleParty2011Dance.swf',
          'mine': 'archives:PuffleParty2011Mine.swf',
          'light': 'archives:PuffleParty2011Light.swf',
          'beacon': 'archives:PuffleParty2011Beacon.swf',
          'cove': 'archives:PuffleParty2011Cove.swf',
          'cave': 'archives:PuffleParty2011Cave.swf',
          'boxdimension': 'archives:PuffleParty2011BoxDimension.swf',
          'lounge': 'archives:PuffleParty2011Lounge.swf'
        },
        music: {
          'town': 261,
          'beach': 261,
          'dock': 261,
          'forts': 261,
          'forest': 261,
          'village': 261,
          'light': 31,
          'berg': 213,
          'pet': 282,
          'plaza': 261,
          'party1': 261,
          'party2': 282,
          'dance': 260,
          'lounge': 260,
          'cove': 290,
          'beacon': 261,
          'mine': 256,
          'cave': 36
        },
        memberRooms: {
          party2: true,
          party3: true
        },
        localChanges: {
          'close_ups/poster.swf': {
            'en': 'archives:PuffleParty2011Poster.swf'
          },
          'membership/party2.swf': {
            'en': ['archives:PuffleParty2011MembershipParty2.swf', 'oops_party2_room']
          },
          'membership/party3.swf': {
            'en': ['archives:PuffleParty2011MembershipParty3.swf', 'oops_party3_room']
          }
        },
        startscreens: [
          'archives:LoginPuffleParty2011(1).swf',
          'archives:LoginPuffleParty2011(2).swf'
        ],
        worldStamps: [
          {
            name: 'Party Puffle',
            id: 330,
            declarations: [
              {
                event: 'user enterRoom',
                conditions: [
                  // blue puffle in forest
                  'user in 809',
                  'user wearing 750'
                ]
              },
              {
                event: 'user enterRoom',
                conditions: [
                  // pink puffle in berg
                  'user in 805',
                  'user wearing 751'
                ]
              },
              {
                event: 'user enterRoom',
                conditions: [
                  // black puffle in cave
                  'user in 806',
                  'user wearing 752'
                ]
              },
              {
                event: 'user enterRoom',
                conditions: [
                  // green puffle in beacon
                  'user in 411',
                  'user wearing 753'
                ]
              },
              {
                event: 'user enterRoom',
                conditions: [
                  // purple puffle in dance
                  'user in 120',
                  'user wearing 754'
                ]
              },
              {
                event: 'user enterRoom',
                conditions: [
                  // red puffle in cove
                  'user in 810',
                  'user wearing 755'
                ]
              },
              {
                event: 'user enterRoom',
                conditions: [
                  // yellow puffle in light
                  'user in 410',
                  'user wearing 756'
                ]
              },
              {
                event: 'user enterRoom',
                conditions: [
                  // white puffle in mine
                  'user in 808',
                  'user wearing 757'
                ]
              },
              {
                event: 'user enterRoom',
                conditions: [
                  // orange puffle in box dimension
                  'user in 811',
                  'user wearing 758'
                ]
              },
              {
                // brown puffle in lounge
                event: 'user enterRoom',
                conditions: [
                  'user in 121',
                  'user wearing 759'
                ]
              }
            ]
          }
        ]
      }
    },
    stampUpdates: [
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
    stampUpdates: [
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
    date: '2011-02-25',
    rooms: {
      'plaza': 'archives:PuffleParty2011Plaza(2).swf',
      stage: 'archives:RoomsStage-February2011.swf'
    },
    stagePlay: {
      name: 'The Haunting of the Viking Opera',
      costumeTrunk: 'archives:February2011HauntingOfTheVikingOperaCostumeTrunk.swf'
    },
  },
  {
    date: '2011-02-28',
    end: ['party']
  },
  {
    date: '2011-03-01',
    miscComments: ['Renovation for the Pet Shop begins'],
    temp: {
      'pet-renovation': {
        rooms: {
          plaza: 'archives:PlazaConstructionMar2011.swf',
          pet: 'archives:PetConstructionMar2011.swf'
        }
      }
    }
  },
  {
    date: '2011-03-08',
    end: ['pet-renovation'],
    roomComment: 'The Pet Shop renovation finishes',
    rooms: {
      pet: 'archives:Mar07.2011Pet.swf'
    }
  },
  {
    date: '2011-03-11',
    clothingCatalog: 'archives:PenguinStyleMar2011.swf',
    furnitureCatalog: 'archives:Mar-Apr2011Furniture.swf'
  },
  {
    date: '2011-03-15',
    roomComment: 'Puffle Launch releases',
    rooms: {
      pet: 'archives:RoomsPet_5.swf'
    },
    stampUpdates: [
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
    date: '2011-03-17',
    stagePlay: {
      name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
      costumeTrunk: 'archives:March2011SquidzoidVsShadowGuyAndGammaGalCostume.swf'
    },
    rooms: {
      plaza: 'archives:RoomsPlaza-Play3-2.swf'
    }
  },
  {
    date: '2011-03-21',
    temp: {
      const: {
        rooms: {
          'beach': 'archives:BeachConstructionAprilFoolsParty2011.swf',
          'dock': 'archives:DockCostructionAprilFoolsParty2011.swf',
          'berg': 'archives:IceBergConstructionAprilFoolsParty2011.swf',
          'village': 'archives:SkiVillageCostructionAprilFoolsParty2011.swf',
          'forts': 'archives:SnowFortsContructionAprilFoolsParty2011.swf',
          'boxdimension': 'archives:BoxDimensionConstructionAprilFoolsParty2011.swf'
        }
      }
    }
  },
  {
    date: '2011-03-25',
    fileChanges: {
      // interface that has scavenger hunt functions
      'play/v2/client/interface.swf': 'archives:ClientInterface20110830.swf'
    },
    temp: {
      party: {
        partyName: 'April Fools',
        globalChanges: {
          'scavenger_hunt/hunt_ui.swf': ['archives:AprilFoolsParty2011Scavenger_hunt.swf', 'april_fools_hunt', 'scavenger_hunt']
        },
        startscreens: [
          'archives:LoginAprilfools2.swf',
          'archives:LoginAprilFools2011.swf'
        ],
        localChanges: {
          'close_ups/poster.swf': {
            'en': 'archives:AprilFoolsParty2011Poster.swf'
          },
          'catalogues/party.swf': {
            'en': 'archives:AprilFoolsParty2011PartyCatalog.swf'
          },
          'membership/party.swf': {
            'en': [
              'archives:AprilFoolsParty2011MembershipParty2.swf',
              'oops_party1_room',
              'oops_party2_room',
              'oops_party3_room',
              'oops_party4_room',
              'oops_party5_room',
              'oops_party6_room',
              'oops_party7_room',
            ]
          }
        },
        rooms: {
          'party1': 'archives:AprilFools\'Party2011Party1.swf',
          'party2': 'archives:AprilFools\'Party2011Party2.swf',
          'party3': 'archives:AprilFools\'Party2011Party3.swf',
          'party4': 'archives:AprilFools\'Party2011Party4.swf',
          'party5': 'archives:AprilFools\'Party2011Party5.swf',
          'party6': 'archives:AprilFools\'Party2011Party6.swf',
          'party7': 'archives:AprilFools\'Party2011Party7.swf',
          'party8': 'archives:AprilFools\'Party2011Party8.swf',
          'beach': 'archives:AprilFools\'Party2011Beach.swf',
          'town': 'archives:RoomsTown-AprilFoolsParty2011.swf',
          'shop': 'archives:AprilFools\'Party2011Shop.swf',
          'eco': 'archives:AprilFools\'Party2011Eco.swf',
          'forts': 'archives:AprilFools\'Party2011Forts.swf',
          'beacon': 'archives:AprilFools\'Party2011Beacon.swf',
          'berg': 'archives:AprilFools\'Party2011Berg.swf',
          'boiler': 'archives:AprilFools\'Party2011Boiler.swf',
          'cove': 'archives:AprilFools\'Party2011Cove.swf',
          'dance': 'archives:AprilFools\'Party2011Dance.swf',
          'mine': 'archives:AprilFools\'Party2011Mine.swf',
          'lodge': 'archives:AprilFools\'Party2011Lodge.swf',
          'dock': 'archives:AprilFools\'Party2011Dock.swf',
          'boxdimension': 'archives:AprilFools\'Party2011Boxdimension.swf',
          'village': 'archives:AprilFools\'Party2011Village.swf',
          'pizza': 'archives:AprilFools\'Party2011Pizza.swf',
          'coffee': 'archives:AprilFools\'Party2011Coffee.swf',
          'cave': 'archives:AprilFools\'Party2011Cave.swf',
          'light': 'archives:AprilFools\'Party2011Light.swf'
        },
        music: {
          'party1': 229,
          'party2': 307,
          'party3': 265,
          'party4': 215,
          'party5': 208,
          'party6': 209,
          'party7': 220,
          'party8': 11,
          'town': 232,
          'shop': 201,
          'dance': 231,
          'light': 201,
          'lodge': 201,
          'eco': 201,
          'cove': 232,
          'beacon': 232,
          'forts': 232,
          'pizza': 201,
          'dock': 232,
          'berg': 232,
          'mine': 201,
          'boiler': 201,
          'coffee': 201,
          'cave': 201,
          'beach': 232,
          'village': 232
        },
        memberRooms: {
          party1: true,
          party2: true,
          party3: true,
          party4: true,
          party5: true,
          'party6': true,
          party7: true
        },
        scavengerHunt2011: {
          icon: 'archives:AprilFoolsParty2011Scavenger_hunt_icon.swf',
          global: {
            member: true,
            reward: 4339,
          },
          lang: {
            en: {
              loading: 'Loading Scavenger Hunt',
              title: 'SILLY SCAVENGER HUNT',
              start: 'You have found',
              itemsFound: 'You have found %num% piece',
              itemsFoundPlural: 'You have found %num% pieces',
              claim: 'Claim Prize',
              continue: 'Continue',
              clues: [
                "Start where,\\norange puffles go,\\n\\nIn a room with\\na purple glow.\\n",
                "Continue the search,\\namong the sand,\\n\\nWhere red mountains,\\nframe the land.\\n",
                "This blank page\\nholds much potential\\n\\nYour imagination\\nis essential!\\n",
                "If you find yourself\\nnext to Mars...\\n\\n...find something hidden\\nin the stars \\n",
                "The stage is\\njust the thing\\n\\nTo find a clue\\nfit for a king\\n",
                "Finding this one\\nwill turn you around\\n\\nIn a room\\nwhere up is down\\n",
                "To free this piece:\\nyou\\'ll need a clue:\\n\\nFind your way\\nthrough bright pink brew \\n",
                "This Scavenger Hunt\\nis extreme!\\n\\nFind this piece\\nby a chocolate stream\\n"
              ]
            }
          }
        },
        worldStamps: [
          {
            name: 'Food Fight',
            id: 332,
            declarations: [
              {
                // candy dimension
                event: 'any penguin snowballHit',
                conditions: [
                  'user in 854'
                ]
              },
              {
                // piza parlor
                event: 'any penguin snowballHit',
                conditions: [
                  'user in 330'
                ]
              }
            ]
          }
        ]
      }
    },
    stampUpdates: [
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
    rooms: {
      // bits and bolts: currently doesn't work due to missing engine.swf functionality
      lounge: 'archives:RoomsLounge_2.swf'
    },
    stampUpdates: [
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
    date: '2011-04-01',
    clothingCatalog: 'archives:PenguinStyleApr2011.swf'
  },
  {
    date: '2011-04-05',
    end: ['party']
  },
  {
    date: '2011-04-08',
    furnitureCatalog: 'archives:AprMay2011Furniture.swf'
  },
  {
    date: '2011-04-14',
    stagePlay: {
      name: 'Norman Swarm Has Been Transformed',
      costumeTrunk: 'archives:Apr2011NormanSwarmHasBeenTransformedCostume.swf' 
    },
    rooms: {
      plaza: 'archives:RoomsPlaza-Play14.swf',
      stage: 'archives:2011Apr14Stage.swf',
      party1: 'archives:RoomsParty1-Apr2011-NormanSwarmHasBeenTransformed.swf'
    }
  },
  {
    date: '2011-04-20',
    stampUpdates: [
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
    date: '2011-04-21',
    migrator: 'archives:Apr2011Pirate.swf',
    temp: {
      party: {
        partyName: 'Earth Day',
        rooms: {
          dock: 'archives:EarthDay2011Dock.swf',
          forest: 'archives:EarthDay2011Forest.swf',
          plaza: 'archives:EarthDay2011Plaza.swf',
          forts: 'archives:EarthDay2011Forts.swf',
          town: 'archives:RoomsTown-March2011.swf',
          cave: 'archives:EasterEggHunt2011Cave.swf',
          dojo: 'archives:EasterEggHunt2011Dojo.swf',
          attic: 'archives:EasterEggHunt2011Attic.swf',
          shack: 'archives:EasterEggHunt2011Shack.swf',
          mtn: 'archives:EasterEggHunt2011Mtn.swf'
        },
        scavengerHunt2011: {
          icon: 'archives:EasterEggHunt2011Scavenger_hunt_icon.swf',
          global: {
            reward: 9098,
            member: false
          },
          lang: {
            en: {
              loading: 'Loading Scavenger Hunt',
              title: 'SCAVENGER HUNT',
              claim: 'Claim Prize',
              continue: 'Continue',
              clues: [
                'The first egg is\\nhidden way up high.\\nStart your search\\nnear a small bonsai',
                'This clue requires\\na very short note:\\nFind this egg near\\na floating boat.',
                'The next clue\\nis a total breeze.\\nLook for this egg\\naround some trees.',
                'Go to where\\nthe lighting is dim.\\nThink of where\\nyou most like to swim.',
                'You grasped the clues,\\nyou followed the signs...\\n...now find the polar bear\\nwrapped in vines!',
                'You\'re almost done\\nso stay the course.\\nFind the room\\nwith a rocking horse.',
                'Wrap up warm,\\nor you\'ll feel a chill.\\nSpot this egg\\non top of a hill.',
                'With this last clue,\\nyou\'re good to go.\\nStart a machine\\nand make it snow.'
              ],
              'itemsFound': '',
              itemsFoundPlural: '',
              start: ''
            }
          }
        },
        globalChanges: {
          'content/scavenger_hunt.swf': [ 'archives:EasterEggHunt2011Scavenger_hunt.swf', 'scavenger_hunt' ]
        },
        localChanges: {
          'close_ups/poster.swf': {
            'en': ['archives:EarthDay2011Poster.swf', 'party_poster']
          },
          'catalogues/party.swf': {
            'en': ['archives:EarthDay2011CatalogParty.swf', 'party_catalogue']
          },
          'catalogues/party2.swf': {
            'en': [ 'archives:EarthDay2011CatalogParty2.swf', 'party_catalogue2']
          },
          'earth_day_video.swf': {
            'en': [ 'archives:EarthDay2011Earth_day_video.swf', 'earth_day_video']
          }
        },
        music: {
          dock: 269,
          forts: 295
        },
        prices: {
          4345: 50,
          4344: 50
        },
        startscreens: [ 'archives:LoginEarth_day1.swf' ]
      }
    },
    stampUpdates: [
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
    ],
    worldStamps: [
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
    ]
  },
  {
    date: '2011-04-26',
    end: ['party'],
    stampUpdates: [
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
    date: '2011-05-01',
    migrator: false
  },
  {
    date: '2011-05-06',
    clothingCatalog: 'archives:PenguinStyleMay2011.swf'
  },
  {
    date: '2011-05-13',
    furnitureCatalog: 'archives:May2011Furniture.swf'
  },
  {
    date: '2011-05-17',
    temp: {
      const: {
        rooms: {
          'town': 'archives:RoomsTown-MedievalParty2010Pre.swf',
          'forts': 'archives:MedievalParty2011ConstForts.swf',
          'village': 'archives:MedievalParty2011ConstVillage.swf',
          'plaza': 'archives:MedievalParty2011ConstPlaza.swf',
          'cave': 'archives:MedievalParty2011ConstCave.swf',
          'beach': 'archives:MedievalParty2011ConstBeach.swf'
        }
      }
    }
  },
  {
    date: '2011-05-19',
    temp: {
      party: {
        partyName: 'Medieval Party',
        localChanges: {
          'catalogues/party.swf': {
            'en': 'archives:MedievalParty2011CatalogParty.swf'
          },
          'membership/party.swf': {
            'en': ['archives:MedievalParty2011MembershipParty2.swf', 'oops_party14_room', 'oops_party19_room']
          },
          'close_ups/InstructionsScroll.swf': {
            en: ['svanilla:media/play/v2/content/local/en/close_ups/InstructionsScroll.swf', 'instructions_quest']
          }
        },
        memberRooms: {
          'party14': true,
          'party19': true
        },
        startscreens: [
          'archives:LoginMedievalparty.swf'
        ],
        rooms: {
          'book': 'archives:MedievalParty2011Book.swf',
          'beach': 'archives:Rooms0508Beach.swf',
          'beacon': 'archives:MedievalParty2011Beacon.swf',
          'boiler': 'archives:MedievalParty2011Boiler.swf',
          'cave': 'archives:MedievalParty2011Cave.swf',
          'cove': 'archives:MedievalParty2011Cove.swf',
          'coffee': 'archives:MedievalParty2011Coffee.swf',
          'lounge': 'archives:MedievalParty2011Lounge.swf',
          'light': 'archives:MedievalParty2011Light.swf',
          'shop': 'archives:MedievalParty2011Shop.swf',
          'dock': 'archives:MedievalParty2011Dock.swf',
          'forest': 'archives:MedievalParty2011Forest.swf',
          'dance': 'archives:MedievalParty2011Dance.swf',
          'mine': 'archives:MedievalParty2011Mine.swf',
          'shack': 'archives:MedievalParty2011Shack.swf',
          'attic': 'archives:MedievalParty2011Attic.swf',
          'pizza': 'archives:MedievalParty2011Pizza.swf',
          'plaza': 'archives:MedievalParty2011Plaza.swf',
          'eco': 'archives:MedievalParty2011Eco.swf',
          'mtn': 'archives:MedievalParty2011Mtn.swf',
          'rink': 'archives:MedievalParty2011Rink.swf',
          'town': 'archives:RoomsTown-MedievalParty2011.swf',
          'forts': 'archives:MedievalParty2011Forts.swf',
          'village': 'archives:MedievalParty2011Village.swf',
          'lodge': 'archives:Rooms0508Lodge.swf',
          'party1': 'archives:MedievalParty2011Party1.swf',
          'party2': 'archives:MedievalParty2011Party2.swf',
          'party3': 'archives:MedievalParty2011Party3.swf',
          'party4': 'archives:MedievalParty2011Party4.swf',
          'party5': 'archives:MedievalParty2011Party5.swf',
          'party6': 'archives:MedievalParty2011Party6.swf',
          'party7': 'archives:MedievalParty2011Party7.swf',
          'party8': 'archives:MedievalParty2011Party8.swf',
          'party9': 'archives:MedievalParty2011Party9.swf',
          'party10': 'archives:MedievalParty2011Party10.swf',
          'party11': 'archives:MedievalParty2011Party11.swf',
          'party12': 'archives:MedievalParty2011Party12.swf',
          'party13': 'archives:MedievalParty2011Party13.swf',
          'party14': 'archives:MedievalParty2011Party14.swf',
          'party15': 'archives:MedievalParty2011Party15.swf',
          'party16': 'archives:MedievalParty2011Party16.swf',
          'party17': 'archives:MedievalParty2011Party17.swf',
          'party18': 'archives:MedievalParty2011Party18.swf',
          'party19': 'archives:MedievalParty2011Party19.swf',
          'party20': 'archives:MedievalParty2011Party20.swf',
          'party21': 'archives:MedievalParty2011Party21.swf',
          'party22': 'archives:MedievalParty2011Party22.swf',
          'party23': 'archives:MedievalParty2011Party23.swf'
        },
        music: {
          'town': 233,
          'plaza': 233,
          'village': 233,
          'beach': 233,
          'rink': 233,
          'shack': 233,
          'dock': 233,
          'beacon': 233,
          'mtn': 233,
          'lounge': 31,
          'coffee': 234,
          'book': 234,
          'dance': 234,
          'light': 234,
          'shop': 234,
          'eco': 234,
          'pizza': 234,
          'forest': 235,
          'forts': 235,
          'lodge': 235,
          'attic': 235,
          'cove': 235,
          'mine': 236,
          'cave': 236,
          'boiler': 236,
          'party1': 235,
          'party2': 266,
          'party3': 266,
          'party4': 266,
          'party5': 266,
          'party6': 266,
          'party7': 266,
          'party8': 266,
          'party9': 266,
          'party10': 266,
          'party11': 266,
          'party12': 266,
          'party13': 265,
          'party14': 286,
          'party15': 286,
          'party16': 287,
          'party17': 288,
          'party18': 265,
          'party19': 310,
          'party20': 310,
          'party21': 309,
          'party22': 308,
          'party23': 41
        },
        worldStamps: [
          {
            name: 'Noble Knight',
            id: 360,
            declarations: [
              {
                event: 'every 2 seconds',
                conditions: [
                  'user hasProperty is_member equals 1',
                  // shield hand items
                  'user wearing 723 or 724 or 725 or 5028 or 5058 or 5097 or 5099 or 5098 or 5100 or 5095'
                ],
                optionalConditions: [
                  // standard knight
                  'user wearing 688 and 794',
                  // golden knight
                  'user wearing 1052 and 4078',
                  // iron knight
                  'user wearing 1146 and 4219',
                  // white knight
                  'user wearing 1253 and 4362'
                ],
              }
            ]
          }
        ]
      }
    },
    stagePlay: {
      name: 'Underwater Adventure',
      costumeTrunk: 'archives:May2011UnderwaterAdventureCostume.swf'
    },
    rooms: {
      stage: 'archives:2011May19Stage.swf'
    },
    stampUpdates: [
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
    date: '2011-05-26',
    temp: {
      party: {
        update: 'The party catalogue is updated',
        localChanges: {
          'catalogues/party.swf': {
            'en': 'archives:MedievalParty2011CatalogParty2.swf'
          },
        },
        music: {
          party: 125
        }
      }
    }
  },
  {
    date: '2011-05-31',
    end: ['party'],
    temp: {
      party2: {
        partyName: 'Battle of Doom',
        rooms: {
          village: 'archives:BattleofDoomVillage.swf',
          agentlobbysolo: 'archives:BattleofDoomAgentlobbysolo.swf',
          agentlobbymulti: 'archives:BattleofDoomAgentlobbymulti.swf',
          party: 'archives:BattleofDoomParty.swf'
        },
        localChanges: {
          'herbert_taunt.swf': {
            en: [ 'archives:ENBattleofDoomHerbertTaunt.swf', 'herbert_taunt' ]
          },
          'herbert_taunt2.swf': {
            en: [ 'archives:ENBattleofDoomHerbertTaunt2.swf', 'herbert_taunt_defeated' ]
          },
          'close_ups/party_op_medals_earned.swf': {
            en: [ 'svanilla:media/play/v2/content/local/en/close_ups/party_op_medals_earned.swf', 'party_op_medals_earned' ]
          }
        }
      }
    },
    roomComment: 'The Stadium returns',
    rooms: {
      town: 'archives:RoomsTown_2.swf',
      rink: 'archives:RoomsRink-May2011.swf',
      forts: 'archives:RoomsForts_2.swf'
    },
    map: 'archives:Map2008-2011Stadium.swf',
    sportCatalog: 'archives:May2011Sport.swf'
  },
  {
    date: '2011-06-03',
    clothingCatalog: 'archives:PenguinStyleJun2011.swf'
  },
  {
    date: '2011-06-06',
    temp: {
      party2: {
        update: 'The Battle of Doom is no longer playable',
        rooms: {
          party: 'archives:BattleofDoomParty2.swf'
        },
        music: {
          party: 0
        }
      }
    }
  },
  {
    date: '2011-06-07',
    end: ['party2']
  },
  {
    date: '2011-06-09',
    temp: {
      const: {
        rooms: {
          'beach': 'archives:RoomsBeach-MusicJam2010Pre.swf',
          'coffee': 'archives:RoomsCoffee-MusicJam2010Pre.swf',
          'cove': 'archives:RoomsCove-MusicJam2010Pre.swf',
          'dock': 'archives:RoomsDock-MusicJam2010Pre.swf',
          'forest': 'archives:RoomsForest-MusicJam2010Pre.swf',
          'berg': 'archives:RoomsBerg-MusicJam2010Pre.swf',
          'village': 'recreation:mjam_11_const/village.swf',
          'forts': 'archives:RoomsForts-MusicJam2010Pre.swf'
        }
      }
    },
    stagePlay: {
      name: 'Secrets of the Bamboo Forest',
      costumeTrunk: 'archives:June2011SecretsOfTheBambooForestCostume.swf'
    },
    rooms: {
      plaza: 'archives:RoomsPlaza-August2011.swf'
    }
  },
  {
    date: '2011-06-10',
    furnitureCatalog: 'archives:Jun2011Furniture.swf'
  },
  {
    date: '2011-06-16',
    temp: {
      party: {
        partyName: 'Music Jam',
        rooms: {
          'town': 'archives:RoomsTown-MusicJam2011.swf',
          'rink': 'archives:MusicJam2011Rink.swf',
          'forts': 'archives:MusicJam2011Forts.swf',
          'village': 'archives:MusicJam2011Village.swf',
          'plaza': 'archives:MusicJam2011Plaza.swf',
          'pizza': 'archives:MusicJam2011Pizza.swf',
          'dance': 'archives:MusicJam2011Dance.swf',
          'mine': 'archives:MusicJam2011Mine.swf',
          'light': 'archives:MusicJam2011Light.swf',
          'beach': 'archives:MusicJam2011Beach.swf',
          'forest': 'archives:MusicJam2011Forest.swf',
          'dock': 'archives:MusicJam2011Dock.swf',
          'lounge': 'archives:MusicJam2011Lounge.swf',
          'coffee': 'archives:MusicJam2011Coffee.swf',
          'cave': 'archives:MusicJam2011Cave.swf',
          'berg': 'archives:MusicJam2011Berg.swf',
          'cove': 'archives:MusicJam2011Cove.swf',
          'party': 'archives:MusicJam2011Party.swf',
          'party2': 'archives:MusicJam2011Party2.swf',
          'party3': 'archives:MusicJam2011Party3.swf',
          'party4': 'archives:MusicJam2011Party4.swf'
        },
        music: {
          'town': 271,
          coffee: 0,
          'plaza': 271,
          'pizza': 271,
          'forts': 271,
          'party3': 271,
          'dance': 242,
          'rink': 240,
          'mine': 247,
          village: 292
        },
        startscreens: [
          'archives:MusicJam2011BillboardMusic_jam2.swf'
        ],
        localChanges: {
          'close_ups/poster.swf': {
            'en': ['archives:MusicJam2011Poster.swf', 'party_poster']
          },
          'catalogues/party.swf': {
            'en': [ 'archives:MusicJam2011CatalogParty.swf', 'party_catalogue' ]
          },
          'catalogues/party2.swf': {
            'en': [ 'archives:MusicJam2011CatalogParty2.swf', 'party2_catalogue' ]
          },
          'catalogues/party3.swf': {
            'en': [ 'archives:MusicJam2011CatalogParty3.swf', 'party3_catalogue' ]
          },
          'membership/party2.swf': {
            'en': [ 'archives:MusicJam2011MembershipParty2.swf', 'oops_party2_room', 'oops_party3_room', 'oops_party4_room' ]
          }
        },
        memberRooms: {
          'party2': true,
          'party3': true,
          'party4': true
        }
      }
    }
  },
  {
    date: '2011-06-24',
    newspaper: 'period-end'
  },
  {
    date: '2011-06-27',
    miscComments: ['The map is revamped'],
    fileChanges: {
      'play/v2/client/shell.swf': 'approximation:shell_modern_label_fix.swf',
      'play/v2/client/rooms_common.swf': 'approximation:rooms_common_label_fix.swf',
      'play/v2/content/global/content/interface.swf': 'archives:ClientInterface20110830.swf',
      'play/v2/client/engine.swf': 'approximation:engine_modern_no_glow.swf'
    },
    globalChanges: {
      'content/map_triggers.json': 'archives:Map_triggers_Beta_team.json'
    },
    map: 'approximation:map_2011_party_note.swf'
  },
  {
    date: '2011-07-05',
    end: ['party']
  },
  {
    date: '2011-07-06',
    clothingCatalog: 'archives:PenguinStyleJul2011.swf',
    newspaper: 'irregular'
  },
  {
    date: '2011-07-14',
    furnitureCatalog: 'archives:Jul2011Furniture.swf',
    newspaper: 'irregular',
    temp: {
      const: {
        rooms: {
          'town': 'archives:RoomsTown-IslandAdventureParty2010Pre.swf',
          'beach': 'archives:IslandAdventureParty2011ConstBeach.swf',
          'plaza': 'archives:IslandAdventureParty2011ConstPlaza.swf',
          'cove': 'archives:IslandAdventureParty2011ConstCove.swf'
        }
      }
    }
  },
  {
    date: '2011-07-21',
    temp: {
      party: {
        partyName: 'Island Adventure Party',
        rooms: {
          'town': 'archives:RoomsTown-IslandAdventureParty2011.swf',
          'plaza': 'archives:IslandAdventureParty2011Plaza.swf',
          'forts': 'archives:IslandAdventureParty2011Forts.swf',
          'forest': 'archives:IslandAdventureParty2011Forest.swf',
          'village': 'archives:IslandAdventureParty2011Village.swf',
          'dock': 'archives:IslandAdventureParty2011Dock.swf',
          'pizza': 'archives:IslandAdventureParty2011Pizza.swf',
          'cove': 'archives:IslandAdventureParty2011Cove.swf',
          'berg': 'archives:IslandAdventureParty2011Berg.swf',
          'beach': 'archives:IslandAdventureParty2011Beach.swf',
          'dance': 'archives:IslandAdventureParty2011Dance.swf',
          'lake': 'archives:IslandAdventureParty2011Lake.swf',
          'shiphold': 'archives:IslandAdventureParty2011Shiphold.swf',
          'party': 'archives:IslandAdventureParty2011Party.swf',
          'party2': 'archives:IslandAdventureParty2011Party2.swf'
        },
        music: {
          'forest': 290,
          'beach': 41,
          'dock': 41,
          'town': 268,
          'dance': 269,
          'party': 267,
          'party2': 289,
          'forts': 291,
          'shiphold': 291,
          'plaza': 291,
          'pizza': 291,
          'cove': 291,
          'lake': 291,
          'village': 291,
          'berg': 291
        },
        migrator: 'archives:Jul2011Pirate.swf',
        mapNote: 'archives:IslandAdventureParty2011Party_map_note.swf',
        localChanges: {
          'close_ups/poster.swf': {
            'en': [ 'archives:IslandAdventureParty2011Party_poster.swf', 'party_poster' ]
          },
          'close_ups/christmasposter.swf': {
            'en': [ 'archives:IslandAdventureParty2011Party_poster2.swf', 'party_poster2' ]
          },
          'close_ups/poster3.swf': {
            'en': [ 'archives:IslandAdventureParty2011Party_poster3.swf', 'party_poster3' ]
          },
          'membership/party1.swf': {
            'en': [ 'archives:IslandAdventureParty2011MembershipParty1.swf', 'oops_party1_catalog' ]
          },
          'membership/party2.swf': {
            'en': [ 'archives:IslandAdventureParty2011MembershipParty2.swf', 'oops_party2_room' ]
          },
          'catalogues/party.swf': {
            'en': ['archives:IslandAdventureParty2011CatalogParty.swf', 'party_catalogue']
          },
          'close_ups/party_note01.swf': {
            'en': 'archives:IslandAdventureParty2011Party_note01.swf'
          },
          'close_ups/party_note02.swf': {
            'en': 'archives:IslandAdventureParty2011Party_note02.swf'
          },
          'close_ups/party_note03.swf': {
            'en': 'archives:IslandAdventureParty2011Party_note03.swf'
          },
          'close_ups/party_note04.swf': {
            'en': 'archives:IslandAdventureParty2011Party_note04.swf'
          },
          'close_ups/party_note05.swf': {
            'en': 'archives:IslandAdventureParty2011Party_note05.swf'
          },
          'close_ups/party_note06.swf': {
            'en': ['archives:IslandAdventureParty2011Party_note06.swf', 'party_note06']
          }
        },
        memberRooms: {
          'party2': true
        },
        startscreens: [
          'archives:LoginIslandAdventureParty2011.swf'
        ]
      }
    },
    stampUpdates: [
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
    date: '2011-07-22',
    newspaper: 'irregular'
  },
  {
    date: '2011-07-28',
    newspaper: 'period-start'
  },
  {
    date: '2011-08-04',
    clothingCatalog: 'archives:PenguinStyleAug2011.swf',
    end: ['party']
  },
  {
    date: '2011-08-11',
    furnitureCatalog: 'archives:Aug-Sept2011Furniture.swf'
  },
  {
    date: '2011-08-17',
    stagePlay: {
      name: 'Team Blue vs. Team Red',
      costumeTrunk: 'archives:Costume2011Aug17.swf'
    },
    rooms: {
      stage: 'archives:Stage2011Aug17.swf',
      plaza: 'archives:RoomsPlaza_2-Play11.swf'
    }
  },
  {
    date: '2011-08-18',
    temp: {
      const: {
        rooms: { 
          village: 
          'archives:TheGreatSnowRaceConstVillage.swf' 
        } 
      }
    },
    stampUpdates: [
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
    date: '2011-08-25',
    temp: {
      party: {
        partyName: 'Great Snow Race',
        rooms: { 
          'town': 'archives:RoomsTown-GreatSnowRace.swf', 
          'plaza': 'archives:TheGreatSnowRacePlaza.swf', 
          'village': 'archives:TheGreatSnowRaceVillage.swf', 
          'party1': 'archives:TheGreatSnowRaceParty1.swf', 
          'party2': 'archives:TheGreatSnowRaceParty2.swf', 
          'party3': 'archives:TheGreatSnowRaceParty3.swf', 
          'party4': 'archives:TheGreatSnowRaceParty4.swf', 
          'party5': 'archives:TheGreatSnowRaceParty5.swf', 
          'party6': 'archives:TheGreatSnowRaceParty6.swf', 
          'party7': 'archives:TheGreatSnowRaceParty7.swf', 
          'party8': 'archives:TheGreatSnowRaceParty8.swf', 
          'party9': 'archives:TheGreatSnowRaceParty9.swf', 
          'party10': 'archives:TheGreatSnowRaceParty10.swf' 
        }, 
        music: { 
          'party2': 294, 
          'party3': 295, 
          'party4': 295, 
          'party5': 295, 
          'party6': 256 
        }, 
        localChanges: { 
          'close_ups/poster.swf': { 
            'en': ['archives:TheGreatSnowRacePoster.swf', 'poster'] 
          }, 
          'catalogues/party.swf': { 
            'en': ['archives:TheGreatSnowRaceCatalogParty.swf', 'party_catalogue'] 
          },
          'close_ups/party_note02.swf': {
            'en': 'recreation:great_snow_race/party_note02.swf'
          },
          'close_ups/party_note03.swf': {
            'en': 'recreation:great_snow_race/party_note03.swf'
          },
          'close_ups/party_note04.swf': {
            'en': 'recreation:great_snow_race/party_note04.swf'
          },
          'close_ups/party_note05.swf': {
            'en': 'recreation:great_snow_race/party_note05.swf'
          }
        },
        mapNote: 'archives:TheGreatSnowRaceParty_map_note.swf',
        newWaddleRooms: [
          {
            waddleId: 104,
            roomId: 855,
            seats: 4,
            game: 'sled'
          }
        ],
        worldStamps: [
          {
            id: 440,
            name: 'Snowboarder',
            declarations: [
              {
                event: 'every 2 seconds',
                conditions: [
                  'user wearing only 3083 or 3084 or 3085',
                  'user isOnFrame 26',
                  'user in 300 or 100 or 200 or 851 or 852 or 853 or 854 or 855 or 856 or 857 or 858 or 859 or 860'
                ]
              }
            ]
          }
        ]
      }
    },
    // placeholder, this is the first instance of the modern sled racing being necessary
    fileChanges: {
      'play/v2/games/sled/SledRacer.swf': 'svanilla:media/play/v2/games/sled/SledRacer.swf'
    },
    stampUpdates: [
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
    date: '2011-08-31',
    end: ['party']
  },
  {
    date: '2011-09-01',
    clothingCatalog: 'archives:PenguinStyleSept2011.swf'
  },
  {
    date: '2011-09-08',
    furnitureCatalog: 'archives:SeptOct2011Furniture.swf'
  },
  {
    date: '2011-09-14',
    stagePlay: {
      name: 'Fairy Fables',
      costumeTrunk: 'archives:Costume14Sept2011.swf'
    },
    rooms: {
      stage: 'archives:Stage14Sept2011.swf',
      plaza: 'archives:RoomsPlaza-Play10.swf'
    }
  },
  {
    date: '2011-09-22',
    fileChanges: {
      'play/v2/games/paddle/paddle.swf': 'slegacy:media/play/v2/games/paddle/paddle.swf'
    },
    migrator: 'archives:Sep2011Pirate.swf',
    temp: {
      party: {
        partyName: 'The Fair',
        rooms: {
          beach: 'archives:TheFair2011Beach.swf',
          beacon: 'archives:TheFair2011Beacon.swf',
          party: 'archives:TheFair2011Party.swf',
          coffee: 'archives:TheFair2011Coffee.swf',
          cove: 'archives:TheFair2011Cove.swf',
          dock: 'archives:TheFair2011Dock.swf',
          forest: 'archives:TheFair2011Forest.swf',
          party2: 'archives:TheFair2011Party2.swf',
          party3: 'archives:TheFair2011Party3.swf',
          berg: 'archives:TheFair2011Berg.swf',
          dance: 'archives:TheFair2011Dance.swf',
          pizza: 'archives:TheFair2011Pizza.swf',
          plaza: 'archives:TheFair2011Plaza.swf',
          mtn: 'archives:TheFair2011Mtn.swf',
          village: 'archives:TheFair2011Village.swf',
          forts: 'archives:TheFair2011Forts.swf',
          rink: 'archives:TheFair2011Rink.swf',
          town: 'archives:RoomsTown-TheFair2011.swf',
        },
        music: {
          town: 297,
          dock: 297,
          village: 297,
          forest: 297,
          party3: 221,
          coffee: 221,
          pizza: 221,
          party: 221,
          beach: 297,
          beacon: 297,
          cove: 297,
          berg: 297,
          dance: 243,
          plaza: 297,
          mtn: 297,
          forts: 297,
          rink: 311
        },
        localChanges: {
          'catalogues/prizebooth.swf': {
            en: 'archives:TheFair2011Prizebooth.swf'
          },
          'catalogues/prizeboothmember.swf': {
            en: 'archives:TheFair2011Prizeboothmember.swf'
          },
          'membership/party2.swf': {
            en: ['archives:TheFair2011MembershipParty2.swf', 'oops_party3_room']
          },
          'close_ups/poster.swf': {
            en: ['archives:Fair2010Poster.swf', 'poster']
          }
        },
        memberRooms: {
          party3: true
        },
        startscreens: [ 'archives:TheFair2011StartBillboards.swf' ],
        fairCpip: {
          iconFileId: 'archives:Ticket_icon-TheFair2010.swf',
          infoFile: 'archives:Tickets-TheFair2009.swf'
        },
        mapNote: 'archives:TheFair2011Party_map_note.swf'
      }
    }
  },
  {
    date: '2011-09-29',
    temp: {
      party: {
        update: 'The prize booths are updated',
        localChanges: {
          'catalogues/prizebooth.swf': {
            en: 'archives:TheFair2011Prizebooth2.swf'
          },
          'catalogues/prizeboothmember.swf': {
            en: 'archives:TheFair2011Prizeboothmember2.swf'
          }
        }
      }
    }
  },
  {
    date: '2011-10-04',
    migrator: false
  },
  {
    date: '2011-10-05',
    end: ['party']
  },
  {
    date: '2011-10-06',
    clothingCatalog: 'archives:PenguinStyleOct2011.swf'
  },
  {
    date: '2011-10-13',
    furnitureCatalog: 'archives:OctNov2011Furniture.swf'
  },
  {
    date: '2011-10-20',
    // when room localization went from being "english" to "en" (approximation)
    fileChanges: {
      'play/v2/client/shell.swf': 'approximation:shell_2011_interface_fix.swf',
      'play/v2/client/rooms_common.swf': 'svanilla:media/play/v2/client/rooms_common.swf'
    },
    rooms: {
      lounge: 'archives:RoomsLounge_4.swf',

      stage: 'archives:Stage2011Oct19.swf',
      plaza: 'recreation:plaza_notls.swf'
    },
    temp: {
      party: {
        partyName: 'Halloween Party',
        rooms: {
          beach: 'archives:HalloweenParty2011Beach.swf',
          beacon: 'archives:HalloweenParty2011Beacon.swf',
          book: 'archives:HalloweenParty2011Book.swf',
          cave: 'archives:HalloweenParty2011Cave.swf',
          coffee: 'archives:HalloweenParty2011Coffee.swf',
          cove: 'archives:HalloweenParty2011Cove.swf',
          lounge: 'archives:HalloweenParty2011Lounge.swf',
          dock: 'archives:HalloweenParty2011Dock.swf',
          dojo: 'archives:HalloweenParty2011Dojo.swf',
          dojoext: 'archives:HalloweenParty2011Dojoext.swf',
          dojofire: 'archives:HalloweenParty2011Dojofire.swf',
          forest: 'archives:HalloweenParty2011Forest.swf',
          shop: 'archives:HalloweenParty2011Shop.swf',
          berg: 'archives:HalloweenParty2011Berg.swf',
          light: 'archives:HalloweenParty2011Light.swf',
          attic: 'archives:HalloweenParty2011Attic.swf',
          shack: 'archives:HalloweenParty2011Shack.swf',
          dance: 'archives:HalloweenParty2011Dance.swf',
          dojohide: 'archives:HalloweenParty2011Dojohide.swf',
          pet: 'archives:HalloweenParty2011Pet.swf',
          pizza: 'archives:HalloweenParty2011Pizza.swf',
          plaza: 'archives:HalloweenParty2011Plaza.swf',
          mtn: 'archives:HalloweenParty2011Mtn.swf',
          lodge: 'archives:HalloweenParty2011Lodge.swf',
          village: 'archives:HalloweenParty2011Village.swf',
          forts: 'archives:HalloweenParty2011Forts.swf',
          rink: 'archives:HalloweenParty2011Rink.swf',
          town: 'archives:RoomsTown-HalloweenParty2011.swf',
          party1: 'archives:HalloweenParty2011Party1.swf',
          party2: 'archives:HalloweenParty2011Party2.swf',
          party3: 'archives:HalloweenParty2011Party3.swf',
          party4: 'archives:HalloweenParty2011Party4.swf',
          party5: 'archives:HalloweenParty2011Party5.swf',
          party6: 'archives:HalloweenParty2011Party6.swf',
          party7: 'archives:HalloweenParty2011Party7.swf'
        },
        localChanges: {
          'close_ups/party_poster.swf': {
            'en': ['archives:HalloweenParty2011Poster.swf', 'party_poster']
          },
          'catalog/party.swf': {
            en: [ 'archives:HalloweenParty2011CatalogParty.swf', 'party_catalogue' ]
          },
          'membership/party3.swf': {
            'en': ['archives:HalloweenParty2011NoticeParty3.swf', 'oops_party3_room']
          }
        },
        memberRooms: {
          party3: true
        },
        globalChanges: {
          'scavenger_hunt/scavenger_hunt.swf': 'archives:CandyGhostScavengerHuntScavenger_hunt.swf',
          'rooms/NOTLS3EN.swf': 'archives:RoomsNOTLS3EN-HalloweenParty2009.swf'
        },
        startscreens: [ 'archives:HalloweenParty2011PreStartBillboards.swf', 'archives:HalloweenParty2011StartBillboards.swf' ],
        scavengerHunt2011: {
          icon: 'archives:CandyGhostScavengerHuntScavenger_hunt_icon.swf',
          global: {
            member: false,
            reward: 9114
          },
          lang: {
            en: {
              loading: 'Loading Scavenger Hunt',
              title: 'CATCH THE CANDY GHOSTS',
              start: '',
              itemsFound: '%num% GHOST CAUGHT',
              itemsFoundPlural: '%num% GHOSTS CAUGHT',
              claim: 'Claim Prize',
              continue: 'Continue',
              clues: [
                'SEARCH NEAR SAND AND SURF.',
                'HEAD TO A SPOOKY HOUSE.',
                'MAKE YOUR WAY TO A WOODEN SHACK.',
                'FIND A POPULAR SPOT FOR TOUR GUIDES.',
                'SEEK OUT A SNOWY SLOPE',
                'WANDER INTO THE WOODS',
                'LOOK TOWARD A TOWER OF LIGHT.',
                'BE ON THE LOOKOUT FOR A BOAT.'
              ]
            }
          }
        },
        music: {
          town: 251,
          coffee: 252,
          book: 252,
          dance: 223,
          lounge: 223,
          shop: 252,
          forts: 251,
          rink: 251,
          plaza: 251,
          pet: 252,
          pizza: 253,
          forest: 251,
          party3: 299,
          party4: 300,
          party7: 300,
          party5: 298,
          party2: 312,
          party1: 251,
          party6: 253,
          cove: 251,
          dock: 251,
          beach: 251,
          light: 252,
          beacon: 251,
          dojoext: 251,
          dojo: 252,
          dojohide: 251,
          berg: 251,
          cave: 252,
          dojofire: 251,
          mtn: 251,
          lodge: 252,
          village: 251,
          attic: 252,
          shack: 251
        }
      }
    },
    stagePlay: {
      name: 'Night of the Living Sled: Live',
      costumeTrunk: 'archives:NLSLCostumeTrunk.swf'
    },
    stampUpdates: [
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
    date: '2011-10-23',
    temp: {
      party2: {
        partyName: '6th Anniversary Party',
        rooms: {
          town: 'archives:RoomsTown-6thAnniversaryParty.swf',
          coffee: 'archives:6thAnniversaryPartyCoffee.swf',
          book: 'archives:6thAnniversaryPartyBook.swf'
        },
        startscreens: [ 'archives:6AnniversaryPStartBillboards.swf' ]
      }
    }
  },
  {
    date: '2011-10-28',
    end: ['party2']
  },
  {
    date: '2011-11-03',
    miscComments: ['Pufflescape is released'],
    map: 'approximation:map_dec_2011.swf',
    globalChanges: {
      'content/map_triggers.json': 'archives:ClientMap_triggers-02142013.json'
    },
    rooms: {
      pet: 'archives:RoomsPet_7.swf'
    },
    clothingCatalog: 'archives:PenguinStyleNov2011.swf',
    end: ['party'],
    stampUpdates: [
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
    date: '2011-11-10',
    furnitureCatalog: 'archives:NovDec2011Furniture.swf'
  },
  {
    date: '2011-11-17',
    temp: {
      const: {
        rooms: {
          plaza: 'archives:Card-JitsuPartyConsPlaza.swf',
          rink: 'archives:Card-JitsuPartyConsRink.swf',
          town: 'archives:RoomsTown-CardJitsuPartyPre.swf'
        },
        startscreens: ['archives:StartBillboardsCardJitsuPartyPre.swf']
      }
    }
  },
  {
    date: '2011-11-23',
    stagePlay: {
      name: 'Battle of the Ancient Shadows',
      costumeTrunk: 'archives:ENCataloguesCostumeNov2011.swf'
    },
    rooms: {
      stage: 'archives:11242011Stage.swf'
    }

  },
  {
    date: '2011-11-24',
    temp: {
      party: {
        partyName: 'Card-Jitsu Party',
        startscreens: [ 'archives:CardJitsuPartyPreStartBillboards.swf', 'archives:BillboardsCard-jitsu-party.swf' ],
        mapNote: 'archives:Card-JitsuPartyParty_map_note.swf',
        rooms: {
          beach: 'archives:Card-JitsuPartyBeach.swf',
          coffee: 'archives:Card-JitsuPartyCoffee.swf',
          cove: 'archives:Card-JitsuPartyCove.swf',
          lounge: 'archives:Card-JitsuPartyLounge.swf',
          dock: 'archives:Card-JitsuPartyDock.swf',
          forest: 'archives:Card-JitsuPartyForest.swf',
          dance: 'archives:Card-JitsuPartyDance.swf',
          party1: 'archives:Card-JitsuPartyParty1.swf',
          pizza: 'archives:Card-JitsuPartyPizza.swf',
          plaza: 'archives:Card-JitsuPartyPlaza.swf',
          forts: 'archives:Card-JitsuPartyForts.swf',
          rink: 'archives:Card-JitsuPartyRink.swf',
          stage: 'archives:11242011Stage.swf',
          town: 'archives:RoomsTown-CardJitsuParty.swf'
        },
        music: {
          rink: 116,
          beach: 313,
          coffee: 314,
          cove: 313,
          lounge: 314,
          dock: 313,
          forest: 313,
          dance: 314,
          party1: 314,
          pizza: 314,
          plaza: 313,
          forts: 313,
          stage: 313,
          town: 313
        },
        localChanges: {
          'prompts/cardjitsu_duringparty.swf': {
            en: 'archives:Card-JitsuPartyCardjitsu_duringparty.swf'
          }
        },
        newWaddleRooms: [
          {
            waddleId: 200,
            roomId: 801,
            seats: 2,
            game: 'card'
          },
          {
            waddleId: 201,
            roomId: 801,
            seats: 2,
            game: 'card'
          },
          {
            waddleId: 202,
            roomId: 801,
            seats: 2,
            game: 'card'
          }
        ]
      }
    }
  },
  {
    date: '2011-12-01',
    clothingCatalog: 'archives:PenguinStyleDec2011.swf'
  },
  {
    date: '2011-12-08',
    end: ['party'],
    roomComment: 'The Ice Rink returns',
    rooms: {
      dock: 'archives:RoomsDock.swf',
      beach: 'archives:RoomsBeach.swf',
      beacon: 'archives:RoomsBeacon3.swf',
      village: 'archives:RoomsVillage_3.swf',
      forest: 'archives:RoomsForest_4.swf',
      cove: 'archives:RoomsCove_2.swf',
      berg: 'archives:RoomsBerg-Dec2011.swf',
      shack: 'archives:RoomsShack-September2010.swf',
      dojoext: 'archives:RoomsDojoext_4.swf',
      dojofire: 'archives:RoomsFireDojo_2.swf',
      dojohide: 'archives:RoomsDojohide_4.swf',

      town: 'archives:RoomsTown_3.swf',
      rink: 'archives:RoomsRink-Dec2011.swf',
      forts: 'archives:RoomsForts_3.swf'
    },
    sportCatalog: 'archives:Dec2011Sport.swf',
    temp: {
      const: {
        rooms: {
          beach: 'archives:HolidayParty2011ConsBeach.swf',
          town: 'archives:RoomsTown-HolidayParty2011Pre.swf'
        }
      }
    }
  },
  {
    date: '2011-12-14',
    temp: {
      party: {
        partyName: 'Holiday Party',
        rooms: {
          party2: 'archives:HolidayParty2011Party2.swf',
          beach: 'archives:HolidayParty2011Beach.swf',
          beacon: 'archives:HolidayParty2011Beacon1.swf',
          book: 'archives:HolidayParty2011Book.swf',
          shipquarters: 'archives:HolidayParty2011ShipQuarters.swf',
          coffee: 'archives:HolidayParty2011Coffee.swf',
          cove: 'archives:HolidayParty2011Cove.swf',
          shipnest: 'archives:HolidayParty2011ShipNest.swf',
          lounge: 'archives:HolidayParty2011Lounge.swf',
          dock: 'archives:HolidayParty2011Dock.swf',
          dojo: 'archives:HolidayParty2011Dojo.swf',
          dojoext: 'archives:HolidayParty2011DojoExt.swf',
          dojofire: 'archives:HolidayParty2011DojoFire.swf',
          forest: 'archives:HolidayParty2011Forest.swf',
          shop: 'archives:HolidayParty2011Shop.swf',
          berg: 'archives:HolidayParty2011Berg.swf',
          light: 'archives:HolidayParty2011Light1.swf',
          attic: 'archives:HolidayParty2011Attic.swf',
          party: 'archives:HolidayParty2011Party.swf',
          shack: 'archives:HolidayParty2011Shack.swf',
          dance: 'archives:HolidayParty2011Dance.swf',
          dojohide: 'archives:HolidayParty2011DojoHide.swf',
          ship: 'archives:HolidayParty2011Ship.swf',
          pizza: 'archives:HolidayParty2011Pizza.swf',
          plaza: 'archives:HolidayParty2011Plaza.swf',
          shiphold: 'archives:HolidayParty2011ShipHold.swf',
          mtn: 'archives:HolidayParty2011Mtn.swf',
          lodge: 'archives:HolidayParty2011Lodge.swf',
          village: 'archives:HolidayParty2011Village.swf',
          forts: 'archives:HolidayParty2011Forts.swf',
          rink: 'archives:HolidayParty2011Rink.swf',
          town: 'archives:RoomsTown-HolidayParty2011.swf'
        },
        startscreens: [ 'archives:HolidayParty2011PreStartBillboards.swf', 'archives:HolidayParty2011StartBillboards.swf' ],
        localChanges: {
          'close_ups/party_poster.swf': {
            en: ['archives:HolidayParty2011MagicSleighRide.swf', 'party_poster']
          },
          'close_ups/party_poster2.swf': {
            en: ['archives:HolidayParty2011Bakery.swf', 'party_poster2']
          },
          'close_ups/donation.swf': {
            en: ['archives:CFC2011Donation.swf', 'coins_for_change']
          },
          'close_ups/advent_note_dec15.swf': {
            en: 'archives:HolidayParty2011AdventNoteDec15.swf'
          },
          'close_ups/advent_note_dec16.swf': {
            en: 'archives:HolidayParty2011AdventNoteDec16.swf'
          },
          'close_ups/advent_note_dec17.swf': {
            en: 'archives:HolidayParty2011AdventNoteDec17.swf'
          },
          'close_ups/advent_note_dec18.swf': {
            en: 'archives:HolidayParty2011AdventNoteDec18.swf'
          },
          'close_ups/advent_note_dec19.swf': {
            en: 'archives:HolidayParty2011AdventNoteDec19.swf'
          },
          'close_ups/advent_note_dec20.swf': {
            en: 'archives:HolidayParty2011AdventNoteDec20.swf'
          },
          'close_ups/advent_note_dec21.swf': {
            en: 'archives:HolidayParty2011AdventNoteDec21.swf'
          },
          'close_ups/advent_note_dec22.swf': {
            en: 'archives:HolidayParty2011AdventNoteDec22.swf'
          },
          'close_ups/advent_note_dec23.swf': {
            en: 'archives:HolidayParty2011AdventNoteDec23.swf'
          },
          'close_ups/advent_note_dec24.swf': {
            en: 'archives:HolidayParty2011AdventNoteDec24.swf'
          },
          'close_ups/advent_note_dec25.swf': {
            en: 'archives:HolidayParty2011AdventNoteDec25.swf'
          },
          'membership/party2.swf': {
            en: ['archives:HolidayParty2011Membership2.swf', 'oops_party2_room']
          }
        },
        mapNote: 'archives:HolidayParty2011Party_map_note.swf',
        music: {
          party2: 315,
          beach: 254,
          beacon: 254,
          book: 227,
          shipquarters: 255,
          coffee: 227,
          cove: 254,
          shipnest: 254,
          lounge: 255,
          dock: 254,
          dojo: 254,
          dojoext: 254,
          dojofire: 254,
          forest: 254,
          shop: 255,
          pet: 255,
          berg: 227,
          attic: 254,
          party: 281,
          shack: 254,
          dance: 255,
          dojohide: 254,
          ship: 254,
          pizza: 255,
          plaza: 254,
          shiphold: 255,
          mtn: 254,
          lodge: 255,
          village: 254,
          forts: 254,
          rink: 254,
          town: 254
        },
        migrator: 'archives:Dec2011Pirate.swf',
      }
    },
    stagePlay: {
      name: 'A Humbug Holiday',
      costumeTrunk: 'archives:ENCataloguesCostumeDec2011.swf'
    },
    rooms: {
      stage: 'archives:12142011Stage.swf',
      plaza: 'archives:RoomsPlaza_2-Play18.swf'
    },
    stampUpdates: [
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
  },
  {
    date: '2011-12-15',
    furnitureCatalog: 'archives:December2011Furniture.swf',
    partyComment: 'A new item of the Advent Calendar is available'
  },
  {
    date: '2011-12-16',
    partyComment: 'A new item of the Advent Calendar is available'
  },
  {
    date: '2011-12-17',
    partyComment: 'A new item of the Advent Calendar is available'
  },
  {
    date: '2011-12-18',
    partyComment: 'A new item of the Advent Calendar is available'
  },
  {
    date: '2011-12-19',
    partyComment: 'A new item of the Advent Calendar is available'
  },
  {
    date: '2011-12-20',
    partyComment: 'A new item of the Advent Calendar is available'
  },
  {
    date: '2011-12-21',
    partyComment: 'A new item of the Advent Calendar is available'
  },
  {
    date: '2011-12-22',
    partyComment: 'A new item of the Advent Calendar is available'
  },
  {
    date: '2011-12-23',
    partyComment: 'A new item of the Advent Calendar is available'
  },
  {
    date: '2011-12-24',
    partyComment: 'A new item of the Advent Calendar is available'
  },
  {
    date: '2011-12-25',
    partyComment: 'A new item of the Advent Calendar is available'
  },
  {
    date: '2011-12-29',
    newspaper: 'period-end',
    end: ['party']
  }
];