import { HttpServer } from "../http";
import { SettingsManager } from "../settings";
import { getStampbook } from './stampjson';
import { isAs1 } from "./versions";
import { getSetupXml } from "./as1setup";
import { getServersXml } from "../servers";

export function createHttpServer(settingsManager: SettingsManager): HttpServer {
  const server = new HttpServer(settingsManager);

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
      return s.settings.remove_idle ? 'no_idle' : 'vanilla';
    }],
    ['index.html', (s) => {
      if (isAs1(s.settings.version)) {
        return 'as1';
      } else {
        return s.settings.minified_website ? 'minified-as2' : 'as2';
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
    ['play/v2/content/global/music', 'default/music'], // (as2) non fundamental music that may potentially become a package,
    ['music', 'default/static/as2/play/v2/content/global/music'], // sharing the as1 and as2 music,
    ['music', 'default/music'], // same as the two above
    ['play/v2/content/global/furniture', 'default/furniture'], // furniture may become a package in the future
    ['artwork/items', 'clothing/sprites'] // items in as1 (TODO try removing this, I thought items were in chat)
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
    if (isAs1(s.settings.version)) {
      return 'default/static/as1'
    } else {
      return 'default/static/as2'
    }
  })
  
  return server
}