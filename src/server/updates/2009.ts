import { Update } from ".";

export const UPDATES_2009: Update[] = [
  {
    date: '2009-01-02',
    clothingCatalog: 'archives:January09Style.swf',
    roomComment: 'The Big Wigs Catalog is merged with the Penguin Style',
    rooms: {
      shop: 'archives:RoomsShop.swf'
    },
    end: ['party2']
  },
  {
    date: '2009-01-09',
    stagePlay: {
      name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
      costumeTrunk: 'archives:January2009Costume.swf',
      notPremiere: true,
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
        { note: "THE END" },
        { note: "Director" },
        { name: "Director:", message: "Places please!" },
        { name: "Director:", message: "5 minute call, actors to the stage." },
        { name: "Director:", message: "Let\'s take it from the top!" },
        { name: "Director:", message: "It\'s a wrap!" }
      ]
    },
    rooms: {
      stage: 'archives:StageSquidzoidJan09.swf',
      plaza: 'recreation:plaza_squidzoid_sign.swf'
    }
  },
  {
    date: '2009-01-15',
    temp: {
      party: {
        partyName: 'Dance-A-Thon',
        rooms: {
          boiler: 'archives:RoomsBoiler-DanceAThon.swf',
          lounge: 'archives:RoomsLounge-DanceAThon.swf',
          dance: 'archives:RoomsDance-DanceAThon.swf',
          party: 'archives:RoomsParty-DanceAThon.swf',
          town: 'archives:RoomsTown-DanceAThon.swf'
        },
        music: {
          dance: 258,
          party: 257,
          lounge: 0
        }
      }
    }
  },
  {
    date: '2009-01-16',
    furnitureCatalog: 'archives:FurnJan2009.swf',
    roomComment: 'The sign in the Attic is now bold',
    // possible to-do, have CPUpdates inside pin start dates? this update is directly related to the pin
    temp: {
      'attic-snow': {
        rooms: {
          attic: 'archives:WinterFiesta2009SkiLodge.swf'
        }
      }
    }
  },
  {
    date: '2009-01-19',
    miscComments: ['Members can now see a special badge on their own player card'],
    fileChanges: {
      'play/v2/client/interface.swf': 'recreation:interfaces/membership_badge.swf'
    }
  },
  {
    date: '2009-01-20',
    end: ['party'],
    rooms: {
      dance: 'recreation:dance_no_game_upgrades.swf'
    },
  },
  {
    date: '2009-01-23',
    temp: {
      party: {
        partyName: 'Winter Fiesta',
        rooms: {
          beach: 'archives:WinterFiesta2009Beach.swf',
          coffee: 'archives:WinterFiesta2009Coffee.swf',
          cove: 'archives:WinterFiesta2009Cove.swf',
          dock: 'archives:WinterFiesta2009Dock.swf',
          forest: 'archives:WinterFiesta2009Forest.swf',
          dance: 'archives:WinterFiesta2009Dance.swf',
          pizza: 'archives:WinterFiesta2009Pizza.swf',
          plaza: 'archives:WinterFiesta2009Plaza.swf',
          village: 'archives:WinterFiesta2009Village.swf',
          forts: 'archives:WinterFiesta2009Forts.swf',
          town: 'archives:WinterFiesta2009Town.swf'
        },
        music: {
          beach: 229,
          coffee: 229,
          cove: 206,
          dock: 229,
          forest: 206,
          dance: 206,
          pizza: 206,
          plaza: 206,
          lodge: 229,
          village: 229,
          forts: 206,
          town: 206
        }
      }
    }
  },
  {
    date: '2009-01-25',
    end: ['party']
  },
  {
    date: '2009-01-29',
    miscComments: ['The membership badge can now be seen in other player cards'],
    fileChanges: {
      'play/v2/client/interface.swf': 'recreation:interfaces/membership_badge_2.swf'
    }
  },
  {
    date: '2009-02-03',
    miscComments: ['The Lime Green Dojo Clean book is added'],
    localChanges: {
      'forms/library.swf': {
        en: 'recreation:library/lime_green.swf'
      }
    }
  },
  {
    date: '2009-02-06',
    clothingCatalog: 'archives:CatFeb2009.swf'
  },
  {
    date: '2009-02-13',
    temp: {
      const: {
        rooms: {
          beacon: 'archives:RoomsBeacon-PuffleParty2009Pre.swf',
          cave: 'archives:RoomsCave-PuffleParty2009Pre.swf',
          cove: 'archives:RoomsCove-PuffleParty2009Pre.swf',
          forest: 'archives:RoomsForest-PuffleParty2009Pre.swf',
          berg: 'archives:RoomsBerg-PuffleParty2009Pre.swf',
          light: 'archives:RoomsLight-PuffleParty2009Pre.swf',
          dance: 'archives:RoomsDance-PuffleParty2009Pre.swf',
          plaza: 'archives:RoomsPlaza-PuffleParty2009Pre.swf',
          village: 'archives:RoomsVillage-PuffleParty2009Pre.swf',
          town: 'archives:RoomsTown-PuffleParty2009Pre.swf'
        }
      }
    },
    stagePlay: {
      name: 'Team Blue vs. Team Red',
      costumeTrunk: 'archives:February2009Costume.swf',
      script: [
        {
          "note": "Team Blue vs. Team Red"
        },
        {
          "note": "(A dodgeball event taking place in a high school)"
        },
        {
          "name": "Jeff:",
          "message": "It\'s the final match of the Dodgeball championship!"
        },
        {
          "name": "Zeus:",
          "message": "Alright, here we go. Don\'t get nervous. Don\'t get nervous."
        },
        {
          "name": "Tate:",
          "message": "Arr! Don\'t worry Zeus, we\'re ready for this. Chin up, sailor!"
        },
        {
          "name": "Zeus:",
          "message": "I\'ll try."
        },
        {
          "name": "Jeff:",
          "message": "In this corner, those marvelous mascots, the BLUE TEAM!"
        },
        {
          "name": "Jeff:",
          "message": "And in this corner, the defending champs, the RED"
        },
        {
          "name": "Scarlet:",
          "message": "Well, this should be easy. right Eric?"
        },
        {
          "name": "Eric:",
          "message": ". . ."
        },
        {
          "name": "Scarlet:",
          "message": "Haha! Good one!"
        },
        {
          "name": "Jeff:",
          "message": "Alright guys, I want a nice friendly game. I mean it."
        },
        {
          "name": "Scarlet:",
          "message": "You got it ref. A nice SHORT friendly game."
        },
        {
          "name": "Tate:",
          "message": "Hey! I heard that!"
        },
        {
          "name": "Jeff:",
          "message": "Alright, here we go. GAME ON!"
        },
        {
          "name": "Scarlet:",
          "message": "Ready or not, here comes my super ultra mega power ball!"
        },
        {
          "note": "(Scarlet throws a dodge ball.)"
        },
        {
          "name": "Zeus:",
          "message": "Yikes! That almost took my antlers off!"
        },
        {
          "name": "Tate:",
          "message": "Look out Zeus!"
        },
        {
          "note": "(Eric throws a dodge ball and misses.)"
        },
        {
          "name": "Tate:",
          "message": "HA! Is that all you got?"
        },
        {
          "name": "Eric:",
          "message": ". . ."
        },
        {
          "note": "(Eric throws a dodge ball, and pegs Tate!)"
        },
        {
          "name": "Tate:",
          "message": "Oh no! I\'m down! I\'m down!"
        },
        {
          "name": "Scarlet:",
          "message": "Ha ha ha! More like Tate the SUNKEN Migrator!"
        },
        {
          "name": "Jeff:",
          "message": "TWEET! Clean hit! Tate is out!"
        },
        {
          "name": "Eric:",
          "message": ". . ."
        },
        {
          "name": "Zeus:",
          "message": "Oh no! I\'m all alone! I can\'t do this!"
        },
        {
          "name": "Scarlet:",
          "message": "Alright, just one more power ball, and this game is OVER!"
        },
        {
          "name": "Jeff:",
          "message": "TWEET! Foul! Too many shoes on the court!"
        },
        {
          "name": "Zeus:",
          "message": "Wait, what?"
        },
        {
          "name": "Jeff:",
          "message": "Someone has to take off his or her shoes. I mean it!"
        },
        {
          "name": "Scarlet:",
          "message": "Fine, I\'ll take off my shoes"
        },
        {
          "name": "Jeff:",
          "message": "Game on!"
        },
        {
          "name": "Scarlet:",
          "message": "Alright Zeus, any last words before you\'re out?"
        },
        {
          "name": "Zeus:",
          "message": "Umm...How about \'yikes!\'"
        },
        {
          "name": "Jeff:",
          "message": "TWEET! Foul! No saying \'yikes\' on the court!"
        },
        {
          "name": "Scarlet:",
          "message": "What? That\'s just silly!"
        },
        {
          "name": "Zeus:",
          "message": "Umm, sorry? I won\'t do it again..."
        },
        {
          "name": "Jeff:",
          "message": "Game on!"
        },
        {
          "name": "Scarlet:",
          "message": "As I was saying, here comes my most powerful dodge ball!"
        },
        {
          "name": "Jeff:",
          "message": "TWEET! Foul!"
        },
        {
          "name": "Scarlet:",
          "message": "Now what?!"
        },
        {
          "name": "Jeff:",
          "message": "Your name is too long. You must shorten it."
        },
        {
          "name": "Scarlet:",
          "message": "Okay, this is getting crazy! I\'m just going to throw the ball."
        },
        {
          "note": "(Scarlet throws a dodge ball)"
        },
        {
          "name": "Zeus:",
          "message": "Gadzooks!"
        },
        {
          "note": "(Dodge ballmisses Zeus, rebounds backs)"
        },
        {
          "name": "Scarlet:",
          "message": "Look out! Runaway dodge ball!"
        },
        {
          "name": "Eric:",
          "message": "! ! !"
        },
        {
          "note": "(Dodge ball misses Team Red, rebounds and hits Jeff!)"
        },
        {
          "name": "Jeff:",
          "message": "TWEET! Clean hit! The ref is out!"
        },
        {
          "name": "Zeus:",
          "message": "But wait... YOU\'RE the ref!"
        },
        {
          "name": "Scarlet:",
          "message": "Yeah, I didn\'t mean to hit you."
        },
        {
          "name": "Jeff:",
          "message": "Doesn\'t matter. Rules are rules. TWEET! Game on!!"
        },
        {
          "name": "Scarlet:",
          "message": "Alright then. Let\'s finish this, Blue Team!"
        },
        {
          "name": "Zeus:",
          "message": "You\'re on!"
        },
        {
          "note": "(They finish the game. It\'s up to you to decide who wins!)"
        },
        {
          "name": "Tate:",
          "message": "And the winner is..."
        },
        {
          "name": "Everyone:",
          "message": "RED TEAM!"
        },
        {
          "name": "Everyone:",
          "message": "BLUE TEAM!"
        },
        {
          "name": "Everyone:",
          "message": "IT\'S A TIE!"
        },
        {
          "note": "THE END."
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
      stage: 'archives:Stage2011Aug17.swf',
      plaza: 'recreation:plaza_team_blue_play.swf'
    }
  },
  {
    date: '2009-02-20',
    furnitureCatalog: 'archives:FurnFeb2009.swf',
    temp: {
      party: {
        partyName: 'Puffle Party',
        rooms: {
          beach: 'archives:RoomsBeach-PuffleParty2009.swf',
          beacon: 'archives:RoomsBeacon-PuffleParty2009.swf',
          cave: 'archives:RoomsCave-PuffleParty2009.swf',
          cove: 'archives:RoomsCove-PuffleParty2009.swf',
          dance: 'archives:RoomsDance-PuffleParty2009.swf',
          dock: 'archives:RoomsDock-PuffleParty2009.swf',
          forest: 'archives:RoomsForest-PuffleParty2009.swf',
          berg: 'archives:RoomsBerg-PuffleParty2009.swf',
          light: 'archives:RoomsLight-PuffleParty2009.swf',
          mtn: 'archives:RoomsMtn-PuffleParty2009.swf',
          pet: 'archives:PuffleParty2009-0220pet.swf',
          plaza: 'archives:RoomsPlaza-PuffleParty2009.swf',
          party: 'archives:RoomsParty-PuffleParty2009.swf',
          attic: 'archives:RoomsAttic-PuffleParty2009.swf',
          village: 'archives:RoomsVillage-PuffleParty2009.swf',
          forts: 'archives:2009pufflepartysnowforts.swf',
          town: 'archives:Rooms0220Town.swf',
        },
        music: {
          town: 260,
          beach: 260,
          dock: 260,
          pet: 261,
          plaza: 259,
          forest: 259,
          cove: 259,
          berg: 259,
          beacon: 261,
          light: 31,
          cave: 240,
          dance: 243,
          forts: 260,
          party: 259,
          village: 260
        },
      },
      // white puffle sighting
      event: {
        rooms: {
          dojoext: 'archives:RoomsDojoext2008.swf'
        }
      }
    }
  },
  {
    date: '2009-02-24',
    end: ['party']
  },
  {
    date: '2009-03-06',
    end: ['event'],
    miscComments: ['White Puffles are available to adopt'],
    rooms: {
      pet: 'archives:RoomsPet_4.swf'
    },
    localChanges: {
      'catalogues/adopt.swf': {
        'en': 'archives:Mar2009Adopt.swf'
      }
    },
    clothingCatalog: 'archives:Mar2009.swf',
    temp: {
      const: {
        rooms: {
          cove: 'archives:RoomsCove-StPatricksDay2009Pre.swf',
          forest: 'archives:RoomsForest-StPatricksDay2009Pre.swf',
          village: 'archives:RoomsVillage-StPatricksDay2009Pre.swf'
        }
      }
    }
  },
  {
    date: '2009-03-13',
    temp: {
      party: {
        partyName: 'St. Patrick\'s Day Party',
        rooms: {
          town: 'archives:Rooms0313Town.swf',
          coffee: 'archives:RoomsCoffeeStPatricksDay2009.swf',
          dance: 'archives:RoomsDance-StPatrickParty2009.swf',
          forts: 'archives:RoomsForts-StPatrickParty2009.swf',
          plaza: 'archives:StPatricksDayParty2009-Plaza.swf',
          stage: 'archives:StPatricksDayParty2009-Stage.swf',
          forest: 'archives:RoomsForest-StPatrickParty2009.swf',
          party: 'archives:RoomsParty-StPatrickParty2009.swf',
          dock: 'archives:RoomsDock-StPatrickParty2009.swf',
          berg: 'archives:RoomsBerg-StPatrickParty2009.swf',
          mtn: 'archives:RoomsMtn-StPatrickParty2009.swf',
          village: 'archives:RoomsVillage-StPatrickParty2009.swf'
        },
        music: {
          town: 262,
          dance: 263,
          forts: 262,
          plaza: 262,
          stage: 0,
          forest: 208,
          dock: 262,
          mtn: 262,
          village: 262,
          party: 208,
          coffee: 262
        }
      }
    }
  },
  {
    date: '2009-03-17',
    end: ['party'],
    temp: {
      const: {
        rooms: {
          plaza: 'recreation:penguin_play_awards_09_plaza_const.swf'
        }
      }
    }
  },
  {
    date: '2009-03-20',
    temp: {
      party: {
        partyName: 'Penguin Play Awards',
        rooms: {
          party: 'archives:RoomsParty-PenguinPlayAwards2009.swf',
          plaza: 'archives:RoomsPlaza-PenguinPlayAwards2009.swf',
          stage: 'archives:RoomsStage-PenguinPlayAwards2009.swf'
        },
        music: {
          party: 40,
          plaza: 40,
          stage: 40
        },
        globalChanges: {
          'content/shorts/penguinsTime.swf': 'archives:ContentShortspenguinsTime.swf'
        }
      },
      party2: {
        partyName: 'Snow Sculpture Showcase',
        rooms: {
          beach: 'archives:RoomsBeach-PenguinPlayAwards2009.swf',
          beacon: 'archives:RoomsBeacon-PenguinPlayAwards2009.swf',
          dock: 'archives:RoomsDock-PenguinPlayAwards2009.swf',
          light: 'archives:RoomsLight-PenguinPlayAwards2009.swf',
          mtn: 'archives:RoomsMtn-PenguinPlayAwards2009.swf',
          village: 'archives:RoomsVillage-PenguinPlayAwards2009.swf'
        }
      }
    },
    end: ['attic-snow']
  },
  {
    date: '2009-03-22',
    iglooList: [
      { display: 'Noir Noises', id: 37, pos: [1, 1] },
      { display: 'Egyptian Wrap', id: 34, pos: [2, 1] },
      { display: 'For Great Justice', id: 32, pos: [5, 2] },
      { display: 'Twice upon a Time', id: 39, pos: [6, 2] },
      { display: 'Pterodactyl Ptune', id: 35, pos: [7, 2] }
    ]
  },
  {
    date: '2009-03-24',
    miscComments: ['The membership badge now features levels'],
    fileChanges: {
      'play/v2/client/interface.swf': 'recreation:interfaces/membership_badge_3.swf'
    }
  },
  {
    date: '2009-03-27',
    temp: {
      party: {
        rooms: {
          // pin was removed mid-party
          mtn: 'recreation:snow_sculpture_mtn_no_pin.swf'
        }
      }
    },
    rooms: {
      // game upgrades
      mtn: 'archives:RoomsMtn-January2010.swf',
      cove: 'archives:RoomsCove.swf',
      dock: 'archives:RoomsDock_1.swf',
      lodge: 'archives:RoomsLodge.swf'
    }
  },
  {
    date: '2009-04-01',
    temp: {
      party3: {
        partyName: 'April Fools\' Party',
        rooms: {
          beach: 'archives:RoomsBeach-AprilFoolsParty2009.swf',
          beacon: 'archives:RoomsBeacon-AprilFoolsParty2009.swf',
          boiler: 'archives:RoomsBoiler-AprilFoolsParty2009.swf',
          boxdimension: 'archives:RoomsParty2-AprilFoolsParty2009.swf',
          party3: 'archives:RoomsParty3-AprilFoolsParty2009.swf',
          cave: 'archives:RoomsCave-AprilFoolsParty2009.swf',
          coffee: 'archives:RoomsCoffee-AprilFoolsParty2009.swf',
          cove: 'archives:RoomsCove-AprilFoolsParty2009.swf',
          dock: 'archives:RoomsDock-AprilFoolsParty2009.swf',
          dojo: 'archives:RoomsDojo-AprilFoolsParty2009.swf',
          dojoext: 'archives:RoomsDojoext-AprilFoolsParty2009.swf',
          forest: 'archives:RoomsForest-AprilFoolsParty2009.swf',
          berg: 'archives:RoomsBerg-AprilFoolsParty2009.swf',
          light: 'archives:RoomsLight-AprilFoolsParty2009.swf',
          mine: 'archives:RoomsMine-AprilFoolsParty2009.swf',
          shack: 'archives:RoomsShack-AprilFoolsParty2009.swf',
          dance: 'archives:RoomsDance-AprilFoolsParty2009.swf',
          dojohide: 'archives:RoomsDojohide-AprilFoolsParty2009.swf',
          pizza: 'archives:RoomsPizza-AprilFoolsParty2009.swf',
          plaza: 'archives:RoomsPlaza-AprilFoolsParty2009.swf',
          lodge: 'archives:RoomsLodge-AprilFoolsParty2009.swf',
          village: 'archives:RoomsVillage-AprilFoolsParty2009.swf',
          forts: 'archives:RoomsForts-AprilFoolsParty2009.swf',
          town: 'archives:RoomsTown-AprilFoolsParty2009.swf'
        },
        music: {
          beach: 232,
          beacon: 201,
          boiler: 201,
          cave: 201,
          coffee: 201,
          cove: 232,
          dock: 232,
          forest: 232,
          berg: 232,
          light: 201,
          mine: 201,
          shack: 232,
          dance: 201,
          pizza: 201,
          plaza: 232,
          lodge: 201,
          village: 232,
          forts: 232,
          town: 232,
          party3: 264
        },
        localChanges: {
          'catalogues/party.swf': {
            'en': 'archives:BoxCatalog.swf'
          },
          'membership/party3.swf': {
            'en': ['archives:AprilFoolMembership.swf', 'oops_party3_room']
          }
        },
        memberRooms: {
          party3: true
        },
        startscreens: ['archives:LoginScreenAprilFools2009.swf']
      }
    }
  },
  {
    date: '2009-04-03',
    clothingCatalog: 'archives:PSApr2009.swf'
  },
  {
    date: '2009-04-06',
    end: ['party3']
  },
  {
    date: '2009-04-09',
    end: ['party', 'party2']
  },
  {
    date: '2009-04-10',
    temp: {
      party: {
        partyName: 'Easter Egg Hunt',
        decorated: false,
        rooms: {
          beacon: 'archives:RoomsBeacon-EasterEggHunt2009.swf',
          cove: 'archives:RoomsCove-EasterEggHunt2009.swf',
          dojoext: 'archives:RoomsDojoext-EasterEggHunt2009.swf',
          shop: 'archives:RoomsShop-EasterEggHunt2009.swf',
          mtn: 'archives:RoomsMtn-EasterEggHunt2009.swf',
          lodge: 'archives:RoomsLodge-EasterEggHunt2009.swf',
          town: 'archives:RoomsTown-Easter2009.swf'
        },
        globalChanges: {
          'scavenger_hunt/hunt_ui.swf': ['archives:Eggs-EasterEggHunt2009.swf', 'easter_egg_hunt', 'easter_hunt'],
        },
        scavengerHunt2010: {
          'iconFileId': 'archives:EggIcon-EasterEggHunt2009.swf'
        }
      }
    },
    stagePlay: {
      name: 'Quest for the Golden Puffle',
      costumeTrunk: 'archives:December2008Costume.swf'
    },
    rooms: {
      stage: 'archives:RoomsStage-May2010.swf',
      plaza: 'recreation:plaza_golden_puffle_no_weather.swf',

      // TODO maybe add this as consequence of party and add the commment? (can now turn lights on)
      beacon: 'archives:PreAugust2011Beacon.swf'
    }
  },
  {
    date: '2009-04-13',
    end: ['party']
  },
  {
    date: '2009-04-17',
    furnitureCatalog: 'archives:FurnApr2009.swf'
  },
  {
    date: '2009-05-01',
    clothingCatalog: 'archives:May2009.swf',
    temp: {
      const: {
        rooms: {
          cave: 'recreation:medieval_09_const_cave.swf'
        }
      }
    }
  },
  {
    date: '2009-05-08',
    temp: {
      party: {
        partyName: 'Medieval Party',
        rooms: {
          beach: 'archives:Rooms0508Beach.swf',
          rink: 'archives:Rooms0508Rink.swf',
          lodge: 'archives:Rooms0508Lodge.swf',
          beacon: 'archives:Rooms0508Beacon.swf',
          boiler: 'archives:Rooms0508Boiler.swf',
          book: 'archives:Rooms0508Book.swf',
          cave: 'archives:Rooms0508Cave.swf',
          coffee: 'archives:Rooms0508Coffee.swf',
          cove: 'archives:Rooms0508Cove.swf',
          lounge: 'archives:Rooms0508Lounge.swf',
          dock: 'archives:Rooms0508Dock.swf',
          forest: 'archives:Rooms0508Forest.swf',
          shop: 'archives:Rooms0508Shop.swf',
          light: 'archives:Rooms0508Light.swf',
          attic: 'archives:Rooms0508Attic.swf',
          shack: 'archives:Rooms0508Shack.swf',
          dance: 'archives:Rooms0508Dance.swf',
          pet: 'archives:Rooms0508Pet.swf',
          pizza: 'archives:Rooms0508Pizza.swf',
          plaza: 'archives:Rooms0508Plaza.swf',
          mtn: 'archives:Rooms0508Mtn.swf',
          village: 'archives:Rooms0508Village.swf',
          forts: 'archives:Rooms0508Forts.swf',
          town: 'archives:Rooms0508Town.swf',
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
          party13: 'archives:Rooms0508Party13.swf'
        },
        music: {
          beach: 233,
          beacon: 235,
          boiler: 236,
          book: 234,
          cave: 236,
          coffee: 234,
          cove: 235,
          lounge: 235,
          dock: 233,
          forest: 235,
          shop: 234,
          rink: 236,
          light: 235,
          attic: 235,
          shack: 237,
          pet: 234,
          pizza: 234,
          plaza: 233,
          mtn: 236,
          lodge: 235,
          forts: 236,
          town: 233,
          party1: 235,
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
          village: 235
        },
        localChanges: {
          'catalogues/party.swf': {
            'en': 'archives:ENCataloguesParty-MedievalParty2009.swf'
          }
        }
      }
    },
    stagePlay: {
      name: 'The Haunting of the Viking Opera',
      costumeTrunk: 'archives:February2011HauntingOfTheVikingOperaCostumeTrunk.swf',
      script: [
        { note: "The Haunting of the Viking Opera" },
        { name: "Hector:", message: "Alright everyone, it\'s time for Helga\'s solo. From the top!" },
        { name: "Helga:", message: "NO! NO! A bajillion times NO! I will not sing!" },
        { name: "Hector:", message: "Come on Helga! Your solo\'s the most important part of the play!" },
        { name: "Helga:", message: "NO! As long as the ghost is ghosting, I will not sing!" },
        { name: "Hector:", message: "Helga, please! There\'s no such thing as ghosts!" },
        { name: "Bailey:", message: "Now now, miss \'elga, nothin\' to worry about. I\'m \'ere now" }, 
        { name: "Helga:", message: "Oh, but what if the ghost throws a tomato or something?" },
        { name: "Bailey:", message: "No worries. I\'ll \'appily take a tomato for you any day" },
        { name: "Helga:", message: "Well...Alright. I\'ll do it. I\'ll sing." },
        { name: "Hector:", message: "Wonderful! Alright everyone, places! Places!" },
        { note: "(Everyone takes in their places)" },
        { name: "Hector:", message: "All right, from the top. One...Two...Three...Action!" },
        { name: "Ghost:", message: "OOOooooOOOOoooooOOOOoooOOO!!!!!" },
        { name: "Bailey:", message: "Yikes! That doesn\'t sound right..." },
        { name: "Helga:", message: "It\'s not me! IT\'S THE GHOST!" },
        { name: "Ghost:", message: "OOOOooooOOOOOooOOOoooOOOO!!!!" },
        { name: "Hector:", message: "Oh my goodness! The ghost is real?!" },
        { name: "Helga:", message: "Don\'t just stand there, do something!" },
        { name: "Bailey:", message: "Well, I ain\'t afraid of no ghost! Let me \'andle this!" },
        { name: "Bailey:", message: "You there! You\'re under arrest! Haunting is against the law!" },
        { note: "(Ghost begins to glow)" },
        { name: "Ghost:", message: "OOOOoooOOOooOOOoOO!!!" },
        { name: "Bailey:", message: "On second thought, maybe I\'ll let you off with a warning..." },
        { name: "Hector:", message: "Maybe if we ask it nicely, it\'ll go haunt the Mine or something..." },
        { name: "Helga:", message: "Oh fiddle sticks! I\'ve had enough! Shoo, ghost, shoo!" },
        { name: "Ghost:", message: "OOOOOooooOOOOOooooOOO!!!" },
        { name: "Helga:", message: "Hmph! You call that a G flat? I\'LL show you a G flat..." },
        { name: "Helga:", message: "LA LA LA LAAAAAAAAAAAAAAAAAAAAAAA!!!" },
        { name: "Ghost:", message: "OOOOoooOOOOooOOOO!!!" },
        { name: "Helga:", message: "LAAAAAAAAAAAAAAAAAA!!!!!!" },
        { name: "Bailey:", message: "BLIMEY! I CAN\'T EVEN HEAR MYSELF THINK!" },
        { name: "Hector:", message: "WHAAAAT?!!" },
        { note: "(There\'s a rumble and suddenly..." },
        { note: "...a giant avalanche buries the ghost)" },
        { name: "Helga:", message: "Now THAT\'S how you sing opera." },
        { name: "Hector:", message: "I guess it\'s not over until the hat-lady sings!" },
        { name: "Bailey:", message: "Alright, now let\'s see who\'s really behind the ghost!" },
        { note: "(Bailey removes the Ghost\'s costume)" },
        { name: "Hector:", message: "Why it\'s Moneek, our costume designer!" },
        { name: "Moneek:", message: "Whoa, my head...What\'s going on here?" },
        { name: "Hector:", message: "What were you doing in that sheet?" },
        { name: "Moneek:", message: "Sorry, I got tangled in that sheet with my flashlight." },
        { name: "Helga:", message: "Then why were you yelling \'OOOOooooOOOO!!\'" },
        { name: "Moneek:", message: "Oh, it was too bright. It was hurting my eyes." },
        { name: "Bailey:", message: "Well, I\'m glad we got all that cleared up!" },
        { name: "Helga:", message: "And I finally got a chance to practice my solo!" },
        { name: "Hector:", message: "Good show, everyone. Let\'s take it once more from the top!" },
        { note: "THE END" }
      ]
    },
    rooms: {
      stage: 'archives:RoomsStage-February2011.swf',
      plaza: 'recreation:plaza_haunting_of_the_viking_opera.swf'
    }
  },
  {
    date: '2009-05-17',
    end: ['party']
  },
  {
    date: '2009-05-22',
    migrator: 'recreation:pirate_catalog/09_05.swf'
  },
  {
    date: '2009-05-28',
    roomComment: 'The dojo rooms are slightly revamped',
    rooms: {
      dojo: 'archives:RoomsDojo.swf',
      dojohide: 'recreation:dojohide_2009.swf',
      dojoext: 'recreation:dojoext_2009.swf'
    }
  },
  {
    date: '2009-05-29',
    iglooList: [
      { display: 'Flipper Stomper', id: 244, pos: [3, 1] },
      { display: 'Coconut', id: 215, pos: [5, 1] },
      { display: 'Catchin\' Waves Theme', id: 113, pos: [6, 1] },
      { display: 'Puffle Ragtime', id: 261, pos: [7, 1] },
      { display: 'Summer Song', id: 216, pos: [1, 2] },
      { display: 'Mix Maestro', id: 242, pos: [6, 2] },
      { display: 'Water Kongo', id: 217, pos: [7, 2] }
    ]
  },
  {
    date: '2009-06-01',
    migrator: false
  },
  {
    date: '2009-06-05',
    temp: {
      const: {
        rooms: {
          beach: 'archives:RoomsBeach-AdventureParty2009Const.swf',
          shipnest: 'archives:RoomsNest-AdventureParty2009Const.swf',
          cove: 'archives:RoomsCove-AdventureParty2009Const.swf',
          dock: 'archives:RoomsDock-AdventureParty2009Const.swf',
          forest: 'archives:RoomsForest-AdventureParty2009Const.swf',
          ship: 'archives:RoomsShip-AdventureParty2009Const.swf',
          plaza: 'archives:RoomsPlaza-AdventureParty2009Const.swf',
          shiphold: 'archives:RoomsHold-AdventureParty2009Const.swf',
          forts: 'archives:RoomsForts-AdventureParty2009Const.swf',
          town: 'archives:RoomsTown-AdventureParty2009Const.swf'
        }
      }
    }
  },
  {
    date: '2009-06-12',
    temp: {
      party: {
        partyName: 'Adventure Party',
        rooms: {
          beach: 'archives:RoomsBeach-AdventureParty2009.swf',
          cave: 'archives:RoomsCave-AdventureParty2009.swf',
          cove: 'archives:RoomsCove-AdventureParty2009.swf',
          dock: 'archives:RoomsDock-AdventureParty2009.swf',
          forest: 'archives:RoomsForest-AdventureParty2009.swf',
          berg: 'archives:RoomsBerg-AdventureParty2009.swf',
          mine: 'archives:RoomsMine-AdventureParty2009.swf',
          dance: 'archives:RoomsDance-AdventureParty2009.swf',
          plaza: 'archives:RoomsPlaza-AdventureParty2009.swf',
          forts: 'archives:RoomsForts-AdventureParty2009.swf',
          rink: 'archives:RoomsRink-AdventureParty2009.swf',
          town: 'archives:RoomsTown-AdventureParty2009.swf',
          party: 'archives:TreeForts-AdventureParty2009.swf'
        },
        music: {
          beach: 267,
          cave: 268,
          cove: 267,
          dock: 267,
          forest: 267,
          berg: 268,
          mine: 268,
          dance: 269,
          plaza: 267,
          forts: 267,
          rink: 267,
          town: 267,
          party: 267
        },
        startscreens: ['archives:AdventureParty2009ENLoginScreen1.swf', 'archives:AdventureParty2009ENLoginScreen2.swf']
      }
    },
    stagePlay: {
      name: 'Fairy Fables',
      costumeTrunk: 'archives:Jan10Stage.swf'
    },
    rooms: {
      stage: 'archives:RoomsStage-June2009.swf',
      plaza: 'archives:RoomsPlaza-Play10.swf'
    }
  },
  {
    date: '2009-06-16',
    end: ['party']
  },
  {
    date: '2009-06-19',
    rooms: {
      rink: 'archives:RoomsRink_2.swf',
      town: 'archives:RoomsTown_2.swf',
      forts: 'archives:ESForts-SoccerPitch.swf',
      agent: 'archives:RoomsAgentFootball.swf'
    },
    map: 'archives:Map2008-2011Stadium.swf',
    roomComment: 'The Stadium returns'
  },
  {
    date: '2009-06-26',
    iglooList: [
      { display: 'Viking Opera', id: 41, pos: [1, 1] },
      { display: 'Mountain Dojo', id: 21, pos: [2, 1] },
      { display: 'Silly to Funky', id: 258, pos: [5, 1] },
      { display: 'Planet Y', id: 38, pos: [5, 2] }
    ],
    rooms: {
      // game upgrades
      dance: 'archives:RoomsDance_2.swf'
    }
  },
  {
    date: '2009-07-10',
    temp: {
      const: {
        rooms: {
          beach: 'archives:RoomsBeach-MusicJam2010Pre.swf',
          coffee: 'archives:RoomsCoffee-MusicJam2010Pre.swf',
          cove: 'archives:RoomsCove-MusicJam2010Pre.swf',
          dock: 'archives:RoomsDock-MusicJam2010Pre.swf',
          forest: 'archives:RoomsForest-MusicJam2010Pre.swf',
          berg: 'archives:RoomsBerg-MusicJam2010Pre.swf',
          light: 'archives:RoomsLight-MusicJam2010Pre.swf',
          village: 'archives:RoomsVillage-MusicJam2010Pre.swf',
          forts: 'archives:RoomsForts-MusicJam2010Pre.swf',
          rink: 'archives:RoomsRink-MusicJam2009Const.swf'
        }
      }
    },
    stagePlay: {
      name: 'Ruby and the Ruby',
      costumeTrunk: 'archives:July09Costume.swf',
      notPremiere: true

    },
    rooms: {
      stage: 'recreation:ruby_play_debut.swf',
      plaza: 'recreation:plaza_ruby_no_weather_09_july.swf'
    }
  },
  {
    date: '2009-07-17',
    temp: {
      party: {
        partyName: 'Music Jam',
        rooms: {
          party: 'archives:RoomsParty-MusicJam2010.swf',
          party3: 'archives:RoomsParty3-MusicJam2009.swf',
          beach: 'archives:RoomsBeach-MusicJam2009.swf',
          cave: 'archives:RoomsCave-MusicJam2009.swf',
          coffee: 'archives:RoomsCoffeeMusicJam2009.swf',
          cove: 'archives:RoomsCove-MusicJam2009.swf',
          lounge: 'archives:RoomsLounge-MusicJam2009.swf',
          dock: 'archives:RoomsDock-MusicJam2009.swf',
          forest: 'archives:RoomsForest-MusicJam2009.swf',
          berg: 'archives:RoomsBerg-MusicJam2009.swf',
          light: 'archives:RoomsLight-MusicJam2009.swf',
          dance: 'archives:RoomsDance-MusicJam2009.swf',
          party2: 'archives:RoomsParty2-MusicJam2009.swf',
          pizza: 'archives:RoomsPizza-MusicJam2009.swf',
          plaza: 'archives:RoomsPlaza-MusicJam2009.swf',
          mtn: 'archives:RoomsMtn-MusicJam2009.swf',
          village: 'archives:RoomsVillage-MusicJam2009.swf',
          forts: 'archives:RoomsForts-MusicJam2009.swf',
          rink: 'archives:RoomsRink-MusicJam2009.swf',
          town: 'archives:RoomsTown-MusicJam2009.swf'
        },
        music: {
          dance: 242,
          forts: 240,
          lounge: 242,
          mtn: 232,
          pizza: 210,
          plaza: 271,
          town: 271,
          party3: 271,
          coffee: 0
        },
        localChanges: {
          'catalogues/merch.swf': {
            'en': 'approximation:mj2009_merch.swf'
          }
        },
        startscreens: ['archives:LoginMusicJam2009.swf']
      }
    }
  },
  {
    date: '2009-07-26',
    end: ['party']
  },
  {
    date: '2009-07-31',
    iglooList: [
      { display: 'Keytar Jam', id: 275, pos: [1, 1] },
      { display: 'Rocksteady', id: 276, pos: [1, 2] },
      { display: 'All-Access Pass', id: 272, pos: [3, 2] },
      { display: 'Rocking Pizza', id: 271, pos: [5, 2] }
    ]
  },
  {
    date: '2009-08-07',
    clothingCatalog: 'archives:August09Style.swf',
    temp: {
      const: {
        rooms: {
          beach: 'archives:FestivalOfFlightConstBeach.swf',
          beacon: 'archives:FestivalOfFlightConstBeacon.swf',
          dock: 'archives:FestivalOfFlightConstDock.swf',
          forest: 'archives:FestivalOfFlightConstForest.swf',
          plaza: 'archives:FestivalOfFlightConstPlaza.swf',
          forts: 'archives:FestivalOfFlightConstForts.swf',
          town: 'archives:RoomsTown-FestivalofFlightPre.swf'
        }
      }
    },
    roomComment: 'Instruments can now be played at the Lighthouse',
    rooms: {
      light: 'archives:RoomsLight-January2010.swf'
    }
  },
  {
    date: '2009-08-14',
    temp: {
      party: {
        partyName: 'Festival of Flight',
        rooms: {
          beach: 'archives:FestivalOfFlightBeach.swf',
          beacon: 'archives:FestivalOfFlightBeacon.swf',
          cave: 'archives:FestivalOfFlightCave.swf',
          cove: 'archives:FestivalOfFlightCove.swf',
          dock: 'archives:FestivalOfFlightDock.swf',
          forest: 'archives:FestivalOfFlightForest.swf',
          party: 'archives:FestivalOfFlightParty.swf',
          berg: 'archives:FestivalOfFlightBerg.swf',
          dance: 'archives:FestivalOfFlightDance.swf',
          plaza: 'archives:FestivalOfFlightPlaza.swf',
          mtn: 'archives:FestivalOfFlightMtn.swf',
          village: 'archives:FestivalOfFlightVillage.swf',
          forts: 'archives:FestivalOfFlightForts.swf',
          party2: 'archives:FestivalOfFlightParty2.swf',
          town: 'archives:RoomsTown-FestivalofFlight.swf'
        },
        music: {
          beach: 277,
          beacon: 277,
          cave: 277,
          cove: 277,
          dance: 279,
          dock: 277,
          forest: 277,
          forts: 277,
          mtn: 277,
          plaza: 277,
          village: 277,
          town: 277,
          party: 278,
          party2: 278
        }
      }
    }
  },
  {
    date: '2009-08-20',
    end: ['party']
  },
  {
    date: '2009-08-21',
    stagePlay: {
      name: 'Underwater Adventure',
      costumeTrunk: 'archives:May2011UnderwaterAdventureCostume.swf',
      script: [
        { note: "Underwater Adventure" },
        { name: "Fiesel:", message: "And so our search for the lost town continues." },
        { name: "Daisy:", message: "I don\'t think we should go that way!" },
        { name: "Fiesel:", message: "There\'s nothing down here to be afraid of." },
        { name: "Daisy:", message: "Nothing except that giant lobster?" },
        { name: "Fiesel:", message: "It\'s just an underwater parking attendant!" },
        { name: "Lobster:", message: "Move along now - no floating here!" }, 
        { name: "Daisy:", message: "Can you tell us the way to the secret city?" },
        { name: "Lobster:", message: "It would hardly be a secret if I told you!" },
        { name: "Fiesel:", message: "What about treasure? Have you seen any?" },
        { name: "Lobster:", message: "Sure, there\'s some over there. Now move along!" },
        { name: "Daisy:", message: "Thanks for the treasure!" },
        { name: "Mystic Fish:", message: "BLUB! BLUB!" },
        { name: "Fiesel:", message: "The Mystic Fish! I wonder if it can help us?" },
        { name: "Mystic Fish:", message: "Who disturbs me?" },
        { name: "Fiesel:", message: "We are looking for adventure, oh wise fish!" },
        { name: "Mystic Fish:", message: "To find a hidden land in the sea..." },
        { name: "Mystic Fish:", message: "Swim down-stream. Now leave me be!" },
        { name: "Daisy:", message: "I\'m not getting out of the submarine. I can\'t swim!" },
        { name: "Fiesel:", message: "Oh great, a diver who can\'t swim." },
        { name: "Fiesel:", message: "That\'s just brilliant!" },
        { name: "Daisy:", message: "Is it too late for a swimming lesson?" },
        { name: "Daisy:", message: "I wish I\'d brought my water wings!" },
        { name: "Fiesel:", message: "Be brave and take my flipper." },
        { name: "Fiesel:", message: "It\'s okay, there\'s a lifeguard over there!" },
        { name: "Daisy:", message: "I can do it! I\'m swimming!" },
        { name: "Fiesel:", message: "Look! The hidden city! We did it!" },
        { name: "Daisy:", message: "Wow! I\'ve never seen so many merpenguins!" },
        { name: "Bubbles:", message: "Welcome travellers!" },
        { name: "Flippers:", message: "New friends! Let me tell you a joke." },
        { name: "Bubbles:", message: "Oh no. Now you\'ve got him started." },
        { name: "Flippers:", message: "What lies under the ocean and shivers?" },
        { name: "Flippers:", message: "A nervous wreck!" },
        { name: "Daisy:", message: "Lol! That\'s terrible!" },
        { name: "Bubbles:", message: "Enough, Flippers! Let them explore the city." },
        { name: "Flippers:", message: "Welcome to Penglantis - our home is yours!" },
        { name: "Daisy:", message: "This is such an adventure!" },
        { name: "Fiesel:", message: "And its only just begun!" },
        { note: "THE END" },
        { note: "Director" },
        { name: "Director:", message: "Places please!" },
        { name: "Director:", message: "Start swimming!" },
        { name: "Director:", message: "Fantastic acting, well done" },
        { name: "Director:", message: "Curtain call!" }
      ]
    },
    rooms: {
      stage: 'recreation:underwater_adventure_no_pin.swf',
      plaza: 'recreation:plaza_underwater_adventure.swf'
    }
  },
  {
    date: '2009-09-04',
    clothingCatalog: 'archives:September09Style.swf',
    migrator: 'recreation:pirate_catalog/09_09.swf',
    temp: {
      party: {
        partyName: 'The Fair',
        rooms: {
          coffee: 'archives:RoomsCoffeeTheFair2009.swf',
          lounge: 'archives:RoomsLounge-Fair2009.swf',
          beach: 'archives:RoomsBeach-TheFair2009.swf',
          beacon: 'archives:RoomsBeacon-TheFair2009.swf',
          party: 'archives:RoomsParty-TheFair2009.swf',
          cave: 'archives:RoomsCave-TheFair2009.swf',
          cove: 'archives:RoomsCove-TheFair2009.swf',
          dock: 'archives:RoomsDock-TheFair2009.swf',
          forest: 'archives:RoomsForest-TheFair2009.swf',
          party3: 'archives:RoomsParty3-TheFair2009.swf',
          party2: 'archives:RoomsParty2-TheFair2009.swf',
          berg: 'archives:RoomsBerg-TheFair2009.swf',
          dance: 'archives:RoomsDance-TheFair2009.swf',
          pizza: 'archives:RoomsPizza-TheFair2009.swf',
          plaza: 'archives:RoomsPlaza-TheFair2009.swf',
          mtn: 'archives:RoomsMtn-TheFair2009.swf',
          village: 'archives:RoomsVillage-TheFair2009.swf',
          forts: 'archives:RoomsForts-TheFair2009.swf',
          town: 'archives:RoomsTown-TheFair2009.swf',
          mine: 'recreation:fair_2009/mine.swf'
        },
        music: {
          coffee: 221,
          lounge: 221,
          beach: 221,
          beacon: 221,
          party: 221,
          cave: 221,
          cove: 221,
          dock: 221,
          forest: 221,
          party3: 221,
          party2: 221,
          berg: 221,
          dance: 221,
          pizza: 221,
          plaza: 221,
          mtn: 221,
          village: 221,
          forts: 221,
          town: 221,
          mine: 221
        },
        localChanges: {
          'catalogues/prizebooth.swf': {
            'en': 'archives:Prizebooth-TheFair2009.swf'
          },
          'catalogues/prizeboothmember.swf': {
            'en': 'archives:Prizeboothmember-TheFair2009.swf'
          }
        },
        fairCpip: {
          iconFileId: 'archives:Ticket_icon-TheFair2009.swf',
          infoFile: 'archives:Tickets-TheFair2009.swf'
        }
      }
    }
  },
  {
    date: '2009-09-11',
    miscComments: ['The Penguin Tales Volume 3 book is added', 'Strange sightings appear around the island'],
    localChanges: {
      'forms/library.swf': {
        en: 'recreation:library/tales_vol_3.swf'
      }
    },
    temp: {
      party: {
        rooms: {
          cove: 'recreation:fair_09_cove_no_pin.swf',
          pizza: 'recreation:pizza_101_days_of_fun_pin_fair.swf',
          'plaza': 'recreation:fair_09_penguins_time_forgot.swf',

          forest: 'recreation:black_puffle_sight/forest.swf',
          village: 'recreation:black_puffle_sight/village.swf',
          dojohide: 'recreation:black_puffle_sight/dojohide.swf',
          dojoext: 'recreation:black_puffle_sight/dojoext.swf'
        }
      }
    },
    stagePlay: {
      name: 'The Penguins that Time Forgot',
      costumeTrunk: 'archives:June08Costume.swf',
      script: [
        { note: "The Penguins that Time Forgot" },
        { name: "Chester:", message: "Time to use this Time Travel 1000!" },
        { note: "(Time machine opens)" },
        { name: "Critteroo:", message: "UGG! DINO! UGG!" },
        { name: "Chester:", message: "What is this place? Where am I?" },
        { name: "Kek:", message: "GRUB! GRUB! GRUB!" },
        { name: "Chester:", message: "I\'m in Grub? What\'s a Grub?" },
        { name: "Critteroo:", message: "LAVA! LAVA!" }, 
        { name: "Chester:", message: "Lava?! I\'ve gotta get out of here!" },
        { note: "(Time machine breaks)" },
        { name: "Chester:", message: "Great, now I\'m stuck in Grub. With lava. What next?" },
        { name: "Tiki:", message: "TIKI UGG!" },
        { name: "Chester:", message: "GRUB! Last time I buy a time machine for 10 coins..." },
        { name: "Kek:", message: "GRRRRRRRRUB!" },
        { name: "Chester:", message: "Sigh. Grub? Is that a giant grub mask?" },
        { name: "Tiki:", message: "TIKI TIKI BOARD TIKI BOARD!" },
        { name: "Chester:", message: "Should I be scared? I don\'t feel scared even a bit!" },
        { name: "Critteroo:", message: "TIKI! TIKI ATOOK!" },
        { name: "Tiki:", message: "ABOOT! ABOOT!" },
        { name: "Kek:", message: "YUB NUB GRUB!" },
        { name: "Chester:", message: "Okay, really now. Can\'t you just use real words?" },
        { name: "Critteroo:", message: "GRUB! TIKI GRUB-GRUB!" },
        { name: "Chester:", message: "You do know you don\'t make any sense, right?" },
        { name: "Critteroo:", message: "LAVA NO TIKI GRUB!" },
        { name: "Chester:", message: "Sigh. Okay, something about lava and grubs." },
        { name: "Tiki:", message: "ABOOOOOOT!" },
        { name: "Chester:", message: "You were wearing boots, but the grubs took them?" },
        { name: "Kek:", message: "LAVA NO LAVA! GRUB TIKI GRUB!" },
        { name: "Chester:", message: "Let me guess, your name is Tiki and you\'re a Grub?" },
        { name: "Tiki:", message: "ABOOT TIKI!" },
        { name: "Chester:", message: "I give up! I have no idea what you\'re saying." },
        { name: "Critteroo:", message: "Now you know how I feel!" },
        { name: "Chester:", message: "What? You understand me?" },
        { name: "Critteroo:", message: "Of course I do! What is that thing?" },
        { name: "Chester:", message: "A time machine. We could explore. But it\'s broken." },
        { name: "Chester:", message: "Where would you go if it worked?" },
        { name: "Critteroo:", message: "Somewhere without Grub OR lava?" },
        { name: "Chester:", message: "Maybe Kek can fix it? Let\'s ask!" },
        { name: "Critteroo:", message: "NUB CLUB GRUB?" },
        { name: "Kek:", message: "TIKI GRUB-GRUB!" },
        { name: "Chester:", message: "I\'ll take that as a yes?" },
        { note: "THE END" },
        { note: "Director" },
        { name: "Director:", message: "Places everyone!" },
        { name: "Director:", message: "Take it again from the top!" },
        { name: "Director:", message: "Excellent work, team. Keep it up!" },
        { name: "Director:", message: "That\'s a wrap!" },
        { name: "Director:", message: "Take a bow everyone!" }
      ]
    },
    rooms: {
      stage: 'archives:RoomsStage-September2009.swf',
      plaza: 'archives:RoomsPlaza-Play6.swf',
    }
  },
  {
    date: '2009-09-14',
    migrator: false,
    end: ['party'],
    temp: {
      party2: {
        partyName: 'Sensei\'s Fire Scavenger Hunt',
        rooms: {
          beach: 'archives:Sensei_Fire_Hunt_beach.swf',
          beacon: 'archives:Sensei_Fire_Hunt_beacon.swf',
          cave: 'archives:Sensei_Fire_Hunt_cave.swf',
          coffee: 'archives:Sensei_Fire_Hunt_coffee.swf',
          cove: 'archives:Sensei_Fire_Hunt_cove.swf',
          dock: 'archives:Sensei_Fire_Hunt_dock.swf',
          dojo: 'archives:Sensei_Fire_Hunt_dojo.swf',
          dojoext: 'archives:Sensei_Fire_Hunt_dojoext.swf',
          shop: 'archives:Sensei_Fire_Hunt_shop.swf',
          agent: 'archives:Sensei_Fire_Hunt_agent.swf',
          berg: 'archives:Sensei_Fire_Hunt_berg.swf',
          attic: 'archives:Sensei_Fire_Hunt_attic.swf',
          forest: 'archives:Sensei_Fire_Hunt_forest.swf',
          shack: 'archives:Sensei_Fire_Hunt_shack.swf',
          dojohide: 'archives:Sensei_Fire_Hunt_dojohide.swf',
          pizza: 'archives:Sensei_Fire_Hunt_pizza.swf',
          plaza: 'archives:Sensei_Fire_Hunt_plaza.swf',
          pet: 'archives:Sensei_Fire_Hunt_pet.swf',
          mtn: 'archives:Sensei_Fire_Hunt_mtn.swf',
          lodge: 'archives:Sensei_Fire_Hunt_lodge.swf',
          village: 'archives:Sensei_Fire_Hunt_village.swf',
          forts: 'archives:Sensei_Fire_Hunt_forts.swf',
          sport: 'archives:Sensei_Fire_Hunt_sport.swf',
          rink: 'archives:Sensei_Fire_Hunt_rink.swf',
          town: 'archives:RoomsTown-FireScavengerHunt.swf',
          mine: 'recreation:fire_hunt/mine.swf',
          light: 'recreation:fire_hunt/light.swf',
          book: 'recreation:fire_hunt/book.swf'
        },
        globalChanges: {
          'scavenger_hunt/hunt_ui.swf': ['archives:Sensei_Fire_Hunt_hunt_closeup.swf', 'easter_egg_hunt', 'easter_hunt'],
        },
        scavengerHunt2010: {
          iconFileId: 'archives:Sensei_Fire_Hunt_hunt_icon.swf'
        }
      }
    }
  },
  {
    date: '2009-09-18',
    furnitureCatalog: 'archives:FurnSep2009.swf'
  },
  {
    date: '2009-09-21',
    iglooList: [
      { display: 'Campfire Song', id: 220, pos: [2, 1] },
      { display: 'Extra Anchovies', id: 270, pos: [7, 1] },
      { display: 'All the Fun of The Fair', id: 221, pos: [2, 2] },
      { display: 'Spicy Salsa', id: 229, pos: [6, 2] }
    ],
    temp: {
      party2: {
        update: 'The volcano becomes active',
        rooms: {
          dojoext: 'recreation:fire_hunt/dojoext.swf'
        }
      }
    }
  },
  {
    date: '2009-09-25',
    temp: {
      party2: {
        rooms: {
          pizza: 'recreation:fire_hunt_pizza_no_pin.swf',
          book: 'recreation:fire_hunt/book_pin.swf'
        }
      }
    }
  },
  {
    date: '2009-09-28',
    end: ['party2'],
    constructionComment: 'Construction in the Ninja Hideout continues',
    miscComments: ['Strange sightings appear around the island'],
    temp: {
      // black puffle sightings
      event: {
        rooms: {
          village: 'recreation:black_puffle_sight/village_3.swf',
          dojoext: 'recreation:black_puffle_sight/dojoext_3.swf',
          forest: 'recreation:black_puffle_sight/forest_3.swf',
          dojohide: 'recreation:black_puffle_sight/dojohide_3.swf'
        }
      }
    }
  },
  {
    date: '2009-10-02',
    clothingCatalog: 'archives:Oct2009.swf',
    miscComments: ['The volcano becomes active'],
    temp: {
      event: {
        rooms: {
          dojoext: 'recreation:black_puffle_sight/dojoext_3_volcano.swf'
        }
      }
    }
  },
  {
    date: '2009-10-09',
    stagePlay: {
      name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
      costumeTrunk: 'archives:January2009Costume.swf',
      script: [
        { note: "Squidzoid vs Shadow Guy & Gamma Gal" },
        { name: "Reporter:", message: "Action news live! Tell us what\'s happening!" },
        { name: "Witness:", message: "There\'s a giant monster! No! Two of them!!!" },
        { name: "Squidzoid:", message: "GRAWL! I HUNGRY!" },
        { name: "Reporter:", message: "\'GASP!\' They\'ll eat the entire city!" },
        { name: "Witness:", message: "Who will save us now?" },
        { name: "Shadow Guy:", message: "The city needs our help!" },
        { name: "Gamma Gal:", message: "Super costume mega transform!" }, 
        { note: "(Heroes change into super suits)" },
        { name: "Witness:", message: "Hooray! The heroes have arrived!" },
        { name: "Reporter:", message: "Of course they have. Who else could save the day?" },
        { name: "SG:", message: "Freeze Squidzoid and Melmonst!" },
        { name: "GG:", message: "You\'ve both eaten enough!" },
        { name: "Squidzoid:", message: "BLARRG! YOU CAN\'T STOP US!" },
        { name: "GG:", message: "Oh yeah? Take this! PLASMA GLOW WAVE!" },
        { name: "Squidzoid:", message: "RROOOOAAAARR!" },
        { name: "Reporter:", message: "The superheroes are using their powers!" },
        { name: "Witness:", message: "Hooray heroes! Nice going!" },
        { name: "Squidzoid:", message: "PUNY HEROES! YOU\'RE NO MATCH FOR US!" },
        { name: "SG:", message: "Then try this on for size! SHADOW WAVE!" },
        { name: "Squidzoid:", message: "GLEEGRRAUWLL!" },
        { name: "Reporter:", message: "Wait! Squidzoid\'s running. But Melmonst is staying!" },
        { name: "SG:", message: "Not the most reliable sidekick." },
        { name: "GG:", message: "You\'re right. And he doesn\'t say a lot." },
        { name: "Witness:", message: "We can\'t have monsters all over the city!" },
        { name: "GG:", message: "Quick! With our powers combined!" },
        { name: "SG:", message: "For great justice!" },
        { name: "GG:", message: "For freedom!!" },
        { name: "SG:", message: "For the love of pizza with extra olives!" },
        { name: "Squidzoid:", message: "NO! THIS IS IMPOSSIBLE! GRRAAA!" },
        { name: "Witness:", message: "It\'s turning into a penguin!" },
        { note: "(Squidzoid turns into a penguin.)" },
        { name: "Squidzoid:", message: "Hey, I\'m a penguin again. What happened?" },
        { name: "Reporter:", message: "You turned into Squidzoid!" },
        { name: "Witness:", message: "And started eating the city!" },
        { name: "Squidzoid:", message: "Oh! I had a monster appetite!" },
        { name: "SG:", message: "But there\'s still Melmonst!" },
        { name: "Squidzoid:", message: "Hmm...looks kind of stuck up there." },
        { name: "GG:", message: "Not a danger at all!" },
        { name: "Witness:", message: "It makes a nice ornament." },
        { name: "GG:", message: "Looks like our work here is done!" },
        { name: "Squidzoid:", message: "Let\'s go get a fish pizza." },
        { name: "SG:", message: "Extra olives, please!" },
        { name: "Reporter:", message: "The city is saved! This reporter is signing off." },
        { note: "THE END" },
        { note: "Director" },
        { name: "Director:", message: "Places everyone!" },
        { name: "Director:", message: "Take it again from the top!" },
        { name: "Director:", message: "Excellent work, team. Keep it up!" },
        { name: "Director:", message: "That\'s a wrap!" },
        { name: "Director:", message: "Take a bow everyone!" }
      ]
    },
    rooms: {
      stage: 'archives:RoomsStage-October2009.swf',
      plaza: 'archives:RoomsPlaza-Play3-2.swf'
    },
    miscComments: ['A storm begins to take over the island'],
    temp: {
      storm: {
        rooms: {
          dojoext: 'archives:2009_Storm_dojoext.swf',
          dojohide: 'archives:2009_Storm_dojohide.swf',
          dojo: 'recreation:2009_storm/dojo.swf'
        }
      }
    },
    end: ['event']
  },
  {
    date: '2009-10-16',
    furnitureCatalog: 'archives:OctoberFurn09.swf',
    iglooList: [
      { display: 'Team Power', id: 33, pos: [1, 1] },
      { display: 'Ruby\'s Theme', id: 37, pos: [5, 1] },
      { display: 'Haunted Disco', id: 223, pos: [3, 2] },
      { display: 'Zero Gravity', id: 279, pos: [4, 2] }
    ],
    miscComments: ['The storm advances over the island'],
    temp: {
      storm: {
        rooms: {
          village: 'archives:2009_Storm_village.swf',
          mtn: 'archives:2009_Storm_mtn.swf',
          berg: 'recreation:2009_storm/berg.swf',
          shack: 'archives:2009_Storm_shack.swf'
        }
      }
    }
  },
  {
    date: '2009-10-23',
    miscComments: ['The storm takes over the island'],
    temp: {
      storm: {
        rooms: {
          beach: 'recreation:2009_storm/beach.swf',
          dock: 'recreation:2009_storm/dock.swf',
          forts: 'recreation:2009_storm/forts.swf',
          plaza: 'recreation:2009_storm/plaza.swf',
          town: 'recreation:2009_storm/town.swf'
        }
      }
    }
  },
  {
    date: '2009-10-24',
    localChanges: {
      'forms/library.swf': {
        en: 'recreation:library_2009.swf'
      }
    },
    temp: {
      party: {
        partyName: '4th Anniversary Party',
        rooms: {
          book: 'archives:RoomsBook-4thAnniversary.swf',
          coffee: 'archives:RoomsCoffee-4thAnniversary.swf',
          town: 'archives:RoomsTown-4thAnniversaryParty.swf'
        },
        music: {
          book: 250,
          coffee: 250,
          town: 250
        },
        startscreens: ['archives:EN4thAnniversaryLoginScreen.swf']
      }
    }
  },
  {
    date: '2009-10-26',
    end: ['party', 'storm'],
    temp: {
      party2: {
        partyName: 'Halloween Party',
        partyIcon: 'halloween',
        rooms: {
          mtn: 'archives:HalloweenParty2010SkiHill.swf',
          beach: 'archives:HalloweenParty2009RoomsBeach.swf',
          beacon: 'archives:HalloweenParty2009RoomsBeacon.swf',
          book: 'archives:HalloweenParty2009RoomsBook.swf',
          cave: 'archives:HalloweenParty2009RoomsCave.swf',
          coffee: 'archives:RoomsCoffeeHalloweenParty2009.swf',
          cove: 'archives:HalloweenParty2009RoomsCove.swf',
          lounge: 'archives:RoomsLounge-HalloweenParty2009.swf',
          dock: 'archives:HalloweenParty2009RoomsDock.swf',
          dojo: 'archives:HalloweenParty2009RoomsDojo.swf',
          dojoext: 'archives:HalloweenParty2009RoomsDojoext.swf',
          forest: 'archives:HalloweenParty2009RoomsForest.swf',
          shop: 'archives:RoomsShop-HalloweenParty2009.swf',
          berg: 'archives:HalloweenParty2009RoomsBerg.swf',
          party2: 'archives:HalloweenParty2009RoomsParty2.swf',
          light: 'archives:HalloweenParty2009RoomsLight.swf',
          attic: 'archives:HalloweenParty2009RoomsAttic.swf',
          mine: 'archives:RoomsMine-HalloweenParty2009.swf',
          shack: 'archives:RoomsShack-HalloweenParty2009.swf',
          dance: 'archives:HalloweenParty2009RoomsDance.swf',
          dojohide: 'archives:HalloweenParty2009RoomsDojohide.swf',
          pet: 'archives:HalloweenParty2009RoomsPet.swf',
          pizza: 'archives:RoomsPizza-HalloweenParty2009.swf',
          plaza: 'archives:RoomsPlaza-HalloweenParty2009.swf',
          party: 'archives:HalloweenParty2009RoomsParty.swf',
          lodge: 'archives:HalloweenParty2009RoomsLodge.swf',
          village: 'archives:RoomsVillage-HalloweenParty2009.swf',
          forts: 'archives:HalloweenParty2009RoomsForts.swf',
          rink: 'archives:RoomsRink-HalloweenParty2009.swf',
          sport: 'archives:RoomsSport-HalloweenParty2009.swf',
          town: 'archives:RoomsTown-HalloweenParty2009.swf'
        },
        music: {
          beach: 251,
          beacon: 251,
          book: 252,
          cave: 252,
          coffee: 252,
          cove: 251,
          lounge: 224,
          dock: 251,
          forest: 251,
          shop: 252,
          berg: 251,
          light: 252,
          attic: 252,
          mine: 252,
          shack: 274,
          dance: 224,
          pet: 252,
          pizza: 253,
          plaza: 251,
          mtn: 251,
          lodge: 252,
          village: 251,
          forts: 251,
          rink: 251,
          sport: 252,
          town: 251,
          party: 253,
          party2: 252
        },
        globalChanges: {
          'rooms/NOTLS3EN.swf': 'archives:RoomsNOTLS3EN-HalloweenParty2009.swf'
        }
      }
    }
  },
  {
    date: '2009-11-01',
    end: ['party2'],
    temp: {
      // end of storm
      'fire-construction': {
        rooms: {
          dojohide: 'archives:RoomsDojohide-FireCelebratePre.swf'
        }
      }
    }
  },
  {
    date: '2009-11-05',
    constructionComment: 'Construction for Amulets begins in the Dojo Courtyard',
    temp: {
      event: {
        rooms: {
          dojoext: 'archives:RoomsDojoext-FireCelebratePre.swf'
        }
      }
    }
  },
  {
    date: '2009-11-06',
    clothingCatalog: 'archives:November09Style.swf'
  },
  {
    date: '2009-11-13',
    miscComments: ['The amulet is added to the Martial Artworks'],
    localChanges: {
      'catalogues/ninja.swf': {
        en: 'archives:November09Ninja2.swf'
      }
    },
    constructionComment: 'Construction for the Fire Dojo begins',
    temp: {
      event: {
        rooms: {
          dojofire: 'archives:RoomsDojofire-FireCelebratePre.swf',
        }
      }
    },
    stagePlay: {
      name: 'Norman Swarm Has Been Transformed',
      costumeTrunk: 'archives:Apr2011NormanSwarmHasBeenTransformedCostume.swf',
      script: [
        { note: "Norman Swarm Has Been Transformed" },
        { note: "Stand on the X\'s with the right amount of actors!" },
        { note: "Make sure there\'s at least one bug with you..." },
        { note: "Act 1: Overground" },
        { note: "NORMAN SWARM" },
        { name: "Norman Swarm:", message: "The laser! Look what it\'s done to me." },
        { name: "Norman Swarm:", message: "I\'ve been transformed! I\'m SO very small!" },
        { name: "Norman Swarm:", message: "I\'m like a bug! Is there a cure?" },
        { name: "Norman Swarm:", message: "I must find a cure!!!" },
        { name: "Norman Swarm:", message: "Now which way do we go?" },
        { name: "Norman Swarm:", message: "What\'ll happen if we stand here?" },
        { name: "Norman Swarm:", message: "I\'m not a bug! I\'m a penguin!" }, 
        { name: "Norman Swarm:", message: "Where can I find this Gnome?" },
        { name: "Norman Swarm:", message: "You look like you know your way around. Come with me!" },
        { name: "Norman Swarm:", message: "It seems I need bugs to help me!" },
        { note: "BONNIE THE MOTH" },
        { name: "Bonnie the Moth:", message: "Just gotta find that wise Garden Gnome!" },
        { name: "Bonnie the Moth:", message: "Hey! How\'s a spider like a top? Always spinning!" },
        { name: "Bonnie the Moth:", message: "What did one snail say to another? Get ya next slime!" },
        { name: "Bonnie the Moth:", message: "What\'s the biggest moth? A mammoth!" },
        { name: "Bonnie the Moth:", message: "Hey! You! Bee-have yourself! Hahaha!" },
        { name: "Bonnie the Moth:", message: "I could totally be wrong. But let\'s try standing here!" },
        { note: "GLADYS THE SPIDER" },
        { name: "Gladys the Spider:", message: "AHH! Help! A BUG!" },
        { name: "Gladys the Spider:", message: "Say, I\'ve not seen a bug like you before!" },
        { name: "Gladys the Spider:", message: "I AM? Oh my. No wonder I\'m scared of my own shadow." },
        { name: "Gladys the Spider:", message: "Well, we\'d better get you to see the Garden Gnome." },
        { name: "Gladys the Spider:", message: "Please don\'t give me a mirror. Bugs frighten me." },
        { name: "Gladys the Spider:", message: "You like the web? Thanks. I made it myself." },
        { name: "Gladys the Spider:", message: "This way. You can hold one of my hands if you wish." },
        { note: "TONI THE SNAIL" },
        { name: "Toni the Snail:", message: "I\'m no bug. I\'m a mollusk." },
        { name: "Toni the Snail:", message: "It\'s hard keeping up with a house on your back." },
        { name: "Toni the Snail:", message: "I guess you\'d better find the Garden Gnome." },
        { name: "Toni the Snail:", message: "Make your way to the door. I\'ll be there...soon." },
        { name: "Toni the Snail:", message: "A penguin? How\'d you get so little?" },
        { name: "Toni the Snail:", message: "Slow and steady - it\'s not a race, you know!" },
        { note: "FUZZ THE BEE" },
        { name: "Fuzz the Bee:", message: "Whatdya know! A puny penguin! I\'ve seen everything now!" },
        { name: "Fuzz the Bee:", message: "The Garden Gnome always has all the answers." },
        { name: "Fuzz the Bee:", message: "Watch out for the water!" },
        { name: "Fuzz the Bee:", message: "Hey! You\'re a strong swimmer!" },
        { name: "Fuzz the Bee:", message: "High five...or figh hive! Ha!" },
        { name: "Fuzz the Bee:", message: "Fly right this way! Oh...you don\'t fly? Too bad!" },
        { note: "End of Act 1" },
        { note: "Act 2: Underground" },
        { name: "Garden Gnome:", message: "Garden bugs, welcome. Tell me your worries." },
        { name: "Gladys the Spider:", message: "We\'ve brought a friend - he claims he\'s a penguin!" },
        { name: "Bonnie the Moth:", message: "He\'s half the penguin he used to be. Even smaller, actually!" },
        { name: "Fuzz the Bee:", message: "Said silly scientist has shrunk!" },
        { name: "Norman Swarm:", message: "It\'s true, I\'ve been transformed!" },
        { name: "Gladys the Spider:", message: "Do you have a cure for him?" },
        { name: "Garden Gnome:", message: "Stand on the stones - make sure there\'s a bug!" },
        { name: "Garden Gnome:", message: "You\'ve worked together and earned the treasure!" },
        { name: "Garden Gnome:", message: "Take your pin, exit, and you\'ll be back to normal." },
        { name: "Garden Gnome:", message: "Your pin is the cure!" },
        { name: "Garden Gnome:", message: "Take it and transform to your regular size. Don\'t bump your head" },
        { name: "Norman Swarm:", message: "Thank you, friends! It\'s time to take the door home." },
        { name: "Toni the Snail:", message: "I made it! Did I miss anything?" },
        { note: "THE END" },
        { note: "DIRECTOR" },
        { name: "Director:", message: "Places please!" },
        { name: "Director:", message: "And...action!" },
        { name: "Director:", message: "Fantastic acting. Well done!" },
        { name: "Director:", message: "Try standing on the X\'s." },
        { name: "Director:", message: "This isn\'t a rehearsal! Get into costume, please." },
        { note: "EXTRAS" },
        { name: "Director:", message: "Did you know the praying mantis can turn its head 180 degrees?!" },
        { name: "Director:", message: "Ladybugs beat their wings 85 times a second in flight." },
        { name: "Director:", message: "Snails are deaf!" },
        { name: "Director:", message: "Spiders can jump up to 40 times their own body length." },
        { name: "Director:", message: "Honeybees have hair on their eyes!" }
      ]
    },
    rooms: {
      dojohide: 'archives:RoomsDojohide_2.swf',
      stage: 'archives:RoomsStage-December2009.swf',
      plaza: 'archives:RoomsPlaza-Play14.swf',
      party1: 'archives:RoomsParty1-December2009.swf',

      dojofire: 'slegacy:media/play/v2/content/global/rooms/dojofire.swf'
    },
    end: ['fire-construction']
  },
  {
    date: '2009-11-20',
    end: ['event'],
    temp: {
      party: {
        partyName: 'Celebration of Fire',
        decorated: false,
        rooms: {
          // I actually don't know if this dojo exterior
          // is from this date, archives lists it as being from later one
          dojoext: 'archives:RoomsDojoext-FireCelebrate.swf',
          dojohide: 'archives:RoomsDojohide-FireCelebratePre2.swf',
          dojofire: 'archives:RoomsDojofire-FireCelebratePre2.swf'
        },
        startscreens: ['archives:ENLoginBackgroundsCard_jitsu_fire-FireCelebrate.swf']
      }
    },
    rooms: {
      dojohide: 'archives:RoomsDojohide_2.swf'
    }
  },
  {
    date: '2009-11-21',
    furnitureCatalog: 'archives:NovemberFurn09.swf'
  },
  {
    date: '2009-11-23',
    temp: {
      party: {
        update: 'Card-Jitsu Fire is now available',
        rooms: {
          dojohide: 'archives:RoomsDojohide-FireCelebrate.swf',
          dojofire: 'archives:RoomsDojofire-FireCelebrate.swf'
        }
      }
    }
  },
  {
    date: '2009-11-27',
    end: ['party'],
    temp: {
      party2: {
        partyName: 'Winter Party',
        rooms: {
          mtn: 'archives:RoomsMtn-WinterParty.swf',
          village: 'archives:RoomsVillage-WinterParty.swf',
          rink: 'archives:RoomsRink-WinterParty.swf',
          party: 'archives:RoomsParty-WinterParty.swf',
          party2: 'archives:RoomsParty2-WinterParty.swf',
          party3: 'fix:RoomsParty3-WinterParty.swf',
          party4: 'fix:RoomsParty4-WinterParty.swf',
          party5: 'fix:RoomsParty5-WinterParty.swf',
          party6: 'fix:RoomsParty6-WinterParty.swf',
          party7: 'archives:RoomsParty7-WinterParty.swf',
          party8: 'archives:RoomsParty8-WinterParty.swf',
          party9: 'archives:RoomsParty9-WinterParty.swf',
          party10: 'fix:RoomsParty10-WinterParty.swf',
          party11: 'archives:RoomsParty11-WinterParty.swf'
        },
        music: {
          rink: 280,
          village: 280,
          mtn: 280,
          party: 280,
          party2: 280,
          party3: 280,
          party4: 280,
          party5: 280,
          party6: 280,
          party7: 280,
          party8: 280,
          party9: 280,
          party10: 280,
          party11: 247
        },
        localChanges: {
          'close_ups/maze_map.swf': {
            'en': 'archives:ENClose_upsMaze_map-WinterParty.swf'
          }
        }
      }
    },
    roomComment: ['A video about Card-Jitsu fire is now on display at the Dojo Courtyard', 'The Ice Rink returns'],
    rooms: {
      dojoext: 'archives:RoomsDojoext_2.swf',

      town: 'archives:RoomsTown.swf',
      forts: 'archives:FortsWithIceRinkStadium.swf',
      rink: 'archives:RoomsRink.swf',
      agent: 'archives:RoomsAgent.swf'
    },
    sportCatalog: 'archives:SportNov2009.swf',
    map: 'archives:Map2008-2011Rink.swf'
  },
  {
    date: '2009-11-30',
    end: ['party2']
  },
  {
    date: '2009-12-04',
    clothingCatalog: 'archives:December09Style.swf'
  },
  {
    date: '2009-12-11',
    furnitureCatalog: 'archives:December09Furniture.swf',
    temp: {
      const: {
        rooms: {
          beach: 'archives:RoomsBeach-HolidayParty2009Pre.swf',
          shipquarters: 'archives:RoomsShipquarters-HolidayParty2009Pre.swf',
          shipnest: 'archives:RoomsShipnest-HolidayParty2009Pre.swf',
          lounge: 'archives:RoomsLounge-HolidayParty2009Pre.swf',
          dance: 'archives:RoomsDance-HolidayParty2009Pre.swf',
          ship: 'archives:RoomsShip-HolidayParty2009Pre.swf',
          plaza: 'archives:RoomsPlaza-HolidayParty2009Pre.swf',
          shiphold: 'archives:RoomsShiphold-HolidayParty2009Pre.swf',
          village: 'archives:RoomsVillage-HolidayParty2009Pre.swf',
          town: 'archives:RoomsTown-HolidayParty2009Construction.swf'
        }
      }
    }
  },
  {
    date: '2009-12-18',
    temp: {
      party: {
        partyName: 'Holiday Party',
        rooms: {
          ship: 'archives:HolidayParty2010Ship.swf',
          shipnest: 'archives:HolidayParty2010ShipNest.swf',
          shipquarters: 'archives:HolidayParty2010ShipQuarters.swf',
          shiphold: 'archives:HolidayParty2010ShipHold.swf',
          beach: 'archives:RoomsBeach-HolidayParty2009.swf',
          cove: 'archives:RoomsCove-HolidayParty2009.swf',
          dojofire: 'archives:RoomsDojofire-HolidayParty2009.swf',
          light: 'archives:RoomsLight-HolidayParty2009.swf',
          village: 'archives:RoomsVillage-HolidayParty2009.swf',
          beacon: 'archives:RoomsBeacon-HolidayParty2009.swf',
          forest: 'archives:RoomsForest-HolidayParty2009.swf',
          attic: 'archives:RoomsAttic-HolidayParty2009.swf',
          pizza: 'archives:RoomsPizza-HolidayParty2009.swf',
          forts: 'archives:RoomsForts-HolidayParty2009.swf',
          book: 'archives:RoomsBook-HolidayParty2009.swf',
          lounge: 'archives:RoomsLounge-HolidayParty2009.swf',
          shop: 'archives:RoomsShop-HolidayParty2009.swf',
          party: 'archives:RoomsParty-HolidayParty2009.swf',
          plaza: 'archives:RoomsPlaza-HolidayParty2009.swf',
          town: 'archives:RoomsTown-HolidayParty2009.swf',
          dock: 'archives:RoomsDock-HolidayParty2009.swf',
          agent: 'archives:HolidayParty2009AgentHQ.swf',
          shack: 'archives:RoomsShack-HolidayParty2009.swf',
          coffee: 'archives:RoomsCoffeeHolidayParty2009.swf',
          dojo: 'archives:RoomsDojo-HolidayParty2009.swf',
          berg: 'archives:RoomsBerg-HolidayParty2009.swf',
          dance: 'archives:RoomsDance-HolidayParty2009.swf',
          mtn: 'archives:RoomsMtn-HolidayParty2009.swf',
          agentcom: 'archives:RoomsAgentcom-HolidayParty2009.swf',
          dojoext: 'archives:RoomsDojoext-HolidayParty2009.swf',
          rink: 'archives:RoomsRink-HolidayParty2009.swf',
          dojohide: 'archives:RoomsDojohide-HolidayParty2009.swf',
          lodge: 'archives:RoomsLodge-HolidayParty2009.swf'
        },
        music: {
          attic: 255,
          beach: 254,
          beacon: 254,
          berg: 227,
          book: 255,
          coffee: 255,
          cove: 254,
          dance: 400,
          dock: 254,
          forest: 254,
          forts: 254,
          lodge: 255,
          lounge: 226,
          mtn: 254,
          pizza: 255,
          plaza: 254,
          rink: 254,
          shack: 254,
          town: 254,
          village: 254,
          party: 281
        },
        migrator: true,
        startscreens: ['archives:StartscreenChristmas-HolidayParty2009.swf']
      }
    }
  },
  {
    date: '2009-12-25',
    iglooList: [
      [{ display: 'Twelfth Fish Theme', id: 31, new: true }, { display: 'Rocksteady', id: 276 }],
      [{ display: 'Campfire Song', id: 220 }, { display: 'The Volcano', id: 22 }],
      [{ display: 'DJ Christmas', id: 226, new: true }, { display: 'Underwater', id: 121, new: true }],
      [{ display: 'Norman Swarm', id: 42 }, { display: 'Zero Gravity', id: 279 }],
      [{ display: 'Ninja Training', id: 116 }, { display: 'Santa\'s Mix', id: 254, new: true }],
      [{ display: 'Coconut', id: 215 }, { display: 'Twice Upon a Time', id: 39 }],
      [{ display: 'Extra Anchovies', id: 270 }, { display: 'Water Kongo', id: 217 }]
    ],
    temp: {
      party: {
        rooms: {
          plaza: 'recreation:holiday_09_plaza_quest_golden_puffle.swf'
        }
      }
    },
    stagePlay: {
      name: 'Quest for the Golden Puffle',
      costumeTrunk: 'archives:December2008Costume.swf'
    },
    rooms: {
      plaza: 'recreation:plaza_golden_puffle_no_weather.swf',
      stage: 'archives:RoomsStage-May2010.swf'
    }
  },
  {
    date: '2009-12-29',
    end: ['party']
  }
];
