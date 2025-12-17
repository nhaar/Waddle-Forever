import { RoomName } from "./rooms"

export type Pin = {
  name: string;
} & ({
  hidden: boolean;
  room?: RoomName;
} | {
  room: RoomName;
  file: string;
  frame?: number;
});

export const PINS: Array<Pin | Pin[]> = [
  {
    name: 'Shamrock',
    room: 'coffee',
    file: 'archives:ArtworkRoomsCoffee6.swf',
    frame: 2,
  },
  {
    name: 'Music Note',
    room: 'pizza',
    file: 'archives:ArtworkRoomsPizza13.swf',
    frame: 2
  },
  {
    name: 'Plant',
    room: 'lounge',
    file: 'archives:ArtworkRoomsLounge11.swf',
    frame: 2
  },
  {
    name: 'Pizza Slice',
    room: 'plaza',
    file: 'archives:ArtworkRoomsPlaza14.swf',
    frame: 4
  },
  {
    room: 'dock',
    file: 'archives:ArtworkRoomsDock11.swf',
    frame: 2,
    name: 'Balloon'
  },
  {
    name: 'Mining Lantern',
    file: 'archives:ArtworkRoomsDance14.swf',
    room: 'dance',
    frame: 2
  },
  {
    name: 'Beach Ball',
    file: 'archives:ArtworkRoomsAttic12.swf',
    room: 'attic',
    frame: 2
  },
  {
    name: 'Sun',
    file: 'archives:ArtworkRoomsBook11.swf',
    room: 'book',
    frame: 2
  },
  {
    name: 'Horse Shoe',
    file: 'archives:ArtworkRoomsShack11.swf',
    room: 'shack',
    frame: 2
  },
  {
    name: 'Astro-Barrier Ship',
    file: 'archives:ArtworkRoomsForts15.swf',
    room: 'forts',
    frame: 2
  },
  {
    name: 'Hockey Stick',
    room: 'village',
    file: 'archives:ArtworkRoomsVillage14.swf',
    frame: 2
  },
  {
    name: 'Soccer Ball',
    file: 'archives:ArtworkRoomsShop11.swf',
    room: 'shop',
    frame: 2
  },
  {
    name: 'Pencil',
    file: 'archives:ArtworkRoomsBook12.swf',
    room: 'book',
    frame: 2
  },
  {
    name: 'Lighthouse',
    room: 'plaza',
    file: 'recreation:plaza_lighthouse_pin.swf'
  },
  {
    name: 'Telescope',
    file: 'archives:ArtworkRoomsMtn40.swf',
    room: 'mtn',
    frame: 2
  },
  {
    name: 'Jolly Roger Flag',
    hidden: true
  },
  {
    name: 'Pumpkin',
    hidden: true
  },
  {
    name: 'Jet Pack',
    room: 'beach',
    file: 'archives:ArtworkRoomsBeach42.swf',
    frame: 2
  },
  {
    name: 'Life Ring',
    room: 'light',
    file: 'recreation:light_life_ring_pin.swf'
  },
  {
    name: 'Bonfire',
    hidden: true
  },
  {
    name: 'Candy Cane',
    room: 'dance',
    file: 'archives:ArtworkRoomsDance42.swf',
    frame: 2
  },
  {
    name: 'Apple',
    hidden: true
  },
  {
    name: 'Cactus',
    hidden: true
  },
  {
    name: 'Teddy Bear',
    hidden: true
  },
  {
    name: 'Ice Block',
    room: 'berg',
    file: 'recreation:berg_ice_block_pin.swf'
  },
  {
    name: 'Shrimp',
    hidden: true
  },
  {
    name: 'Pot O\' Gold',
    hidden: true
  },
  {
    name: 'Cardboard Box',
    hidden: true
  },
  {
    name: 'Microphone',
    room: 'beacon',
    file: 'recreation:beacon41.swf'
  },
  {
    name: 'Gem',
    hidden: true
  },
  {
    name: 'Tulip',
    room: 'sport',
    file: 'recreation:shop43.swf',
    frame: 2
  },
  {
    name: 'Starfish',
    hidden: true
  },
  {
    name: 'Surfboard',
    hidden: true
  },
  {
    name: 'Picnic Basket',
    room: 'lodge',
    file: 'archives:ArtworkRoomsLodge46.swf',
    frame: 2
  },
  {
    name: 'Water Droplet',
    hidden: true
  },
  {
    name: 'Cart',
    hidden: true
  },
  {
    name: 'Butterfly',
    hidden: true
  },
  {
    name: 'Tent',
    hidden: true
  },
  {
    name: 'Baseball',
    hidden: true
  },
  {
    name: 'Jellyfish',
    hidden: true
  },
  {
    name: 'Paddleball',
    hidden: false
  },
  {
    name: 'Hairbrush',
    hidden: true
  },
  {
    name: 'Spider',
    hidden: true
  },
  {
    name: 'UFO',
    hidden: true
  },
  {
    name: 'Needle',
    hidden: false
  },
  {
    name: 'Holly',
    hidden: true
  },
  {
    name: 'Wreath',
    file: 'archives:Attic42_Wreath_Pin.swf',
    room: 'attic'
  },
  {
    name: 'Red Snow Shovel',
    hidden: true
  },
  {
    name: 'Sombrero',
    hidden: true
  },
  {
    name: 'Rowboat',
    file: 'archives:Light46_Rowboat_Pin.swf',
    room: 'light'
  },
  {
    name: 'Anchor',
    hidden: true
  },
  {
    name: 'Aqua Grabber Sub',
    hidden: true
  },
  {
    name: 'Book',
    hidden: true
  },
  {
    name: 'Crayon',
    room: 'shack',
    file: 'archives:ArtworkRoomsShack41.swf'
  },
  {
    name: 'Pyramid',
    room: 'book',
    file: 'archives:Book43_Pyramid_Pin.swf'
  },
  {
    name: 'Treasure Chest',
    hidden: false
  },
  {
    name: 'Goblet',
    room: 'coffee',
    file: 'archives:Rooms0516Coffee51.swf'
  },
  {
    name: 'Anvil',
    hidden: true
  },
  {
    name: 'Ice Cream Cone',
    room: 'forest',
    file: 'archives:Forest50_Icecream_Cone_Pin.swf'
  },
  {
    name: 'Basketball',
    hidden: true
  },
  {
    name: 'Firework Rocket',
    hidden: true,
    room: 'cove'
  },
  {
    name: 'Treble Clef',
    room: 'cave',
    file: 'recreation:cave_treble_clef_pin.swf'
  },
  {
    name: 'Record',
    hidden: false
  },
  {
    name: 'Dodgeball',
    room: 'stage',
    file: 'recreation:stage_dodgeball_pin.swf'
  },
  {
    name: '150th Newspaper',
    file: 'recreation:boiler_150_newspaper.swf',
    room: 'boiler'
  },
  {
    name: 'Magnifying Glass',
    room: 'dock',
    file: 'recreation:dock_magnifying_glass_pin.swf'
  },
  {
    name: 'Lollipop',
    room: 'light',
    file: 'recreation:light_lollipop_pin.swf'
  },
  {
    name: 'Microscope',
    room: 'sport',
    file: 'recreation:sport_microscope_pin.swf'
  },
  {
    name: '3rd Anniversary Cake',
    room: 'lounge',
    file: 'recreation:lounge_cake_pin.swf'
  },
  {
    name: 'Blue Snow Shovel',
    room: 'forest',
    file: 'recreation:forest_blue_snow_shovel_pin.swf'
  },
  {
    name: 'Snowflake Tile',
    room: 'beach',
    file: 'recreation:beach_snowflake_tile_pin.swf'
  },
  {
    name: 'Snow Fort',
    room: 'pet',
    file: 'recreation:pet_fort_snow_fort_pin.swf'
  },
  {
    name: 'Present',
    hidden: false,
    file: 'recreation:lodge_present_pin.swf',
    room: 'lodge'
  },
  {
    name: 'Gingerbread Man',
    room: 'attic',
    file: 'archives:RoomsAttic-GingerbreadManPin.swf'
  },
  {
    name: 'Taco',
    room: 'forts',
    file: 'recreation:forts_taco_pin.swf'
  },
  {
    name: 'Lily',
    room: 'beacon',
    file: 'recreation:beacon_lily_pin.swf'
  },
  {
    name: 'Puffle O',
    room: 'mine',
    file: 'recreation:mine_puffle_o_pin.swf'
  },
  {
    name: 'O-Berry',
    room: 'berg',
    file: 'recreation:berg_oberry_pin.swf'
  },
  {
    name: 'Lucky Coin',
    hidden: false
  },
  {
    name: 'Top Hat',
    room: 'attic',
    file: 'recreation:attic_top_hat_pin.swf'
  },
  {
    name: 'Chocolate Bunny',
    room: 'forest',
    file: 'archives:Forest_Chocolate_Bunny_Pin.swf'
  },
  {
    name: 'Tree',
    room: 'dojoext',
    file: 'recreation:dojoext_tree_pin.swf'
  },
  {
    name: 'King\'s Crown',
    room: 'boiler',
    file: 'recreation:boiler_kings_crown_pin.swf'
  },
  {
    name: 'Ice Cream Sundae',
    room: 'pizza',
    file: 'recreation:pizza_ice_cream_sundae_pin.swf'
  },
  {
    name: 'Safari Hat',
    room: 'book',
    file: 'recreation:book_safari_hat_pin.swf'
  },
  {
    name: 'Watermelon',
    room: 'light',
    file: 'recreation:light_watermelon_pin.swf'
  },
  {
    name: 'Dojo Lantern',
    room: 'cave',
    file: 'recreation:cave_dojo_lantern_pin.swf'
  },
  {
    name: 'Beach Umbrella',
    file: 'archives:Boiler_Room_Beach_Umbrella_Pin.swf',
    room: 'boiler'
  },
  {
    name: 'Toy Sailboat',
    room: 'coffee',
    file: 'recreation:coffee_toy_sailboat_pin.swf'
  },
  {
    name: 'Sand Castle',
    room: 'mine',
    file: 'recreation:mine_sand_castle_pin.swf'
  },
  {
    name: 'Koi Fish',
    room: 'cove',
    file: 'recreation:cove_koi_fish_pin.swf'
  },
  {
    name: '101 Days of Fun',
    hidden: false
  },
  {
    name: 'Padlock',
    room: 'book',
    file: 'recreation:book_padlock_pin.swf'
  },
  {
    name: 'Football',
    room: 'attic',
    file: 'recreation:attic_football_pin.swf'
  },
  {
    name: '4th Anniversary Cake',
    room: 'boiler',
    file: 'archives:Boiler_Room_4th_Anniversary_Cake_Pin.swf'
  },
  {
    name: 'Toboggan',
    room: 'mtn',
    file: 'recreation:mtn_toboggan_pin.swf'
  },
  {
    name: 'Hot Chocolate',
    room: 'coffee',
    file: 'archives:Coffee_Shop_Hot_Chocolate_Pin.swf'
  },
  {
    name: 'Christmas Bell',
    room: 'forest',
    file: 'archives:RoomsForest-HolidayParty2009Pre.swf'
  },
  {
    name: 'Snowman',
    room: 'attic',
    file: 'recreation:attic_snowman_pin.swf'
  },
  {
    name: 'Fireworks',
    room: 'light',
    file: 'recreation:light_fireworks_pin.swf'
  },
  {
    name: 'Puffer Fish',
    room: 'berg',
    file: 'recreation:berg_puffer_fish_pin.swf'
  },
  {
    name: 'Speaker',
    room: 'pet',
    file: 'recreation:pet_speaker_pin.swf'
  },
  {
    name: 'Feather',
    room: 'beacon',
    file: 'recreation:beacon_feather_pin.swf'
  },
  {
    name: 'Wagon',
    room: 'lodge',
    file: 'recreation:lodge_wagon_pin.swf'
  },
  {
    name: 'Boot',
    room: 'lounge',
    file: 'archives:Dance_Lounge_Boot_Pin.swf'
  },
  {
    name: 'Cupcake',
    room: 'sport',
    file: 'recreation:sport_cupcake_pin.swf'
  },
  {
    name: 'Frog',
    room: 'dock',
    file: 'archives:Dock_Frog_Pin.swf'
  },
  {
    name: 'Leaf',
    hidden: false
  },
  {
    name: 'Shield',
    room: 'cove',
    file: 'recreation:cove_shield_pin.swf'
  },
  {
    name: 'Cream Soda Barrel',
    room: 'book',
    file: 'recreation:book_cream_soda_barrel_pin.swf'
  },
  {
    name: 'Seashell',
    room: 'berg',
    file: 'recreation:berg_seashell_pin.swf'
  },
  {
    name: 'Light Bulb',
    room: 'pizza',
    file: 'archives:Pizza_Parlor_Light_Bulb_Pin.swf'
  },
  {
    name: 'Candy Apple',
    room: 'lake',
    file: 'archives:Hidden_Lake_Candy_Apple_Pin.swf'
  },
  {
    name: 'Tambourine',
    room: 'attic',
    file: 'archives:RoomsAtticTambourinePin.swf'
  },
  {
    name: 'Compass',
    room: 'boiler',
    file: 'archives:Boiler_Room_Compass_Pin.swf'
  },
  {
    name: 'Carabiner',
    room: 'light',
    file: 'archives:Lighthouse_Carabiner_Pin.swf'
  },
  {
    name: 'Igloo',
    room: 'cave',
    file: 'archives:RoomsCave-IglooPin.swf'
  },
  {
    name: 'Fair Ticket',
    room: 'book',
    file: 'archives:Book_Room_Fair_Ticket_Pin.swf'
  },
  {
    name: 'Sandwich',
    room: 'cavemine',
    file: 'archives:Cave_Mine_Sandwich_Pin.swf'
  },
  {
    name: 'Carrot',
    room: 'dance',
    file: 'archives:Night_Club_Carrot_Pin.swf'
  },
  {
    name: 'Bat',
    room: 'cove',
    file: 'recreation:cove_bat_pin.swf'
  },
  {
    name: 'Water Tap',
    room: 'beach',
    file: 'archives:WaterHuntBeach.swf'
  },
  {
    name: 'Water',
    room: 'berg',
    file: 'archives:Iceberg_Water_Pin.swf'
  },
  {
    name: 'Snowflakes',
    room: 'forts',
    file: 'archives:SnowForts.swf'
  },
  {
    name: 'Snow Globe',
    hidden: false
  },
  {
    name: 'Party Favors',
    hidden: false
  },
  {
    name: 'Sleeping Bag',
    room: 'coffee',
    file: 'archives:Coffee_Shop_Sleeping_Bag_Pin.swf'
  },
  {
    name: 'Fire Extinguisher',
    room: 'lounge',
    file: 'archives:Dance_Lounge_Fire_Extinguisher_Pin.swf'
  },
  [
    {
      name: 'Blue Puffle',
      room: 'attic',
      file: 'archives:Lodge_Attic_Blue_Puffle_Pin.swf'
    },
    {
      name: 'Red Puffle',
      room: 'lake',
      file: 'archives:Hidden_Lake_Red_Puffle_Pin.swf'
    }
  ],
  [
    {
      name: 'Green Puffle',
      room: 'dojo',
      file: 'archives:Dojo_Green_Puffle_Pin.swf'
    },
    {
      name: 'Black Puffle',
      room: 'eco',
      file: 'archives:Recycling_Plant_Black_Puffle_Pin.swf'
    }
  ],
  [
    {
      name: 'Purple Puffle',
      room: 'pizza',
      file: 'archives:Pizza_Parlor_Purple_Puffle_Pin.swf'
    },
    {
      name: 'Pink Puffle',
      room: 'cove',
      file: 'archives:Cove_Pink_Puffle_Pin.swf'
    }
  ],
  [
    {
      name: 'White Puffle',
      room: 'book',
      file: 'archives:Book_Room_White_Puffle_Pin.swf'
    },
    {
      name: 'Yellow Puffle',
      room: 'shack',
      file: 'archives:Mine_Shack_Yellow_Puffle_Pin.swf'
    }
  ],
  [
    {
      name: 'Brown Puffle',
      hidden: true
    },
    {
      name: 'Orange Puffle',
      hidden: true
    }
  ],
  {
    name: 'Savanna Tree',
    room: 'lodge',
    file: 'archives:Ski_Lodge_Savanna_Tree_Pin.swf'
  },
  {
    name: 'Medieval Shield',
    hidden: true
  },
  {
    name: 'Brazier',
    hidden: false
  },
  {
    name: 'Red Electric Guitar',
    hidden: true
  },
  {
    name: 'Stereo',
    hidden: true
  },
  {
    name: 'Tiki Mask',
    room: 'dock',
    file: 'archives:Dock_Tiki_Mask_Pin.swf'
  },
  {
    name: 'Gold Anchor',
    hidden: true
  },
  {
    name: 'Tropical Bird',
    room: 'shop',
    file: 'archives:ShopWithTropicalBirdPin.swf'
  },
  {
    name: 'Checkered Flag',
    room: 'cove',
    file: 'archives:Cove_Checkered_Flag_Pin.swf'
  },
  {
    name: 'Polar Paw Print',
    room: 'cave',
    file: 'archives:Underground_Pool_Polar_Paw_Print_Pin.swf'
  },
  {
    name: 'Balloon Bunch',
    room: 'forest',
    file: 'archives:Forest_Balloon_Bunch_Pin.swf'
  },
  {
    name: 'Milkshake',
    hidden: true
  },
  {
    name: 'Fence',
    room: 'beach',
    file: 'archives:RoomsBeach-Pin4.swf'
  },
  {
    name: 'Crystal Ball',
    room: 'lake',
    file: 'archives:Hidden_Lake_Crystal_Ball_Pin.swf'
  },
  {
    name: 'Hot Sauce',
    hidden: true
  },
  {
    name: 'Blue Fish',
    room: 'forts',
    file: 'archives:Snow_Forts_Blue_Fish_Pin.swf'
  },
  {
    name: 'Bonsai Tree',
    room: 'lodge',
    file: 'archives:Ski_Lodge_Bonsai_Tree_Pin.swf'
  },
  {
    name: 'Reindeer',
    hidden: false
  },
  {
    name: 'Candy Swirl',
    room: 'coffee',
    file: 'archives:RoomsCoffeePin8.swf'
  },
  {
    name: 'Conch Shell',
    room: 'berg',
    file: 'archives:Iceberg_Conch_Shell_Pin.swf'
  },
  {
    name: 'Beach Chair',
    hidden: true
  },
  {
    name: 'Camera',
    hidden: true
  },
  {
    name: 'Helm',
    hidden: true
  },
  {
    name: 'Cheese',
    room: 'boiler',
    file: 'archives:BoilerWithCheesePin.swf'
  },
  {
    name: 'Cake',
    hidden: true
  },
  {
    name: 'Easter Basket',
    room: 'forest',
    file: 'archives:Forest_Easter_Basket_Pin.swf'
  },
  {
    name: 'Forest',
    room: 'cave',
    file: 'archives:RoomsCave-Pin8.swf'
  },
  {
    name: 'Black Helm',
    hidden: true
  },
  {
    name: 'Scorn Crest',
    hidden: false
  },
  {
    name: 'Bean Bag',
    room: 'coffee',
    file: 'archives:RoomsCoffeePin9.swf'
  },
  {
    name: 'Superhero',
    hidden: false
  },
  {
    name: 'Supervillain',
    room: 'dojoext',
    file: 'archives:Dojo_Courtyard_Supervillain_Pin.swf'
  },
  {
    name: 'Dub-step Puffle',
    room: 'lake',
    file: 'archives:LakeDub-step_Puffle_Pin.swf'
  },
  {
    name: 'Spotlight',
    room: 'attic',
    file: 'archives:RoomsAttic-Pin10.swf'
  },
  {
    name: 'Banana Peel',
    room: 'coffee',
    file: 'archives:RoomsCoffeePin10.swf'
  },
  {
    name: 'Fruit Combo',
    room: 'berg',
    file: 'archives:RoomsBerg-Pin9.swf'
  },
  {
    name: 'Windmill',
    room: 'dock',
    file: 'archives:RoomsDock-Pin10.swf'
  },
  {
    name: 'Triple Scoop',
    room: 'lodge',
    file: 'archives:RoomsLodge-Pin8.swf'
  },
  {
    name: 'Puffle Bat',
    room: 'beach',
    file: 'archives:RoomsBeach-Pin5.swf'
  },
  {
    name: '7th Anniversary Hat',
    room: 'cavemine',
    file: 'archives:RoomsCavemine_pin4.swf'
  },
  {
    name: 'Gariwald Family Crest',
    room: 'eco',
    file: 'archives:RoomsEcoPin2.swf'
  },
  {
    name: 'Heavy Weights',
    room: 'boiler',
    file: 'archives:RoomsBoiler-Pin13.swf'
  },
  {
    name: 'First Aid',
    room: 'mine',
    file: 'archives:RoomsMine-Nov292012.swf'
  }
];