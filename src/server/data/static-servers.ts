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
    [2, 'solero-legacy']
  ]
);