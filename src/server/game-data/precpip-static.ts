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
  'archives:News25.swf'
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
  'artwork/forms/pollsub.swf': 'archives:ENClose_upsPollsub.swf',
  'artwork/toys/sculpture/flamini1.swf': 'recreation:festival_of_snow/flamini1.swf',
  'artwork/toys/sculpture/seemi.swf': 'recreation:festival_of_snow/seemi.swf',
  'artwork/toys/sculpture/Eragon12101.swf': 'recreation:festival_of_snow/eragon12101.swf',
  'artwork/toys/sculpture/Clubpenny202.swf': 'recreation:festival_of_snow/clubpenny202.swf',
  'artwork/toys/sculpture/liilmiig.swf': 'recreation:festival_of_snow/liilmiig.swf',
  'artwork/toys/sculpture/zujkuteee.swf': 'recreation:festival_of_snow/zujkuteee.swf',
  'artwork/toys/sculpture/Innin.swf': 'recreation:festival_of_snow/innin.swf',
  'artwork/toys/sculpture/Air2515.swf': 'recreation:festival_of_snow/air2515.swf',
  'artwork/toys/sculpture/Quitex.swf': 'recreation:festival_of_snow/quitex.swf',
  'artwork/toys/sculpture/Tayler727.swf': 'recreation:festival_of_snow/tayler727.swf',
  'artwork/toys/sculpture/barney1000.swf': 'recreation:festival_of_snow/barney1000.swf',
  'artwork/toys/sculpture/angelspark.swf': 'recreation:festival_of_snow/angelspark.swf',
  'artwork/toys/sculpture/pirategirl66.swf': 'recreation:festival_of_snow/pirategirl66.swf',
  'artwork/toys/sculpture/kombivw557.swf': 'recreation:festival_of_snow/kombivw557.swf',
  'artwork/toys/sculpture/mickmitzinic.swf': 'recreation:festival_of_snow/mickmitzinic.swf',
  'artwork/toys/sculpture/Covanant.swf': 'recreation:festival_of_snow/covanant.swf',
  'artwork/toys/sculpture/converseray.swf': 'recreation:festival_of_snow/converseray.swf',
  'artwork/toys/sculpture/jazzybadger.swf': 'recreation:festival_of_snow/jazzybadger.swf',
  'artwork/toys/sculpture/Toastygirl.swf': 'recreation:festival_of_snow/toastygirl.swf',
  'artwork/toys/sculpture/Klop6.swf': 'recreation:festival_of_snow/klop6.swf',
  'artwork/tools/807.swf': 'archives:AwardsEN807.swf'
};
