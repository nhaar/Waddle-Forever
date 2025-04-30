import { Version } from "../routes/versions"
import { RoomName } from "./rooms"
import { PET_SHOP_RELEASE, PUFFLE_PARTY_10_CONST_START } from "./updates";

export type Pin = {
  date: Version;
  end: Version;
  name: string;
} & ({} | {
  room: RoomName;
  fileId?: number;
  frame?: number;
})
  
// has to be sorted
export const PINS: Array<Pin> = [
  {
    date: PET_SHOP_RELEASE,
    end: '2006-03-31',
    room: 'coffee',
    fileId: 4938,
    frame: 2,
    name: 'Shamrock'
  },
  {
    date: '2006-05-12',
    end: '2006-05-26',
    room: 'dock',
    fileId: 4939,
    frame: 2,
    name: 'Balloon'
  },
  {
    date: '2006-08-04',
    end: '2006-08-18',
    name: 'Hockey Stick',
    room: 'village',
    fileId: 3826,
    frame: 2
  },
  {
    name: 'Paddleball',
    date: '2007-09-28',
    end: '2007-10-12'
    // part of the fair 2007
    // post fair SWFs are lost
  },
  {
    name: 'Needle',
    date: '2007-11-23',
    end: '2007-12-07'
    // part of surprise party, rest is lost
  },
  {
    name: 'Wreath',
    date: '2007-12-21',
    end: '2008-01-04'
    // only available in christmas party
  },
  {
    name: 'Crayon',
    date: '2008-03-28',
    end: '2008-04-11'
    // only archived in april fools SWFs
  },
  {
    name: 'Treasure Chest',
    date: '2008-04-25',
    end: '2008-05-09'
    // only archived as part of the rockhopper party
  },
  {
    name: 'Goblet',
    date: '2008-05-09',
    end: '2008-05-23',
    room: 'coffee',
    // file is from medieval party, vanilla is not archived
    fileId: 4014
  },
  {
    name: 'Ice Cream Cone',
    date: '2008-06-06',
    end: '2008-06-20',
    // file is from water party, vanilla is not archived
    room: 'forest',
    fileId: 4048
  },
  {
    name: '3rd Anniversary Cake',
    date: '2008-10-24',
    end: '2008-11-07',
    room: 'lounge',
    // file is from halloween party
    fileId: 4153
  },
  {
    name: 'Present',
    date: '2008-12-19',
    end: '2009-01-02',
    // post party version is lost
  },
  {
    name: 'Taco',
    date: '2009-01-16',
    end: '2009-01-30',
    room: 'forts',
    // file is from winter fiesta
    fileId: 4233
  },
  {
    name: 'Koi Fish',
    date: '2009-08-28',
    end: '2009-09-11',
    room: 'cove',
    // file is from fair
    fileId: 4435
  },
  {
    name: '101 Days of Fun',
    date: '2009-09-11',
    end: '2009-09-25',
    room: 'pizza',
    // file is from sensei fire hunt
    fileId: 4469
  },
  {
    name: 'Christmas Bell',
    date: '2009-12-04',
    end: '2009-12-18',
    room: 'forest',
    fileId: 4533
  },
  {
    name: 'Snowman',
    date: '2009-12-18',
    end: '2010-01-01',
    // post holiday party version is not archived
  },
  {
    date: PUFFLE_PARTY_10_CONST_START,
    end: '2010-03-18',
    name: 'Feather'
  }
];