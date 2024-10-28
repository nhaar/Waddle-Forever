import { BrowserWindow } from "electron";
import { Store } from "../store";
import { ROOMS_JSONP_NAME, ROOMS_PATH, SWF_MIME_FILE } from "./constants";
import { parseAndUpdateLocation } from "./parsers/locationParser";
import { parseAndUpdateRooms } from "./parsers/roomParser";
import fetch from 'electron-fetch';
import { setLanguageInStore } from "./localization/localization";

export const parseJSONP = (jsonp: string, name: string) => {
  const nameLength = name.length;

  const json = jsonp.slice(nameLength + 1, jsonp.length - 2);

  return JSON.parse(json);
};

export type RoomsResponse = {
  roomsJson: string,
  localizedJson?: string,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRoomsJsonFromParams = async (store: Store, mainWindow: BrowserWindow, params: any): Promise<RoomsResponse> => {
  let plainResponseBody;
  let localizedResponseBody;

  const url = params.response.url as string;

  const response = await mainWindow.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId });

  if (response.base64Encoded) {
    plainResponseBody = Buffer.from(response.body, 'base64').toString('utf8');
  } else {
    plainResponseBody = response.body;
  }

  setLanguageInStore(store, 'en');

  return {
    roomsJson: parseJSONP(plainResponseBody, ROOMS_JSONP_NAME),
    localizedJson: localizedResponseBody ? parseJSONP(localizedResponseBody, ROOMS_JSONP_NAME) : undefined,
  };
};

export const startRequestListener = (store: Store, mainWindow: BrowserWindow) => {
  try {
    mainWindow.webContents.debugger.attach('1.3');
  } catch (err) {
    console.log('Debugger attach failed: ', err);
  }

  mainWindow.webContents.debugger.on('detach', (_, reason) => {
    console.log('Debugger detached due to: ', reason);
  });

  mainWindow.webContents.debugger.on('message', async (_, method, params) => {
    if (method === 'Network.responseReceived') {

      if (params.response.url.includes(ROOMS_PATH)) {
        await parseAndUpdateRooms(store, mainWindow, params);
      }

      if (params.response.url.includes(SWF_MIME_FILE)) {
        await parseAndUpdateLocation(store, params);
      }
    }
  });

  mainWindow.webContents.debugger.sendCommand('Network.enable');
};