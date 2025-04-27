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
  const route = path.join('artwork/news', `news${index + 1}.swf`);
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
  'artwork/news/newfan.swf': 67,
  ...staticNewspaperFiles,
  'chat299.swf': 3758,
  'chat506.swf': 3788,
  'media/crumbs21.swf': 3789,
  'media/interface41.swf': 3790,
  'media/paper86.swf': 3792,
  'media/join/join13.swf': 3793,
  'media/interface/errors4.swf': 3794,
  'media/artwork/characters/16.swf': 3795,
  // coins for change for the only pre CPIP party!
  'media/artwork/forms/coinsforchange.swf': 3921,
  'chat604.swf': 3937,
  'chat339.swf': 3938,
  'media/artwork/forms/pollsub.swf': 3962
};
