import { Update } from ".";

export const UPDATES_2008: Update[] = [
  {
    date: '2008-01-02',
    end: ['party']
  },
  {
    date: '2008-01-04',
    clothingCatalog: 'archives:Clothing_0801.swf'
  },
  {
    date: '2008-01-16',
    // according to newspaper
    // unsure if in the original game the animation replayed each time
    // unless they had some interesting serverside code or the client in this day was different
    // it probably just replayed each time
    miscComments: ['Something happening with The Migrator can be viewed from the telescope'],
    temp: {
      'migrator-crash': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:BeaconTelescopeCrash.swf'
        }
      }
    }
  },
  {
    date: '2008-01-18',
    // we know on 17th it was still the previous one
    // this date below here is mostly an assumption, but it should be this at most
    // by the 23rd
    miscComments: ['The aftermath of The Migrator crash remains in the telescope'],
    temp: {
      'migrator-crash': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:TelescopeCrash2.swf'
        }
      },
      'party': {
        partyName: 'Winter Fiesta',
        rooms: {
          'coffee': 'archives:RoomsCoffee-WinterFiesta2008.swf',
          'village': 'archives:RoomsVillage-WinterFiesta2008.swf',
          'forts': 'archives:RoomsForts-WinterFiesta2008.swf',
          'town': 'archives:RoomsTown-WinterFiesta2008.swf',
          dance: 'recreation:winter_fiesta_2008/dance.swf',
          dock: 'recreation:winter_fiesta_2008/dock.swf',
          plaza: 'recreation:winter_fiesta_2008/plaza.swf',
        },
        music: {
          'beach': 229,
          'coffee': 229,
          'cove': 229,
          'dock': 229,
          'forest': 229,
          'dance': 229,
          'pizza': 229,
          'plaza': 229,
          'village': 229,
          'forts': 229,
          'town': 229
        }
      }
    }
  },
  {
    date: '2008-01-21',
    end: ['party']
  },
  {
    date: '2008-01-23',
    miscComments: ['Rockhopper lands in Club Penguin with a rowboat'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:Beach45afterrockycrash.swf'
        }
      }
    }
  },
  {
    date: '2008-01-30',
    miscComments: ['The Migrator\'s remains sink further'],
    temp: {
      'migrator-crash': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:TelescopeCrash3.swf'
        }
      }
    }
  },
  {
    date: '2008-02-01',
    miscComments: [
      'Rockhopper is seen leaving Club Penguin from the telescope',
      'Save the Migrator is setup at the Beach'
    ],
    clothingCatalog: 'archives:Feb2008.swf',
    temp: {
      'migrator-crash': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:TelescopeCrash4.swf'
        }
      },
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0403beach45.swf'
        }
      }
    }
  },
  {
    date: '2008-02-06',
    miscComments: ['The Migrator is completely sunk'],
    end: ['migrator-crash']
  },
  {
    date: '2008-02-08',
    stagePlay: {
      name: 'Team Blue\'s Rally Debut',
      costumeTrunk: 'archives:February2008Costume.swf',
      script: [
        {
          "note":"Team Blue\'s Rally Debut"
        },
        {
          "name": "Happy Judge:",
          "message": "Welcome everyone to the big Mascot Tryouts!"
        },
        {
          "name": "Grumpy Judge:",
          "message": "Each mascot has to get through US to win."
        },
        {
          "name": "Cheerleader:",
          "message":"Let\'s give \'em a big round of applause!"
        },
        {
          "name": "Audience:",
          "message": "Yeah! Go Team Blue!"
        },
        {
          "name": "Happy:",
          "message": "Give it up for PEPPPPPPPYYYYYYY!"
        },
        {
          "note": "(Peppy runs into gym, audience cheers)"
        },
        {
          "name": "Peppy:",
          "message": "ANY COOL BIRDS IN THE HOUSE TODAY? LEMME HEAR YA SAY BRRRRRRRRD!"
        },
        {
          "name": "Audience:",
          "message": "BRRRRRRRRD!"
        },
        {
          "name": "Peppy:",
          "message": "OH EE OH EE OH!"
        },
        {
          "name": "Audience:",
          "message": "ICE! ICE! ICE!"
        },
        {
          "note": "(Tate runs into gym)"
        },
        {
          "name": "Tate:",
          "message": "Did somebody say ICE?!..."
        },
        {
          "note": "(Tate trips and falls)"
        },
        {
          "name": "Tate:",
          "message": "Oops! Didn\'t see those bleachers there..."
        },
        {
          "name": "Cheerleader:",
          "message": "Everyone give it up for Tate! GO BLUE!"
        },
        {
          "note": "(Tate trips and falls again, runs out of gym)"
        },
        {
          "name": "Grumpy Judge:",
          "message": "Man, this competition is soooo lame."
        },
        {
          "name": "Zeus:",
          "message": "Oh man! I don\'t want to go out there!"
        },
        {
          "name": "Tate:",
          "message": "C\'mon, you should go. You\'ll do better than me."
        },
        {
          "name": "Zeus:",
          "message": "But I don\'t even have a cool entrance!"
        },
        {
          "note": "(Peppy enters the hallway to see what\'s happening)"
        },
        {
          "name": "Peppy:",
          "message": "HEY! TURN THOSEFROWNS UPSIDE-DOWN! DON\'T LEAVE ME TO BE THE CLOWN!"
        },
        {
          "name": "Zeus:",
          "message": "But Peppy... I don\'t want to look dumb!"
        },
        {
          "name": "Grumpy:",
          "message": "Excuse me, but can we get on with the show?"
        },
        {
          "name": "Tate:",
          "message": "You couldn\'t do any worse than me, Zeus!"
        },
        {
          "name": "Audience:",
          "message": "WE WANT ZEUS! WE WANT ZEUS!"
        },
        {
          "name": "Tate:",
          "message": "See, Zeus! They want to see your cool outfit!"
        },
        {
          "name": "Peppy:",
          "message": "YEAH ZEUS, GIVE EM THE SCHOOL SPIRIT!"
        },
        {
          "name": "Zeus:",
          "message": "I just don\'t want to be alone out there."
        },
        {
          "name": "Peppy:",
          "message": "WELL WHY DIDN\'T YOU SAY SO!"
        },
        {
          "name": "Zeus:",
          "message": "What do you mean?"
        },
        {
          "name": "Peppy:",
          "message": "LET\'S GO TOGETHER! AS A TEAM!"
        },
        {
          "name": "Tate:",
          "message": "Yeah! We can be The Blue Crew!"
        },
        {
          "name": "Zeus:",
          "message": "Okay...maybe that would work... Let\'s try it!"
        },
        {
          "note": "(The three mascots enter gym)"
        },
        {
          "name": "Audience:",
          "message": "BLUE... TEAM... BACK AGAIN! TIME IS RIGHT SO LET\'S BEGIN!"
        },
        {
          "name": "Peppy:",
          "message": "STOP!... BLUE TIME!"
        },
        {
          "name": "Tate:",
          "message": "Make some noise for the Team Blue Crew!"
        },
        {
          "name": "Zeus:",
          "message": "Let me hear ya say MOOOOOOSE!"
        },
        {
          "name": "Audience:",
          "message": "MOOOOOOOSE!"
        },
        {
          "name": "Tate:",
          "message": "Let me hear ya say ICE!"
        },
        {
          "name": "Audience:",
          "message": "BERG!"
        },
        {
          "name": "Tate:",
          "message": "ICE!"
        },
        {
          "name": "Audience:",
          "message": "BERG!"
        },
        {
          "name": "Cheerleader:",
          "message": "Looks like the audience likes ALL OF THEM!"
        },
        {
          "name": "Grumpy:",
          "message": "Umm... can we choose none of them?"
        },
        {
          "name": "Happy:",
          "message": "Presenting the winner... the Team Blue Crew!"
        },
        {
          "name": "Grumpy:",
          "message": "Great... Can I go home now?"
        },
        {
          "note": "THE END"
        }
      ]
    },
    roomComment: 'Construction of a new invention begins in the Iceberg',
    rooms: {
      stage: 'archives:RoomsStage-February2008.swf',
      berg: 'archives:Berg401.swf'
    }
  },
  {
    date: '2008-02-15',
    temp: {
      party: {
        partyName: 'Sub-Marine Party',
        rooms: {
          'beach': 'archives:RoomsBeach-SubMarine.swf',
          'beacon': 'archives:RoomsBeacon-SubMarine.swf',
          'book': 'archives:RoomsBook-SubMarine.swf',
          'coffee': 'archives:RoomsCoffee-SubMarine.swf',
          'cove': 'archives:RoomsCove-SubMarine.swf',
          'lounge': 'archives:RoomsLounge-SubMarine.swf',
          'dock': 'archives:RoomsDock-SubMarine.swf',
          forest: 'archives:RoomsForest-SubMarine.swf',
          dance: 'archives:RoomsDance-SubMarine.swf',
          pizza: 'archives:RoomsPizza-SubMarine.swf',
          plaza: 'archives:SubMarinePlaza.swf',
          village: 'archives:RoomsVillage-SubMarine.swf',
          forts: 'archives:RoomsForts-SubMarine.swf',
          town: 'archives:RoomsTown-SubMarine.swf'
        },
        music : {
          town: 230,
          plaza: 230,
          coffee: 230,
          book: 230,
          forts: 230,
          forest: 230,
          cove: 230,
          village: 230,
          beach: 230,
          light: 230,
          beacon: 230,
          dock: 230,
          pizza: 212,
          dance: 202
        }
      }
    },
    roomComment: 'A poll is added to the Iceberg',
    rooms: {
      berg: 'archives:Rooms0215Berg40.swf'
    }
  },
  {
    date: '2008-02-19',
    roomComment: 'The Aqua Grabber\'s construction is finished',
    rooms: {
      berg: 'archives:RoomsBerg-Feb2008.swf'
    }
  },
  {
    date: '2008-02-22',
    end: ['party']
  },
  {
    date: '2008-02-23',
    miscComments: ['Pieces of The Migrator show up at the Beach'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0223beach45.swf'
        }
      }
    }
  },
  {
    date: '2008-02-29',
    miscComments: ['More pieces show up at the Beach'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0229beach45.swf'
        }
      }
    }
  },
  {
    date: '2008-03-07',
    miscComments: ['Reconstruction of The Migrator begins'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0307beach45.swf'
        }
      }
    },
    clothingCatalog: 'archives:PenguinStyleMar2008.swf'
  },
  {
    date: '2008-03-14',
    temp: {
      party: {
        partyName: 'St. Patrick\'s Day Party',
        rooms: {
          coffee: 'archives:ArtworkRooms0314Coffee42.swf',
          dock: 'archives:ArtworkRooms0314Dock43.swf',
          forest: 'archives:ArtworkRooms0314Forest42.swf',
          dance: 'archives:ArtworkRooms0314Dance43.swf',
          plaza: 'archives:ArtworkRooms0314Plaza47.swf',
          village: 'archives:ArtworkRooms0314Village43.swf',
          forts: 'archives:ArtworkRooms0314Forts41.swf',
          town: 'archives:ArtworkRooms0314Town40.swf'
        },
        music: {
          coffee: 208,
          dock: 208,
          forest: 208,
          dance: 208,
          plaza: 208,
          village: 208,
          forts: 208,
          town: 208
        }
      }
    },
    stagePlay: {
      name: 'Space Adventure',
      costumeTrunk: 'archives:SpaceAdventurePlanetXCostumeTrunk.swf',
      script: [
        { note: "Space Adventure" },
        { name: "Captain:", message: "Captain\'s journal, entry number 11-16..." },
        { name: "Captain:", message: "We\'re flying toward Planet X to find alien life." },
        { name: "Ensign:", message: "Speed set to carp two, ready to land." },
        { name: "Robot:", message: "TWEEP! ERROR 500...ENGINE FAILING!" },
        { name: "Captain:", message: "Ensign, increase emergency power!" },
        { name: "Ensign", message: "Already used up all backup power, sir!" }, 
        { name: "Robot:", message: "GLEEEEEP! ENGINE HAS STOPPED...NO POWER LEFT!" },
        { name: "Captain:", message: "Prepare the survey team to investigate." },
        { name: "Ensign:", message: "Captain, receiving a signal off the port bow." },
        { name: "Captain:", message: "Tin Can 3000, what do you know about Planet X?" },
        { name: "Robot:", message: "ERROR 404! NO RECORDS FOUND!" },
        { note: "(Alien jumps out of alien spaceship)" },
        { name: "Alien:", message: "Halt! I am Zip, ruler of Planet X! Who are you?" },
        { name: "Captain:", message: "I am Captain Snow and this is my crew." },
        { name: "Ensign:", message: "We came from Club Penguin, but our ship broke." },
        { name: "Captain:", message: "Zip, we need your help to rebuild our engine." },
        { name: "Alien:", message: "I don\'t just fix any old ship that lands here." },
        { name: "Robot:", message: "CONNECTION...REFUSED BY HOST..." },
        { name: "Ensign:", message: "But without our spaceship we can\'t get home!" },
        { name: "Alien:", message: "Did you try clearing the ship computer\'s cache?" },
        { name: "Ensign:", message: "Wait! I didn\'t! Thanks for the help! I\'ll try it!" },
        { note: "(Ensign and Robot work on spaceship\'s computer)" },
        { name: "Robot:", message: "ENGINES OPERATIONAL...TWEEP!" },
        { name: "Captain:", message: "Thank you for your excellent help, Zip!" },
        { name: "Alien:", message: "Wait! Can I go with you?" },
        { name: "Robot:", message: "BLEEB! ERROR 407! REQUEST MORE DETAIL!" },
        { name: "Ensign:", message: "Why do you want to go to Club Penguin?" },
        { name: "Alien:", message: "My home isn\'t the same since the others left" },
        { name: "Ensign:", message: "Well, we\'d love to have you on Club Penguin!" },
        { name: "Captain:", message: "You have my permission to join us aboard, Zip." },
        { name: "Captain:", message: "Ensign, set a course for the Plaza. Carp Five!" },
        { name: "Ensign:", message: "Engines set for destination, Captain!" },
        { name: "Captain:", message: "Let\'s get back to Club Penguin with our new friend!" },
        { name: "All Cast:", message: "HOORAY FOR CLUB PENGUIN!" },
        { note: "THE END" }
      ]
    },
    rooms: {
      plaza: 'archives:ArtworkRoomsPlaza47.swf',
      stage: 'archives:SpaceAdventure1Stage.swf'
    }
  },
  {
    date: '2008-03-18',
    end: ['party']
  },
  {
    date: '2008-03-20',
    miscComments: [
      // the date for this is a conjecture, don't know when it actually happened
      'Reconstruction of The Migrator progresses'
    ],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0320beach45.swf'
        }
      }
    }
  },
  {
    date: '2008-03-21',
    temp: {
      party: {
        partyName: 'Easter Egg Hunt',
        decorated: false,
        rooms: {
          book: 'archives:RoomsBook-EasterEggHunt2008.swf',
          dock: 'archives:RoomsDock-EasterEggHunt2008.swf',
          dojo: 'archives:RoomsDojo-EasterEggHunt2008.swf',
          shop: 'archives:RoomsShop-EasterEggHunt2008.swf',
          attic: 'archives:RoomsAttic-EasterEggHunt2008.swf',
          mine: 'archives:RoomsMine-EasterEggHunt2008.swf',
          pet: 'archives:RoomsPet-EasterEggHunt2008.swf',
          plaza: 'archives:RoomsPlaza-EasterEggHunt2008.swf'
        },
        scavengerHunt2007: 'archives:Eggs-EasterEggHunt2008.swf'
      }
    }
  },
  {
    date: '2008-03-24',
    end: ['party']
  },
  {
    date: '2008-03-27',
    miscComments: ['Reconstruction of The Migrator progresses'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0327beach45.swf'
        }
      }
    }
  },
  {
    date: '2008-03-28',
    temp: {
      party: {
        partyName: 'April Fools\' Party',
        rooms: {
          beach: 'archives:ArtworkRooms0328Beach46.swf',
          beacon: 'archives:ArtworkRooms0328Beacon42.swf',
          boiler: 'archives:ArtworkRooms0328Boiler43.swf',
          book: 'archives:ArtworkRooms0328Book43.swf',
          coffee: 'archives:ArtworkRooms0328Coffee42.swf',
          lounge: 'archives:ArtworkRooms0328Lounge44.swf',
          dock: 'archives:ArtworkRooms0328Dock43.swf',
          dojo: 'archives:ArtworkRooms0328Dojo41.swf',
          forest: 'archives:ArtworkRooms0328Forest42.swf',
          shop: 'archives:ArtworkRooms0328Shop46.swf',
          berg: 'archives:ArtworkRooms0328Berg42.swf',
          light: 'archives:ArtworkRooms0328Light46.swf',
          attic: 'archives:ArtworkRooms0328Attic42.swf',
          shack: 'archives:ArtworkRooms0328Shack40.swf',
          dance: 'archives:ArtworkRooms0328Dance43.swf',
          pet: 'archives:ArtworkRooms0328Pet45.swf',
          pizza: 'archives:ArtworkRooms0328Pizza45.swf',
          plaza: 'archives:ArtworkRooms0328Plaza47.swf',
          lodge: 'archives:ArtworkRooms0328Lodge46.swf',
          village: 'archives:ArtworkRooms0328Village43.swf',
          forts: 'archives:ArtworkRooms0328Forts41.swf',
          town: 'archives:ArtworkRooms0328Town40.swf',
          cove: 'archives:ArtworkRooms0328Cove43.swf'
        },
        music: {
          pet: 201,
          shop: 201,
          coffee: 201,
          book: 201,
          light: 201,
          beacon: 201,
          sport: 201,
          lodge: 201,
          attic: 201,
          dojo: 201,
          dance: 231,
          lounge: 231,
          town: 232,
          plaza: 232,
          forts: 232,
          forest: 232,
          cove: 232,
          dock: 232,
          beach: 232,
          village: 232,
          shack: 232,
          berg: 232
        },
        fileChanges: {
          'games/thinice/game.swf': 'archives:Thinicetrobarrier.swf',
          'artwork/tools/binoculars1.swf': 'archives:Binoculars-AprilFools2008.swf',
          'artwork/tools/telescope0.swf': 'archives:Telescope-AprilFools2008.swf'
        }
      }
    }
  },
  {
    date: '2008-04-02',
    end: ['party']
  },
  {
    date: '2008-04-04',
    clothingCatalog: 'archives:Apr2008.swf'
  },
  {
    date: '2008-04-10',
    miscComments: ['The Migrator is cleaned up and a new device is at the Beach'],
    temp: {
      'migrator-reconstruction': {
        rooms: {
          beach: 'archives:0410beach45.swf'
        },
        migrator: true
      }
    }
  },
  {
    roomComment: 'The skyboxes are updated in the Pizza Parlor',
    date: '2008-04-14',
    rooms: {
      pizza: 'recreation:pizza_2008.swf'
    }
  },
  {
    date: '2008-04-17',
    miscComments: ['Rockhopper is spotted through the telescope'],
    roomComment: 'The Snow Forts clock breaks',
    temp: {
      'migrator-reconstruction': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:Telescope0417.swf'
        }
      },
      'broken-clock': {
        rooms: {
          forts: 'archives:ArtworkRoomsForts50.swf'
        }
      }
    }
  },
  {
    date: '2008-04-21',
    rooms: {
      agent: 'recreation:agent_2008_apr_pre_cpip.swf'
    }
  },
  {
    date: '2008-04-25',
    end: ['migrator-reconstruction'],
    temp: {
      party: {
        partyName: 'Rockhopper & Yarr\'s Arr-ival Parr-ty',
        rooms: {
          beach: 'archives:ArtworkRooms0425Beach50.swf',
          dock: 'archives:ArtworkRooms0425Dock50.swf',
          coffee: 'archives:ArtworkRooms0425Coffee51.swf',
          dance: 'archives:ArtworkRooms0425Dance50.swf',
          plaza: 'archives:ArtworkRooms0425Plaza50.swf',
          ship: 'archives:ArtworkRooms0425Ship50.swf',
          shiphold: 'archives:ArtworkRooms0425Shiphold50.swf',
          village: 'archives:ArtworkRooms0425Village50.swf',
          forts: 'archives:ArtworkRooms0425Forts50.swf',
          town: 'archives:ArtworkRooms0425Town50.swf'
        },
        music: {
          town: 212,
          forts: 212,
          plaza: 212,
          village: 212,
          beach: 212,
          dock: 212,
          coffee: 212,
          dance: 212
        },
        migrator: true
      }
    }
  },
  {
    date: '2008-04-28',
    end: ['party']
  },
  {
    date: '2008-05-02',
    clothingCatalog: 'archives:May2008.swf'
  },
  {
    date: '2008-05-09',
    stagePlay: {
      name: 'The Twelfth Fish',
      costumeTrunk: 'archives:May2008Costume.swf'
    },
    rooms: {
      stage: 'archives:RoomsStage-Christmas2007.swf'
    }
  },
  {
    date: '2008-05-16',
    temp: {
      party: {
        partyName: 'Medieval Party',
        rooms: {
          beach: 'archives:Rooms0516Beach50.swf',
          beacon: 'archives:Rooms0516Beacon50.swf',
          boiler: 'archives:Rooms0516Boiler50.swf',
          cave: 'archives:Rooms0516Cave50.swf',
          coffee: 'archives:Rooms0516Coffee51.swf',
          cove: 'archives:Rooms0516Cove50.swf',
          lounge: 'archives:Rooms0516Lounge50.swf',
          dock: 'archives:Rooms0516Dock50.swf',
          forest: 'archives:Rooms0516Forest50.swf',
          light: 'archives:Rooms0516Light50.swf',
          attic: 'archives:Rooms0516Attic50.swf',
          mine: 'archives:Rooms0516Mine50.swf',
          shack: 'archives:Rooms0516Shack50.swf',
          dance: 'archives:Rooms0516Dance50.swf',
          pet: 'archives:Rooms0516Pet50.swf',
          pizza: 'archives:Rooms0516Pizza50.swf',
          plaza: 'archives:Rooms0516Plaza50.swf',
          rink: 'archives:Rooms0516Rink51.swf',
          mtn: 'archives:Rooms0516Mtn50.swf',
          lodge: 'archives:Rooms0516Lodge50.swf',
          village: 'archives:Rooms0516Village50.swf',
          forts: 'archives:Rooms0516Forts51.swf',
          town: 'archives:ArtworkRooms0516Town51.swf',

          // this is technically room "party"
          // but we have an issue with the id of that room
          // changing... (if want to preserve the internal URLs will need refactoring, so not doing it rn)
          party99: 'archives:Rooms0516Party50.swf'
        },
        music: {
          beach: 235,
          beacon: 235,
          boiler: 236,
          cave: 236,
          coffee: 234,
          cove: 235,
          lounge: 234,
          dock: 233,
          forest: 235,
          light: 235,
          attic: 234,
          mine: 236,
          shack: 233,
          dance: 234,
          pet: 234,
          pizza: 234,
          plaza: 233,
          rink: 233,
          mtn: 234,
          lodge: 234,
          village: 233,
          forts: 233,
          town: 233,
          party99: 235
        }
      }
    }
  },
  {
    date: '2008-05-25',
    end: ['party']
  },
  {
    date: '2008-06-06',
    clothingCatalog: 'archives:Jun2008.swf'
  },
  {
    date: '2008-06-13',
    temp: {
      party: {
        partyName: 'Water Party',
        rooms: {
          beach: 'archives:WPBeach.swf',
          beacon: 'archives:WPBeacon.swf',
          boiler: 'archives:WPBoilerRoom.swf',
          cave: 'archives:WPCave.swf',
          coffee: 'archives:WPCoffeeShop.swf',
          cove: 'archives:WPCove.swf',
          dance: 'archives:WPDanceClub.swf',
          lounge: 'archives:RoomsLounge-Water2008.swf',
          dock: 'archives:WPDock.swf',
          dojo: 'archives:WPDojo.swf',
          forest: 'archives:WPForest.swf',
          forts: 'archives:WPForts.swf',
          berg: 'archives:WPIceBerg.swf',
          rink: 'archives:WPIceRink.swf',
          light: 'archives:WPLightHouse.swf',
          attic: 'archives:WPLodgeAttic.swf',
          mine: 'archives:WPMine.swf',
          shack: 'archives:WPMineShack.swf',
          // technically it was party.swf
          party99: 'archives:WPParty.swf',
          pizza: 'archives:WPPizzaParlor.swf',
          plaza: 'archives:WPPlaza.swf',
          mtn: 'archives:WPSkiHill.swf',
          lodge: 'archives:WPSkiLodge.swf',
          village: 'archives:WPSkiVillage.swf',
          town: 'archives:WPTown.swf'
        },
        music: {
          beach: 218,
          beacon: 218,
          boiler: 217,
          cave: 217,
          coffee: 218,
          cove: 217,
          dance: 217,
          dock: 218,
          dojo: 218,
          forest: 217,
          forts: 217,
          rink: 217,
          light: 217,
          mine: 218,
          shack: 218,
          party99: 218,
          plaza: 217,
          mtn: 218,
          village: 218,
          town: 218
        }
      }
    },
    stagePlay: {
      name: 'The Penguins that Time Forgot',
      costumeTrunk: 'archives:June08Costume.swf',
      script: [
        { note: "The Penguins that Time Forgot" },
        { name: "Chester:", message: "Time to try out this new Time Travel 1000!" },
        { note: "(Time machine opens)" },
        { name: "Critteroo:", message: "UGG! DINO! UGG!" },
        { name: "Chester:", message: "What is this place? Where am I?" },
        { name: "Kek:", message: "GRUB! GRUB! GRUB!" },
        { name: "Chester:", message: "I\'m in Grub? What\'s a Grub?" },
        { name: "Critteroo:", message: "LAVA! LAVA!" }, 
        { name: "Chester:", message: "Lava?! I\'ve gotta get out of here!" },
        { note: "(Time machine breaks)" },
        { name: "Chester:", message: "Great, now I\'m stuck in some place called Grub." },
        { name: "Tiki:", message: "TIKI UGG!" },
        { name: "Kek:", message: "GRRRRRRRUB!" },
        { name: "Chester:", message: "Now who\'s this with the big silly mask?" },
        { name: "Tiki:", message: "TIKI TIKI BOARD TIKI BOARD!" },
        { name: "Critteroo:", message: "TIKI! TIKI! ATOOK!" },
        { name: "Tiki:", message: "ABOOT! ABOOT!" },
        { name: "Kek:", message: "YUB NUB GRUB!" },
        { name: "Chester:", message: "Okay, really now. Can\'t you just use real words?" },
        { name: "Critteroo:", message: "GRUB! GRUB TIKI GRUB-GRUB!" },
        { name: "Chester:", message: "You do know you don\'t make any sense, right?" },
        { name: "Critteroo:", message: "LAVA NO TIKI GRUB!" },
        { name: "Chester:", message: "Sigh. Okay, something about lava and grubs." },
        { name: "Tiki:", message: "ABOOOOOOT" },
        { name: "Chester:", message: "You were wearing boots, but the grubs took them?" },
        { name: "Kek:", message: "LAVA NO LAVA! GRUB TIKI GRUB!" },
        { name: "Chester:", message: "Let me guess, your name is Tiki and you\'re Grub." },
        { name: "Tiki:", message: "ABOOT TIKI!" },
        { name: "Critteroo:", message: "TIKI GRUB-GRUB!" },
        { name: "Chester:", message: "I give up! I have no idea what you\'re saying." },
        { name: "Kek:", message: "DINO YUB NUB LAVAAA!" },
        { name: "Chester:", message: "Well, I may as well join in..." },
        { name: "Chester:", message: "GRUB GRUB!" },
        { name: "Tiki:", message: "TIKI BOARD BOARD!" },
        { name: "Kek:", message: "LAVA DINO GRUB!" },
        { name: "Chester:", message: "Last time I buy a time machine for 10 coins..." },
        { note: "THE END" }
      ]
    },
    rooms: {
      stage: 'archives:RoomsStage-June2008.swf'
    }
  },
  {
    date: '2008-06-17',
    end: ['party']
  },
  {
    date: '2008-06-20',
    furnitureCatalog: 'archives:Jun-Jul2008Furniture.swf',
    miscComments: ['An earthquake hits the island'],
    temp: {
      'earthquake': {
          rooms: {
          dance: 'archives:RoomsDance-Earthquake2008.swf'
        }
      }
    }
  },
  {
    date: '2008-06-24',
    miscComments: ['The earthquake ends'],
    end: ['earthquake']
  },
  {
    date: '2008-07-04',
    clothingCatalog: 'archives:July08Style.swf'
  },
  {
    date: '2008-07-11',
    stagePlay: {
      name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
      costumeTrunk: null,
      hide: true,
      script: [
        { note: "Squidzoid vs Shadow Guy & Gamma Gal" },
        { name: "Reporter:", message: "Action news live! Tell us what\'s happening!" },
        { name: "Witness:", message: "I saw a monster eat the pet shop!" },
        { name: "Squidzoid:", message: "GRAWL! I HUNGRY!" },
        { name: "Witness:", message: "Who can save us now?" },
        { name: "Shadow Guy:", message: "The city needs our help!" },
        { name: "Gamma Gal:", message: "Super costume mega transform!" }, 
        { note: "(Heroes change into super suits)" },
        { name: "Witness:", message: "Look! The heroes have arrived!" },
        { name: "Reporter:", message: "Here they come to save the day!" },
        { name: "SG:", message: "Freeze Squidzoid! Drop that shop!" },
        { name: "GG:", message: "I think you\'ve had enough to eat!" },
        { name: "Squidzoid:", message: "BLARRG! YOU CAN\'T STOP ME!" },
        { name: "GG:", message: "Oh yeah? Take this! PLASMA GLOW WAVE!" },
        { name: "Squidzoid:", message: "RROOOOAAAARR!" },
        { name: "Reporter:", message: "The superheroes are using their powers!" },
        { name: "Witness:", message: "Hurray heroes! Nice going!" },
        { name: "Squidzoid:", message: "PUNY HEROES! YOU\'RE NO MATCH FOR ME!" },
        { name: "SG:", message: "Then try this on for size! SHADOW WAVE!" },
        { name: "Squidzoid:", message: "GLEEGRRAUWLL!" },
        { name: "Reporter:", message: "This just in! Squidzoid is trying to escape!" },
        { name: "Witness:", message: "After it! Don\'t let it get away!" },
        { name: "GG:", message: "Quick! With our powers combined!" },
        { name: "SG:", message: "For great justice!" },
        { name: "Squidzoid:", message: "NO! THIS IS IMPOSSIBLE! GRRAAA!" },
        { name: "Witness:", message: "It\'s turning into a penguin!" },
        { note: "(Squidzoid turns into a penguin.)" },
        { name: "Squidzoid:", message: "Hey, I\'m a penguin again. What happened?" },
        { name: "Reporter:", message: "You turned into Squidzoid!" },
        { name: "Witness:", message: "And started eating the city!" },
        { name: "Squidzoid:", message: "Oh! I had a monster appetite!" },
        { name: "SG:", message: "With great power comes great hunger." },
        { name: "GG:", message: "Looks like our work here is done!" },
        { name: "Squidzoid:", message: "Let\'s go get a fish pizza." },
        { name: "Reporter:", message: "The city is saved! This reporter is signing off." },
        { note: "THE END" }
      ]
    }
  },
  {
    date: '2008-07-15',
    miscComments: ['The Club Penguin Improvement Project is implemented'],
    engineUpdate: 'cpip',
    indexHtml: 'classic-cpip',
    websiteFolder: 'classic',
    rooms: {
      town: 'archives:RoomsTown.swf',
      rink: 'archives:RoomsRink.swf',
      village: 'archives:RoomsVillage.swf',
      forts: 'archives:FortsWithIceRinkStadium.swf',
      // the only SWF we have of CPIP before renovation
      pizza: 'archives:RoomsPizza-January2010.swf',
      plaza: 'recreation:plaza_squidzoid_sign.swf',
      book: 'archives:BookPrePenguinArt.swf',
      beach: 'archives:RoomsBeach-2.swf',
      mtn: 'recreation:mtn_cpip_start.swf',
      berg: 'archives:RoomsBerg.swf',
      beacon: 'recreation:beacon_nolight.swf',
      // post island adventure update
      boxdimension: 'archives:RoomsBoxdimension-January2010.swf',
      cave: 'archives:RoomsCave.swf',
      // recreation of proper cove room here
      cove: 'recreation:cpip_cove_precatalog.swf',
      dance: 'recreation:dance_cpip_premusicjam.swf',
      dock: 'recreation:dock_cpip_precatalog.swf',
      light: 'recreation:light_cpip_start.swf',
      stage: 'archives:RoomsStage2008-07-15-Squidzoid.swf',
      lodge: 'recreation:lodge_cpip_start.swf',
      pet: 'recreation:pet_pre_white.swf',
      shop: 'recreation:shop_cpip.swf',
      coffee: 'archives:RoomsCoffee-January2010.swf',
      lounge: 'archives:RoomsLounge.swf',
      boiler: 'archives:RoomsBoiler-January2010.swf',
      attic: 'archives:RoomsAttic.swf',
      sport: 'archives:RoomsSport_2.swf',
      lake: 'slegacy:media/play/v2/content/global/rooms/lake.swf',
      cavemine: 'slegacy:media/play/v2/content/global/rooms/cavemine.swf',
      dojo: 'recreation:dojo_cpip_start.swf',
      shiphold: 'slegacy:media/play/v2/content/global/rooms/shiphold.swf',
      shipnest: 'slegacy:media/play/v2/content/global/rooms/shipnest.swf',
      shipquarters: 'slegacy:media/play/v2/content/global/rooms/shipquarters.swf',
      agent: 'recreation:agent_2008_apr_cpip.swf',
      mine: 'archives:RoomsMine_1.swf',
      shack: 'archives:RoomsShack.swf',
      forest: 'archives:RoomsForest.swf',
      ship: 'archives:RoomsShip.swf'
    },
    pinRoomUpdate: 'recreation:cove_cpip_firework_rocket_pin.swf',
    memberRooms: {
      dojofire: true,
      dojowater: true,
    },
    fileChanges: {
      'play/v2/client/startscreen.swf': 'recreation:startscreen/cpip.swf',
      'play/v2/client/shell.swf': 'approximation:shell.swf',
      'play/v2/client/engine.swf': 'unknown:engine_2009.swf',
      'play/v2/client/interface.swf': 'recreation:interfaces/2008_july.swf',
      'play/v2/client/login.swf': 'recreation:login_cpip.swf',
      'play/v2/client/igloo.swf': 'recreation:client_igloo_cpip.swf',
      'play/v2/content/global/binoculars/empty.swf': 'slegacy:media/play/v2/content/global/binoculars/empty.swf',
      'play/v2/content/global/telescope/empty.swf': 'slegacy:media/play/v2/content/global/telescope/empty.swf',
      'play/v2/content/global/igloo/assets/igloo_background.swf': 'slegacy:media/play/v2/content/global/igloo/assets/igloo_background.swf',
      // this puffle roundup is a placeholder, TODO needs to be updated
      'play/v2/games/roundup/PuffleRoundup.swf': 'fix:PuffleRoundupWhitePuffle.swf'
    },
    startscreens: [ 'recreation:startscreen/cpip_logo.swf' ],
    localChanges: {
      'forms/moderator.swf': {
        'en': 'recreation:pre_epf_moderator_form.swf'
      },
      'forms/library.swf': {
        'en': 'recreation:library/cpip.swf'
      },
      'forms/missions.swf': {
        'en': 'recreation:forms_missions/cpip.swf'
      },
      'catalogues/clothing.swf': {
        'en': 'recreation:catalog/clothing_cpip.swf'
      },
      'catalogues/furniture.swf': {
        'en': 'recreation:catalog/furniture_cpip.swf'
      },
      'catalogues/adopt.swf': {
        'en': 'recreation:catalog/adopt_cpip.swf'
      },
      'catalogues/costume.swf': {
        'en': 'recreation:catalog/costume_cpip.swf'
      },
      'catalogues/hair.swf': {
        'en': 'recreation:catalog/hair_cpip.swf'
      },
      'catalogues/igloo.swf': {
        'en': 'recreation:catalog/igloo_cpip.swf'
      },
      'catalogues/sport.swf': {
        'en': 'recreation:catalog/sport_cpip.swf'
      },
      'catalogues/fish.swf': {
        'en': 'archives:TheFish2009.swf'
      },
      'catalogues/pets.swf': {
        en: 'archives:May2008LoveYourPet.swf'
      }
    },
    map: 'unknown:cpip_map_no_dojoext.swf',
    iglooList: {
      file: 'recreation:igloo_music/cpip_start.swf',
      hidden: true
    }
  },
  {
    date: '2008-07-18',
    furnitureCatalog: 'archives:FurnJul2008.swf',
    iglooList: [
      [{ display: 'Fiesta', id: 229, new: true }, { display: 'Jazz', id: 211 }],
      [{ display: 'Aqua Grabber', id: 114, new: true }, { display: 'Ocean Voyage', id: 212 }],
      [{ display: 'Medieval Town', id: 233, new: true }, { display: 'Cool Surf', id: 214 }],
      [{ display: 'Pizza Parlor', id: 20 }, { display: 'Coffee Shop', id: 1 }],
      [{ display: 'Superhero', id: 32 }, { display: 'Dance Mix 1', id: 2 }],
      [{ display: 'Fall Fair', id: 221 }, { display: 'Dance Mix 2', id: 5 }],
      [{ display: 'Folk Guitar', id: 209 }, { display: 'Water Party', id: 217 }]
    ],
    temp: {
      const: {
        rooms: {
          dance: 'recreation:mjam_08_const/dance.swf'
        }
      }
    }
  },
  {
    date: '2008-07-25',
    temp: {
      party: {
        partyName: 'Music Jam',
        rooms: {
          party: 'archives:RoomsParty1-MusicJam2008.swf',
          beach: 'archives:MJ2008Beach.swf',
          cave: 'archives:RoomsCave-MusicJam2008.swf',
          coffee: 'archives:RoomsCoffee-MusicJam2008.swf',
          cove: 'archives:RoomsCove-MusicJam2008.swf',
          lounge: 'archives:RoomsLounge-MusicJam2008.swf',
          dock: 'archives:MJDock1.swf',
          dojo: 'archives:RoomsDojo-MusicJam2008.swf',
          forest: 'archives:RoomsForest-MusicJam2008.swf',
          berg: 'archives:RoomsBerg-MusicJam2008.swf',
          rink: 'archives:MJ2008IceRink.swf',
          light: 'archives:RoomsLight-MusicJam2008.swf',
          mine: 'archives:RoomsMine-MusicJam2008.swf',
          dance: 'archives:RoomsDance-MusicJam2008.swf',
          pizza: 'archives:RoomsPizza-MusicJam2008.swf',
          village: 'archives:RoomsVillage-MusicJam2008.swf',
          town: 'archives:RoomsTown-MusicJam2008.swf',
          forts: 'archives:MJSnowForts.swf',
          plaza: 'fix:RoomsPlaza-MusicJam2008.swf'
        },
        music: {
          party: 243,
          coffee: 211,
          berg: 244,
          mine: 247,
          pizza: 210,
          plaza: 242,
          forts: 240,
          town: 242,
          dance: 242,
          lounge: 242
        },
        localChanges: {
          'catalogues/merch.swf': {
            'en': 'archives:MJ2008MerchCatalog.swf'
          },
          'close_ups/backstage_allaccesspass.swf': {
            'en': 'archives:MJ2008VIP.swf'
          },
          'catalogues/music.swf': {
            'en': 'archives:MJ2008MusicCatalog.swf'
          }
        }
      }
    }
  },
  {
    date: '2008-08-01',
    clothingCatalog: 'archives:PSAug2008.swf',
    temp: {
      party: {
        rooms: {
          dance: 'recreation:dance_record_pin_mjam.swf',
          cave: 'recreation:cave_mjam08_no_pin.swf'
        }
      }
    }
  },
  {
    date: '2008-08-05',
    roomComment: 'The Dance Club is updated post Music Jam',
    rooms: {
      dance: 'recreation:dance_record_pin.swf'
    },
    end: ['party']
  },
  {
    date: '2008-08-08',
    temp: {
      party: {
        partyName: 'Paper Boat Scavenger Hunt',
        decorated: false,
        rooms: {
          beach: 'archives:RoomsBeach-PaperBoatScavengerHunt2008.swf',
          cave: 'archives:RoomsCave-PaperBoatScavengerHunt2008.swf',
          coffee: 'archives:RoomsCoffee-PaperBoatScavengerHunt2008.swf',
          cove: 'archives:RoomsCove-PaperBoatScavengerHunt2008.swf',
          dock: 'archives:RoomsDock-PaperBoatScavengerHunt2008.swf',
          berg: 'archives:RoomsBerg-PaperBoatScavengerHunt2008.swf',
          shack: 'archives:RoomsShack-PaperBoatScavengerHunt2008.swf',
          pet: 'archives:RoomsPet-PaperBoatScavengerHunt2008.swf'
        },
        globalChanges: {
          'scavenger_hunt/hunt_ui.swf': ['archives:Boats-PaperBoatScavengerHunt2008.swf', 'scavenger_hunt_boat', 'easter_hunt'],
        },
        scavengerHunt2010: {
          iconFileId: 'archives:BoatIcon-PaperBoatScavengerHunt2008.swf'
        },
        migrator: 'archives:RockhopperRareItemsAug2008.swf'
      }
    },
    stagePlay: {
      name: 'Team Blue\'s Rally 2',
      costumeTrunk: 'archives:August2008Costume.swf',
      script: [
        {
          "note": "Team Blue\'s Rally 2"
        },
        {
          "note": "(Zeus on stage alone)"
        },
        {
          "name": "Zeus:",
          "message": "Oh no, it\'s time for the big game already!"
        },
        {
          "name": "Zeus:",
          "message": "I can\'t believe I have to do this by myself."
        },
        {
          "note": "(Jupiter & Bella enter)"
        },
        {
          "name": "Bella:",
          "message": "Hiya! I\'ll be the cheerleader for this match."
        },
        {
          "name": "Bella:",
          "message": "Wait until you hear my cool cheers!"
        },
        {
          "name": "Jupiter:",
          "message": "Ready for the big game there. Zeussy?"
        },
        {
          "name": "Zeus:",
          "message": "Um.... yes I am... err... who are you?"
        },
        {
          "name": "Jupiter:",
          "message": "The name\'s Jupiter."
        },
        {
          "name": "Zeus:",
          "message": "I guess you\'re here to help cheer on Team Blue?"
        },
        {
          "name": "Jupiter:",
          "message": "No way! I\'m here to make sure Red wins!"
        },
        {
          "name": "Bella:",
          "message": "RED IS GOOD! RED\'S THE BEST!"
        },
        {
          "name": "Bella:",
          "message": "BETTER THAN A YELLOW VEST! GOOOO RED!"
        },
        {
          "name": "Zeus:",
          "message": "But um.... I\'m supposed to be the moose mascot!"
        },
        {
          "name": "Zeus:",
          "message": "I thought Team Red\'s mascot was an alien!"
        },
        {
          "name": "Jupiter:",
          "message": "Antenna was LAST year\'s mascot!"
        },
        {
          "name": "Bella:",
          "message": "LAST YEAR\'S OUT! THIS YEAR\'S IN!"
        },
        {
          "name": "Bella:",
          "message": "See how my cheer was? Not too shabby, eh?"
        },
        {
          "note": "(Jeff the referee and both teams enter)"
        },
        {
          "name": "Jeff:",
          "message": "All right, everyone ready for some dodgeball?"
        },
        {
          "name": "Jupiter:",
          "message": "Never been more ready, Jeff!"
        },
        {
          "name": "Jupiter:",
          "message": "EVERYONE LEMME HEAR YA SAY MOOOSE!"
        },
        {
          "name": "Team Red:",
          "message": "MOOOSE!"
        },
        {
          "name": "Zeus:",
          "message": "Wait um.... hey.... that\'s MY line!"
        },
        {
          "name": "Jupiter:",
          "message": "No I\'m pretty sure it\'s MINE there, Zeussy!"
        },
        {
          "name": "Jeff:",
          "message": "Whoa, whoa, whoa! Time out!"
        },
        {
          "name": "Jeff:",
          "message": "Be a good sport! Cheers are for everyone!"
        },
        {
          "name": "Bella:",
          "message": "Yeah right, that\'s what he says."
        },
        {
          "note": "(Scoreboard breaks)"
        },
        {
          "name": "Jeff:",
          "message": "Oh great, now the scoreboard\'s broken!"
        },
        {
          "name": "Bella:",
          "message": "OOPS OOPS GOES THE CLOCK!"
        },
        {
          "name": "Bella:",
          "message": "USED TO TICK BUT NOW IT TOCKS!"
        },
        {
          "name": "Bella:",
          "message": "Ha! you didn\'t catch that one, did ya?"
        },
        {
          "name": "Zeus:",
          "message": "Maybe we could just play for fun instead?"
        },
        {
          "name": "Jupiter:",
          "message": "No way! You want this trophy back?"
        },
        {
          "name": "Jupiter:",
          "message": "You\'ll have to earn it!"
        },
        {
          "name": "Jupiter:",
          "message": "This is TEAM RED\'S time to shine!"
        },
        {
          "name": "Bella:",
          "message": "HE\'S GONNA SHINE THE CLOCK!"
        },
        {
          "name": "Jupiter:",
          "message": "Not THAT kind of shine, Bella."
        },
        {
          "name": "Bella:",
          "message": "Oh. I thought you were gonna fix the scoreboard."
        },
        {
          "name": "Zeus:",
          "message": "You know what?! I\'ve had enough of this!"
        },
        {
          "name": "Zeus:",
          "message": "YOU\'RE NOT THE ONLY MOOSE IN TOWN!"
        },
        {
          "name": "Zeus:",
          "message": "I\'m gonna show you who the original moose is!"
        },
        {
          "name": "Zeus:",
          "message": "I\'m gonna encourage my team to go on!"
        },
        {
          "name": "Zeus:",
          "message": "ARE YOU READY BLUE TEAM?!"
        },
        {
          "name": "Team Blue:",
          "message": "Yeah!"
        },
        {
          "name": "Zeus:",
          "message": "LEMME HEAR YA SAY MOOOOSE!"
        },
        {
          "name": "Team Blue:",
          "message": "MOOOOSE!"
        },
        {
          "name": "Zeus:",
          "message": "Now let\'s bring this trophy BACK HOME!"
        },
        {
          "name": "Bella:",
          "message": "LET\'S HEAR IT FOR TEAM BLUE!"
        },
        {
          "name": "Team Blue:",
          "message": "GO TEAM BLUE!"
        },
        {
          "name": "Jupiter:",
          "message": "We\'ll see who this trophy belongs to..."
        },
        {
          "name": "Jeff:",
          "message": "Game on!"
        },
        {
          "note": "(Whistle blows and the game begins while Bella and other cheerleaders start doing team cheers)"
        },
        {
          "note": "THE END"
        }
      ]
    },
    rooms: {
      stage: 'archives:Stage2011Aug17.swf',
      plaza: 'recreation:plaza_team_blues_rally_2.swf'
    }
  },
  {
    date: '2008-08-15',
    iglooCatalog: 'archives:August2008Igloo.swf',
    roomComment: 'DJ3K is redesigned in the Dance Club',
    rooms: {
      dance: 'recreation:dance_cpip_postmusicjam2.swf'
    }
  },
  {
    date: '2008-08-18',
    end: ['party']
  },
  {
    date: '2008-08-22',
    temp: {
      party: {
        partyStart: 'The Penguin Games party begins',
        partyEnd: 'The Penguin Games party ends',
        rooms: {
          'beach': 'archives:PGBeach.swf',
          book: 'archives:RoomsBook-PenguinGames.swf',
          cave: 'archives:RoomsCave-PenguinGames.swf',
          coffee: 'archives:RoomsCoffee-PenguinGames.swf',
          cove: 'archives:RoomsCove-PenguinGames.swf',
          dock: 'archives:RoomsDock-PenguinGames.swf',
          forest: 'archives:RoomsForest-PenguinGames.swf',
          berg: 'archives:RoomsBerg-PenguinGames.swf',
          rink: 'archives:PGIceRink.swf',
          attic: 'archives:PGLodgeAttic.swf',
          pizza: 'archives:RoomsPizza-PenguinGames.swf',
          plaza: 'archives:PGPlaza.swf',
          mtn: 'archives:PGSkiHill.swf',
          lodge: 'archives:PGSkiLodge.swf',
          village: 'archives:PGSkiVillage.swf',
          forts: 'archives:RoomsForts-PenguinGames.swf',
          sport: 'archives:PGSportShop.swf',
          town: 'archives:RoomsTown-PenguinGames.swf'
        },
        music: {
          beach: 213,
          book: 240,
          cave: 249,
          coffee: 240,
          cove: 213,
          dock: 213,
          forest: 213,
          berg: 249,
          rink: 240,
          attic: 248,
          pizza: 240,
          plaza: 213,
          mtn: 240,
          lodge: 248,
          village: 213,
          forts: 213,
          sport: 249,
          town: 213
        }
      }
    }
  },
  {
    date: '2008-08-26',
    end: ['party'],
    roomComment: 'The Soccer Pitch is now open for everyone, and temporarily replaces the Ice Rink',
    rooms: {
      rink: 'archives:RoomsRink_2.swf',
      town: 'archives:RoomsTown_2.swf',
      forts: 'archives:ESForts-SoccerPitch.swf'
    }
  },
  {
    date: '2008-08-29',
    furnitureCatalog: 'archives:FurnAug2008.swf'
  },
  {
    date: '2008-09-05',
    clothingCatalog: 'archives:Sep2008.swf',
    hairCatalog: 'archives:SptWigs.swf',
    constructionComment: 'A construction begins at the Plaza for the Stage',
    rooms: {
      stage: 'recreation:plaza_ruby_construction.swf',

    }
  },
  {
    date: '2008-09-12',
    stagePlay: {
      name: 'Ruby and the Ruby',
      costumeTrunk: 'archives:July09Costume.swf',
      script: [
        {
          "note": "Ruby and the Ruby"
        },
        {
          "note": "Scene 1"
        },
        {
          "name": "Hammer:",
          "message": "I was working late. A terrible storm was raging."
        },
        {
          "name": "Ruby:",
          "message": "You\'ve got to help me!"
        },
        {
          "name": "Hammer:",
          "message": "What\'s the problem, madam?"
        },
        {
          "name": "Ruby:",
          "message": "Someone has stolen my gemstone!"
        },
        {
          "name": "Hammer:",
          "message": "Jacque Hammer at your service."
        },
        {
          "name": "Ruby:",
          "message": "Let\'s work together."
        },
        {
          "name": "Hammer:",
          "message": "I work alone, Ms. Ruby."
        },
        {
          "name": "Ruby:",
          "message": "There was this fishy-looking guy outside."
        },
        {
          "name": "Hammer:",
          "message": "And you suspect him?"
        },
        {
          "name": "Ruby:",
          "message": "I saw him throw something in the bin..."
        },
        {
          "note": "Scene 2"
        },
        {
          "name": "Hammer:",
          "message": "The name\'s Hammer - Jacque Hammer."
        },
        {
          "name": "Hammer:",
          "message": "I\'ve got a few questions for you."
        },
        {
          "name": "Tenor:",
          "message": "Mind if I play hopscotch while you ask them?"
        },
        {
          "name": "Hammer:",
          "message": "What were you doing yesterday?"
        },
        {
          "name": "Tenor:",
          "message": "I was right here with my hopscotch gang."
        },
        {
          "name": "Hammer:",
          "message": "I bet you\'ve hopscotched away a few gems, right?"
        },
        {
          "name": "Tenor:",
          "message": "You\'re barking up the wrong tree, Hammer."
        },
        {
          "note": "Scene 3"
        },
        {
          "name": "Hammer:",
          "message": "There was nothing in the bin. I needed clues."
        },
        {
          "name": "Dom:",
          "message": "Hello Mr. Hammer. It\'s good to see you, sir."
        },
        {
          "name": "Hammer:",
          "message": "Seen anything suspicious, Dom?"
        },
        {
          "name": "Dom:",
          "message": "Sorry, Mr. Hammer, sir, I haven\'t."
        },
        {
          "name": "Hammer:",
          "message": "Where\'s Ms. Ruby?"
        },
        {
          "name": "Dom:",
          "message": "She\'s arranging the flowers across the hall, sir."
        },
        {
          "name": "Hammer:",
          "message": "That lady\'s trouble. I need to speak to her..."
        },
        {
          "name": "Dom:",
          "message": "Don\'t forget to sign the guestbook, sir."
        },
        {
          "note": "Scene 4"
        },
        {
          "name": "Hammer:",
          "message": "Anything else you can tell me, madam?"
        },
        {
          "name": "Ruby:",
          "message": "Haven\'t you found it yet? I\'m busy."
        },
        {
          "note": "(Ruby exits)"
        },
        {
          "name": "Hammer:",
          "message": "I found a note under a vase."
        },
        {
          "name": "Hammer:",
          "message": "The numbers looked like a combination."
        },
        {
          "note": "Scene 5"
        },
        {
          "name": "Hammer:",
          "message": "Here\'s your gem, Ms. Ruby. It was safe all along."
        },
        {
          "name": "Ruby:",
          "message": "Oh, jolly well done, Hammer."
        },
        {
          "name": "Hammer:",
          "message": "Another day, another crime solved."
        },
        {
          "note": "Fin."
        },
        {
          "note": "Director:"
        },
        {
          "name": "Director:",
          "message": "Scene 1. And, action!"
        },
        {
          "name": "Director:",
          "message": "Scene 2, from the top!"
        },
        {
          "name": "Director:",
          "message": "Scene 3, places please."
        },
        {
          "name": "Director:",
          "message": "Scene 4. Let\'s see some effort here."
        },
        {
          "name": "Director:",
          "message": "Ready for Scene 5?"
        },
        {
          "name": "Director:",
          "message": "Let\'s take it from the top."
        },
        {
          "name": "Director:",
          "message": "Can we have some quiet please?"
        },
        {
          "name": "Director:",
          "message": "Two minute call, actors and actresses to the stage."
        }
      ]
    },
    rooms: {
      stage: 'recreation:ruby_play_debut.swf',
      plaza: 'recreation:plaza_ruby_no_weather.swf'
    }
  },
  {
    date: '2008-09-19',
    furnitureCatalog: 'archives:FurnSep2008.swf'
  },
  {
    date: '2008-09-26',
    temp: {
      party: {
        partyName: 'Fall Fair',
        rooms: {
          beach: 'archives:FFBeach.swf',
          beacon: 'archives:FFBeacon.swf',
          cave: 'archives:FFCave.swf',
          coffee: 'archives:FFCoffeeShop.swf',
          cove: 'archives:FFCove.swf',
          dance: 'archives:FFDanceClub.swf',
          lounge: 'archives:RoomsLounge-FallFair2008.swf',
          dock: 'archives:FFDock.swf',
          forest: 'archives:FFForest.swf',
          berg: 'archives:FFIceBerg.swf',
          mine: 'archives:FFMine.swf',
          party: 'archives:FFParty.swf',
          pizza: 'archives:FFPizzaParlor.swf',
          mtn: 'archives:FFSkiHill.swf',
          village: 'archives:FFSkiVillage.swf',
          forts: 'archives:FFSnowForts.swf',
          town: 'archives:FFTown.swf'
        },
        music: {
          beach: 221,
          beacon: 221,
          cave: 221,
          coffee: 221,
          cove: 221,
          dance: 221,
          lounge: 221,
          dock: 221,
          forest: 221,
          berg: 221,
          mine: 221,
          party: 221,
          pizza: 221,
          mtn: 221,
          village: 221,
          forts: 221,
          town: 221
        },
        fairCpip: {
          iconFileId: 'archives:Ticket_icon-TheFair2009.swf',
          infoFile: 'recreation:fair_08_ticket_info.swf'
        }
      }
    }
  },
  {
    date: '2008-09-30',
    temp: {
      party: {
        update: 'The plaza was decorated',
        rooms: {
          plaza: 'recreation:fair_2008_plaza_decorated.swf'
        },
        music: {
          plaza: 221
        }
      }
    }
  },
  {
    date: '2008-10-03',
    clothingCatalog: 'archives:CatOct2008.swf'
  },
  {
    date: '2008-10-06',
    end: ['party']
  },
  {
    date: '2008-10-07',
    miscComments: ['Mission 9: Operation: Spy & Seek is added'],
    localChanges: {
      'forms/missions.swf': {
        en: 'recreation:forms_missions/m9.swf'
      }
    }
  },
  {
    date: '2008-10-10',
    stagePlay: {
      name: 'Space Adventure Planet Y',
      costumeTrunk: 'archives:October2008Costume.swf',
      script: [
        {
          "note": "Planet Y"
        },
        {
          "name": "Captain:",
          "message": "Captain\'s journal, entry 30:16..."
        },
        {
          "name": "Captain:",
          "message": "The SS Astro Barrier returns to Club Penguin..."
        },
        {
          "name": "Ensign:",
          "message": "Speed set to carp five."
        },
        {
          "name": "Zip:",
          "message": "Wait! Watch out for the-"
        },
        {
          "note": "(Asteroid hits the SS Astro Barrier)"
        },
        {
          "name": "Robot:",
          "message": "TWEEE-BEEP! ERROR 6000! DIRECT HIT!"
        },
        {
          "name": "Zip:",
          "message": "...asteroid!"
        },
        {
          "name": "Ensign:",
          "message": "Captain, it\'s thrown us off course!"
        },
        {
          "name": "Captain:",
          "message": "Engage the carp drive. Full reverse!"
        },
        {
          "name": "Robot:",
          "message": "BEEP BEEP! CARP DRIVE FAILURE."
        },
        {
          "name": "Ensign:",
          "message": "Negative Captain. It\'s not working."
        },
        {
          "name": "Zip:",
          "message": "Have you tried clearing the cache?"
        },
        {
          "name": "Ensign:",
          "message": "I\'ve tried, but it won\'t reload!"
        },
        {
          "name": "Captain:",
          "message": "Emergency Crash landing-that planet will do."
        },
        {
          "name": "Robot:",
          "message": "GLEEEEEEP! OVERHEATING!"
        },
        {
          "name": "Zip:",
          "message": "No, not Planet Y! My rivals the Qs live here!"
        },
        {
          "note": "(Ship crashes into building)"
        },
        {
          "name": "Qua:",
          "message": "Visitors, you\'ve disturbed our meeting..."
        },
        {
          "name": "Quip:",
          "message": "So you have our old robot, Tin Can. Greetings."
        },
        {
          "name": "Qua:",
          "message": "We\'re planning to make a giant space craft."
        },
        {
          "name": "Quip:",
          "message": "Tin Can 3000, help us get ship parts. Now!"
        },
        {
          "name": "Robot:",
          "message": "NEW ORDER RECEIVED. REPROGRAMMING."
        },
        {
          "name": "Zip:",
          "message": "Wait! Remember space directive 402?"
        },
        {
          "name": "Captain:",
          "message": "The bot exchange agreement! Quick thinking, Zip!"
        },
        {
          "name": "Quip:",
          "message": "They own the bot. He can\'t destroy the craft..."
        },
        {
          "name": "Qua:",
          "message": "Let\'s do it ourselves-we\'ll be fast!"
        },
        {
          "name": "Zip:",
          "message": "Restart the bot, and let\'s get out of here."
        },
        {
          "name": "Robot:",
          "message": "REBOOTING. REBOOTING. REBOOTING."
        },
        {
          "name": "Robot:",
          "message": "GLEEEP! ENGINE TERMINATED. JET FUEL LOW!"
        },
        {
          "name": "Ensign:",
          "message": "No! How are we going to get back this time?"
        },
        {
          "name": "Robot:",
          "message": "ZWEEEP! ABORT, RETRY, FAIL?"
        },
        {
          "name": "Captain:",
          "message": "Retry. Tin Can, use ice cream for fuel."
        },
        {
          "name": "Zip:",
          "message": "It\'s working! Let\'s get out of here."
        },
        {
          "name": "Captain:",
          "message": "Set a course for the Iceberg. Carp 5. Engage!"
        },
        {
          "name": "Quip:",
          "message": "We shall meet again, Captain Snow..."
        },
        {
          "note": "THE END"
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
          "message": "5 minute call, actors to the stage."
        },
        {
          "name": "Director:",
          "message": "Let\'s take it from the top!"
        },
        {
          "name": "Director:",
          "message": "It\'s a wrap!"
        }
      ]
    },
    rooms: {
      stage: 'archives:RoomsStage-November2010.swf',
      plaza: 'archives:RoomsPlaza-Play9.swf'
    }
  },
  {
    date: '2008-10-17',
    furnitureCatalog: 'archives:FurnOct2008.swf',
    iglooList: [
      [{ display: 'Halloween', id: 223, new: true }, { display: 'Pizza Parlor', id: 20 }],
      [{ display: 'Halloween Dance', id: 224, new: true }, { display: 'Ocean Voyage', id: 212 }],
      [{ display: 'Epic Battle', id: 236, new: true }, { display: 'Cool Surf', id: 214 }],
      [{ display: 'Aqua Grabber', id: 114 }, { display: 'Coffee Shop', id: 1 }],
      [{ display: 'Medieval Town', id: 233 }, { display: 'Superhero', id: 32 }],
      [{ display: 'Fiesta', id: 229 }, { display: 'Dance Mix', id: 5 }],
      [{ display: 'Fall Fair', id: 221 }, { display: 'Water Party', id: 217 }]
    ],
    migrator: 'archives:RHRIOct2008.swf'
  },
  {
    date: '2008-10-24',
    miscComments: ['The start screen is updated with the introduction of Unlock Items Online'],
    fileChanges: {
      'play/v2/client/startscreen.swf': 'recreation:startscreen/unlock_items.swf',
      'play/v2/client/login.swf': 'archives:ClientLogin2008.swf'
    },
    localChanges: {
      'forms/library.swf': {
        en: 'recreation:library/yearbook_08.swf'
      }
    },
    startscreens: [ 'recreation:startscreen/unlock_items_logo.swf' ],
    temp: {
      party: {
        partyName: '3rd Anniversary Party',
        rooms: {
          book: 'archives:3rdAnniversaryPartyBook.swf',
          coffee: 'archives:3rdAnniversaryPartyCoffee.swf',
          dance: 'archives:3rdAnniversaryPartyDance.swf',
          town: 'archives:3rdAnniversaryPartyTown.swf'
        },
        music: {
          book: 250,
          coffee: 250,
          dance: 250,
          town: 250
        }
      }
    }
  },
  {
    date: '2008-10-27',
    migrator: false,
    end: ['party']
  },
  {
    date: '2008-10-28',
    temp: {
      party: {
        partyName: 'Halloween Party',
        partyIcon: 'halloween',
        rooms: {
          beach: 'archives:HPBeach.swf',
          beacon: 'archives:HPBeacon.swf',
          book: 'archives:HPBookRoom.swf',
          cave: 'archives:HPCave.swf',
          coffee: 'archives:HPCoffeeShop.swf',
          cove: 'archives:HPCove.swf',
          dance: 'archives:HPDanceClub.swf',
          lounge: 'archives:RoomsLounge-Halloween2008.swf',
          dock: 'archives:HPDock.swf',
          dojo: 'archives:HPDojo.swf',
          forest: 'archives:HPForest.swf',
          shop: 'archives:HPGiftShop.swf',
          berg: 'archives:HPIceBerg.swf',
          light: 'archives:HPLightHouse.swf',
          attic: 'archives:HPLodgeAttic.swf',
          rink: 'archives:HPIceRink.swf',
          shack: 'archives:HPMineShack.swf',
          pet: 'archives:HPPetShop.swf',
          pizza: 'archives:HPPizzaParlor.swf',
          plaza: 'archives:HPPlaza.swf',
          party: 'archives:RoomsLab-HalloweenParty2008.swf',
          mtn: 'archives:HPSkiHill.swf',
          lodge: 'archives:HPSkiLodge.swf',
          village: 'archives:HPSkiVillage.swf',
          forts: 'archives:HPSnowForts.swf',
          sport: 'archives:HPSportShop.swf',
          town: 'archives:HPTown.swf'
        },
        music: {
          beach: 251,
          beacon: 251,
          book: 252,
          cave: 252,
          coffee: 252,
          cove: 251,
          dance: 224,
          lounge: 224,
          dock: 251,
          dojo: 252,
          forest: 251,
          shop: 252,
          berg: 251,
          light: 252,
          attic: 252,
          rink: 251,
          shack: 251,
          pet: 252,
          pizza: 252,
          plaza: 251,
          party: 253,
          mtn: 251,
          lodge: 252,
          village: 251,
          forts: 251,
          sport: 252,
          town: 251
        },
        globalChanges: {
          'igloo/assets/igloo_background.swf': 'recreation:halloween_2008/igloo_background.swf',
          'telescope/empty.swf': 'recreation:telescope/far_halloween.swf'
        }
      }
    }
  },
  {
    date: '2008-11-02'
  },
  {
    date: '2008-11-03',
    end: ['party'],
    temp: {
      party2: {
        partyStart: 'The Dig Out the Dojo event begins',
        partyEnd: 'The Dig Out the Dojo event ends',
        decorated: false,
        rooms: {
          dojo: 'archives:DojoConstruction2008.swf',
          dojoext: 'archives:DojoExtConstruction2008.swf'
        }
      }
    }
  },
  {
    date: '2008-11-05',
    temp: {
      party: {
        partyStart: 'A fireworks celebration begins at the Ski Hill',
        partyEnd: 'The fireworks celebration ends',
        decorated: false,
        rooms: {
          mtn: 'recreation:mtn_fireworks.swf'
        }
      }
    }
  },
  {
    date: '2008-11-07',
    end: ['party'],
    clothingCatalog: 'archives:CatNov2008.swf',
    hairCatalog: 'archives:NovWigs.swf'
  },
  {
    date: '2008-11-10',
    temp: {
      party2: {
        update: 'The excavation progresses, and less snow covers the Dojo',
        rooms: {
          dojo: 'archives:DojoConstruction22008.swf',
          dojoext: 'archives:DojoExtConstruction22008.swf'
        }
      }
    }
  },
  {
    date: '2008-11-14',
    end: ['party2'],
    roomComment: 'The dojo has a great reopening',
    rooms : {
      dojo: 'archives:DojoGrandOpening2008.swf',
      dojoext: 'archives:DojoExtGrandOpening2008.swf'
    },
    music: {
      dojo: 21,
      dojoext: 21
    },
    map: 'archives:Map2008-2011Stadium.swf'
  },
  {
    date: '2008-11-17',
    roomComment: 'The dojo now has the Card-Jitsu game',
    rooms: {
      dojo: 'archives:RoomsDojo.swf',
      dojohide: 'archives:RoomsDojohide-1.swf',
      // this file we have has the white puffle, which I believe is only from the puffle party 2009
      dojoext: 'archives:RoomsDojoext2008.swf'
    },
    music: {
      dojoext: 0
    }
  },
  {
    date: '2008-11-18',
    rooms: {
      // first time stadium was added, seemingly
      agent: 'recreation:agent_2008_nov.swf'
    }
  },
  {
    date: '2008-11-21',
    stagePlay: {
      name: 'Fairy Fables',
      costumeTrunk: 'archives:Jan10Stage.swf',
      script: [
        { note: "Fairy Fables" },
        { name: "Twee:",message: "Once upon a time a prince dressed all in red..." },
        { name: "Redhood:",message:"Red?! Are you sure? It\'s not really my color." },
        { name: "Twee:",message:"Don\'t interrupt! I said he was dressed in RED!" },
        { name: "Redhood:",message: "Oh. All right, then. What a lovely day!" },
        { name: "Twee:",message: "He was taking croissants to a hungry princess." },
        { name: "Redhood:",message: "Golly, I hope she like pastries." },
        { name: "Twee:",message: "But suddenly, something jumped out of the trees!" },
        { name: "Redhood:",message: "Oh no! A scary looking sheep!" },
        { name: "Big Bad Wool:",message:"BAA! I am the Big Bad Wool and I\'m hungry!" },
        { name: "Redhood:",message:"What great big teeth you\'ve got!" },
        { name: "Big Bad Wool:",message: "All the better to eat croissants with!" },
        { name: "Redhood:",message:"No chance, Woolly! They\'re for the princess." },
        { name: "Big Bad Wool:",message:"BAA! Then I\'ll huff and I\'ll puff..." },
        { name: "Twee:",message: "And the Big Bad Wool blew all the trees down." },
        { name: "Redhood:",message: "Oh no! What am I going to do?" },
        { name: "Twee:",message: "You need to distract the sheep, of course!" },
        { name: "Redhood:",message: "Oh yes. Look over there!" },
        { name: "Big Bad Wool:",message: "A unicorn flying through the sky? BAA-zaa!" },
        { name: "Redhood:",message: "Aha, now I can escape!" },
        { name: "Twee:",message: "Finally the prince arrived at the castle." },
        { name: "Redhood:",message:"Now I will climb up Grumpunzel\'s long hair." },
        { name: "Twee:",message:"You\'ll have to make do with a ladder." },
        { name: "Redhood:",message: "If I must..." },
        { name: "Grumpunzel:",message: "La la la la..." },
        { name: "Redhood:",message:"She\'s totally lost in la-la-land. What do I do now?" },
        { name: "Twee:",message: "Throw a magic snowball at her, of course!" },
        { note: "(Redhood throws a snowball at Grumpunzel)" },
        { name: "Grumpunzel:",message:"Oi! What do you think you\'re doing?" },
        { name: "Redhood:",message:"Princess! I\'ve brought you some croissants!" },
        { name: "Grumpunzel:",message: "Croissants? I asked for COOKIES!" },
        { name: "Redhood:",message:"Guess they don\'t call her Grumpunzel for nothing" },
        { name: "Twee:",message: "I think she should go back to la-la-land. ZAP!" },
        { name: "Big Bad Wool:",message:"BAA! Excuse me! I\'m really hungry here!" },
        { name: "Twee:",message:"Well there are plenty of croissants to go \'round." },
        { name: "Redhood:",message:"You\'d better not wool them all down at once." },
        { name: "Twee:",message: "And they lived happily ever after." },
        { note: "THE END." },
        { note: "Twee Gives A Tour Of The Stage" },
        { name: "Twee:",message: "Welcome to my Tree of Twos!" },
        { name: "Twee:",message: "Let me show you around a bit." },
        { name: "Twee:",message: "I love my books. I have two of every one." },
        { name: "Twee:",message: "See my boombox? It has two speakers!" },
        { name: "Twee:",message: "I wanted two unicorns, but I ran out of glue." },
        { name: "Twee:",message: "I tried to have two princes in this play, too." },
        { name: "Twee:",message: "This is my chair, made of two types of wood!" },
        { name: "Twee:",message: "And the pond took me two days to make!" },
        { name: "Twee:",message: "Hope you liked the tour. Enjoy the play!" }
      ]
    },
    rooms: {
      stage: 'archives:RoomsStage-June2009.swf',
      plaza: 'archives:RoomsPlaza-Play10.swf'
    }
  },
  {
    date: '2008-11-24',
    roomComment: 'A room for elite penguins opens',
    rooms: {
      agent: 'archives:RoomsAgent.swf',
      agentcom: 'archives:RoomsAgentcomFormer.swf'
    }
  },
  {
    date: '2008-12-05',
    clothingCatalog: 'archives:December08Style.swf'
  },
  {
    date: '2008-12-12',
    furnitureCatalog: 'archives:FurnDec2008.swf',
    iglooList: [
      [{ display: 'Snowy Holiday', id: 227, new: true }, { display: 'Cool Surf', id: 214 }],
      [{ display: 'Christmas Piano Medley', id: 255, new: true }, { display: 'Ocean Voyage', id: 212 }],
      [{ display: 'Anniversary Party', id: 250, new: true }, { display: 'Medieval Town', id: 233 }],
      [{ display: 'Pop Song', id: 243 }, { display: 'Epic Battle', id: 236 }],
      [{ display: 'Team Blue 2', id: 36 }, { display: 'Superhero', id: 32 }],
      [{ display: 'Fiesta', id: 229 }, { display: 'Aqua Grabber', id: 114 }],
      [{ display: 'Fall Fair', id: 221 }, { display: 'Water Party', id: 217 }]
    ],
    migrator: 'recreation:pirate_catalog/08_12.swf',
    stagePlay: {
      name: 'Quest for the Golden Puffle',
      costumeTrunk: 'archives:December2008Costume.swf',
      script: [
        {
          "note": "Quest for the Golden Puffle"
        },
        {
          "name": "Yukon:",
          "message": "We have to be careful in this pyramid, Alaska!"
        },
        {
          "name": "Alaska:",
          "message": "Can\'t find rare puffles without a little danger..."
        },
        {
          "name": "Alaska:",
          "message": "Hey look, a switch! Wonder what it does..."
        },
        {
          "name": "Yukon:",
          "message": "Oh no! Run! It\'s a snowball trap!"
        },
        {
          "name": "Alaska:",
          "message": "What\'s an adventure without a few traps?"
        },
        {
          "name": "Yukon:",
          "message": "That was close! Told you we should be careful!"
        },
        {
          "name": "Alaska:",
          "message": "Careful is my middle name."
        },
        {
          "name": "Yukon:",
          "message": "Look! The Golden Puffle! Let\'s get it!"
        },
        {
          "name": "Alaska:",
          "message": "I\'ve been waiting a long, long time for this..."
        },
        {
          "note": "(Door opens and Boris appears)"
        },
        {
          "name": "Boris:",
          "message": "TUMMMMMMY!"
        },
        {
          "name": "King Ra-Ra:",
          "message": "Halt! Who dares to enter the great pyramid!"
        },
        {
          "name": "Alaska:",
          "message": "Quick, Yukon! Grab the Golden Puffle!"
        },
        {
          "name": "Yukon:",
          "message": "Got it! Let\'s get out of here!"
        },
        {
          "name": "Boris:",
          "message": "TUMMMMMY!"
        },
        {
          "name": "King Ra-Ra:",
          "message": "Don\'t let them take it, Boris!"
        },
        {
          "name": "Alaska:",
          "message": "We\'ve gotta get out of here... fast!"
        },
        {
          "name": "Yukon:",
          "message": "Oh no! We\'re trapped in the pyramid!"
        },
        {
          "name": "Alaska:",
          "message": "You can say that again."
        },
        {
          "name": "Yukon:",
          "message": "Oh no! We\'re trapped in the pyramid!"
        },
        {
          "name": "Boris:",
          "message": "TUMMMMMY!"
        },
        {
          "name": "King Ra-Ra:",
          "message": "You can\'t escape the great pyramid!"
        },
        {
          "name": "King Ra-Ra:",
          "message": "Now give us the Golden Puffle!"
        },
        {
          "name": "Alaska:",
          "message": "I don\'t give up my quests that easy, Ra-Ra!"
        },
        {
          "name": "Boris:",
          "message": "TUMMMMMY!"
        },
        {
          "name": "Yukon:",
          "message": "Wait! I think I know how to stop all of this!"
        },
        {
          "note": "(Yukon gives Boris the Golden Puffle)"
        },
        {
          "name": "Boris:",
          "message": "TUM MEEEEE!"
        },
        {
          "name": "Alaska:",
          "message": "What are you doing Yukon?! That\'s my treasure!"
        },
        {
          "note": "(Boris unwraps the Golden puffle)"
        },
        {
          "name": "Yukon:",
          "message": "It\'s a puffle-shaped chocolate in gold wrapper!"
        },
        {
          "name": "King Ra-Ra:",
          "message": "That\'s right! And Boris was really hungry!"
        },
        {
          "name": "Boris:",
          "message": "YUMMMMMMY!"
        },
        {
          "name": "King Ra-Ra:",
          "message": "That\'s why we had to get it back!"
        },
        {
          "name": "Alaska:",
          "message": "Sigh. Guess it\'s not the rare puffle I thought."
        },
        {
          "name": "King Ra-Ra:",
          "message": "Oh, but it is rare!"
        },
        {
          "name": "King Ra-Ra:",
          "message": "It is made of the island\'s rarest dark chocolate!"
        },
        {
          "name": "Yukon:",
          "message": "These weren\'t the puffles we were looking for."
        },
        {
          "name": "Alaska:",
          "message": "Do not fear, Yukon! New adventures await!"
        },
        {
          "name": "King Ra-Ra:",
          "message": "Hmmm...where did I put that snowball of mine?"
        },
        {
          "name": "Alaska:",
          "message": "Onwards to victory and the rarest puffles!"
        },
        {
          "name": "Boris:",
          "message": "THAT\'S A WRAP!"
        },
        {
          "note": "THE END"
        },
        {
          "note": "Director"
        },
        {
          "name": "Director:",
          "message": "Places everyone!"
        },
        {
          "name": "Director:",
          "message": "Take it again from the top!"
        },
        {
          "name": "Director:",
          "message": "Excellent work, team. Keep it up!"
        },
        {
          "name": "Director:",
          "message": "That\'s a wrap!"
        },
        {
          "name": "Director:",
          "message": "Take a bow everyone!"
        }
      ]
    },
    rooms: {
      stage: 'archives:RoomsStage-May2010.swf',
      plaza: 'recreation:plaza_golden_puffle_no_weather.swf'
    }
  },
  {
    date: '2008-12-19',
    temp: {
      party: {
        partyName: 'Christmas Party',
        rooms: {
          beach: 'archives:RoomsBeach-ChristmasParty2008.swf',
          beacon: 'archives:RoomsBeacon-ChristmasParty2008.swf',
          boiler: 'archives:RoomsBoiler-ChristmasParty2008.swf',
          book: 'archives:RoomsBook-ChristmasParty2008.swf',
          shipquarters: 'archives:RoomsShipquarters-ChristmasParty2008.swf',
          cave: 'archives:RoomsCave-ChristmasParty2008.swf',
          coffee: 'archives:RoomsCoffee-ChristmasParty2008.swf',
          agentcom: 'archives:RoomsAgentcom-ChristmasParty2008.swf',
          cove: 'archives:RoomsCove-ChristmasParty2008.swf',
          shipnest: 'archives:RoomsShipnest-ChristmasParty2008.swf',
          lounge: 'archives:RoomsLounge-ChristmasParty2008.swf',
          dock: 'archives:RoomsDock-ChristmasParty2008.swf',
          dojo: 'archives:RoomsDojo-ChristmasParty2008.swf',
          dojoext: 'archives:RoomsDojoext-ChristmasParty2008.swf',
          forest: 'archives:RoomsForest-ChristmasParty2008.swf',
          agent: 'archives:RoomsAgent-ChristmasParty2008.swf',
          rink: 'archives:RoomsRink-ChristmasParty2008.swf',
          berg: 'archives:RoomsBerg-ChristmasParty2008.swf',
          mine: 'archives:RoomsMine-ChristmasParty2008.swf',
          shack: 'archives:RoomsShack-ChristmasParty2008.swf',
          dance: 'archives:RoomsDance-ChristmasParty2008.swf',
          dojohide: 'archives:RoomsDojohide-ChristmasParty2008.swf',
          ship: 'archives:RoomsShip-ChristmasParty2008.swf',
          pizza: 'archives:RoomsPizza-ChristmasParty2008.swf',
          plaza: 'archives:RoomsPlaza-ChristmasParty2008.swf',
          shiphold: 'archives:RoomsShiphold-ChristmasParty2008.swf',
          mtn: 'archives:RoomsMtn-ChristmasParty2008.swf',
          lodge: 'archives:RoomsLodge-ChristmasParty2008.swf',
          village: 'archives:RoomsVillage-ChristmasParty2008.swf',
          forts: 'archives:RoomsForts-ChristmasParty2008.swf',
          town: 'archives:RoomsTown-ChristmasParty2008.swf'
        },
        music: {
          beach: 254,
          beacon: 254,
          boiler: 256,
          book: 255,
          shipquarters: 254,
          cave: 256,
          coffee: 255,
          cove: 254,
          shipnest: 254,
          lounge: 226,
          dock: 254,
          dojo: 256,
          dojoext: 254,
          forest: 254,
          rink: 254,
          berg: 254,
          mine: 256,
          shack: 255,
          dance: 226,
          dojohide: 256,
          ship: 254,
          pizza: 256,
          plaza: 254,
          shiphold: 254,
          mtn: 254,
          lodge: 254,
          village: 254,
          forts: 254,
          town: 254,
          light: 254
        }
      }
    },
    roomComment: 'The Ice Rink returns',
    rooms: {
      town: 'archives:RoomsTown.swf',
      forts: 'archives:FortsWithIceRinkStadium.swf',
      rink: 'archives:RoomsRink.swf',
      agent: 'archives:RoomsAgent.swf'
    },
    map: 'archives:Map2008-2011Rink.swf'
  },
  {
    date: '2008-12-22',
    migrator: false
  },
  {
    date: '2008-12-23',
    miscComments: ['The start screen is updated'],
    fileChanges: {
      'play/v2/client/startscreen.swf': 'slegacy:media/play/v2/client/startscreen.swf',
    },
    startscreens: [
      ['access_more.swf', 'slegacy:media/play/v2/content/local/en/login/backgrounds/access_more.swf'],
      ['celebrate_more.swf', 'slegacy:media/play/v2/content/local/en/login/backgrounds/celebrate_more.swf'],
      ['create_more.swf', 'slegacy:media/play/v2/content/local/en/login/backgrounds/create_more.swf'],
      ['explore_more.swf', 'slegacy:media/play/v2/content/local/en/login/backgrounds/explore_more.swf']
    ]
  },
  {
    date: '2008-12-29',
    end: ['party'],
    miscComments: ['Mission 10: Waddle Squad is added'],
    localChanges: {
      'forms/missions.swf': {
        en: 'archives:FormsMissionsM10.swf'
      }
    },
    roomComment: 'Snow is stored in the Attic',
    temp: {
      'attic-snow': {
        rooms: {
          attic: 'recreation:attic_dec08.swf'
        }
      }
    }
  }
];