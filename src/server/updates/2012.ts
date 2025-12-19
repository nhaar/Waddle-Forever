import { Update } from ".";
import { CategoryID } from "../game-data/stamps";

export const UPDATES_2012: Update[] = [
  {
    date: '2012-01-05',
    end: ['party2'],
    clothingCatalog: 'archives:PenguinStyleJan2012.swf'
  },
  {
    date: '2012-01-19',
    temp: {
      const: {
        rooms: {
          beach: 'archives:UnderwaterExpeditionConstBeach.swf'
        }
      }
    },
    furnitureCatalog: 'archives:JanFeb2012Furniture.swf'
  },
  {
    date: '2012-01-26',
    temp: {
      party: {
        partyName: 'Underwater Expedition',
        rooms: {
          beach: 'archives:UnderwaterExpeditionBeach.swf',
          beacon: 'archives:UnderwaterExpeditionBeacon.swf',
          cove: 'archives:UnderwaterExpeditionCove.swf',
          party7: 'archives:UnderwaterExpeditionParty7.swf',
          dock: 'archives:UnderwaterExpeditionDock.swf',
          dojoext: 'archives:UnderwaterExpeditionDojoExt.swf',
          forest: 'archives:UnderwaterExpeditionForest.swf',
          berg: 'archives:UnderwaterExpeditionBerg.swf',
          light: 'archives:UnderwaterExpeditionLight.swf',
          party1: 'archives:UnderwaterExpeditionParty1.swf',
          party2: 'archives:UnderwaterExpeditionParty2.swf',
          party3: 'archives:UnderwaterExpeditionParty3.swf',
          party4: 'archives:UnderwaterExpeditionParty4.swf',
          party5: 'archives:UnderwaterExpeditionParty5.swf',
          party6: 'archives:UnderwaterExpeditionParty6.swf',
          shack: 'archives:UnderwaterExpeditionShack.swf',
          dojohide: 'archives:UnderwaterExpeditionDojoHide.swf',
          plaza: 'archives:UnderwaterExpeditionPlaza.swf',
          mtn: 'archives:UnderwaterExpeditionMtn.swf',
          village: 'archives:UnderwaterExpeditionVillage.swf',
          forts: 'archives:UnderwaterExpeditionForts.swf',
          rink: 'archives:UnderwaterExpeditionRink.swf',
          town: 'archives:RoomsTown-UnderwaterExpedition.swf'
        },
        music: {
          party1: 317,
          party2: 317,
          party3: 317,
          party4: 317,
          party5: 317,
          party6: 317,
          party7: 316
        },
        startscreens: [
          'archives:UnderwaterExpeditionPreStartBillboards.swf',
          'archives:UnderwaterExpeditionMemberStartBillboards.swf',
          'archives:UnderwaterExpeditionStartBillboards.swf'
        ],
        localChanges: {
          'poster.swf': {
            en: ['archives:UnderwaterExpeditionPoster.swf', 'poster']
          },
          'close_ups/maze_map.swf': {
            en: ['archives:UnderwaterExpeditionMaze_map.swf', 'maze_map']
          },
          'membership/party5.swf': {
            en: ['archives:UnderwaterExpeditionMembership.swf', 'oops_party5_room']
          }
        },
        mapNote: 'archives:UnderwaterExpeditionParty_map_note.swf',
        memberRooms: {
          party5: true
        }
      }
    }
  },
  {
    date: '2012-02-01',
    temp: {
      party2: {
        partyName: 'Fashion Show',
        rooms: {
          'shop': 'archives:FashionShowShop.swf'
        },
        music: {
          'shop': 321
        },
        startscreens: [
          'archives:FashionShowStartBillboards.swf',
          'archives:FashionShowMemberStartBillboards.swf',
          'archives:FashionShowPreStartBillboards.swf'
        ]
      }
    },
    clothingCatalog: 'archives:PenguinStyleFeb2012.swf'
  },
  {
    date: '2012-02-02',
    end: ['party']
  },
  {
    date: '2012-02-14',
    end: ['party2']
  },
  {
    date: '2012-02-16',
    furnitureCatalog: 'archives:FebMarch2012Furniture.swf',
    iglooCatalog: 'archives:February2012Igloo.swf'
  },
  {
    date: '2012-02-24',
    temp: {
      party: {
        partyName: 'Rockhopper\'s Quest',
      }
    }
  },
  {
    date: '2012-03-01',
    clothingCatalog: 'archives:PenguinStyleMar2012.swf'
  },
  {
    date: '2012-03-07',
    end: ['party']
  },
  {
    date: '2012-03-08',
    temp: {
      const: {
        rooms: {
          'beacon': 'archives:PuffleParty2012ConstBeacon.swf',
          'berg': 'archives:PuffleParty2012ConstBerg.swf',
          'cave': 'archives:PuffleParty2012ConstCave.swf',
          'cove': 'archives:PuffleParty2012ConstCove.swf',
          'dance': 'archives:PuffleParty2012ConstDance.swf',
          'forest': 'archives:PuffleParty2012ConstForest.swf',
          'light': 'archives:PuffleParty2012ConstLight.swf',
          'lounge': 'archives:PuffleParty2012ConstLounge.swf',
          'mtn': 'archives:PuffleParty2012ConstMtn.swf'
        },
        startscreens: [
          'archives:PuffleParty2012PreStartBillboards.swf'
        ]
      }
    },
    furnitureCatalog: 'archives:Mar2012Furniture.swf'
  },
  {
    date: '2012-03-15',
    temp: {
      party: {
        partyName: 'Puffle Party',
        rooms: {
          'beach': 'archives:PuffleParty2012Beach.swf',
          'beacon': 'archives:PuffleParty2012Beacon.swf',
          'berg': 'archives:PuffleParty2012Berg.swf',
          'boxdimension': 'archives:PuffleParty2012Box.swf',
          'cave': 'archives:PuffleParty2012Cave.swf',
          'cove': 'archives:PuffleParty2012Cove.swf',
          'dance': 'archives:PuffleParty2012Dance.swf',
          'dock': 'archives:PuffleParty2012Dock.swf',
          'forest': 'archives:PuffleParty2012Forest.swf',
          'forts': 'archives:PuffleParty2012Forts.swf',
          'light': 'archives:PuffleParty2012Light.swf',
          'lodge': 'archives:PuffleParty2012Lodge.swf',
          'lounge': 'archives:PuffleParty2012Lounge.swf',
          'mtn': 'archives:PuffleParty2012Mtn.swf',
          'plaza': 'archives:PuffleParty2012Plaza.swf',
          'shack': 'archives:PuffleParty2012Shack.swf',
          'village': 'archives:PuffleParty2012Village.swf',
          'town': 'archives:RoomsTown-PuffleParty2012.swf',
          'party1': 'archives:PuffleParty2012Party1.swf',
          'party2': 'archives:PuffleParty2012Party2.swf',
          'party3': 'archives:PuffleParty2012Party3.swf',
          'party4': 'archives:PuffleParty2012Party4.swf'
        },
        music: {
          'shack': 208,
          'dance': 260,
          'lounge': 260,
          'light': 31,
          'berg': 213,
          'cave': 36,
          'boxdimension': 264,
          'lodge': 216,
          'town': 261,
          'plaza': 261,
          'forest': 261,
          'forts': 261,
          'beach': 261,
          'beacon': 261,
          'village': 261,
          'mtn': 261,
          'party1': 261,
          'party2': 282,
          'party4': 216
        },
        localChanges: {
          'catalogues/party.swf': {
            'en': 'archives:PuffleParty2012Catalog.swf'
          },
          'membership/party3.swf': {
            'en': ['archives:PuffleParty20121Membership.swf', 'oops_party3_room']
          },
          'membership/party4.swf': {
            'en': ['archives:PuffleParty20122Membership.swf', 'oops_party4_room']
          },
          'close_ups/party_poster.swf': {
            'en': ['archives:PuffleParty2012Poster.swf', 'party_poster']
          }
        },
        mapNote: 'archives:PuffleParty2012Party_map_note.swf',
        fileChanges: {
          'play/v2/client/engine.swf': 'approximation:puffles/engine.swf'
        }
      },
    },
    fileChanges: {
      'play/v2/content/global/content/interface.swf': 'archives:ClientInterface-PuffleParty2012.swf',
      'play/v2/client/shell.swf': 'approximation:shell_2012_halloween.swf'
    },
    stampUpdates: [
      {
        categoryId: CategoryID.Characters,
        stamps: [
          {
            "stamp_id": 448,
            "name": "PH",
            "is_member": 0,
            "rank": 1,
            "description": "Be in the same room as PH",
            "rank_token": "easy"
          }
        ]
      }
    ]
  },
  {
    date: '2012-03-29',
    end: ['party'],
    temp: {
      party2: {
        partyName: 'April Fools\' Party',
        rooms: {
          'town': 'archives:RoomsTown-AprilFoolsParty2012.swf',
          'plaza': 'archives:AprilFools2012Plaza.swf',
          'forts': 'archives:AprilFools2012Forts.swf',
          'boxdimension': 'archives:AprilFools2012Box.swf',
          'party1': 'archives:AprilFools2012Party1.swf',
          'party2': 'archives:AprilFools2012Party2.swf',
          'party3': 'archives:AprilFools2012Party3.swf',
          'party4': 'archives:AprilFools2012Party4.swf',
          'party5': 'archives:AprilFools2012Party5.swf',
          'party6': 'archives:AprilFools2012Party6.swf',
          'party7': 'archives:AprilFools2012Party7.swf',
          'party8': 'archives:AprilFools2012Party8.swf',
          'party9': 'archives:AprilFools2012Party9.swf',
          'party10': 'archives:AprilFools2012Party10.swf',
        },
        music: {
          'town': 232,
          'plaza': 232,
          'forts': 232,
          'boxdimension': 264,
          'party1': 229,
          'party2': 307,
          'party3': 265,
          'party4': 215,
          'party5': 208,
          'party6': 209,
          'party7': 220,
          'party8': 11,
          'party9': 264,
          'party10': 264
        },
        localChanges: {
          'catalogues/party.swf': {
            'en': ['archives:AprilFools2012PartyCatalog.swf', 'party_catalogue']
          },
          'membership/party9.swf': {
            'en': 'archives:AprilFools2012Membership.swf'
          }
        },
        mapNote: 'archives:AprilFools2012Party_map_note.swf',
        startscreens: [
          'archives:AprilFools2012StartBillboards.swf',
        ],
        memberRooms: {
          party9: true,
        }
      }
    }
  },
  {
    date: '2012-04-04',
    end: ['party2']
  },
  {
    date: '2012-04-05',
    temp: {
      party: {
        partyName: 'Easter Egg Hunt',
        decorated: false,
        rooms: {
          'beach': 'archives:EasterEggHunt2012Beach.swf',
          'beacon': 'archives:EasterEggHunt2012Beacon.swf',
          'book': 'archives:EasterEggHunt2012Book.swf',
          'cove': 'archives:EasterEggHunt2012Cove.swf',
          'lake': 'archives:EasterEggHunt2012Lake.swf',
          'shack': 'archives:EasterEggHunt2012Shack.swf',
          'shop': 'archives:EasterEggHunt2012Shop.swf',
          'village': 'archives:EasterEggHunt2012Village.swf'
        },
        globalChanges: {
          'scavenger_hunt/scavenger_hunt.swf': 'archives:EasterEggHunt2012Scavenger_hunt.swf'
        },
        scavengerHunt2011: {
          icon: 'archives:EasterEggHunt2012Scavenger_hunt_icon.swf',
          global: {
            member: false,
            reward: 1388,
          },
          lang: {
            en: {
              loading: 'Loading Scavenger Hunt',
              title: 'Easter Egg Scavenger Hunt',
              start: 'You have found',
              itemsFound: 'You have found %num% eggs',
              itemsFoundPlural: 'You have found %num% eggs',
              claim: 'Claim Prize',
              continue: 'Continue',
              clues: [
                "The first egg's hid near shining gold, Somewhere deep and dark and cold.",
                "The next egg's found near works of art, Plus lots of books to make you smart!",
                "This next egg's near a snowy shore. It's hidden well. You must explore.",
                "Now head towards a wooden shack. You're doing well, you're right on track!",
                "Search now near a tall white chair, For watching waves. The egg is there.",
                "The next one's sure to make you smile. Just like you, this egg's got style.",
                "The next egg's near a chair that lifts. You're getting close, you must be swift!",
                "The last egg's near a big, bright light. You're almost done, the end's in sight."
              ]
            }
          }
        },
      }
    },
    clothingCatalog: 'archives:PenguinStyleApr2012.swf'
  },
  {
    date: '2012-04-11',
    end: ['party']
  },
  {
    date: '2012-04-12',
    temp: {
      const: {
        rooms: {
          'forts': 'archives:EarthDay2012ConsForts.swf'
        },
        startscreens: [
          'archives:EarthDay2012PreStartBillboards.swf'
        ]
      }
    },
    furnitureCatalog: 'archives:Apr2012Furniture.swf',
    iglooCatalog: 'archives:IglooCatalogApr2012EN.swf'
  },
  {
    date: '2012-04-19',
    temp: {
      party: {
        partyName: 'Earth Day',
        rooms: {
          'plaza': 'archives:EarthDay2012Plaza.swf',
          'forts': 'archives:EarthDay2012SnowForts.swf',
          'town': 'archives:RoomsTown-EarthDay2012.swf'
        },
        music: {
          'plaza': 268,
          'forts': 268,
          'town': 268
        },
        localChanges: {
          'catalogues/earth_day_catalog.swf': {
            'en': 'archives:EarthDay2012Catalog.swf'
          }
        },
        mapNote: 'archives:EarthDay2012Party_map_note.swf'
      }
    }
  },
  {
    date: '2012-04-26',
    end: ['party']
  },
  {
    date: '2012-05-03',
    clothingCatalog: 'archives:PenguinStyleMay2012.swf'
  },
  {
    date: '2012-05-10',
    temp: {
      const: {
        rooms: {
          'beach': 'archives:MedievalParty2012ConsBeach.swf',
          'cave': 'archives:MedievalParty2012ConsCave.swf',
          'dock': 'archives:MedievalParty2012ConsDock.swf',
          'forts': 'archives:MedievalParty2012ConsForts.swf',
          'mtn': 'archives:MedievalParty2012ConsMtn.swf',
          'plaza': 'archives:MedievalParty2012ConsPlaza.swf',
          town: 'archives:MedievalParty2012ConsTown.swf'
        },
        startscreens: [
          'archives:MedievalParty2012PreStartBillboards.swf'
        ]
      }
    },
    furnitureCatalog: 'archives:May2012Furniture.swf',
    iglooCatalog: 'archives:May2012Igloo.swf'
  },
  {
    date: '2012-05-17',
    temp: {
      party: {
        partyName: 'Medieval Party',
        rooms: {
          'attic': 'archives:MedievalParty2012attic.swf',
          'beach': 'archives:MedievalParty2012beach.swf',
          'beacon': 'archives:MedievalParty2012beacon.swf',
          'boiler': 'archives:MedievalParty2012boiler.swf',
          'book': 'archives:MedievalParty2012book.swf',
          'cave': 'archives:MedievalParty2012cave.swf',
          'coffee': 'archives:MedievalParty2012coffee.swf',
          'cove': 'archives:MedievalParty2012cove.swf',
          'dance': 'archives:MedievalParty2012dance.swf',
          'dock': 'archives:MedievalParty2012dock.swf',
          'eco': 'archives:MedievalParty2012eco.swf',
          'forest': 'archives:MedievalParty2012forest.swf',
          'forts': 'archives:MedievalParty2012forts.swf',
          'light': 'archives:MedievalParty2012light.swf',
          'lodge': 'archives:MedievalParty2012lodge.swf',
          'lounge': 'archives:MedievalParty2012lounge.swf',
          'mine': 'archives:MedievalParty2012mine.swf',
          'mtn': 'archives:MedievalParty2012mtn.swf',
          'pizza': 'archives:MedievalParty2012pizza.swf',
          'plaza': 'archives:MedievalParty2012plaza.swf',
          'rink': 'archives:MedievalParty2012rink.swf',
          'shack': 'archives:MedievalParty2012shack.swf',
          'shop': 'archives:MedievalParty2012shop.swf',
          'village': 'archives:MedievalParty2012village.swf',
          'town': 'archives:RoomsTown-MedievalParty2012.swf',
          party1: 'archives:MedievalParty2012party1.swf',
          party2: 'MedievalParty2012arty2.swf',
          party3: 'MedievalParty2012Party3.swf',
          party4: 'MedievalParty2012Party4.swf',
          party5: 'MedievalParty2012Party5.swf',
          party6: 'MedievalParty2012Party6.swf',
          party7: 'MedievalParty2012Party7.swf',
          party8: 'MedievalParty2012Party8.swf',
          party9: 'MedievalParty2012Party9.swf',
          party10: 'MedievalParty2012Party10.swf',
          party11: 'MedievalParty2012Party11.swf',
          party12: 'MedievalParty2012Party12.swf',
          party13: 'MedievalParty2012Party13.swf',
          party14: 'MedievalParty2012Party14.swf',
          party15: 'MedievalParty2012Party15.swf',
          party16: 'MedievalParty2012Party16.swf',
          party17: 'MedievalParty2012Party17.swf',
          party18: 'MedievalParty2012Party18.swf',
          party19: 'MedievalParty2012Party19.swf',
          party20: 'MedievalParty2012Party20.swf',
          party21: 'MedievalParty2012Party21.swf',
          party22: 'MedievalParty2012Party22.swf',
          party23: 'MedievalParty2012Party23.swf'
        },
        music: {
          'town': 233,
          'plaza': 233,
          'shack': 233,
          'coffee': 234,
          'book': 234,
          'shop': 234,
          'pizza': 234,
          'village': 295,
          'forest': 235,
          'dock': 235,
          'lodge': 235,
          'attic': 235,
          'cove': 235,
          'beach': 305,
          'light': 305,
          'beacon': 305,
          'mtn': 266,
          party1: 235,
          forts: 236,
          rink: 236,
          cave: 236,
          party2: 266,
          party3: 266,
          party4: 266,
          party5: 266,
          party6: 266,
          party7: 266,
          party8: 266,
          party9: 266,
          party10: 266,
          party11: 266,
          party12: 266,
          party13: 265,
          party14: 286,
          party15: 286,
          party16: 287,
          party17: 288,
          party18: 265,
          party19: 310,
          party20: 310,
          party21: 309,
          party22: 308,
          party23: 41
        },
        startscreens: [
          'archives:MedievalParty2012StartBillboards.swf'
        ],
        localChanges: {
          'close_ups/party_poster.swf': {
            'en': ['archives:MedievalParty2012Quest.swf', 'party_poster']
          },
          'close_ups/party_note1.swf': {
            'en': 'archives:MedievalParty2012Item.swf'
          },
          'close_ups/instructions.swf': {
            'en': ['archives:ENCloseUpsInstructionsScroll.swf', 'instructions_quest']
          },
          'close_ups/instructions2.swf': {
            'en': ['archives:ENCloseUpsInstructionsScroll2.swf', 'instructions_quest']
          },
          'close_ups/party_catalogue.swf': {
            'en': ['archives:MedievalParty2012Catalog.swf', 'party_catalogue']
          },
          'membership/party1.swf': {
            'en': ['archives:MedievalParty2012Member1.swf', 'oops_party2_room']
          },
          'membership/party2.swf': {
            'en': ['archives:MedievalParty2012Member2.swf', 'oops_party26_room']
          }
        },
        mapNote: 'archives:MedievalParty2012Party_map_note.swf',
      }
    }
  },
  {
    date: '2012-05-30',
    end: ['party']
  },
  {
    date: '2012-05-31',
    clothingCatalog: 'archives:PenguinStyleJun2012.swf'
  },
  {
    date: '2012-06-07',
    temp: {
      const: {
        rooms: {
          'dock': 'archives:MarvelSuperheroTakeoverConsDock.swf'
        }
      }
    },
    furnitureCatalog: 'archives:June2012Furniture.swf',
    sportCatalog: 'archives:Jun2012Sport.swf',
    iglooCatalog: 'archives:June2012Igloo.swf'
  },
  {
    date: '2012-06-14',
    temp: {
      party: {
        partyName: 'Marvel Super Hero Takeover',
        rooms: {
          'town': 'archives:RoomsTown-Marvel2012.swf',
          'beach': 'archives:MarvelSuperheroTakeoverBeach.swf',
          'book': 'archives:MarvelSuperheroTakeoverBook.swf',
          'coffee': 'archives:MarvelSuperheroTakeoverCoffee.swf',
          'dock': 'archives:MarvelSuperheroTakeoverDock.swf',
          'forest': 'archives:MarvelSuperheroTakeoverForest.swf',
          'shop': 'archives:MarvelSuperheroTakeoverShop.swf',
          'berg': 'archives:MarvelSuperheroTakeoverBerg.swf',
          'pizza': 'archives:MarvelSuperheroTakeoverPizza.swf',
          'shack': 'archives:MarvelSuperheroTakeoverShack.swf',
          'village': 'archives:MarvelSuperheroTakeoverVillag.swf',
          'plaza': 'archives:MarvelSuperheroTakeoverPlaza.swf',
          'forts': 'archives:MarvelSuperheroTakeoverForts.swf',
          'stage': 'archives:MarvelSuperheroTakeoverStage.swf',
          'party1': 'archives:MarvelSuperheroTakeoverParty1.swf',
          'party2': 'archives:MarvelSuperheroTakeoverParty2.swf',
          'party3': 'archives:MarvelSuperheroTakeoverParty3.swf'
        },
        music: {
          'town': 325,
          'plaza': 325,
          'forts': 325,
          'dock': 325,
          'party1': 326,
          'party2': 330,
          'party3': 325,
          'coffee': 0,
          'book': 0,
          'pizza': 0,
          'stage': 0
        },
        mapNote: 'archives:MarvelSuperheroTakeoverParty_map_note.swf',
        memberRooms: {
          'party1': true 
        },
        localChanges: {
          'membership/party1.swf': {
            'en': ['archives:MarvelSuperheroTakeoverMember1.swf', 'oops_party1_room']
          },
          'catalogues/party.swf': {
            'en': 'archives:MarvelSuperheroTakeoverCatalogParty.swf'
          },
          'catalogues/party2.swf': {
            'en': 'archives:MarvelSuperheroTakeoverCatalogParty2.swf'
          },
          'close_ups/poster.swf': {
            'en': ['archives:MarvelSuperheroTakeoverPoster.swf', 'party_poster']
          },
          'close_ups/splashscreen.swf': {
            en: ['archives:MarvelSuperheroTakeoverCloseupsLogin.swf', 'w.p2013.superhero.loginprompt']
          },
        },
        startscreens: [
          'archives:Billboards-super-hero-2.swf'
        ],
        activeFeatures: '20130424',
        fileChanges: {
          'play/v2/client/engine.swf': 'unknown:marvel/engine.swf',
          'play/v2/content/global/content/party.swf': 'unknown:marvel/party.swf'
        }
      }
    }
  },
  {
    date: '2012-07-04',
    end: ['party']
  },
  {
    date: '2012-07-05',
    clothingCatalog: 'archives:PenguinStyleJul2012.swf'
  },
  {
    date: '2012-07-12',
    temp: {
      const: {
        rooms: {
          'town': 'archives:RoomsTown-UltimateJamPre.swf',
          'mtn': 'archives:UltimateJamConsMtn.swf',
          'plaza': 'archives:UltimateJamConsPlaza.swf',
          'beach': 'archives:UltimateJamConsBeach.swf',
          'shack': 'archives:UltimateJamConsShack.swf',
          'dock': 'archives:UltimateJamConsDock.swf',
          'cove': 'archives:UltimateJamConsCove.swf',
          'coffee': 'archives:UltimateJamConsCoffee.swf',
          'forest': 'archives:UltimateJamConsForest.swf'
        },
        startscreens: [
          'archives:UltimateJamPreBillboard.swf'
        ]
      }
    },
    furnitureCatalog: 'archives:Jul2012Furniture.swf',
    iglooCatalog: 'archives:Jul2012Igloo.swf'
  },
  {
    date: '2012-07-19',
    temp: {
      party: {
        partyName: 'Make Your Mark: Ultimate Jam',
        rooms: {
          'town': 'archives:RoomsTown-UltimateJam.swf',
          'beach': 'archives:UltimateJamBeach.swf',
          'light': 'archives:UltimateJamLight.swf',
          'beacon': 'archives:UltimateJamBeacon.swf',
          'village': 'archives:UltimateJamVillage.swf',
          'lodge': 'archives:UltimateJamLodge.swf',
          'attic': 'archives:UltimateJamAttic.swf',
          'dock': 'archives:UltimateJamDock.swf',
          'coffee': 'archives:UltimateJamCoffee.swf',
          'dance': 'archives:UltimateJamDance.swf',
          'lounge': 'archives:UltimateJamLounge.swf',
          'forts': 'archives:UltimateJamForts.swf',
          'rink': 'archives:UltimateJamRink.swf',
          'plaza': 'archives:UltimateJamPlaza.swf',
          'stage': 'archives:UltimateJamStage.swf',
          'pizza': 'archives:UltimateJamPizza.swf',
          'forest': 'archives:UltimateJamForest.swf',
          'cove': 'archives:UltimateJamCove.swf',
          'berg': 'archives:UltimateJamBerg.swf',
          'shack': 'archives:UltimateJamShack.swf',
          'dojoext': 'archives:UltimateJamDojoExt.swf',
          'dojohide': 'archives:UltimateJamDojoHide.swf',
          'dojofire': 'archives:UltimateJamDojoFire.swf',
          'mtn': 'archives:UltimateJamMtn.swf',
          'party1': 'archives:UltimateJamParty1.swf',
          'party2': 'archives:UltimateJamParty2.swf',
          'party3': 'archives:UltimateJamParty3.swf',
          'party4': 'archives:UltimateJamParty4.swf'
        },
        music: {
          'town': 336,
          'coffee': 0,
          'beacon': 334,
          'village': 292,
          'lodge': 336,
          'attic': 336,
          'dance': 332,
          'lounge': 271,
          'forts': 336,
          'rink': 250,
          'plaza': 336,
          'stage': 321,
          'pizza': 271,
          'forest': 333,
          'cove': 239,
          'berg': 334,
          'shack': 321,
          'mtn': 334,
          'party3': 337,
          'party4': 335
        },
        localChanges: {
          'catalogues/party.swf': {
            'en': ['archives:UltimateJamCatalog.swf', 'w.p0712.musicjam.clothing.catalogue']
          },
          'scavenger_hunt/scavenger_hunt.swf': {
            en: ['archives:UltimateJamScavengerHunt.swf', 'w.party.announcement', 'scavenger_hunt']
          }
        },
        mapNote: 'archives:UltimateJam_Party_map_note.swf',
        partyIconFile: 'archives:UltimateJamScavengerHuntIcon.swf'
      }
    },
    unlockedDay: 1
  },
  {
    date: '2012-07-20',
    unlockedDay: 2,
    partyComment: 'A new music challenge is available'
  },
  {
    date: '2012-07-21',
    unlockedDay: 3,
    partyComment: 'A new music challenge is available'
  },
  {
    date: '2012-07-22',
    unlockedDay: 4,
    partyComment: 'A new music challenge is available'
  },
  {
    date: '2012-07-26',
    iglooCatalog: 'archives:Aug2012Igloo.swf'
  },
  {
    date: '2012-08-01',
    end: ['party']
  },
  {
    date: '2012-08-02',
    clothingCatalog: 'archives:PenguinStyleAug2012.swf'
  },
  {
    date: '2012-08-09',
    furnitureCatalog: 'archives:Aug2012Furniture.swf'
  },
  {
    date: '2012-08-23',
    temp: {
      party: {
        partyName: 'Adventure Party: Temple of Fruit',
        migrator: 'archives:Aug2012Pirate.swf',
        rooms: {
          'town': 'archives:RoomsTown-TempleofFruit.swf',
          'plaza': 'archives:APToFPlaza.swf',
          'forts': 'approximation:temple_of_fruit/forts.swf',
          'beach': 'archives:APToFBeach.swf',
          'forest': 'archives:APToFForest.swf',
          'cove': 'archives:APToFCove.swf',
          'dock': 'archives:APToFDock.swf',
          'pizza': 'archives:APToFPizza.swf',
          'dance': 'archives:APToFDance.swf',
          'shop': 'archives:APToFShop.swf',
          'party1': 'approximation:temple_of_fruit/party1.swf',
          'party2': 'archives:APToFParty2.swf',
          'party3': 'archives:APToFParty3.swf'
        },
        music: {
          'town': 267,
          'plaza': 268,
          'pizza': 268,
          'dock': 267,
          'beach': 267,
          'forest': 267,
          'dance': 267,
          'forts': 267,
          'cove': 267,
          'party1': 269,
          'party2': 268,
          'party3': 268 
        },
        globalChanges: {
          'scavenger_hunt/scavenger_hunt.swf': 'archives:APToFPartyScavengerHunt.swf',
        },
        localChanges: {
          'catalogues/party_catalogue.swf': {
            'en': ['archives:APToFCatalogParty.swf', 'party_catalogue', 'w.p0812.smoothie.clothing.catalogue']
          }
        },
        mapNote: 'archives:APToFParty_note.swf',
        startscreens: [
          'archives:AdventureParty2012PreBillboard.swf'
        ],
        partyIconFile: 'archives:APToFPartyScavengerHuntIcon.swf',
        fileChanges: {
          'play/v2/client/engine.swf': 'recreation:temple_of_fruit/engine.swf'
        }
      }
    }
  },
  {
    date: '2012-08-25',
    temp: {
      party: {
        update: 'The apple is available in the Temple of Fruit'
      }
    }
  },
  {
    date: '2012-08-29',
    temp: {
      party: {
        update: 'The pineapple is available in the Temple of Fruit'
      }
    }
  },
  {
    date: '2012-08-30',
    gameRelease: 'Smoothie Smash',
    map: 'archives:MapAug2012.swf',
    rooms: {
      coffee: 'archives:RoomsCoffee2.swf'
    },
    temp: {
      party: {
        update: 'Rooms around the island update with Smoothie Smash\'s release'
      }
    },
    stampUpdates: [
      {
        category:   {
          "name": "Smoothie Smash",
          "description": "Smoothie Smash",
          "parent_group_id": 8,
          "display": "Games : Smoothie Smash",
          "group_id": 58,
          "stamps": [
            {
              "stamp_id": 453,
              "name": "Beary Berry",
              "is_member": 0,
              "rank": 1,
              "description": "Serve Herbert",
              "rank_token": "easy"
            },
            {
              "stamp_id": 452,
              "name": "Berry Smart",
              "is_member": 0,
              "rank": 1,
              "description": "Serve Aunt Arctic",
              "rank_token": "easy"
            },
            {
              "stamp_id": 457,
              "name": "Deflector",
              "is_member": 0,
              "rank": 2,
              "description": "Take no damage for 2 mins in survival mode",
              "rank_token": "medium"
            },
            {
              "stamp_id": 458,
              "name": "Energizer",
              "is_member": 0,
              "rank": 3,
              "description": "Complete 20 recipes in one game",
              "rank_token": "hard"
            },
            {
              "stamp_id": 456,
              "name": "Fruit Power",
              "is_member": 0,
              "rank": 2,
              "description": "Last 2 minutes in survival mode",
              "rank_token": "medium"
            },
            {
              "stamp_id": 463,
              "name": "Fruit Smasher",
              "is_member": 0,
              "rank": 4,
              "description": "Smash 50 correct fruit in a row",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 455,
              "name": "Fruit Splatter",
              "is_member": 0,
              "rank": 2,
              "description": "Smash 10 correct fruit in a row",
              "rank_token": "medium"
            },
            {
              "stamp_id": 450,
              "name": "Fruit Squeeze",
              "is_member": 0,
              "rank": 1,
              "description": "Complete 5 recipes in one game",
              "rank_token": "easy"
            },
            {
              "stamp_id": 459,
              "name": "Fruit Stomper",
              "is_member": 0,
              "rank": 3,
              "description": "Smash 20 correct fruit in a row",
              "rank_token": "hard"
            },
            {
              "stamp_id": 451,
              "name": "Shipshake",
              "is_member": 0,
              "rank": 1,
              "description": "Serve Rockhopper",
              "rank_token": "easy"
            },
            {
              "stamp_id": 465,
              "name": "Smoothie Hero",
              "is_member": 0,
              "rank": 4,
              "description": "Take no damage for 4 mins in survival mode",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 464,
              "name": "Smoothie Master",
              "is_member": 0,
              "rank": 4,
              "description": "Last 8 minutes in survival mode",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 461,
              "name": "Smoothie Survivor ",
              "is_member": 0,
              "rank": 3,
              "description": "Take no damage for 3 mins in survival mode",
              "rank_token": "hard"
            },
            {
              "stamp_id": 460,
              "name": "Smoothie Warrior",
              "is_member": 0,
              "rank": 3,
              "description": "Last 4 minutes in survival mode",
              "rank_token": "hard"
            },
            {
              "stamp_id": 462,
              "name": "Smoothie Zing",
              "is_member": 0,
              "rank": 4,
              "description": "Complete 30 recipes in one game",
              "rank_token": "extreme"
            },
            {
              "stamp_id": 454,
              "name": "Tasty Treat",
              "is_member": 0,
              "rank": 2,
              "description": "Complete 10 recipes in one game",
              "rank_token": "medium"
            }
          ]
        }
      }
    ]
  },
  {
    date: '2012-09-05',
    end: ['party']
  },
  {
    date: '2012-09-06',
    clothingCatalog: 'archives:PenguinStyleSept2012.swf'
  },
  {
    date: '2012-09-13',
    temp: {
      const: {
        rooms: {
          'beach': 'archives:Fair2012ConstBeach.swf'
        },
        startscreens: [
          'archives:Fair2012Pre-Awareness.swf'
        ]
      }
    },
    furnitureCatalog: 'archives:Sep2012Furniture.swf'
  },
  {
    date: '2012-09-20',
    temp: {
      party: {
        partyName: 'The Fair',
        rooms: {
          'beach': 'archives:Fair2012Beach.swf',
          'beacon': 'archives:Fair2012Beacon.swf',
          'berg': 'archives:Fair2012Berg.swf',
          'cove': 'archives:Fair2012Cove.swf',
          'dance': 'archives:Fair2012Dance.swf',
          'dock': 'archives:Fair2012Dock.swf',
          'forest': 'archives:Fair2012Forest.swf',
          'forts': 'archives:Fair2012Forts.swf',
          'mtn': 'archives:Fair2012Mtn.swf',
          'pizza': 'archives:Fair2012Pizza.swf',
          'plaza': 'archives:Fair2012Plaza.swf',
          'rink': 'archives:Fair2012Rink.swf',
          'village': 'archives:Fair2012Village.swf',
          'town': 'archives:RoomsTown-TheFair2012.swf',
          'party1': 'archives:Fair2012Party1.swf',
          'party2': 'archives:Fair2012Party2.swf',
          'party3': 'archives:Fair2012Party3.swf'
        },
        music: {
          'beach': 297,
          'beacon': 297,
          'berg': 297,
          'cove': 297,
          'dance': 242,
          'dock': 297,
          'forest': 297,
          'forts': 297,
          'mtn': 297,
          'pizza': 221,
          'plaza': 297,
          'rink': 311,
          'village': 297,
          'town': 297,
          'party1': 221,
          'party2': 221,
          'party3': 221
        },
        startscreens: [
          'archives:Fair2012Fair-Now.swf'
        ],
        localChanges: {
          'catalogues/prizebooth.swf': {
            'en': 'archives:Fair2012PrizeboothS1.swf'
          },
          'catalogues/prizeboothmember.swf': {
            'en': 'archives:Fair2012MemberprizeboothS1.swf'
          },
          'close_ups/party_poster.swf': {
            'en': ['archives:TheFair2012Poster.swf', 'poster']
          }
        },
        mapNote: 'archives:TheFair2012Map_Party_note.swf',
        fairCpip: {
          iconFileId: 'archives:Fair2012TicketIcon.swf',
          infoFile: 'archives:Fair2012Tickets.swf'
        },
      }
    }
  },
  {
    date: '2012-09-26',
    temp: {
      party: {
        update: 'The prize booths are updated',
        rooms: {
          'forest': 'archives:Fair2012ForestS2.swf',
          'party2': 'archives:Fair2012Party2S2.swf'
        },
        localChanges: {
          'catalogues/prizebooth.swf': {
            'en': 'archives:Fair2012PrizeboothS2.swf'
          },
          'catalogues/prizeboothmember.swf': {
            'en': 'archives:Fair2012PrizeboothmemberS2.swf'
          }
        }
      }
    }
  },
  {
    date: '2012-10-04',
    end: ['party'],
    clothingCatalog: 'archives:PenguinStyleOct2012.swf'
  },
  {
    date: '2012-10-11',
    temp: {
      const: {
        rooms: {
          'forest': 'archives:HalloweenParty2012PreForest.swf',
          'forts': 'archives:HalloweenParty2012PreForest.swf',
          'plaza': 'archives:HalloweenParty2012PrePlaza.swf',
          'town': 'archives:RoomsTown-HalloweenParty2012Pre.swf'
        },
        localChanges: {
          'close_ups/party_poster.swf': {
            'en': ['archives:HalloweenParty2012PreCloseUpsPoster.swf', 'party_poster']
          }
        },
        startscreens: [
          'archives:HalloweenParty2012Pre-Awareness.swf'
        ]
      }
    },
    furnitureCatalog: 'archives:Oct2012Furniture.swf',
    iglooCatalog: 'archives:ENCataloguesIglooOct2012.swf'
  },
  {
    date: '2012-10-17',
    temp: {
      party: {
        partyName: 'Halloween Party',
        rooms: {
          'attic': 'archives:HalloweenParty2012Attic.swf',
          'beach': 'archives:HalloweenParty2012Beach.swf',
          'beacon': 'archives:HalloweenParty2012Beacon.swf',
          'berg': 'archives:HalloweenParty2012Berg.swf',
          'book': 'archives:HalloweenParty2012Book.swf',
          'cave': 'archives:HalloweenParty2012Cave.swf',
          'coffee': 'archives:HalloweenParty2012Coffee.swf',
          'cove': 'archives:HalloweenParty2012Cove.swf',
          'dance': 'archives:HalloweenParty2012Dance.swf',
          'dock': 'archives:HalloweenParty2012Dock.swf',
          'dojo': 'archives:HalloweenParty2012Dojo.swf',
          'dojoext': 'archives:HalloweenParty2012Dojoext.swf',
          'dojofire': 'archives:HalloweenParty2012Dojofire.swf',
          'dojohide': 'archives:HalloweenParty2012Dojohide.swf',
          'forest': 'archives:HalloweenParty2012Forest.swf',
          'forts': 'archives:HalloweenParty2012Forts.swf',
          'light': 'archives:HalloweenParty2012Lighthouse.swf',
          'lodge': 'archives:HalloweenParty2012Lodge.swf',
          'lounge': 'archives:HalloweenParty2012Lounge.swf',
          'mtn': 'archives:HalloweenParty2012Mtn.swf',
          'pet': 'archives:HalloweenParty2012Pet.swf',
          'pizza': 'archives:HalloweenParty2012Pizza.swf',
          'plaza': 'archives:HalloweenParty2012Plaza.swf',
          'rink': 'archives:HalloweenParty2012Rink.swf',
          'shack': 'archives:HalloweenParty2012Shack.swf',
          'shop': 'archives:HalloweenParty2012Shop.swf',
          'village': 'archives:HalloweenParty2012Village.swf',
          'town': 'archives:RoomsTown-HalloweenParty2012.swf',
          'party1': 'archives:HalloweenParty2012Party1.swf',
          'party2': 'archives:HalloweenParty2012Party2.swf',
          'party3': 'archives:HalloweenParty2012Party3.swf',
          'party4': 'archives:HalloweenParty2012Party4.swf',
          'party5': 'archives:HalloweenParty2012Party5.swf',
          'party6': 'archives:HalloweenParty2012Party6.swf',
          'party7': 'archives:HalloweenParty2012Party7.swf',
          'party8': 'archives:HalloweenParty2012Party8.swf',
          'party9': 'archives:HalloweenParty2012Party9.swf'
        },
        music: {
          'attic': 252,
          'beach': 251,
          'beacon': 251,
          'book': 252,
          'cave': 252,
          'coffee': 252,
          'cove': 251,
          'dance': 223,
          'dock': 251,
          'dojo': 252,
          'dojoext': 251,
          'dojohide': 251,
          'forest': 339,
          'forts': 251,
          'light': 252,
          'lodge': 252,
          'lounge': 223,
          'mtn': 251,
          'pizza': 253,
          'plaza': 251,
          'rink': 251,
          'shack': 251,
          'shop': 252,
          'village': 251,
          'town': 251,
          'party1': 339,
          'party2': 339,
          'party3': 339,
          'party4': 339,
          'party5': 339,
          'party6': 340,
          'party7': 340,
          'party8': 339,
          'party9': 338
        },
        globalChanges: {
          'telescope/telescope.swf': 'archives:Halloween2012TelescopeStormy.swf',
          'binoculars/empty.swf': 'archives:Halloween2012BinocularsStormy.swf',
          'scavenger_hunt/scavenger_hunt.swf': 'archives:HalloweenParty2012ScavengerHunt.swf',
          'scavenger_hunt/scavenger_hunt2.swf': 'archives:HalloweenParty2012ScavengerHunt2.swf'
        },
        localChanges: {
          'telescope/party_telescope.swf': {
            'en': ['archives:Halloween2012TelescopeParty.swf', 'w.p1012.halloween.attic.telescope']
          },
          'catalogues/party.swf': {
            'en': 'archives:Halloween2012PartyCatalog.swf'
          },
          'close_ups/party_note1.swf': {
            'en': 'archives:Halloween2012CloseUpsePartyNote1.swf'
          },
          'close_ups/party_note2.swf': {
            'en': ['archives:Halloween2012CloseUpsePartyNote2.swf', 'w.p1012.halloween.note.goggles']
          },
          'membership/party9.swf': {
            'en': 'archives:ENMembershipPartyHalloween2012.swf'
          }
        },
        fileChanges: {
          'play/v2/client/engine.swf': 'approximation:ghosts/engine.swf',
        },
        partyIconFile: 'archives:HalloweenParty2012ScavengerHuntIcon.swf',
        mapNote: 'archives:Halloween2012Party_map_note.swf'
      }
    },
    fileChanges: {
      'play/v2/content/global/content/interface.swf': 'archives:ClientInterface-HalloweenParty2012.swf',
      'play/v2/content/global/content/party.swf': 'unknown:ghosts/party.swf'
    },
    activeFeatures: '20141002'
  },
  {
    date: '2012-10-20',
    partyComment: 'A new item is available for the Ghost Scavenger Hunt'
  },
  {
    date: '2012-10-23',
    temp: {
      party2: {
        partyName: '7th Anniversary Party',
        rooms: {
          'coffee': 'archives:7thAnniversaryPartyCoffee.swf'
        },
        music: {
          'coffee': 252
        }
      }
    },
    localChanges: {
      'books/year1112.swf': {
        'en': 'archives:BooksYear1112.swf'
      },
      'forms/library.swf': {
        'en': 'archives:LibraryOct2012.swf'
      }
    }
  },
  {
    date: '2012-10-24',
    partyComment: 'A new item is available for the Ghost Scavenger Hunt'
  },
  {
    date: '2012-10-25',
    end: ['party2']
  },
  {
    date: '2012-11-01',
    end: ['party'],
    clothingCatalog: 'archives:PenguinStyleNov2012.swf'
  },
  {
    date: '2012-11-08',
    furnitureCatalog: 'archives:Nov2012Furniture.swf'
  },
  {
    date: '2012-11-14',
    temp: {
      party: {
        partyName: 'Operation: Blackout',
        rooms: {
          beach: 'archives:RoomsBeach-OperationBlackout.swf',
          beacon: 'archives:RoomsBeacon-OperationBlackout.swf',
          book: 'archives:RoomsBook-OperationBlackout.swf',
          coffee: 'archives:RoomsCoffee-OperationBlackout.swf',
          cove: 'archives:RoomsCove-OperationBlackout.swf',
          dock: 'archives:RoomsDock-OperationBlackout.swf',
          dojo: 'archives:RoomsDojo-OperationBlackout.swf',
          dojoext: 'archives:RoomsDojoext-OperationBlackout.swf',
          dojohide: 'archives:RoomsDojohide-OperationBlackout.swf',
          agentcom: 'archives:RoomsAgentcom-OperationBlackout.swf',
          agentlobbymulti: 'archives:RoomsAgentlobbymulti-OperationBlackout.swf',
          dojofire: 'archives:RoomsDojofire-OperationBlackout.swf',
          forest: 'archives:RoomsForest-OperationBlackout.swf',
          shop: 'archives:RoomsShop-OperationBlackout.swf',
          party4: 'archives:BlackoutParty4.swf',
          berg: 'archives:BlackoutBerg.swf',
          light: 'archives:BlackoutLight.swf',
          party2: 'archives:RoomsParty2-OperationBlackout.swf',
          attic: 'archives:BlackoutAttic.swf',
          shack: 'archives:BlackoutShack.swf',
          party1: 'archives:RoomsParty1-OperationBlackout.swf',
          pet: 'archives:BlackoutPet.swf',
          pizza: 'archives:BlackoutPizza.swf',
          plaza: 'archives:BlackoutPlaza.swf',
          party7: 'archives:BlackoutParty7.swf',
          party6: 'archives:BlackoutParty6.swf',
          party3: 'archives:RoomsParty3-OperationBlackout.swf',
          party5: 'archives:BlackoutParty5.swf',
          mtn: 'archives:BlackoutHill.swf',
          lodge: 'archives:BlackoutLodge.swf',
          village: 'archives:BlackoutVillage.swf',
          forts: 'archives:BlackoutForts.swf',
          rink: 'archives:BlackoutRink.swf',
          stage: 'archives:BlackoutStage.swf',
          town: 'archives:RoomsTown-OperationBlackout.swf'
        },
        music: {
          beach: 342,
          beacon: 342,
          cove: 342,
          dock: 342,
          dojoext: 342,
          forest: 342,
          shop: 345,
          party2: 343,
          shack: 342,
          party1: 11,
          plaza: 342,
          party7: 343,
          party6: 343,
          party3: 343,
          party5: 343,
          mtn: 342,
          village: 342,
          forts: 342,
          rink: 342,
          town: 342,
          stage: 0
        },
        startscreens: [
          'archives:SwfEpf-billboard-teaser.swf',
          'archives:OperationBlackout2012Pre-Awareness.swf',
          'archives:SwfEpf-billboard-3-save-island.swf'
        ],
        localChanges: {
          'party/catalogue.swf': {
            en: ['archives:OperationBlackoutCatalogParty.swf', 'party_catalogue']
          },
          'quest_interface.swf': {
            en: ['archives:ENCloseUpsBlackoutQuestInterface.swf', 'w.p1112.blackout.blackoutquestinterface']
          },
          'video/op_blackout_cinematic.f4v': {
            en: ['unknown:op_blackout_cinematic.f4v', 'w.p1112.blackout.cutscene']
          }
        },
        partyIconFile: 'archives:OperationBlackoutGlobalContentPartyicon.swf',
        fileChanges: {
          'play/v2/client/video_player.swf': 'archives:OperationBlackoutClientVideoPlayer.swf'
        },
        clothingCatalog: 'archives:HerbertStyleNov2012.swf'
      }
    },
    stampUpdates: [
      {
        categoryId: CategoryID.Characters,
        stamps: [
          {
            "stamp_id": 466,
            "name": "Herbert",
            "is_member": 0,
            "rank": 4,
            "description": "Be in the same room as Herbert.",
            "rank_token": "extreme"
          }
        ]
      }
    ]
  },
  {
    date: '2012-11-16',
    temp: {
      party: {
        update: 'The second stage of the operation is available'
      }
    }
  },
  {
    date: '2012-11-18',
    temp: {
      party: {
        update: 'The third stage of the operation is available, and the island has more snow'
      }
    }
  },
  {
    date: '2012-11-20',
    temp: {
      party: {
        update: 'The fourth stage of the operation is available'
      }
    }
  },
  {
    date: '2012-11-22',
    temp: {
      party: {
        update: 'The fifth stage of the operation is available, and the island has more snow'
      }
    }
  },
  {
    date: '2012-11-24',
    temp: {
      party: {
        update: 'The sixth stage of the operation is available'
      }
    }
  },
  {
    date: '2012-12-06',
    end: ['party'],
    clothingCatalog: 'archives:PenguinStyleDec2012.swf',
    sportCatalog: 'archives:Dec2012Sport.swf'
  },
  {
    date: '2012-12-13',
    furnitureCatalog: 'archives:ENDec2012Furniture.swf',
    iglooCatalog: 'archives:IglooCatalogDec2012.swf'
  },
  {
    date: '2012-12-20',
    temp: {
      party: {
        partyName: 'Holiday Party',
        rooms: {
          'beach': 'archives:HolidayParty2012Beach.swf',
          'beacon': 'archives:HolidayParty2012Beacon.swf',
          'berg': 'archives:HolidayParty2012Berg.swf',
          'coffee': 'archives:HolidayParty2012Coffee.swf',
          'cove': 'archives:HolidayParty2012Cove.swf',
          'dock': 'archives:HolidayParty2012Dock.swf',
          'dojo': 'archives:HolidayParty2012Dojo.swf',
          'dojoext': 'archives:HolidayParty2012DojoExt.swf',
          'dojofire': 'archives:HolidayParty2012DojoFire.swf',
          'dojohide': 'archives:HolidayParty2012DojoHide.swf',
          'forest': 'archives:HolidayParty2012Forest.swf',
          'forts': 'archives:HolidayParty2012Forts.swf',
          'lodge': 'archives:HolidayParty2012Lodge.swf',
          'mtn': 'archives:HolidayParty2012Mtn.swf',
          'pet': 'archives:HolidayParty2012Pet.swf',
          'pizza': 'archives:HolidayParty2012Pizza.swf',
          'plaza': 'archives:HolidayParty2012Plaza.swf',
          'rink': 'archives:HolidayParty2012Rink.swf',
          'shack': 'archives:HolidayParty2012Shack.swf',
          'shop': 'archives:HolidayParty2012Shop.swf',
          'village': 'archives:HolidayParty2012Village.swf',
          'town': 'archives:RoomsTown-HolidayParty2012.swf',
          'agentlobbymulti': 'archives:HolidayParty2012EPFLobby.swf',
          'agentlobbysolo': 'archives:HolidayParty2012EPFLobbySolo.swf',
          'ship': 'archives:HolidayParty2012Ship.swf',
          'shiphold': 'archives:HolidayParty2012ShipHold.swf',
          'shipnest': 'archives:HolidayParty2012ShipNest.swf',
          'shipquarters': 'archives:HolidayParty2012ShipQuarters.swf',
          'party1': 'archives:HolidayParty2012Party1.swf',
          'party2': 'archives:HolidayParty2012Party2.swf',
          'party3': 'archives:HolidayParty2012Party3.swf'
        },
        music: {
          'beach': 254,
          'beacon': 255,
          'shipquarters': 255,
          'coffee': 255,
          'cove': 254,
          'shipnest': 254,
          'dock': 347,
          'dojo': 255,
          'agentlobbymulti': 255,
          'agentlobbysolo': 255,
          'dojofire': 254,
          'forest': 254,
          'shop': 255,
          'berg': 227,
          'dojohide': 255,
          'ship': 254,
          'pet': 255,
          'pizza': 255,
          'plaza': 254,
          'shiphold': 255,
          'mtn': 254,
          'lodge': 255,
          'forts': 254,
          'village': 254,
          'shack': 254,
          'rink': 254,
          'town': 254,
          'party1': 281,
          'party2': 255,
          'party3': 315
        },
        startscreens: [
          'archives:SwfCfc-billboard.swf',
          'archives:SwfHoliday-puffle-reindeer.swf',
          'archives:SwfOld-holiday-billboard.swf'
        ],
        partyIconFile: 'archives:HolidayParty2012CloseUpsPartyIcon.swf',
        mapNote: 'archives:HolidayParty2012Party_map_note.swf',
        map: 'archives:HolidayParty2012Map.swf',
        localChanges: {
          'catalogues/party_catalogue_1.swf': {
            'en': ['archives:ENHolidayParty2012Catalog1.swf', 'w.p1212.holiday.clothing.catalogue1']
          },
          'catalogues/party_catalogue_2.swf': {
            'en': ['archives:ENHolidayParty2012Catalog2.swf', 'w.p1212.holiday.clothing.catalogue2']
          },
          'close_ups/CFC_poster.swf': {
            'en': 'archives:HolidayParty2012CFC.swf'
          },
          'close_ups/party_poster.swf': {
            'en': ['archives:HolidayParty2012Poster.swf', 'party_poster']
          },
          'close_ups/cookie_bakery_poster.swf': {
            'en': ['archives:HolidayParty2012Party_noteEN.swf', 'w.p1212.holiday.bakery.help']
          },
          'close_ups/buy_cookie_poster.swf': {
            'en': ['archives:HolidayParty2012Cookie_purchaseEN.swf', 'w.p1212.holiday.buycookie']
          },
          'membership/member1.swf': {
            'en': ['archives:HolidayParty2012Member1.swf', 'oops_buy_frostbite_cookie']
          },
          'membership/member2.swf': {
            'en': ['archives:HolidayParty2012Member2.swf', 'oops_party_login_calendar']
          },
          'membership/member3.swf': {
            'en': ['archives:HolidayParty2012Member3.swf', 'oops_party_login_calendar']
          },
          'membership/member4.swf': {
            'en': ['archives:HolidayParty2012Member4.swf', 'oops_party_login_calendar']
          },
          'membership/member5.swf': {
            'en': ['archives:HolidayParty2012Member5.swf', 'oops_party_login_calendar']
          },
          'membership/member6.swf': {
            'en': ['archives:HolidayParty2012Member6.swf', 'oops_party_login_calendar']
          },
          'membership/member7.swf': {
            'en': ['archives:HolidayParty2012Member7.swf', 'oops_party_login_calendar']
          },
          'membership/member8.swf': {
            'en': ['archives:HolidayParty2012Member8.swf', 'oops_buy_reindeer_cookie']
          },
          'cfc.swf': {
            en: ['archives:ENFormsCoinsforChange2012.swf', 'coins_for_change']
          },
          'close_ups/timer.swf': {
            en: ['archives:HolidayParty2012TimerEN.swf', "w.p1212.holiday.avatar.timerPopup"]
          }
        },
        fileChanges: {
          'play/v2/content/global/content/interface.swf': 'archives:ClientInterfaceHolidayParty2012.swf',
          'play/v2/client/engine.swf': 'approximation:holiday_2012/engine.swf'
        },
        coinsForChange: true,
        migrator: 'archives:ENCataloguesPirate-Dec2012.swf'
      }
    }
  },
  {
    date: '2012-12-31',
    end: ['party']
  }
];
