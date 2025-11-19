import { Version } from "../routes/versions";
import { RoomName } from "./rooms";
import { Update } from "./updates";

type MusicTimeline = [number, ...Array<{ date: Version; musicId: number; comment?: string; }>];

export const ROOM_MUSIC_TIMELINE: Partial<Record<RoomName, MusicTimeline>> = {
  'coffee': [1],
  'book': [1],
  'pizza': [20],
  'lounge': [0],
  'dance': [
    2,
    // switching to crossing over, unknown the exact date, it's around this time though
    { 
      date: '2006-03-23', 
      musicId: 5,
      comment: 'The Dance Club music is updated'
    }
  ],
  'agent': [
    0,
    { date: Update.HQ_REDESIGN, musicId: 7 }
  ],
  'agentcom': [
    7,
    { date: Update.EPF_RELEASE, musicId: 23 }
  ],
  'dojo': [
    0,
    { date: Update.DIG_OUT_DOJO_END, musicId: 21 }
  ],
  boxdimension: [264],
  'dojofire': [22],
  dojohide: [21],
  dojoext: [
    0,
    // TODO moving as a consequence?
    { date: Update.DIG_OUT_DOJO_END, musicId: 21 },
    { date: Update.CARD_JITSU_RELEASE, musicId: 0}
  ],
  dojowater: [24],
  boiler: [6],
  stage: [0]
};

type TemporaryRoomUpdate = Array<{
  date: Version,
  end: Version,
  fileRef: string;
  comment?: string;
  frame?: number;
}>;

export const TEMPORARY_ROOM_UPDATES: Partial<Record<RoomName, TemporaryRoomUpdate>> = {
  'plaza': [
    {
      date: Update.PLAZA_LAUNCHPAD_START,
      end: '2006-10-13',
      fileRef: 'archives:Plaza31.swf',
      comment: 'A construction begins at the Plaza',
      frame: 2
    },
    {
      date: '2008-09-05',
      end: Update.RUBY_DEBUT,
      fileRef: 'recreation:plaza_ruby_construction.swf',
      comment: 'A construction begins at the Plaza for the Stage'
    },
    {
      date: Update.PPA_10_END,
      end: Update.APRIL_FOOLS_10_END,
      fileRef: 'recreation:aprilfools2010_plaza.swf'
    }
  ],
  'town': [
    {
      date: '2006-09-28',
      end: Update.PLAZA_LAUNCHPAD_START,
      fileRef: 'archives:RoomsTown-LaunchPadConstruction.swf',
      comment: 'A construction begins at the Town'
    }
  ],
  'forts': [
    {
      // unknown end date
      date: '2008-04-17',
      end: '2008-04-21',
      fileRef: 'archives:ArtworkRoomsForts50.swf',
      comment: 'The Snow Forts clock breaks'
    },
    {
      // unknown start date
      date: '2006-10-24',
      end: '2006-10-27',
      fileRef: 'recreation:forts_broken_sign.swf',
      comment: 'The Snow Forts sign breaks'
    }
  ],
  'lodge': [
    {
      date: Update.CHRISTMAS_2008_END,
      end: Update.GINGERBREAD_PIN,
      fileRef: 'recreation:lodge_present_pin.swf'
    }
  ],
  'cove': [
    {
      date: Update.CPIP_UPDATE,
      end: '2008-07-18',
      fileRef: 'recreation:cove_cpip_firework_rocket_pin.swf'
    }
  ],
  'attic': [
    {
      date: Update.CHRISTMAS_2008_END,
      end: Update.GINGERBREAD_PIN,
      fileRef: 'recreation:attic_dec08.swf',
      comment: 'Snow is stored in the Attic'
    },
    {
      date: Update.TACO_PIN,
      end: Update.SNOW_SCULPTURE_09_START,
      fileRef: 'archives:WinterFiesta2009SkiLodge.swf',
      comment: 'The sign in the Attic is now bold'
    }
  ],
  'boiler': [
    {
      date: '2007-09-13',
      end: '2007-09-20',
      fileRef: 'recreation:boiler_100_newspapers.swf',
      comment: 'The Boiler Room is updated for the 100th newspaper'
    }
  ]
}
