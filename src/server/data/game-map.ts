import { COVE_OPENING_START, CPIP_UPDATE, DIG_OUT_DOJO_END, ICEBERG_RELEASE, MODERN_AS3, PIZZA_PARLOR_OPENING_END, PRE_CPIP_REWRITE_DATE, SNOW_FORTS_RELEASE, SUMMER_PARTY_START } from "./updates";

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
    // beach opens
    date: SUMMER_PARTY_START,
    fileId: 4912
  },
  {
    // fix for the beach in the pre-cpip rewrite client
    date: PRE_CPIP_REWRITE_DATE,
    fileId: 3808
  },
  {
    date: MODERN_AS3,
    fileId: 2650
  },
  {
    date: COVE_OPENING_START,
    fileId: 3844
  },
  {
    // placeholder map in which the dojo courtyard goes to the dojo
    // we have no other CPIP maps
    date: CPIP_UPDATE,
    fileId: 4937
  },
  {
    // adding dojo courtyard
    date: DIG_OUT_DOJO_END,
    fileId: 2637
  }
]

export const PRECPIP_MAP_PATH = 'artwork/maps/island5.swf';
export const MAP_PATH_07 = 'media/artwork/maps/16_forest.swf'