import { Version } from "../routes/versions";
import { STADIUM_GAMES_END } from "./updates";

type StadiumUpdate = {
  date: Version;
  rinkFileId: string;
  townFileId: string;
  fortsFileId: string;
  mapFileId?: string;
  catalogFileId?: string;
  type?: 'rink' | 'stadium';
  comment?: string;
};

export const STADIUM_UPDATES: StadiumUpdate[] = [
  {
    date: '2008-08-26',
    rinkFileId: 'archives:RoomsRink_2.swf',
    townFileId: 'archives:RoomsTown_2.swf',
    fortsFileId: 'archives:ESForts-SoccerPitch.swf',
    comment: 'The Soccer Pitch is now open for everyone, and temporarily replaces the Ice Rink'
  },
  {
    date: '2008-12-19',
    townFileId: 'archives:RoomsTown.swf',
    fortsFileId: 'archives:FortsWithIceRinkStadium.swf',
    rinkFileId: 'archives:RoomsRink.swf',
    mapFileId: 'archives:Map2008-2011Rink.swf',
    type: 'rink'
  },
  {
    date: '2009-06-19',
    rinkFileId: 'archives:RoomsRink_2.swf',
    townFileId: 'archives:RoomsTown_2.swf',
    fortsFileId: 'archives:ESForts-SoccerPitch.swf',
    mapFileId: 'archives:Map2008-2011Stadium.swf',
    type: 'stadium'
  },
  {
    date: '2009-11-27',
    townFileId: 'archives:RoomsTown.swf',
    fortsFileId: 'archives:FortsWithIceRinkStadium.swf',
    rinkFileId: 'archives:RoomsRink.swf',
    mapFileId: 'archives:Map2008-2011Rink.swf',
    catalogFileId: 'archives:SportNov2009.swf',
    type: 'rink'
  },
  {
    date: '2010-05-28',
    townFileId: 'archives:RoomsTown_2.swf',
    mapFileId: 'archives:Map2008-2011Stadium.swf',
    fortsFileId: 'archives:ESForts-SoccerPitch.swf',
    catalogFileId: 'archives:May10Sport.swf',
    rinkFileId: 'archives:RoomsRink-May2010.swf',
    type: 'stadium'
  },
  {
    date: '2010-09-24',
    townFileId: 'archives:RoomsTown-Stadium_Games.swf',
    fortsFileId: 'archives:RoomsForts-Stadium_Games.swf',
    rinkFileId: 'archives:RoomsRink-Stadium_Games.swf',
    mapFileId: 'archives:Map-Stadium_Games.swf',
    catalogFileId: 'archives:September10Sport.swf',
    comment: 'The Stadium Games event starts, replacing the Soccer Pitch'
  },
  {
    date: STADIUM_GAMES_END,
    townFileId: 'archives:RoomsTown.swf',
    rinkFileId: 'archives:RoomsRink-Dec2010.swf',
    mapFileId: 'archives:Map2008-2011Rink.swf',
    fortsFileId: 'archives:RoomsForts.swf',
    catalogFileId: 'archives:December10Sport.swf',
    type: 'rink'
  }
];