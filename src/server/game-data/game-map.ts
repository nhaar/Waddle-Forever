/** Module handles all standalone updates regarding the in-game map */

import { PermanentUpdateTimeline } from "./changes";
import { COVE_OPENING_START, DIG_OUT_DOJO_END, MODERN_AS3, PIZZA_PARLOR_OPENING_END, PRE_CPIP_REWRITE_DATE, SUMMER_PARTY_START } from "./updates";

type MapUpdate = {
  fileRef: string;
  comment?: string;
};

export const MAP_UPDATES: PermanentUpdateTimeline<MapUpdate> = [
  {
    date: PIZZA_PARLOR_OPENING_END,
    fileRef: 'archives:ArtworkMapsIsland5.swf'
  },
  {
    // beach opens
    date: SUMMER_PARTY_START,
    fileRef: 'archives:ArtworkMapsIsland10.swf'
  },
  {
    // fix for the beach in the pre-cpip rewrite client
    date: PRE_CPIP_REWRITE_DATE,
    fileRef: 'approximation:map_beach_changed_id.swf'
  },
  {
    date: MODERN_AS3,
    fileRef: 'svanilla:media/play/v2/content/global/content/map.swf'
  },
  {
    date: COVE_OPENING_START,
    fileRef: 'archives:ArtworkMaps15.swf'
  },
  {
    // adding dojo courtyard
    date: DIG_OUT_DOJO_END,
    fileRef: 'archives:Map2008-2011Stadium.swf'
  }
]

export const PRECPIP_MAP_PATH = 'artwork/maps/island5.swf';
export const MAP_PATH_07 = 'artwork/maps/16_forest.swf'