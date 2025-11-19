import { Version } from "../routes/versions";
import { RoomName } from "./rooms";
import { Update } from "./updates";

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
