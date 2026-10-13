export type StageScript = Array<{
  note: string;
} | {
  name: string;
  message: string;
}>;

/** All stage names */
export type StageName = 'Space Adventure' |
  'The Twelfth Fish' |
  'Team Blue\'s Rally Debut' |
  'Team Blue\'s Rally 2' |
  'Quest for the Golden Puffle' |
  'Squidzoid vs. Shadow Guy and Gamma Gal' |
  'The Penguins that Time Forgot' |
  'Ruby and the Ruby' |
  'Team Blue vs. Team Red' |
  'The Haunting of the Viking Opera' |
  'Underwater Adventure' |
  'Fairy Fables' |
  'Space Adventure Planet Y' |
  'Norman Swarm Has Been Transformed' |
  'Secrets of the Bamboo Forest' |
  'Night of the Living Sled: Live' |
  'Battle of the Ancient Shadows' |
  'A Humbug Holiday' |
  'The Vikings That Time Forgot';

/** Data for each stage play */
export const STAGE_PLAYS: Array<{
  name: StageName,
  musicId: number
}> = [
  {
    name: 'Space Adventure',
    // we know this music was not the same in the second premiere,
    // but that SWF is completely lost, possibly it wasn't in the normal music directory
    musicId: 30
  },
  {
    name: 'The Twelfth Fish',
    musicId: 31
  },
  {
    name: 'Team Blue\'s Rally Debut',
    musicId: 33
  },
  {
    name: 'Team Blue\'s Rally 2',
    musicId: 36
  },
  {
    name: 'Quest for the Golden Puffle',
    musicId: 34
  },
  {
    name: 'The Penguins that Time Forgot',
    musicId: 35
  },
  {
    name: 'Team Blue vs. Team Red',
    musicId: 36
  },
  {
    name: 'The Haunting of the Viking Opera',
    musicId: 41
  },
  {
    name: 'Ruby and the Ruby',
    musicId: 37
  },
  {
    name: 'Underwater Adventure',
    musicId: 230
  },
  {
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    musicId: 32
  },
  {
    name: 'Fairy Fables',
    musicId: 39
  },
  {
    name: 'Norman Swarm Has Been Transformed',
    musicId: 42
  },
  {
    name: 'Secrets of the Bamboo Forest',
    musicId: 43
  },
  {
    name: 'Space Adventure Planet Y',
    musicId: 38
  },
  {
    name: 'Night of the Living Sled: Live',
    musicId: 253
  },
  {
    name: 'Battle of the Ancient Shadows',
    musicId: 314
  },
  {
    name: 'A Humbug Holiday',
    musicId: 255
  },
  {
    name: 'The Vikings That Time Forgot',
    musicId: 41
  }
];

export function getStagePlayMusic(name: StageName): number {
  return STAGE_PLAYS.find((stage) => stage.name === name)?.musicId ?? 0;
}

/**
 * Abridged versions of scripts from other plays,
 * which was sometimes included at the end of the
 * script of the main play
 */
