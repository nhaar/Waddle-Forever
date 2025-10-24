import { MigratorVisit, TemporaryChange } from ".";


type StandaloneMigratorVisits = TemporaryChange<MigratorVisit>[];

export const STANDALONE_MIGRATOR_VISITS: StandaloneMigratorVisits = [
  {
    date: '2008-10-17',
    end: '2008-10-27',
    info: 'archives:RHRIOct2008.swf'
  },
  {
    date: '2008-12-12',
    end: '2008-12-22',
    info: 'recreation:pirate_catalog/08_12.swf'
  },
  {
    date: '2009-05-22',
    end: '2009-06-01',
    info: 'recreation:pirate_catalog/09_05.swf'
  },
  {
    date: '2009-09-04',
    end: '2009-09-14',
    info: 'recreation:pirate_catalog/09_09.swf'
  },
  {
    date: '2010-06-21',
    end: '2010-07-01',
    info: 'recreation:pirate_catalog/10_06.swf'
  }
];