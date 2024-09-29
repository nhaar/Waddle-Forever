import { BrowserWindow } from "electron";
import { setLocationsInStore } from "../../discord";
import { Store } from "../../store";
import { CPLocation, CPLocationType } from "../../store/DiscordState";
import { getRoomsJsonFromParams, RoomsResponse } from "../requestHandler";

export const updateRooms = (store: Store, result: RoomsResponse) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rooms = Object.values(result.roomsJson) as any[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localizedRooms = result.localizedJson ? Object.values(result.localizedJson) as any[] : [];

  const cpLocations: CPLocation[] = [];

  for (const room of rooms) {
    const id = Number(room.room_id);
    let name = String(room.display_name);

    // When in an igloo the display name is 'igloo_card'.
    if (name.toLowerCase() === 'igloo_card') {
      name = 'Igloo';
    }

    // Smoothie smash game name was incomplete.
    if (name.toLowerCase() === 'smoothie') {
      name = 'Smoothie Smash';
    }

    // Fire, water and snow dojos has bugged names.
    if (name.toLowerCase() === "dojo fire") {
      name = 'Fire Dojo';
    }

    if (room.room_key.toLowerCase() === "dojowater") {
      name = 'Water Dojo';
    }

    if (name.toLowerCase() === "cj snow dojo") {
      name = 'Snow Dojo';
    }

    // Snow Card Jitsu has empty display name.
    if (room.name.toLowerCase() === 'snow') {
      name = "Card'jitsu Snow";
    }

    let key = room.room_key ? String(room.room_key) : undefined;

    let type = key ? CPLocationType.Room : CPLocationType.Game;

    // For any reason sled race comes with the key 'party19'.
    if (name.toLowerCase() === 'sled race') {
      key = '';
      type = CPLocationType.Game;
    }

    // Igloo don't have 'room_key'.
    if (name.toLowerCase() === 'igloo') {
      type = CPLocationType.Room;
    }

    let match: string;

    if (key) {
      match = key;
    } else {
      match = String(room.name.toLowerCase().replace(' ', ''));
    }

    // The match of the 'tic tac toe' minigame is 'tictactoe'.
    if (name.toLowerCase().includes('tic tac toe')) {
      match = 'tictactoe';
    }

    // The match of the 'find four' minigame is 'four'.
    if (name.toLowerCase().includes('find four') && type === CPLocationType.Game) {
      match = 'four';
    }

    // The match of the 'treasure hunt' minigame is 'treasurehunt'.
    if (name.toLowerCase().includes('treasure hunt')) {
      match = 'treasurehunt';
    }

    // If the game is a EPF quest we need to replace the 'mission' word to 'q' (quest) in match.
    if (name.toLowerCase().includes('mission')) {
      match = room.name.toLowerCase().replace('mission', 'q');
    }

    // The match of the 'sled race' minigame is 'sled'.
    if (name.toLowerCase() === 'sled race') {
      match = 'sled';
    }

    // The match of the 'system defender' minigame is 'sled'.
    if (name.toLowerCase() === 'system defender') {
      match = 'tower';
    }

    // The match of the 'bits and bolts' minigame is 'robots'.
    if (name.toLowerCase() === 'bits and bolts') {
      match = 'robots';
    }

    // The match of the "Catchin' Waves" minigame is 'waves'.
    if (name.toLowerCase() === "catchin' waves") {
      match = 'waves';
    }

    // The match of the 'Hydro Hopper' minigame is 'hydro'.
    if (name.toLowerCase() === 'hydro hopper') {
      match = 'hydro';
    }

    // The match of the 'Puffle Roundup' minigame is 'roundup'.
    if (name.toLowerCase() === 'puffle roundup') {
      match = 'roundup';
    }

    // The match of the 'Puffle Rescue' minigame is 'rescue'.
    if (name.toLowerCase() === 'puffle rescue') {
      match = 'rescue';
    }

    // The match of the 'Aqua Grabber' minigame is 'sub'.
    if (name.toLowerCase() === 'aqua grabber') {
      match = 'sub';
    }

    // The match of the 'card jitsu' minigame is 'card'.
    if (name.toLowerCase() === 'card jitsu') {
      match = 'card';
    }

    // The match of the 'fire sensei' room is 'card'.
    if (name.toLowerCase() === 'fire sensei') {
      match = 'senseifire';
    }

    // The match of the 'igloo' room is 'igloo'.
    if (name.toLowerCase() === 'igloo') {
      match = 'igloo';
    }

    // Sets the localized name if has
    if (localizedRooms) {
      const localizedName = localizedRooms.filter(localizedRoom => {
        return room.display_name === localizedRoom.display_name;
      })[0]?.name;

      if (localizedName) {
        if (localizedName !== '##igloo_card##') {
          name = localizedName;
        } else {
          name = "Iglu";
        }
      }
    }

    const cpLocation: CPLocation = {
      id: id,
      name: name,
      key: key,
      type: type,
      match: match,
    };

    cpLocations.push(cpLocation);
  }

  setLocationsInStore(store, cpLocations);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseAndUpdateRooms = async (store: Store, mainWindow: BrowserWindow, params: any) => {
  const result = await getRoomsJsonFromParams(store, mainWindow, params);

  updateRooms(store, result);
};