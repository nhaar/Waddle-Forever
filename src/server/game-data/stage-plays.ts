import { Update } from "./updates";
import { Version } from "../routes/versions";
import { RoomChanges } from "./parties";
import { StageScript } from "../timelines/crumbs";
import { RoomName } from "./rooms";

/** All stage names */
type StageName = 'Space Adventure' |
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
  'A Humbug Holiday';

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
  }
];

/** Timeline of stage play debuts */
export const STAGE_TIMELINE: Array<{
  date: Version;
  name: StageName,
  stageFileRef: string | null;
  costumeTrunkFileRef: string | null;
  plazaFileRef: string | null;
  /** Temporary changes of rooms other than the plaza and stage */
  roomChanges?: RoomChanges;
  /** Rooms beside stage that play the play's track */
  musicRooms?: RoomName[];
  /** If a stage's premiere is not in the timeline, add this as true to the first appearance in the timeline */
  notPremiere?: true;
  /** Stage shouldn't be on timeline: used for highly defective stage plays that are placeholders */
  hide?: true;
  script?: StageScript;
}> = [
  {
    date: Update.FIRST_STAGE_PLAY,
    name: 'Space Adventure',
    plazaFileRef: 'archives:ArtworkRoomsPlaza47.swf',
    // stage from March
    stageFileRef: 'archives:SpaceAdventure1Stage.swf',
    costumeTrunkFileRef: 'archives:SpaceAdventurePlanetXCostumeTrunk.swf',
    script: [
      {
        "note": "Space Adventure"
      },
      {
        "name": "Captain:",
        "message": "Calculate coordinates!"
      },
      {
        "name": "Robot:",
        "message": "TWEE-BEEEP ... CALCULATING COORDINATES."
      },
      {
        "name": "Ensign:",
        "message": "Now landing on planet X."
      },
      {
        "name": "Robot:",
        "message": "SHIP BADLY DAMAGED... NEED REPAIRS."
      },
      {
        "name": "Captain:",
        "message": "The planet appears to be made of metal!"
      },
      {
        "name": "Ensign:",
        "message": "Captain, I am picking up an alien signal!"
      },
      {
        "name": "Robot:",
        "message": "BEEEP! I AM ROBOT! ALIEN APPROACHING!"
      },
      {
        "name": "Alien:",
        "message": "Take me to your bird-feeder!"
      },
      {
        "name": "Ensign:",
        "message": "I forgot my line! Line, please!"
      },
      {
        "name": "Captain:",
        "message": "Dear aliens, we come in peace!"
      },
      {
        "name": "Alien:",
        "message": "I am hungry! I wish I had some pizza!"
      },
      {
        "name": "Ensign:",
        "message": "You should join us, alien... We would love to have you at Club Penguin!"
      },
      {
        "name": "Alien:",
        "message": "Yes, earthlings! Let us unite as friends!"
      },
      {
        "name": "Captain:",
        "message": "Then we shall use the metal to fix the ship!"
      },
      {
        "name": "Robot:",
        "message": "BEEEEEEP! I, ROBOT, HAVEFIXED SHIP!"
      },
      {
        "name": "Alien:",
        "message": "Let us voyage together as a team!"
      },
      {
        "name": "Captain:",
        "message":"Engage the carp drive... Let\'s get back to Club Penguin with our new friend!"
      },
      {
        "name": "Robot:",
        "message": "BLABEEEEEP... HOORAY FOR CLUB PENGUIN!"
      },
      {
        "name": "Captain:",
        "message": "Blast off!"
      }
    ]
  },
  {
    date: '2007-12-14',
    name: 'The Twelfth Fish',
    plazaFileRef: 'recreation:plaza_tweltfh_fish.swf',
    stageFileRef: 'archives:RoomsStage-Christmas2007.swf',
    // costume trunk from may
    costumeTrunkFileRef: 'archives:May2008Costume.swf',
    script: [
      {
        "note": "The Twelfth Fish"
      },
      {
        "name": "Countess:",
        "message":"The iceberg\'s a stage and we are penguins!"
      },
      {
        "name": "Jester:",
        "message": "A stage where every penguin plays a part."
      },
      {
        "name": "Bard:",
        "message": "Fair maiden, shall we go and catch some fish?"
      },
      {
        "name": "Jester:",
        "message": "To fish or not to fish, that is the question!"
      },
      {
        "name": "Countess:",
        "message": "Good plan! Fishing is such a sweet comfort."
      },
      {
        "name": "Bard:",
        "message": "Now is the winter of our fishing trip."
      },
      {
        "name": "Jester:",
        "message": "As good luck would have it!"
      },
      {
        "name": "Bard:",
        "message":"The first thing we do, let\'s catch all the fish."
      },
      {
        "name": "Fish:",
        "message": "BLUB BLUB!"
      },
      {
        "name": "Jester:",
        "message": "O fishing line, fishing line! Wherefore art thou doing fine?"
      },
      {
        "name": "Fish:",
        "message": "BLUBBETH!"
      },
      {
        "name": "Countess:",
        "message": "What fish through yonder ocean swim?"
      },
      {
        "name": "Fish:",
        "message": "DOUBLE, DOUBLE BLUB AND BUBBLE!"
      },
      {
        "name": "Bard:",
        "message": "But hark! What fish through yonder water peeks?"
      },
      {
        "name": "Jester:",
        "message": "A fish! A fish! My puffle for a fish!"
      },
      {
        "name": "Fish:",
        "message":"AY, THERE\'S THE BLUB!"
      },
      {
        "name": "Countess:",
        "message": "Something fishy this way comes."
      },
      {
        "name": "Jester:",
        "message": "With my empty tummy my eye doth feast."
      },
      {
        "name": "Bard:",
        "message": "Now please get me a dish fit for the fish!"
      },
      {
        "name": " Fish:",
        "message": "BUT NEVER DOUBT I BLUB!"
      },
      {
        "name": "Countess:",
        "message": "Get thee to a fishery!"
      },
      {
        "name": "Jester:",
        "message": "To dine, perchance to eat!"
      },
      {
        "name": "Bard:",
        "message": "If fish be the food of life, waddle on!"
      },
      {
        "note": "THE END"
      },
      {
        "note": "Improvisation"
      },
      {
        "name": "",
        "message": "For what is best, that best I wish in thee."
      },
      {
        "name": "",
        "message": "Fish, puffles, penguins, lend me your ears!"
      },
      {
        "name": "",
        "message": "We crew, we happy crew, we land of penguins."
      },
      {
        "name": "",
        "message": "Small things make penguins proud."
      }
    ]
  },
  // squidzoid in Jan 2008 is completely lost to time
  {
    date: '2008-02-08',
    name: 'Team Blue\'s Rally Debut',
    // lost
    plazaFileRef: null,
    stageFileRef: 'archives:RoomsStage-February2008.swf',
    costumeTrunkFileRef: 'archives:February2008Costume.swf',
    script: [
      {
        "note":"Team Blue\'s Rally Debut"
      },
      {
        "name": "Happy Judge:",
        "message": "Welcome everyone to the big Mascot Tryouts!"
      },
      {
        "name": "Grumpy Judge:",
        "message": "Each mascot has to get through US to win."
      },
      {
        "name": "Cheerleader:",
        "message":"Let\'s give \'em a big round of applause!"
      },
      {
        "name": "Audience:",
        "message": "Yeah! Go Team Blue!"
      },
      {
        "name": "Happy:",
        "message": "Give it up for PEPPPPPPPYYYYYYY!"
      },
      {
        "note": "(Peppy runs into gym, audience cheers)"
      },
      {
        "name": "Peppy:",
        "message": "ANY COOL BIRDS IN THE HOUSE TODAY? LEMME HEAR YA SAY BRRRRRRRRD!"
      },
      {
        "name": "Audience:",
        "message": "BRRRRRRRRD!"
      },
      {
        "name": "Peppy:",
        "message": "OH EE OH EE OH!"
      },
      {
        "name": "Audience:",
        "message": "ICE! ICE! ICE!"
      },
      {
        "note": "(Tate runs into gym)"
      },
      {
        "name": "Tate:",
        "message": "Did somebody say ICE?!..."
      },
      {
        "note": "(Tate trips and falls)"
      },
      {
        "name": "Tate:",
        "message": "Oops! Didn\'t see those bleachers there..."
      },
      {
        "name": "Cheerleader:",
        "message": "Everyone give it up for Tate! GO BLUE!"
      },
      {
        "note": "(Tate trips and falls again, runs out of gym)"
      },
      {
        "name": "Grumpy Judge:",
        "message": "Man, this competition is soooo lame."
      },
      {
        "name": "Zeus:",
        "message": "Oh man! I don\'t want to go out there!"
      },
      {
        "name": "Tate:",
        "message": "C\'mon, you should go. You\'ll do better than me."
      },
      {
        "name": "Zeus:",
        "message": "But I don\'t even have a cool entrance!"
      },
      {
        "note": "(Peppy enters the hallway to see what\'s happening)"
      },
      {
        "name": "Peppy:",
        "message": "HEY! TURN THOSEFROWNS UPSIDE-DOWN! DON\'T LEAVE ME TO BE THE CLOWN!"
      },
      {
        "name": "Zeus:",
        "message": "But Peppy... I don\'t want to look dumb!"
      },
      {
        "name": "Grumpy:",
        "message": "Excuse me, but can we get on with the show?"
      },
      {
        "name": "Tate:",
        "message": "You couldn\'t do any worse than me, Zeus!"
      },
      {
        "name": "Audience:",
        "message": "WE WANT ZEUS! WE WANT ZEUS!"
      },
      {
        "name": "Tate:",
        "message": "See, Zeus! They want to see your cool outfit!"
      },
      {
        "name": "Peppy:",
        "message": "YEAH ZEUS, GIVE EM THE SCHOOL SPIRIT!"
      },
      {
        "name": "Zeus:",
        "message": "I just don\'t want to be alone out there."
      },
      {
        "name": "Peppy:",
        "message": "WELL WHY DIDN\'T YOU SAY SO!"
      },
      {
        "name": "Zeus:",
        "message": "What do you mean?"
      },
      {
        "name": "Peppy:",
        "message": "LET\'S GO TOGETHER! AS A TEAM!"
      },
      {
        "name": "Tate:",
        "message": "Yeah! We can be The Blue Crew!"
      },
      {
        "name": "Zeus:",
        "message": "Okay...maybe that would work... Let\'s try it!"
      },
      {
        "note": "(The three mascots enter gym)"
      },
      {
        "name": "Audience:",
        "message": "BLUE... TEAM... BACK AGAIN! TIME IS RIGHT SO LET\'S BEGIN!"
      },
      {
        "name": "Peppy:",
        "message": "STOP!... BLUE TIME!"
      },
      {
        "name": "Tate:",
        "message": "Make some noise for the Team Blue Crew!"
      },
      {
        "name": "Zeus:",
        "message": "Let me hear ya say MOOOOOOSE!"
      },
      {
        "name": "Audience:",
        "message": "MOOOOOOOSE!"
      },
      {
        "name": "Tate:",
        "message": "Let me hear ya say ICE!"
      },
      {
        "name": "Audience:",
        "message": "BERG!"
      },
      {
        "name": "Tate:",
        "message": "ICE!"
      },
      {
        "name": "Audience:",
        "message": "BERG!"
      },
      {
        "name": "Cheerleader:",
        "message": "Looks like the audience likes ALL OF THEM!"
      },
      {
        "name": "Grumpy:",
        "message": "Umm... can we choose none of them?"
      },
      {
        "name": "Happy:",
        "message": "Presenting the winner... the Team Blue Crew!"
      },
      {
        "name": "Grumpy:",
        "message": "Great... Can I go home now?"
      },
      {
        "note": "THE END"
      }
    ]
  },
  {
    date: '2008-03-14',
    name: 'Space Adventure',
    // plaza from 2007
    plazaFileRef: 'archives:ArtworkRoomsPlaza47.swf',
    stageFileRef: 'archives:SpaceAdventure1Stage.swf',
    // costume trunk from 2007
    costumeTrunkFileRef: 'archives:SpaceAdventurePlanetXCostumeTrunk.swf',
    script: [
      { note: "Space Adventure" },
      { name: "Captain:", message: "Captain\'s journal, entry number 11-16..." },
      { name: "Captain:", message: "We\'re flying toward Planet X to find alien life." },
      { name: "Ensign:", message: "Speed set to carp two, ready to land." },
      { name: "Robot:", message: "TWEEP! ERROR 500...ENGINE FAILING!" },
      { name: "Captain:", message: "Ensign, increase emergency power!" },
      { name: "Ensign", message: "Already used up all backup power, sir!" }, 
      { name: "Robot:", message: "GLEEEEEP! ENGINE HAS STOPPED...NO POWER LEFT!" },
      { name: "Captain:", message: "Prepare the survey team to investigate." },
      { name: "Ensign:", message: "Captain, receiving a signal off the port bow." },
      { name: "Captain:", message: "Tin Can 3000, what do you know about Planet X?" },
      { name: "Robot:", message: "ERROR 404! NO RECORDS FOUND!" },
      { note: "(Alien jumps out of alien spaceship)" },
      { name: "Alien:", message: "Halt! I am Zip, ruler of Planet X! Who are you?" },
      { name: "Captain:", message: "I am Captain Snow and this is my crew." },
      { name: "Ensign:", message: "We came from Club Penguin, but our ship broke." },
      { name: "Captain:", message: "Zip, we need your help to rebuild our engine." },
      { name: "Alien:", message: "I don\'t just fix any old ship that lands here." },
      { name: "Robot:", message: "CONNECTION...REFUSED BY HOST..." },
      { name: "Ensign:", message: "But without our spaceship we can\'t get home!" },
      { name: "Alien:", message: "Did you try clearing the ship computer\'s cache?" },
      { name: "Ensign:", message: "Wait! I didn\'t! Thanks for the help! I\'ll try it!" },
      { note: "(Ensign and Robot work on spaceship\'s computer)" },
      { name: "Robot:", message: "ENGINES OPERATIONAL...TWEEP!" },
      { name: "Captain:", message: "Thank you for your excellent help, Zip!" },
      { name: "Alien:", message: "Wait! Can I go with you?" },
      { name: "Robot:", message: "BLEEB! ERROR 407! REQUEST MORE DETAIL!" },
      { name: "Ensign:", message: "Why do you want to go to Club Penguin?" },
      { name: "Alien:", message: "My home isn\'t the same since the others left" },
      { name: "Ensign:", message: "Well, we\'d love to have you on Club Penguin!" },
      { name: "Captain:", message: "You have my permission to join us aboard, Zip." },
      { name: "Captain:", message: "Ensign, set a course for the Plaza. Carp Five!" },
      { name: "Ensign:", message: "Engines set for destination, Captain!" },
      { name: "Captain:", message: "Let\'s get back to Club Penguin with our new friend!" },
      { name: "All Cast:", message: "HOORAY FOR CLUB PENGUIN!" },
      { note: "THE END" }
    ]
  },
  // quest for golden puffle debut is lost, except its costume trunk
  // still won't add it though
  {
    date: '2008-05-09',
    name: 'The Twelfth Fish',
    // stage from 2007
    stageFileRef: 'archives:RoomsStage-Christmas2007.swf',
    plazaFileRef: null,
    costumeTrunkFileRef: 'archives:May2008Costume.swf'
  },
  {
    date: '2008-06-13',
    name: 'The Penguins that Time Forgot',
    plazaFileRef: null,
    stageFileRef: 'archives:RoomsStage-June2008.swf',
    costumeTrunkFileRef: 'archives:June08Costume.swf',
    script: [
      { note: "The Penguins that Time Forgot" },
      { name: "Chester:", message: "Time to try out this new Time Travel 1000!" },
      { note: "(Time machine opens)" },
      { name: "Critteroo:", message: "UGG! DINO! UGG!" },
      { name: "Chester:", message: "What is this place? Where am I?" },
      { name: "Kek:", message: "GRUB! GRUB! GRUB!" },
      { name: "Chester:", message: "I\'m in Grub? What\'s a Grub?" },
      { name: "Critteroo:", message: "LAVA! LAVA!" }, 
      { name: "Chester:", message: "Lava?! I\'ve gotta get out of here!" },
      { note: "(Time machine breaks)" },
      { name: "Chester:", message: "Great, now I\'m stuck in some place called Grub." },
      { name: "Tiki:", message: "TIKI UGG!" },
      { name: "Kek:", message: "GRRRRRRRUB!" },
      { name: "Chester:", message: "Now who\'s this with the big silly mask?" },
      { name: "Tiki:", message: "TIKI TIKI BOARD TIKI BOARD!" },
      { name: "Critteroo:", message: "TIKI! TIKI! ATOOK!" },
      { name: "Tiki:", message: "ABOOT! ABOOT!" },
      { name: "Kek:", message: "YUB NUB GRUB!" },
      { name: "Chester:", message: "Okay, really now. Can\'t you just use real words?" },
      { name: "Critteroo:", message: "GRUB! GRUB TIKI GRUB-GRUB!" },
      { name: "Chester:", message: "You do know you don\'t make any sense, right?" },
      { name: "Critteroo:", message: "LAVA NO TIKI GRUB!" },
      { name: "Chester:", message: "Sigh. Okay, something about lava and grubs." },
      { name: "Tiki:", message: "ABOOOOOOT" },
      { name: "Chester:", message: "You were wearing boots, but the grubs took them?" },
      { name: "Kek:", message: "LAVA NO LAVA! GRUB TIKI GRUB!" },
      { name: "Chester:", message: "Let me guess, your name is Tiki and you\'re Grub." },
      { name: "Tiki:", message: "ABOOT TIKI!" },
      { name: "Critteroo:", message: "TIKI GRUB-GRUB!" },
      { name: "Chester:", message: "I give up! I have no idea what you\'re saying." },
      { name: "Kek:", message: "DINO YUB NUB LAVAAA!" },
      { name: "Chester:", message: "Well, I may as well join in..." },
      { name: "Chester:", message: "GRUB GRUB!" },
      { name: "Tiki:", message: "TIKI BOARD BOARD!" },
      { name: "Kek:", message: "LAVA DINO GRUB!" },
      { name: "Chester:", message: "Last time I buy a time machine for 10 coins..." },
      { note: "THE END" }
    ]
  },
  {
    date: '2008-07-11',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    stageFileRef: null,
    costumeTrunkFileRef: null,
    hide: true,
    plazaFileRef: null,
    script: [
      { note: "Squidzoid vs Shadow Guy & Gamma Gal" },
      { name: "Reporter:", message: "Action news live! Tell us what\'s happening!" },
      { name: "Witness:", message: "I saw a monster eat the pet shop!" },
      { name: "Squidzoid:", message: "GRAWL! I HUNGRY!" },
      { name: "Witness:", message: "Who can save us now?" },
      { name: "Shadow Guy:", message: "The city needs our help!" },
      { name: "Gamma Gal:", message: "Super costume mega transform!" }, 
      { note: "(Heroes change into super suits)" },
      { name: "Witness:", message: "Look! The heroes have arrived!" },
      { name: "Reporter:", message: "Here they come to save the day!" },
      { name: "SG:", message: "Freeze Squidzoid! Drop that shop!" },
      { name: "GG:", message: "I think you\'ve had enough to eat!" },
      { name: "Squidzoid:", message: "BLARRG! YOU CAN\'T STOP ME!" },
      { name: "GG:", message: "Oh yeah? Take this! PLASMA GLOW WAVE!" },
      { name: "Squidzoid:", message: "RROOOOAAAARR!" },
      { name: "Reporter:", message: "The superheroes are using their powers!" },
      { name: "Witness:", message: "Hurray heroes! Nice going!" },
      { name: "Squidzoid:", message: "PUNY HEROES! YOU\'RE NO MATCH FOR ME!" },
      { name: "SG:", message: "Then try this on for size! SHADOW WAVE!" },
      { name: "Squidzoid:", message: "GLEEGRRAUWLL!" },
      { name: "Reporter:", message: "This just in! Squidzoid is trying to escape!" },
      { name: "Witness:", message: "After it! Don\'t let it get away!" },
      { name: "GG:", message: "Quick! With our powers combined!" },
      { name: "SG:", message: "For great justice!" },
      { name: "Squidzoid:", message: "NO! THIS IS IMPOSSIBLE! GRRAAA!" },
      { name: "Witness:", message: "It\'s turning into a penguin!" },
      { note: "(Squidzoid turns into a penguin.)" },
      { name: "Squidzoid:", message: "Hey, I\'m a penguin again. What happened?" },
      { name: "Reporter:", message: "You turned into Squidzoid!" },
      { name: "Witness:", message: "And started eating the city!" },
      { name: "Squidzoid:", message: "Oh! I had a monster appetite!" },
      { name: "SG:", message: "With great power comes great hunger." },
      { name: "GG:", message: "Looks like our work here is done!" },
      { name: "Squidzoid:", message: "Let\'s go get a fish pizza." },
      { name: "Reporter:", message: "The city is saved! This reporter is signing off." },
      { note: "THE END" }
    ]
  },
  {
    date: '2008-08-08',
    name: 'Team Blue\'s Rally 2',
    // placeholder file using team blue vs team red, which is nearly identical
    stageFileRef: 'archives:Stage2011Aug17.swf',
    plazaFileRef: 'recreation:plaza_team_blues_rally_2.swf',
    costumeTrunkFileRef: 'archives:August2008Costume.swf',
    script: [
      {
        "note": "Team Blue\'s Rally 2"
      },
      {
        "note": "(Zeus on stage alone)"
      },
      {
        "name": "Zeus:",
        "message": "Oh no, it\'s time for the big game already!"
      },
      {
        "name": "Zeus:",
        "message": "I can\'t believe I have to do this by myself."
      },
      {
        "note": "(Jupiter & Bella enter)"
      },
      {
        "name": "Bella:",
        "message": "Hiya! I\'ll be the cheerleader for this match."
      },
      {
        "name": "Bella:",
        "message": "Wait until you hear my cool cheers!"
      },
      {
        "name": "Jupiter:",
        "message": "Ready for the big game there. Zeussy?"
      },
      {
        "name": "Zeus:",
        "message": "Um.... yes I am... err... who are you?"
      },
      {
        "name": "Jupiter:",
        "message": "The name\'s Jupiter."
      },
      {
        "name": "Zeus:",
        "message": "I guess you\'re here to help cheer on Team Blue?"
      },
      {
        "name": "Jupiter:",
        "message": "No way! I\'m here to make sure Red wins!"
      },
      {
        "name": "Bella:",
        "message": "RED IS GOOD! RED\'S THE BEST!"
      },
      {
        "name": "Bella:",
        "message": "BETTER THAN A YELLOW VEST! GOOOO RED!"
      },
      {
        "name": "Zeus:",
        "message": "But um.... I\'m supposed to be the moose mascot!"
      },
      {
        "name": "Zeus:",
        "message": "I thought Team Red\'s mascot was an alien!"
      },
      {
        "name": "Jupiter:",
        "message": "Antenna was LAST year\'s mascot!"
      },
      {
        "name": "Bella:",
        "message": "LAST YEAR\'S OUT! THIS YEAR\'S IN!"
      },
      {
        "name": "Bella:",
        "message": "See how my cheer was? Not too shabby, eh?"
      },
      {
        "note": "(Jeff the referee and both teams enter)"
      },
      {
        "name": "Jeff:",
        "message": "All right, everyone ready for some dodgeball?"
      },
      {
        "name": "Jupiter:",
        "message": "Never been more ready, Jeff!"
      },
      {
        "name": "Jupiter:",
        "message": "EVERYONE LEMME HEAR YA SAY MOOOSE!"
      },
      {
        "name": "Team Red:",
        "message": "MOOOSE!"
      },
      {
        "name": "Zeus:",
        "message": "Wait um.... hey.... that\'s MY line!"
      },
      {
        "name": "Jupiter:",
        "message": "No I\'m pretty sure it\'s MINE there, Zeussy!"
      },
      {
        "name": "Jeff:",
        "message": "Whoa, whoa, whoa! Time out!"
      },
      {
        "name": "Jeff:",
        "message": "Be a good sport! Cheers are for everyone!"
      },
      {
        "name": "Bella:",
        "message": "Yeah right, that\'s what he says."
      },
      {
        "note": "(Scoreboard breaks)"
      },
      {
        "name": "Jeff:",
        "message": "Oh great, now the scoreboard\'s broken!"
      },
      {
        "name": "Bella:",
        "message": "OOPS OOPS GOES THE CLOCK!"
      },
      {
        "name": "Bella:",
        "message": "USED TO TICK BUT NOW IT TOCKS!"
      },
      {
        "name": "Bella:",
        "message": "Ha! you didn\'t catch that one, did ya?"
      },
      {
        "name": "Zeus:",
        "message": "Maybe we could just play for fun instead?"
      },
      {
        "name": "Jupiter:",
        "message": "No way! You want this trophy back?"
      },
      {
        "name": "Jupiter:",
        "message": "You\'ll have to earn it!"
      },
      {
        "name": "Jupiter:",
        "message": "This is TEAM RED\'S time to shine!"
      },
      {
        "name": "Bella:",
        "message": "HE\'S GONNA SHINE THE CLOCK!"
      },
      {
        "name": "Jupiter:",
        "message": "Not THAT kind of shine, Bella."
      },
      {
        "name": "Bella:",
        "message": "Oh. I thought you were gonna fix the scoreboard."
      },
      {
        "name": "Zeus:",
        "message": "You know what?! I\'ve had enough of this!"
      },
      {
        "name": "Zeus:",
        "message": "YOU\'RE NOT THE ONLY MOOSE IN TOWN!"
      },
      {
        "name": "Zeus:",
        "message": "I\'m gonna show you who the original moose is!"
      },
      {
        "name": "Zeus:",
        "message": "I\'m gonna encourage my team to go on!"
      },
      {
        "name": "Zeus:",
        "message": "ARE YOU READY BLUE TEAM?!"
      },
      {
        "name": "Team Blue:",
        "message": "Yeah!"
      },
      {
        "name": "Zeus:",
        "message": "LEMME HEAR YA SAY MOOOOSE!"
      },
      {
        "name": "Team Blue:",
        "message": "MOOOOSE!"
      },
      {
        "name": "Zeus:",
        "message": "Now let\'s bring this trophy BACK HOME!"
      },
      {
        "name": "Bella:",
        "message": "LET\'S HEAR IT FOR TEAM BLUE!"
      },
      {
        "name": "Team Blue:",
        "message": "GO TEAM BLUE!"
      },
      {
        "name": "Jupiter:",
        "message": "We\'ll see who this trophy belongs to..."
      },
      {
        "name": "Jeff:",
        "message": "Game on!"
      },
      {
        "note": "(Whistle blows and the game begins while Bella and other cheerleaders start doing team cheers)"
      },
      {
        "note": "THE END"
      }
    ]
  },
  {
    date: Update.RUBY_DEBUT,
    name: 'Ruby and the Ruby',
    stageFileRef: 'recreation:ruby_play_debut.swf',
    plazaFileRef: 'recreation:plaza_ruby_no_weather.swf',
    // this might be inaccurate
    costumeTrunkFileRef: 'archives:July09Costume.swf',
    script: [
      {
        "note": "Ruby and the Ruby"
      },
      {
        "note": "Scene 1"
      },
      {
        "name": "Hammer:",
        "message": "I was working late. A terrible storm was raging."
      },
      {
        "name": "Ruby:",
        "message": "You\'ve got to help me!"
      },
      {
        "name": "Hammer:",
        "message": "What\'s the problem, madam?"
      },
      {
        "name": "Ruby:",
        "message": "Someone has stolen my gemstone!"
      },
      {
        "name": "Hammer:",
        "message": "Jacque Hammer at your service."
      },
      {
        "name": "Ruby:",
        "message": "Let\'s work together."
      },
      {
        "name": "Hammer:",
        "message": "I work alone, Ms. Ruby."
      },
      {
        "name": "Ruby:",
        "message": "There was this fishy-looking guy outside."
      },
      {
        "name": "Hammer:",
        "message": "And you suspect him?"
      },
      {
        "name": "Ruby:",
        "message": "I saw him throw something in the bin..."
      },
      {
        "note": "Scene 2"
      },
      {
        "name": "Hammer:",
        "message": "The name\'s Hammer - Jacque Hammer."
      },
      {
        "name": "Hammer:",
        "message": "I\'ve got a few questions for you."
      },
      {
        "name": "Tenor:",
        "message": "Mind if I play hopscotch while you ask them?"
      },
      {
        "name": "Hammer:",
        "message": "What were you doing yesterday?"
      },
      {
        "name": "Tenor:",
        "message": "I was right here with my hopscotch gang."
      },
      {
        "name": "Hammer:",
        "message": "I bet you\'ve hopscotched away a few gems, right?"
      },
      {
        "name": "Tenor:",
        "message": "You\'re barking up the wrong tree, Hammer."
      },
      {
        "note": "Scene 3"
      },
      {
        "name": "Hammer:",
        "message": "There was nothing in the bin. I needed clues."
      },
      {
        "name": "Dom:",
        "message": "Hello Mr. Hammer. It\'s good to see you, sir."
      },
      {
        "name": "Hammer:",
        "message": "Seen anything suspicious, Dom?"
      },
      {
        "name": "Dom:",
        "message": "Sorry, Mr. Hammer, sir, I haven\'t."
      },
      {
        "name": "Hammer:",
        "message": "Where\'s Ms. Ruby?"
      },
      {
        "name": "Dom:",
        "message": "She\'s arranging the flowers across the hall, sir."
      },
      {
        "name": "Hammer:",
        "message": "That lady\'s trouble. I need to speak to her..."
      },
      {
        "name": "Dom:",
        "message": "Don\'t forget to sign the guestbook, sir."
      },
      {
        "note": "Scene 4"
      },
      {
        "name": "Hammer:",
        "message": "Anything else you can tell me, madam?"
      },
      {
        "name": "Ruby:",
        "message": "Haven\'t you found it yet? I\'m busy."
      },
      {
        "note": "(Ruby exits)"
      },
      {
        "name": "Hammer:",
        "message": "I found a note under a vase."
      },
      {
        "name": "Hammer:",
        "message": "The numbers looked like a combination."
      },
      {
        "note": "Scene 5"
      },
      {
        "name": "Hammer:",
        "message": "Here\'s your gem, Ms. Ruby. It was safe all along."
      },
      {
        "name": "Ruby:",
        "message": "Oh, jolly well done, Hammer."
      },
      {
        "name": "Hammer:",
        "message": "Another day, another crime solved."
      },
      {
        "note": "Fin."
      },
      {
        "note": "Director:"
      },
      {
        "name": "Director:",
        "message": "Scene 1. And, action!"
      },
      {
        "name": "Director:",
        "message": "Scene 2, from the top!"
      },
      {
        "name": "Director:",
        "message": "Scene 3, places please."
      },
      {
        "name": "Director:",
        "message": "Scene 4. Let\'s see some effort here."
      },
      {
        "name": "Director:",
        "message": "Ready for Scene 5?"
      },
      {
        "name": "Director:",
        "message": "Let\'s take it from the top."
      },
      {
        "name": "Director:",
        "message": "Can we have some quiet please?"
      },
      {
        "name": "Director:",
        "message": "Two minute call, actors and actresses to the stage."
      }
    ]
  },
  {
    date: '2008-10-10',
    name: 'Space Adventure Planet Y',
    // from 2010
    stageFileRef: 'archives:RoomsStage-November2010.swf',
    // from 2010
    plazaFileRef: 'archives:RoomsPlaza-Play9.swf',
    costumeTrunkFileRef: 'archives:October2008Costume.swf',
    script: [
      {
        "note": "Planet Y"
      },
      {
        "name": "Captain:",
        "message": "Captain\'s journal, entry 30:16..."
      },
      {
        "name": "Captain:",
        "message": "The SS Astro Barrier returns to Club Penguin..."
      },
      {
        "name": "Ensign:",
        "message": "Speed set to carp five."
      },
      {
        "name": "Zip:",
        "message": "Wait! Watch out for the-"
      },
      {
        "note": "(Asteroid hits the SS Astro Barrier)"
      },
      {
        "name": "Robot:",
        "message": "TWEEE-BEEP! ERROR 6000! DIRECT HIT!"
      },
      {
        "name": "Zip:",
        "message": "...asteroid!"
      },
      {
        "name": "Ensign:",
        "message": "Captain, it\'s thrown us off course!"
      },
      {
        "name": "Captain:",
        "message": "Engage the carp drive. Full reverse!"
      },
      {
        "name": "Robot:",
        "message": "BEEP BEEP! CARP DRIVE FAILURE."
      },
      {
        "name": "Ensign:",
        "message": "Negative Captain. It\'s not working."
      },
      {
        "name": "Zip:",
        "message": "Have you tried clearing the cache?"
      },
      {
        "name": "Ensign:",
        "message": "I\'ve tried, but it won\'t reload!"
      },
      {
        "name": "Captain:",
        "message": "Emergency Crash landing-that planet will do."
      },
      {
        "name": "Robot:",
        "message": "GLEEEEEEP! OVERHEATING!"
      },
      {
        "name": "Zip:",
        "message": "No, not Planet Y! My rivals the Qs live here!"
      },
      {
        "note": "(Ship crashes into building)"
      },
      {
        "name": "Qua:",
        "message": "Visitors, you\'ve disturbed our meeting..."
      },
      {
        "name": "Quip:",
        "message": "So you have our old robot, Tin Can. Greetings."
      },
      {
        "name": "Qua:",
        "message": "We\'re planning to make a giant space craft."
      },
      {
        "name": "Quip:",
        "message": "Tin Can 3000, help us get ship parts. Now!"
      },
      {
        "name": "Robot:",
        "message": "NEW ORDER RECEIVED. REPROGRAMMING."
      },
      {
        "name": "Zip:",
        "message": "Wait! Remember space directive 402?"
      },
      {
        "name": "Captain:",
        "message": "The bot exchange agreement! Quick thinking, Zip!"
      },
      {
        "name": "Quip:",
        "message": "They own the bot. He can\'t destroy the craft..."
      },
      {
        "name": "Qua:",
        "message": "Let\'s do it ourselves-we\'ll be fast!"
      },
      {
        "name": "Zip:",
        "message": "Restart the bot, and let\'s get out of here."
      },
      {
        "name": "Robot:",
        "message": "REBOOTING. REBOOTING. REBOOTING."
      },
      {
        "name": "Robot:",
        "message": "GLEEEP! ENGINE TERMINATED. JET FUEL LOW!"
      },
      {
        "name": "Ensign:",
        "message": "No! How are we going to get back this time?"
      },
      {
        "name": "Robot:",
        "message": "ZWEEEP! ABORT, RETRY, FAIL?"
      },
      {
        "name": "Captain:",
        "message": "Retry. Tin Can, use ice cream for fuel."
      },
      {
        "name": "Zip:",
        "message": "It\'s working! Let\'s get out of here."
      },
      {
        "name": "Captain:",
        "message": "Set a course for the Iceberg. Carp 5. Engage!"
      },
      {
        "name": "Quip:",
        "message": "We shall meet again, Captain Snow..."
      },
      {
        "note": "THE END"
      },
      {
        "note": "Director"
      },
      {
        "name": "Director:",
        "message": "Places please!"
      },
      {
        "name": "Director:",
        "message": "5 minute call, actors to the stage."
      },
      {
        "name": "Director:",
        "message": "Let\'s take it from the top!"
      },
      {
        "name": "Director:",
        "message": "It\'s a wrap!"
      }
    ]
  },
  {
    date: '2008-11-21',
    name: 'Fairy Fables',
    // from 2009
    stageFileRef: 'archives:RoomsStage-June2009.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play10.swf',
    // from 2010
    costumeTrunkFileRef: 'archives:Jan10Stage.swf',
    script: [
      { note: "Fairy Fables" },
      { name: "Twee:",message: "Once upon a time a prince dressed all in red..." },
      { name: "Redhood:",message:"Red?! Are you sure? It\'s not really my color." },
      { name: "Twee:",message:"Don\'t interrupt! I said he was dressed in RED!" },
      { name: "Redhood:",message: "Oh. All right, then. What a lovely day!" },
      { name: "Twee:",message: "He was taking croissants to a hungry princess." },
      { name: "Redhood:",message: "Golly, I hope she like pastries." },
      { name: "Twee:",message: "But suddenly, something jumped out of the trees!" },
      { name: "Redhood:",message: "Oh no! A scary looking sheep!" },
      { name: "Big Bad Wool:",message:"BAA! I am the Big Bad Wool and I\'m hungry!" },
      { name: "Redhood:",message:"What great big teeth you\'ve got!" },
      { name: "Big Bad Wool:",message: "All the better to eat croissants with!" },
      { name: "Redhood:",message:"No chance, Woolly! They\'re for the princess." },
      { name: "Big Bad Wool:",message:"BAA! Then I\'ll huff and I\'ll puff..." },
      { name: "Twee:",message: "And the Big Bad Wool blew all the trees down." },
      { name: "Redhood:",message: "Oh no! What am I going to do?" },
      { name: "Twee:",message: "You need to distract the sheep, of course!" },
      { name: "Redhood:",message: "Oh yes. Look over there!" },
      { name: "Big Bad Wool:",message: "A unicorn flying through the sky? BAA-zaa!" },
      { name: "Redhood:",message: "Aha, now I can escape!" },
      { name: "Twee:",message: "Finally the prince arrived at the castle." },
      { name: "Redhood:",message:"Now I will climb up Grumpunzel\'s long hair." },
      { name: "Twee:",message:"You\'ll have to make do with a ladder." },
      { name: "Redhood:",message: "If I must..." },
      { name: "Grumpunzel:",message: "La la la la..." },
      { name: "Redhood:",message:"She\'s totally lost in la-la-land. What do I do now?" },
      { name: "Twee:",message: "Throw a magic snowball at her, of course!" },
      { note: "(Redhood throws a snowball at Grumpunzel)" },
      { name: "Grumpunzel:",message:"Oi! What do you think you\'re doing?" },
      { name: "Redhood:",message:"Princess! I\'ve brought you some croissants!" },
      { name: "Grumpunzel:",message: "Croissants? I asked for COOKIES!" },
      { name: "Redhood:",message:"Guess they don\'t call her Grumpunzel for nothing" },
      { name: "Twee:",message: "I think she should go back to la-la-land. ZAP!" },
      { name: "Big Bad Wool:",message:"BAA! Excuse me! I\'m really hungry here!" },
      { name: "Twee:",message:"Well there are plenty of croissants to go \'round." },
      { name: "Redhood:",message:"You\'d better not wool them all down at once." },
      { name: "Twee:",message: "And they lived happily ever after." },
      { note: "THE END." },
      { note: "Twee Gives A Tour Of The Stage" },
      { name: "Twee:",message: "Welcome to my Tree of Twos!" },
      { name: "Twee:",message: "Let me show you around a bit." },
      { name: "Twee:",message: "I love my books. I have two of every one." },
      { name: "Twee:",message: "See my boombox? It has two speakers!" },
      { name: "Twee:",message: "I wanted two unicorns, but I ran out of glue." },
      { name: "Twee:",message: "I tried to have two princes in this play, too." },
      { name: "Twee:",message: "This is my chair, made of two types of wood!" },
      { name: "Twee:",message: "And the pond took me two days to make!" },
      { name: "Twee:",message: "Hope you liked the tour. Enjoy the play!" }
    ]
  },
  {
    date: '2008-12-12',
    name: 'Quest for the Golden Puffle',
    // from 2010
    stageFileRef: 'archives:RoomsStage-May2010.swf',
    plazaFileRef: 'recreation:plaza_golden_puffle_no_weather.swf',
    costumeTrunkFileRef: 'archives:December2008Costume.swf',
    notPremiere: true,
    script: [
      {
        "note": "Quest for the Golden Puffle"
      },
      {
        "name": "Yukon:",
        "message": "We have to be careful in this pyramid, Alaska!"
      },
      {
        "name": "Alaska:",
        "message": "Can\'t find rare puffles without a little danger..."
      },
      {
        "name": "Alaska:",
        "message": "Hey look, a switch! Wonder what it does..."
      },
      {
        "name": "Yukon:",
        "message": "Oh no! Run! It\'s a snowball trap!"
      },
      {
        "name": "Alaska:",
        "message": "What\'s an adventure without a few traps?"
      },
      {
        "name": "Yukon:",
        "message": "That was close! Told you we should be careful!"
      },
      {
        "name": "Alaska:",
        "message": "Careful is my middle name."
      },
      {
        "name": "Yukon:",
        "message": "Look! The Golden Puffle! Let\'s get it!"
      },
      {
        "name": "Alaska:",
        "message": "I\'ve been waiting a long, long time for this..."
      },
      {
        "note": "(Door opens and Boris appears)"
      },
      {
        "name": "Boris:",
        "message": "TUMMMMMMY!"
      },
      {
        "name": "King Ra-Ra:",
        "message": "Halt! Who dares to enter the great pyramid!"
      },
      {
        "name": "Alaska:",
        "message": "Quick, Yukon! Grab the Golden Puffle!"
      },
      {
        "name": "Yukon:",
        "message": "Got it! Let\'s get out of here!"
      },
      {
        "name": "Boris:",
        "message": "TUMMMMMY!"
      },
      {
        "name": "King Ra-Ra:",
        "message": "Don\'t let them take it, Boris!"
      },
      {
        "name": "Alaska:",
        "message": "We\'ve gotta get out of here... fast!"
      },
      {
        "name": "Yukon:",
        "message": "Oh no! We\'re trapped in the pyramid!"
      },
      {
        "name": "Alaska:",
        "message": "You can say that again."
      },
      {
        "name": "Yukon:",
        "message": "Oh no! We\'re trapped in the pyramid!"
      },
      {
        "name": "Boris:",
        "message": "TUMMMMMY!"
      },
      {
        "name": "King Ra-Ra:",
        "message": "You can\'t escape the great pyramid!"
      },
      {
        "name": "King Ra-Ra:",
        "message": "Now give us the Golden Puffle!"
      },
      {
        "name": "Alaska:",
        "message": "I don\'t give up my quests that easy, Ra-Ra!"
      },
      {
        "name": "Boris:",
        "message": "TUMMMMMY!"
      },
      {
        "name": "Yukon:",
        "message": "Wait! I think I know how to stop all of this!"
      },
      {
        "note": "(Yukon gives Boris the Golden Puffle)"
      },
      {
        "name": "Boris:",
        "message": "TUM MEEEEE!"
      },
      {
        "name": "Alaska:",
        "message": "What are you doing Yukon?! That\'s my treasure!"
      },
      {
        "note": "(Boris unwraps the Golden puffle)"
      },
      {
        "name": "Yukon:",
        "message": "It\'s a puffle-shaped chocolate in gold wrapper!"
      },
      {
        "name": "King Ra-Ra:",
        "message": "That\'s right! And Boris was really hungry!"
      },
      {
        "name": "Boris:",
        "message": "YUMMMMMMY!"
      },
      {
        "name": "King Ra-Ra:",
        "message": "That\'s why we had to get it back!"
      },
      {
        "name": "Alaska:",
        "message": "Sigh. Guess it\'s not the rare puffle I thought."
      },
      {
        "name": "King Ra-Ra:",
        "message": "Oh, but it is rare!"
      },
      {
        "name": "King Ra-Ra:",
        "message": "It is made of the island\'s rarest dark chocolate!"
      },
      {
        "name": "Yukon:",
        "message": "These weren\'t the puffles we were looking for."
      },
      {
        "name": "Alaska:",
        "message": "Do not fear, Yukon! New adventures await!"
      },
      {
        "name": "King Ra-Ra:",
        "message": "Hmmm...where did I put that snowball of mine?"
      },
      {
        "name": "Alaska:",
        "message": "Onwards to victory and the rarest puffles!"
      },
      {
        "name": "Boris:",
        "message": "THAT\'S A WRAP!"
      },
      {
        "note": "THE END"
      },
      {
        "note": "Director"
      },
      {
        "name": "Director:",
        "message": "Places everyone!"
      },
      {
        "name": "Director:",
        "message": "Take it again from the top!"
      },
      {
        "name": "Director:",
        "message": "Excellent work, team. Keep it up!"
      },
      {
        "name": "Director:",
        "message": "That\'s a wrap!"
      },
      {
        "name": "Director:",
        "message": "Take a bow everyone!"
      }
    ]
  },
  {
    date: '2009-01-09',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    stageFileRef: 'archives:StageSquidzoidJan09.swf',
    // I think this plaza is accurate (with sign)
    plazaFileRef: 'recreation:plaza_squidzoid_sign.swf',
    costumeTrunkFileRef: 'archives:January2009Costume.swf',
    notPremiere: true,
    script: [
      { note: "Squidzoid vs Shadow Guy & Gamma Gal" },
      { name: "Reporter:", message: "Action news live! Tell us what\'s happening!" },
      { name: "Witness:", message: "I saw a monster eat the pet shop!" },
      { name: "Squidzoid:", message: "GRAWL! I HUNGRY!" },
      { name: "Witness:", message: "Who can save us now?" },
      { name: "Shadow Guy:", message: "The city needs our help!" },
      { name: "Gamma Gal:", message: "Super costume mega transform!" }, 
      { note: "(Heroes change into super suits)" },
      { name: "Witness:", message: "Look! The heroes have arrived!" },
      { name: "Reporter:", message: "Here they come to save the day!" },
      { name: "SG:", message: "Freeze Squidzoid! Drop that shop!" },
      { name: "GG:", message: "I think you\'ve had enough to eat!" },
      { name: "Squidzoid:", message: "BLARRG! YOU CAN\'T STOP ME!" },
      { name: "GG:", message: "Oh yeah? Take this! PLASMA GLOW WAVE!" },
      { name: "Squidzoid:", message: "RROOOOAAAARR!" },
      { name: "Reporter:", message: "The superheroes are using their powers!" },
      { name: "Witness:", message: "Hurray heroes! Nice going!" },
      { name: "Squidzoid:", message: "PUNY HEROES! YOU\'RE NO MATCH FOR ME!" },
      { name: "SG:", message: "Then try this on for size! SHADOW WAVE!" },
      { name: "Squidzoid:", message: "GLEEGRRAUWLL!" },
      { name: "Reporter:", message: "This just in! Squidzoid is trying to escape!" },
      { name: "Witness:", message: "After it! Don\'t let it get away!" },
      { name: "GG:", message: "Quick! With our powers combined!" },
      { name: "SG:", message: "For great justice!" },
      { name: "Squidzoid:", message: "NO! THIS IS IMPOSSIBLE! GRRAAA!" },
      { name: "Witness:", message: "It\'s turning into a penguin!" },
      { note: "(Squidzoid turns into a penguin.)" },
      { name: "Squidzoid:", message: "Hey, I\'m a penguin again. What happened?" },
      { name: "Reporter:", message: "You turned into Squidzoid!" },
      { name: "Witness:", message: "And started eating the city!" },
      { name: "Squidzoid:", message: "Oh! I had a monster appetite!" },
      { name: "SG:", message: "With great power comes great hunger." },
      { name: "GG:", message: "Looks like our work here is done!" },
      { name: "Squidzoid:", message: "Let\'s go get a fish pizza." },
      { name: "Reporter:", message: "The city is saved! This reporter is signing off." },
      { note: "THE END" },
      { note: "Director" },
      { name: "Director:", message: "Places please!" },
      { name: "Director:", message: "5 minute call, actors to the stage." },
      { name: "Director:", message: "Let\'s take it from the top!" },
      { name: "Director:", message: "It\'s a wrap!" }
    ]
  },
  {
    date: '2009-02-13',
    name: 'Team Blue vs. Team Red',
    stageFileRef: 'archives:Stage2011Aug17.swf', // from 2011
    plazaFileRef: 'recreation:plaza_team_blue_play.swf',
    costumeTrunkFileRef: 'archives:February2009Costume.swf',
    script: [
      {
        "note": "Team Blue vs. Team Red"
      },
      {
        "note": "(A dodgeball event taking place in a high school)"
      },
      {
        "name": "Jeff:",
        "message": "It\'s the final match of the Dodgeball championship!"
      },
      {
        "name": "Zeus:",
        "message": "Alright, here we go. Don\'t get nervous. Don\'t get nervous."
      },
      {
        "name": "Tate:",
        "message": "Arr! Don\'t worry Zeus, we\'re ready for this. Chin up, sailor!"
      },
      {
        "name": "Zeus:",
        "message": "I\'ll try."
      },
      {
        "name": "Jeff:",
        "message": "In this corner, those marvelous mascots, the BLUE TEAM!"
      },
      {
        "name": "Jeff:",
        "message": "And in this corner, the defending champs, the RED"
      },
      {
        "name": "Scarlet:",
        "message": "Well, this should be easy. right Eric?"
      },
      {
        "name": "Eric:",
        "message": ". . ."
      },
      {
        "name": "Scarlet:",
        "message": "Haha! Good one!"
      },
      {
        "name": "Jeff:",
        "message": "Alright guys, I want a nice friendly game. I mean it."
      },
      {
        "name": "Scarlet:",
        "message": "You got it ref. A nice SHORT friendly game."
      },
      {
        "name": "Tate:",
        "message": "Hey! I heard that!"
      },
      {
        "name": "Jeff:",
        "message": "Alright, here we go. GAME ON!"
      },
      {
        "name": "Scarlet:",
        "message": "Ready or not, here comes my super ultra mega power ball!"
      },
      {
        "note": "(Scarlet throws a dodge ball.)"
      },
      {
        "name": "Zeus:",
        "message": "Yikes! That almost took my antlers off!"
      },
      {
        "name": "Tate:",
        "message": "Look out Zeus!"
      },
      {
        "note": "(Eric throws a dodge ball and misses.)"
      },
      {
        "name": "Tate:",
        "message": "HA! Is that all you got?"
      },
      {
        "name": "Eric:",
        "message": ". . ."
      },
      {
        "note": "(Eric throws a dodge ball, and pegs Tate!)"
      },
      {
        "name": "Tate:",
        "message": "Oh no! I\'m down! I\'m down!"
      },
      {
        "name": "Scarlet:",
        "message": "Ha ha ha! More like Tate the SUNKEN Migrator!"
      },
      {
        "name": "Jeff:",
        "message": "TWEET! Clean hit! Tate is out!"
      },
      {
        "name": "Eric:",
        "message": ". . ."
      },
      {
        "name": "Zeus:",
        "message": "Oh no! I\'m all alone! I can\'t do this!"
      },
      {
        "name": "Scarlet:",
        "message": "Alright, just one more power ball, and this game is OVER!"
      },
      {
        "name": "Jeff:",
        "message": "TWEET! Foul! Too many shoes on the court!"
      },
      {
        "name": "Zeus:",
        "message": "Wait, what?"
      },
      {
        "name": "Jeff:",
        "message": "Someone has to take off his or her shoes. I mean it!"
      },
      {
        "name": "Scarlet:",
        "message": "Fine, I\'ll take off my shoes"
      },
      {
        "name": "Jeff:",
        "message": "Game on!"
      },
      {
        "name": "Scarlet:",
        "message": "Alright Zeus, any last words before you\'re out?"
      },
      {
        "name": "Zeus:",
        "message": "Umm...How about \'yikes!\'"
      },
      {
        "name": "Jeff:",
        "message": "TWEET! Foul! No saying \'yikes\' on the court!"
      },
      {
        "name": "Scarlet:",
        "message": "What? That\'s just silly!"
      },
      {
        "name": "Zeus:",
        "message": "Umm, sorry? I won\'t do it again..."
      },
      {
        "name": "Jeff:",
        "message": "Game on!"
      },
      {
        "name": "Scarlet:",
        "message": "As I was saying, here comes my most powerful dodge ball!"
      },
      {
        "name": "Jeff:",
        "message": "TWEET! Foul!"
      },
      {
        "name": "Scarlet:",
        "message": "Now what?!"
      },
      {
        "name": "Jeff:",
        "message": "Your name is too long. You must shorten it."
      },
      {
        "name": "Scarlet:",
        "message": "Okay, this is getting crazy! I\'m just going to throw the ball."
      },
      {
        "note": "(Scarlet throws a dodge ball)"
      },
      {
        "name": "Zeus:",
        "message": "Gadzooks!"
      },
      {
        "note": "(Dodge ballmisses Zeus, rebounds backs)"
      },
      {
        "name": "Scarlet:",
        "message": "Look out! Runaway dodge ball!"
      },
      {
        "name": "Eric:",
        "message": "! ! !"
      },
      {
        "note": "(Dodge ball misses Team Red, rebounds and hits Jeff!)"
      },
      {
        "name": "Jeff:",
        "message": "TWEET! Clean hit! The ref is out!"
      },
      {
        "name": "Zeus:",
        "message": "But wait... YOU\'RE the ref!"
      },
      {
        "name": "Scarlet:",
        "message": "Yeah, I didn\'t mean to hit you."
      },
      {
        "name": "Jeff:",
        "message": "Doesn\'t matter. Rules are rules. TWEET! Game on!!"
      },
      {
        "name": "Scarlet:",
        "message": "Alright then. Let\'s finish this, Blue Team!"
      },
      {
        "name": "Zeus:",
        "message": "You\'re on!"
      },
      {
        "note": "(They finish the game. It\'s up to you to decide who wins!)"
      },
      {
        "name": "Tate:",
        "message": "And the winner is..."
      },
      {
        "name": "Everyone:",
        "message": "RED TEAM!"
      },
      {
        "name": "Everyone:",
        "message": "BLUE TEAM!"
      },
      {
        "name": "Everyone:",
        "message": "IT\'S A TIE!"
      },
      {
        "note": "THE END."
      },
      {
        "note": "Director"
      },
      {
        "name": "Director:",
        "message": "Places please!"
      },
      {
        "name": "Director:",
        "message": "5 minute call, actors to the stage."
      },
      {
        "name": "Director:",
        "message": "Let\'s take it from the top!"
      },
      {
        "name": "Director:",
        "message": "It\'s a wrap!"
      }
    ]
  },
  {
    date: '2009-04-10',
    name: 'Quest for the Golden Puffle',
    stageFileRef: 'archives:RoomsStage-May2010.swf', // from 2010
    plazaFileRef: 'recreation:plaza_golden_puffle_no_weather.swf',
    costumeTrunkFileRef: 'archives:December2008Costume.swf'
  },
  {
    date: '2009-05-08',
    name: 'The Haunting of the Viking Opera',
    stageFileRef: 'archives:RoomsStage-February2011.swf', // from 2011
    plazaFileRef: 'recreation:plaza_haunting_of_the_viking_opera.swf',
    costumeTrunkFileRef: 'archives:February2011HauntingOfTheVikingOperaCostumeTrunk.swf',
    script: [
      { note: "The Haunting of the Viking Opera" },
      { name: "Hector:", message: "Alright everyone, it\'s time for Helga\'s solo. From the top!" },
      { name: "Helga:", message: "NO! NO! A bajillion times NO! I will not sing!" },
      { name: "Hector:", message: "Come on Helga! Your solo\'s the most important part of the play!" },
      { name: "Helga:", message: "NO! As long as the ghost is ghosting, I will not sing!" },
      { name: "Hector:", message: "Helga, please! There\'s no such thing as ghosts!" },
      { name: "Bailey:", message: "Now now, miss \'elga, nothin\' to worry about. I\'m \'ere now" }, 
      { name: "Helga:", message: "Oh, but what if the ghost throws a tomato or something?" },
      { name: "Bailey:", message: "No worries. I\'ll \'appily take a tomato for you any day" },
      { name: "Helga:", message: "Well...Alright. I\'ll do it. I\'ll sing." },
      { name: "Hector:", message: "Wonderful! Alright everyone, places! Places!" },
      { note: "(Everyone takes in their places)" },
      { name: "Hector:", message: "All right, from the top. One...Two...Three...Action!" },
      { name: "Ghost:", message: "OOOooooOOOOoooooOOOOoooOOO!!!!!" },
      { name: "Bailey:", message: "Yikes! That doesn\'t sound right..." },
      { name: "Helga:", message: "It\'s not me! IT\'S THE GHOST!" },
      { name: "Ghost:", message: "OOOOooooOOOOOooOOOoooOOOO!!!!" },
      { name: "Hector:", message: "Oh my goodness! The ghost is real?!" },
      { name: "Helga:", message: "Don\'t just stand there, do something!" },
      { name: "Bailey:", message: "Well, I ain\'t afraid of no ghost! Let me \'andle this!" },
      { name: "Bailey:", message: "You there! You\'re under arrest! Haunting is against the law!" },
      { note: "(Ghost begins to glow)" },
      { name: "Ghost:", message: "OOOOoooOOOooOOOoOO!!!" },
      { name: "Bailey:", message: "On second thought, maybe I\'ll let you off with a warning..." },
      { name: "Hector:", message: "Maybe if we ask it nicely, it\'ll go haunt the Mine or something..." },
      { name: "Helga:", message: "Oh fiddle sticks! I\'ve had enough! Shoo, ghost, shoo!" },
      { name: "Ghost:", message: "OOOOOooooOOOOOooooOOO!!!" },
      { name: "Helga:", message: "Hmph! You call that a G flat? I\'LL show you a G flat..." },
      { name: "Helga:", message: "LA LA LA LAAAAAAAAAAAAAAAAAAAAAAA!!!" },
      { name: "Ghost:", message: "OOOOoooOOOOooOOOO!!!" },
      { name: "Helga:", message: "LAAAAAAAAAAAAAAAAAA!!!!!!" },
      { name: "Bailey:", message: "BLIMEY! I CAN\'T EVEN HEAR MYSELF THINK!" },
      { name: "Hector:", message: "WHAAAAT?!!" },
      { note: "(There\'s a rumble and suddenly..." },
      { note: "...a giant avalanche buries the ghost)" },
      { name: "Helga:", message: "Now THAT\'S how you sing opera." },
      { name: "Hector:", message: "I guess it\'s not over until the hat-lady sings!" },
      { name: "Bailey:", message: "Alright, now let\'s see who\'s really behind the ghost!" },
      { note: "(Bailey removes the Ghost\'s costume)" },
      { name: "Hector:", message: "Why it\'s Moneek, our costume designer!" },
      { name: "Moneek:", message: "Whoa, my head...What\'s going on here?" },
      { name: "Hector:", message: "What were you doing in that sheet?" },
      { name: "Moneek:", message: "Sorry, I got tangled in that sheet with my flashlight." },
      { name: "Helga:", message: "Then why were you yelling \'OOOOooooOOOO!!\'" },
      { name: "Moneek:", message: "Oh, it was too bright. It was hurting my eyes." },
      { name: "Bailey:", message: "Well, I\'m glad we got all that cleared up!" },
      { name: "Helga:", message: "And I finally got a chance to practice my solo!" },
      { name: "Hector:", message: "Good show, everyone. Let\'s take it once more from the top!" },
      { note: "THE END" }
    ]
  },
  {
    date: '2009-06-12',
    name: 'Fairy Fables',
    stageFileRef: 'archives:RoomsStage-June2009.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play10.swf',
    costumeTrunkFileRef: 'archives:Jan10Stage.swf'
  },
  {
    date: '2009-07-10',
    name: 'Ruby and the Ruby',
    stageFileRef: 'recreation:ruby_play_debut.swf',
    plazaFileRef: 'recreation:plaza_ruby_no_weather_09_july.swf',
    costumeTrunkFileRef: 'archives:July09Costume.swf',
    notPremiere: true
  },
  {
    date: '2009-08-21',
    name: 'Underwater Adventure',
    stageFileRef: 'recreation:underwater_adventure_no_pin.swf', // recreation
    plazaFileRef: 'recreation:plaza_underwater_adventure.swf',
    costumeTrunkFileRef: 'archives:May2011UnderwaterAdventureCostume.swf', // 2011
    script: [
      { note: "Underwater Adventure" },
      { name: "Fiesel:", message: "And so our search for the lost town continues." },
      { name: "Daisy:", message: "I don\'t think we should go that way!" },
      { name: "Fiesel:", message: "There\'s nothing down here to be afraid of." },
      { name: "Daisy:", message: "Nothing except that giant lobster?" },
      { name: "Fiesel:", message: "It\'s just an underwater parking attendant!" },
      { name: "Lobster:", message: "Move along now - no floating here!" }, 
      { name: "Daisy:", message: "Can you tell us the way to the secret city?" },
      { name: "Lobster:", message: "It would hardly be a secret if I told you!" },
      { name: "Fiesel:", message: "What about treasure? Have you seen any?" },
      { name: "Lobster:", message: "Sure, there\'s some over there. Now move along!" },
      { name: "Daisy:", message: "Thanks for the treasure!" },
      { name: "Mystic Fish:", message: "BLUB! BLUB!" },
      { name: "Fiesel:", message: "The Mystic Fish! I wonder if it can help us?" },
      { name: "Mystic Fish:", message: "Who disturbs me?" },
      { name: "Fiesel:", message: "We are looking for adventure, oh wise fish!" },
      { name: "Mystic Fish:", message: "To find a hidden land in the sea..." },
      { name: "Mystic Fish:", message: "Swim down-stream. Now leave me be!" },
      { name: "Daisy:", message: "I\'m not getting out of the submarine. I can\'t swim!" },
      { name: "Fiesel:", message: "Oh great, a diver who can\'t swim." },
      { name: "Fiesel:", message: "That\'s just brilliant!" },
      { name: "Daisy:", message: "Is it too late for a swimming lesson?" },
      { name: "Daisy:", message: "I wish I\'d brought my water wings!" },
      { name: "Fiesel:", message: "Be brave and take my flipper." },
      { name: "Fiesel:", message: "It\'s okay, there\'s a lifeguard over there!" },
      { name: "Daisy:", message: "I can do it! I\'m swimming!" },
      { name: "Fiesel:", message: "Look! The hidden city! We did it!" },
      { name: "Daisy:", message: "Wow! I\'ve never seen so many merpenguins!" },
      { name: "Bubbles:", message: "Welcome travellers!" },
      { name: "Flippers:", message: "New friends! Let me tell you a joke." },
      { name: "Bubbles:", message: "Oh no. Now you\'ve got him started." },
      { name: "Flippers:", message: "What lies under the ocean and shivers?" },
      { name: "Flippers:", message: "A nervous wreck!" },
      { name: "Daisy:", message: "Lol! That\'s terrible!" },
      { name: "Bubbles:", message: "Enough, Flippers! Let them explore the city." },
      { name: "Flippers:", message: "Welcome to Penglantis - our home is yours!" },
      { name: "Daisy:", message: "This is such an adventure!" },
      { name: "Fiesel:", message: "And its only just begun!" },
      { note: "THE END" },
      { note: "Director" },
      { name: "Director:", message: "Places please!" },
      { name: "Director:", message: "Start swimming!" },
      { name: "Director:", message: "Fantastic acting, well done" },
      { name: "Director:", message: "Curtain call!" }
    ]
  },
  {
    date: Update.PENGUINS_TIME_FORGOT_2009,
    name: 'The Penguins that Time Forgot',
    stageFileRef: 'archives:RoomsStage-September2009.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play6.swf',
    costumeTrunkFileRef: 'archives:June08Costume.swf',
    script: [
      { note: "The Penguins that Time Forgot" },
      { name: "Chester:", message: "Time to use this Time Travel 1000!" },
      { note: "(Time machine opens)" },
      { name: "Critteroo:", message: "UGG! DINO! UGG!" },
      { name: "Chester:", message: "What is this place? Where am I?" },
      { name: "Kek:", message: "GRUB! GRUB! GRUB!" },
      { name: "Chester:", message: "I\'m in Grub? What\'s a Grub?" },
      { name: "Critteroo:", message: "LAVA! LAVA!" }, 
      { name: "Chester:", message: "Lava?! I\'ve gotta get out of here!" },
      { note: "(Time machine breaks)" },
      { name: "Chester:", message: "Great, now I\'m stuck in Grub. With lava. What next?" },
      { name: "Tiki:", message: "TIKI UGG!" },
      { name: "Chester:", message: "GRUB! Last time I buy a time machine for 10 coins..." },
      { name: "Kek:", message: "GRRRRRRRRUB!" },
      { name: "Chester:", message: "Sigh. Grub? Is that a giant grub mask?" },
      { name: "Tiki:", message: "TIKI TIKI BOARD TIKI BOARD!" },
      { name: "Chester:", message: "Should I be scared? I don\'t feel scared even a bit!" },
      { name: "Critteroo:", message: "TIKI! TIKI ATOOK!" },
      { name: "Tiki:", message: "ABOOT! ABOOT!" },
      { name: "Kek:", message: "YUB NUB GRUB!" },
      { name: "Chester:", message: "Okay, really now. Can\'t you just use real words?" },
      { name: "Critteroo:", message: "GRUB! TIKI GRUB-GRUB!" },
      { name: "Chester:", message: "You do know you don\'t make any sense, right?" },
      { name: "Critteroo:", message: "LAVA NO TIKI GRUB!" },
      { name: "Chester:", message: "Sigh. Okay, something about lava and grubs." },
      { name: "Tiki:", message: "ABOOOOOOT!" },
      { name: "Chester:", message: "You were wearing boots, but the grubs took them?" },
      { name: "Kek:", message: "LAVA NO LAVA! GRUB TIKI GRUB!" },
      { name: "Chester:", message: "Let me guess, your name is Tiki and you\'re a Grub?" },
      { name: "Tiki:", message: "ABOOT TIKI!" },
      { name: "Chester:", message: "I give up! I have no idea what you\'re saying." },
      { name: "Critteroo:", message: "Now you know how I feel!" },
      { name: "Chester:", message: "What? You understand me?" },
      { name: "Critteroo:", message: "Of course I do! What is that thing?" },
      { name: "Chester:", message: "A time machine. We could explore. But it\'s broken." },
      { name: "Chester:", message: "Where would you go if it worked?" },
      { name: "Critteroo:", message: "Somewhere without Grub OR lava?" },
      { name: "Chester:", message: "Maybe Kek can fix it? Let\'s ask!" },
      { name: "Critteroo:", message: "NUB CLUB GRUB?" },
      { name: "Kek:", message: "TIKI GRUB-GRUB!" },
      { name: "Chester:", message: "I\'ll take that as a yes?" },
      { note: "THE END" },
      { note: "Director" },
      { name: "Director:", message: "Places everyone!" },
      { name: "Director:", message: "Take it again from the top!" },
      { name: "Director:", message: "Excellent work, team. Keep it up!" },
      { name: "Director:", message: "That\'s a wrap!" },
      { name: "Director:", message: "Take a bow everyone!" }
    ]
  },
  {
    date: '2009-10-09',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    stageFileRef: 'archives:RoomsStage-October2009.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play3-2.swf',
    costumeTrunkFileRef: 'archives:January2009Costume.swf', // from jan 2009
    script: [
      { note: "Squidzoid vs Shadow Guy & Gamma Gal" },
      { name: "Reporter:", message: "Action news live! Tell us what\'s happening!" },
      { name: "Witness:", message: "There\'s a giant monster! No! Two of them!!!" },
      { name: "Squidzoid:", message: "GRAWL! I HUNGRY!" },
      { name: "Reporter:", message: "\'GASP!\' They\'ll eat the entire city!" },
      { name: "Witness:", message: "Who will save us now?" },
      { name: "Shadow Guy:", message: "The city needs our help!" },
      { name: "Gamma Gal:", message: "Super costume mega transform!" }, 
      { note: "(Heroes change into super suits)" },
      { name: "Witness:", message: "Hooray! The heroes have arrived!" },
      { name: "Reporter:", message: "Of course they have. Who else could save the day?" },
      { name: "SG:", message: "Freeze Squidzoid and Melmonst!" },
      { name: "GG:", message: "You\'ve both eaten enough!" },
      { name: "Squidzoid:", message: "BLARRG! YOU CAN\'T STOP US!" },
      { name: "GG:", message: "Oh yeah? Take this! PLASMA GLOW WAVE!" },
      { name: "Squidzoid:", message: "RROOOOAAAARR!" },
      { name: "Reporter:", message: "The superheroes are using their powers!" },
      { name: "Witness:", message: "Hooray heroes! Nice going!" },
      { name: "Squidzoid:", message: "PUNY HEROES! YOU\'RE NO MATCH FOR US!" },
      { name: "SG:", message: "Then try this on for size! SHADOW WAVE!" },
      { name: "Squidzoid:", message: "GLEEGRRAUWLL!" },
      { name: "Reporter:", message: "Wait! Squidzoid\'s running. But Melmonst is staying!" },
      { name: "SG:", message: "Not the most reliable sidekick." },
      { name: "GG:", message: "You\'re right. And he doesn\'t say a lot." },
      { name: "Witness:", message: "We can\'t have monsters all over the city!" },
      { name: "GG:", message: "Quick! With our powers combined!" },
      { name: "SG:", message: "For great justice!" },
      { name: "GG:", message: "For freedom!!" },
      { name: "SG:", message: "For the love of pizza with extra olives!" },
      { name: "Squidzoid:", message: "NO! THIS IS IMPOSSIBLE! GRRAAA!" },
      { name: "Witness:", message: "It\'s turning into a penguin!" },
      { note: "(Squidzoid turns into a penguin.)" },
      { name: "Squidzoid:", message: "Hey, I\'m a penguin again. What happened?" },
      { name: "Reporter:", message: "You turned into Squidzoid!" },
      { name: "Witness:", message: "And started eating the city!" },
      { name: "Squidzoid:", message: "Oh! I had a monster appetite!" },
      { name: "SG:", message: "But there\'s still Melmonst!" },
      { name: "Squidzoid:", message: "Hmm...looks kind of stuck up there." },
      { name: "GG:", message: "Not a danger at all!" },
      { name: "Witness:", message: "It makes a nice ornament." },
      { name: "GG:", message: "Looks like our work here is done!" },
      { name: "Squidzoid:", message: "Let\'s go get a fish pizza." },
      { name: "SG:", message: "Extra olives, please!" },
      { name: "Reporter:", message: "The city is saved! This reporter is signing off." },
      { note: "THE END" },
      { note: "Director" },
      { name: "Director:", message: "Places everyone!" },
      { name: "Director:", message: "Take it again from the top!" },
      { name: "Director:", message: "Excellent work, team. Keep it up!" },
      { name: "Director:", message: "That\'s a wrap!" },
      { name: "Director:", message: "Take a bow everyone!" }
    ]
  },
  {
    date: '2009-11-13',
    name: 'Norman Swarm Has Been Transformed',
    stageFileRef: 'archives:RoomsStage-December2009.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play14.swf',
    costumeTrunkFileRef: 'archives:Apr2011NormanSwarmHasBeenTransformedCostume.swf', // from april 2011,
    roomChanges: {
      party1: 'archives:RoomsParty1-December2009.swf'
    },
    musicRooms: ['party1'],
    script: [
      { note: "Norman Swarm Has Been Transformed" },
      { note: "Stand on the X\'s with the right amount of actors!" },
      { note: "Make sure there\'s at least one bug with you..." },
      { note: "Act 1: Overground" },
      { note: "NORMAN SWARM" },
      { name: "Norman Swarm:", message: "The laser! Look what it\'s done to me." },
      { name: "Norman Swarm:", message: "I\'ve been transformed! I\'m SO very small!" },
      { name: "Norman Swarm:", message: "I\'m like a bug! Is there a cure?" },
      { name: "Norman Swarm:", message: "I must find a cure!!!" },
      { name: "Norman Swarm:", message: "Now which way do we go?" },
      { name: "Norman Swarm:", message: "What\'ll happen if we stand here?" },
      { name: "Norman Swarm:", message: "I\'m not a bug! I\'m a penguin!" }, 
      { name: "Norman Swarm:", message: "Where can I find this Gnome?" },
      { name: "Norman Swarm:", message: "You look like you know your way around. Come with me!" },
      { name: "Norman Swarm:", message: "It seems I need bugs to help me!" },
      { note: "BONNIE THE MOTH" },
      { name: "Bonnie the Moth:", message: "Just gotta find that wise Garden Gnome!" },
      { name: "Bonnie the Moth:", message: "Hey! How\'s a spider like a top? Always spinning!" },
      { name: "Bonnie the Moth:", message: "What did one snail say to another? Get ya next slime!" },
      { name: "Bonnie the Moth:", message: "What\'s the biggest moth? A mammoth!" },
      { name: "Bonnie the Moth:", message: "Hey! You! Bee-have yourself! Hahaha!" },
      { name: "Bonnie the Moth:", message: "I could totally be wrong. But let\'s try standing here!" },
      { note: "GLADYS THE SPIDER" },
      { name: "Gladys the Spider:", message: "AHH! Help! A BUG!" },
      { name: "Gladys the Spider:", message: "Say, I\'ve not seen a bug like you before!" },
      { name: "Gladys the Spider:", message: "I AM? Oh my. No wonder I\'m scared of my own shadow." },
      { name: "Gladys the Spider:", message: "Well, we\'d better get you to see the Garden Gnome." },
      { name: "Gladys the Spider:", message: "Please don\'t give me a mirror. Bugs frighten me." },
      { name: "Gladys the Spider:", message: "You like the web? Thanks. I made it myself." },
      { name: "Gladys the Spider:", message: "This way. You can hold one of my hands if you wish." },
      { note: "TONI THE SNAIL" },
      { name: "Toni the Snail:", message: "I\'m no bug. I\'m a mollusk." },
      { name: "Toni the Snail:", message: "It\'s hard keeping up with a house on your back." },
      { name: "Toni the Snail:", message: "I guess you\'d better find the Garden Gnome." },
      { name: "Toni the Snail:", message: "Make your way to the door. I\'ll be there...soon." },
      { name: "Toni the Snail:", message: "A penguin? How\'d you get so little?" },
      { name: "Toni the Snail:", message: "Slow and steady - it\'s not a race, you know!" },
      { note: "FUZZ THE BEE" },
      { name: "Fuzz the Bee:", message: "Whatdya know! A puny penguin! I\'ve seen everything now!" },
      { name: "Fuzz the Bee:", message: "The Garden Gnome always has all the answers." },
      { name: "Fuzz the Bee:", message: "Watch out for the water!" },
      { name: "Fuzz the Bee:", message: "Hey! You\'re a strong swimmer!" },
      { name: "Fuzz the Bee:", message: "High five...or figh hive! Ha!" },
      { name: "Fuzz the Bee:", message: "Fly right this way! Oh...you don\'t fly? Too bad!" },
      { note: "End of Act 1" },
      { note: "Act 2: Underground" },
      { name: "Garden Gnome:", message: "Garden bugs, welcome. Tell me your worries." },
      { name: "Gladys the Spider:", message: "We\'ve brought a friend - he claims he\'s a penguin!" },
      { name: "Bonnie the Moth:", message: "He\'s half the penguin he used to be. Even smaller, actually!" },
      { name: "Fuzz the Bee:", message: "Said silly scientist has shrunk!" },
      { name: "Norman Swarm:", message: "It\'s true, I\'ve been transformed!" },
      { name: "Gladys the Spider:", message: "Do you have a cure for him?" },
      { name: "Garden Gnome:", message: "Stand on the stones - make sure there\'s a bug!" },
      { name: "Garden Gnome:", message: "You\'ve worked together and earned the treasure!" },
      { name: "Garden Gnome:", message: "Take your pin, exit, and you\'ll be back to normal." },
      { name: "Garden Gnome:", message: "Your pin is the cure!" },
      { name: "Garden Gnome:", message: "Take it and transform to your regular size. Don\'t bump your head" },
      { name: "Norman Swarm:", message: "Thank you, friends! It\'s time to take the door home." },
      { name: "Toni the Snail:", message: "I made it! Did I miss anything?" },
      { note: "THE END" },
      { note: "DIRECTOR" },
      { name: "Director:", message: "Places please!" },
      { name: "Director:", message: "And...action!" },
      { name: "Director:", message: "Fantastic acting. Well done!" },
      { name: "Director:", message: "Try standing on the X\'s." },
      { name: "Director:", message: "This isn\'t a rehearsal! Get into costume, please." },
      { note: "EXTRAS" },
      { name: "Director:", message: "Did you know the praying mantis can turn its head 180 degrees?!" },
      { name: "Director:", message: "Ladybugs beat their wings 85 times a second in flight." },
      { name: "Director:", message: "Snails are deaf!" },
      { name: "Director:", message: "Spiders can jump up to 40 times their own body length." },
      { name: "Director:", message: "Honeybees have hair on their eyes!" }
    ]
  },
  {
    date: Update.QUEST_GOLD_PUFFLE_CHRISTMAS_2009,
    name: 'Quest for the Golden Puffle',
    costumeTrunkFileRef: 'archives:December2008Costume.swf', // from 2008 unknown if accurate,
    plazaFileRef: 'recreation:plaza_golden_puffle_no_weather.swf',
    stageFileRef: 'archives:RoomsStage-May2010.swf' // from March, unknown if accurate
  },
  {
    date: '2010-01-08',
    name: 'Fairy Fables',
    costumeTrunkFileRef: 'archives:Jan10Stage.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play10.swf', // accuracy unknown
    stageFileRef: 'archives:RoomsStage-June2009.swf' // from 2009, unknown if accurate
  },
  {
    date: '2010-02-11',
    name: 'Secrets of the Bamboo Forest',
    costumeTrunkFileRef: 'archives:October2010Costume.swf', // from October, unknown if accurate
    plazaFileRef: 'archives:RoomsPlaza-August2011.swf', // from 2011, unknown if accurate
    stageFileRef: 'archives:HalloweenParty2010Stage.swf', // from October 10, unknown if accurate
    script: [
      {
        "note": "Secrets of the Bamboo Forest"
      },
      {
        "note": "Act 1"
      },
      {
        "name": "Monkey King:",
        "message": "The treasure is so close! In that palace!"
      },
      {
        "name": "Monkey King:",
        "message": "... where the Phoenix Queen lives!"
      },
      {
        "name": "Funny Pig:",
        "message": "Um...did you say treasure?"
      },
      {
        "name": "Monkey King:",
        "message": "Yes! Do you know how to cross this river?"
      },
      {
        "name": "Funny Pig:",
        "message": "Treasure? Like mud? Anchovies? Chocolate?"
      },
      {
        "name": "Monkey King:",
        "message": "No...well - maybe. How do we cross?"
      },
      {
        "name": "Funny Pig:",
        "message": "There is a magical bridge!"
      },
      {
        "name": "Funny Pig:",
        "message": "First we must find the Golden Feather."
      },
      {
        "name": "Monkey King:",
        "message": "Is it close by?"
      },
      {
        "name": "Funny Pig:",
        "message": "It\'s hidden in a place of light far away."
      },
      {
        "name": "Monkey King:",
        "message": "Lead the way, Funny Pig!"
      },
      {
        "name": "Funny Pig:",
        "message": "Let\'s search the whole Island together."
      },
      {
        "name": "Funny Pig:",
        "message": "Maybe there will be some snacks along the way!"
      },
      {
        "note": "Act 2"
      },
      {
        "name": "Monkey King:",
        "message": "We return with the feather!"
      },
      {
        "name": "Funny Pig:",
        "message": "Hey, that stone just moved!"
      },
      {
        "name": "Funny Pig:",
        "message": "And I found a pizza! Candy topping!"
      },
      {
        "name": "Guardian Dog:",
        "message": "Monkey, this is not your place to be."
      },
      {
        "name": "Monkey King:",
        "message": "But I\'m not a monkey. I\'m the monkey KING!"
      },
      {
        "name": "Guardian Dog:",
        "message": "I\'m the Guardian Dog! I keep the palace pest free."
      },
      {
        "name": "Guardian Dog:",
        "message": "You must prove yourself worthy to enter."
      },
      {
        "name": "Monkey King:",
        "message": "Alright...let\'s see...TURNS TO WIND"
      },
      {
        "name": "Funny Pig:",
        "message": "Ooh! What\'s this strange wind?"
      },
      {
        "name": "Guardian Dog:",
        "message": "Pfft! Don\'t play games monkey! I know your tricks."
      },
      {
        "name": "Monkey King:",
        "message": "But of course. Hey... did you want some snacks?"
      },
      {
        "name": "Guardian Dog:",
        "message": "Snacks? No! The feather is your key."
      },
      {
        "name": "Guardian Dog:",
        "message": "If you found the feather, you may enter."
      },
      {
        "name": "Monkey King:",
        "message": "Thank you, Guardian Dog."
      },
      {
        "name": "Guardian Dog:",
        "message": "Sure thing, Monkey King! Kai-men-da-ji!"
      },
      {
        "note": "Act 3"
      },
      {
        "name": "Phoenix Queen:",
        "message": "Greetings, Monkey! I\'ve been expecting you."
      },
      {
        "name": "Monkey King:",
        "message": "Phoenix Queen! It has been a long journey!"
      },
      {
        "name": "Phoenix Queen:",
        "message": "You are brave and clever!"
      },
      {
        "name": "Phoenix Queen:",
        "message": "I award you this very rare background."
      },
      {
        "name": "Funny Pig:",
        "message": "Wow! Do I get one too?"
      },
      {
        "name": "Phoenix Queen:",
        "message": "Alright. Just be sure not to gobble it."
      },
      {
        "name": "Funny Pig:",
        "message": "Sweet!"
      },
      {
        "name": "Monkey King:",
        "message": "Thank you, Phoenix Queen..."
      },
      {
        "name": "Monkey King:",
        "message": "I have enjoyed my adventure."
      },
      {
        "name": "Phoenix Queen:",
        "message": "Then you shall have more."
      },
      {
        "note": "Director"
      },
      {
        "name": "Director:",
        "message": "Places please!"
      },
      {
        "name": "Director:",
        "message": "And...action!"
      },
      {
        "name": "Director:",
        "message": "To enter the palace you need the Golden Feather."
      },
      {
        "name": "Director:",
        "message": "Let\'s take it from the top!"
      },
      {
        "name": "Director:",
        "message": "Bravo! Fantastic acting!"
      }
    ]
  },
  {
    date: '2010-03-29',
    name: 'Quest for the Golden Puffle',
    costumeTrunkFileRef: 'archives:December2008Costume.swf', // from 2008 unknown if accurate 
    plazaFileRef: 'recreation:plaza_golden_puffle_no_weather.swf',
    stageFileRef: 'archives:RoomsStage-May2010.swf' // accurate
  },
  {
    date: '2010-06-10',
    name: 'Ruby and the Ruby',
    costumeTrunkFileRef: 'archives:July09Costume.swf', // From 2009, unknown if accurate
    plazaFileRef: 'recreation:plaza_ruby_no_weather.swf',
    stageFileRef: 'recreation:stage_ruby_2010_june.swf'
  },
  {
    date: '2010-07-21',
    name: 'Underwater Adventure',
    costumeTrunkFileRef: 'archives:May2011UnderwaterAdventureCostume.swf', // frmo 2011 unknown if accurate
    plazaFileRef: null, // LOST FILE
    stageFileRef: 'recreation:underwater_adventure_no_pin.swf'
  },
  {
    date: '2010-08-26',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    costumeTrunkFileRef: 'archives:March2011SquidzoidVsShadowGuyAndGammaGalCostume.swf', // from march 2011 unknown if accurate
    plazaFileRef: 'archives:RoomsPlaza-Play3-2.swf', // no sign, unknown if accurate
    stageFileRef: 'archives:RoomsStage-October2009.swf' // frmo 2009, unknown if accurate
  },
  {
    date: '2010-09-16',
    name: 'Fairy Fables',
    costumeTrunkFileRef: 'archives:Jan10Stage.swf', // from january 10, unknown if accurate
    plazaFileRef: 'archives:RoomsPlaza-Play10.swf', // accuracy unknown
    stageFileRef: 'archives:RoomsStage-June2009.swf' // from 2009, unknown if accurate
  },
  {
    date: '2010-10-08',
    name: 'Secrets of the Bamboo Forest',
    costumeTrunkFileRef: 'archives:October2010Costume.swf',
    plazaFileRef: 'archives:RoomsPlaza-August2011.swf', // from 2011, unknown if accurate
    stageFileRef: 'archives:HalloweenParty2010Stage.swf',
    roomChanges: {
      shack: 'archives:Mine_Shack_Gold_Feather_Pin.swf'
    },
    script: [
      {
        "note": "Secrets of the Bamboo Forest"
      },
      {
        "note": "Act 1"
      },
      {
        "name": "Monkey King:",
        "message": "The treasure is so close! In that palace!"
      },
      {
        "name": "Monkey King:",
        "message": "... where the Phoenix Queen lives!"
      },
      {
        "name": "Funny Pig:",
        "message": "Um...did you say treasure?"
      },
      {
        "name": "Monkey King:",
        "message": "Yes! Do you know how to cross this river?"
      },
      {
        "name": "Funny Pig:",
        "message": "Treasure? Like mud? Anchovies? Chocolate?"
      },
      {
        "name": "Monkey King:",
        "message": "No...well - maybe. How do we cross?"
      },
      {
        "name": "Funny Pig:",
        "message": "There is a magical bridge!"
      },
      {
        "name": "Funny Pig:",
        "message": "First we must find the Golden Feather."
      },
      {
        "name": "Monkey King:",
        "message": "Is it close by?"
      },
      {
        "name": "Funny Pig:",
        "message": "It\'s hidden far away, in a place where things grow...."
      },
      {
        "name": "Monkey King:",
        "message": "Lead the way, Funny Pig!"
      },
      {
        "name": "Funny Pig:",
        "message": "Let\'s search the whole Island together."
      },
      {
        "name": "Funny Pig:",
        "message": "Maybe there will be some snacks along the way!"
      },
      {
        "note": "Act 2"
      },
      {
        "name": "Monkey King:",
        "message": "We return with the feather!"
      },
      {
        "name": "Funny Pig:",
        "message": "Hey, that stone just moved!"
      },
      {
        "name": "Funny Pig:",
        "message": "And I found a pizza! Candy topping!"
      },
      {
        "name": "Guardian Dog:",
        "message": "Monkey, this is not your place to be."
      },
      {
        "name": "Monkey King:",
        "message": "But I\'m not a monkey. I\'m the monkey KING!"
      },
      {
        "name": "Guardian Dog:",
        "message": "I\'m the Guardian Dog! I keep the palace pest free."
      },
      {
        "name": "Guardian Dog:",
        "message": "You must prove yourself worthy to enter."
      },
      {
        "name": "Monkey King:",
        "message": "Alright...let\'s see...TURNS TO WIND"
      },
      {
        "name": "Funny Pig:",
        "message": "Ooh! What\'s this strange wind?"
      },
      {
        "name": "Guardian Dog:",
        "message": "Pfft! Don\'t play games monkey! I know your tricks."
      },
      {
        "name": "Monkey King:",
        "message": "But of course. Hey... did you want some snacks?"
      },
      {
        "name": "Guardian Dog:",
        "message": "Snacks? No! The feather is your key."
      },
      {
        "name": "Guardian Dog:",
        "message": "If you found the feather, you may enter."
      },
      {
        "name": "Monkey King:",
        "message": "Thank you, Guardian Dog."
      },
      {
        "name": "Guardian Dog:",
        "message": "Sure thing, Monkey King! Kai-men-da-ji!"
      },
      {
        "note": "Act 3"
      },
      {
        "name": "Phoenix Queen:",
        "message": "Greetings, Monkey! I\'ve been expecting you."
      },
      {
        "name": "Monkey King:",
        "message": "Phoenix Queen! It has been a long journey!"
      },
      {
        "name": "Phoenix Queen:",
        "message": "You are brave and clever!"
      },
      {
        "name": "Phoenix Queen:",
        "message": "I award you this very rare background."
      },
      {
        "name": "Funny Pig:",
        "message": "Wow! Do I get one too?"
      },
      {
        "name": "Phoenix Queen:",
        "message": "Alright. Just be sure not to gobble it."
      },
      {
        "name": "Funny Pig:",
        "message": "Sweet!"
      },
      {
        "name": "Monkey King:",
        "message": "Thank you, Phoenix Queen..."
      },
      {
        "name": "Monkey King:",
        "message": "I have enjoyed my adventure."
      },
      {
        "name": "Phoenix Queen:",
        "message": "Then you shall have more."
      },
      {
        "note": "Director"
      },
      {
        "name": "Director:",
        "message": "Places please!"
      },
      {
        "name": "Director:",
        "message": "And...action!"
      },
      {
        "name": "Director:",
        "message": "To enter the palace you need the Golden Feather."
      },
      {
        "name": "Director:",
        "message": "Let\'s take it from the top!"
      },
      {
        "name": "Director:",
        "message": "Bravo! Fantastic acting!"
      }
    ]
  },
  {
    date: Update.PLANET_Y_2010,
    name: 'Space Adventure Planet Y',
    costumeTrunkFileRef: 'archives:2010SpacePlanetAdventureYCostumeTrunk.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play9.swf', // accurate
    stageFileRef: 'archives:RoomsStage-November2010.swf'
  },
  {
    date: '2010-12-28',
    name: 'Ruby and the Ruby',
    costumeTrunkFileRef: 'archives:July09Costume.swf', // From 2009, unknown if accurate
    plazaFileRef: 'recreation:plaza_ruby_no_weather.swf',
    stageFileRef: 'archives:RoomsStage-December2010.swf' // accurate
  },
  {
    date: '2011-01-27',
    name: 'The Penguins that Time Forgot',
    costumeTrunkFileRef: 'archives:September2009Costume.swf',
    stageFileRef: 'archives:RoomsStage-Early2011.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play6.swf'
  },
  {
    date: Update.STAGE_FEB_11,
    name: 'The Haunting of the Viking Opera',
    costumeTrunkFileRef: 'archives:February2011HauntingOfTheVikingOperaCostumeTrunk.swf',
    plazaFileRef: null,
    stageFileRef: 'archives:RoomsStage-February2011.swf'
  },
  {
    date: '2011-03-17',
    name: 'Squidzoid vs. Shadow Guy and Gamma Gal',
    stageFileRef: 'archives:2011Mar17Stage.swf',
    costumeTrunkFileRef: 'archives:March2011SquidzoidVsShadowGuyAndGammaGalCostume.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play3-2.swf'
  },
  {
    date: '2011-04-14',
    name: 'Norman Swarm Has Been Transformed',
    stageFileRef: 'archives:2011Apr14Stage.swf',
    roomChanges: {
      party1: 'archives:RoomsParty1-Apr2011-NormanSwarmHasBeenTransformed.swf'
    },
    musicRooms: ['party1'],
    costumeTrunkFileRef: 'archives:Apr2011NormanSwarmHasBeenTransformedCostume.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play14.swf'
  },
  {
    date: '2011-05-19',
    name: 'Underwater Adventure',
    stageFileRef: 'archives:2011May19Stage.swf',
    costumeTrunkFileRef: 'archives:May2011UnderwaterAdventureCostume.swf',
    plazaFileRef: null
  },
  {
    date: '2011-06-09',
    name: 'Secrets of the Bamboo Forest',
    stageFileRef: 'archives:2011Jun9Stage.swf',
    costumeTrunkFileRef: 'archives:June2011SecretsOfTheBambooForestCostume.swf',
    plazaFileRef: 'archives:RoomsPlaza-August2011.swf'
  },
  {
    date: '2011-08-17',
    name: 'Team Blue vs. Team Red',
    stageFileRef: 'archives:Stage2011Aug17.swf',
    costumeTrunkFileRef: 'archives:Costume2011Aug17.swf',
    plazaFileRef: 'archives:RoomsPlaza_2-Play11.swf'
  },
  {
    date: '2011-09-14',
    name: 'Fairy Fables',
    stageFileRef: 'archives:Stage14Sept2011.swf',
    costumeTrunkFileRef: 'archives:Costume14Sept2011.swf',
    plazaFileRef: 'archives:RoomsPlaza-Play10.swf'
  },
  {
    date: Update.HALLOWEEN_2011_START,
    name: 'Night of the Living Sled: Live',
    stageFileRef: 'archives:Stage2011Oct19.swf',
    plazaFileRef: 'recreation:plaza_notls.swf',
    costumeTrunkFileRef: 'archives:NLSLCostumeTrunk.swf'
  },
  {
    date: '2011-11-23',
    name: 'Battle of the Ancient Shadows',
    stageFileRef: 'archives:11242011Stage.swf',
    costumeTrunkFileRef: 'archives:ENCataloguesCostumeNov2011.swf',
    plazaFileRef: null
  },
  {
    date: '2011-12-14',
    name: 'A Humbug Holiday',
    stageFileRef: 'archives:12142011Stage.swf',
    costumeTrunkFileRef: 'archives:ENCataloguesCostumeDec2011.swf',
    plazaFileRef: 'archives:RoomsPlaza_2-Play18.swf'
  }
];
