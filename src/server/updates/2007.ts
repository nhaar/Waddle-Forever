import { Update } from ".";

export const UPDATES_2007: Update[] = [
  {
    date: '2007-01-05',
    clothingCatalog: 'archives:Clothing_0701.swf'
  },
  {
    date: '2007-01-15',
    map: 'recreation:map_vector_original.swf', // rough estimate date
    miscComments: ['The map is vectorized']
  },
  {
    date: '2007-02-02',
    clothingCatalog: 'archives:Clothing_0702.swf',
    miscComments: ['Rockhopper is seen from the telescope'],
    temp: {
      'rockhopper-approach': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:Telescope5.swf'
        }
      }
    }
  },
  {
    date: '2007-02-07',
    miscComments: ['Rockhopper is seen closer from the telescope'],
    temp: {
      'rockhopper-approach': {
        fileChanges: {
          'artwork/tools/telescope0.swf': 'archives:Telescope6.swf'
        }
      }
    }
  },
  {
    date: '2007-02-09',
    end: ['rockhopper-approach']
  },
  {
    date: '2007-02-26',
    gameRelease: 'Pizzatron 3000',
    rooms: {
      pizza: 'recreation:pizza_2007.swf'
    }
  },
  {
    date: '2007-03-02',
    clothingCatalog: 'archives:Clothing_0703.swf'
  },
  {
    date: '2007-04-06',
    clothingCatalog: 'archives:Clothing_0704.swf'
  },
  {
    date: '2007-05-04',
    clothingCatalog: 'archives:Clothing_0705.swf'
  },
  {
    date: '2007-06-01',
    clothingCatalog: 'archives:Clothing_0706.swf'
  },
  {
    date: '2007-06-04',
    gameRelease: 'Catchin\' Waves'
  },
  {
    date: '2007-07-06',
    clothingCatalog: 'archives:Clothing_0707.swf'
  },
  {
    date: '2007-08-02',
    clothingCatalog: 'archives:August2007PenguinStyle.swf'
  },
  {
    date: '2007-09-07',
    clothingCatalog: 'archives:September07Style.swf'
  },
  {
    date: '2007-10-05',
    clothingCatalog: 'archives:PenguinStyleOct2007.swf'
  },
  {
    date: '2007-11-02',
    clothingCatalog: 'archives:PenguinStyleNov2007.swf'
  },
  {
    date: '2007-12-07',
    clothingCatalog: 'archives:Clothing_0712.swf'
  }
];