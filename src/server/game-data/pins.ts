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
// TODO implicit dates
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
    name: 'Treble Clef',
    date: '2008-07-18',
    end: Update.RECORD_PIN,
    room: 'cave',
    fileRef: 'recreation:cave_treble_clef_pin.swf'
  },
  {
    // timeline of this pin is weird due to the many updates of the night club
    // post music jam
    name: 'Record',
    date: Update.RECORD_PIN,
    end: '2008-08-15'
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
    name: 'Gingerbread Man',
    date: '2009-01-02',
    end: Update.TACO_PIN,
    room: 'attic',
    fileRef: 'archives:RoomsAttic-GingerbreadManPin.swf'
  },
  {
    name: 'Taco',
    date: Update.TACO_PIN,
    end: Update.LILY_PIN,
    room: 'forts',
    fileRef: 'recreation:forts_taco_pin.swf'
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
    name: 'O-Berry',
    date: '2009-02-27',
    end: '2009-03-13',
    room: 'berg',
    fileRef: 'recreation:berg_oberry_pin.swf'
  },
  {
    name: 'Lucky Coin',
    date: '2009-03-13',
    end: '2009-03-27'
  },
  {
    name: 'Top Hat',
    date: '2009-03-27',
    end: '2009-04-10',
    room: 'attic',
    fileRef: 'recreation:attic_top_hat_pin.swf'
  },
  {
    name: 'Chocolate Bunny',
    room: 'forest',
    date: '2009-04-10',
    end: '2009-04-24',
    fileRef: 'archives:Forest_Chocolate_Bunny_Pin.swf'
  },
  {
    name: 'Tree',
    room: 'dojoext',
    date: '2009-04-24',
    end: '2009-05-08',
    fileRef: 'recreation:dojoext_tree_pin.swf'
  },
  {
    name: 'King\'s Crown',
    date: '2009-05-08',
    end: '2009-05-22',
    room: 'boiler',
    fileRef: 'recreation:boiler_kings_crown_pin.swf'
  },
  {
    name: 'Ice Cream Sundae',
    room: 'pizza',
    date: '2009-05-22',
    end: '2009-06-05',
    fileRef: 'recreation:pizza_ice_cream_sundae_pin.swf'
  },
  {
    name: 'Safari Hat',
    room: 'book',
    date: '2009-06-05',
    end: '2009-06-19',
    fileRef: 'recreation:book_safari_hat_pin.swf'
  },
  {
    name: 'Watermelon',
    room: 'light',
    date: '2009-06-19',
    end: '2009-07-03',
    fileRef: 'recreation:light_watermelon_pin.swf'
  },
  {
    name: 'Dojo Lantern',
    room: 'cave',
    date: '2009-07-03',
    end: '2009-07-17',
    fileRef: 'recreation:cave_dojo_lantern_pin.swf'
  },
  {
    name: 'Beach Umbrella',
    fileRef: 'archives:Boiler_Room_Beach_Umbrella_Pin.swf',
    room: 'boiler',
    date: '2009-07-17',
    end: '2009-07-31',
  },
  {
    name: 'Toy Sailboat',
    room: 'coffee',
    date: '2009-07-31',
    end: '2009-08-14',
    fileRef: 'recreation:coffee_toy_sailboat_pin.swf'
  },
  {
    name: 'Sand Castle',
    room: 'mine',
    date: '2009-08-14',
    end: '2009-08-28',
    fileRef: 'recreation:mine_sand_castle_pin.swf'
  },
  {
    name: 'Koi Fish',
    date: '2009-08-28',
    end: '2009-09-11',
    room: 'cove',
    fileRef: 'recreation:cove_koi_fish_pin.swf'
  },
  {
    name: '101 Days of Fun',
    date: '2009-09-11',
    end: '2009-09-25',
  },
  {
    name: 'Padlock',
    room: 'book',
    fileRef: 'recreation:book_padlock_pin.swf',
    date: '2009-09-25',
    end: '2009-10-09'
  },
  {
    name: 'Football',
    room: 'attic',
    fileRef: 'recreation:attic_football_pin.swf',
    date: '2009-10-09',
    end: '2009-10-23'
  },
  {
    name: '4th Anniversary Cake',
    room: 'boiler',
    fileRef: 'archives:Boiler_Room_4th_Anniversary_Cake_Pin.swf',
    date: '2009-10-23',
    end: '2009-11-06'
  },
  {
    name: 'Hot Chocolate',
    date: '2009-11-20',
    end: '2009-12-04',
    room: 'coffee',
    fileRef: 'archives:Coffee_Shop_Hot_Chocolate_Pin.swf'
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
    room: 'attic',
    fileRef: 'recreation:attic_snowman_pin.swf'
  },
  {
    name: 'Fireworks',
    date: '2010-01-01',
    end: '2010-01-15',
    room: 'light',
    fileRef: 'recreation:light_fireworks_pin.swf'
  },
  {
    name: 'Puffer Fish',
    date: '2010-01-15',
    end: '2010-01-29',
    room: 'berg',
    fileRef: 'recreation:berg_puffer_fish_pin.swf'
  },
  {
    name: 'Speaker',
    date: '2010-01-29',
    end: '2010-02-12',
    room: 'pet',
    fileRef: 'recreation:pet_speaker_pin.swf'
  },
  {
    date: Update.PUFFLE_PARTY_10_CONST_START,
    end: '2010-03-18',
    name: 'Feather',
    room: 'beacon',
    fileRef: 'recreation:beacon_feather_pin.swf'
  },
  {
    name: 'Wagon',
    date: '2010-02-26',
    end: '2010-03-12',
    room: 'lodge',
    fileRef: 'recreation:lodge_wagon_pin.swf'
  },
  {
    name: 'Boot',
    date: '2010-03-12',
    end: '2010-03-26',
    room: 'lounge',
    fileRef: 'archives:Dance_Lounge_Boot_Pin.swf'
  },
  {
    name: 'Cupcake',
    date: '2010-03-26',
    end: '2010-04-09',
    room: 'sport',
    fileRef: 'recreation:sport_cupcake_pin.swf'
  },
  {
    name: 'Frog',
    date: '2010-04-09',
    end: '2010-04-23',
    room: 'dock',
    fileRef: 'archives:Dock_Frog_Pin.swf'
  },
  {
    name: 'Leaf',
    date: '2010-04-23'
  },
  {
    name: 'Shield',
    date: '2010-05-07',
    end: '2010-05-21',
    room: 'cove',
    fileRef: 'recreation:cove_shield_pin.swf'
  },
  {
    name: 'Cream Soda Barrel',
    date: '2010-05-21',
    end: '2010-06-04',
    room: 'book',
    fileRef: 'recreation:book_cream_soda_barrel_pin.swf'
  },
  {
    name: 'Seashell',
    date: '2010-06-04',
    end: '2010-06-18',
    room: 'berg',
    fileRef: 'recreation:berg_seashell_pin.swf'
  },
  {
    name: 'Light Bulb',
    room: 'pizza',
    fileRef: 'archives:Pizza_Parlor_Light_Bulb_Pin.swf',
    date: '2010-06-18',
    end: '2010-07-02'
  },
  {
    name: 'Candy Apple',
    room: 'lake',
    fileRef: 'archives:Hidden_Lake_Candy_Apple_Pin.swf',
    date: '2010-07-02',
    end: '2010-07-16'
  },
  {
    name: 'Tambourine',
    room: 'attic',
    fileRef: 'archives:RoomsAtticTambourinePin.swf',
    date: '2010-07-16',
    end: '2010-07-30'
  },
  {
    name: 'Compass',
    room: 'boiler',
    fileRef: 'archives:Boiler_Room_Compass_Pin.swf',
    date: '2010-07-30',
    end: '2010-08-13'
  },
  {
    name: 'Carabiner',
    room: 'light',
    fileRef: 'archives:Lighthouse_Carabiner_Pin.swf',
    date: '2010-08-13',
    end: '2010-08-27'
  },
  {
    name: 'Igloo',
    room: 'cave',
    fileRef: 'archives:RoomsCave-IglooPin.swf',
    date: '2010-08-27',
    end: '2010-09-10'
  },
  {
    name: 'Fair Ticket',
    room: 'book',
    fileRef: 'archives:Book_Room_Fair_Ticket_Pin.swf',
    date: '2010-09-10',
    end: '2010-09-24'
  },
  {
    name: 'Sandwich',
    room: 'cavemine',
    fileRef: 'archives:Cave_Mine_Sandwich_Pin.swf',
    date: '2010-09-24',
    end: '2010-10-08'
  },
  {
    name: 'Carrot',
    room: 'dance',
    fileRef: 'archives:Night_Club_Carrot_Pin.swf',
    date: '2010-10-08',
    end: '2010-10-22'
  },
  {
    name: 'Bat',
    date: '2010-10-22',
    end: '2010-11-05',
    room: 'cove',
    fileRef: 'recreation:cove_bat_pin.swf'
  },
  {
    name: 'Water Tap',
    room: 'beach',
    fileRef: 'archives:WaterHuntBeach.swf',
    date: '2010-11-05',
    end: '2010-11-19'
  },
  {
    name: 'Water',
    room: 'berg',
    fileRef: 'archives:Iceberg_Water_Pin.swf',
    date: '2010-11-19',
    end: '2010-12-03'
  },
  {
    name: 'Snowflakes',
    room: 'forts',
    fileRef: 'archives:SnowForts.swf',
    date: '2010-12-03',
    end: '2010-12-17'
  }
];