import { createTimeline } from "../updates/updates";

export const FURNITURE_TIMELINE = createTimeline((u) => {
  return u.furnitureCatalog
});
