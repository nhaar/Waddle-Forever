import { Version } from "../routes/versions";
import { MIGRATOR_RECONSTRUCTION_CLEANUP_PHASE, ROCKHOPPER_ARRIVAL_END } from "./updates";

type MigratorPeriod = {
  date: Version;
  end: Version;
};

// must be sorted
// this doesnt include parties, it's meant for standalone updates
export const MIGRATOR_PERIODS: MigratorPeriod[] = [
  // there is a phase before this that we are missing, which would be 
  // accessing the migrator when it was not clean
  { date: MIGRATOR_RECONSTRUCTION_CLEANUP_PHASE, end: ROCKHOPPER_ARRIVAL_END }
]