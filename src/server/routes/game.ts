import fs from 'fs';
import path from 'path';

import { HttpServer } from "../http";
import { SettingsManager } from "../settings";
import { getStampsJson } from './stampjson';
import { getSetupXml } from "./setup.xml";
import { getServersXml } from "../servers";
import { getVersionTxt } from "./version.txt";
import { getSetupTxt } from "./setup.txt";
import { getNewsTxt } from "./news.txt";
import { getEnvironmentDataXml } from "./environment_data.xml";
import { getWorldAchievementsXml } from "./worldachievements.xml";
import { getStartscreenXML } from "./startscreen.xml";
import { getGeneralJson } from "./generaljson";
import { getPathsJson } from "./pathsjson";
import { getRoomsJson } from "./roomsjson";
import { getGameStrings } from "./gamestringsjson";
import { getChunkingMapJson } from "./chunkingmapjson";
import getStageScriptMessagesJson from "./stagemessagesjson";
import { getNewspapersJson } from "./newspapersjson";
import { getDynamicMusicListData } from "../timelines/igloo-lists";
import { isEngine2, isEngine3, isPreCpip, isAS3 } from "../timelines/dates";
import { findInVersion } from "../game-data";
import { INDEX_HTML_TIMELINE, WEBSITE_TIMELINE } from "../timelines/website";
import { getPaperItemsJson } from "./paperitemsjson";
import { getGamesJson } from "./gamesjson";
import { getNewsCrumbsSwf } from "./news_crumbs.swf";
import { getGlobalCrumbsSwf } from "./global_crumbs.swf";
import { FRAME_HACKS } from "../game-data/frame-hacks";
import { getLocalCrumbsSwf } from "./local_crumbs.swf";
import { fromLE, parseSwf } from "../../common/flash/parser";
import { emitSwf, TagType } from "../../common/flash/emitter";
import { Action } from "../../common/flash/avm1";
import { to2BytesLittleEndian } from "../../common/flash/bytes";
import { FileRef, getMediaFilePath } from "../game-data/files";
import { MEDIA_DIRECTORY } from '../../common/utils';

/**
 * This function allows to replace the string constants of a SWF file. This is used to serve a SWF file but changing the value of certain strings when the server gives the file (dynamically changing)
 * Keep in mind for this to work you just have to make sure that you have a string in the constant pool starting with the given prefix below
 */
function replaceConstants(file: FileRef, constantValues: Record<string, string | undefined>): Buffer {
  const originalRaw = fs.readFileSync(path.join(MEDIA_DIRECTORY, getMediaFilePath(file)));
  const swf = parseSwf(new Uint8Array(originalRaw));
  
  const PREFIX = "##";

  swf.tags.forEach(tag => {
    if (tag.type === TagType.DoAction) {
      if (tag.content[0] === Action.ConstantPool) {
        const content = [...tag.content];
        const length = fromLE(...content.splice(1, 2));
        const countLength = 2;
        const count = fromLE(...content.splice(1, countLength));
        const constantBytes = content.splice(1, length - countLength);

        const strings: string[] = [];
        let current: number[] = [];

        constantBytes.forEach(byte => {
          if (byte === 0) {
            strings.push( new TextDecoder().decode(new Uint8Array(current)));
            current = []
          } else {
            current.push(byte);
          }
        });
        
        for (let i = 0; i < strings.length; i++) {
          if (strings[i].startsWith(PREFIX)) {
            const key = strings[i].slice(PREFIX.length);
            const replacement = constantValues[key];
            if (replacement !== undefined) {
              strings[i] = replacement;
            }
          }
        }

        
        const constantPool: number[] = [...to2BytesLittleEndian(count)];
        strings.forEach(str => {
          constantPool.push(...new TextEncoder().encode(str), 0x0);
        });
        constantPool.splice(0, 0, ...to2BytesLittleEndian(constantPool.length));

        content.splice(1, 0, ...constantPool);
        tag.content = new Uint8Array(content);
      }
    }
  });

  return Buffer.from(emitSwf(swf));
}

