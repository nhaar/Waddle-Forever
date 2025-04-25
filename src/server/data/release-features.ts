import { RoomName } from "./rooms";

export const ORIGINAL_ROOMS: Partial<Record<RoomName, number>> = {
  'town': 27,
  'coffee': 4855,
  'book': 29,
  'dance': 8,
  'lounge': 12,
  'shop': 16,
  'dock': 9,
  'village': 31,
  'rink': 33,
  'dojo': 10,
  'agent': 5 // HQ is disputed, maybe not original release
}

// File ID of original map
export const ORIGINAL_MAP = 34;