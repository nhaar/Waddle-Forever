import { MigratorVisit, TemporaryChange } from "./changes";


type StandaloneMigratorVisits = TemporaryChange<MigratorVisit>[];

export const STANDALONE_MIGRATOR_VISITS: StandaloneMigratorVisits = [
  {
    date: '2008-10-17',
    end: '2008-10-27',
    info: 'archives:RHRIOct2008.swf'
  }
];