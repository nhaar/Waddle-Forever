import path from "path";

// file id of newspapers in order
// TODO place in newspapers.ts
const newspaperFiles = [
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  64,
  65
];

const staticNewspaperFiles: Record<string, number> = {};

newspaperFiles.forEach((fileId, index) => {
  const route = path.join('artwork/news', `new${index + 1}.swf`);
  staticNewspaperFiles[route] = fileId;
})


export const PRE_CPIP_STATIC_FILES: Record<string, number> = {
  'artwork/characters/penguin.swf': 4,
  'edit/edit6.swf': 18,
  'games/astro.swf': 19,
  'games/beans.swf': 20,
  'games/biscuit.swf': 21,
  'games/puffle.swf': 23,
  'load.swf': 1,
  'version.txt': 2,
  'artwork/news/newfan.swf': 67,
  ...staticNewspaperFiles,
  'artwork/catalogue/clothing0509.swf': 68,
  'artwork/catalogue/clothing0510.swf': 69,
  'artwork/catalogue/clothing0511.swf': 70,
  'artwork/catalogue/clothing0512.swf': 71,
  'artwork/catalogue/clothing0601.swf': 72,
  'artwork/catalogue/clothing0602.swf': 73,
  'artwork/catalogue/clothing0603.swf': 74,
  'artwork/catalogue/clothing0604.swf': 75
};
