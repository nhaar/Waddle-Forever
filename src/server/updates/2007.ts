import { Update } from ".";

export const UPDATES_2007: Update[] = [
  {
    date: '2007-01-01',
    temp: {
      party: {
        update: 'The Iceberg\'s collision is fixed',
        rooms: {
          berg: 'recreation:fireworks_2006/berg_collision.swf.swf'
        }
      }
    }
  },
  {
    date: '2007-01-02',
    end: ['party']
  },
  {
    date: '2007-01-05',
    clothingCatalog: 'archives:Clothing_0701.swf'
  },
  {
    date: '2007-01-15',
    map: 'recreation:map_vector_original.swf', // rough estimate date
    miscComments: ['The map is vectorized']
  },
  {
    date: '2007-01-19',
    iglooList: true,
    iglooVersion: 46,
    temp: {
      party: {
        partyName: 'Winter Fiesta',
        rooms: {
          'village': 'archives:Village40.swf'
        },
        music: {
          'village': 206
        }
      }
    }
  },
  {
    date: '2007-01-22',
    end: ['party'],
    roomComment: 'A construction begins at the Plaza for a tour booth',
    rooms: {
      plaza: 'recreation:plaza_tour_const.swf'
    }
  },
  {
    date: '2007-01-26',
    roomComment: 'Tours are now present in the Plaza',
    rooms: {
      plaza: 'archives:ArtworkRoomsPlaza44.swf'
    }
  },
  {
    date: '2007-02-02',
    clothingCatalog: 'archives:Clothing_0702.swf',
    miscComments: ['Rockhopper is seen from the telescope'],
    temp: {
      'rockhopper-approach': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:Telescope5.swf'
        }
      }
    }
  },
  {
    date: '2007-02-07',
    miscComments: ['Rockhopper is seen closer from the telescope'],
    temp: {
      'rockhopper-approach': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:Telescope6.swf'
        }
      }
    }
  },
  {
    date: '2007-02-09',
    end: ['rockhopper-approach'],
    temp: {
      party: {
        partyName: 'Festival of Snow',
        rooms: {
          shack: 'recreation:festival_of_snow/shack.swf',
          berg: 'recreation:festival_of_snow/berg.swf',
          forts: 'recreation:festival_of_snow/forts.swf',
          mtn: 'recreation:festival_of_snow/mtn.swf',
          dance: 'recreation:festival_of_snow/dance.swf',
          beach: 'recreation:festival_of_snow/beach_1.swf',
          plaza: 'recreation:festival_of_snow/plaza.swf',
          dock: 'recreation:festival_of_snow/dock.swf',
          village: 'recreation:festival_of_snow/village.swf',
          light: 'recreation:festival_of_snow/light.swf',
          dojo: 'recreation:festival_of_snow/dojo.swf',
          town: 'recreation:festival_of_snow/town.swf'
        },
        music: {
          dock: 207,
          dojo: 207,
          berg: 207,
          shack: 207,
          plaza: 207,
          forts: 207,
          town: 207,
          beach: 204,
          light: 204,
          mtn: 204,
          village: 204
        }
      }
    }
  },
  {
    date: '2007-02-15',
    temp: {
      party: {
        update: 'The Migrator is updated',
        rooms: {
          beach: 'recreation:festival_of_snow/beach_2.swf',
        }
      }
    }
  },
  {
    date: '2007-02-16',
    temp: {
      party: {
        update: 'The Migrator is gone',
        rooms: {
          beach: 'recreation:festival_of_snow/beach_3.swf',
          berg: 'recreation:festival_of_snow/berg_pin.swf'
        }
      }
    }
  },
  {
    date: '2007-02-19',
    end: ['party']
  },
  {
    date: '2007-02-23',
    roomComment: 'The Clock Tower is added to the Snow Forts',
    miscComments: ['An object can be seen through the telescope'],
    rooms: {
      forts: 'archives:ArtworkRoomsForts41.swf'
    },
    temp: {
      'telescope-bottle': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'recreation:telescope/bottle.swf'
        }
      }
    }
  },
  {
    date: '2007-02-26',
    gameRelease: 'Pizzatron 3000',
    rooms: {
      pizza: 'recreation:pizza_2007.swf'
    }
  },
  {
    date: '2007-02-28',
    // NOTE: this date is a PLACEHOLDER! we don't know the exact date of animations...
    roomComment: 'The Pet Shop now has animations',
    rooms: {
      pet: 'archives:ArtworkRoomsPet44.swf'
    },
    end: ['telescope-bottle']
  },
  {
    date: '2007-03-02',
    clothingCatalog: 'archives:Clothing_0703.swf'
  },
  {
    date: '2007-03-16',
    iglooList: true,
    iglooVersion: 52,
    temp: {
      party: {
        partyName: 'St. Patrick\'s Day Party',
        rooms: {
          coffee: 'recreation:st_patrick_2007/coffee.swf',
          town: 'recreation:st_patrick_2007/town.swf'
        },
        music: {
          'town': 208,
          'dance': 208,
          'coffee': 208,
          'dock': 208,
          'plaza': 208
        }
      }
    }
  },
  {
    date: '2007-03-19',
    end: ['party']
  },
  {
    date: '2007-03-26',
    miscComments: ['The third secret agent mission is released'],
    fileChanges: {
      'artwork/tools/missions.swf': 'recreation:forms_missions/m3.swf'
    }
  },
  {
    date: '2007-03-30',
    temp: {
      party: {
        partyName: 'April Fools\' Party',
        rooms: {
          shack: 'recreation:april_fools_2007/shack.swf',
          berg: 'recreation:april_fools_2007/berg.swf',
          mine: 'recreation:april_fools_2007/mine.swf',
          beach: 'recreation:april_fools_2007/beach.swf',
          pizza: 'recreation:april_fools_2007/pizza.swf',
          coffee: 'recreation:april_fools_2007/coffee.swf'
        },
        music: {
          'shack': 201,
          'berg': 201,
          'mine': 201,
          'beach': 201,
          pizza: 201,
          coffee: 201
        }
      }
    }
  },
  {
    date: '2007-04-02'
  },
  {
    date: '2007-04-05',
    end: ['party']
  },
  {
    date: '2007-04-06',
    clothingCatalog: 'archives:Clothing_0704.swf'
  },
  {
    date: '2007-04-13',
    roomComment: 'A stage is now built in the Lighthouse',
    rooms: {
      light: 'archives:Lighthouse2007.swf'
    }
  },
  {
    date: '2007-04-27',
    temp: {
      party: {
        partyName: 'Pirate Party',
        rooms: {
          'town': 'archives:RoomsTown-PirateParty2007.swf',
          'dock': 'archives:RoomsDock-PirateParty2007.swf',
          coffee: 'recreation:pirate_party/coffee.swf'
        },
        music: {
          'town': 212,
          'dock': 212
        }
      }
    }
  },
  {
    date: '2007-05-04',
    clothingCatalog: 'archives:Clothing_0705.swf',
    end: ['party']
  },
  {
    date: '2007-05-18',
    temp: {
      party: {
        partyName: 'Lost Map Hunt',
        decorated: false,
        rooms: {
          mtn: 'recreation:lost_map_hunt/mtn.swf',
          village: 'recreation:lost_map_hunt/village.swf',
          dock: 'recreation:lost_map_hunt/dock.swf',
          town: 'recreation:lost_map_hunt/town.swf',
          forts: 'recreation:lost_map_hunt/forts.swf'
        },
        scavengerHunt2007: 'recreation:lost_map_hunt/handler.swf',
        fileChanges: {
          'chat506.swf': 'recreation:lost_map_hunt/chat506_edit.swf'
        }
      }
    },
    rooms: {
      plaza: 'archives:ArtworkRoomsPlaza45.swf',
      forest: 'archives:RoomsForest-CoveOpeningPartyPre_1.swf'
    }
  },
  {
    date: '2007-05-25',
    temp: {
      party2: {
        partyName: 'Cove Opening Party',
        rooms:  {
          plaza: 'recreation:cove_opening/plaza.swf',
          forest: 'recreation:cove_opening/forest.swf',
          cove: 'recreation:cove_opening/cove.swf'
        },
        music: {
          'forest': 214,
          'cove': 214
        }
      }
    },
    roomComment: 'Construction begins at the Cove',
    rooms: {
      village: 'recreation:village_precpip_tour.swf',
      cove: 'recreation:cove_hut_const.swf'
    },
    map: 'archives:ArtworkMaps15.swf',
    end: ['party']
  },
  {
    date: '2007-05-29',
    roomComment: 'As the Cove Opening party ends, the whistles remain in the Forest',
    rooms: {
      plaza: 'recreation:plaza_may07.swf',
      forest: 'archives:RoomsForest-CoveOpeningPartyPre_2.swf'
    },
    end: ['party2']
  },
  {
    date: '2007-06-01',
    clothingCatalog: 'archives:Clothing_0706.swf',
    roomComment: 'The whistles are removed from the Forest',
    rooms: {
      forest: 'slippers07:media/artwork/rooms/forest.swf'
    }
  },
  {
    date: '2007-06-04',
    gameRelease: 'Catchin\' Waves',
    roomComment: 'Construction at the Cove finishes',
    rooms: {
      cove: 'recreation:cove_after_cove_opening_pre_cpip.swf'
    }
  },
  {
    date: '2007-06-08',
    temp: {
      party: {
        partyName: 'Summer Kickoff Party',
        rooms: {
          dock: 'recreation:summer_kickoff_2007/dock.swf',
          town: 'recreation:summer_kickoff_2007/town.swf',
          beach: 'recreation:summer_kickoff_2007/beach.swf',
          beacon: 'recreation:summer_kickoff_2007/beacon.swf',
          dojo: 'recreation:summer_kickoff_2007/dojo.swf',
          mtn: 'recreation:summer_kickoff_2007/mtn.swf'
        },
        music: {
          'town': 204,
          'mtn': 204,
          'light': 215,
          'beacon': 215,
          'dojo': 215,
          'beach': 216,
          'dock': 216,
          'berg': 216
        }
      }
    }
  },
  {
    date: '2007-06-15',
    iglooList: true,
    iglooVersion: 58,
    temp: {
      party: {
        update: 'The beach gets updated for the Summer Kickoff Party',
        rooms: {
          beach: 'recreation:summer_kickoff_2007/beach_update.swf'
        }
      }
    }
  },
  {
    date: '2007-06-18',
    end: ['party']
  },
  {
    date: '2007-07-04',
    temp: {
      party: {
        partyName: 'July Fireworks',
        rooms: {
          berg: 'recreation:icebergwithfireworkswithcollision_01_01_2007.swf'
        }
      }
    }
  },
  {
    date: '2007-07-05',
    end: ['party']
  },
  {
    date: '2007-07-06',
    clothingCatalog: 'archives:Clothing_0707.swf'
  },
  {
    date: '2007-07-13',
    temp: {
      party: {
        partyName: 'Water Party',
        rooms: {
          dance: 'recreation:water_party_07_dance.swf',
          town: 'recreation:water_party_2007/town.swf',
          forest: 'recreation:water_party_2007/forest.swf',
          mtn: 'recreation:water_party_2007/mtn.swf',
          dojo: 'recreation:water_party_2007/dojo.swf',
          beach: 'recreation:water_party_2007/beach.swf',
          cove: 'recreation:water_party_2007/cove.swf',
          dock: 'recreation:water_party_2007/dock.swf'
        },
        music: {
          dojo: 217,
          town: 218,
          forest: 218,
          mtn: 218,
          beach: 218,
          cove: 218,
          dock: 218
        }
      }
    }
  },
  {
    date: '2007-07-23',
    end: ['party']
  },
  {
    date: '2007-08-02',
    clothingCatalog: 'archives:August2007PenguinStyle.swf'
  },
  {
    date: '2007-08-07',
    miscComments: ['The fourth secret agent mission is released'],
    fileChanges: {
      'artwork/tools/missions.swf': 'archives:ArtworkToolsMissions4.swf'
    }
  },
  {
    date: '2007-08-24',
    temp: {
      party: {
        partyStart: 'Camp Penguin party begins',
        partyEnd: 'Camp Penguin party ends',
        rooms: {
          'village': 'archives:RoomsVillage-CampPenguin.swf',
          town: 'recreation:camp_penguin/town.swf',
          cove: 'recreation:camp_penguin/cove.swf',
          dock: 'recreation:camp_penguin/dock.swf'
        },
        music: {
          'town': 219,
          'dock': 219,
          'cove': 220,
          'village': 219,
        }
      }
    }
  },
  {
    date: '2007-08-27',
    end: ['party']
  },
  {
    date: '2007-08-31',
    roomComment: 'The Snow and Sports catalog is now available in the Sport Shop',
    rooms: {
      sport: 'archives:RoomsSport.swf'
    },
    frames: {
      sport: 2
    }
  },
  {
    date: '2007-09-07',
    clothingCatalog: 'archives:September07Style.swf'
  },
  {
    date: '2007-09-13',
    roomComment: 'The Boiler Room is updated for the 100th newspaper',
    temp: {
      event: {
        rooms: {
          boiler: 'recreation:boiler_100_newspapers.swf'
        }
      }
    }
  },
  {
    date: '2007-09-20',
    end: ['event']
  },
  {
    date: '2007-09-21',
    temp: {
      party: {
        partyName: 'Fall Fair',
        rooms: {
          'beach': 'archives:RoomsBeach-FallFair2007.swf',
          'beacon': 'archives:RoomsBeacon-FallFair2007.swf',
          'cove': 'archives:RoomsCove-FallFair2007.swf',
          'lounge': 'archives:RoomsLounge-FallFair2007.swf',
          'dock': 'archives:RoomsDock-FallFair2007.swf',
          'forest': 'archives:RoomsForest-FallFair2007.swf',
          'rink': 'archives:RoomsRink-FallFair2007.swf',
          'light': 'archives:RoomsLight-FallFair2007.swf',
          'mine': 'archives:RoomsMine-FallFair2007.swf',
          'dance': 'archives:RoomsDance-FallFair2007.swf',
          'pizza': 'archives:RoomsPizza-FallFair2007.swf',
          'plaza': 'archives:RoomsPlaza-FallFair2007.swf',
          'mtn': 'archives:RoomsMtn-FallFair2007.swf',
          'village': 'archives:RoomsVillage-FallFair2007.swf',
          'forts': 'archives:RoomsForts-FallFair2007.swf',
          'town': 'archives:RoomsTown-FallFair2007.swf'
        },
        music: {
          'town': 221,
          'dance': 221,
          'lounge': 221,
          'forts': 221,
          'plaza': 221,
          'pizza': 221,
          'forest': 221,
          'cove': 221,
          'dock': 221,
          'beach': 221,
          'light': 221,
          'beacon': 221,
          'village': 221,
          'mtn': 221
        },
        fileChanges: {
          'artwork/rooms/0926/PrizeBooth2.swf': 'archives:CataloguesPrizebooth-FallFair2007.swf'
        },
        scavengerHunt2007: 'archives:ContentParty_icon-FallFair2007.swf'
      }
    }
  },
  {
    date: '2007-10-01',
    end: ['party']
  },
  {
    date: '2007-10-05',
    clothingCatalog: 'archives:PenguinStyleOct2007.swf'
  },
  {
    date: '2007-10-12',
    postcardCatalog: 'archives:ArtworkCatalogueCards_0710.swf'
  },
  {
    date: '2007-10-24',
    temp: {
      party: {
        partyName: '2nd Anniversary Party',
        rooms: {
          'book': 'archives:RoomsBook-2ndAnniversary.swf',
          'coffee': 'archives:RoomsCoffee-2ndAnniversary.swf'
        },
        music: {
          'coffee': 100,
          'book': 100
        }
      }
    }
  },
  {
    date: '2007-10-25',
    end: ['party']
  },
  {
    date: '2007-10-26',
    temp: {
      party: {
        partyName: 'Halloween Party',
        partyIcon: 'halloween',
        rooms: {
          'beach': 'archives:RoomsBeach-HalloweenParty2007.swf',
          'beacon': 'archives:RoomsBeacon-HalloweenParty2007.swf',
          'cave': 'archives:RoomsCave-HalloweenParty2007.swf',
          'coffee': 'archives:RoomsCoffee-HalloweenParty2007.swf',
          'cove': 'archives:RoomsCove-HalloweenParty2007.swf',
          'dock': 'archives:RoomsDock-HalloweenParty2007.swf',
          'forest': 'archives:RoomsForest-HalloweenParty2007.swf',
          'berg': 'archives:RoomsBerg-HalloweenParty2007.swf',
          'light': 'archives:RoomsLight-HalloweenParty2007.swf',
          'attic': 'archives:RoomsAttic-HalloweenParty2007.swf',
          'shack': 'archives:RoomsShack-HalloweenParty2007.swf',
          'dance': 'archives:RoomsDance-HalloweenParty2007.swf',
          'pizza': 'archives:RoomsPizza-HalloweenParty2007.swf',
          'plaza': 'archives:RoomsPlaza-HalloweenParty2007.swf',
          'forts': 'archives:RoomsForts-HalloweenParty2007.swf',
          'rink': 'archives:RoomsRink-HalloweenParty2007.swf',
          'mtn': 'archives:RoomsMtn-HalloweenParty2007.swf',
          'lodge': 'archives:RoomsLodge-HalloweenParty2007.swf',
          'village': 'archives:RoomsVillage-HalloweenParty2007.swf',
          'town': 'archives:RoomsTown-HalloweenParty2007.swf'
        },
        music: {
          'beach': 223,
          'coffee': 205,
          'cove': 223,
          'dock': 223,
          'forest': 223,
          'berg': 223,
          'shack': 223,
          'dance': 224,
          'pizza': 223,
          'forts': 223,
          'mtn': 223,
          'lodge': 205,
          'village': 223,
          'town': 223,
          'plaza': 223,
          'beacon': 205
        },
        fileChanges: {
          'artwork/tools/binoculars1.swf': 'archives:ContentBinoculars-HalloweenParty2007.swf'
        },
        scavengerHunt2007: 'archives:ContentParty_icon-HalloweenParty2007.swf'
      }
    }
  },
  {
    date: '2007-11-01',
    end: ['party']
  },
  {
    date: '2007-11-02',
    clothingCatalog: 'archives:PenguinStyleNov2007.swf'
  },
  {
    date: '2007-11-16',
    // added 604 because it has the stage, though have no idea of where it is from yet
    chatVersion: 604,
    roomComment: 'A new building opens at the Plaza',
    stagePlay: {
      name: 'Space Adventure',
      script: [
        {
          "note": "Space Adventure"
        },
        {
          "name": "Captain:",
          "message": "Calculate coordinates!"
        },
        {
          "name": "Robot:",
          "message": "TWEE-BEEEP ... CALCULATING COORDINATES."
        },
        {
          "name": "Ensign:",
          "message": "Now landing on planet X."
        },
        {
          "name": "Robot:",
          "message": "SHIP BADLY DAMAGED... NEED REPAIRS."
        },
        {
          "name": "Captain:",
          "message": "The planet appears to be made of metal!"
        },
        {
          "name": "Ensign:",
          "message": "Captain, I am picking up an alien signal!"
        },
        {
          "name": "Robot:",
          "message": "BEEEP! I AM ROBOT! ALIEN APPROACHING!"
        },
        {
          "name": "Alien:",
          "message": "Take me to your bird-feeder!"
        },
        {
          "name": "Ensign:",
          "message": "I forgot my line! Line, please!"
        },
        {
          "name": "Captain:",
          "message": "Dear aliens, we come in peace!"
        },
        {
          "name": "Alien:",
          "message": "I am hungry! I wish I had some pizza!"
        },
        {
          "name": "Ensign:",
          "message": "You should join us, alien... We would love to have you at Club Penguin!"
        },
        {
          "name": "Alien:",
          "message": "Yes, earthlings! Let us unite as friends!"
        },
        {
          "name": "Captain:",
          "message": "Then we shall use the metal to fix the ship!"
        },
        {
          "name": "Robot:",
          "message": "BEEEEEEP! I, ROBOT, HAVEFIXED SHIP!"
        },
        {
          "name": "Alien:",
          "message": "Let us voyage together as a team!"
        },
        {
          "name": "Captain:",
          "message":"Engage the carp drive... Let\'s get back to Club Penguin with our new friend!"
        },
        {
          "name": "Robot:",
          "message": "BLABEEEEEP... HOORAY FOR CLUB PENGUIN!"
        },
        {
          "name": "Captain:",
          "message": "Blast off!"
        }
      ],
      costumeTrunk: 'archives:SpaceAdventurePlanetXCostumeTrunk.swf'
    },
    rooms: {
      plaza: 'archives:ArtworkRoomsPlaza47.swf',
      stage: 'archives:SpaceAdventure1Stage.swf'
    },
    map: 'archives:Map2007Plaza.swf'
  },
  {
    date: '2007-11-23',
    temp: {
      party: {
        partyName: 'Surprise Party',
        rooms: {
          'cove': 'archives:RoomsCove-SurpriseParty.swf',
          'dock': 'archives:RoomsDock-SurpriseParty.swf',
          'forest': 'archives:RoomsForest-SurpriseParty.swf',
          'dance': 'archives:RoomsDance-SurpriseParty.swf',
          'plaza': 'archives:RoomsPlaza-SurpriseParty.swf',
          'forts': 'archives:RoomsForts-SurpriseParty.swf',
          'town': 'archives:RoomsTown-SurpriseParty.swf'
        },
        music: {
          // just put music in every room
          'cove': 55555,
          'dock': 55555,
          'forest': 55555,
          'dance': 55555,
          'plaza': 55555,
          'forts': 55555,
          'town': 55555
        }
      }
    }

  },
  {
    date: '2007-11-26',
    end: ['party']
  },
  {
    date: '2007-11-30',
    roomComment: 'Yellow Puffles are now in the Pet Shop',
    rooms: {
      pet: 'recreation:pet_nov07.swf'
    }
  },
  {
    date: '2007-12-07',
    clothingCatalog: 'archives:Clothing_0712.swf'
  },
  {
    date: '2007-12-14',
    miscComments: ['The Coins For Change event begins'],
    postcardCatalog: 'archives:ArtworkCatalogueCards_0712.swf',
    temp: {
      party: {
        rooms: {
          plaza: 'archives:RoomsPlaza-ChristmasParty2007Pre.swf'
        }
      }
    }
  },
  {
    date: '2007-12-21',
    iglooList: true,
    iglooVersion: 73,
    temp: {
      party: {
        partyName: 'Christmas Party',
        rooms: {
          'beach': 'archives:RoomsBeach-ChristmasParty2007.swf',
          'beacon': 'archives:RoomsBeacon-ChristmasParty2007.swf',
          'book': 'archives:RoomsBook-ChristmasParty2007.swf',
          'cove': 'archives:RoomsCove-ChristmasParty2007.swf',
          'dock': 'archives:RoomsDock-ChristmasParty2007.swf',
          'forest': 'archives:RoomsForest-ChristmasParty2007.swf',
          'berg': 'archives:RoomsBerg-ChristmasParty2007.swf',
          'attic': 'archives:RoomsAttic-ChristmasParty2007.swf',
          'dance': 'archives:RoomsDance-ChristmasParty2007.swf',
          'plaza': 'archives:RoomsPlaza-ChristmasParty2007.swf',
          'mtn': 'archives:RoomsMtn-ChristmasParty2007.swf',
          'lodge': 'archives:RoomsLodge-ChristmasParty2007.swf',
          'village': 'archives:RoomsVillage-ChristmasParty2007.swf',
          'forts': 'archives:RoomsForts-ChristmasParty2007.swf',
          'town': 'archives:RoomsTown-ChristmasParty2007.swf'
        },
        music: {
          'beach': 200,
          'beacon': 227,
          'book': 227,
          'cove': 200,
          'dock': 200,
          'forest': 228,
          'berg': 227,
          'attic': 228,
          'dance': 226,
          'plaza': 227,
          'mtn': 228,
          'lodge': 228,
          'village': 228,
          'forts': 227,
          'town': 227
        }
      }
    }
  },
  {
    date: '2007-12-24',
    temp: {
      party: {
        update: 'Scarves are now available at the Ski Village',
        frames: {
          village: 2
        }
      }
    }
  }
];
