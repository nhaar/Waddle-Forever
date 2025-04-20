import { HttpServer } from "../http";
import { SettingsManager } from "../settings";
import { getStampbook } from './stampjson';
import { isEngine1, isEngine2, isEngine3 } from "./versions";
import { getSetupXml } from "./setup.xml";
import { getServersXml } from "../servers";
import { getDynamicMusicListData } from "../game/igloo-lists";

export function createHttpServer(settingsManager: SettingsManager): HttpServer {
  const server = new HttpServer(settingsManager);

  server.addFileServer();

  // serving the websites
  server.dir('', (s) => {
    if (isEngine1(s.settings.version)) {
      return 'websites/old';
    } else if (isEngine2(s.settings.version)) {
      return 'websites/classic';
    } else if (isEngine3(s.settings.version)) {
      return 'websites/modern';
    }
  })

  server.get('/', (s) => {
    if (isEngine1(s.settings.version)) {
      return 'websites/old-precpip.html';
    } else if (isEngine2(s.settings.version)) {
      return 'websites/classic-cpip.html';
    } else {
      return 'websites/modern-as3.html';
    }
  });


  // Engine 3 login page requires this URL
  server.get('/#/login', () => {
    return `websites/modern-as3.html`;
  })

  // setting dependent media
  server.addSpecials(
    ['boots.swf', (s) => {
      return s.settings.fps30 ? '30' : '24'
    }],
    ['play/v2/games/thinice/ThinIce.swf',  (s) => {
      let file = s.settings.thin_ice_igt ? 'igt' : 'vanilla';
      if (s.settings.thin_ice_igt) {
        file += s.settings.fps30 ? '30' : '24'
      }
      return file;
    }],
    ['play/v2/games/dancing/dance.swf', (s) => {
      return s.settings.swap_dance_arrow ? 'swapped' : 'vanilla';
    }],
    ['play/v2/games/book1/bootstrap.swf', (s) => {
      return s.settings.modern_my_puffle ? '2013' : 'original';
    }],
    ['play/v2/games/jetpack/JetpackAdventures.swf',  (s) => {
      return s.settings.jpa_level_selector ? 'level_selector' : 'vanilla';
    }],
    ['play/v2/client/shell.swf', (s) => {
      if (isEngine3(s.settings.version)) {
        return 'engine3';
      }
      return s.settings.remove_idle ? 'no_idle' : 'vanilla';
    }],
    ['index.html', (s) => {
      if (isEngine1(s.settings.version)) {
        return 'engine1';
      } else if (isEngine3(s.settings.version)) {
        return 'engine3';
      } else {
        return s.settings.minified_website ? 'minified-engine2' : 'engine2';
      }
    }]
  );

  // important redirects
  server.redirectDirs(
    ['play/v2/content/global/clothing', 'clothing'], // clothing is its own package due to its high size
    ['play/v2/content/global/music', 'default/music'], // (engine 2) non fundamental music that may potentially become a package,
    ['music', 'default/static/engine2/play/v2/content/global/music'], // sharing the engine 1 and engine 2 music,
    ['music', 'default/music'], // same as the two above
    ['play/v2/content/global/furniture', 'default/furniture'], // furniture may become a package in the future
    ['artwork/items', 'clothing/sprites'] // items in engine 1 (TODO try removing this, I thought items were in chat)
  );

  // text file generating
  server.getData('en/web_service/stamps.json', (s) => {
    return getStampbook(s.settings.version);
  });
  server.getData('servers.xml', getServersXml);
  server.getData('setup.xml', (s) => {
    return getSetupXml(s.settings.version);
  });

  // serving dynamic igloo data for ben/randomno's dynamic igloo music list mod
  server.getData('play/v2/content/global/en/igloo_music.xml', (s) => {
    return getDynamicMusicListData(s.settings.version);
  });
  
  // FALL BACK AND STATIC SERVING
  server.dir('', (s) => {
    if (isEngine1(s.settings.version)) {
      return 'default/static/engine1'
    } else if (isEngine3(s.settings.version)) {
      return 'default/static/engine3';
    } else {
      return 'default/static/engine2'
    }
  })
  // SECOND LAYER FALLBACK
  server.dir('', (s) => {
    if (isEngine3(s.settings.version) || isEngine2(s.settings.version)) {
      return 'default/static/engine2_3';
    }
  })
  
  return server
}