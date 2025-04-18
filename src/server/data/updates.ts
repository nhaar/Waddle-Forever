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
    [1, '2005-08-22']
  ]
);

export const FIRST_UPDATE = 1;