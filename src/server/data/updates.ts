import { StaticDataTable } from "../../common/static-table";
import { Version } from "../routes/versions";

type Update = {
  id: number;
  time: Version;
};

export const UPDATES = new StaticDataTable<Update, ['id', 'time']>(
  ['id', 'time'],
  [
    // Beta release
    [1, '2005-08-22'],
    
    // Added snow forts
    [2, '2005-09-12'],

    // beta test start
    [3, '2005-09-21'],

    // beta test end
    [4, '2005-09-22'],

    // newspapers are added
    [6, '2005-10-24'],

    // halloween 2005 start
    [7, '2005-10-27'],
    // halloween 2005 end
    [8, '2005-11-01'],

    // sport shop open
    [9, '2005-11-03'],

    // Mtn opens
    [10, '2005-11-18'],

    // puffle discovery begins
    [11, '2005-11-15'],
    //puffle discovery end
    [12, '2005-12-05'],

    // puffle roundup release
    [13, '2005-12-14'],

    // christmas party 2005 starts
    [14, '2005-12-22'],
    // christmas party 2005 ends
    [15, '2005-12-26'],
    // ski lodge opened, have a feeling it wasnt when christmas 05 started
    [16, '2005-12-22'],

    // valentine's day start
    [17, '2006-02-14'],
    // valentine day end
    [18, '2006-02-15'],
    // pizza parlor opening start
    [19, '2006-02-24'],
    // pizza parlor opening end
    [20, '2006-02-28'],

    // pet shop opens
    [21, '2006-03-17'],

    // iceberg opens
    [22, '2006-03-29'],

    // april fools 2006 start
    [23, '2006-03-31'],
    // april fools 2006 end
    [24, '2006-04-03']
  ]
);

export const FIRST_UPDATE = 1;