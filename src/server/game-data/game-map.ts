/** Module handles all standalone updates regarding the in-game map */

import { PermanentUpdateTimeline } from "./changes";
import { COVE_OPENING_START } from "./updates";

type MapUpdate = {
  fileRef: string;
  comment?: string;
};

export const MAP_UPDATES: PermanentUpdateTimeline<MapUpdate> = [
  {
    date: COVE_OPENING_START,
    fileRef: 'archives:ArtworkMaps15.swf'
  }
]

export const PRECPIP_MAP_PATH = 'artwork/maps/island5.swf';
export const MAP_PATH_07 = 'artwork/maps/16_forest.swf'