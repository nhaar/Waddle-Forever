/** Module handles all standalone updates regarding the in-game map */

import { PermanentUpdateTimeline } from "./changes";
import { Update } from "./updates";

/** Update of the game map */
type MapUpdate = {
  fileRef: string;
  /** Comment for the timeline */
  comment?: string;
};

/** Standalone permanent map updates */
export const MAP_UPDATES: PermanentUpdateTimeline<MapUpdate> = [
  {
    // party doesn't exist yet
    date: Update.COVE_OPENING_START,
    fileRef: 'archives:ArtworkMaps15.swf'
  }
];
