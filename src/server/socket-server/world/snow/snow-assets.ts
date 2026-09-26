import { getMediaFile } from "@server/game-data/files";
import { Asset } from "./snow";
import { SnowContext } from "@server/socket-server/snow-data-handler";
import { gunzipSync } from 'zlib';

enum AssetType {
  Common,
  UI,
  BG,
  Enemy,
  Ninja,
  Tusk,
  Sound
}

function getAssetType(n: string): AssetType {
  if (['sfx', 'mus'].some(a => n.toLowerCase().startsWith(a))) {
    return AssetType.Sound;
  }

  if (['tusk', 'sensei'].some(a => n.includes(a))) {
    return AssetType.Tusk;
  }

  if (['fireninja', 'waterninja', 'snowninja'].some(a => n.includes(a))) {
    return AssetType.Ninja;
  }

  if (['sly', 'scrap', 'tank', 'snowman'].some(a => n.startsWith(a))) {
    return AssetType.Enemy;
  }

  if (['reg', 'ui', 'effect'].some(a => n.startsWith(a))) {
    return AssetType.UI;
  }

  if (['env', 'crag', 'rock', 'forest'].some(a => n.startsWith(a))) {
    return AssetType.BG;
  }

  return AssetType.Common;
}

async function sortSprites(): Promise<Asset[]> {
  const b = await getMediaFile('svanilla:media/game/mpassets/publishdata/r5309/pubdata/spriteList_tokenized.gml.gz');

  return gunzipSync(new Uint8Array(b))
    .toString('utf-8')
    .split('\n')
    .filter(l => l.startsWith('[W_SPRITE]') || l.startsWith('[W_SOUND]'))
    .map(l => {
      const split = l.split('|');
      const index = Number(split[1].split('0:')[1]);
      const name = split[l.startsWith('[W_SOUND]') ? 2 : 8]
        .split('_flaxp0000')[0]; // dunno what this is, some names have it

      return { index, name };
    });
}

export async function setAssets({ world }: SnowContext) {
  const assets = await sortSprites();

  const categories: Record<AssetType, Asset[]> = {
    [AssetType.Common]: [],
    [AssetType.BG]: [],
    [AssetType.UI]: [],
    [AssetType.Ninja]: [],
    [AssetType.Enemy]: [],
    [AssetType.Tusk]: [],
    [AssetType.Sound]: []
  };

  assets.forEach(a => categories[getAssetType(a.name)].push(a));

  const places = world.places;
  categories[AssetType.Common].forEach(a => {
    places.snow_lobby.assets.add(a);
    places.snow_battle.assets.add(a);
    places.tusk_battle.assets.add(a);
    world.assets.add(a);
  });
  categories[AssetType.BG].forEach(a => {
    places.snow_battle.assets.add(a);
    world.assets.add(a);
  });
  categories[AssetType.UI].forEach(a => {
    places.snow_battle.assets.add(a);
    places.tusk_battle.assets.add(a);
    world.assets.add(a);
  });
  categories[AssetType.Ninja].forEach(a => {
    places.snow_battle.assets.add(a);
    places.tusk_battle.assets.add(a);
    world.assets.add(a);
  });
  categories[AssetType.Enemy].forEach(a => {
    places.snow_battle.assets.add(a);
    world.assets.add(a);
  });
  categories[AssetType.Tusk].forEach(a => {
    places.tusk_battle.assets.add(a);
    world.assets.add(a);
  });
  categories[AssetType.Sound].forEach(a => {
    places.snow_battle.soundAssets.add(a);
    places.tusk_battle.soundAssets.add(a);
    world.soundAssets.add(a);
  });
}