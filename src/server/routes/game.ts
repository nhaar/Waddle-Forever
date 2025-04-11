import { HttpServer } from "../http";
import { SettingsManager } from "../settings";
import { getStampbook } from './stampjson';
import { isEngine1, isEngine2, isEngine3 } from "./versions";
import { getSetupXml } from "./engine1setup";
import { getServersXml } from "../servers";

export function createHttpServer(settingsManager: SettingsManager): HttpServer {
  const server = new HttpServer(settingsManager);

  // Engine 3 login page requires this URL
  server.get('/#/login', () => {
    return `default/special/index.html/engine3.html`;
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

  // events, parties
  server.addEvents(
    ['2005/beta_test_party', '2005-Sep-21', '2005-Sep-22'],
    ['2005/halloween_2005', '2005-Oct-27', '2005-Nov-01'],
    ['2005/puffle_discovery', '2005-Nov-15', '2005-Dec-05'],
    ['2005/christmas_2005', '2005-Dec-22', '2005-Dec-26'],
    ['2006/valentine_day_celebration', '2006-Feb-14', '2006-Feb-15'],
    ['2006/pizza_parlor_opening_party', '2006-Feb-24', '2006-Feb-28'],
    ['2006/april_fools_2006', '2006-Mar-31', '2006-Apr-03'],
    ['2010/music_jam_construction', '2010-Jul-01', '2010-Jul-09'],
    ['2010/4th_of_july', '2010-Jul-01', '2010-Jul-05'],
    ['2010/music_jam_construction_no_fireworks', '2010-Jul-05', '2010-Jul-09'],
    ['2010/music_jam', '2010-Jul-09', '2010-Jul-19'],
    ['2010/mountain_expedition', '2010-Aug-12', '2010-Aug-19'],
    ['2010/fair_2010', '2010-Sep-03', '2010-Sep-24'],
    ['2010/fair_2010_start', '2010-Sep-03', '2010-Sep-10'],
    ['2010/fair_2010_end', '2010-Sep-10', '2010-Sep-24'],
    ['2010/5th_anniversary_party', '2010-Oct-23', '2010-Oct-28'],
    ['2010/halloween_party_2010', '2010-Oct-28', '2010-Nov-24']
  );

  // automatically enable seasonals
  server.addSeasonals();

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