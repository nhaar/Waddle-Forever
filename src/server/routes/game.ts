import { HttpServer } from "../http";
import { SettingsManager } from "../settings";
import { getStampbook } from './stampjson';
import { isEngine1, isEngine2, isEngine3, isLower } from "./versions";
import { getSetupXml } from "./setup.xml";
import { getServersXml } from "../servers";
import { getDynamicMusicListData } from "../game-data/igloo-lists";
import { getVersionTxt } from "./version.txt";
import { getSetupTxt } from "./setup.txt";
import { getNewsTxt } from "./news.txt";
import { Update } from "../game-data/updates";
import { getEnvironmentDataXml } from "./environment_data.xml";

export function createHttpServer(settingsManager: SettingsManager): HttpServer {
  const server = new HttpServer(settingsManager);

  server.addFileServer();

  server.get('/', (s) => {
    if (isEngine1(s.settings.version)) {
      return 'default/websites/old-precpip.html';
    } else if (isEngine2(s.settings.version) && isLower(s.settings.version, Update.AS3_UPDATE)) {
      if (s.settings.minified_website) {
        return 'default/websites/minified-cpip.html';
      } else {
        return 'default/websites/classic-cpip.html';
      }
    } else if (!isEngine3(s.settings.version)) {
      return 'default/websites/classic-as3.html';
    } else {
      return 'default/websites/modern-as3.html';
    }
  });


  // Engine 3 login page requires this URL
  server.get('/#/login', () => {
    return `default/websites/modern-as3.html`;
  })

  // serving the websites
  server.dir('', (s) => {
    if (isEngine1(s.settings.version)) {
      return 'default/websites/old';
    } else if (isEngine2(s.settings.version)) {
      return 'default/websites/classic';
    } else if (isEngine3(s.settings.version)) {
      return 'default/websites/modern';
    }
  })

  // Pre CPIP server rewrite client uses these POST endpoints
  server.router.post('/setup.txt', (_, req) => {
    req.send(getSetupTxt(settingsManager.settings.version, settingsManager.targetIP));
  })
  server.router.post('/news.txt', (_, req) => {
    req.send(getNewsTxt(settingsManager.settings.version));
  })

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
  server.getData('servers.xml', (s) => getServersXml(s.targetIP));
  server.getData('setup.xml', (s) => {
    return getSetupXml(s.settings.version, s.targetIP);
  });
  server.getData('version.txt', (s) => {
    return getVersionTxt(s.settings.version);
  });
  server.getData('play/web_service/environment_data.xml', (s) => {
    return getEnvironmentDataXml(s.targetIP);
  });

  // serving dynamic igloo data for ben/randomno's dynamic igloo music list mod
  server.getData('play/v2/content/global/en/igloo_music.xml', (s) => {
    return getDynamicMusicListData(s.settings.version);
  });
  
  // FALL BACK AND STATIC SERVING
  server.dir('', (s) => {
    return 'static'
  })
  // SECOND LAYER FALLBACK
  server.dir('', (s) => {
    if (isEngine3(s.settings.version) || isEngine2(s.settings.version)) {
      return 'default/static/engine2_3';
    }
  })
  
  return server
}