import { Client, register } from "discord-rpc";
import { BrowserWindow, dialog } from "electron";
import { DISCORD_RPC_CLIENT_APP_ID, LARGE_IMAGE_KEY, ROOMS_JSONP_NAME } from "./discord/constants";
import { getLocalizedPlaying, getLocalizedTalkingWith, getLocalizedUnlogged, getLocalizedVisiting, getLocalizedWaddling, getLocalizedWaddlingAt } from "./discord/localization/localization";
import { parseJSONP, RoomsResponse, startRequestListener } from "./discord/requestHandler";
import { Store } from "./store";
import { CPLocation, CPLocationType, DiscordState } from "./store/DiscordState";
import { promises as fs } from 'fs';
import { updateRooms } from "./discord/parsers/roomParser";
import path from "path";

const getDiscordRPCEnabledFromStore = (store: Store) => {
  return store.public.get('enableDiscordRPC');
};

const getDiscordRPCTrackingEnabledFromStore = (store: Store) => {
  return store.public.get('enableDiscordRPCTracker');
};

const updateDiscordRPCEnabledInStore = (store: Store) => {
  store.public.set('enableDiscordRPC', !getDiscordRPCEnabledFromStore(store));
};

const updateDiscordRPCTrackingEnabledInStore = (store: Store) => {
  store.public.set('enableDiscordRPCTracker', !getDiscordRPCTrackingEnabledFromStore(store));
};

export const getDiscordStateFromStore = (store: Store) => {
  return store.private.get('discordState') ?? { };
};

export const setDiscordStateInStore = (store: Store, state: DiscordState) => {
  store.private.set('discordState', state);
};

export const setLocationsInStore = (store: Store, locations: CPLocation[]) => {
  const state = getDiscordStateFromStore(store);

  state.trackedLocations = locations;

  setDiscordStateInStore(store, state);
};

export const setUnloggedStatus = (store: Store) => {
  const state = getDiscordStateFromStore(store);

  return state.client.setActivity({
    details: state.gameName,
    state: getLocalizedUnlogged(store),
    startTimestamp: state.startTimestamp,
    largeImageKey: LARGE_IMAGE_KEY,
  });
};

const setWaddlingStatus = (store: Store) => {
  const state = getDiscordStateFromStore(store);

  return state.client.setActivity({
    details: state.gameName,
    state: getLocalizedWaddling(store),
    startTimestamp: state.startTimestamp,
    largeImageKey: LARGE_IMAGE_KEY,
  });
};

export const setUnknownLocationStatus = (store: Store, state: DiscordState, match: string) => {
  const result = match.replace(/([A-Z])/g, " $1");
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

  return state.client.setActivity({
    details: state.gameName,
    state: `${getLocalizedWaddlingAt(store)} ${finalResult}`,
    startTimestamp: state.startTimestamp,
    largeImageKey: LARGE_IMAGE_KEY,
  });
};

export const setLocationStatus = (store: Store, state: DiscordState, location: CPLocation) => {
  let msgPrefix: string;

  if (location.match.toLowerCase().includes('sensei')) {
    msgPrefix = getLocalizedTalkingWith(store);
  } else if (location.type === CPLocationType.Game) {
    msgPrefix = getLocalizedPlaying(store);
  } else if (location.match.toLowerCase().includes('igloo')) {
    msgPrefix = getLocalizedVisiting(store);
  } else {
    msgPrefix = getLocalizedWaddlingAt(store);
  }

  const locationMsg = msgPrefix + ' ' + location.name;

  return state.client.setActivity({
    details: state.gameName,
    state: locationMsg,
    startTimestamp: state.startTimestamp,
    largeImageKey: LARGE_IMAGE_KEY,
  });
};

const getGameName = () =>  {
  return 'Club Penguin Singleplayer Client 2'
};

const registerWindowReload = (store: Store, mainWindow: BrowserWindow) => {
  const tempState = getDiscordStateFromStore(store);

  if (tempState.windowReloadRegistered) {
    return;
  }

  tempState.windowReloadRegistered = true;

  setDiscordStateInStore(store, tempState);

  mainWindow.webContents.on('did-start-loading', () => {
    if (!getDiscordRPCEnabledFromStore(store)) { 
      return;
    }

    const state = getDiscordStateFromStore(store);

    // In case URL changed
    state.gameName = getGameName();

    setUnloggedStatus(store);

    setDiscordStateInStore(store, state);
  });
};

