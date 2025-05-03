import { StaticDataTable } from "../../common/static-table";
import { Version } from "../routes/versions";

type Event = {
  id: number;
  updateId: number;
  comment: string;
};

const EVENTS = new StaticDataTable<Event, ['id', 'updateId', 'comment']>(
  ['id', 'updateId', 'comment'],
  [
    [1, 1, 'Beta release']
  ]
);