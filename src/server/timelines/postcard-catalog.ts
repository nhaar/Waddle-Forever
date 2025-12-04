import { createTimeline } from "../updates/updates";

export const POSTCARD_CATALOG_TIMELINE = createTimeline(update => {
  return update.postcardCatalog;
});
