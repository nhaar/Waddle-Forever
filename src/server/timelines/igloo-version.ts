import { createTimeline } from "../updates/updates";

export const IGLOO_VERSION_TIMELINE = createTimeline(update => {
  return update.iglooVersion
});
