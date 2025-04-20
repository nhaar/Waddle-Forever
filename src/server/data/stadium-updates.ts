import { Version } from "../routes/versions";
import { STADIUM_GAMES_END } from "./updates";

type StadiumUpdate = {
  date: Version;
  rinkFileId: number;
  townFileId: number;
  fortsFileId: number;
  mapFileId: number;
  catalogFileId: number;
};

export const STADIUM_UPDATES: StadiumUpdate[] = [
  {
    date: '2009-11-27',
    townFileId: 2642,
    fortsFileId: 2643,
    rinkFileId: 2645,
    mapFileId: 2646,
    catalogFileId: 2648
  },
  {
    date: '2010-05-28',
    townFileId: 2636,
    mapFileId: 2637,
    fortsFileId: 2638,
    catalogFileId: 2639,
    rinkFileId: 2640
  },
  {
    date: '2010-09-24',
    townFileId: 2519,
    fortsFileId: 2518,
    rinkFileId: 2517,
    mapFileId: 2520,
    catalogFileId: 2649
  },
  {
    date: STADIUM_GAMES_END,
    townFileId: 2642,
    rinkFileId: 2641,
    mapFileId: 2646,
    fortsFileId: 2644,
    catalogFileId: 2647
  }
];