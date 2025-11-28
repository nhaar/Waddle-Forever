import { newVersionsTimeline } from ".";
import { UPDATES } from "../updates/updates";

export const CLIENT_ITEMS_TIMELINE = newVersionsTimeline<Set<number>>(timeline => {
  const current = new Set<number>();
  UPDATES.forEach(update => {
    if (update.update.clientFiles !== undefined) {
      update.update.clientFiles.forEach(id => current.add(id));
    }
    if (update.update.removeClientFiles !== undefined) {
      update.update.removeClientFiles.forEach(id => current.delete(id));
    }
    timeline.addInfo(new Set<number>(current), update.date);
  });
});