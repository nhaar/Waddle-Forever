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
    [4, '2005-09-22']
  ]
);

export const FIRST_UPDATE = 1;