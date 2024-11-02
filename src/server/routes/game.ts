import { HttpRouter, HttpServer } from "../http";
import { SettingsManager } from "../settings";
import { isGreaterOrEqual, isLower, isLowerOrEqual } from './versions';
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

  const localEnCatalogues = new HttpRouter('catalogues', localContentEn);

  const enCloseUps = new HttpRouter('close_ups', localContentEn);

  const enNews = new HttpRouter('news', localContentEn);
  
  // TODO a better system for handling these special medias
  // entrypoint for as2 client
  server.get('boots.swf', (s) => {
    return `special/boots${s.settings.fps30 ? '30' : '24'}.swf`
  });
  
  server.router.get('/en/web_service/stamps.json', (_, res) => {
    res.send(getStampbook(server.settingsManager.settings.version))
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

  games.get(['paddle',' paddle.swf'], (s) => {
    // orange puffle was already in-game but seems like it wasnt in Fair 2010
    return `versions/paddle/white.swf`;
  });

  rooms.get('stage.swf', (s) => {
    if (isGreaterOrEqual(s.settings.version, '2010-Sep-03') && isLower(s.settings.version, '2010-Sep-24')) {
      return `versions/stage/squidzoid/2009_10/stage.swf`
    } else if (isLower(s.settings.version, '2010-Oct-23')) {
      return `versions/stage/fairy/stage.swf`
    } else if (isLower(s.settings.version, '2010-Nov-24')) {
      return `versions/stage/bamboo/stage.swf`
    } else {
      return `versions/stage/planety/stage.swf`
    }

    throw new Error('Not implemented');
  })

  rooms.get('plaza.swf', (s) => {
    switch (s.settings.version) {
      case '2010-Sep-03':
      case '2010-Sep-10':
        return `versions/2010/fair/rooms/plaza.swf`
      case '2010-Oct-28': return `versions/2010/halloween/rooms/plaza.swf`;
    }

    if (isGreaterOrEqual(s.settings.version, '2010-Sep-24') && isLower(s.settings.version, '2010-Oct-23')) {
      return `versions/stage/fairy/plaza.swf`
    } else if (isLower(s.settings.version, '2010-Nov-24')) {
      return `versions/stage/bamboo/plaza.swf`
    } else {
      return `versions/stage/planety/plaza.swf`
    }

    throw new Error('Not implemented');
  })

  rooms.get('rink.swf', (s) => {    
    switch (s.settings.version) {
      case '2010-Oct-28': return `versions/2010/halloween/rooms/rink.swf`;
    }

    if (isLower(s.settings.version, '2010-Sep-24')) {
      return `versions/stadium/2010_05/rink.swf`
    } else {
      return `versions/2010/stadium_games/rink.swf`;
    }

    throw new Error('Not implemented');
  })

  rooms.dir('', (s, d) => {
    switch (s.settings.version) {
      case '2010-Sep-03':
      case '2010-Sep-10':
        return `versions/2010/fair/rooms`;
      case '2010-Oct-23': return `versions/2010/anniversary/rooms`;
      case '2010-Oct-28': return `versions/2010/halloween/rooms`;
      default: return undefined;
    }
  })

  telescope.get('empty.swf', (s) => {
    if (s.settings.version === '2010-Oct-23') {
      return `versions/telescope/storm_on_horizon.swf`;
    }
  })

  telescope.dir('', (s, d) => {
    switch (s.settings.version) {
      case '2010-Oct-28': return `versions/2010/halloween/telescope`
      default: return undefined;
    }
  })

  globalContentContent.get('igloo_music.swf', (s) => {
    let date = ''
    if (isLower(s.settings.version, '2010-Nov-24')) {
      date = '2010_08_20';
    } else if (s.settings.version === '2010-Nov-24') {
      date = '2010_11_12';
    } else {
      date = '2011_05_13'
    }

    return `versions/igloo/${date}/igloo_music.swf`;
  })

  globalContentContent.get('map.swf', (s) => {
    switch (s.settings.version) {
      case '2010-Oct-28': return 'versions/2010/halloween/map.swf';
    }

    if (isLower(s.settings.version, '2010-Sep-24')) {
      return undefined;
    } else {
      return `versions/map/2010_09_24.swf`;
    }

    throw new Error('Not implemented');
  })

  globalContent.get('tickets.swf', () => {
    return `versions/2010/fair/tickets.swf`
  })

  globalContent.get('ticket_icon.swf', () => {
    return `versions/2010/fair/ticket_icon.swf`
  })

  globalContent.get(['crumbs', 'global_crumbs.swf'], (s) => {
    switch (s.settings.version) {
      case '2010-Sep-03':
      case '2010-Sep-10':
        return `versions/2010/fair/global_crumbs.swf`
      case '2010-Sep-24': return `versions/2010/stadium_games/global_crumbs.swf`;
      case '2010-Oct-23': return `versions/2010/anniversary/global_crumbs.swf`;
      case '2010-Oct-28': return `versions/2010/halloween/global_crumbs.swf`;
      default: return undefined;
    }
  })

  globalContent.dir('clothing', (s) => {
    return s.settings.clothing ? 'clothing' : undefined;
  })

  globalContent.dir('music', () => {
    return 'music'
  })

  globalContent.dir('binoculars', (s) => {
    switch (s.settings.version) {
      case '2010-Oct-28': return `versions/2010/halloween/binoculars`;
      default: return undefined;
    }
  })

  globalContent.get(['igloo', 'assets', 'igloo_background.swf'], (s) => {
    switch (s.settings.version) {
      case '2010-Oct-28': return 'versions/2010/halloween/igloo_background.swf';
      default: undefined;
    }
  })

  globalContent.dir('scavenger_hunt', (s) => {
    switch (s.settings.version) {
      case '2010-Oct-28': return `versions/2010/halloween/scavenger_hunt`;
      default: return undefined;
    }
  })

  globalContent.dir('furniture', () => {
    return `furniture`
  })

  localEnCatalogues.get('prizebooth.swf', (s) => {
    if (s.settings.version === '2010-Sep-03') {
      return `versions/2010/fair/start/prizebooth.swf`
    } else if (s.settings.version === '2010-Sep-10') {
      return `versions/2010/fair/end/prizebooth.swf`
    }
  })

  localEnCatalogues.get('prizeboothmember.swf', (s) => {
    if (s.settings.version === '2010-Sep-03') {
      return `versions/2010/fair/start/prizeboothmember.swf`
    } else if (s.settings.version === '2010-Sep-10') {
      return `versions/2010/fair/end/prizeboothmember.swf`
    }
  })

  localEnCatalogues.get('costume.swf', (s) => {
    if (isGreaterOrEqual(s.settings.version, '2010-Sep-03') && isLower(s.settings.version, '2010-Sep-24')) {
      return `versions/stage/squidzoid/2011_03/costume.swf`
    } else if (isLower(s.settings.version, '2010-Oct-23')) {
      return `versions/stage/fairy/costume.swf`
    } else if (isLower(s.settings.version, '2010-Nov-24')) {
      return `versions/stage/bamboo/costume.swf`
    } else {
      return `versions/stage/planety/costume.swf`
    }

    throw new Error('Not implemented');
  })

  localEnCatalogues.get('sport.swf', (s) => {
    if (isLower(s.settings.version, '2010-Sep-24')) {
      return `versions/stadium/2010_05/sport.swf`;
    } else {
      return `versions/2010/stadium_games/sport.swf`;
    }
  })

  localEnCatalogues.dir('', (s) => {
    switch (s.settings.version) {
      case '2010-Oct-28': return `versions/2010/halloween/catalogues`;
      default: return undefined;
    }
  })

  localEnCatalogues.get('furniture.swf', (s) => {
    let date = ''
    if (isLower(s.settings.version, '2010-Sep-24')) {
      date = '2010_08_20'
    } else if (isLower(s.settings.version, '2010-Oct-23')) {
      date = '2010_09_24'
    } else if (isLower(s.settings.version, '2010-Nov-24')) {
      date = '2010_10_15'
    } else {
      date = '2010_11_12'
    }
    return `versions/igloo/${date}/furniture.swf`;
  })

  localEnCatalogues.get('clothing.swf', (s) => {
    let date = ''
    if (isGreaterOrEqual(s.settings.version, '2010-Sep-03') && isLower(s.settings.version, '2010-Oct-23')) {
      date = '2010_09_03'
    } else if (isLower(s.settings.version, '2010-Nov-24')) {
      date = '2010_10_01'
    } else {
      date = '2010_11_05'
    }
    return `versions/clothing/${date}.swf`
  })

  localEnCatalogues.get('igloo.swf', (s) => {
    let date = ''
    if (isLower(s.settings.version, '2010-Nov-24')) {
      date = '2010_08_20';
    } else {
      date = '2010_11_12';
    }

    return `versions/igloo/${date}/igloo.swf`;
  })

  localEnCatalogues.get('pets.swf', (s) => {
    if (isGreaterOrEqual(s.settings.version, '2010-Sep-03') || isLowerOrEqual(s.settings.version, '2010-Nov-24')) {
      return `versions/puffle/2010_03_19/pets.swf`
    }

    throw new Error('Not implemented');
  })

  localEnCatalogues.get('ninja.swf', (s) => {
    if (isGreaterOrEqual(s.settings.version, '2010-Sep-03') || isLowerOrEqual(s.settings.version, '2010-Nov-24')) {
      return `versions/ninja/2009_11_13/ninja.swf`
    }

    throw new Error('Not implemented');
  })

  enNews.get('news_crumbs.swf', (s) => {
    switch (s.settings.version) {
      case '2010-Sep-03': return 'versions/news_crumbs/2010_09_02.swf'
      case '2010-Sep-10': return 'versions/news_crumbs/2010_09_09.swf'
      case '2010-Sep-24': return 'versions/news_crumbs/2010_09_23.swf';
      case '2010-Oct-23': return 'versions/news_crumbs/2010_10_21.swf';
      case '2010-Oct-28': return 'versions/news_crumbs/2010_10_28.swf';
      case '2010-Nov-24': return 'versions/news_crumbs/2010_09_30.swf';
      default: throw new Error('Not implemented');
    }
  })

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

  localContentEn.dir('login', (s) => {
    switch (s.settings.version) {
      case '2010-Sep-03':
      case '2010-Sep-10':
        return 'versions/2010/fair/login'
      case '2010-Oct-28': return 'versions/2010/halloween/login'
      default: return undefined;
    }
  })

  localContentEn.get(['forms', 'library.swf'], (s) => {
    if (isLower(s.settings.version, '2010-Oct-23')) {
      return `versions/library/2009_10_24.swf`
    } else {
      return `versions/library/2010_10_23.swf`
    }
  })

  client.get('shell.swf', (s) => {
    return `special/shell/${s.settings.remove_idle ? 'no_idle' : 'vanilla'}.swf`
  })

  client.dir('', (s) => {
    switch (s.settings.version) {
      case '2010-Sep-03':
      case '2010-Sep-10':
        return 'versions/2010/fair/client';
      case '2010-Oct-28': return 'versions/2010/halloween/client';
      default: return undefined;
    }
  })
  
  server.get('', () => `special/index.html`);

  server.get(['web_service', 'worldachievements.xml'], (s) => {
    switch (s.settings.version) {
      case '2010-Sep-03':
      case '2010-Sep-10':
        return 'versions/2010/fair/worldachievements.xml';
      case '2010-Oct-28': return 'versions/2010/halloween/worldachievements.xml';
      default: return undefined;
    }
  })

  return server
}