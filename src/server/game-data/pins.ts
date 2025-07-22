import { Version } from "../routes/versions"
import { RoomName } from "./rooms"
import { Update } from "./updates";

export type Pin = {
  date: Version;
  name: string;
} & ({} | {
  end: Version;
  room: RoomName;
  fileRef?: string;
  frame?: number;
})
  
// has to be sorted
export const PINS: Array<Pin> = [
  {
    date: Update.PET_SHOP_RELEASE,
    end: '2006-03-31',
    room: 'coffee',
    fileRef: 'archives:ArtworkRoomsCoffee6.swf',
    frame: 2,
    name: 'Shamrock'
  },
  {
    date: '2006-05-12',
    end: '2006-05-26',
    room: 'dock',
    fileRef: 'archives:ArtworkRoomsDock11.swf',
    frame: 2,
    name: 'Balloon'
  },
  {
    date: '2006-08-04',
    end: '2006-08-18',
    name: 'Hockey Stick',
    room: 'village',
    fileRef: 'archives:ArtworkRoomsVillage15.swf',
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
    fileRef: 'archives:Rooms0516Coffee51.swf'
  },
  {
    name: 'Ice Cream Cone',
    date: '2008-06-06',
    end: '2008-06-20',
    // file is from water party, vanilla is not archived
    room: 'forest',
    fileRef: 'archives:WPForest.swf'
  },
  {
    name: 'Record',
    date: Update.RECORD_PIN,
    end: '2008-08-15',
    room: 'dance',
  },
  {
    name: 'Lollipop',
    date: '2008-09-26',
    end: Update.MICROSCOPE_PIN,
    room: 'light',
    fileRef: 'recreation:light_lollipop_pin.swf'
  },
  {
    name: 'Microscope',
    date: Update.MICROSCOPE_PIN,
    end: Update.THIRD_ANNIVERSARY,
    room: 'sport',
    fileRef: 'recreation:sport_microscope_pin.swf'
  },
  {
    name: '3rd Anniversary Cake',
    date: Update.THIRD_ANNIVERSARY,
    end: Update.BLUE_SNOW_PIN,
    room: 'lounge',
    fileRef: 'recreation:lounge_cake_pin.swf'
  },
  {
    name: 'Blue Snow Shovel',
    date: Update.BLUE_SNOW_PIN,
    end: Update.SNOWFLAKE_TILE_PIN,
    room: 'forest',
    fileRef: 'recreation:forest_blue_snow_shovel_pin.swf'
  },
  {
    name: 'Snowflake Tile',
    date: Update.SNOWFLAKE_TILE_PIN,
    end: Update.SNOW_FORT_PIN,
    room: 'beach',
    fileRef: 'recreation:beach_snowflake_tile_pin.swf'
  },
  {
    name: 'Snow Fort',
    date: Update.SNOW_FORT_PIN,
    end: '2008-12-19',
    room: 'pet',
    fileRef: 'recreation:pet_fort_snow_fort_pin.swf'
  },
  {
    name: 'Present',
    date: '2008-12-19'
  },
  {
    name: 'Taco',
    date: '2009-01-16',
    end: Update.LILY_PIN,
    room: 'forts',
    // file is from winter fiesta
    fileRef: 'archives:WinterFiesta2009Forts.swf'
  },
  {
    name: 'Lily',
    date: Update.LILY_PIN,
    end: Update.PUFFLE_O_PIN,
    room: 'beacon',
    fileRef: 'recreation:beacon_lily_pin.swf'
  },
  {
    name: 'Puffle O',
    date: Update.PUFFLE_O_PIN,
    end: '2009-02-27',
    room: 'mine',
    fileRef: 'recreation:mine_puffle_o_pin.swf'
  },
  {
    name: 'Koi Fish',
    date: '2009-08-28',
    end: '2009-09-11',
    room: 'cove',
    // file is from fair
    fileRef: 'archives:RoomsCove-TheFair2009.swf'
  },
  {
    name: '101 Days of Fun',
    date: '2009-09-11',
    end: '2009-09-25',
    room: 'pizza',
    // file is from sensei fire hunt
    fileRef: 'archives:Sensei_Fire_Hunt_pizza.swf'
  },
  {
    name: 'Christmas Bell',
    date: '2009-12-04',
    end: '2009-12-18',
    room: 'forest',
    fileRef: 'archives:RoomsForest-HolidayParty2009Pre.swf'
  },
  {
    name: 'Snowman',
    date: '2009-12-18',
    end: '2010-01-01',
    // post holiday party version is not archived
  },
  {
    date: Update.PUFFLE_PARTY_10_CONST_START,
    end: '2010-03-18',
    name: 'Feather'
  }
];