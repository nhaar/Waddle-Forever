type MapUpdate = {
  updateId: number;
  fileId: number;
  comment?: string;
};

export const MAP_UPDATES: MapUpdate[] = [
  {
    updateId: 2,
    fileId: 35
  },
  {
    updateId: 20,
    fileId: 104
  },
  {
    updateId: 22,
    fileId: 104
  }
]

export const PRECPIP_MAP_PATH = 'artwork/maps/island5.swf';