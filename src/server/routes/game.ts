import path from 'path';
import fs from 'fs';
import { HttpServer } from "../http";
import { SettingsManager } from "../settings";
import { isGreaterOrEqual, isLower, isLowerOrEqual } from './versions';
import { getStampbook } from './stampjson';

export function createHttpServer(settingsManager: SettingsManager): HttpServer {
  const server = new HttpServer(settingsManager);

  // TODO a better system for handling these special medias
  // entrypoint for as2 client
  server.get('/boots.swf', (s) => {
    return `special/boots${s.settings.fps30 ? '30' : '24'}.swf`
  });

  server.router.get('/en/web_service/stamps.json', (_, res) => {
    res.send(getStampbook(server.settingsManager.settings.version))
  })

  server.get('/play/v2/games/thinice/ThinIce.swf', (s) => {
    let suffix = s.settings.thin_ice_igt ? 'IGT' : 'Vanilla';
    if (s.settings.thin_ice_igt) {
      suffix += s.settings.fps30 ? '30' : '24'
    }
    return `special/ThinIce${suffix}.swf`
  });

  server.get('/play/v2/games/dancing/dance.swf', (s) => {
    return `special/dance_contest/${s.settings.swap_dance_arrow ? 'swapped' : 'vanilla'}.swf`;
  });

  server.get('/', () => `special/index.html`);

  server.get('/play/v2/games/book1/bootstrap.swf', (s) => {
    return `special/my_puffle/${s.settings.modern_my_puffle ? '2013' : 'original'}.swf`
  });

  server.dir('/play/v2/content/global/clothing', (s, d) => {
    return s.settings.clothing ? path.join('clothing', d) : undefined;
  })

  server.get('/play/v2/client/shell.swf', (s) => {
    return `special/shell/${s.settings.remove_idle ? 'no_idle' : 'vanilla'}.swf`
  });

  server.get('/play/v2/games/jetpack/JetpackAdventures.swf', (s) => {
    return `special/jet_pack_adventure/${s.settings.jpa_level_selector ? 'level_selector' : 'vanilla'}.swf`;
  });

  server.get('/play/v2/content/global/rooms/stage.swf', (s) => {
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

  server.get('/play/v2/content/global/rooms/plaza.swf', (s) => {
    switch (s.settings.version) {
      case '2010-Sep-03': return `versions/2010/fair/rooms/plaza.swf`
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

  server.get('/play/v2/content/local/en/catalogues/prizebooth.swf', () => {
    return `versions/2010/fair/prizebooth.swf`
  })

  server.get('/play/v2/content/local/en/catalogues/prizeboothmember.swf', () => {
    return `versions/2010/fair/prizeboothmember.swf`
  })

  server.get('/play/v2/content/local/en/catalogues/costume.swf', (s) => {
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

  server.get('/play/v2/content/global/rooms/rink.swf', (s) => {    
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

  server.get('/play/v2/content/local/en/catalogues/sport.swf', (s) => {
    if (isLower(s.settings.version, '2010-Sep-24')) {
      return `versions/stadium/2010_05/sport.swf`;
    } else {
      return `versions/2010/stadium_games/sport.swf`;
    }
  })

  server.dir('/play/v2/content/global/rooms', (s, d) => {
    switch (s.settings.version) {
      case '2010-Sep-03': return `versions/2010/fair/rooms/${d}`;
      case '2010-Oct-23': return `versions/2010/anniversary/rooms/${d}`;
      case '2010-Oct-28': return `versions/2010/halloween/rooms/${d}`;
      default: return undefined;
    }
  })

  server.get('/play/v2/content/global/tickets.swf', () => {
    return `versions/2010/fair/tickets.swf`
  })

  server.get('/play/v2/content/global/ticket_icon.swf', () => {
    return `versions/2010/fair/ticket_icon.swf`
  })

  server.get('/play/v2/content/global/crumbs/global_crumbs.swf', (s, r) => {
    switch (s.settings.version) {
      case '2010-Sep-03': return `versions/2010/fair/global_crumbs.swf`
      case '2010-Sep-24': return `versions/2010/stadium_games/global_crumbs.swf`;
      case '2010-Oct-23': return `versions/2010/anniversary/global_crumbs.swf`;
      case '2010-Oct-28': return `versions/2010/halloween/global_crumbs.swf`;
      default: return `static/${r}`;
    }
  })

  server.dir('/play/v2/content/global/music', (s, d) => {
    const mediaPath = `music/${d}`;
    const file = path.join(process.cwd(), 'media', mediaPath);
    if (fs.existsSync(file)) {
      return mediaPath
    } else {
      return undefined;
    }
  })

  server.get('/play/v2/content/local/en/membership/party3.swf', () => {
    return `versions/2010/halloween/membership_party3.swf`
  })

  server.get('/play/v2/content/global/content/map.swf', (s, r) => {
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

  server.get('/play/v2/content/local/en/close_ups/poster.swf', () => {
    return 'versions/2010/fair/poster.swf'
  })

  server.get('/play/v2/content/local/en/close_ups/halloweenposter.swf', () => {
    return 'versions/2010/halloween/poster.swf'
  })

  server.dir('/play/v2/content/local/en/catalogues', (s, d) => {
    switch (s.settings.version) {
      case '2010-Oct-28': return `versions/2010/halloween/catalogues/${d}`;
      default: return undefined;
    }
  })

  server.dir('/play/v2/content/local/en/login', (s, d) => {
    switch (s.settings.version) {
      case '2010-Sep-03': return `versions/2010/fair/login/${d}`
      case '2010-Oct-28': return `versions/2010/halloween/login/${d}`
      default: return undefined;
    }
  })

  server.dir('/play/v2/content/global/binoculars', (s, d) => {
    switch (s.settings.version) {
      case '2010-Oct-28': return `versions/2010/halloween/binoculars/${d}`;
      default: return undefined;
    }
  })

  server.dir('/play/v2/content/global/telescope', (s, d) => {
    switch (s.settings.version) {
      case '2010-Oct-28': return `versions/2010/halloween/telescope/${d}`
      default: return undefined;
    }
  })

  server.get('/play/v2/content/global/igloo/assets/igloo_background.swf', (s) => {
    switch (s.settings.version) {
      case '2010-Oct-28': return 'versions/2010/halloween/igloo_background.swf';
      default: undefined;
    }
  })

  server.dir('/play/v2/client', (s, d) => {
    switch (s.settings.version) {
      case '2010-Sep-03': return `versions/2010/fair/client/${d}`;
      case '2010-Oct-28': return `versions/2010/halloween/client/${d}`;
      default: return undefined;
    }
  })

  server.dir('/play/v2/content/global/scavenger_hunt', (s, d) => {
    switch (s.settings.version) {
      case '2010-Oct-28': return `versions/2010/halloween/scavenger_hunt/${d}`;
      default: return undefined;
    }
  })

  server.get('/web_service/worldachievements.xml', (s) => {
    switch (s.settings.version) {
      case '2010-Sep-03': return 'versions/2010/fair/worldachievements.xml';
      case '2010-Oct-28': return 'versions/2010/halloween/worldachievements.xml';
      default: return undefined;
    }
  })

  server.get('/play/v2/content/local/en/news/news_crumbs.swf', (s) => {
    switch (s.settings.version) {
      case '2010-Sep-03': return 'versions/news_crumbs/2010_09_02.swf'
      case '2010-Sep-24': return 'versions/news_crumbs/2010_09_23.swf';
      case '2010-Oct-23': return 'versions/news_crumbs/2010_10_21.swf';
      case '2010-Oct-28': return 'versions/news_crumbs/2010_10_28.swf';
      case '2010-Nov-24': return 'versions/news_crumbs/2010_09_30.swf';
      default: throw new Error('Not implemented');
    }
  })

  server.dir('/play/v2/content/local/en/news', (_, d) => {
    return `newspapers/${d}`;
  })

  server.get('/play/v2/content/local/en/catalogues/furniture.swf', (s) => {
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

  server.dir('/play/v2/content/global/furniture', (_, d) => {
    return `furniture/${d}`
  })

  server.get('/play/v2/content/global/content/igloo_music.swf', (s) => {
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

  server.get('/play/v2/content/local/en/catalogues/igloo.swf', (s) => {
    let date = ''
    if (isLower(s.settings.version, '2010-Nov-24')) {
      date = '2010_08_20';
    } else {
      date = '2010_11_12';
    }

    return `versions/igloo/${date}/igloo.swf`;
  })

  server.get('/play/v2/content/local/en/forms/library.swf', (s) => {
    if (isLower(s.settings.version, '2010-Oct-23')) {
      return `versions/library/2009_10_24.swf`
    } else {
      return `versions/library/2010_10_23.swf`
    }
  })

  server.get('/play/v2/content/local/en/catalogues/pets.swf', (s) => {
    if (isGreaterOrEqual(s.settings.version, '2010-Sep-03') || isLowerOrEqual(s.settings.version, '2010-Nov-24')) {
      return `versions/puffle/2010_03_19/pets.swf`
    }

    throw new Error('Not implemented');
  })

  server.get('/play/v2/content/local/en/catalogues/ninja.swf', (s) => {
    if (isGreaterOrEqual(s.settings.version, '2010-Sep-03') || isLowerOrEqual(s.settings.version, '2010-Nov-24')) {
      return `versions/ninja/2009_11_13/ninja.swf`
    }

    throw new Error('Not implemented');
  })

  server.get('/play/v2/content/local/en/catalogues/clothing.swf', (s) => {
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

  server.get('/play/v2/games/paddle/paddle.swf', (s) => {
    // orange puffle was already in-game but seems like it wasnt in Fair 2010
    return `versions/paddle/white.swf`;
  })

  return server
}