export const startDiscordRPC = (store: Store, mainWindow: BrowserWindow) => {
  if (!getDiscordRPCEnabledFromStore(store)) {
    return;
  }

  const gameName = getGameName();

  const startTimestamp = new Date();

  register(DISCORD_RPC_CLIENT_APP_ID);

  const client = new Client({
    transport: 'ipc',
  });

  setDiscordStateInStore(store, {
    client: client,
    gameName: gameName,
    startTimestamp: startTimestamp,
    windowReloadRegistered: false,
  });

  const rpcTrackingEnabled = getDiscordRPCTrackingEnabledFromStore(store);

  client.on('ready', () => { 
    client.setActivity({
      details: gameName,
      state: rpcTrackingEnabled ? getLocalizedUnlogged(store) : getLocalizedWaddling(store),
      startTimestamp: startTimestamp,
      largeImageKey: LARGE_IMAGE_KEY,
    });
  });

  client.login({
    clientId: DISCORD_RPC_CLIENT_APP_ID
  }).catch(console.error);

  if (!rpcTrackingEnabled) {
    return;
  }

  registerWindowReload(store, mainWindow);

  startRequestListener(store, mainWindow);
  setDefaultRooms(store);
};

export const stopDiscordRPC = (store: Store) => {
  const state = getDiscordStateFromStore(store);

  if (!state || !state.client) {
    return;
  }

  state.client.destroy();

  setDiscordStateInStore(store, {});
};

export const enableOrDisableDiscordRPC = async (store: Store, mainWindow: BrowserWindow) => {

  if (!getDiscordRPCEnabledFromStore(store)) {
    const confirmationEnableResult = await dialog.showMessageBox(mainWindow, {
      buttons: ['Sim', 'Não', 'Cancelar'],
      title: 'Você deseja ativar o Discord Reach Presence?',
      message: `Essa alteração precisa recarregar a página para ser efetiva (somente se o rastreamento de sala estivar ativo).`,
    });

    if (confirmationEnableResult.response !== 0) {
      return;
    }
  }

  updateDiscordRPCEnabledInStore(store);

  if (getDiscordRPCEnabledFromStore(store) && getDiscordRPCTrackingEnabledFromStore(store)) {
    startDiscordRPC(store, mainWindow);

    mainWindow.reload();

    return;
  } else if (!getDiscordRPCEnabledFromStore(store)) {
    stopDiscordRPC(store);

    return;
  }

  const confirmationTrackingEnableResult = await dialog.showMessageBox(mainWindow, {
    buttons: ['Sim', 'Não', 'Cancelar'],
    title: 'Você deseja ativar o rastreamento de sala para o Discord Reach Presence?',
    message: `A localização do seu pinguim será exposta no discord.`,
  });

  if (confirmationTrackingEnableResult.response !== 0) {
    return;
  }

  updateDiscordRPCTrackingEnabledInStore(store);

  startDiscordRPC(store, mainWindow);

  mainWindow.reload();
};

export const enableOrDisableDiscordRPCLocationTracking = async (store: Store, mainWindow: BrowserWindow) => {
  if (!getDiscordRPCTrackingEnabledFromStore(store)) {
    const confirmationTrackingEnableResult = await dialog.showMessageBox(mainWindow, {
      buttons: ['Sim', 'Não', 'Cancelar'],
      title: 'Você deseja ativar o rastreamento de sala para o Discord Reach Presence?',
      message: `A localização do seu pinguim será exposta no discord.`,
    });

    if (confirmationTrackingEnableResult.response !== 0) {
      return;
    }
  }

  updateDiscordRPCTrackingEnabledInStore(store);

  if (!getDiscordRPCTrackingEnabledFromStore(store)) {
    setWaddlingStatus(store);

    return;
  }

  setUnloggedStatus(store);

  mainWindow.reload();
};

const setDefaultRooms = async (store: Store) => {
  const enPath = path.join(__dirname, '../assets/default/rooms-en.jsonp');
  const ptPath = path.join(__dirname, '../assets/default/rooms-pt.jsonp');

  const enRoomsBuff = await fs.readFile(enPath);
  const ptRoomsBuff = await fs.readFile(ptPath);

  const enRooms = enRoomsBuff.toString();
  const ptRooms = ptRoomsBuff.toString();
  
  const result: RoomsResponse = {
    roomsJson: parseJSONP(enRooms, ROOMS_JSONP_NAME),
    localizedJson: parseJSONP(ptRooms, ROOMS_JSONP_NAME),
  };

  updateRooms(store, result);
};