import { ICEBERG_RELEASE, MODERN_AS3, PIZZA_PARLOR_OPENING_END, SNOW_FORTS_RELEASE, SUMMER_PARTY_START } from "./updates";

type MapUpdate = {
  date: string;
  fileId: number;
  comment?: string;
};

export const MAP_UPDATES: MapUpdate[] = [
  {
    date: SNOW_FORTS_RELEASE,
    fileId: 35
  },
  {
    date: PIZZA_PARLOR_OPENING_END,
    fileId: 104
  },
  {
    date: ICEBERG_RELEASE,
    fileId: 104
  },
  {
    date: SUMMER_PARTY_START,
    fileId: 3808
  },
  {
    date: MODERN_AS3,
    fileId: 2650
  }
]

export const PRECPIP_MAP_PATH = 'artwork/maps/island5.swf';
export const MAP_PATH_07 = 'media/artwork/maps/16_forest.swf'