export function createHttpServer(settingsManager: SettingsManager): HttpServer {
  const server = new HttpServer(settingsManager);

  server.addFileServer();

  server.get('/', (s) => {
    const name = findInVersion(s.settings.version, INDEX_HTML_TIMELINE);

    if (s.settings.minified_website && name !== 'modern-as3') {
      if (isAS3(s.settings.version)) {
        return 'default/websites/minified/minified-classic-as3.html';
      } else if (isPreCpip(s.settings.version)) {
        return 'default/websites/minified/minified-precpip.html';
      } else {
        return 'default/websites/minified/minified-cpip.html';
      }
    }

    return `default/websites/${name}.html`;
  });


  // Engine 3 login page requires this URL
  server.get('/#/login', () => {
    return `default/websites/modern-as3.html`;
  })

  // serving the websites
  server.dir('', (s) => {
    const name = findInVersion(s.settings.version, WEBSITE_TIMELINE);

    return `default/websites/${name}`;
  })

  // Pre CPIP server rewrite client uses these POST endpoints
  server.router.post('/setup.txt', (_, req) => {
    req.send(getSetupTxt(settingsManager.settings.version, settingsManager.targetIP, settingsManager.worldPort));
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
    return getStampsJson(s.settings.version);
  });
  server.getData('play/en/web_service/game_configs/stamps.json', (s) => {
    return getStampsJson(s.settings.version);
  });
  server.getData('play/en/web_service/game_configs/chunking_map.json', (s) => {
    return getChunkingMapJson(s.settings.version);
  });
  server.getData('play/en/web_service/game_configs/general.json', (s) => {
    return getGeneralJson(s.settings.version);
  });
  server.getData('play/en/web_service/game_configs/paths.json', (s) => {
    return getPathsJson(s.settings.version);
  });
  server.getData('play/en/web_service/game_configs/rooms.json', (s) => {
    return getRoomsJson(s.settings.version);
  });
  server.getData('play/en/web_service/game_configs/games.json', (s) => {
    return getGamesJson(s.settings.version);
  });
  server.getData('play/en/web_service/game_configs/game_strings.json', (s) => {
    return getGameStrings(s.settings.version);
  });
  server.getData('play/en/web_service/game_configs/paper_items.json', (s) => {
    return getPaperItemsJson(s.settings.version);
  });
  server.getData('play/en/web_service/game_configs/newspapers.json', (s) => {
    return getNewspapersJson(s.settings.version);
  });
  server.getData('play/en/web_service/game_configs/stage_script_messages.json', (s) => {
    return getStageScriptMessagesJson(s.settings.version);
  });
  server.getData('play/en/web_service/game_configs/penguin_action_frames.json', () => {
    return JSON.stringify(FRAME_HACKS)
  })
  server.getData('servers.xml', (s) => getServersXml(s.targetIP, s.loginPort, s.worldPort));
  server.getData('setup.xml', (s) => {
    return getSetupXml(s.settings.version, s.targetIP, s.worldPort);
  });
  server.getData('version.txt', (s) => {
    return getVersionTxt(s.settings.version);
  });
  server.getData('play/web_service/environment_data.xml', (s) => {
    return getEnvironmentDataXml(s.targetIP, s.targetPort);
  });
  server.getData('web_service/worldachievements.xml', (s) => {
    return getWorldAchievementsXml(s.settings.version);
  });
  server.getData('play/v2/content/global/stampbook/world_stamps.xml', (s) => {
    return getWorldAchievementsXml(s.settings.version);
  });
  server.getData('play/v2/content/local/en/login/startscreen.xml', (s) => {
    return getStartscreenXML(s.settings.version);
  })
  server.getData('playstart/xml/start_module_config.xml', (s) => {
    return getStartscreenXML(s.settings.version);
  })
  server.getData('playstart/xml/start_module_config.xml', (s) => {
    return getStartscreenXML(s.settings.version);
  })
  server.getData('play/v2/content/local/en/news/news_crumbs.swf', (s) => {
    return getNewsCrumbsSwf(s.settings.version);
  });
  server.getData('play/v2/content/global/crumbs/global_crumbs.swf', (s) => {
    return getGlobalCrumbsSwf(s.settings.version);
  });
  server.getData('play/v2/content/local/en/crumbs/local_crumbs.swf', (s) => {
    return getLocalCrumbsSwf(s.settings.version);
  });

  // serving dynamic igloo data for ben/randomno's dynamic igloo music list mod
  server.getData('play/v2/content/global/en/igloo_music.xml', (s) => {
    return getDynamicMusicListData(s.settings.version);
  });

  server.getData('load.swf', (s) => {
    const file = s.settings.fps30 ? 'tool:load30.swf' : 'tool:load.swf';
    
    return replaceConstants(file, {
      PORT: String(s.worldPort),
      IP: s.targetIP,
      URLPRE: `http://${s.targetIP.slice(0, 3)}`
    });
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