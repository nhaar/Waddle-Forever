import { newVersionsTimeline } from ".";
import { UPDATES } from "../updates/updates";

export const WEBSITE_TIMELINE = newVersionsTimeline<string>((timeline) => {
  UPDATES.forEach(update => {
    if (update.update.websiteFolder !== undefined) {
      timeline.addInfo(update.update.websiteFolder, update.date, update.end);
    }
  })
});

export const INDEX_HTML_TIMELINE = newVersionsTimeline<string>((timeline) => {
  UPDATES.forEach(update => {
    if (update.update.indexHtml !== undefined) {
      timeline.addInfo(update.update.indexHtml, update.date, update.end);
    }
  });
})