import { Update } from ".";

export const UPDATES_2005: Update[] = [
  {
    date: '2005-08-22',
    map: "recreation:map_release.swf",
    iglooVersion: 1,
    fileChanges: {
      'chat291.swf': 'approximation:chat291_no_news.swf' // newspapers-less precpip client
    }
  },
  {
    date: '2005-09-13',
    gameRelease: 'Astro Barrier',
    rooms: {
      lounge: 'mammoth:artwork/rooms/lounge10.swf'
    },
    iglooVersion: 20,
    miscComments: ['Penguins can now purchase different types of igloo']
  },
  {
    date: '2005-09-21',
    clothingCatalog: 'archives:September05Style.swf',
    party: {
      name: 'Beta Test Party',
      rooms: {
        'town': 'fix:Town-party.swf'
      },
      music: {
        town: 2
      }
    }
  },
  {
    date: '2005-09-22',
    party: null
  },
  {
    date: '2005-10-24',
    clothingCatalog: 'archives:Clothing_0510.swf',
    furnitureCatalog: 'archives:Furniture_0510.swf',
    newspaper: 'irregular',
    fileChanges: {
      // precpip client with newspapers
      'chat291.swf': 'approximation:chat291_no_april.swf',
      'artwork/characters/penguin.swf': 'mammoth:artwork/characters/penguin.swf'
    },
    miscComments: ['Club Penguin releases']
  },
  {
    date: '2005-10-28',
    newspaper: 'fan'
  },
  {
    date: '2005-11-01',
    clothingCatalog: 'archives:Clothing_0511.swf'
  },
  {
    date: '2005-11-03',
    newspaper: 'irregular'
  },
  {
    date: '2005-11-08',
    newspaper: 'irregular'
  },
  {
    date: '2005-11-11',
    newspaper: 'irregular'
  },
  {
    date: '2005-11-16',
    newspaper: 'irregular'
  },
  {
    date: '2005-11-21',
    newspaper: 'irregular'
  },
  {
    date: '2005-12-01',
    clothingCatalog: 'archives:Clothing_0512.swf',
    newspaper: 'period-start'
  },
  {
    date: '2005-12-14',
    gameRelease: 'Puffle Roundup',
    rooms: {
      forts: 'fix:ArtworkRoomsForts3.swf'
    }
  }
];