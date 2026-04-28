import fs from 'fs';
import path from 'path';

import { HttpServer } from "../http";
import { SettingsManager } from "../settings";
import { isEngine2, isEngine3 } from "../timelines/dates";
import { FRAME_HACKS } from '@server/game-data/frame-hacks';
import { fromLE, parseSwf } from "@common/flash/parser";
import { emitSwf, TagType } from "@common/flash/emitter";
import { Action } from "@common/flash/avm1";
import { to2BytesLittleEndian } from "@common/flash/bytes";
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

  // Pre CPIP server rewrite client uses these POST endpoints


  // text file generating

  server.getData('load.swf', (s) => {
    const file = s.settings.fps30 ? 'tool:load30.swf' : 'tool:load.swf';
    
    return replaceConstants(file, {
      PORT: String(s.worldPort),
      IP: s.targetIP,
      URLPRE: `http://${s.targetIP.slice(0, 3)}`
    });
  });  
  return server
}