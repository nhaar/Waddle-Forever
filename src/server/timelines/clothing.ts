import { createTimeline } from "../updates/updates";

export const CLOTHING_TIMELINE = createTimeline((u) => {
  return u.clothingCatalog
});
