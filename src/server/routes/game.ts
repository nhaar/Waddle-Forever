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

export function createHttpServer(settingsManager: SettingsManager): HttpServer {
  const server = new HttpServer(settingsManager);

  server.addFileServer();

  // Pre CPIP server rewrite client uses these POST endpoints


  // text file generating


  return server
}