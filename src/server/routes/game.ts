import path from 'path';
import fs from 'fs';
import { HttpServer } from "../http";
import { SettingsManager } from "../settings";
import { isLower } from './versions';

export function createHttpServer(settingsManager: SettingsManager): HttpServer {
  const server = new HttpServer(settingsManager);

  // TODO a better system for handling these special medias
  // entrypoint for as2 client
  server.get('/boots.swf', (s) => {
    return `special/boots${s.settings.fps30 ? '30' : '24'}.swf`
  });

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
    if (isLower(s.settings.version, '2010-Nov-24')) {
      return `versions/stage/bamboo/stage.swf`
    } else {
      return `versions/stage/planety/stage.swf`
    }

    throw new Error('Not implemented');
  })

  server.get('/play/v2/content/global/rooms/plaza.swf', (s) => {
    if (s.settings.version === '2010-Oct-28') {
      return `versions/2010/halloween/rooms/plaza.swf`;
    } else if (isLower(s.settings.version, '2010-Nov-24')) {
      return `versions/stage/bamboo/plaza.swf`
    } else {
      return `versions/stage/bamboo/planety.swf`
    }

    throw new Error('Not implemented');
  })

  server.get('/play/v2/content/local/en/catalogues/costume.swf', (s) => {
    if (isLower(s.settings.version, '2010-Nov-24')) {
      return `versions/stage/bamboo/costume.swf`
    } else {
      return `versions/stage/planety/costume.swf`
    }

    throw new Error('Not implemented');
  })

  server.dir('/play/v2/content/global/rooms', (s, d) => {
    switch (s.settings.version) {
      case '2010-Nov-24': return undefined;
      case '2010-Oct-23': return `versions/2010/anniversary/rooms/${d}`;
      case '2010-Oct-28': return `versions/2010/halloween/rooms/${d}`;
      default: throw new Error('Not implemented');
    }
  })

  server.get('/play/v2/content/global/crumbs/global_crumbs.swf', (s, r) => {
    switch (s.settings.version) {
      case '2010-Oct-23': return `versions/2010/anniversary/global_crumbs.swf`
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
      default: return `static/${r}`;
    }
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
      case '2010-Oct-28': return 'versions/2010/halloween/worldachievements.xml';
      default: return undefined;
    }
  })

  server.get('/play/v2/content/local/en/news/news_crumbs.swf', (s) => {
    switch (s.settings.version) {
      case '2010-Oct-23': return 'versions/2010/anniversary/news_crumbs.swf'
      case '2010-Oct-28': return 'versions/2010/halloween/news_crumbs.swf';
      case '2010-Nov-24': return 'versions/2010/nov-24/news_crumbs.swf'
      default: throw new Error('Not implemented');
    }
  })

  server.dir('/play/v2/content/local/en/news', (_, d) => {
    return `newspapers/${d}`;
  })

  return server
}