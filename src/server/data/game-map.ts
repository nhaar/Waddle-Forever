import { ICEBERG_RELEASE, PIZZA_PARLOR_OPENING_END, SNOW_FORTS_RELEASE } from "./updates";

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
  }
]

export const PRECPIP_MAP_PATH = 'artwork/maps/island5.swf';