import { Update } from ".";

export const UPDATES_2010: Update[] = [
  {
    date: '2010-01-02',
    clothingCatalog: 'archives:January10Style.swf',
    temp: {
      party: {
        partyStart: 'New Year\'s Fireworks appear on the island',
        partyEnd: 'The New Year\'s celebration ends',
        rooms: {
          mtn: 'archives:2010newyearfireworksskihill.swf',
          berg: 'archives:2010newyearfireworksiceberg.swf'
        }
      }
    }
  },
  {
    date: '2010-01-04',
    end: ['party']
  },
  {
    date: '2010-01-08',
    stagePlay: {
      name: 'Fairy Fables',
      costumeTrunk: 'archives:Jan10Stage.swf'
    },
    rooms: {
      plaza: 'archives:RoomsPlaza-Play10.swf',
      stage: 'archives:RoomsStage-June2009.swf',

      mine: 'archives:RoomsMine-Rockslide1.swf'
    }
  },
  {
    date: '2010-01-15',
    rooms: {
      mine: 'archives:RoomsMine-Rockslide2.swf'
    }
  },
  {
    date: '2010-01-22',
    temp: {
      party: {
        partyStart: 'The Cave Expedition begins',
        partyEnd: 'The Cave Expedition ends and the cave mine is temporarily closed',
        rooms: {
          'mine': 'archives:RoomsMine-CaveExpedition.swf',
          'party1': 'archives:RoomsParty1-CaveExpedition.swf',
          'party2': 'archives:RoomsParty2-CaveExpedition.swf',
          'party3': 'archives:RoomsParty3-CaveExpedition.swf'
        },
        'localChanges': {
          'catalogues/party.swf': {
            'en': 'archives:ENCataloguesParty1-CaveExpedition.swf'
          },
          'close_ups/digposter.swf': {
            'en': 'archives:PlayV2ContentEnClose_upsDigposter.swf'
          },
          'close_ups/digposter2.swf': {
            'en': 'archives:ENCloseUpsDigPoster2-Jan2010.swf'
          },
          'close_ups/treasurepin1.swf': {
            'en': 'archives:ENCloseUpsTreasurePin1.swf'
          },
          'close_ups/treasurepin2.swf': {
            'en': 'archives:ENCloseUpsTreasurePin2.swf'
          },
          'close_ups/treasurepin3.swf': {
            'en': 'archives:ENCloseUpsTreasurePin3.swf'
          },
          'close_ups/treasurepin4.swf': {
            'en': 'archives:ENCloseUpsTreasurePin4.swf'
          }
        }
      }
    }
  },
  {
    date: '2010-01-29',
    iglooList: [
      { display: 'Puffle Party', id: 282, pos: [3, 1] },
      { display: 'Float in the Clouds', id: 277, pos: [4, 2] },
      { display: 'Planet Y', id: 38, pos: [5, 2] },
      { display: 'Orca Straw', id: 245, pos: [6, 1] }
    ],
    end: ['party'],
    roomComment: 'The Dance Club now changes colors if a lot of monochrome penguins are present',
    rooms: {
      mine: 'archives:RoomsMine-PostCaveExpedition.swf',
      dance: 'archives:Dance.swf'
    },
    fileChanges: {
      // permanent dig poster after cave expedition
      'play/v2/content/local/en/close_ups/digposter2.swf': 'slegacy:media/play/v2/content/local/en/close_ups/digposter2.swf' 
    }
  },
  {
    date: '2010-02-05',
    clothingCatalog: 'archives:Feb10Clothing.swf'
  },
  {
    date: '2010-02-11',
    stagePlay: {
      name: 'Secrets of the Bamboo Forest',
      costumeTrunk: 'archives:October2010Costume.swf',
      script: [
        {
          "note": "Secrets of the Bamboo Forest"
        },
        {
          "note": "Act 1"
        },
        {
          "name": "Monkey King:",
          "message": "The treasure is so close! In that palace!"
        },
        {
          "name": "Monkey King:",
          "message": "... where the Phoenix Queen lives!"
        },
        {
          "name": "Funny Pig:",
          "message": "Um...did you say treasure?"
        },
        {
          "name": "Monkey King:",
          "message": "Yes! Do you know how to cross this river?"
        },
        {
          "name": "Funny Pig:",
          "message": "Treasure? Like mud? Anchovies? Chocolate?"
        },
        {
          "name": "Monkey King:",
          "message": "No...well - maybe. How do we cross?"
        },
        {
          "name": "Funny Pig:",
          "message": "There is a magical bridge!"
        },
        {
          "name": "Funny Pig:",
          "message": "First we must find the Golden Feather."
        },
        {
          "name": "Monkey King:",
          "message": "Is it close by?"
        },
        {
          "name": "Funny Pig:",
          "message": "It\'s hidden in a place of light far away."
        },
        {
          "name": "Monkey King:",
          "message": "Lead the way, Funny Pig!"
        },
        {
          "name": "Funny Pig:",
          "message": "Let\'s search the whole Island together."
        },
        {
          "name": "Funny Pig:",
          "message": "Maybe there will be some snacks along the way!"
        },
        {
          "note": "Act 2"
        },
        {
          "name": "Monkey King:",
          "message": "We return with the feather!"
        },
        {
          "name": "Funny Pig:",
          "message": "Hey, that stone just moved!"
        },
        {
          "name": "Funny Pig:",
          "message": "And I found a pizza! Candy topping!"
        },
        {
          "name": "Guardian Dog:",
          "message": "Monkey, this is not your place to be."
        },
        {
          "name": "Monkey King:",
          "message": "But I\'m not a monkey. I\'m the monkey KING!"
        },
        {
          "name": "Guardian Dog:",
          "message": "I\'m the Guardian Dog! I keep the palace pest free."
        },
        {
          "name": "Guardian Dog:",
          "message": "You must prove yourself worthy to enter."
        },
        {
          "name": "Monkey King:",
          "message": "Alright...let\'s see...TURNS TO WIND"
        },
        {
          "name": "Funny Pig:",
          "message": "Ooh! What\'s this strange wind?"
        },
        {
          "name": "Guardian Dog:",
          "message": "Pfft! Don\'t play games monkey! I know your tricks."
        },
        {
          "name": "Monkey King:",
          "message": "But of course. Hey... did you want some snacks?"
        },
        {
          "name": "Guardian Dog:",
          "message": "Snacks? No! The feather is your key."
        },
        {
          "name": "Guardian Dog:",
          "message": "If you found the feather, you may enter."
        },
        {
          "name": "Monkey King:",
          "message": "Thank you, Guardian Dog."
        },
        {
          "name": "Guardian Dog:",
          "message": "Sure thing, Monkey King! Kai-men-da-ji!"
        },
        {
          "note": "Act 3"
        },
        {
          "name": "Phoenix Queen:",
          "message": "Greetings, Monkey! I\'ve been expecting you."
        },
        {
          "name": "Monkey King:",
          "message": "Phoenix Queen! It has been a long journey!"
        },
        {
          "name": "Phoenix Queen:",
          "message": "You are brave and clever!"
        },
        {
          "name": "Phoenix Queen:",
          "message": "I award you this very rare background."
        },
        {
          "name": "Funny Pig:",
          "message": "Wow! Do I get one too?"
        },
        {
          "name": "Phoenix Queen:",
          "message": "Alright. Just be sure not to gobble it."
        },
        {
          "name": "Funny Pig:",
          "message": "Sweet!"
        },
        {
          "name": "Monkey King:",
          "message": "Thank you, Phoenix Queen..."
        },
        {
          "name": "Monkey King:",
          "message": "I have enjoyed my adventure."
        },
        {
          "name": "Phoenix Queen:",
          "message": "Then you shall have more."
        },
        {
          "note": "Director"
        },
        {
          "name": "Director:",
          "message": "Places please!"
        },
        {
          "name": "Director:",
          "message": "And...action!"
        },
        {
          "name": "Director:",
          "message": "To enter the palace you need the Golden Feather."
        },
        {
          "name": "Director:",
          "message": "Let\'s take it from the top!"
        },
        {
          "name": "Director:",
          "message": "Bravo! Fantastic acting!"
        }
      ]
    },
    roomComment: 'The plants disappear from the Box Dimension',
    rooms: {
      plaza: 'archives:RoomsPlaza-August2011.swf',
      stage: 'archives:HalloweenParty2010Stage.swf',
      boxdimension: 'slegacy:media/play/v2/content/global/rooms/boxdimension.swf'
    }
  },
  {
    date: '2010-02-12',
    temp: {
      const: {
        rooms: {
          'beacon': 'archives:RoomsBeacon-PuffleParty2010Const.swf',
          'berg': 'archives:RoomsBerg-PuffleParty2010Const.swf',
          'cave': 'archives:PuffleParty2010ConstCave.swf',
          'dance': 'archives:RoomsDance-PuffleParty2010Const.swf',
          'forest': 'archives:RoomsForest-PuffleParty2010Const.swf',
          'light': 'archives:RoomsLight-PuffleParty2010Const.swf',
          'mine': 'archives:RoomsMine-PuffleParty2010Const.swf'
        }
      }
    }
  },
  {
    date: '2010-02-18',
    temp: {
      party: {
        partyName: 'Puffle Party',
        rooms: {
          'beach': 'archives:RoomsBeach-PuffleParty2010.swf',
          'beacon': 'archives:RoomsBeacon-PuffleParty2010.swf',
          'berg': 'archives:RoomsBerg-PuffleParty2010.swf',
          'boxdimension': 'archives:RoomsBoxdimension-PuffleParty2010.swf',
          'cave': 'archives:RoomsCave-PuffleParty2010.swf',
          'cove': 'archives:RoomsCove-PuffleParty2010.swf',
          'dance': 'archives:RoomsDance-PuffleParty2010.swf',
          'dock': 'archives:RoomsDock-PuffleParty2010.swf',
          'forest': 'archives:RoomsForest-PuffleParty2010.swf',
          'forts': 'archives:RoomsForts-PuffleParty2010.swf',
          'light': 'archives:RoomsLight-PuffleParty2010.swf',
          'lodge': 'archives:RoomsSkiLodgeOrangePuffle.swf',
          'mine': 'archives:RoomsMine-PuffleParty2010.swf',
          'party1': 'archives:RoomsParty1-PuffleParty2010.swf',
          'party2': 'archives:RoomsParty2-PuffleParty2010.swf',
          'pet': 'archives:RoomsPet-PuffleParty2010.swf',
          'town': 'archives:RoomsTown-PuffleParty2010.swf',
          'village': 'archives:RoomsVillage-PuffleParty2010.swf',
          plaza: 'archives:RoomsPlaza-PuffleParty2010.swf'
        },
        music: {
          'beach': 282,
          'beacon': 282,
          'berg': 282,
          'cave': 260,
          'cove': 282,
          'dance': 282,
          'dock': 282,
          'forest': 282,
          'forts': 282,
          'light': 282,
          'mine': 260,
          'pet': 282,
          'plaza': 282,
          'town': 282,
          'village': 282,
          'party1': 261,
          'party2': 261
        },
        startscreens: ['archives:StartscreenPuffle_party1-PuffleParty2010.swf', 'archives:StartscreenPuffle_party2-PuffleParty2010.swf', 'archives:StartscreenPuffle_party3-PuffleParty2010.swf']
      }
    }
  },
  {
    date: '2010-02-25',
    end: ['party'],
    miscComments: ['Orange Puffles are available to adopt'],
    roomComment: 'White Puffles are now in the Pet Shop',
    localChanges: {
      'catalogues/adopt.swf': {
        'en': 'slegacy:media/play/v2/content/local/en/catalogues/adopt.swf'
      },
      'postcards/111.swf': {
        en: 'recreation:postcard_orange_puffle.swf'
      }
    },
    fileChanges: {
      'play/v2/games/roundup/PuffleRoundup.swf': 'recreation:puffle_roundup_orange.swf'
    },
    rooms: {
      pet: 'archives:RoomsPet-Early2011.swf'
    }
  },
  {
    date: '2010-02-26',
    iglooList: [
      { display: 'Jungle Quest', id: 269, pos: [2, 1] },
      { display: 'Flipper Jig', id: 262, pos: [7, 1] },
      { display: 'The Bamboo Forest', id: 43, pos: [3, 2] },
      { display: 'Bonus Level', id: 275, pos: [7, 2] }
    ]
  },
  {
    date: '2010-03-12',
    furnitureCatalog: 'archives:March10Furniture.swf'
  },
  {
    date: '2010-03-15',
    rooms: {
      mine: 'archives:RoomsMine_2.swf'
    }
  },
  {
    date: '2010-03-18',
    temp: {
      party: {
        partyName: 'Penguin Play Awards',
        music: {
          'pizza': 283,
          'plaza': 40,
          'stage': 40,
          'party': 40
        },
        rooms: {
          'dock': 'archives:RoomsDock-PenguinPlayAwards2010.swf',
          'mtn': 'archives:RoomsMtn-PenguinPlayAwards2010.swf',
          'party': 'archives:RoomsParty-PenguinPlayAwards2010.swf',
          'pizza': 'archives:RoomsPizza-PenguinPlayAwards2010.swf',
          'plaza': 'archives:RoomsPlaza-PenguinPlayAwards2010.swf',
          'stage': 'archives:RoomsStage-PenguinPlayAwards2010.swf',
          'town': 'archives:RoomsTown-PenguinPlayAwards2010.swf'
        },
        globalChanges: {
          'content/shorts/fairyFables.swf': 'archives:ContentShortsfairyFables.swf',
          'content/shorts/goldenPuffle.swf': 'archives:ContentShortsgoldenPuffle.swf',
          'content/shorts/ruby.swf': 'archives:ContentShortsRuby.swf',
          'content/shorts/squidzoid.swf': 'archives:ContentShortssquidzoid.swf',
          'content/shorts/underwater.swf': ['archives:ContentShortsunderwater.swf', 'underwaterShort'],
          'content/winners.swf': ['archives:ContentWinnersPPA2010.swf', 'voting_booth']
        },
        localChanges: {
          'catalogues/costume.swf': {
            'en': 'archives:March2010Costume.swf'
          }
        },
        startscreens: ['archives:StartscreenPpa-PenguinPlayAwards2010.swf']
      }
    }
  },
  {
    date: '2010-03-19',
    localChanges: {
      'catalogues/pets.swf': {
        en: 'archives:Mar2010Pets.swf'
      }
    }
  },
  {
    date: '2010-03-26',
    iglooList: [
      { display: 'Puffle Rescue: Ice Flow', id: 119, pos: [1, 1] },
      { display: 'Recycle!', id: 285, pos: [6, 1] },
      { display: 'Anchovy Jazz', id: 283, pos: [4, 2] },
    ]
  },
  {
    date: '2010-03-29',
    end: ['party'],
    stagePlay: {
      name: 'Quest for the Golden Puffle',
      costumeTrunk: 'archives:December2008Costume.swf'
    },
    rooms: {
      plaza: 'recreation:plaza_golden_puffle_no_weather.swf',
      stage: 'archives:RoomsStage-May2010.swf'
    },
    temp: {
      party2: {
        rooms: {
          plaza: 'recreation:aprilfools2010_plaza.swf'
        }
      }
    }
  },
  {
    date: '2010-03-31',
    temp: {
      party2: {
        partyName: 'April Fools\' Party',
        rooms: {
          'dock': 'archives:RoomsDock-AprilFoolsParty2010.swf',
          'forest': 'archives:RoomsForest-AprilFoolsParty2010.swf',
          'shop': 'archives:AprilFoolsParty2010GiftShop.swf',
          'berg': 'archives:RoomsBerg-AprilFoolsParty2010.swf',
          'light': 'archives:AprilFools\'Party2011Light.swf',
          'dance': 'archives:AprilFools\'Party2011Dance.swf',
          'mine': 'archives:RoomsMine-AprilFoolsParty2010.swf',
          'shack': 'archives:RoomsShack-AprilFoolsParty2010.swf',
          'pizza': 'archives:RoomsPizza-AprilFoolsParty2010.swf',
          'lodge': 'archives:RoomsLodge-AprilFoolsParty2010.swf',
          'village': 'archives:RoomsVillage-AprilFoolsParty2010.swf',
          'forts': 'archives:RoomsForts-AprilFoolsParty2010.swf',
          'town': 'archives:RoomsTown-AprilFoolsParty2010.swf',
          'party': 'archives:RoomsParty-AprilFoolsParty2010.swf',
          beach: 'archives:RoomsBeach-AprilFoolsParty2010.swf',
          coffee: 'archives:RoomsCoffeeAprilFools2010.swf',
          cave: 'archives:RoomsCave-AprilFoolsParty2010.swf',
          beacon: 'archives:AprilFools\'Party2011Beacon.swf',
          boiler: 'archives:RoomsBoiler-AprilFoolsParty2010.swf'
        },
        music: {
          'shop': 201,
          'beach': 232,
          'berg': 232,
          'boiler': 201,
          'cave': 201,
          'coffee': 201,
          'cove': 232,
          'dance': 231,
          'dock': 232,
          'forest': 232,
          'forts': 232,
          'light': 201,
          'lodge': 201,
          'mine': 201,
          'plaza': 232,
          'pizza': 201,
          'town': 232,
          'village': 232,
          'party': 261
        },
        memberRooms: {
          party: true
        },
        localChanges: {
          'membership/oops_april_fools.swf': {
            'en': ['archives:AprilFoolsParty2010MembershipOopsAprilFools.swf', 'oops_party_room']
          }
        }
      }
    }
  },
  {
    date: '2010-04-01',
    clothingCatalog: 'archives:April10Style.swf'
  },
  {
    date: '2010-04-05',
    end: ['party2']
  },
  {
    date: '2010-04-15',
    temp: {
      const: {
        rooms: {
          'shack': 'archives:RoomsShack-EarthDay2010Const.swf'
        }
      }
    }
  },
  {
    date: '2010-04-16',
    furnitureCatalog: 'archives:FurnApr2010.swf',
    iglooCatalog: 'archives:April2010Igloo.swf'
  },
  {
    date: '2010-04-21',
    temp: {
      party: {
        partyName: 'Earth Day',
        rooms: {
          'town': 'archives:RoomsTown-EarthDay2010.swf',
          'coffee': 'archives:RoomsCoffeeEarthDay2010.swf',
          'book': 'archives:RoomsBook-EarthDay2010.swf',
          'plaza': 'archives:RoomsPlaza-EarthDay2010.swf',
          'pet': 'archives:RoomsPet-EarthDay2010.swf',
          'mtn': 'archives:RoomsMtn-EarthDay2010.swf',
          'village': 'archives:RoomsVillage-EarthDay2010.swf',
          'forest': 'archives:RoomsForest-EarthDay2010.swf',
          'cove': 'archives:RoomsCove-EarthDay2010.swf',
          'shack': 'archives:RoomsShack-EarthDay2010.swf',
          'dojoext': 'archives:RoomsDojoext-EarthDay2010.swf'
        },
        music: {
          'town': 219,
          'plaza': 219
        },
        globalChanges: {
          'scavenger_hunt/recycle.swf': ['archives:Scavenger_hunt-EarthDay2010.swf', 'easter_egg_hunt', 'recycle_hunt']
        },
        scavengerHunt2010: {
          // file to this one was potentially named recycle_icon.swf, this info will be lost here though
          iconFileId: 'archives:Scavenger_hunt_icon-EarthDay2010.swf',
          iconFilePath: 'scavenger_hunt/recycle_icon.swf'
        },
        startscreens: ['archives:Startscreen-EarthDay2010.swf']
      }
    },
    rooms: {
      forest: 'archives:RoomsForest_2.swf'
    }
  },
  {
    date: '2010-04-27',
    end: ['party'],
    rooms: {
      shack: 'recreation:shack_apr10.swf'
    }
  },
  {
    date: '2010-04-29',
    temp: {
      const: {
        rooms: {
          'beach': 'archives:MedievalParty2011ConstBeach.swf',
          'cave': 'archives:RoomsCave-MedievalParty2010Const.swf',
          'forts': 'archives:RoomsForts-MedievalParty2010Const.swf',
          'plaza': 'archives:RoomsPlaza-MedievalParty2010Const.swf',
          'town': 'archives:RoomsTown-MedievalParty2010Pre.swf',
          'village': 'archives:RoomsVillage-MedievalParty2010Const.swf'
        }
      }
    }
  },
  {
    date: '2010-04-30',
    iglooList: [
      { display: 'Quest for the Golden Puffle', id: 34, pos: [4, 1] },
      { display: 'In the Tower', id: 235, pos: [7, 1] },
      { display: 'Puffle Rescue: In the Cave', id: 120, pos: [6, 2] }
    ]
  },
  {
    date: '2010-05-07',
    clothingCatalog: 'archives:May2010.swf',
    temp: {
      party: {
        partyName: 'Medieval Party',
        rooms: {
          'town': 'archives:RoomsTown-MedievalParty2010.swf',
          'coffee': 'archives:RoomsCoffee-MedievalParty2010.swf',
          'book': 'archives:RoomsBook-MedievalParty2010.swf',
          'dance': 'archives:RoomsDance-MedievalParty2010.swf',
          'lounge': 'archives:RoomsLounge-MedievalParty2010.swf',
          'shop': 'archives:RoomsShop-MedievalParty2010.swf',
          'forts': 'archives:RoomsForts-MedievalParty2010.swf',
          'plaza': 'archives:RoomsPlaza-MedievalParty2010.swf',
          'pet': 'archives:RoomsPet-MedievalParty2010.swf',
          'pizza': 'archives:RoomsPizza-MedievalParty2010.swf',
          'boiler': 'archives:RoomsBoiler-MedievalParty2010.swf',
          'cave': 'archives:RoomsCave-MedievalParty2010.swf',
          'forest': 'archives:RoomsForest-MedievalParty2010.swf',
          'cove': 'archives:RoomsCove-MedievalParty2010.swf',
          'dock': 'archives:MedievalParty2011Dock.swf',
          'beach': 'archives:Rooms0508Beach.swf',
          'light': 'archives:RoomsLight-MedievalParty2010.swf',
          'beacon': 'archives:MedievalParty2011Beacon.swf',
          'village': 'archives:RoomsVillage-MedievalParty2010.swf',
          'lodge': 'archives:Rooms0508Lodge.swf',
          'attic': 'archives:MedievalParty2011Attic.swf',
          'mtn': 'archives:MedievalParty2011Mtn.swf',
          'rink': 'archives:Rooms0508Rink.swf',
          'mine': 'archives:MedievalParty2011Mine.swf',

          // seemingly from 2009, unknown if accurate
          party1: 'archives:Rooms0508Party1.swf',
          party2: 'archives:Rooms0508Party2.swf',
          party3: 'archives:Rooms0508Party3.swf',
          party4: 'archives:Rooms0508Party4.swf',
          party5: 'archives:Rooms0508Party5.swf',
          party6: 'archives:Rooms0508Party6.swf',
          party7: 'archives:Rooms0508Party7.swf',
          party8: 'archives:Rooms0508Party8.swf',
          party9: 'archives:Rooms0508Party9.swf',
          party10: 'archives:Rooms0508Party10.swf',
          party11: 'archives:Rooms0508Party11.swf',
          party12: 'archives:Rooms0508Party12.swf',
          party13: 'archives:Rooms0508Party13.swf',

          // from 2011, missing party 16 which is visibly different from 2011
          party14: 'archives:MedievalParty2011Party14.swf',
          party15: 'archives:MedievalParty2011Party15.swf',
          party16: 'archives:RoomsParty16-MedievalParty2010.swf',
          'party17': 'archives:MedievalParty2011Party17.swf',
          'party18': 'archives:MedievalParty2011Party18.swf',
        },
        music: {
          'beach': 233,
          'beacon': 233,
          'boiler': 233,
          'book': 233,
          'cave': 237,
          'coffee': 233,
          'cove': 235,
          'dance': 233,
          'dock': 233,
          'forest': 235,
          'forts': 236,
          'light': 233,
          'lodge': 233,
          'lounge': 233,
          'mine': 236,
          'mtn': 233,
          'pet': 233,
          'pizza': 233,
          'plaza': 233,
          'rink': 236,
          'shop': 234,
          'town': 233,
          'village': 233,
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
          'party18': 265
        }
      }
    }
  },
  {
    date: '2010-05-14',
    furnitureCatalog: 'archives:May10Furniture.swf'
  },
  {
    date: '2010-05-16',
    end: ['party']
  },
  {
    date: '2010-05-17',
    miscComments: ['Mission 11: The Veggie Villain is added'],
    localChanges: {
      'forms/missions.swf': {
        en: 'slegacy:media/play/v2/content/local/en/forms/missions.swf'
      }
    }
  },
  {
    date: '2010-05-18',
    temp: {
      party: {
        partyName: 'Popcorn Explosion',
        rooms: {
          'agent': 'archives:RoomsAgent-PopcornExplosion.swf',
          'village': 'archives:RoomsVillage-PopcornExplosion.swf',
          'sport': 'archives:RoomsSport-PopcornExplosion.swf'
        }
      }
    }
  },
  {
    date: '2010-05-25',
    temp: {
      party: {
        update: 'Sports Shop closed for reconstruction',
        rooms: {
          'agent': 'archives:RoomsAgent-PopcornExplosion_2.swf',
          'village': 'archives:RoomsVillage-PopcornExplosion_2.swf'
        }
      }
    }
  },
  {
    date: '2010-05-27',
    end: ['party'],
    fileChanges: {
      // engine that has EPF and stuff
      'play/v2/client/engine.swf': 'approximation:engine.swf',
      // interface with EPF phone
      'play/v2/client/interface.swf': 'recreation:interfaces/2010_may.swf'
    },
    localChanges: {
      'forms/moderator.swf': {
        'en': 'slegacy:media/play/v2/content/local/en/forms/moderator.swf'
      }
    },
    roomComment: 'The EPF Command Room is under construction',
    rooms: {
      village: 'archives:RoomsVillage_2.swf',
      agentcom: 'archives:RoomsAgentcom-May2010.swf'
    },
    music: {
      agentcom: 23
    }
  },
  {
    date: '2010-05-28',
    iglooList: [
      { display: 'Knight\'s Challenge', id: 286, pos: [2, 2] },
      { display: 'The Quest', id: 266, pos: [5, 2] },
      { display: 'Jungle Jangles', id: 267, pos: [7, 2] }
    ]
  },
  {
    date: '2010-06-03',
    roomComment: 'Only the VR Room remains under construction',
    rooms: {
      agentcom: 'recreation:agentcom_nofieldops1.swf'
    }
  },
  {
    date: '2010-06-10',
    temp: {
      const: {
        rooms: {
          'beach': 'archives:RoomsBeach-IslandAdventureParty2010Const.swf',
          'cove': 'archives:IslandAdventureParty2011ConstCove.swf',
          'plaza': 'archives:RoomsPlaza-IslandAdventureParty2010Const.swf',
          'town': 'archives:RoomsTown-IslandAdventureParty2010Pre.swf'
        }
      }
    },
    stagePlay: {
      name: 'Ruby and the Ruby',
      costumeTrunk: 'archives:July09Costume.swf'
    },
    roomComment: 'The VR Room\'s construction is finished',
    rooms: {
      plaza: 'recreation:plaza_ruby_no_weather.swf',
      stage: 'recreation:stage_ruby_2010_june.swf',

      agentcom: 'recreation:agentcom_nofieldops2.swf'
    }
  },
  {
    date: '2010-06-15',
    roomComment: ['Field Ops are made available', 'A statue appears at the Mine Shack'],
    rooms: {
      agentcom: 'archives:RoomsAgentcom-June2010_3.swf',
      shack: 'archives:RoomsShack-June2010.swf'
    }
  },
  {
    date: '2010-06-17',
    rooms: {
      // document this forest change
      forest: 'archives:RoomsForest_3.swf'
    }
  },
  {
    date: '2010-06-18',
    temp: {
      party: {
        partyName: 'Island Adventure Party',
        rooms: {
          'town': 'archives:RoomsTown-IslandAdventureParty2010.swf',
          'dance': 'archives:RoomsDance-IslandAdventureParty2010.swf',
          'forts': 'archives:RoomsForts-IslandAdventureParty2010.swf',
          'plaza': 'archives:RoomsPlaza-IslandAdventureParty2010.swf',
          'forest': 'archives:RoomsForest-IslandAdventureParty2010.swf',
          'lake': 'archives:RoomsLake-IslandAdventureParty2010.swf',
          'cove': 'archives:RoomsCove-IslandAdventureParty2010.swf',
          'dock': 'archives:RoomsDock-IslandAdventureParty2010.swf',
          'beach': 'archives:RoomsBeach-IslandAdventureParty2010.swf',
          'village': 'archives:RoomsVillage-IslandAdventureParty2010.swf',
          'berg': 'archives:RoomsBerg-IslandAdventureParty2010.swf',
          'party': 'archives:RoomsParty-IslandAdventureParty2010.swf',
          'party2': 'archives:RoomsParty2-IslandAdventureParty2010.swf'
        },
        music: {
          'beach': 41,
          'cove': 291,
          'dance': 269,
          'dock': 41,
          'forest': 290,
          'forts': 291,
          'plaza': 291,
          'town': 268,
          'village': 291,
          'party': 267,
          'party2': 289
        },
        startscreens: ['archives:StartscreenIsland_adventure-IslandAdventureParty2010.swf', 'archives:StartscreenIsland_adventure_2-IslandAdventureParty2010.swf']
      }
    }
  },
  {
    date: '2010-06-21',
    migrator: 'recreation:pirate_catalog/10_06.swf'
  },
  {
    date: '2010-06-25',
    iglooList: [
      { display: 'The Viking Opera', id: 41, pos: [3, 1] },
      { display: 'Island Adventure', id: 291, pos: [5, 1] },
      { display: 'Ruby and the Ruby', id: 37, pos: [1, 2] }
    ]
  },
  {
    date: '2010-06-28',
    end: ['party']
  },
  {
    date: '2010-07-01',
    migrator: false,
    temp: {
      event: {
        rooms: {
          berg: 'archives:RoomsBerg-MusicJam2010Pre.swf',
          mtn: 'archives:2010newyearfireworksskihill.swf'
        }
      },
      const: {
        rooms: {
          'beach': 'archives:RoomsBeach-MusicJam2010Pre.swf',
          'coffee': 'archives:RoomsCoffee-MusicJam2010Pre.swf',
          'cove': 'archives:RoomsCove-MusicJam2010Pre.swf',
          'dock': 'archives:RoomsDock-MusicJam2010Pre.swf',
          'forest': 'archives:RoomsForest-MusicJam2010Pre.swf',
          'light': 'archives:RoomsLight-MusicJam2010Pre.swf',
          'village': 'archives:RoomsVillage-MusicJam2010Pre.swf',
          'forts': 'archives:RoomsForts-MusicJam2010Pre.swf'
        }
      }
    }
  },
  {
    date: '2010-07-05',
    temp: {
      const: {
        rooms: {
          berg: 'recreation:iceberg_mjamconst_no_fireworks.swf'
        }
      }
    },
    end: ['event']
  },
  {
    date: '2010-07-09',
    temp: {
      party: {
        partyName: 'Music Jam',
        rooms: {
          'party3': 'archives:RoomsParty3-MusicJam2010.swf',
          'beach': 'archives:RoomsBeach-MusicJam2010.swf',
          'party4': 'archives:RoomsParty4-MusicJam2010.swf',
          'cave': 'archives:RoomsCave-MusicJam2010.swf',
          'coffee': 'archives:RoomsCoffee-MusicJam2010.swf',
          'cove': 'archives:RoomsCove-MusicJam2010.swf',
          'lounge': 'archives:RoomsLounge-MusicJam2010.swf',
          'dock': 'archives:RoomsDock-MusicJam2010.swf',
          'forest': 'archives:RoomsForest-MusicJam2010.swf',
          'berg': 'archives:RoomsBerg-MusicJam2010.swf',
          'light': 'archives:RoomsLight-MusicJam2010.swf',
          'mine': 'archives:RoomsMine-MusicJam2010.swf',
          'party': 'archives:RoomsParty-MusicJam2010.swf',
          'dance': 'archives:RoomsDance-MusicJam2010.swf',
          'party2': 'archives:RoomsParty2-MusicJam2010.swf',
          'pizza': 'archives:RoomsPizza-MusicJam2010.swf',
          'plaza': 'archives:RoomsPlaza-MusicJam2010.swf',
          'forts': 'archives:RoomsForts-MusicJam2010.swf',
          'rink': 'archives:RoomsRink-MusicJam2010.swf',
          'village': 'archives:RoomsVillage-MusicJam2010.swf',
          'town': 'archives:RoomsTown-MusicJam2010.swf'
        },
        music: {
          'lounge': 271,
          'berg': 244,
          'mine': 247,
          'dance': 242,
          'pizza': 271,
          'plaza': 271,
          'forts': 271,
          'rink': 240,
          'village': 292,
          'town': 271,
          'party3': 293,
          'coffee': 0
        },
        localChanges: {
          'catalogues/merch.swf': {
            'en': 'archives:MusicJam2010Merch.swf'
          },
          'close_ups/poster.swf': {
            'en': 'archives:MusicJam2010TownPoster.swf'
          },
          'close_ups/music.swf': {
            'en': 'approximation:music_jam_start_instruments.swf'
          }
        },
        startscreens: ['archives:LoginMusicJam2010(1).swf', 'archives:LoginMusicJam2010(2).swf']
      }
    }
  },
  {
    date: '2010-07-14',
    temp: {
      party: {
        update: 'The Penguin Band is taking a break',
        rooms: {
          berg: 'recreation:mjam_10_berg_no_pb.swf'
        }
      }
    }
  },
  {
    date: '2010-07-15',
    temp: {
      party: {
        update: 'New instruments are available in the Catalog',
        localChanges: {
          'catalogues/music.swf': {
            'en': 'archives:MusicJam2010UpdateInstruments.swf'
          }
        }
      }
    }
  },
  {
    date: '2010-07-19',
    end: ['party'],
    rooms: {
      light: 'archives:LightCurrent.swf'
    }
  },
  {
    date: '2010-07-21',
    stagePlay: {
      name: 'Underwater Adventure',
      costumeTrunk: 'archives:May2011UnderwaterAdventureCostume.swf'
    },
    rooms: {
      stage: 'recreation:underwater_adventure_no_pin.swf'
    }
  },
  {
    date: '2010-07-26',
    miscComments: ['Stamps are released'],
    fileChanges: {
      'play/v2/client/interface.swf': 'recreation:interfaces/2010_july.swf'
    }
  },
  {
    date: '2010-07-29',
    rooms: {
      shack: 'archives:RoomsShack-July2010.swf'
    }
  },
  {
    date: '2010-08-05',
    temp: {
      const: {
        rooms: {
          'village': 'archives:RoomsVillage-MtnExpeditionPre.swf'
        }
      }
    }
  },
  {
    date: '2010-08-12',
    temp: {
      party: {
        partyName: 'Mountain Expedition',
        rooms: {
          'party3': 'archives:RoomsParty3-MtnExpedition.swf',
          'party6': 'archives:RoomsParty6-MtnExpedition.swf',
          'party2': 'archives:RoomsParty2-MtnExpedition.swf',
          'party4': 'archives:RoomsParty4-MtnExpedition.swf',
          'plaza': 'archives:RoomsPlaza-MtnExpedition.swf',
          'village': 'archives:RoomsVillage-MtnExpedition.swf',
          'party1': 'archives:RoomsParty1-MtnExpedition.swf',
          'party5': 'archives:RoomsParty5-MtnExpedition.swf',
          'town': 'archives:RoomsTown-MtnExpedition.swf'
        },
        localChanges: {
          'catalogues/merch.swf': {
            'en': 'archives:LocalEnCataloguesMerchAugust2010.swf'
          },
          'close_ups/poster.swf': {
            'en': 'recreation:mountain_expedition_poster.swf'
          },
          'membership/party3.swf': {
            'en': ['archives:MountainExpeditionMembershipOopsExpedition.swf', 'oops_party3_room']
          }
        },
        memberRooms: {
          party3: true
        },
        music: {
          'party2': 294,
          'party3': 295,
          'party4': 295,
          'party6': 256
        },
        startscreens: ['archives:ENMtnExpeditionLogin.swf']
      }
    }
  },
  {
    date: '2010-08-19',
    end: ['party']
  },
  {
    date: '2010-08-20',
    furnitureCatalog: 'archives:FurnitureAug10.swf',
    iglooCatalog: 'archives:August10Igloo.swf',
    iglooList: [
      { display: 'You Rock!', id: 293, pos: [2, 1] },
      { display: 'The Ringmaster', id: 297, pos: [2, 2] },
      { display: 'For Great Justice', id: 32, pos: [7, 2] }
    ]
  },
  {
    date: '2010-08-26',
    miscComments: ['The owned igloos list is added'],
    fileChanges: {
      'play/v2/client/interface.swf': 'unknown:interface_stamps.swf',
      'play/v2/client/igloo.swf': 'slegacy:media/play/v2/client/igloo.swf'
    },
    temp: {
      const: {
        rooms: {
          'beach': 'archives:RoomsBeach-PreFair2010.swf'
        }
      }
    },
    stagePlay: {
      name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
      costumeTrunk: 'archives:March2011SquidzoidVsShadowGuyAndGammaGalCostume.swf'
    },
    rooms: {
      plaza: 'archives:RoomsPlaza-Play3-2.swf',
      stage: 'archives:RoomsStage-October2009.swf',

      // TODO document this shack
      shack: 'archives:RoomsShack-LateAugust2010.swf'
    }
  },
  {
    date: '2010-09-03',
    clothingCatalog: 'archives:September10Style.swf',
    fileChanges: {
      'play/v2/games/paddle/paddle.swf': 'recreation:paddle_no_brown.swf'
    },
    temp: {
      party: {
        partyName: 'The Fair',
        rooms: {
          'town': 'archives:RoomsTown-TheFair2010.swf',
          'coffee': 'archives:RoomsCoffeeTheFair2009.swf',
          'dance': 'archives:RoomsDance-Fair2010.swf',
          'lounge': 'archives:RoomsLounge-Fair2009.swf',
          'forts': 'archives:RoomsForts-Fair2010.swf',
          'plaza': 'archives:RoomsPlaza-Fair2010.swf',
          'forest': 'archives:RoomsForest-Fair2010.swf',
          'cove': 'archives:RoomsCove-Fair2010.swf',
          'berg': 'archives:RoomsBerg-Fair2010.swf',
          'dock': 'archives:RoomsDock-Fair2010.swf',
          'beach': 'archives:RoomsBeach-Fair2010.swf',
          'beacon': 'archives:RoomsBeacon-Fair2010.swf',
          'village': 'archives:RoomsVillage-Fair2010.swf',
          'mtn': 'archives:RoomsMtn-Fair2010.swf',
          'party': 'archives:RoomsParty-Fair2010.swf',
          'party2': 'archives:RoomsParty2-Fair2010.swf',
          'party3': 'archives:RoomsParty3-Fair2010.swf'
        },
        music: {
          'town': 297,
          'coffee': 221,
          'dance': 243,
          'lounge': 243,
          'plaza': 297,
          'village': 297,
          'mtn': 297,
          'forts': 297,
          'dock': 297,
          'beach': 297,
          'beacon': 221,
          'forest': 297,
          'berg': 297,
          'cove': 297,
          'party': 221,
          'party1': 221,
          'party2': 221,
          'party3': 221
        },
        fairCpip: {
          iconFileId: 'archives:Ticket_icon-TheFair2010.swf',
          infoFile: 'archives:Tickets-TheFair2009.swf'
        },
        localChanges: {
          'catalogues/prizebooth.swf': {
            'en': 'archives:TheFair2010PrizeBooth.swf'
          },
          'catalogues/prizeboothmember.swf': {
            'en': 'archives:TheFair2010PrizeBoothMember.swf'
          },
          'close_ups/poster.swf': {
            'en': 'archives:Fair2010Poster.swf'
          }
        },
        startscreens: ['archives:LoginFairParty2010.swf', 'archives:StartscreenFairMember10.swf']
      }
    }
  },
  {
    date: '2010-09-10',
    temp: {
      party: {
        update: 'New items were added to the prize booths',
        localChanges: {
          'catalogues/prizebooth.swf': {
            'en': 'archives:TheFair2010PrizeBooth2.swf'
          },
          'catalogues/prizeboothmember.swf': {
            'en': 'archives:TheFair2010PrizeBoothMember2.swf'
          }
        }
      }
    }
  },
  {
    date: '2010-09-13',
    end: ['party']
  },
  {
    date: '2010-09-16',
    stagePlay: {
      name: 'Fairy Fables',
      costumeTrunk: 'archives:Jan10Stage.swf'
    },
    rooms: {
      plaza: 'archives:RoomsPlaza-Play10.swf',
      stage: 'archives:RoomsStage-June2009.swf'
    }
  },
  {
    date: '2010-09-24',
    furnitureCatalog: 'archives:FurnitureSept10.swf'
  },
  {
    date: '2010-09-30',
    rooms: {
      shack: 'archives:RoomsShack-Early2011.swf'
    }
  },
  {
    date: '2010-10-01',
    clothingCatalog: 'archives:PSOct2010.swf'
  },
  {
    date: '2010-10-08',
    stagePlay: {
      name: 'Secrets of the Bamboo Forest',
      costumeTrunk: 'archives:October2010Costume.swf',
      rooms: {
        shack: 'archives:Mine_Shack_Gold_Feather_Pin.swf'
      },
      script: [
        {
          "note": "Secrets of the Bamboo Forest"
        },
        {
          "note": "Act 1"
        },
        {
          "name": "Monkey King:",
          "message": "The treasure is so close! In that palace!"
        },
        {
          "name": "Monkey King:",
          "message": "... where the Phoenix Queen lives!"
        },
        {
          "name": "Funny Pig:",
          "message": "Um...did you say treasure?"
        },
        {
          "name": "Monkey King:",
          "message": "Yes! Do you know how to cross this river?"
        },
        {
          "name": "Funny Pig:",
          "message": "Treasure? Like mud? Anchovies? Chocolate?"
        },
        {
          "name": "Monkey King:",
          "message": "No...well - maybe. How do we cross?"
        },
        {
          "name": "Funny Pig:",
          "message": "There is a magical bridge!"
        },
        {
          "name": "Funny Pig:",
          "message": "First we must find the Golden Feather."
        },
        {
          "name": "Monkey King:",
          "message": "Is it close by?"
        },
        {
          "name": "Funny Pig:",
          "message": "It\'s hidden far away, in a place where things grow...."
        },
        {
          "name": "Monkey King:",
          "message": "Lead the way, Funny Pig!"
        },
        {
          "name": "Funny Pig:",
          "message": "Let\'s search the whole Island together."
        },
        {
          "name": "Funny Pig:",
          "message": "Maybe there will be some snacks along the way!"
        },
        {
          "note": "Act 2"
        },
        {
          "name": "Monkey King:",
          "message": "We return with the feather!"
        },
        {
          "name": "Funny Pig:",
          "message": "Hey, that stone just moved!"
        },
        {
          "name": "Funny Pig:",
          "message": "And I found a pizza! Candy topping!"
        },
        {
          "name": "Guardian Dog:",
          "message": "Monkey, this is not your place to be."
        },
        {
          "name": "Monkey King:",
          "message": "But I\'m not a monkey. I\'m the monkey KING!"
        },
        {
          "name": "Guardian Dog:",
          "message": "I\'m the Guardian Dog! I keep the palace pest free."
        },
        {
          "name": "Guardian Dog:",
          "message": "You must prove yourself worthy to enter."
        },
        {
          "name": "Monkey King:",
          "message": "Alright...let\'s see...TURNS TO WIND"
        },
        {
          "name": "Funny Pig:",
          "message": "Ooh! What\'s this strange wind?"
        },
        {
          "name": "Guardian Dog:",
          "message": "Pfft! Don\'t play games monkey! I know your tricks."
        },
        {
          "name": "Monkey King:",
          "message": "But of course. Hey... did you want some snacks?"
        },
        {
          "name": "Guardian Dog:",
          "message": "Snacks? No! The feather is your key."
        },
        {
          "name": "Guardian Dog:",
          "message": "If you found the feather, you may enter."
        },
        {
          "name": "Monkey King:",
          "message": "Thank you, Guardian Dog."
        },
        {
          "name": "Guardian Dog:",
          "message": "Sure thing, Monkey King! Kai-men-da-ji!"
        },
        {
          "note": "Act 3"
        },
        {
          "name": "Phoenix Queen:",
          "message": "Greetings, Monkey! I\'ve been expecting you."
        },
        {
          "name": "Monkey King:",
          "message": "Phoenix Queen! It has been a long journey!"
        },
        {
          "name": "Phoenix Queen:",
          "message": "You are brave and clever!"
        },
        {
          "name": "Phoenix Queen:",
          "message": "I award you this very rare background."
        },
        {
          "name": "Funny Pig:",
          "message": "Wow! Do I get one too?"
        },
        {
          "name": "Phoenix Queen:",
          "message": "Alright. Just be sure not to gobble it."
        },
        {
          "name": "Funny Pig:",
          "message": "Sweet!"
        },
        {
          "name": "Monkey King:",
          "message": "Thank you, Phoenix Queen..."
        },
        {
          "name": "Monkey King:",
          "message": "I have enjoyed my adventure."
        },
        {
          "name": "Phoenix Queen:",
          "message": "Then you shall have more."
        },
        {
          "note": "Director"
        },
        {
          "name": "Director:",
          "message": "Places please!"
        },
        {
          "name": "Director:",
          "message": "And...action!"
        },
        {
          "name": "Director:",
          "message": "To enter the palace you need the Golden Feather."
        },
        {
          "name": "Director:",
          "message": "Let\'s take it from the top!"
        },
        {
          "name": "Director:",
          "message": "Bravo! Fantastic acting!"
        }
      ]
    },
    rooms: {
      plaza: 'archives:RoomsPlaza-August2011.swf',
      stage: 'archives:HalloweenParty2010Stage.swf'
    }
  },
  {
    date: '2010-10-15',
    furnitureCatalog: 'archives:October10Furniture.swf'
  },
  {
    date: '2010-10-21',
    miscComments: ['A storm is approaching and visible from the Cove'],
    temp: {
      event: {
        fileChanges: {
          'play/v2/content/global/binoculars/empty.swf': 'archives:Storm_on_horizon.swf'
        }
      }
    }
  },
  {
    date: '2010-10-23',
    localChanges: {
      'forms/library.swf': {
        en: 'archives:ENFormsLibrary-2010.swf'
      }
    },
    temp: {
      party: {
        partyName: '5th Anniversary Party',
        rooms: {
          'book': 'archives:5thAnniversaryPartyBook.swf',
          'coffee': 'archives:5thAnniversaryPartyCoffee.swf',
          'town': 'archives:RoomsTown-5thAnniversaryParty.swf'
        },
        music: {
          'town': 218,
          'coffee': 218,
          'book': 218
        }
      }
    },
    roomComment: 'The Book Room now contains Penguin Art',
    rooms: {
      book: 'archives:BookWithPenguinArt.swf'
    }
  },
  {
    date: '2010-10-25',
    end: ['party']
  },
  {
    date: '2010-10-28',
    temp: {
      party: {
        partyName: 'Halloween Party',
        rooms: {
          'beach': 'archives:HalloweenParty2010Beach.swf',
          'light': 'archives:HalloweenParty2010Lighthouse.swf',
          'beacon': 'archives:HalloweenParty2010Beacon.swf',
          'berg': 'archives:HalloweenParty2010Berg.swf',
          'book': 'archives:HalloweenParty2010Book.swf',
          'cave': 'archives:HalloweenParty2010Cave.swf',
          'forts': 'archives:HalloweenParty2010SnowForts.swf',
          'rink': 'archives:HalloweenParty2010Stadium.swf',
          'village': 'archives:HalloweenParty2010SkiVIllage.swf',
          'mtn': 'archives:HalloweenParty2010SkiHill.swf',
          'lodge': 'archives:HalloweenParty2010Lodge.swf',
          'attic': 'archives:HalloweenParty2010Attic.swf',
          'cove': 'archives:HalloweenParty2010Cove.swf',
          'party4': 'archives:HalloweenParty2010Party4.swf',
          'party3': 'archives:HalloweenParty2010Party3.swf',
          'dock': 'archives:HalloweenParty2010Dock.swf',
          'dojo': 'archives:HalloweenParty2010Dojo.swf',
          'dojoext': 'archives:HalloweenParty2010DojoExt.swf',
          'dojofire': 'archives:HalloweenParty2010DojoFire.swf',
          'plaza': 'archives:HalloweenParty2010Plaza.swf',
          'pet': 'archives:HalloweenParty2010PetShop.swf',
          'pizza': 'archives:HalloweenParty2010PizzaParlor.swf',
          'shack': 'archives:HalloweenParty2010Shack.swf',
          'forest': 'archives:HalloweenParty2010Forest.swf',
          'party2': 'archives:HalloweenParty2010Party2.swf',
          'party1': 'archives:HalloweenParty2010Party1.swf',
          'party5': 'archives:HalloweenParty2010Party5.swf',
          'town': 'archives:RoomsTown-HalloweenParty2010.swf',
          'dance': 'archives:HalloweenParty2010Dance.swf',
          'lounge': 'archives:HalloweenParty2010Lounge.swf',
          'shop': 'archives:HalloweenParty2010GiftShop.swf',
          'dojohide': 'archives:HalloweenParty2010DojoHide.swf',
          coffee: 'archives:HalloweenParty2010Coffee.swf'
        },
        map: 'archives:HalloweenParty2010Map.swf',
        globalChanges: {
          'scavenger_hunt/hunt_ui.swf': ['recreation:halloween_hunt_2010.swf', 'hunt_ui', 'halloween_hunt'],
          'binoculars/empty.swf': 'archives:ContentBinoculars-HalloweenParty2007.swf', // from 2007 party
          'igloo/assets/igloo_background.swf': 'archives:Igloo_background_nightstorm.swf', // from 2011 party
          'rooms/NOTLS3EN.swf': 'unknown:NOTLS3EN',
          'telescope/empty.swf': 'unknown:halloween_telescope.swf'
        },
        localChanges: {
          'catalogues/party.swf': {
            'en': 'archives:CataloguesENParty-HalloweenParty2010.swf'
          },
          'close_ups/halloweenposter.swf': {
            'en': 'archives:HalloweenParty2010Poster.swf'
          },
          'membership/party3.swf': {
            'en': ['archives:HalloweenParty2010MembershipParty3.swf', 'oops_party3_room']
          }
        },
        memberRooms: {
          party3: true
        },
        music: {
          'town': 251,
          'coffee': 252,
          'book': 252,
          'dance': 223,
          'lounge': 223,
          'shop': 252,
          'plaza': 251,
          'pet': 252,
          'pizza': 253,
          'village': 251,
          'lodge': 252,
          'attic': 252,
          'mtn': 251,
          'forts': 251,
          'rink': 251,
          'dock': 251,
          'beach': 251,
          'light': 252,
          'beacon': 251,
          'forest': 251,
          'berg': 251,
          'cove': 251,
          'cave': 252,
          'shack': 251,
          'dojo': 252,
          'dojoext': 251,
          'dojohide': 252,
          'party1': 251,
          'party2': 253,
          'party3': 299,
          'party4': 300,
          'party5': 298
        },
        scavengerHunt2010: {
          iconFileId: 'approximation:halloween_hunt_icon.swf'
        },
        startscreens: ['archives:Halloween2010LoginScreen1.swf', 'archives:Halloween2010LoginScreen2.swf', 'archives:Halloween2010LoginScreen3.swf']
      }
    },
    end: ['event']
  },
  {
    date: '2010-11-04',
    end: ['party'],
    temp: {
      party2: {
        partyStart: 'The storm remains in the island, making it cloudy',
        partyEnd: 'The storm ends',
        rooms: {
          beach: 'archives:StormBeach.swf',
          beacon: 'archives:StormBeacon.swf',
          cove: 'archives:StormCove.swf',
          dock: 'archives:StormDock.swf',
          dojoext: 'archives:StormDojoext.swf',
          dojofire: 'archives:StormDojoFire.swf',
          forest: 'archives:StormForest.swf',
          berg: 'archives:StormBerg.swf',
          shack: 'archives:StormShack.swf',
          dojohide: 'archives:StormDojohide.swf',
          plaza: 'archives:StormPlaza.swf',
          mtn: 'archives:StormMtn.swf',
          village: 'archives:StormVillage.swf',
          forts: 'archives:StormForts.swf',
          rink: 'archives:StormRink.swf',
          town: 'archives:RoomsTown-Storm2010Pre.swf',
          pet: 'recreation:storm_2010_pet.swf',
          pizza: 'recreation:storm_2010_pizza.swf'
        },
        globalChanges: {
          'igloo/assets/igloo_background.swf': 'archives:StormIglooBackground.swf',
          'binoculars/empty.swf': 'archives:StormBinoculars.swf',
          'telescope/empty.swf': 'archives:StormTelescope.swf'
        }
      }
    }
  },
  {
    date: '2010-11-05',
    clothingCatalog: 'archives:November10Style.swf'
  },
  {
    date: '2010-11-11',
    newspaper: 'period-end',
    iglooList: [
      { display: 'Planet Y', id: 38, pos: [3, 1] },
      { display: 'Norman Swarm', id: 42, pos: [1, 2] },
      { display: 'Master the Elements', id: 301, pos: [4, 2] },
      { display: 'The Way of Sensei', id: 24, pos: [5, 2] }
    ],
    temp: {
      party2: {
        update: 'Rain starts around the island',
        rooms: {
          beach: 'archives:RainBeach.swf',
          beacon: 'archives:RainBeacon.swf',
          coffee: 'archives:RainCoffee.swf',
          cove: 'archives:RainCove.swf',
          dock: 'archives:RainDock.swf',
          dojo: 'archives:RainDojo.swf',
          agentlobbysolo: 'archives:RainAgentlobbysolo.swf',
          agentlobbymulti: 'archives:RainAgentlobbymulti.swf',
          dojofire: 'archives:RainDojofire.swf',
          forest: 'archives:RainForest.swf',
          shop: 'archives:RainShop.swf',
          dojoext: 'archives:RainDojoext.swf',
          berg: 'archives:RainBerg.swf',
          light: 'archives:RainLight.swf',
          dojohide: 'archives:RainDojohide.swf',
          shack: 'archives:RainShack.swf',
          pet: 'archives:RainPet.swf',
          pizza: 'archives:RainPizza.swf',
          plaza: 'archives:RainPlaza.swf',
          mtn: 'archives:RainMtn.swf',
          lodge: 'archives:RainLodge.swf',
          village: 'archives:RainVillage.swf',
          forts: 'archives:RainForts.swf',
          rink: 'archives:RainRink.swf',
          town: 'archives:RoomsTown-Storm2010.swf'
        },
        globalChanges: {
          'binoculars/empty.swf': 'archives:RainBinoculars.swf',
          'telescope/empty.swf': 'archives:RainTelescope.swf'
        }
      }
    }
  },
  {
    date: '2010-11-12',
    furnitureCatalog: 'archives:FurnNov2010.swf',
    iglooCatalog: 'archives:November2010Igloo.swf'
  },
  {
    date: '2010-11-16',
    end: ['party2'],
    temp: {
      party: {
        partyName: 'Sensei\'s Water Scavenger Hunt',
        rooms: {
          'boiler': 'archives:WaterHuntBoiler.swf',
          'book': 'archives:WaterHuntBook.swf',
          'cave': 'archives:WaterHuntCave.swf',
          'cavemine': 'archives:WaterHuntCavemine.swf',
          'coffee': 'archives:WaterHuntCoffee.swf',
          'cove': 'archives:WaterHuntCove.swf',
          'lounge': 'archives:WaterHuntLounge.swf',
          'dock': 'archives:WaterHuntDock.swf',
          'dojoext': 'archives:WaterHuntDojoext.swf',
          'forest': 'archives:WaterHuntForest.swf',
          'lake': 'archives:WaterHuntLake.swf',
          'mine': 'archives:WaterHuntMine.swf',
          'dojohide': 'archives:WaterHuntDojohide.swf',
          'plaza': 'archives:WaterHuntPlaza.swf',
          'pet': 'archives:WaterHuntPet.swf',
          'rink': 'archives:WaterHuntRink.swf',
          'forts': 'archives:WaterHuntForts.swf',
          'town': 'archives:RoomsTown-WaterScavengerHunt.swf',
          'dojowater': 'archives:WaterDojoConstruction.swf'
        },
        globalChanges: {
          'scavenger_hunt/hunt_ui.swf': ['archives:Sensei_Water_Scavenger_Hunt_closeup.swf', 'easter_egg_hunt', 'scavenger_hunt']
        },
        scavengerHunt2010: {
          iconFileId: 'archives:Sensei_Water_Scavenger_Hunt_icon.swf.swf'
        }
      }
    }
  },
  {
    date: '2010-11-19',
    miscComments: ['The password warning is updated'],
    fileChanges: {
      'play/v2/client/login.swf': 'slegacy:media/play/v2/client/login.swf',
      // this file is from Dec 2010, but will be using it as a placeholder
      // one from november 2010 exists in archives, and should be included if they are different
      'play/v2/client/club_penguin.swf': 'archives:Dec2010club_penguin.swf',
      'play/v2/client/Newspaper.swf': 'archives:Dec2010ClientNewspaper.swf'
    },
    temp: {
      party: {
        rooms: {
          'plaza': 'recreation:water_hunt_planet_y.swf',
          beach: 'recreation:water_hunt_beach_no_pin.swf'
        }
      }
    },
    newspaper: 'period-start',
    stagePlay: {
      name: 'Space Adventure Planet Y',
      costumeTrunk: 'archives:2010SpacePlanetAdventureYCostumeTrunk.swf'
    },
    rooms: {
      plaza: 'archives:RoomsPlaza-Play9.swf',
      stage: 'archives:RoomsStage-November2010.swf'
    }
  },
  {
    date: '2010-11-24',
    end: ['party'],
    temp: {
      party2: {
        partyName: 'Celebration of Water',
        rooms: {
          'dojoext': 'archives:WaterCelebrationDojoext.swf',
          'dojohide': 'archives:WaterCelebrationDojohide.swf',
          'dojowater': 'archives:WaterCelebrationDojowater.swf'
        }
      }
    },
    rooms: {
      dojohide: 'archives:RoomsDojohide_3.swf',
      dojowater: 'slegacy:media/play/v2/content/global/rooms/dojowater.swf'
    }
  },
  {
    date: '2010-12-02',
    end: ['party2'],
    roomComment: 'A video about Card-Jitsu Water is now on display at the Dojo Courtyard',
    rooms: {
      dojoext: 'archives:RoomsDojoext_3.swf'
    }
  },
  {
    date: '2010-12-03',
    clothingCatalog: 'archives:PenguinStyleDec2010.swf'
  },
  {
    date: '2010-12-09',
    iglooList: [
      { display: 'Candy Cane March', id: 228, pos: [1, 1] },
      { display: 'Santa\'s Mix', id: 254, pos: [6, 1] },
    ],
    temp: {
      const: {
        rooms: {
          beach: 'archives:HolidayParty2011ConsBeach.swf',
          lounge: 'archives:RoomsLounge-HolidayParty2009Pre.swf',
          dance: 'archives:RoomsDance-HolidayParty2009Pre.swf',
        },
        localChanges: {
          'close_ups/poster.swf': {
            en: ['recreation:holiday_beach_poster.swf', 'poster']
          }
        }
      }
    }
  },
  {
    date: '2010-12-10',
    furnitureCatalog: 'archives:FurnDec2010.swf'
  },
  {
    date: '2010-12-16',
    temp: {
      party: {
        partyName: 'Holiday Party',
        rooms: {
          'party99': 'archives:HolidayParty2010Party99.swf',
          'beach': 'archives:HolidayParty2010Beach.swf',
          'beacon': 'archives:HolidayParty2010Beacon.swf',
          'book': 'archives:HolidayParty2010Book.swf',
          'shipquarters': 'archives:HolidayParty2010ShipQuarters.swf',
          'coffee': 'archives:HolidayParty2010Coffee.swf',
          'cove': 'archives:HolidayParty2010Cove.swf',
          'shipnest': 'archives:HolidayParty2010ShipNest.swf',
          'lounge': 'archives:HolidayParty2010Lounge.swf',
          'dock': 'archives:HolidayParty2010Dock.swf',
          'dojo': 'archives:HolidayParty2010Dojo.swf',
          'dojoext': 'archives:HolidayParty2010DojoExt.swf',
          'dojofire': 'archives:HolidayParty2010DojoFire.swf',
          'forest': 'archives:HolidayParty2010Forest.swf',
          'shop': 'archives:HolidayParty2010Shop.swf',
          'berg': 'archives:HolidayParty2010Berg.swf',
          'light': 'archives:HolidayParty2010Light.swf',
          'attic': 'archives:HolidayParty2010Attic.swf',
          'party': 'archives:HolidayParty2010Party.swf',
          'ship': 'archives:HolidayParty2010Ship.swf',
          'shack': 'archives:HolidayParty2010Shack.swf',
          'dance': 'archives:HolidayParty2010Dance.swf',
          'dojohide': 'archives:HolidayParty2010DojoHide.swf',
          'pizza': 'archives:HolidayParty2010Pizza.swf',
          'plaza': 'archives:HolidayParty2010Plaza.swf',
          'shiphold': 'archives:HolidayParty2010ShipHold.swf',
          'mtn': 'archives:HolidayParty2010Mtn.swf',
          'lodge': 'archives:HolidayParty2010Lodge.swf',
          'village': 'archives:HolidayParty2010Village.swf',
          'forts': 'archives:HolidayParty2010Forts(1).swf',
          'rink': 'archives:HolidayParty2010Rink(1).swf',
          'town': 'archives:RoomsTown-HolidayParty2010.swf'
        },
        map: 'archives:HolidayParty2010Map-StadiumGames.swf',
        localChanges: {
          'close_ups/christmasposter.swf': {
            'en': 'archives:HolidayParty2010ChristmasPoster.swf'
          },
          'close_ups/poster.swf': {
            'en': 'archives:2010coinsforchangeposter.swf'
          },
          'forms/coins_for_change.swf': {
            'en': 'archives:2010coinsforchangedonate.swf'
          }
        },
        music: {
          'attic': 255,
          'beach': 254,
          'beacon': 254,
          'berg': 227,
          'book': 255,
          'coffee': 255,
          'cove': 254,
          'dance': 400,
          'dock': 254,
          'forest': 254,
          'forts': 254,
          'lodge': 255,
          'lounge': 226,
          'mtn': 254,
          'pizza': 255,
          'plaza': 254,
          'rink': 254,
          'shack': 254,
          'shop': 255,
          'village': 254,
          'town': 254,
          'party': 281,
          'party99': 254
        },
        migrator: true,
        startscreens: [
          'archives:LoginHolidayParty2010.swf',
          'archives:CFC2010LoginScreen.SWF',
          'archives:LoginDec2010Membership.swf',
          'archives:StartscreenENCoins_for_change_2-HolidayParty2010.swf'],
      }
    }
  },
  {
    date: '2010-12-20',
    temp: {
      party: {
        rooms: {
          'forts': 'archives:HolidayParty2010Forts(2).swf',
          'rink': 'archives:HolidayParty2010Rink(2).swf',
          'town': 'archives:RoomsTown-HolidayParty2010_2.swf'
        },
        map: 'archives:HolidayParty2010Map.swf'
      }
    }
  },
  {
    date: '2010-12-28',
    end: ['party'],
    stagePlay: {
      name: 'Ruby and the Ruby',
      costumeTrunk: 'archives:July09Costume.swf'
    },
    rooms: {
      plaza: 'recreation:plaza_ruby_no_weather.swf',
      stage: 'archives:RoomsStage-December2010.swf'
    }
  }
];