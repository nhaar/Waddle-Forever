import { SettingsManager } from "../settings";
import { getMediaFilePath } from "./files";

type CompoundCheck = {
  check: (s: SettingsManager) => number | undefined;
  files: Record<number, string>;
};

const specialServer = new Map<string, CompoundCheck>();

type SimpleServer = [string, (s: SettingsManager) => boolean, number];

type CompoundServer = [string, (s: SettingsManager) => number | undefined, Record<number, number>];

const simpleFeatures: SimpleServer[] = [
  ['boots.swf', (s) => {
    return s.settings.fps30
  }, 5094],
  ['play/v2/games/book1/bootstrap.swf', (s) => {
    return s.settings.modern_my_puffle
  }, 5097],
  ['play/v2/games/dancing/dance.swf', (s) => {
    return s.settings.swap_dance_arrow
  }, 5099],
  ['play/v2/games/jetpack/JetpackAdventures.swf', (s) => {
    return s.settings.jpa_level_selector
  }, 5101],
];

const compoundFeatures: Array<CompoundServer> = [
  ['play/v2/games/thinice/ThinIce.swf', (s) => {
    if (!s.settings.thin_ice_igt) {
      return;
    }

    if (s.settings.fps30) {
      return 1;
    } else {
      return 2;
    }
  }, {
    1: 5104,
    2: 5103
  }]
]

simpleFeatures.forEach((features) => {
  const check = (s: SettingsManager) => {
    if (features[1](s)) {
      return 1;
    } else {
      return undefined;
    }
  }

  specialServer.set(features[0], {
    check,
    files: { 1: getMediaFilePath(features[2]) }
  });
});

compoundFeatures.forEach((features) => {
  const files: Record<number, string> = {};
  Object.entries(features[2]).forEach((pair) => {
    const [enumeration, fileId] = pair;
    files[Number(enumeration)] = getMediaFilePath(fileId);
  })
  specialServer.set(features[0], {
    check: features[1],
    files
  });
})

export { specialServer };