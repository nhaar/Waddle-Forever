import { createTimeline } from "../updates/updates";

export const FURNITURE_CATALOG_TIMELINE = createTimeline((u) => {
  return u.furnitureCatalog
});

export const IGLOO_CATALOG_TIMELINE = createTimeline((u) => {
  return u.iglooCatalog
});
