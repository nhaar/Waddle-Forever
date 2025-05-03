import { StaticDataTable } from "../../common/static-table";

type StaticServer = {
  id: number;
  name: string;
};

export const STATIC_SERVERS = new StaticDataTable<StaticServer, ['id', 'name']>(
  ['id', 'name'],
  [
    // Mammoth is a Pre-CPIP server emulator, and they provided a media server from 2006/04
    [1, 'mammoth'],
    // Solero has a media called "legacy-media" which is used to play with Houdini on the 2010 version
    [2, 'slegacy'],
    // likewise, the 2017 version is via the "vanilla-media"
    [3, 'svanilla'],
    // Slippers (mammot's predecessor) had this 2007 media server alternative
    [4, 'slippers07']
  ]
);