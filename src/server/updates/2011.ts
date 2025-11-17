import { Update } from ".";

export const UPDATES_2011: Update[] = [
  {
    date: '2011-01-11',
    clothingCatalog: 'archives:January11Style.swf'
  },
  {
    date: '2011-01-14',
    furnitureCatalog: 'archives:Jan-Feb2011BetterIgloos.swf'
  },
  {
    date: '2010-01-17',
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
    ]
  },
  {
    date: '2011-02-11',
    clothingCatalog: 'archives:PenguinStyleFeb2011.swf',
    furnitureCatalog: 'archives:Feb-Mar2011BetterIgloos.swf'
  },
  {
    date: '2011-03-11',
    clothingCatalog: 'archives:PenguinStyleMar2011.swf',
    furnitureCatalog: 'archives:Mar-Apr2011Furniture.swf'
  },
  {
    date: '2011-03-28',
    rooms: {
      // bits and bolts: currently doesn't work due to missing engine.swf functionality
      lounge: 'archives:RoomsLounge_2.swf'
    }
  },
  {
    date: '2011-04-01',
    clothingCatalog: 'archives:PenguinStyleApr2011.swf'
  },
  {
    date: '2011-04-08',
    furnitureCatalog: 'archives:AprMay2011Furniture.swf'
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
    date: '2011-06-03',
    clothingCatalog: 'archives:PenguinStyleJun2011.swf'
  },
  {
    date: '2011-06-10',
    furnitureCatalog: 'archives:Jun2011Furniture.swf'
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
    date: '2011-07-06',
    clothingCatalog: 'archives:PenguinStyleJul2011.swf',
    newspaper: 'irregular'
  },
  {
    date: '2011-07-14',
    furnitureCatalog: 'archives:Jul2011Furniture.swf',
    newspaper: 'irregular'
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
    clothingCatalog: 'archives:PenguinStyleAug2011.swf'
  },
  {
    date: '2011-08-11',
    furnitureCatalog: 'archives:Aug-Sept2011Furniture.swf'
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
      lounge: 'archives:RoomsLounge_4.swf'
    }
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
    clothingCatalog: 'archives:PenguinStyleNov2011.swf'
  },
  {
    date: '2011-11-10',
    furnitureCatalog: 'archives:NovDec2011Furniture.swf'
  },
  {
    date: '2011-12-01',
    clothingCatalog: 'archives:PenguinStyleDec2011.swf'
  },
  {
    date: '2011-12-15',
    furnitureCatalog: 'archives:December2011Furniture.swf'
  },
  {
    date: '2011-12-29',
    newspaper: 'period-end'
  }
];