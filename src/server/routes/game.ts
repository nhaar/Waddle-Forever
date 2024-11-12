import { alternating, HttpRouter, HttpServer, range, spaced } from "../http";
import { SettingsManager } from "../settings";
import { getStampbook } from './stampjson';

export function createHttpServer(settingsManager: SettingsManager): HttpServer {
  const server = new HttpServer(settingsManager);

  const v2 = new HttpRouter(['play', 'v2'], server);

  const games = new HttpRouter('games', v2);

  const content = new HttpRouter('content', v2);

  const globalContent = new HttpRouter('global', content);

  const globalContentContent = new HttpRouter('content', globalContent);

  const telescope = new HttpRouter('telescope', globalContent);

  const localContent = new HttpRouter('local', content);

  const localContentEn = new HttpRouter('en', localContent);

  const client = new HttpRouter('client', v2);

  const rooms = new HttpRouter('rooms', globalContent);

  const stage = new HttpRouter('stage.swf', rooms);

  const plaza = new HttpRouter('plaza.swf', rooms);

  const rink = new HttpRouter('rink.swf', rooms);

  const dojoCourtyard = new HttpRouter('dojoext.swf', rooms);

  const globalCrumbs = new HttpRouter(['crumbs', 'global_crumbs.swf'], globalContent);

  const map = new HttpRouter('map.swf', globalContentContent);

  const binoculars = new HttpRouter('binoculars', globalContent);

  const iglooBackground = new HttpRouter(['igloo', 'assets', 'igloo_background.swf'], globalContent);

  const scavengerHunt = new HttpRouter('scavenger_hunt', globalContent);

  const login = new HttpRouter('login', localContentEn);

  const localEnCatalogues = new HttpRouter('catalogues', localContentEn);

  const enCloseUps = new HttpRouter('close_ups', localContentEn);

  const enNews = new HttpRouter('news', localContentEn);

  const worldAchievements = new HttpRouter(['web_service', 'worldachievements.xml'], server);

  const emptyBinoculars = new HttpRouter('empty.swf', binoculars);

  const iglooMusic = new HttpRouter('igloo_music.swf', globalContentContent);

  const prizebooth = new HttpRouter('prizebooth.swf', localEnCatalogues);

  const prizeboothmember = new HttpRouter('prizeboothmember.swf', localEnCatalogues);

  const costume = new HttpRouter('costume.swf', localEnCatalogues);

  const sportCatalogue = new HttpRouter('sport.swf', localEnCatalogues);
  
  const furnitureCatalogue = new HttpRouter('furniture.swf', localEnCatalogues);

  const clothingCatalogue = new HttpRouter('clothing.swf', localEnCatalogues);

  const iglooCatalogue = new HttpRouter('igloo.swf', localEnCatalogues);

  const petFurnitureCatalogue = new HttpRouter('pet.swf', localEnCatalogues);

  const ninjaCatalogue = new HttpRouter('ninja.swf', localEnCatalogues);

  const newCrumbs = new HttpRouter('news_crumbs.swf', enNews);

  const library = new HttpRouter(['forms', 'library.swf'], localContentEn);

  const puffleAdoptionPostcard = new HttpRouter(['postcards', '111.swf'], localContentEn);

  // TODO a better system for handling these special medias
  // entrypoint for as2 client
  server.get('boots.swf', (s) => {
    return `special/boots${s.settings.fps30 ? '30' : '24'}.swf`
  });
  
  server.getData(['en', 'web_service', 'stamps.json'], (s) => {
    return getStampbook(s.settings.version);
  })

  games.get(['thinice', 'ThinIce.swf'], (s) => {
    let suffix = s.settings.thin_ice_igt ? 'IGT' : 'Vanilla';
    if (s.settings.thin_ice_igt) {
      suffix += s.settings.fps30 ? '30' : '24'
    }
    return `special/ThinIce${suffix}.swf`
  })

  games.get(['dancing', 'dance.swf'], (s) => {
    return `special/dance_contest/${s.settings.swap_dance_arrow ? 'swapped' : 'vanilla'}.swf`;
  });

  games.get(['book1', 'bootstrap.swf'], (s) => {
    return `special/my_puffle/${s.settings.modern_my_puffle ? '2013' : 'original'}.swf`
  });

  games.get(['jetpack', 'JetpackAdventures.swf'], (s) => {
    return `special/jet_pack_adventure/${s.settings.jpa_level_selector ? 'level_selector' : 'vanilla'}.swf`;
  });

  games.get(['paddle', 'paddle.swf'], (s) => {
    // orange puffle was already in-game but seems like it wasnt in Fair 2010
    return `versions/paddle/white.swf`;
  });

  // HALLOWEEN PARTY 2010
  range('2010-Oct-28', '2010-Nov-24',
    [
      [rooms, 'versions/2010/halloween/rooms'],
      [rink, 'versions/2010/halloween/rooms/rink.swf'],
      [map, 'versions/2010/halloween/map.swf'],
      [telescope, 'versions/2010/halloween/telescope'],
      [globalCrumbs, 'versions/2010/halloween/global_crumbs.swf'],
      [binoculars, 'versions/2010/halloween/binoculars'],
      [iglooBackground, 'versions/2010/halloween/igloo_background.swf'],
      [scavengerHunt, 'versions/2010/halloween/scavenger_hunt'],
      [localEnCatalogues, 'versions/2010/halloween/catalogues'],
      [login, 'versions/2010/halloween/login'],
      [client, 'versions/2010/halloween/client'],
      [worldAchievements, 'versions/2010/halloween/worldachievements.xml']
    ]
  )

  // FAIR 2010
  range('2010-Sep-03', '2010-Sep-24',[
    [globalCrumbs, 'versions/2010/fair/global_crumbs.swf'],
    [rooms, 'versions/2010/fair/rooms'],
    [login, 'versions/2010/fair/login'],
    [client, 'versions/2010/fair/client'],
    [worldAchievements, 'versions/2010/fair/worldachievements.xml']
  ]);

  // FAIR 2010 first half
  range('2010-Sep-03', '2010-Sep-10', [
    [prizebooth, 'versions/2010/fair/start/prizebooth.swf'],
    [prizeboothmember, 'versions/2010/fair/start/prizeboothmember.swf']
  ])

  // FAIR 2010 second half
  range('2010-Sep-10', '2010-Sep-24', [
    [prizebooth, 'versions/2010/fair/end/prizebooth.swf'],
    [prizeboothmember, 'versions/2010/fair/end/prizeboothmember.swf']
  ])

  // 5th ANNIVERSARY
  range('2010-Oct-23', '2010-Oct-28', [
    [rooms, 'versions/2010/anniversary/rooms'],
    [globalCrumbs, 'versions/2010/anniversary/global_crumbs.swf']
  ]);

  alternating(
    [stage],
    [
      ['2010-Sep-03', 'versions/stage/squidzoid/2009_10/stage.swf'],
      ['2010-Sep-24', 'versions/stage/fairy/stage.swf'],
      ['2010-Oct-23', 'versions/stage/bamboo/stage.swf'],
      ['2010-Nov-24', 'versions/stage/planety/stage.swf']
    ]
  );

  alternating(
    [rink],
    [
      ['2010-Sep-03', 'versions/stadium/2010_05/rink.swf'],
      ['2010-Sep-24', 'versions/2010/stadium_games/rink.swf']
    ]
  );

  alternating(
    [dojoCourtyard],
    [
      ['2010-Sep-03', 'versions/cardjitsu/fireext.swf'],
      ['2010-Nov-24', 'versions/cardjitsu/waterext.swf']
    ]
  )

  range('2010-Oct-23', '2010-Oct-28', [
    [emptyBinoculars, 'versions/binoculars/storm_on_horizon.swf']
  ])

  alternating([iglooMusic],
    [
      ['2010-Sep-03', 'versions/igloo/2010_08_20/igloo_music.swf'],
      ['2010-Nov-24', 'versions/igloo/2010_11_12/igloo_music.swf']
    ]
  )

  alternating([map],
    [
      ['2010-Sep-24', 'versions/map/2010_09_24.swf']
    ]
  );

  globalContent.get('tickets.swf', () => {
    return `versions/2010/fair/tickets.swf`
  })

  globalContent.get('ticket_icon.swf', () => {
    return `versions/2010/fair/ticket_icon.swf`
  })

  spaced([globalCrumbs], [
    ['2010-Sep-24', '2010-Oct-23', 'versions/2010/stadium_games/global_crumbs.swf']
  ]);

  globalContent.dir('clothing', (s) => {
    return s.settings.clothing ? 'clothing' : undefined;
  })

  globalContent.dir('music', () => {
    return 'music'
  })

  globalContent.dir('furniture', () => {
    return `furniture`
  })

  // STAGE PLAYS
  alternating(
    [plaza, costume],
    [
      ['2010-Sep-03', '', 'versions/stage/squidzoid/2011_03/costume.swf'],
      ['2010-Sep-24', 'versions/stage/fairy/plaza.swf', 'versions/stage/fairy/costume.swf'],
      ['2010-Oct-23', 'versions/stage/bamboo/plaza.swf', 'versions/stage/bamboo/costume.swf'],
      ['2010-Nov-24', 'versions/stage/planety/plaza.swf', 'versions/stage/planety/costume.swf']
    ]
  )

  alternating([sportCatalogue], [
    ['2010-Sep-03', 'versions/stadium/2010_05/sport.swf'],
    ['2010-Sep-24', 'versions/2010/stadium_games/sport.swf']
  ])

  alternating([furnitureCatalogue], [
    ['2010-Sep-03', 'versions/igloo/2010_08_20/furniture.swf'],
    ['2010-Sep-24', 'versions/igloo/2010_09_24/furniture.swf'],
    ['2010-Oct-23', 'versions/igloo/2010_10_15/furniture.swf'],
    ['2010-Nov-24', 'versions/igloo/2010_11_12/furniture.swf']
  ])

  alternating([clothingCatalogue], [
    ['2010-Sep-03', 'versions/clothing/2010_09_03.swf'],
    ['2010-Oct-23', 'versions/clothing/2010_10_1.swf'],
    ['2010-Nov-24', 'versions/clothing/2010_11_05.swf']
  ])

  alternating([iglooCatalogue], [
    ['2010-Sep-03', 'versions/igloo/2010_08_20/igloo.swf'],
    ['2010-Nov-24', 'versions/igloo/2010_11_12/igloo.swf']
  ])

  alternating([petFurnitureCatalogue], [
    ['2010-Sep-03', 'versions/puffle/2010_03_19/pets.swf']
  ])

  alternating([puffleAdoptionPostcard], [
    ['2010-Sep-03', 'versions/puffle/2010_02_25/111.swf']
  ])

  alternating([ninjaCatalogue], [
    ['2010-Sep-03', 'versions/ninja/2009_11_13/ninja.swf']
  ])

  alternating([newCrumbs], [
    ['2010-Sep-03', 'versions/news_crumbs/2010_09_02.swf'],
    ['2010-Sep-10', 'versions/news_crumbs/2010_09_09.swf'],
    ['2010-Sep-24', 'versions/news_crumbs/2010_09_23.swf'],
    ['2010-Oct-23', 'versions/news_crumbs/2010_10_21.swf'],
    ['2010-Oct-28', 'versions/news_crumbs/2010_10_28.swf'],
    ['2010-Nov-24', 'versions/news_crumbs/2010_11_11.swf']
  ])

  enNews.dir('', () => {
    return 'newspapers';
  })
  
  localContentEn.get(['membership', 'party3.swf'], () => {
    return `versions/2010/halloween/membership_party3.swf`
  })

  enCloseUps.get('poster.swf', () => {
    return 'versions/2010/fair/poster.swf'
  })

  enCloseUps.get('halloweenposter.swf', () => {
    return 'versions/2010/halloween/poster.swf'
  })

  alternating([library], [
    ['2010-Sep-03', 'versions/library/2009_10_24.swf'],
    ['2010-Oct-23', 'versions/library/2010_10_23.swf']
  ])

  client.get('shell.swf', (s) => {
    return `special/shell/${s.settings.remove_idle ? 'no_idle' : 'vanilla'}.swf`
  })
  
  server.get('', (s) => {
    return `special/index.html/${s.settings.minified_website ? 'minified' : 'as2-website'}.html`
  });

  return server
}