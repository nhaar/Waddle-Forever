import path from "path";

// file id of newspapers in order
// TODO place in newspapers.ts
const newspaperFiles = [
  'archives:News1.swf',
  'archives:News2.swf',
  'archives:News3.swf',
  'archives:News4.swf',
  'archives:News5.swf',
  'archives:News6.swf',
  'archives:News7.swf',
  'archives:News8.swf',
  'archives:News9.swf',
  'archives:News10.swf',
  'archives:News11.swf',
  'archives:News12.swf',
  'archives:News13.swf',
  'archives:News14.swf',
  'archives:News15.swf',
  'archives:News16.swf',
  'archives:News17.swf',
  'archives:News18.swf',
  'archives:News19.swf',
  'archives:News20.swf',
  'archives:News21.swf',
  'archives:News22.swf',
  'archives:News23.swf',
  'archives:News24.swf',
  'archives:News25.swf',
  'archives:News26.swf'
];

const staticNewspaperFiles: Record<string, string> = {};

newspaperFiles.forEach((fileId, index) => {
  const route = path.join('artwork/news', `news${index + 1}.swf`);
  staticNewspaperFiles[route] = fileId;
})


export const PRE_CPIP_STATIC_FILES: Record<string, string> = {
  'artwork/characters/penguin.swf': 'mammoth:artwork/characters/penguin.swf',
  'edit/edit6.swf': 'mammoth:edit/edit6.swf',
  'games/astro.swf': 'mammoth:games/astro.swf',
  'games/beans.swf': 'mammoth:games/beans.swf',
  'games/biscuit.swf': 'mammoth:games/biscuit.swf',
  'games/puffle.swf': 'mammoth:games/puffle.swf',
  'load.swf': 'mammoth:load.swf',
  'artwork/news/newfan.swf': 'archives:NewsFan.swf',
  ...staticNewspaperFiles,
  'chat299.swf': 'fix:Chat299.swf',
  'chat506.swf': 'unknown:chat506.swf',
  'crumbs21.swf': 'slippers07:media/crumbs21.swf',
  'interface41.swf': 'slippers07:media/interface41.swf',
  'paper86.swf': 'slippers07:media/paper86.swf',
  'join/join13.swf': 'slippers07:media/join/join13.swf',
  'interface/errors4.swf': 'slippers07:media/interface/errors4.swf',
  'artwork/characters/16.swf': 'slippers07:media/artwork/characters/16.swf',
  // coins for change for the only pre CPIP party!
  'artwork/forms/coinsforchange.swf': 'archives:ChristmasParty2007CoinsForChange.swf',
  'chat604.swf': 'fix:Chat604.swf',
  'chat339.swf': 'fix:Chat339.swf',
  'artwork/forms/pollsub.swf': 'archives:ENClose_upsPollsub.swf'
};