export const MIX_AND_MATCH_SCRIPT: StageScript = [
  { note: "Fairy Fables" },
  { name: "Redhood:", message: "Oh no! A scary looking sheep!" },
  { name: "Big Bad Wool:", message: "BAA! I am the Big Bad Wool and I\'m hungry!" },
  { name: "Twee:", message: "What great big teeth you\'ve got!" },
  { name: "Big Bad Wool:", message: "All the better to eat croissants with!" },
  { name: "Redhood:", message: "No chance, Woolly! They'\re for the princess." },
  { name: "Redhood:", message: "Now I will climb up Grumpunzel\'s long hair." },
  { name: "Grumpunzel:", message: "Oi! What do you think you\'re doing?" },
  { name: "Redhood:", message: "Princess! I\'ve brought you some croissants!" },
  { name: "Grumpunzel:", message: "Croissants? I asked for COOKIES!" },
  { name: "Redhood:", message: "Guess they don\'t call her Grumpunzel for nothing." },
  { name: "Twee:", message: "And they all lived happily ever after." },
  { note: "Underwater Adventure" },
  { name: "Lobster:", message: "Why didn\'t the squid\'s computer work?" },
  { name: "Wise Fish:", message: "Wait, I know this. I am very wise, after all" },
  { name: "Wise Fish:", message: "Was it too much seawater in the keyboard?" },
  { name: "Lobster:", message: "No, it\'s because he had TENTACLE difficulties!" },
  { name: "Wise Fish:", message: "PLANKTON!!! Ask me another, I\'ll get it for sure!" },
  { name: "Bubbles:", message: "Okay, what fish only swims at night?" },
  { name: "Wise Fish:", message: "It is, of course, a fish that cannot sleep!" },
  { name: "Bubbles:", message: "Nope, sorry, Wise Fish. It\'s a STARfish!" },
  { name: "Wise Fish:", message: "PLANKTON!!!" },
  { name: "Flippers:", message: "LOL! No need to yell. Okay, my turn!" },
  { name: "Flippers:", message: "What lies under the ocean and shivers?" },
  { name: "Wise Fish:", message: "Is it me after missing all these punchlines?" },
  { name: "Flippers:", message: "Close! It\'s a nervous wreck!" },
  { name: "Wise Fish:", message: "Hey, that\'s pretty good." },
  { name: "Flippers:", message: "Thanks! I also do birthday parties!" },
  { note: "Ruby and the Ruby" },
  { name: "Ruby:", message: "You\'ve got to help me!" },
  { name: "Hammer:", message: "What\'s the problem, madam?" },
  { name: "Ruby:", message: "Someone has stolen my gemstone!" },
  { name: "Ruby:", message: "There was this fishy-looking guy outside." },
  { name: "Hammer:", message: "And you suspect him?" },
  { name: "Ruby:", message: "Haven\'t you found it yet? I\'m busy." },
  { name: "Hammer:", message: "Here\'s your gem, Ms. Ruby. It was safe all along." },
  { name: "Ruby:", message: "Oh, jolly well done, Hammer." },
  { name: "Hammer:", message: "Another day, another crime solved." },
  { note: "Squidzoid vs. Shadow Guy & Gamma Gal" },
  { name: "Squidzoid:", message: "GRAWL! I HUNGRY!" },
  { name: "Shadow Guy:", message: "Freeze Squidward! Drop that shop!" },
  { name: "Squidzoid:", message: "BLARRG! YOU can\'t STOP ME!" },
  { name: "Gamma Gal:", message: "Oh yeah? Take this! PLASMA GLOW WAVE!" },
  { name: "Squidzoid:", message: "RROOOOAAAARR!" },
  { name: "Shadow Guy:", message: "Quick! With our powers combined!" },
  { name: "Squidzoid:", message: "NO! THIS IS IMPOSSIBLE! GRRAAA!" },
  { name: "Squidzoid:", message: "Hey, I\'m a penguin again. What happened?" },
  { name: "Gamma Gal:", message: "You turned into Squidzoid!" },
  { name: "Shadow Guy:", message: "And started eating the city!" },
  { name: "Squidzoid:", message: "Oh! I had a monster appetite!" },
  { name: "Gamma Gal:", message: "Looks like our work here is done!" },
  { name: "Squidzoid:", message: "Let\'s go get a fish pizza." },
  { note: "Quest for the Golden Puffle" },
  { name: "King Ra-Ra:", message: "Halt! Who dares enter the great pyramid!" },
  { name: "Alaska:", message: "Quick, Yukon! Grab the Golden Puffle!" },
  { name: "Yukon:", message: "Got it! Let\'s get out of here!" },
  { name: "King Ra-Ra:", message: "Don\'t let them take it, Boris!" },
  { name: "Boris:", message: "TUMMMMMY!" },
  { name: "Alaska:", message: "We\'ve gotta get out of here...fast!" },
  { name: "Yukon:", message: "Wait! I think I know how to stop all of this!" },
  { note: "(Yukon gives Boris the Golden Puffle)" },
  { name: "Boris:", message: "TUM MEEEEE!" },
  { name: "Alaska:", message: "What are you doing, Yukon?! That\'s my treasure!" },
  { note: "(Boris unwraps the Golden Puffle)" },
  { name: "Yukon:", message: "It\'s a puffle-shaped chocolate in gold wrapper!" },
  { name: "King Ra-Ra:", message: "That\'s right! And Boris was really hungry!" },
  { name: "Boris:", message: "YUMMMMMMMY!" },
  { note: "DIRECTOR" },
  { name: "Director:", message: "Places please!" },
  { name: "Director:", message: "And... action!" },
  { name: "Director:", message: "Let\'s try that take again" },
  { name: "Director:", message: "Fantastic acting. Well done!" }
]