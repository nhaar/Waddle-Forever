/** All properties of room_crumbs object in global crumbs */
type CrumbRoom = 'town' |
  'coffee' |
  'book' |
  'dance' |
  'lounge' |
  'eco' |
  'shop' |
  'plaza' |
  'pet' |
  'dojo' |
  'dojoext' |
  'dojohide' |
  'dojofire' |
  'dojowater' |
  'pizza' |
  'stage' |
  'village' |
  'sport' |
  'lodge' |
  'attic' |
  'mtn' |
  'forts' |
  'rink' |
  'boiler' |
  'dock' |
  'beach' |
  'light' |
  'beacon' |
  'forest' |
  'agent' |
  'agentcom' |
  'agentlobbysolo' |
  'agentlobbymulti' |
  'agentvr' |
  'berg' |
  'cove' |
  'cave' |
  'mine' |
  'shack' |
  'boxdimension' |
  'cavemine' |
  'lake' |
  'underwater' |
  'ship' |
  'shipnest' |
  'shiphold' |
  'shipquarters' |
  'party' |
  'party1' |
  'party2' |
  'party3' |
  'party4' |
  'party5' |
  'party6' |
  'party7' |
  'party8' |
  'party9' |
  'party10' |
  'party11' |
  'party12' |
  'party13' |
  'party14' |
  'party15' |
  'party16' |
  'party17' |
  'party18' |
  'party99';

/** Represents all updates for the music ID of a room */
export type MusicUpdate = Partial<Record<CrumbRoom, number>>;

/** Represents all updates of the global_paths object in global_crumbs */
export type PathsUpdate = Record<string, string>;

export type PricesUpdate = Record<number, number>;