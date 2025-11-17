import { Update } from ".";

export const UPDATES_2008: Update[] = [
  {
    date: '2008-01-04',
    clothingCatalog: 'archives:Clothing_0801.swf'
  },
  {
    date: '2008-02-01',
    clothingCatalog: 'archives:Feb2008.swf'
  },
  {
    date: '2008-03-07',
    clothingCatalog: 'archives:PenguinStyleMar2008.swf'
  },
  {
    date: '2008-04-04',
    clothingCatalog: 'archives:Apr2008.swf'
  },
  {
    date: '2008-05-02',
    clothingCatalog: 'archives:May2008.swf'
  },
  {
    date: '2008-06-06',
    clothingCatalog: 'archives:Jun2008.swf'
  },
  {
    date: '2008-06-20',
    furnitureCatalog: 'archives:Jun-Jul2008Furniture.swf'
  },
  {
    date: '2008-07-04',
    clothingCatalog: 'archives:July08Style.swf'
  },
  {
    date: '2008-07-15',
    miscComments: ['The Club Penguin Improvement Project is implemented'],
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
    music: {
      // no idea on this one's date, adding it here
      lounge: 6
    },
    memberRooms: {
      dojofire: true,
      dojowater: true,
    },
    fileChanges: {
      'play/v2/client/startscreen.swf': 'recreation:startscreen/cpip.swf',
      'play/v2/client/login.swf': 'recreation:login_cpip.swf',
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
    map: 'unknown:cpip_map_no_dojoext.swf'
  },
  {
    date: '2008-07-18',
    furnitureCatalog: 'archives:FurnJul2008.swf'
  },
  {
    date: '2008-08-01',
    clothingCatalog: 'archives:PSAug2008.swf'
  },
  {
    date: '2008-08-15',
    iglooCatalog: 'archives:August2008Igloo.swf'
  },
  {
    date: '2008-08-29',
    furnitureCatalog: 'archives:FurnAug2008.swf'
  },
  {
    date: '2008-09-05',
    clothingCatalog: 'archives:Sep2008.swf'
  },
  {
    date: '2008-09-19',
    furnitureCatalog: 'archives:FurnSep2008.swf'
  },
  {
    date: '2008-10-03',
    clothingCatalog: 'archives:CatOct2008.swf'
  },
  {
    date: '2008-10-17',
    furnitureCatalog: 'archives:FurnOct2008.swf'
  },
  {
    date: '2008-10-24',
    miscComments: ['The start screen is updated with the introduction of Unlock Items Online'],
    fileChanges: {
      'play/v2/client/startscreen.swf': 'recreation:startscreen/unlock_items.swf',
      'play/v2/client/login.swf': 'archives:ClientLogin2008.swf'
    },
    startscreens: [ 'recreation:startscreen/unlock_items_logo.swf' ]
  },
  {
    date: '2008-11-07',
    clothingCatalog: 'archives:CatNov2008.swf'
  },
  {
    date: '2008-12-05',
    clothingCatalog: 'archives:December08Style.swf'
  },
  {
    date: '2008-12-12',
    furnitureCatalog: 'archives:FurnDec2008.swf'
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
  }
];