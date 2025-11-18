import { Update } from ".";

export const UPDATES_2010: Update[] = [
  {
    date: '2010-01-02',
    clothingCatalog: 'archives:January10Style.swf'
  },
  {
    date: '2010-01-29',
    iglooList: [
      { display: 'Puffle Party', id: 282, pos: [3, 1] },
      { display: 'Float in the Clouds', id: 277, pos: [4, 2] },
      { display: 'Planet Y', id: 38, pos: [5, 2] },
      { display: 'Orca Straw', id: 245, pos: [6, 1] }
    ],
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
    date: '2010-02-25',
    miscComments: ['Orange Puffles are available to adopt'],
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
    date: '2010-04-01',
    clothingCatalog: 'archives:April10Style.swf'
  },
  {
    date: '2010-04-16',
    furnitureCatalog: 'archives:FurnApr2010.swf',
    iglooCatalog: 'archives:April2010Igloo.swf'
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
    clothingCatalog: 'archives:May2010.swf'
  },
  {
    date: '2010-05-14',
    furnitureCatalog: 'archives:May10Furniture.swf'
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
    date: '2010-05-27',
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
    date: '2010-07-01',
    migrator: false
  },
  {
    date: '2010-07-26',
    miscComments: ['Stamps are released'],
    fileChanges: {
      'play/v2/client/interface.swf': 'recreation:interfaces/2010_july.swf'
    }
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
    }
  },
  {
    date: '2010-09-03',
    clothingCatalog: 'archives:September10Style.swf',
    fileChanges: {
      'play/v2/games/paddle/paddle.swf': 'recreation:paddle_no_brown.swf'
    }
  },
  {
    date: '2010-09-24',
    furnitureCatalog: 'archives:FurnitureSept10.swf'
  },
  {
    date: '2010-10-01',
    clothingCatalog: 'archives:PSOct2010.swf'
  },
  {
    date: '2010-10-15',
    furnitureCatalog: 'archives:October10Furniture.swf'
  },
  {
    date: '2010-10-23',
    localChanges: {
      'forms/library.swf': {
        en: 'archives:ENFormsLibrary-2010.swf'
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
    ]
  },
  {
    date: '2010-11-12',
    furnitureCatalog: 'archives:FurnNov2010.swf',
    iglooCatalog: 'archives:November2010Igloo.swf'
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
    newspaper: 'period-start'
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
    ]
  },
  {
    date: '2010-12-10',
    furnitureCatalog: 'archives:FurnDec2010.swf'
  }
];