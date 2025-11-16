/** Module handles all standalone updates regarding the in-game map */

import { PermanentUpdateTimeline } from ".";
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
    date: Update.CHAT_339,
    fileRef: 'approximation:map_chat339.swf'
  }
];
