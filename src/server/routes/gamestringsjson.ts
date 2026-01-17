import { findInVersion, findInVersionStrict } from "../game-data";
import { HUNT_TIMELINE } from "../timelines/crumbs";
import { GAME_STRINGS_TIMELINE } from "../timelines/game-strings";
import { Version } from "./versions";

export function getGameStrings(version: Version): string {
  const hunt = findInVersion(version, HUNT_TIMELINE);
  const gameStrings = { ...findInVersionStrict(version, GAME_STRINGS_TIMELINE) };
  if (hunt !== null && hunt !== undefined) {
    gameStrings['scavenger_title'] = hunt.lang.en.title;
    gameStrings['scavenger_claim_prize'] = hunt.lang.en.claim;
    gameStrings['scavenger_continue'] = hunt.lang.en.continue;
    gameStrings['scavenger_clue0'] = hunt.lang.en.clues[0];
    gameStrings['scavenger_clue1'] = hunt.lang.en.clues[1];
    gameStrings['scavenger_clue2'] = hunt.lang.en.clues[2];
    gameStrings['scavenger_clue3'] = hunt.lang.en.clues[3];
    gameStrings['scavenger_clue4'] = hunt.lang.en.clues[4];
    gameStrings['scavenger_clue5'] = hunt.lang.en.clues[5];
    gameStrings['scavenger_clue6'] = hunt.lang.en.clues[6];
    gameStrings['scavenger_clue7'] = hunt.lang.en.clues[7];
  }

  const json = {
    "lang": [
      [
        "w.pufflecare.manual.toc.title",
        "Contents"
      ],
      [
        "w.pufflecare.manual.toc.personalities",
        "Puffle Species"
      ],
      [
        "w.pufflecare.manual.toc.type.blue",
        "Blue"
      ],
      [
        "w.pufflecare.manual.toc.about",
        "About Puffles"
      ],
      [
        "w.pufflecare.manual.toc.card",
        "Puffle Card"
      ],
      [
        "w.pufflecare.manual.toc.fun",
        "Puffle Fun"
      ],
      [
        "w.pufflecare.manual.whatis.title",
        "What Is A Puffle?"
      ],
      [
        "w.pufflecare.manual.whatis.description1",
        "Puffles are small, round, furry creatures. Each color is unique. And they make great pets!\n\nMost species are native to the wilds of Club Penguin, but some were discovered far away."
      ],
      [
        "w.pufflecare.manual.description.label.personality",
        "Personality"
      ],
      [
        "w.pufflecare.manual.description.label.toys",
        "Toys"
      ],
      [
        "w.pufflecare.manual.description.label.observed",
        "Observed\nin the Wild"
      ],
      [
        "w.pufflecare.manual.description.label.favoritesnacks",
        "Favorite Snack"
      ],
      [
        "w.pufflecare.manual.description.label.bestgame",
        "Best Game"
      ],
      [
        "w.pufflecare.manual.description.label.coolfact",
        "Cool Fact"
      ],
      [
        "w.pufflecare.care.purchase.prompt",
        "Would you like to purchase a new puffle?"
      ],
      [
        "w.puffleadoption.quiz.entry.title",
        "Puffle Quiz"
      ],
      [
        "w.puffleadoption.quiz.entry.subtext",
        "Which puffle is the most like you?"
      ],
      [
        "w.puffleadoption.selected.stats.title",
        "Stats"
      ],
      [
        "w.puffleadoption.selected.stats.name",
        "Name"
      ],
      [
        "w.puffleadoption.selected.stats.weight",
        "Weight"
      ],
      [
        "w.puffleadoption.selected.stats.attitude",
        "Personality"
      ],
      [
        "w.puffleadoption.selected.stats.favoritetoy",
        "Toy"
      ],
      [
        "w.puffleadoption.selected.stats.favoritegame",
        "Favorite Game"
      ],
      [
        "w.puffleadoption.selected.stats.adoptbutton",
        "Adopt"
      ],
      [
        "w.puffleadoption.dialog.namepuffle.title",
        "Ready to adopt\nyour new puffle?"
      ],
      [
        "w.puffleadoption.dialog.namepuffle.nameideas",
        "Name Ideas"
      ],
      [
        "w.puffleadoption.dialog.costincludes.title",
        "Adopt"
      ],
      [
        "w.puffleadoption.dialog.costincludes.feeding",
        "Feeding"
      ],
      [
        "w.puffleadoption.dialog.costincludes.bathing",
        "Bathing"
      ],
      [
        "w.puffleadoption.dialog.costincludes.grooming",
        "Grooming"
      ],
      [
        "w.puffleadoption.dialog.costincludes.manual",
        "Manual"
      ],
      [
        "w.puffleadoption.dialog.costincludes.agreement",
        "I, %0% agree to adopt %1% for 400 coins."
      ],
      [
        "w.puffleadoption.dialog.costincludes.coins",
        "You currently have %0% coins."
      ],
      [
        "w.puffleadoption.dialog.costincludes.yes",
        "Yes"
      ],
      [
        "w.puffleadoption.dialog.costincludes.no",
        "No"
      ],
      [
        "w.puffleadoption.dialog.completeaction.walk",
        "Walk"
      ],
      [
        "w.puffleadoption.dialog.completeaction.igloo",
        "Igloo"
      ],
      [
        "w.puffleadoption.quiz.exit.subtext",
        "you'd make a great %0% puffle owner."
      ],
      [
        "w.puffleadoption.dialog.maintitle",
        "Adopt"
      ],
      [
        "w.puffleadoption.dialog.costincludes.agree",
        "I, %0% agree to adopt %1% for 400 coins."
      ],
      [
        "w.puffleadoption.dialog.costincludes.prompt",
        "Ready to adopt your new healthy, happy puffle?"
      ],
      [
        "w.puffleadoption.buttontext",
        "Adopt"
      ],
      [
        "w.puffleadoption.selected.attitude.red",
        "Adventerous, extreme"
      ],
      [
        "w.puffleadoption.selected.attitude.pink",
        "Sporty, cheery"
      ],
      [
        "w.puffleadoption.selected.attitude.purple",
        "Fabulous, particular"
      ],
      [
        "w.puffleadoption.selected.attitude.black",
        "Intense, strong"
      ],
      [
        "w.puffleadoption.selected.attitude.green",
        "Playful, funny"
      ],
      [
        "w.puffleadoption.selected.attitude.white",
        "Shy, powerful, gentle"
      ],
      [
        "w.puffleadoption.selected.attitude.yellow",
        "Creative, spontaneous"
      ],
      [
        "w.puffleadoption.selected.attitude.orange",
        "Curious, unpredictable, zany"
      ],
      [
        "w.puffleadoption.selected.attitude.brown",
        "Super smart, inventive"
      ],
      [
        "w.puffleadoption.selected.attitude.blue",
        "Loyal, content, team player"
      ],
      [
        "w.pufflecare.manual.card.description.blue",
        "TBD"
      ],
      [
        "w.pufflecare.manual.card.description1",
        "Your puffle will let you know when it is happy, sad, tired or hungry."
      ],
      [
        "w.pufflecare.manual.card.description2",
        "Click the Food tab to feed it, the Play tab to get its toys, or the Care tab to groom, walk, or ask your puffle to sleep."
      ],
      [
        "w.pufflecare.manual.card.description3",
        "If you want to look at the Handbook or read\/print your pet's Adoption Certificate, click \"Pet Papers\"."
      ],
      [
        "w.pufflecare.manual.card.description4",
        "If you care for your puffle, it'll be in your igloo. If it isn't happy and healthy, it will return to its natural habitat."
      ],
      [
        "w.pufflecare.manual.card.label.care",
        "Care"
      ],
      [
        "w.pufflecare.manual.card.label.certificate",
        "Certificate"
      ],
      [
        "w.pufflecare.manual.card.label.feed",
        "Feed"
      ],
      [
        "w.pufflecare.manual.card.label.handbook",
        "Handbook"
      ],
      [
        "w.pufflecare.manual.card.label.play",
        "Play"
      ],
      [
        "w.pufflecare.manual.card.label.petPapers",
        "Pet Papers"
      ],
      [
        "w.pufflecare.manual.card.title",
        "Caring for your Puffle"
      ],
      [
        "w.pufflecare.manual.playing.title",
        "Play"
      ],
      [
        "w.pufflecare.manual.health.treasure.description1",
        "Puffles can dig up coins around the island. So walk a puffle wherever you go!\n\nThe longer you've cared for your puffle, the more it will find!"
      ],
      [
        "w.pufflecare.manual.playing.game.catchinwaves",
        "Catchin' Waves"
      ],
      [
        "w.pufflecare.manual.playing.game.dancecontest",
        "Dance Contest"
      ],
      [
        "w.pufflecare.manual.playing.game.aquagrabber",
        "Aqua Grabber"
      ],
      [
        "w.pufflecare.manual.playing.game.dj3k",
        "DJ3K"
      ],
      [
        "w.pufflecare.manual.playing.game.cartsurfer",
        "Cart Surfer"
      ],
      [
        "w.pufflecare.manual.playing.game.jetpack",
        "Jet Pack Adventure"
      ],
      [
        "w.pufflecare.manual.health.walking.title",
        "Walk"
      ],
      [
        "w.pufflecare.manual.health.walking.description1",
        "Puffles love to walk with you, one at a time. They'll even dance when you do!"
      ],
      [
        "w.pufflecare.manual.health.treasure.title",
        "Treasure"
      ],
      [
        "w.pufflecare.manual.playing.description",
        "Puffles love to play in your igloo. Give them their favorite toy! Or decorate with puffle furniture!"
      ],
      [
        "w.pufflecare.manual.toc.type.red",
        "Red"
      ],
      [
        "w.pufflecare.manual.toc.type.pink",
        "Pink"
      ],
      [
        "w.pufflecare.manual.toc.type.purple",
        "Purple"
      ],
      [
        "w.pufflecare.manual.toc.type.black",
        "Black"
      ],
      [
        "w.pufflecare.manual.toc.type.green",
        "Green"
      ],
      [
        "w.pufflecare.manual.toc.type.white",
        "White"
      ],
      [
        "w.pufflecare.manual.toc.type.yellow",
        "Yellow"
      ],
      [
        "w.pufflecare.manual.toc.type.orange",
        "Orange"
      ],
      [
        "w.pufflecare.manual.toc.type.brown",
        "Brown"
      ],
      [
        "w.pufflecare.manual.toc.care",
        "Care"
      ],
      [
        "w.pufflecare.manual.toc.games",
        "Games"
      ],
      [
        "w.pufflecare.manual.toc.playing",
        "Play"
      ],
      [
        "w.pufflecare.manual.toc.walking",
        "Walk"
      ],
      [
        "w.pufflecare.manual.handbook.description.blue",
        "They're known for their awesome team work. Few realize that each week blue puffles eat their weight in cookies."
      ],
      [
        "w.pufflecare.manual.handbook.description.red",
        "From the wilds of Rockhopper Island, they love adventure. Puffle experts wonder what secrets they hold."
      ],
      [
        "w.pufflecare.manual.handbook.description.pink",
        "It is said that the pink puffle's fur can hold 30 times its weight in water."
      ],
      [
        "w.pufflecare.manual.handbook.description.purple",
        "The flash of a disco ball transforms this stylish puffle into a powerful dance force."
      ],
      [
        "w.pufflecare.manual.handbook.description.black",
        "Although mostly quiet, sudden fiery outbursts show there is more to these intense creatures than meets the eye."
      ],
      [
        "w.pufflecare.manual.handbook.description.green",
        "Are experts on unicycles. They are\nalso known for their love of\nApril Fool's parties."
      ],
      [
        "w.pufflecare.manual.handbook.description.white",
        "It may be smaller than all other puffles, but its power is unmeasurable"
      ],
      [
        "w.pufflecare.manual.handbook.description.yellow",
        "It is rumored that the yellow puffle creates artwork from food and furniture."
      ],
      [
        "w.pufflecare.manual.handbook.description.orange",
        "This species has teeth strong enough to demolish petrified Puffle O's. And everything else."
      ],
      [
        "w.pufflecare.manual.handbook.description.brown",
        "It is documented that the brown puffle blinks more than all other puffles. Its dreams have graph paper backgrounds."
      ],
      [
        "w.pufflecare.manual.description.value.personality.blue",
        "Loyal, team player"
      ],
      [
        "w.pufflecare.manual.description.value.personality.red",
        "Adventurous, extreme"
      ],
      [
        "w.pufflecare.manual.description.value.personality.pink",
        "Athletic, cheery"
      ],
      [
        "w.pufflecare.manual.description.value.personality.purple",
        "Fabulous, particular"
      ],
      [
        "w.pufflecare.manual.description.value.personality.black",
        "Intense, strong"
      ],
      [
        "w.pufflecare.manual.description.value.personality.green",
        "Playful, funny"
      ],
      [
        "w.pufflecare.manual.description.value.personality.white",
        "Shy, powerful, gentle "
      ],
      [
        "w.pufflecare.manual.description.value.personality.yellow",
        "Creative, spontaneous"
      ],
      [
        "w.pufflecare.manual.description.value.personality.orange",
        "Curious, zany"
      ],
      [
        "w.pufflecare.manual.description.value.personality.brown",
        "Smart, inventive"
      ],
      [
        "w.pufflecare.manual.description.value.toys.blue",
        "Ball, snowballs"
      ],
      [
        "w.pufflecare.manual.description.value.toys.red",
        "Bowling pins, cannon"
      ],
      [
        "w.pufflecare.manual.description.value.toys.pink",
        "Skipping rope, snorkel, trampoline"
      ],
      [
        "w.pufflecare.manual.description.value.toys.purple",
        "Disco ball, bubble wand"
      ],
      [
        "w.pufflecare.manual.description.value.toys.black",
        "Skateboard"
      ],
      [
        "w.pufflecare.manual.description.value.toys.green",
        "Propeller Cap, unicycle"
      ],
      [
        "w.pufflecare.manual.description.value.toys.white",
        "Ice skates, snowflakes"
      ],
      [
        "w.pufflecare.manual.description.value.toys.yellow",
        "Paintbrush, easel"
      ],
      [
        "w.pufflecare.manual.description.value.toys.orange",
        "Box, wagon, truck"
      ],
      [
        "w.pufflecare.manual.description.value.toys.brown",
        "Beakers, rockets"
      ],
      [
        "w.pufflecare.manual.description.value.observed.blue",
        "Rallying teams together"
      ],
      [
        "w.pufflecare.manual.description.value.observed.red",
        "Hunting for buried treasure"
      ],
      [
        "w.pufflecare.manual.description.value.observed.pink",
        "Using bubblegum to float"
      ],
      [
        "w.pufflecare.manual.description.value.observed.black",
        "Bursting into flames after eating Puffle O's"
      ],
      [
        "w.pufflecare.manual.description.value.observed.green",
        "Vacuums up cookies\nwith its mouth"
      ],
      [
        "w.pufflecare.manual.description.value.observed.yellow",
        "Makes music that gets everyone dancing"
      ],
      [
        "w.pufflecare.manual.description.value.observed.purple",
        "Choosing just the right outfit for just the right occasion"
      ],
      [
        "w.pufflecare.manual.description.value.observed.white",
        "Freezes liquid at will"
      ],
      [
        "w.pufflecare.manual.description.value.observed.orange",
        "Making quick decisions"
      ],
      [
        "w.pufflecare.manual.description.value.observed.brown",
        "Superior machine\nbuilding skills"
      ],
      [
        "w.pufflecare.manual.description.label.favoriteplace",
        "Favorite Place"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.blue",
        "Pretzels"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.red",
        "Stinky cheese"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.pink",
        "Watermelon"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.black",
        "Fish burger"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.green",
        "Tacos"
      ],
      [
        "w.pufflecare.manual.description.value.favoriteactivity.yellow",
        "Performing and creating"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.purple",
        "Hummus and pita"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.white",
        "Yogurt parfait"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.orange",
        "Socks"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.brown",
        "Astronaut ice cream"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.blue",
        "Can bounce really high"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.red",
        "Originally from\nRockhopper Island"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.pink",
        "Loves to exercise and swim"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.black",
        "Super good at skateboarding"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.green",
        "Laughs an average of 14.7 times a day"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.yellow",
        "Wears a beret to paint"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.purple",
        "Uses a sleep mask for beauty rest"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.white",
        "Slightly smaller than\nother species"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.orange",
        "Rumored to eat fridges whole"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.brown",
        "Afraid of balloons"
      ],
      [
        "w.pufflecare.manual.description.value.bestgame.red",
        "Catchin' Waves"
      ],
      [
        "w.pufflecare.manual.description.value.bestgame.pink",
        "Aqua Grabber"
      ],
      [
        "w.pufflecare.manual.description.value.bestgame.black",
        "Cart Surfer"
      ],
      [
        "w.pufflecare.manual.description.value.bestgame.yellow",
        "DJ3K"
      ],
      [
        "w.pufflecare.manual.description.value.bestgame.purple",
        "Dance Contest"
      ],
      [
        "w.pufflecare.manual.description.value.favoriteplace.blue",
        "Snow Forts"
      ],
      [
        "w.pufflecare.care.return.prompt",
        "Are you sure you want to return %0% to its natural habitat?"
      ],
      [
        "w.pufflecare.care.return.success",
        "Your puffle was returned successfully."
      ],
      [
        "w.pufflecare.care.return.ok",
        "Ok"
      ],
      [
        "w.puffleadoption.dialog.yourcoins",
        "Your coins:\n%0%"
      ],
      [
        "w.pufflecare.certificate.thiscertifies",
        "This certifies that"
      ],
      [
        "w.pufflecare.certificate.belongsto",
        "belongs to: %0%"
      ],
      [
        "w.pufflecare.certificate.adoptedon",
        "Adopted on: %0% %1%\/%2%"
      ],
      [
        "w.puffleadoption.dialog.completeaction.prompt",
        "Do you want to take %0% for a walk or back to your igloo?"
      ],
      [
        "w.pufflecare.manual.description.value.favoriteplace.orange",
        "Pizza Parlor"
      ],
      [
        "w.pufflecare.manual.description.value.favoriteplace.white",
        "The Dojo"
      ],
      [
        "w.pufflecare.manual.description.value.bestgame.green",
        "Jet Pack Adventure"
      ],
      [
        "w.puffleadoption.oops.button.buymembership",
        "Buy a membership"
      ],
      [
        "w.puffleadoption.oops.button.print",
        "Print"
      ],
      [
        "w.puffleadoption.oops.message",
        "To adopt and care for more than 2 puffles, you must \rbecome a member. \r\rWe'd love to have you join!"
      ],
      [
        "w.puffleadoption.oops.title",
        "OOPS!"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.yellow",
        "Popcorn"
      ],
      [
        "w.app.dialog.error.button.ok",
        "Ok"
      ],
      [
        "w.app.dialog.error.button.learnmore",
        "Learn More"
      ],
      [
        "w.pufflecare.manual.whatis.description2",
        "Everyone can adopt 2 puffles (red and blue).\nAnd members can adopt every color\n- up to %0%!"
      ],
      [
        "w.app.error.message.timeout",
        "Auto Disconnect, your penguin has been idle for more than 10 minutes"
      ],
      [
        "w.app.error.message.notenoughcoins",
        "You need more coins"
      ],
      [
        "w.app.error.message.multiconnections",
        "You can only have one Club Penguin window open at a time. Please close any other windows and tabs in your internet browser to connect."
      ],
      [
        "w.app.error.message.connectionlost",
        "The connection has been lost.\nThank you for playing Club Penguin.\nWaddle on!"
      ],
      [
        "w.puffleadoption.dialog.findoutmore",
        "Find out more"
      ],
      [
        "w.puffleadoption.dialog.done",
        "Done"
      ],
      [
        "w.app.error.message.nameunavailable",
        "Sorry, that name is unavailable!"
      ],
      [
        "w.app.error.message.toomanypuffles",
        "You already own the maximum number of puffles!"
      ],
      [
        "aqua_find",
        "%name% is playing Aqua Grabber"
      ],
      [
        "astro_find",
        "%name% is playing Astro Barrier"
      ],
      [
        "beans_find",
        "%name% is playing Bean Counters"
      ],
      [
        "cart_find",
        "%name% is Cart Surfing"
      ],
      [
        "fish_find",
        "%name% is Ice Fishing"
      ],
      [
        "jetpack_find",
        "%name% is flying a Jet Pack"
      ],
      [
        "thinice_find",
        "%name% is playing Thin Ice"
      ],
      [
        "waves_find",
        "%name% is Surfing"
      ],
      [
        "hydro_find",
        "%name% is playing Hydro Hopper"
      ],
      [
        "pizzatron_find",
        "%name% is making pizzas"
      ],
      [
        "roundup_find",
        "%name% is rounding up puffles"
      ],
      [
        "mancala_find",
        "%name% is playing Manacala"
      ],
      [
        "four_find",
        "%name% is playing Find Four"
      ],
      [
        "sled_find",
        "%name% is in a Sled Race"
      ],
      [
        "book1_find",
        "%name% is reading a Book"
      ],
      [
        "book2_find",
        "%name% is reading a Book"
      ],
      [
        "book3_find",
        "%name% is reading a Book"
      ],
      [
        "mixmaster_find",
        "%name% is Mixing Music"
      ],
      [
        "treasurehunt_find",
        "%name% is digging for treasure"
      ],
      [
        "balloon_find",
        "%name% is playing Balloon Pop"
      ],
      [
        "bell_find",
        "%name% is playing Ring The Bell"
      ],
      [
        "feed_find",
        "%name% is playing Feed-A-Puffle"
      ],
      [
        "memory_find",
        "%name% is playing Memory Card Game"
      ],
      [
        "paddle_find",
        "%name% is playing Puffle Paddle"
      ],
      [
        "shuffle_find",
        "%name% is playing Puffle Shuffle"
      ],
      [
        "soaker_find",
        "%name% is playing Puffle Soaker"
      ],
      [
        "spin_find",
        "%name% is playing Spin To Win"
      ],
      [
        "card_find",
        "%name% is playing Card-Jitsu"
      ],
      [
        "fire_find",
        "%name% is playing Card-Jitsu Fire"
      ],
      [
        "water_find",
        "%name% is playing Card-Jitsu Water"
      ],
      [
        "sensei_find",
        "%name% is challenging the Sensei"
      ],
      [
        "firesensei_find",
        "%name% is challenging the Sensei"
      ],
      [
        "watersensei_find",
        "%name% is challenging the Sensei"
      ],
      [
        "dancing_find",
        "%name% is in a Dance Contest!"
      ],
      [
        "rescue_find",
        "%name% is Rescuing Puffles"
      ],
      [
        "systemdefend_find",
        "%name% is playing System Defender"
      ],
      [
        "bitsandbolts_find",
        "%name% is playing Bits and Bolts"
      ],
      [
        "mission1_find",
        "%name% is on an Adventure"
      ],
      [
        "mission2_find",
        "%name% is on an Adventure"
      ],
      [
        "mission3_find",
        "%name% is on an Adventure"
      ],
      [
        "mission4_find",
        "%name% is on an Adventure"
      ],
      [
        "mission5_find",
        "%name% is on an Adventure"
      ],
      [
        "mission6_find",
        "%name% is on an Adventure"
      ],
      [
        "mission7_find",
        "%name% is on an Adventure"
      ],
      [
        "mission8_find",
        "%name% is on an Adventure"
      ],
      [
        "mission9_find",
        "%name% is on an Adventure"
      ],
      [
        "mission10_find",
        "%name% is on an Adventure"
      ],
      [
        "mission11_find",
        "%name% is on an Adventure"
      ],
      [
        "town_find",
        "%name% is in the Town"
      ],
      [
        "coffee_find",
        "%name% is in the Coffee Shop"
      ],
      [
        "book_find",
        "%name% is in the Book Room"
      ],
      [
        "dance_find",
        "%name% is in the Dance Club"
      ],
      [
        "lounge_find",
        "%name% is in the Dance Lounge"
      ],
      [
        "shop_find",
        "%name% is in the Clothes Shop"
      ],
      [
        "village_find",
        "%name% is in the Ski Village"
      ],
      [
        "mtn_find",
        "%name% is on top of the Mountain"
      ],
      [
        "sport_find",
        "%name% is in the Sport Shop"
      ],
      [
        "plaza_find",
        "%name% is in the Plaza"
      ],
      [
        "pet_find",
        "%name% is in the Pet Shop"
      ],
      [
        "dojo_find",
        "%name% is in the Dojo"
      ],
      [
        "dojoext_find",
        "%name% is in the Dojo Courtyard"
      ],
      [
        "dojohide_find",
        "%name% is in Hiding"
      ],
      [
        "dojofire_find",
        "%name% is in the Fire Dojo"
      ],
      [
        "dojowater_find",
        "%name% is in the Water Dojo"
      ],
      [
        "pizza_find",
        "%name% is in the Pizza Parlor"
      ],
      [
        "beach_find",
        "%name% is at the Beach"
      ],
      [
        "light_find",
        "%name% is in the Lighthouse"
      ],
      [
        "beacon_find",
        "%name% is at the Lighthouse Beacon"
      ],
      [
        "ship_find",
        "%name% is on the Pirate Ship"
      ],
      [
        "shiphold_find",
        "%name% is in the Pirate Ship Hold"
      ],
      [
        "shipquarters_find",
        "%name% is in the Captain's Quarters"
      ],
      [
        "shipnest_find",
        "%name% is in the Crow's Nest"
      ],
      [
        "dock_find",
        "%name% is at the Dock"
      ],
      [
        "forts_find",
        "%name% is at the Snow Forts"
      ],
      [
        "agent_find",
        "%name% is hiding"
      ],
      [
        "agentcom_find",
        "%name% is hiding"
      ],
      [
        "agentlobbysolo_find",
        "%name% is hiding"
      ],
      [
        "agentlobbymulti_find",
        "%name% is in the Everyday Phoning Facility"
      ],
      [
        "agentvr_find",
        "%name% is hiding"
      ],
      [
        "boiler_find",
        "%name% is in the Boiler Room"
      ],
      [
        "berg_find",
        "%name% is on the Iceberg (hidden on your map)"
      ],
      [
        "cave_find",
        "%name% is in the Cave (hidden underground)"
      ],
      [
        "mine_find",
        "%name% is in the Mine (hidden underground)"
      ],
      [
        "shack_find",
        "%name% is in the Mine Shack"
      ],
      [
        "forest_find",
        "%name% is in the Forest"
      ],
      [
        "cove_find",
        "%name% is at the Cove"
      ],
      [
        "boxdimension_find",
        "%name% is in the Box Dimension"
      ],
      [
        "cavemine_find",
        "%name% is digging for gold in the Gold Mine"
      ],
      [
        "lake_find",
        "%name% is at the Hidden Lake"
      ],
      [
        "underwater_find",
        "%name% is in the Underwater Room"
      ],
      [
        "eco_find",
        "%name% is in the University"
      ],
      [
        "party99_find",
        "%name% is ???"
      ],
      [
        "igloo_find",
        "%name% is in an igloo"
      ],
      [
        "igloo_theirs_find",
        "%name% is in their igloo"
      ],
      [
        "igloo_yours_find",
        "%name% is in your igloo"
      ],
      [
        "ignore_request_prompt",
        "Would you like to add %name% to your ignore list?"
      ],
      [
        "ignore_request_sent_prompt",
        "Done"
      ],
      [
        "ignore_remove_prompt",
        "Would you like to remove %name% from your ignore list?"
      ],
      [
        "remove_done_prompt",
        "Done"
      ],
      [
        "town",
        "Town"
      ],
      [
        "coffee",
        "Coffee Shop"
      ],
      [
        "book",
        "Book Room"
      ],
      [
        "dance",
        "Dance Club"
      ],
      [
        "lounge",
        "Dance Lounge"
      ],
      [
        "shop",
        "Clothes Shop"
      ],
      [
        "village",
        "Ski Village"
      ],
      [
        "lodge",
        "Ski Lodge"
      ],
      [
        "attic",
        "Lodge Attic"
      ],
      [
        "sport",
        "Sport Shop"
      ],
      [
        "mtn",
        "Mountain"
      ],
      [
        "plaza",
        "Plaza"
      ],
      [
        "pet",
        "Pet Shop"
      ],
      [
        "dojo",
        "Dojo"
      ],
      [
        "dojoext",
        "Dojo Courtyard"
      ],
      [
        "dojohide",
        "Ninja Hideout"
      ],
      [
        "dojofire",
        "Fire Dojo"
      ],
      [
        "dojowater",
        "Water Dojo"
      ],
      [
        "pizza",
        "Pizza Parlor"
      ],
      [
        "stage",
        "Stage"
      ],
      [
        "beach",
        "Beach"
      ],
      [
        "light",
        "Lighthouse"
      ],
      [
        "beacon",
        "Beacon"
      ],
      [
        "ship",
        "Pirate Ship"
      ],
      [
        "shiphold",
        "Ship Hold"
      ],
      [
        "shipquarters",
        "Captain's Quarters"
      ],
      [
        "shipnest",
        "Crow's Nest"
      ],
      [
        "dock",
        "Dock"
      ],
      [
        "forts",
        "Snow Forts"
      ],
      [
        "rink",
        "Stadium"
      ],
      [
        "agent",
        "HQ"
      ],
      [
        "agentcom",
        "EPF Command Room"
      ],
      [
        "agentlobbysolo",
        "The Facility"
      ],
      [
        "agentlobbymulti",
        "Everyday Phoning Facility"
      ],
      [
        "agentvr",
        "VR Room"
      ],
      [
        "boiler",
        "Boiler Room"
      ],
      [
        "berg",
        "Iceberg"
      ],
      [
        "cave",
        "Cave"
      ],
      [
        "mine",
        "Mine"
      ],
      [
        "shack",
        "Mine Shack"
      ],
      [
        "forest",
        "Forest"
      ],
      [
        "cove",
        "Cove"
      ],
      [
        "boxdimension",
        "Box Dimension"
      ],
      [
        "cavemine",
        "Gold Mine"
      ],
      [
        "lake",
        "Hidden Lake"
      ],
      [
        "underwater",
        "Underwater Room"
      ],
      [
        "eco",
        "Recycling Plant"
      ],
      [
        "party18",
        "Treasure Room"
      ],
      [
        "party99",
        "???"
      ],
      [
        "buddy_online",
        "%name% is online"
      ],
      [
        "buddy_request_prompt",
        "Would you like to add %name% as your Friend?"
      ],
      [
        "buddy_request_sent_prompt",
        "Request Sent"
      ],
      [
        "buddy_remove_prompt",
        "Are you sure you want to remove this friend?"
      ],
      [
        "buddy_question_prompt",
        "%name% has asked to be your buddy. Do you accept?"
      ],
      [
        "buddy_accepted_prompt",
        "%name% is now your buddy!"
      ],
      [
        "Loading Create Penguin",
        "Loading Create Penguin"
      ],
      [
        "Loading Engine",
        "Loading Engine"
      ],
      [
        "Loading Interface",
        "Loading Interface"
      ],
      [
        "Loading Gridview",
        "Loading Gridview"
      ],
      [
        "Loading Mail",
        "Loading Mail"
      ],
      [
        "Loading Clothing",
        "Loading Clothing"
      ],
      [
        "Loading Your Inventory",
        "Loading Your Inventory"
      ],
      [
        "Loading Local Language",
        "Loading Local Language"
      ],
      [
        "load_igloo",
        "Loading the Igloo"
      ],
      [
        "unlock_igloo_prompt",
        "Would you like to open your igloo?\nThis will add your igloo to the map."
      ],
      [
        "energy",
        "Energy"
      ],
      [
        "health",
        "Health"
      ],
      [
        "rest",
        "Rest"
      ],
      [
        "play_puffle_hint",
        "Play with Pet"
      ],
      [
        "feed_puffle_hint",
        "Feed your Pet"
      ],
      [
        "rest_puffle_hint",
        "Sleep"
      ],
      [
        "walk_puffle_hint",
        "Walk your Pet"
      ],
      [
        "Loading Your Furniture",
        "Loading Your Furniture"
      ],
      [
        "Stop Edit",
        "Stop Edit"
      ],
      [
        "Edit Igloo",
        "Edit Igloo"
      ],
      [
        "Loading Controls",
        "Loading Controls"
      ],
      [
        "Loading Furniture",
        "Loading Furniture"
      ],
      [
        "Loading Floor",
        "Loading Floor"
      ],
      [
        "Lock Igloo",
        "Close Igloo"
      ],
      [
        "Unlock Igloo",
        "Open Igloo"
      ],
      [
        "View Items",
        "View Items"
      ],
      [
        "Buy Items",
        "Buy Items"
      ],
      [
        "Upgrade Igloo",
        "Upgrade Igloo"
      ],
      [
        "Play Music",
        "Play Music"
      ],
      [
        "Save Igloo",
        "Save Igloo"
      ],
      [
        "All",
        "All"
      ],
      [
        "Enter Contest",
        "Enter Contest"
      ],
      [
        "View Stored Igloo",
        "View Stored Igloo"
      ],
      [
        "buddy_list",
        "Your Friends"
      ],
      [
        "online_list",
        "Users in Room"
      ],
      [
        "ignore_list",
        "Ignore List"
      ],
      [
        "archives_hint",
        "Old news"
      ],
      [
        "aqua_hint",
        "Aqua Grabber"
      ],
      [
        "astro_hint",
        "Astro Barrier"
      ],
      [
        "beans_hint",
        "Play Beans"
      ],
      [
        "cart_hint",
        "Cart Surfer"
      ],
      [
        "fish_hint",
        "Go Fishing"
      ],
      [
        "jetpack_hint",
        "Play Jet Pack"
      ],
      [
        "thinice_hint",
        "Thin Ice"
      ],
      [
        "waves_hint",
        "Go Surfing"
      ],
      [
        "hydro_hint",
        "Hydro Hopper"
      ],
      [
        "pizzatron_hint",
        "Play Pizzatron"
      ],
      [
        "roundup_hint",
        "Puffle Roundup"
      ],
      [
        "mancala_hint",
        "Play Mancala"
      ],
      [
        "four_hint",
        "Play Find Four"
      ],
      [
        "sled_hint",
        "Join Sled Race"
      ],
      [
        "mixmaster_hint",
        "Mix Music"
      ],
      [
        "treasurehunt_hint",
        "Treasure Hunt"
      ],
      [
        "balloon_hint",
        "Balloon Pop"
      ],
      [
        "bell_hint",
        "Ring The Bell"
      ],
      [
        "feed_hint",
        "Feed-A-Puffle"
      ],
      [
        "memory_hint",
        "Memory Game"
      ],
      [
        "paddle_hint",
        "Puffle Paddle"
      ],
      [
        "shuffle_hint",
        "Puffle Shuffle"
      ],
      [
        "soaker_hint",
        "Puffle Soaker"
      ],
      [
        "spin_hint",
        "Spin To Win"
      ],
      [
        "card_hint",
        "Practice Card-Jitsu"
      ],
      [
        "fire_hint",
        "Practice Card-Jitsu Fire"
      ],
      [
        "water_hint",
        "Practice Card-Jitsu Water"
      ],
      [
        "dancing_hint",
        "Dance Contest"
      ],
      [
        "rescue_hint",
        "Puffle Rescue"
      ],
      [
        "systemdefend_hint",
        "System Defender"
      ],
      [
        "bitsandbolts",
        "Bits and Bolts"
      ],
      [
        "profile_hint",
        "Find Player"
      ],
      [
        "send_mail_hint",
        "Send Mail"
      ],
      [
        "free_item_hint",
        "Free Gift"
      ],
      [
        "report_player_hint",
        "Report Player"
      ],
      [
        "add_ignore_hint",
        "Ignore Player"
      ],
      [
        "remove_ignore_hint",
        "Remove Ignore"
      ],
      [
        "add_buddy_hint",
        "Add Friend"
      ],
      [
        "remove_buddy_hint",
        "Remove Friend"
      ],
      [
        "visit_home_hint",
        "Visit Igloo"
      ],
      [
        "ban_player_hint",
        "Ban Player"
      ],
      [
        "mute_player_hint",
        "Mute Player"
      ],
      [
        "kick_player_hint",
        "Kick Player"
      ],
      [
        "remove_hint",
        "Clear Penguin"
      ],
      [
        "town_hint",
        "Town"
      ],
      [
        "coffee_hint",
        "Coffee Shop"
      ],
      [
        "book_hint",
        "Book Room"
      ],
      [
        "dance_hint",
        "Dance Club"
      ],
      [
        "lounge_hint",
        "Lounge"
      ],
      [
        "shop_hint",
        "Clothes Shop"
      ],
      [
        "village_hint",
        "Ski Village"
      ],
      [
        "sport_hint",
        "Sport Shop"
      ],
      [
        "lodge_hint",
        "Ski Lodge"
      ],
      [
        "attic_hint",
        "Lodge Attic"
      ],
      [
        "mtn_hint",
        "Ski Hill"
      ],
      [
        "plaza_hint",
        "The Plaza"
      ],
      [
        "pet_hint",
        "Pet Shop"
      ],
      [
        "dojo_hint",
        "Dojo"
      ],
      [
        "dojoext_hint",
        "Dojo Courtyard"
      ],
      [
        "dojowater_hint",
        "Pizza Parlor"
      ],
      [
        "stage_hint",
        "Stage"
      ],
      [
        "beach_hint",
        "The Beach"
      ],
      [
        "light_hint",
        "Lighthouse"
      ],
      [
        "beacon_hint",
        "Beacon"
      ],
      [
        "ship_hint",
        "Pirate Ship"
      ],
      [
        "shiphold_hint",
        "Hold"
      ],
      [
        "shipquarters_hint",
        "Captain's Quarters"
      ],
      [
        "shipnest_hint",
        "Crow's Nest"
      ],
      [
        "dock_hint",
        "The Dock"
      ],
      [
        "forts_hint",
        "Snow Forts"
      ],
      [
        "rink_hint",
        "Stadium"
      ],
      [
        "agentcom_hint",
        "EPF Command Room"
      ],
      [
        "agentlobbysolo_hint",
        "Facility"
      ],
      [
        "agentlobbymulti_hint",
        "Everyday Phoning Facility"
      ],
      [
        "agentvr_hint",
        "VR Room"
      ],
      [
        "boiler_hint",
        "Boiler Room"
      ],
      [
        "berg_hint",
        "Iceberg"
      ],
      [
        "cave_hint",
        "Cave"
      ],
      [
        "mine_hint",
        "Mine"
      ],
      [
        "shack_hint",
        "Mine Shack"
      ],
      [
        "forest_hint",
        "Forest"
      ],
      [
        "cove_hint",
        "Cove"
      ],
      [
        "boxdimension_hint",
        "Box Dimension"
      ],
      [
        "cavemine_hint",
        "Cave Mine"
      ],
      [
        "lake_hint",
        "Hidden Lake"
      ],
      [
        "underwater_hint",
        "Underwater Room"
      ],
      [
        "eco_hint",
        "Recycling Plant"
      ],
      [
        "party99_hint",
        "???"
      ],
      [
        "igloos_hint",
        "Member Igloos"
      ],
      [
        "all_items",
        "All Items"
      ],
      [
        "head_items",
        "Head Items"
      ],
      [
        "face_items",
        "Face Items"
      ],
      [
        "neck_items",
        "Neck Items"
      ],
      [
        "body_items",
        "Body Items"
      ],
      [
        "hand_items",
        "Hand Items"
      ],
      [
        "feet_items",
        "Feet Items"
      ],
      [
        "flag_items",
        "Pins\/Flags"
      ],
      [
        "other_items",
        "Other Items"
      ],
      [
        "photo_items",
        "Backgrounds"
      ],
      [
        "award_items",
        "Awards"
      ],
      [
        "colour_items",
        "Colors"
      ],
      [
        "teleport",
        "Teleport"
      ],
      [
        "visit_hq",
        "Visit HQ"
      ],
      [
        "emote_hint",
        "Emotes"
      ],
      [
        "action_hint",
        "Actions"
      ],
      [
        "throw_hint",
        "Snowball"
      ],
      [
        "buddy_hint",
        "Friends"
      ],
      [
        "online_hint",
        "Show Online"
      ],
      [
        "ignore_hint",
        "Show Ignored"
      ],
      [
        "player_hint",
        "Edit Player"
      ],
      [
        "home_hint",
        "Your Igloo"
      ],
      [
        "help_hint",
        "Edit Account"
      ],
      [
        "send_hint",
        "Send"
      ],
      [
        "safe_hint",
        "Chat"
      ],
      [
        "Incorrect Password",
        "Incorrect Password"
      ],
      [
        "Too many failed login attempts. Please try again later.",
        "Too many failed login attempts. Please try again later."
      ],
      [
        "Joining",
        "Joining"
      ],
      [
        "Logging in",
        "Logging in"
      ],
      [
        "Joining Players Igloo",
        "Joining Player's Igloo"
      ],
      [
        "Please Select a Server",
        "PLEASE SELECT A SERVER"
      ],
      [
        "Penguin Name:",
        "Penguin Name:"
      ],
      [
        "Password:",
        "Password:"
      ],
      [
        "Remember me on this computer",
        "Remember me on this computer"
      ],
      [
        "Remember my password",
        "Remember my password"
      ],
      [
        "Forgot your password?",
        "Forgot your password?"
      ],
      [
        "Forget my penguin",
        "Forget my penguin"
      ],
      [
        "Login as a different penguin",
        "Login as a different penguin"
      ],
      [
        "Your Suggested Servers",
        "Your Suggested Servers"
      ],
      [
        "Buddies online",
        "Buddies online"
      ],
      [
        "Amount of penguins online",
        "Amount of penguins online"
      ],
      [
        "Ultimate safe chat",
        "Ultimate safe chat"
      ],
      [
        "Parents",
        "Parents"
      ],
      [
        "Click Here",
        "Click Here"
      ],
      [
        "Don't have a penguin?",
        "Don't have a penguin?"
      ],
      [
        "Create a free account now",
        "Create a free account now"
      ],
      [
        "Play",
        "Start"
      ],
      [
        "Back",
        "Back"
      ],
      [
        "remove_all_mail_prompt",
        "This will permanently remove all postcards from %nickname%. Do you want to do this?"
      ],
      [
        "remove_single_mail_prompt",
        "Are you sure you want to recycle this postcard from %nickname%?"
      ],
      [
        "Are you sure you want to ignore %playername%?",
        "Are you sure you want to ignore %playername%?"
      ],
      [
        "This will remove all messages from %playername%. This is not undoable.",
        "This will remove all messages from %playername%. This is not undoable."
      ],
      [
        "You have %number% postcards!",
        "You have %number% postcards!"
      ],
      [
        "You have 1 postcard!",
        "You have 1 postcard!"
      ],
      [
        "You have no postcards!",
        "You have no postcards!"
      ],
      [
        "From:",
        "From:"
      ],
      [
        "New!",
        "New!"
      ],
      [
        "message",
        "message"
      ],
      [
        "Send this postcard to %0 for %1 coins?",
        "Send this postcard to %0 for %1 coins?"
      ],
      [
        "Buy and send postcards for",
        "Buy and send\npostcards for"
      ],
      [
        "Send to:",
        "Send to:"
      ],
      [
        "Failed to send Postcard. You need more coins.",
        "Failed to send Postcard.\nYou need more coins."
      ],
      [
        "This penguins mailbox is full. Your postcard could not be sent. Please try again later.",
        "This penguin's mailbox is full. Your postcard could not be sent. Please try again later."
      ],
      [
        "Postcard sent",
        "Postcard sent"
      ],
      [
        "Postcards",
        "Postcards"
      ],
      [
        "Preview Postcard",
        "Preview Postcard"
      ],
      [
        "Select a Postcard",
        "Select a Postcard"
      ],
      [
        "Send to",
        "Send To"
      ],
      [
        "Inbox",
        "Inbox"
      ],
      [
        "You have no postcards",
        "You have no postcards"
      ],
      [
        "aqua_prompt",
        "Would you like to play\nAqua Grabber?"
      ],
      [
        "astro_prompt",
        "Would you like to play\nAstro Barrier?"
      ],
      [
        "beans_prompt",
        "Would you like to play\nBean Counters?"
      ],
      [
        "jetpack_prompt",
        "Would you like to go on a\nJet Pack Adventure?"
      ],
      [
        "fish_prompt",
        "Would you like to go\nIce Fishing?"
      ],
      [
        "hydro_prompt",
        "Would you like to play\nHydro Hopper?"
      ],
      [
        "roundup_prompt",
        "Would you like to play\nPuffle Roundup?"
      ],
      [
        "mancala_prompt",
        "Would you like to join this\nMancala game?"
      ],
      [
        "four_prompt",
        "Would you like to join this\nFind Four game?"
      ],
      [
        "cart_prompt",
        "Would you like to go\nCart Surfing?"
      ],
      [
        "thinice_prompt",
        "Would you like to play\nThin Ice?"
      ],
      [
        "pizzatron_prompt",
        "Would you like to play\nPizzatron 3000?"
      ],
      [
        "waves_prompt",
        "Would you like to\ncatch some waves?"
      ],
      [
        "sled_prompt",
        "Would you like to join this\nSled race?"
      ],
      [
        "book1_prompt",
        "Would you like to read\nMy Puffle?"
      ],
      [
        "book2_prompt",
        "Would you like to read\nBurnt Out Bulbs?"
      ],
      [
        "book3_prompt",
        "Would you like to read\nLime Green Dojo Clean?"
      ],
      [
        "treasurehunt_prompt",
        "Would you like to \ndig for treasure?"
      ],
      [
        "balloon_prompt",
        "Would you like to play\nBalloon Pop?"
      ],
      [
        "bell_prompt",
        "Would you like to play\nRing The Bell?"
      ],
      [
        "feed_prompt",
        "Would you like to play\nFeed-A-Puffle?"
      ],
      [
        "memory_prompt",
        "Would you like to play\nMemory Card Game?"
      ],
      [
        "paddle_prompt",
        "Would you like to play\nPuffle Paddle?"
      ],
      [
        "shuffle_prompt",
        "Would you like to play\nPuffle Shuffle?"
      ],
      [
        "soaker_prompt",
        "Would you like to play\nPuffle Soaker?"
      ],
      [
        "spin_prompt",
        "Would you like to play Daily Spin?"
      ],
      [
        "card_prompt",
        "Would you like to practice\nCard-Jitsu?"
      ],
      [
        "fire_prompt",
        "Would you like to practice\nCard-Jitsu Fire?"
      ],
      [
        "water_prompt",
        "Would you like to practice\nCard-Jitsu Water?"
      ],
      [
        "sensei_prompt",
        "Would you like to talk\nto the Sensei?"
      ],
      [
        "firesensei_prompt",
        "Would you like to talk\nto the Sensei?"
      ],
      [
        "watersensei_prompt",
        "Would you like to talk\nto the Sensei?"
      ],
      [
        "starter_deck_prompt",
        "You need a deck of Cards to play.\nPlease see the Sensei first."
      ],
      [
        "fire_deck_prompt",
        "You need a Fire Booster Deck to play.\nPlease see the Sensei first."
      ],
      [
        "water_deck_prompt",
        "You need a Water Booster Deck to play.\nPlease see the Sensei first."
      ],
      [
        "dancing_prompt",
        "Would you like to dance?"
      ],
      [
        "rescue_prompt",
        "Would you like to play Puffle Rescue?"
      ],
      [
        "systemdefend_prompt",
        "Would you like to play System Defender?"
      ],
      [
        "bitsandbolts_prompt",
        "Would you like to play Bits and Bolts?"
      ],
      [
        "game_over0",
        "You have earned 0 coins.\nYou now have %total% coins."
      ],
      [
        "game_over1",
        "You have earned 1 coin.\nYou now have %total% coins."
      ],
      [
        "game_over2",
        "You have earned %num% coins.\nYou now have %total% coins."
      ],
      [
        "quit_game_prompt",
        "Are you sure you want to quit this game?"
      ],
      [
        "player_quit_prompt",
        "%name% has quit the game."
      ],
      [
        "tutorial_prompts",
        "Loading Tutorial Prompt"
      ],
      [
        "widget_coins",
        "Your Coins: %total%"
      ],
      [
        "coins",
        "coins"
      ],
      [
        "adopt_puffle",
        "Would you like to adopt this puffle for 400 coins?"
      ],
      [
        "name_puffle",
        "Your puffle needs a name."
      ],
      [
        "adopt_puffle_done",
        "Your new puffle is now in your igloo. Enjoy!"
      ],
      [
        "max_puffles_prompt",
        "You already own the maximum number of puffles!"
      ],
      [
        "buy_inventory",
        "Would you like to buy %name% for %cost% coins?"
      ],
      [
        "buy_furniture",
        "Would you like to buy %name% for %cost% coins?"
      ],
      [
        "buy_igloo_upgrade",
        "Would you like to buy %name% for %cost% coins?"
      ],
      [
        "buy_igloo_floor",
        "Would you like to buy %name% for %cost% coins?"
      ],
      [
        "buy_puffle_food",
        "Would you like to buy some Pet Food for 10 coins?"
      ],
      [
        "buy_puffle_bath",
        "Would you like to bathe your puffle for 5 coins?"
      ],
      [
        "buy_puffle_gum",
        "Would you like to buy some Gum for 5 coins?"
      ],
      [
        "buy_puffle_cookie",
        "Would you like to buy a Cookie for 5 coins?"
      ],
      [
        "buy_inventory_done",
        "%name%\nhas been added to your inventory."
      ],
      [
        "buy_furniture_done",
        "%name% has been added to your inventory."
      ],
      [
        "num_coins",
        "You currently have %num% coins."
      ],
      [
        "inventory_free",
        "You have found a %name%.\nWould you like to pick it up?"
      ],
      [
        "inventory_medal",
        "Would you like to get your Medal of Excellence?"
      ],
      [
        "inventory_gift",
        "Would you like to get your gift?"
      ],
      [
        "furniture_free",
        "You have found a %name%.\nWould you like to pick it up?"
      ],
      [
        "igloo_upgrade_free",
        "You have found a %name%.\nWould you like to upgrade your igloo?"
      ],
      [
        "item_in_inventory_warn",
        "You already have this item."
      ],
      [
        "tour_guide_hat_required",
        "Sorry, you must wear the tour guide\nhat to use this feature"
      ],
      [
        "igloo_activate_warn",
        "Are you sure you want to change your igloo? Your flooring will be lost. Igloo items will be saved in your inventory."
      ],
      [
        "low_coin_warn",
        "You need more coins."
      ],
      [
        "duplicate_igloo_warn",
        "You already have this item."
      ],
      [
        "duplicate_floor_warn",
        "You already have this flooring."
      ],
      [
        "White_belt",
        "White"
      ],
      [
        "Yellow_belt",
        "Yellow"
      ],
      [
        "Orange_belt",
        "Orange"
      ],
      [
        "Green_belt",
        "Green"
      ],
      [
        "Blue_belt",
        "Blue"
      ],
      [
        "Red_belt",
        "Red"
      ],
      [
        "Purple_belt",
        "Purple"
      ],
      [
        "Brown_belt",
        "Brown"
      ],
      [
        "Black_belt",
        "Black"
      ],
      [
        "Blue",
        "Blue"
      ],
      [
        "Pink",
        "Pink"
      ],
      [
        "Black",
        "Black"
      ],
      [
        "Green",
        "Green"
      ],
      [
        "Purple",
        "Purple"
      ],
      [
        "Red",
        "Red"
      ],
      [
        "Yellow",
        "Yellow"
      ],
      [
        "White",
        "White"
      ],
      [
        "Orange",
        "Orange"
      ],
      [
        "Brown",
        "Brown"
      ],
      [
        "Login to Unlock Your Items",
        "Login to Unlock Your Items"
      ],
      [
        "What word is on page %0, %1 %2 from the left on line %3?",
        "What word is on page %0, %1 %2 from the left on line %3?"
      ],
      [
        "word",
        "word"
      ],
      [
        "words",
        "words"
      ],
      [
        "items remaining",
        "items remaining"
      ],
      [
        "item remaining",
        "item remaining"
      ],
      [
        "You have unlocked %number% item(s)!",
        "You have unlocked %number% item(s)!"
      ],
      [
        "You still have items to unlock. Your code is only valid once, if you quit before you finish unlocking all your items your remaining choices will be lost. Are you sure you want to quit?",
        "You still have items to unlock. Your code is only valid once, if you quit before you finish unlocking all your items your remaining choices will be lost.\nAre you sure you want to quit?"
      ],
      [
        "Are you sure you want to redeem %itemName%?",
        "Are you sure you want to redeem\n %itemName%?"
      ],
      [
        "Hello",
        "Hello"
      ],
      [
        "Congratulations! Youre done! Click Yes to see what has been added to your inventory.",
        "Congratulations! You're done! Click Yes to see what has been added to your inventory."
      ],
      [
        "You",
        "You'll need to enter %number% more Treasure Book code(s) to unlock this page."
      ],
      [
        "Puffle",
        "Puffle"
      ],
      [
        "Blue_puffle",
        "Blue"
      ],
      [
        "Pink_puffle",
        "Pink"
      ],
      [
        "Black_puffle",
        "Black"
      ],
      [
        "Green_puffle",
        "Green"
      ],
      [
        "Purple_puffle",
        "Purple"
      ],
      [
        "Red_puffle",
        "Red"
      ],
      [
        "Yellow_puffle",
        "Yellow"
      ],
      [
        "White_puffle",
        "White"
      ],
      [
        "Orange_puffle",
        "Orange"
      ],
      [
        "Brown_puffle",
        "Brown"
      ],
      [
        "golden_code_elemental_reward_title",
        "You now have the %item%!"
      ],
      [
        "You",
        "You'll need to enter %number% more code(s) to unlock this page."
      ],
      [
        "You can choose %number% more Super Exclusive item(s).",
        "You can choose %number% more Super Exclusive item(s)."
      ],
      [
        "Yes",
        "Yes"
      ],
      [
        "No",
        "No"
      ],
      [
        "Ok",
        "Ok"
      ],
      [
        "Start",
        "Start"
      ],
      [
        "Okay",
        "Okay"
      ],
      [
        "Close",
        "Close"
      ],
      [
        "Learn More",
        "Learn More"
      ],
      [
        "Login",
        "Login"
      ],
      [
        "Sign In",
        "Sign In"
      ],
      [
        "Visit Community Section",
        "Visit Community Section"
      ],
      [
        "chat_restrict",
        "a-z A-Z !?"
      ],
      [
        "Loading Localized Files",
        "Loading Localized Files"
      ],
      [
        "Loading Global Files",
        "Loading Global Files"
      ],
      [
        "Loading Content",
        "Loading Content"
      ],
      [
        "Loading Communication",
        "Loading Communication"
      ],
      [
        "Loading Login Screen",
        "Loading Login"
      ],
      [
        "Loading Music",
        "Loading Music"
      ],
      [
        "Rockhopper",
        "Rockhopper"
      ],
      [
        "Aunt Arctic",
        "Aunt Arctic"
      ],
      [
        "Cadence",
        "Cadence"
      ],
      [
        "Gary",
        "Gary"
      ],
      [
        "Franky",
        "Franky"
      ],
      [
        "Petey K",
        "Petey K"
      ],
      [
        "G Billy",
        "G Billy"
      ],
      [
        "Stompin Bob",
        "Stompin Bob"
      ],
      [
        "Sensei",
        "Sensei"
      ],
      [
        "page",
        "Page"
      ],
      [
        "new",
        "New"
      ],
      [
        "empty",
        "Empty"
      ],
      [
        "Club Penguin",
        "Club Penguin"
      ],
      [
        "am",
        "am"
      ],
      [
        "pm",
        "pm"
      ],
      [
        "hour",
        "hour"
      ],
      [
        "hours",
        "hours"
      ],
      [
        "of",
        "of"
      ],
      [
        "Loading",
        "Loading"
      ],
      [
        "ninjaprogress",
        "Loading Ninja Progress"
      ],
      [
        "Cards Collected: %0\nPower Cards: %1 of %2",
        "Cards Collected: %0\nPower Cards: %1 of %2"
      ],
      [
        "Current Belt",
        "Current Belt"
      ],
      [
        "Next Belt",
        "Next Belt"
      ],
      [
        "Current Item",
        "Current Item"
      ],
      [
        "Next Item",
        "Next Item"
      ],
      [
        "sunday",
        "Sunday"
      ],
      [
        "monday",
        "Monday"
      ],
      [
        "tuesday",
        "Tuesday"
      ],
      [
        "wednesday",
        "Wednesday"
      ],
      [
        "thursday",
        "Thursday"
      ],
      [
        "friday",
        "Friday"
      ],
      [
        "saturday",
        "Saturday"
      ],
      [
        "binoculars",
        "Loading Binoculars"
      ],
      [
        "telescope",
        "Loading Telescope"
      ],
      [
        "map_note",
        "Click where you want to go."
      ],
      [
        "map",
        "Loading Map"
      ],
      [
        "igloo_map",
        "Loading Igloo Map"
      ],
      [
        "load_penguin",
        "Loading Penguin"
      ],
      [
        "archives",
        "Loading Archives"
      ],
      [
        "load_mancala",
        "Loading Mancala"
      ],
      [
        "load_four",
        "Loading Find Four"
      ],
      [
        "load_aqua",
        "Loading Aqua Grabber"
      ],
      [
        "load_astro",
        "Loading Astro Barrier"
      ],
      [
        "load_beans",
        "Loading Beans"
      ],
      [
        "load_cart",
        "Loading Cart Surfer"
      ],
      [
        "load_fish",
        "Loading Gone Fishing"
      ],
      [
        "load_jetpack",
        "Loading Jet Pack Adventure"
      ],
      [
        "load_thinice",
        "Loading Thin Ice"
      ],
      [
        "load_waves",
        "Loading Catchin Waves"
      ],
      [
        "load_hydro",
        "Loading Hydro Hopper"
      ],
      [
        "load_pizzatron",
        "Loading Pizzatron 3000"
      ],
      [
        "load_roundup",
        "Loading Puffle Round-up"
      ],
      [
        "load_sled",
        "Loading Sled Racing"
      ],
      [
        "load_book1",
        "Loading Paint by Letters"
      ],
      [
        "load_book2",
        "Loading Paint by Letters"
      ],
      [
        "load_book3",
        "Loading Paint by Letters"
      ],
      [
        "load_treasurehunt",
        "Loading Treasure Hunt"
      ],
      [
        "load_balloon",
        "Loading Balloon Pop"
      ],
      [
        "load_bell",
        "Loading Ring The Bell"
      ],
      [
        "load_feed",
        "Loading Feed-A-Puffle"
      ],
      [
        "load_memory",
        "Loading Memory Card Game"
      ],
      [
        "load_paddle",
        "Loading Puffle Paddle"
      ],
      [
        "load_shuffle",
        "Loading Puffle Shuffle"
      ],
      [
        "load_soaker",
        "Loading Puffle Soaker"
      ],
      [
        "load_spin",
        "Loading Spin To Win"
      ],
      [
        "load_card",
        "Loading Card-Jitsu"
      ],
      [
        "load_fire",
        "Loading Card-Jitsu Fire"
      ],
      [
        "load_water",
        "Loading Card-Jitsu Water"
      ],
      [
        "load_sensei",
        "Loading the Sensei"
      ],
      [
        "load_firesensei",
        "Loading the Sensei"
      ],
      [
        "load_watersensei",
        "Loading the Sensei"
      ],
      [
        "load_dancing",
        "Clearing the dance floor..."
      ],
      [
        "load_rescue",
        "Loading Puffle Rescue"
      ],
      [
        "load_systemdefend",
        "Loading System Defender"
      ],
      [
        "load_bitsandbolts",
        "Loading Bits and Bolts"
      ],
      [
        "mancala",
        "Mancala"
      ],
      [
        "four",
        "Find Four"
      ],
      [
        "sled",
        "Sled Racing"
      ],
      [
        "treasurehunt",
        "Treasure Hunt"
      ],
      [
        "card",
        "Card-Jitsu"
      ],
      [
        "fire",
        "Card-Jitsu Fire"
      ],
      [
        "water",
        "Card-Jitsu Water"
      ],
      [
        "dancing",
        "Dance Contest"
      ],
      [
        "Settings",
        "Settings"
      ],
      [
        "Youre on %servername%",
        "You're on %servername%"
      ],
      [
        "Your penguin is %0 %1 old",
        "Your penguin is %0 %1 old"
      ],
      [
        "Mute Music",
        "Mute Music"
      ],
      [
        "Manage Account",
        "Manage Account"
      ],
      [
        "Buddies",
        "Friends"
      ],
      [
        "igloo_contest",
        "Igloo Contest"
      ],
      [
        "igloo_contest_thanks",
        "Igloo Contest"
      ],
      [
        "igloo_background",
        "Igloo Background"
      ],
      [
        "igloo_storage",
        "Igloo Storage"
      ],
      [
        "load_mission1",
        "Loading Mission"
      ],
      [
        "load_mission2",
        "Loading Mission"
      ],
      [
        "load_mission3",
        "Loading Mission"
      ],
      [
        "load_mission4",
        "Loading Mission"
      ],
      [
        "load_mission5",
        "Loading Mission"
      ],
      [
        "load_mission6",
        "Loading Mission"
      ],
      [
        "load_mission7",
        "Loading Mission"
      ],
      [
        "load_mission8",
        "Loading Mission"
      ],
      [
        "load_mission9",
        "Loading Mission"
      ],
      [
        "load_mission10",
        "Loading Mission"
      ],
      [
        "load_mission11",
        "Loading Mission"
      ],
      [
        "load_town",
        "Loading Town"
      ],
      [
        "load_coffee",
        "Loading Coffee Shop"
      ],
      [
        "load_book",
        "Loading Book Room"
      ],
      [
        "load_dance",
        "Loading Dance Club"
      ],
      [
        "load_lounge",
        "Loading Dance Lounge"
      ],
      [
        "load_shop",
        "Loading Clothes Shop"
      ],
      [
        "load_village",
        "Loading Ski Village"
      ],
      [
        "load_lodge",
        "Loading Ski Lodge"
      ],
      [
        "load_attic",
        "Loading Lodge Attic"
      ],
      [
        "load_sport",
        "Loading Sport Shop"
      ],
      [
        "load_mtn",
        "Loading Mountain"
      ],
      [
        "load_plaza",
        "Loading the Plaza"
      ],
      [
        "load_pet",
        "Loading the Pet Shop"
      ],
      [
        "load_dojo",
        "Loading the Dojo"
      ],
      [
        "load_dojoext",
        "Loading the Dojo Courtyard"
      ],
      [
        "load_dojohide",
        "Loading the Ninja Hideout"
      ],
      [
        "load_dojofire",
        "Loading the Fire Dojo"
      ],
      [
        "load_dojowater",
        "Loading Water Dojo"
      ],
      [
        "load_pizza",
        "Loading the Pizza Parlor"
      ],
      [
        "load_stage",
        "Loading the Stage"
      ],
      [
        "load_beach",
        "Loading Beach"
      ],
      [
        "load_light",
        "Loading Lighthouse"
      ],
      [
        "load_beacon",
        "Loading Beacon"
      ],
      [
        "load_ship",
        "Loading Pirate Ship"
      ],
      [
        "load_shiphold",
        "Loading Ship Hold"
      ],
      [
        "load_shipquarters",
        "Loading Captain's Quarters"
      ],
      [
        "load_shipnest",
        "Loading Crow's Nest"
      ],
      [
        "load_dock",
        "Loading the Dock"
      ],
      [
        "load_forts",
        "Loading Snow Forts"
      ],
      [
        "load_rink",
        "Loading Stadium"
      ],
      [
        "load_agent",
        "Loading HQ"
      ],
      [
        "load_agentcom",
        "Loading EPF Command Room"
      ],
      [
        "load_agentlobbysolo",
        "Loading the Facility"
      ],
      [
        "load_agentlobbymulti",
        "Loading the Phoning Facility"
      ],
      [
        "load_agentvr",
        "Loading the VR Room"
      ],
      [
        "load_boiler",
        "Loading Boiler Room"
      ],
      [
        "load_berg",
        "Loading the Iceberg"
      ],
      [
        "load_cave",
        "Loading Cave"
      ],
      [
        "load_mine",
        "Loading Mine"
      ],
      [
        "load_shack",
        "Loading Mine Shack"
      ],
      [
        "load_forest",
        "Loading Forest"
      ],
      [
        "load_cove",
        "Loading the Cove"
      ],
      [
        "load_boxdimension",
        "Loading Box Dimension"
      ],
      [
        "load_cavemine",
        "Loading Cave Mine"
      ],
      [
        "load_lake",
        "Loading the Hidden Lake"
      ],
      [
        "load_underwater",
        "Loading Underwater Room"
      ],
      [
        "load_eco",
        "Loading Recycling Plant"
      ],
      [
        "load_party11",
        "Loading"
      ],
      [
        "load_party12",
        "Loading"
      ],
      [
        "load_party18",
        "Loading"
      ],
      [
        "load_party99",
        "Loading ???"
      ],
      [
        "pins_category_title",
        "Pins"
      ],
      [
        "pin_release_date",
        "Released: %month% %day%\/%year%."
      ],
      [
        "all_stamps_category_title",
        "All Stamps"
      ],
      [
        "colour",
        "Color"
      ],
      [
        "highlight",
        "Highlight"
      ],
      [
        "pattern",
        "Pattern"
      ],
      [
        "icon",
        "Icon"
      ],
      [
        "numerator_over_denominator",
        "%0\/%1"
      ],
      [
        "total_stamps_label",
        "Total Stamps:"
      ],
      [
        "page_number",
        "Page\n%0 of %1"
      ],
      [
        "users_pins_label",
        "Your Pins:"
      ],
      [
        "recently_earned_title",
        "Your New Stamps"
      ],
      [
        "recently_earned_description",
        "These are your recently earned stamps:"
      ],
      [
        "recently_earned_congrats_single_stamp",
        "Congratulations on earning\n %0 stamp!"
      ],
      [
        "recently_earned_congrats_multiple_stamp",
        "Congratulations on earning\n %0 stamps!"
      ],
      [
        "total_stamps",
        "Total Stamps %0\/%1"
      ],
      [
        "category_stamps_label",
        "%name% Stamps:"
      ],
      [
        "category_label",
        "%name%:"
      ],
      [
        "contents_category_title",
        "Contents"
      ],
      [
        "cover",
        "Cover"
      ],
      [
        "toc_legend_title",
        "Stamp Book Guide"
      ],
      [
        "toc_legend_easy",
        "Easy"
      ],
      [
        "toc_legend_medium",
        "Medium"
      ],
      [
        "toc_legend_hard",
        "Hard"
      ],
      [
        "toc_legend_extreme",
        "Extreme"
      ],
      [
        "toc_legend_member",
        "Member Stamp"
      ],
      [
        "toc_legend_new",
        "New Stamp"
      ],
      [
        "toc_legend_edit",
        "Edit Stamp Book"
      ],
      [
        "toc_legend_save",
        "Save Stamp Book"
      ],
      [
        "ping_release_date",
        "Released: %month%\/%day%\/%year%."
      ],
      [
        "load_stampbook",
        "Loading Stampbook"
      ],
      [
        "Loading StampBook",
        "Loading Stampbook"
      ],
      [
        "end_game_earned",
        "You've earned:"
      ],
      [
        "end_game_coins_earned",
        "%num% coins"
      ],
      [
        "end_game_coins_earned_double",
        "%num% x 2 = %num_x2% coins"
      ],
      [
        "end_game_one_coin_earned",
        "1 coin"
      ],
      [
        "end_game_total_coins",
        "Your total coins: %num%"
      ],
      [
        "end_game_stamps_earned",
        "%num% of %total%"
      ],
      [
        "end_game_first_congrats",
        "Congratulations, all %game_name% stamps earned. Double coin bonus!"
      ],
      [
        "end_game_congrats",
        "Congratulations, double coin bonus!"
      ],
      [
        "end_game_howto_title",
        "Earn Stamps!"
      ],
      [
        "end_game_howto_btn",
        "How to earn stamps"
      ],
      [
        "game_name_stamps",
        "%game_name% Stamps"
      ],
      [
        "stamp_earned",
        "Stamp Earned!"
      ],
      [
        "end_game_no_coins_congrats",
        "Congratulations, all %game_name% stamps earned."
      ],
      [
        "stamp_book_hint",
        "Stamp Book"
      ],
      [
        "widget_stamps",
        "Your Stamps: %numerator%\/%denominator%"
      ],
      [
        "801_award",
        "Loading Award"
      ],
      [
        "802_award",
        "Loading Award"
      ],
      [
        "803_award",
        "Loading Award"
      ],
      [
        "804_award",
        "Loading Award"
      ],
      [
        "805_award",
        "Loading Award"
      ],
      [
        "806_award",
        "Loading Award"
      ],
      [
        "807_award",
        "Loading Forest Map"
      ],
      [
        "808_award",
        "Loading Award"
      ],
      [
        "809_award",
        "Loading Award"
      ],
      [
        "810_award",
        "Loading Award"
      ],
      [
        "811_award",
        "Loading Award"
      ],
      [
        "812_award",
        "Loading Thank You Card"
      ],
      [
        "813_award",
        "Loading Award"
      ],
      [
        "814_award",
        "Loading Award"
      ],
      [
        "815_award",
        "Loading Award"
      ],
      [
        "816_award",
        "Loading Award"
      ],
      [
        "817_award",
        "Loading Award"
      ],
      [
        "818_award",
        "Loading Award"
      ],
      [
        "819_award",
        "Loading Award"
      ],
      [
        "820_award",
        "Loading Award"
      ],
      [
        "821_award",
        "Loading Starter Deck"
      ],
      [
        "822_award",
        "Loading Award"
      ],
      [
        "823_award",
        "Loading Award"
      ],
      [
        "8000_award",
        "Loading Wood EPF Badge"
      ],
      [
        "8001_award",
        "Loading Ice EPF Badge"
      ],
      [
        "8002_award",
        "Loading Bronze EPF Badge"
      ],
      [
        "8003_award",
        "Loading Silver EPF Badge"
      ],
      [
        "8004_award",
        "Loading Gold EPF Badge"
      ],
      [
        "8005_award",
        "Loading EPF Certificate"
      ],
      [
        "8006_award",
        "Loading Fire Booster Deck"
      ],
      [
        "8007_award",
        "Loading Award"
      ],
      [
        "8008_award",
        "Loading Award"
      ],
      [
        "8010_award",
        "Loading Water Booster Deck"
      ],
      [
        "stowaway_book",
        "Loading Stowaway"
      ],
      [
        "franky_book",
        "Loading Franky"
      ],
      [
        "spice_book",
        "Loading Spice"
      ],
      [
        "dare_book",
        "Loading Dare"
      ],
      [
        "journal_book",
        "Loading Journal"
      ],
      [
        "tales07_book",
        "Loading Tales '07"
      ],
      [
        "tales08_book",
        "Loading Tales '08"
      ],
      [
        "tales09_book",
        "Loading Tales '09"
      ],
      [
        "year0506_book",
        "Loading Yearbook 05\/06"
      ],
      [
        "year0607_book",
        "Loading Yearbook 06\/07"
      ],
      [
        "year0708_book",
        "Loading Yearbook 07\/08"
      ],
      [
        "year0809_book",
        "Loading Yearbook 08\/09"
      ],
      [
        "year0910_book",
        "Loading Yearbook 09\/10"
      ],
      [
        "xmas_book2",
        "Loading Rockhopper Island"
      ],
      [
        "xmas_book3",
        "Loading Music Makes Magic"
      ],
      [
        "fairyfables",
        "Loading Fairy Fables"
      ],
      [
        "give_tour",
        "Give a Tour"
      ],
      [
        "clothing_catalogue",
        "Loading Clothing Catalog"
      ],
      [
        "costume_catalogue",
        "Loading Costume Catalog"
      ],
      [
        "sport_catalogue",
        "Loading Sport Catalog"
      ],
      [
        "hair_catalogue",
        "Loading Hair Catalog"
      ],
      [
        "fish_catalogue",
        "Loading FISH Catalog"
      ],
      [
        "pets_catalogue",
        "Loading Puffle Catalog"
      ],
      [
        "adopt_catalogue",
        "Loading Puffle Catalog"
      ],
      [
        "pirate_catalogue",
        "Loading Pirate Catalog"
      ],
      [
        "igloo_catalogue",
        "Loading Igloo Catalog"
      ],
      [
        "furniture_catalogue",
        "Loading Furniture Catalog"
      ],
      [
        "music_catalogue",
        "Loading Music Catalog"
      ],
      [
        "merch_catalogue",
        "Loading Merchandise Catalog"
      ],
      [
        "merch_catalog",
        "Loading Merchandise Catalog"
      ],
      [
        "prizebooth",
        "Loading Prize Booth"
      ],
      [
        "prizeboothmember",
        "Loading Member Prize Booth"
      ],
      [
        "ninja_catalogue",
        "Loading Ninja Catalog"
      ],
      [
        "cove_catalogue",
        "Loading Cove Catalog"
      ],
      [
        "dock_catalogue",
        "Loading Dock Catalog"
      ],
      [
        "lodge_catalogue",
        "Loading Lodge Catalog"
      ],
      [
        "mtn_catalogue",
        "Loading Ski Hill Catalog"
      ],
      [
        "lake_catalogue",
        "Loading Diving Catalog"
      ],
      [
        "dance_catalogue",
        "Loading Dance Catalog"
      ],
      [
        "party_catalogue",
        "Loading Catalog"
      ],
      [
        "light_catalogue",
        "Loading Lighthouse Catalog"
      ],
      [
        "prizeBooth",
        "Loading Member Prize Booth"
      ],
      [
        "clock_help",
        "Loading Clock Tower Plaque"
      ],
      [
        "backstage",
        "Loading Backstage Note"
      ],
      [
        "rockhopper_note",
        "Loading Rockhopper's Note"
      ],
      [
        "labcoat",
        "Loading Secret Lab Note"
      ],
      [
        "ninjabelts",
        "Loading Ninja Belts Legend"
      ],
      [
        "sensei_note",
        "Loading Sensei's Note"
      ],
      [
        "colour_poster",
        "Loading Color Poster"
      ],
      [
        "corkboard",
        "Loading Corkboard"
      ],
      [
        "take_tour",
        "Take a Tour"
      ],
      [
        "halloween_poster",
        "Haunted House Poster"
      ],
      [
        "fire_path_note",
        "Loading Sensei's Note"
      ],
      [
        "water_path_note",
        "Loading Sensei's Note"
      ],
      [
        "fireclothing",
        "Loading Fire Clothing Poster"
      ],
      [
        "waterclothing",
        "Loading Water Clothing Poster"
      ],
      [
        "maze_map",
        "Loading Maze Map"
      ],
      [
        "ninja_fire_video",
        "Loading Video"
      ],
      [
        "ninja_water_video",
        "Loading Video"
      ],
      [
        "water_path_video_flv",
        "Loading Christmas Poster"
      ],
      [
        "splunkposter",
        "Loading Dig Poster"
      ],
      [
        "splunkposter2",
        "Loading Dig Poster"
      ],
      [
        "treasurepin1",
        "Loading Treasure"
      ],
      [
        "treasurepin2",
        "Loading Treasure"
      ],
      [
        "treasurepin3",
        "Loading Treasure"
      ],
      [
        "treasurepin4",
        "Loading Treasure"
      ],
      [
        "underwater_note",
        "Loading Note"
      ],
      [
        "goldenPuffleShort",
        "Loading Video"
      ],
      [
        "rubyShort",
        "Loading Video"
      ],
      [
        "fairyFablesShort",
        "Loading Video"
      ],
      [
        "penguinsTimeShort",
        "Loading Video"
      ],
      [
        "squidzoidShort",
        "Loading Video"
      ],
      [
        "underwaterShort",
        "Loading Video"
      ],
      [
        "poster",
        "Loading Poster"
      ],
      [
        "halloweenposter",
        "Loading Recycle Poster"
      ],
      [
        "recycle_note",
        "Loading Recycle Note"
      ],
      [
        "instructions_quest",
        "Loading Quest Poster"
      ],
      [
        "InstructionsScroll",
        "Loading Ship Poster"
      ],
      [
        "InstructionsScroll2",
        "Loading Dragon Poster"
      ],
      [
        "party_poster",
        "Loading Poster"
      ],
      [
        "party_poster3",
        "Loading Poster"
      ],
      [
        "rink_poster",
        "Poster"
      ],
      [
        "party_note01",
        "Loading Note"
      ],
      [
        "party_note02",
        "Loading Note"
      ],
      [
        "party_note03",
        "Loading Note"
      ],
      [
        "party_note04",
        "Loading Note"
      ],
      [
        "party_note05",
        "Loading Note"
      ],
      [
        "earth_day_video",
        "Loading Video"
      ],
      [
        "mod_help",
        "Loading Moderator"
      ],
      [
        "egg_timer",
        "Loading Timer"
      ],
      [
        "help",
        "Loading Help"
      ],
      [
        "coins_for_change",
        "Loading Coins For Change"
      ],
      [
        "igloo_music",
        "Loading Music Menu"
      ],
      [
        "missions",
        "Loading Missions"
      ],
      [
        "agent_form",
        "Agent Form"
      ],
      [
        "news_form",
        "Newspaper Form"
      ],
      [
        "tour_form",
        "Tour Guide Form"
      ],
      [
        "report_form",
        "Report Form"
      ],
      [
        "penguintales",
        "Submission Form"
      ],
      [
        "library",
        "Loading Library"
      ],
      [
        "voting_booth",
        "Loading Voting Booth"
      ],
      [
        "ugc_wall",
        "Loading Art"
      ],
      [
        "2009iceplaque_01",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_02",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_03",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_04",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_05",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_06",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_07",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_08",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_09",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_10",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_11",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_12",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_13",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_14",
        "Loading Sculpture Plaque"
      ],
      [
        "2009iceplaque_15",
        "Loading Sculpture Plaque"
      ],
      [
        "treasurehunt_help",
        "Loading Treasure Hunt Instructions"
      ],
      [
        "mancala_help",
        "Loading Mancala Instructions"
      ],
      [
        "instructions",
        "Loading Card-Jitsu Instructions"
      ],
      [
        "fireinstructions",
        "Loading Card-Jitsu Fire Instructions"
      ],
      [
        "waterinstructions",
        "Loading Instructions"
      ],
      [
        "oops_general",
        "Loading Membership"
      ],
      [
        "oops_inventory",
        "Loading Membership"
      ],
      [
        "oops_inventory_equip",
        "Loading Membership"
      ],
      [
        "oops_furniture",
        "Loading Membership"
      ],
      [
        "oops_igloo",
        "Loading Membership"
      ],
      [
        "oops_puffle",
        "Loading Membership"
      ],
      [
        "oops_game_dance",
        "Loading Membership"
      ],
      [
        "oops_game_dance_songs",
        "Loading Membership"
      ],
      [
        "oops_game_fire",
        "Loading Membership"
      ],
      [
        "oops_game_water",
        "Loading Membership"
      ],
      [
        "oops_party_room",
        "Loading Membership"
      ],
      [
        "oops_party2_room",
        "Loading Membership"
      ],
      [
        "oops_underwater_room",
        "Loading Membership"
      ],
      [
        "oops_game_rescue_level1",
        "Loading Membership"
      ],
      [
        "oops_game_rescue_level2",
        "Loading Membership"
      ],
      [
        "oops_party3_room",
        "Loading Membership"
      ],
      [
        "oops_party4_room",
        "Loading Membership"
      ],
      [
        "oops_party5_room",
        "Loading Membership"
      ],
      [
        "oops_party6_room",
        "Loading Membership"
      ],
      [
        "oops_party11_room",
        "Loading Membership"
      ],
      [
        "oops_party12_room",
        "Loading Membership"
      ],
      [
        "oops_party13_room",
        "Loading Membership"
      ],
      [
        "oops_party14_room",
        "Loading Membership"
      ],
      [
        "oops_puffle_whistle",
        "Loading Membership"
      ],
      [
        "oops_game_astrobarrier",
        "Loading Membership"
      ],
      [
        "oops_game_jetpack",
        "Loading Membership"
      ],
      [
        "oops_game_aquagrabber",
        "Loading Membership"
      ],
      [
        "oops_game_thinice",
        "Loading Membership"
      ],
      [
        "oops_game_waves_competition",
        "Loading Membership"
      ],
      [
        "oops_game_waves_survival",
        "Loading Membership"
      ],
      [
        "stampbook_cover_storage",
        "Loading Membership"
      ],
      [
        "oops_party11_catalog",
        "Loading Membership"
      ],
      [
        "oops_puffle_pink",
        "Loading Membership"
      ],
      [
        "oops_puffle_black",
        "Loading Membership"
      ],
      [
        "oops_puffle_green",
        "Loading Membership"
      ],
      [
        "oops_puffle_yellow",
        "Loading Membership"
      ],
      [
        "oops_puffle_purple",
        "Loading Membership"
      ],
      [
        "oops_puffle_white",
        "Loading Membership"
      ],
      [
        "oops_puffle_orange",
        "Loading Membership"
      ],
      [
        "oops_puffle_brown",
        "Loading Membership"
      ],
      [
        "oops_game_puffle_launch",
        "Loading Membership"
      ],
      [
        "login_membership_14",
        "Loading Membership"
      ],
      [
        "login_membership_7",
        "Loading Membership"
      ],
      [
        "login_membership_3",
        "Loading Membership"
      ],
      [
        "login_membership_2",
        "Loading Membership"
      ],
      [
        "login_membership_1",
        "Loading Membership"
      ],
      [
        "login_membership_expired",
        "Loading Membership"
      ],
      [
        "January",
        "January"
      ],
      [
        "February",
        "February"
      ],
      [
        "March",
        "March"
      ],
      [
        "April",
        "April"
      ],
      [
        "May",
        "May"
      ],
      [
        "June",
        "June"
      ],
      [
        "July",
        "July"
      ],
      [
        "August",
        "August"
      ],
      [
        "September",
        "September"
      ],
      [
        "October",
        "October"
      ],
      [
        "November",
        "November"
      ],
      [
        "December",
        "December"
      ],
      [
        "Day",
        "day"
      ],
      [
        "Days",
        "days"
      ],
      [
        "current_news",
        "Loading Newspaper"
      ],
      [
        "old_news0",
        "Loading Last Week's Issue"
      ],
      [
        "old_news1",
        "Loading Old Issue"
      ],
      [
        "old_news2",
        "Loading Old Issue"
      ],
      [
        "old_news3",
        "Loading Old Issue"
      ],
      [
        "old_news4",
        "Loading Old Issue"
      ],
      [
        "old_news5",
        "Loading Old Issue"
      ],
      [
        "extra_interface_icons",
        "Loading Recycle Hunt"
      ],
      [
        "easter_egg_hunt",
        "Loading Recycle Hunt"
      ],
      [
        "easter_hunt",
        "Loading Recycle Hunt"
      ],
      [
        "recycle_hunt",
        "Loading Recycle Hunt"
      ],
      [
        "scavenger_hunt",
        hunt?.lang.en.loading ?? ''
      ],
      [
        "halloween_hunt",
        "Loading"
      ],
      [
        "title",
        "SILLY SCAVENGER HUNT"
      ],
      [
        "start_string",
        hunt?.lang.en.start ?? ''
      ],
      [
        "scavenger_items_found",
        hunt?.lang.en.itemsFound ?? ''
      ],
      [
        "scavenger_items_found_plural",
        hunt?.lang.en.itemsFoundPlural ?? ''
      ],
      [
        "claim_prize",
        "Claim Prize"
      ],
      [
        "continue",
        "Continue"
      ],
      [
        "agent_line1",
        " "
      ],
      [
        "agent_line2",
        " "
      ],
      [
        "agent_line3",
        " "
      ],
      [
        "agent_line4",
        " "
      ],
      [
        "agentStatus",
        "Elite Gear"
      ],
      [
        "field_ops",
        "Field-Ops"
      ],
      [
        "fieldOps",
        "Field-Ops"
      ],
      [
        "puffle",
        "Elite Puffle"
      ],
      [
        "recruit",
        "Recruit"
      ],
      [
        "Coming Soon",
        "Coming Soon"
      ],
      [
        "objectiveScreen",
        "Objective"
      ],
      [
        "epfmessage",
        "EPF Message"
      ],
      [
        "epfinitiated",
        "Congratulations"
      ],
      [
        "puffle_whistle",
        "Puffle Whistle Message"
      ],
      [
        "field_op_complete",
        "Field Op Complete"
      ],
      [
        "medal_earned",
        "Medal Earned!"
      ],
      [
        "communication",
        "Messages"
      ],
      [
        "public_computer_prompt_msg",
        "WAIT!\nDo other people use this computer?"
      ],
      [
        "save_password_warning_msg",
        "If you save your password here, anyone who uses this computer could access your account."
      ],
      [
        "save_password",
        "Save Password"
      ],
      [
        "dont_save_password",
        "Don't Save Password"
      ],
      [
        "learn_more",
        "Learn More"
      ],
      [
        "player_safety_lose_coins",
        "They could spend your coins!"
      ],
      [
        "player_safety_changed_igloo",
        "They could change your igloo!"
      ],
      [
        "player_safety_banned",
        "They could get your penguin banned!"
      ],
      [
        "max_puffle_care_item",
        "You can't store more than 99 of these items."
      ],
      [
        "percent",
        "%percentage%%"
      ],
      [
        "cannon_hint",
        "Puffle Launch"
      ],
      [
        "xmas_book1",
        "Loading Christmas Carol"
      ],
      [
        "cannon_find",
        "%name% is playing Puffle Launch"
      ],
      [
        "cannon_prompt",
        "Would you like to play Puffle Launch?"
      ],
      [
        "load_cannon",
        "Loading Puffle Launch"
      ],
      [
        "You'll need to enter %number% more Treasure Book code(s) to unlock this page.",
        "You'll need to enter %number% more Treasure Book code(s) to unlock this page."
      ],
      [
        "w.rooms.displayquality.low",
        "Best Speed"
      ],
      [
        "w.rooms.displayquality.medium",
        "Normal"
      ],
      [
        "w.rooms.displayquality.high",
        "Best Graphics"
      ],
      [
        "w.mobile.accountactivation.dialog.confirmemail.message",
        "Please confirm your parent's email address. Club Penguin will send your parent an email with an activation code."
      ],
      [
        "w.mobile.accountactivation.dialog.confirmemail.button.usethisemail",
        "Use this email"
      ],
      [
        "w.mobile.accountactivation.dialog.confirmemail.button.changeemail",
        "Change this email"
      ],
      [
        "w.mobile.accountactivation.dialog.emailchange.prompt.message",
        "Please enter your parent's valid email address. Club Penguin will send your parent an email with an activation code."
      ],
      [
        "w.app.error.message.emailaddressemptyinput",
        "The email address is not entered correctly.  Please try again."
      ],
      [
        "w.app.error.message.emailaddressmaxaccount",
        "There are too many accounts assigned to this email address to add a new one."
      ],
      [
        "w.app.error.message.emailaddressbanneddomain",
        "The given domain name is part of our banned email list. Please contact Club Penguin support if you have questions."
      ],
      [
        "w.app.error.message.emailaddresswrongformat",
        "Email is not properly formatted. Please try again."
      ],
      [
        "w.app.error.message.emailaddressplussign",
        "An email address cannot contain a '+'. Please try again."
      ],
      [
        "w.mobile.accountactivation.dialog.activationemailsent.message",
        "Before you can login, your penguin account must be activated. Ask your parents to check their email.\n\n An email has been sent to %0% with the next steps to activate your penguin."
      ],
      [
        "party_find",
        "%name% is on Santa's Sled"
      ],
      [
        "oops_game_dance_save",
        "Loading Membership"
      ],
      [
        "party2_catalogue",
        "Loading Catalogue"
      ],
      [
        "party3_catalogue",
        "Loading Catalogue"
      ],
      [
        "party2_catalogue",
        "Loading Catalog"
      ],
      [
        "party2_catalogu3",
        "Loading Catalog"
      ],
      [
        "welcomesolo",
        "Club Penguin"
      ],
      [
        "load_welcomesolo",
        "Loading Club Penguin"
      ],
      [
        "welcomesolo_find",
        "%name% is in Club Penguin"
      ],
      [
        "welcomesolo_hint",
        "Club Penguin"
      ],
      [
        "map_games_string",
        "Games"
      ],
      [
        "map_places_string",
        "Places"
      ],
      [
        "map_shop_string",
        "Shops"
      ],
      [
        "map_pets_string",
        "Pets"
      ],
      [
        "w.map.ice_fishing",
        "Ice Fishing"
      ],
      [
        "w.map.sled_racing",
        "Sled Racing"
      ],
      [
        "w.map.jet_pack_adventure",
        "Jet Pack Adventure"
      ],
      [
        "w.map.hydro_hopper",
        "Hydro Hopper"
      ],
      [
        "w.map.bean_counters",
        "Bean Counters"
      ],
      [
        "w.map.arcade",
        "Arcade"
      ],
      [
        "w.map.dance_contest",
        "Dance Contest"
      ],
      [
        "w.map.dj3k",
        "SoundStudio"
      ],
      [
        "w.map.puffle_round_up",
        "Puffle Roundup"
      ],
      [
        "w.map.pizzatron_3000",
        "Pizzatron 3000"
      ],
      [
        "w.map.puffle_launch",
        "Puffle Launch"
      ],
      [
        "w.map.cart_surfer",
        "Cart Surfer"
      ],
      [
        "w.map.puffle_rescue",
        "Puffle Rescue"
      ],
      [
        "w.map.catchin_waves",
        "Catchin' Waves"
      ],
      [
        "w.map.aqua_grabber",
        "Aqua Grabber"
      ],
      [
        "w.map.card_jitsu",
        "Card-Jitsu"
      ],
      [
        "w.map.penguin_style",
        "Penguin Style"
      ],
      [
        "w.map.costume_trunk",
        "Costume Trunk"
      ],
      [
        "w.map.pet_furniture",
        "Pet Furniture"
      ],
      [
        "w.map.tubing_upgrade",
        "Game Upgrade"
      ],
      [
        "w.map.music_catalogue",
        "Music Catalog"
      ],
      [
        "w.map.dj3k_upgrade",
        "Game Upgrade"
      ],
      [
        "w.map.fishing_upgrade",
        "Game Upgrade"
      ],
      [
        "w.map.sled_upgrade",
        "Game Upgrade"
      ],
      [
        "w.map.snow_and_sports",
        "Snow and Sports"
      ],
      [
        "w.map.surf_upgrade",
        "Game Upgrade"
      ],
      [
        "w.map.puffle_adoption",
        "Puffle Adoption"
      ],
      [
        "w.map.town",
        "Town"
      ],
      [
        "w.map.plaza",
        "The Plaza"
      ],
      [
        "w.map.dock",
        "The Dock"
      ],
      [
        "w.map.forts",
        "Snow Forts"
      ],
      [
        "w.map.beach",
        "The Beach"
      ],
      [
        "w.map.ski_village",
        "Ski Village"
      ],
      [
        "w.map.ski_hill",
        "Ski Hill"
      ],
      [
        "w.map.ice_rink",
        "Stadium"
      ],
      [
        "w.map.dojo",
        "Dojo Courtyard"
      ],
      [
        "w.map.mine_shack",
        "Mine"
      ],
      [
        "w.map.forest",
        "Forest"
      ],
      [
        "w.map.cove",
        "Cove"
      ],
      [
        "w.map.iceberg",
        "Iceberg"
      ],
      [
        "w.map.igloos",
        "Igloos"
      ],
      [
        "w.map.open_igloos",
        "Open Igloos"
      ],
      [
        "w.app.error.message.emailaddressinvalidisp",
        "%0% is not a valid email provider.  Please check the spelling and try again."
      ],
      [
        "w.redemption.treasurebook.header.label ",
        "Exclusive Bonus Items"
      ],
      [
        "w.redemption.treasurebook.superexclusive.popup.congrats ",
        "Congratulations!"
      ],
      [
        "w.redemption.treasurebook.superexclusive.popup.message ",
        "You've entered %0% codes and unlocked the Super Exclusives page, and %1% bonus items of your choice. "
      ],
      [
        "w.redemption.funnel.redeem.button.havecode ",
        "I've got a Code"
      ],
      [
        "w.redemption.funnel.redeem.button.havebook",
        "I've got a Book "
      ],
      [
        "w.redemption.funnel.redeem.message ",
        "Unlock your items. Choose an option. "
      ],
      [
        "w.redemption.funnel.code.message",
        "Enter your code! \nMake sure you enter it exactly as it appears. "
      ],
      [
        "w.redemption.funnel.book.message",
        "Choose your book from the list below "
      ],
      [
        "w.redemption.funnel.book.hint ",
        "Hint: First line starts with the title! "
      ],
      [
        "w.redemption.treasurebook.header.button.code ",
        "I've got a code "
      ],
      [
        "w.redemption.treasurebook.header.button.toys ",
        "View Toys "
      ],
      [
        "w.redemption.treasurebook.name ",
        "Exclusive Treasure Book "
      ],
      [
        "w.redemption.treasurebook.header.title",
        "Exclusive Bonus Items"
      ],
      [
        "w.redemption.congratulations.message ",
        "You've unlocked: "
      ],
      [
        "w.redemption.congratulations.button.play",
        "Play now! "
      ],
      [
        "w.redemption.congratulations.button.another",
        "Enter another code "
      ],
      [
        "w.redemption.treasurebook.prompt.codelogout",
        "To unlock your toy code, you will be logged out of the game.\nDo you want to continue? "
      ],
      [
        "w.redemption.treasurebook.prompt.toyslogout",
        "To look at toys, you will be logged out of the game.\nDo you want to continue? "
      ],
      [
        "w.redemption.onetoone.item.congrats.title",
        "Congratulations!"
      ],
      [
        "w.redemption.onetoone.item.congrats.message",
        "These items have been added to your inventory!"
      ],
      [
        "w.redemption.onetoone.item.maxitem",
        "Bonus item unlocked!\nBecause you already have [item name], you can now access a bonus Treasure Book item!"
      ],
      [
        "w.redemption.onetoone.button.unlockbonusitems",
        "Unlock Bonus Items"
      ],
      [
        "w.redemption.onetoone.puffle.maxpuffles",
        "%0% added to your inventory. You already have the max number of puffles, so you get a bonus item!"
      ],
      [
        "w.redemption.onetoone.puffle.maxpufflehats",
        "You already have the max number of hats, so you get a bonus item!"
      ],
      [
        "w.redemption.onetoone.puffle.maxpufflesandhats",
        "You already have the max number of puffles and hats, so you get 2 bonus items!"
      ],
      [
        "w.redemption.onetoone.puffle.puffleadded.message",
        "Your %0% and its exclusive %1% have been added to your igloo."
      ],
      [
        "w.redemption.onetoone.puffle.namepuffle",
        "Give your new puffle a name."
      ],
      [
        "w.redemption.login.prompt.name",
        "Enter Penguin Name"
      ],
      [
        "w.redemption.login.prompt.password",
        "Enter Password"
      ],
      [
        "w.redemption.buttons.next",
        "Next"
      ],
      [
        "w.redemption.treasurebook.header.label",
        "Exclusive Bonus Items"
      ],
      [
        "w.redemption.treasurebook.superexclusive.popup.congrats",
        "Congratulations!"
      ],
      [
        "w.redemption.treasurebook.superexclusive.popup.message",
        "You've entered %0% codes and unlocked the Super Exclusives page, and %1% bonus items of your choice."
      ],
      [
        "w.redemption.funnel.redeem.button.havecode",
        "I've got a Code"
      ],
      [
        "w.redemption.funnel.redeem.button.havebook",
        "I've got a Book"
      ],
      [
        "w.redemption.funnel.redeem.message",
        "Unlock your items. Choose an option."
      ],
      [
        "w.redemption.funnel.code.message",
        "Enter your code! \nMake sure you enter it exactly as it appears."
      ],
      [
        "w.redemption.funnel.book.message",
        "Choose your book from the list below"
      ],
      [
        "w.redemption.funnel.book.hint",
        "Hint: First line starts with the title!"
      ],
      [
        "w.redemption.treasurebook.header.button.code",
        "I've got a code"
      ],
      [
        "w.redemption.treasurebook.header.button.toys",
        "View Toys"
      ],
      [
        "w.redemption.treasurebook.name",
        "Exclusive Treasure Book"
      ],
      [
        "max_puffle_hat_item",
        "You can't store more than 75 of this item."
      ],
      [
        "w.pufflecare.care.hat.return",
        "Drag here to remove"
      ],
      [
        "treasure_book",
        "Loading Treasure Book"
      ],
      [
        "shell.REDEMPTION_PUFFLE_NAME_EMPTY",
        "Please name your puffle."
      ],
      [
        "w.redemption.onetoone.puffle.jumbopuffle",
        "Congratulations! Your %0% puffle has been added to your igloo."
      ],
      [
        "w.notification.puffle.lowstat.food",
        "needs to eat."
      ],
      [
        "w.notification.puffle.lowstat.rest",
        "needs to sleep."
      ],
      [
        "w.notification.puffle.lowstat.play",
        "wants to play."
      ],
      [
        "w.notification.puffle.lowstat.clean",
        "needs a bath."
      ],
      [
        "w.map.hide.games",
        "Hide Games"
      ],
      [
        "w.map.puffle.play.games",
        "Different colored puffles play different games."
      ],
      [
        "w.map.igloo",
        "Puffle Care"
      ],
      [
        "w.map.show.games",
        "Show Games"
      ],
      [
        "w.map.walk.puffle",
        "Walk your puffle to its favorite game to play it."
      ],
      [
        "w.pufflecare.care.food.extraInstructions",
        "Buy more food from"
      ],
      [
        "w.pufflecare.handler.next",
        "next"
      ],
      [
        "w.pufflecare.handler.speech.one",
        "G'Day!"
      ],
      [
        "w.pufflecare.handler.speech.two",
        "I'm here to show you how to care for your puffles!"
      ],
      [
        "w.pufflecare.handler.speech.three",
        "Click these tabs to:"
      ],
      [
        "w.pufflecare.handler.speech.four",
        "feed"
      ],
      [
        "w.pufflecare.handler.speech.five",
        "play"
      ],
      [
        "w.pufflecare.handler.speech.six",
        "clean"
      ],
      [
        "w.pufflecare.handler.speech.seven",
        "rest"
      ],
      [
        "w.pufflecare.handler.speech.eight",
        "When you run out of food,\n"
      ],
      [
        "w.pufflecare.handler.speech.nine",
        "click this catalog to buy more. "
      ],
      [
        "w.pufflecare.handler.speech.ten",
        "Have fun,\n"
      ],
      [
        "w.pufflecare.handler.speech.eleven",
        "and good luck!"
      ],
      [
        "w.pufflecare.handler.speech.twelve",
        "and dress your puffle."
      ],
      [
        "w.pufflecare.handler.finish",
        "done"
      ],
      [
        "w.map.walk.puffle",
        "Walk your puffle to its favorite game to play it."
      ],
      [
        "w.catalogs.pets.yourcoins",
        "YOUR COINS"
      ],
      [
        "w.pufflecare.manual.card.revamp.description1",
        "Your puffle's stats tell you when it is happy, sad, hungry, tired or messy."
      ],
      [
        "w.pufflecare.manual.card.revamp.description2",
        "Give them snacks, toys, baths, and sleep to fill their stats."
      ],
      [
        "w.pufflecare.manual.card.revamp.description3",
        "Go to Pet Papers to view\nyour Adoption Certificates."
      ],
      [
        "w.pufflecare.manual.card.revamp.description4",
        "Take your puffle for a walk and care for it at the Puffle Hotel!"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.care",
        "Care"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.certificate",
        "Adoption Certificate"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.feed",
        "Feed"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.handbook",
        "Puffle Handbook"
      ],
      [
        "w.pufflecare.manual.card.label.play",
        "Play"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.petPapers",
        "Pet Papers"
      ],
      [
        "w.pufflecare.manual.card.revamp.title",
        "Care"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.groom",
        "Groom"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.sleep",
        "Sleep"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.accessories",
        "Dress Up"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.stats",
        "Pet Stats"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.play",
        "Play"
      ],
      [
        "w.notification.puffle.lowstat.food ",
        "needs to eat."
      ],
      [
        "w.notification.puffle.lowstat.rest",
        "needs to sleep."
      ],
      [
        "w.notification.puffle.lowstat.play",
        "wants to play."
      ],
      [
        "w.notification.puffle.lowstat.clean",
        "needs a bath."
      ],
      [
        "w.map.hide.games",
        "Hide Games"
      ],
      [
        "w.map.puffle.play.games",
        "Different colored puffles play different games"
      ],
      [
        "w.map.igloo",
        "Puffle Care"
      ],
      [
        "w.map.show.games",
        "Show Games"
      ],
      [
        "w.map.walk.puffle",
        "Walk your puffle to its favorite game to play it."
      ],
      [
        "w.pufflecare.care.food.extraInstructions",
        "Buy more food from"
      ],
      [
        "w.pufflecare.handler.next",
        "next"
      ],
      [
        "w.pufflecare.handler.speech.one",
        "G'Day"
      ],
      [
        "w.pufflecare.handler.speech.two",
        "Im here to show you how to care for your puffles!"
      ],
      [
        "w.pufflecare.handler.speech.three",
        "Click these tabs to:"
      ],
      [
        "w.pufflecare.handler.speech.four",
        "feed"
      ],
      [
        "w.pufflecare.handler.speech.five",
        "play"
      ],
      [
        "w.pufflecare.handler.speech.six",
        "clean"
      ],
      [
        "w.pufflecare.handler.speech.seven",
        "rest"
      ],
      [
        "w.pufflecare.handler.speech.eight",
        "When you run out of food,"
      ],
      [
        "w.pufflecare.handler.speech.nine",
        "click this catalog to buy more. "
      ],
      [
        "w.pufflecare.handler.speech.ten",
        "Have fun,"
      ],
      [
        "w.pufflecare.handler.speech.eleven",
        "and good luck!"
      ],
      [
        "year1011_book",
        "Loading Yearbook 10\/11"
      ],
      [
        "w.pufflecare.handler.speech.twelve",
        "and dress your puffle."
      ],
      [
        "w.pufflecare.handler.finish",
        "done"
      ],
      
      [
        "scavenger_items_found_plural",
        "%num% ghosts caught"
      ],
      [
        "scavenger_items_found",
        "%num% eggs found"
      ],
      [
        "ignore_prompt_help",
        "Go to settings to remove players on your ignore list."
      ],
      [
        "friend_request_prompt",
        "Would you like to add %name%\nto your Friends list?"
      ],
      [
        "friend_remove_prompt",
        "Would you like to remove %name% from your Friends list?"
      ],
      [
        "add_friend_hint",
        "Add Friend"
      ],
      [
        "remove_buddy_hint",
        "Remove Friend"
      ],
      [
        "friend_hint",
        "Show Friends"
      ],
      [
        "remove_friend_hint",
        "Remove Friend"
      ],
      [
        "load_pufflescape",
        "Loading Pufflescape"
      ],
      [
        "pufflescape_find",
        "%name% is playing Pufflescape"
      ],
      [
        "pufflescape_hint",
        "Pufflescape"
      ],
      [
        "pufflescape_prompt",
        "Would you like to play Pufflescape?"
      ],
      [
        "oops_game_pufflescape",
        "Loading Membership"
      ],
      [
        "w.furniture.buy.too.many.mats",
        "Sorry, you may only have four Card-Jitsu Mat igloo items."
      ],
      [
        "w.app.prompt.2011cjparty.membergame",
        "Card-Jitsu All Access ends Dec. 6. A membership will be required to play."
      ],
      [
        "fire_prompt",
        "Would you like to play\nCard-Jitsu Fire?"
      ],
      [
        "water_prompt",
        "Would you like to play\nCard-Jitsu Water?"
      ],
      [
        "card_prompt",
        "Would you like to play\nCard-Jitsu?"
      ],
      [
        "w.app.hint.cjfire",
        "Earn Your Fire Suit"
      ],
      [
        "w.app.hint.cjwater",
        "Earn Your Water Suit"
      ],
      [
        "w.app.hint.cj",
        "Earn Your Belts"
      ],
      [
        "offline_find",
        "%name% is now offline"
      ],
      [
        "load_dojohidesolo",
        "Loading the Ninja Hideout"
      ],
      [
        "load_dojoextsolo",
        "Loading the Dojo Courtyard"
      ],
      [
        "app.fb.parent.portal.gift.coins.100",
        "100 coins were added to your account"
      ],
      [
        "app.fb.parent.portal.gift.coins.250",
        "250 coins were added to your account"
      ],
      [
        "app.fb.parent.portal.gift.coins.500",
        "500 coins were added to your account"
      ],
      [
        "app.fb.parent.portal.gift.sender.both",
        "Mom and Dad"
      ],
      [
        "app.fb.parent.portal.gift.sender.dad",
        "Dad"
      ],
      [
        "app.fb.parent.portal.gift.sender.mom",
        "Mom"
      ],
      [
        "w.map.pufflescape",
        "Pufflescape"
      ],
      [
        "w.mobile.accountactivation.dialog.changeemail.button.okay",
        "Ok"
      ],
      [
        "w.mobile.accountactivation.dialog.changeemail.button.cancel",
        "Cancel"
      ],
      [
        "w.mobile.accountactivation.dialog.changeemail.message",
        "Please enter your parent's valid email address. Club Penguin will send your parent an email with an activation code."
      ],
      [
        "party_poster2",
        "Loading Poster"
      ],
      [
        "w.login.prompt.rules",
        "Club Penguin Rules"
      ],
      [
        "w.cfc.infoposter.loading",
        "Loading CFC Poster"
      ],
      [
        "cfc_info_poster",
        "CFC Poster"
      ],
      [
        "advent_note_dec",
        "Loading Advent Note"
      ],
      [
        "advent_note_dec15",
        "Loading Advent Note"
      ],
      [
        "advent_note_dec16",
        "Loading Advent Note"
      ],
      [
        "advent_note_dec17",
        "Loading Advent Note"
      ],
      [
        "advent_note_dec18",
        "Loading Advent Note"
      ],
      [
        "advent_note_dec19",
        "Loading Advent Note"
      ],
      [
        "advent_note_dec20",
        "Loading Advent Note"
      ],
      [
        "advent_note_dec21",
        "Loading Advent Note"
      ],
      [
        "advent_note_dec22",
        "Loading Advent Note"
      ],
      [
        "advent_note_dec23",
        "Loading Advent Note"
      ],
      [
        "advent_note_dec24",
        "Loading Advent Note"
      ],
      [
        "advent_note_dec25",
        "Loading Advent Note"
      ],
      [
        "party1",
        "Party 1"
      ],
      [
        "w.p.poster.loading",
        "Loading Poster"
      ],
      [
        "w.p.note.loading",
        "Loading Note"
      ],
      [
        "w.p.catalog.loading",
        "Loading Catalog"
      ],
      [
        "w.redemption.onetoone.puffle.maxpufflesjumbo",
        "You already have the max number of puffles, so you get a bonus item!"
      ],
      [
        "attempted_game_manipulation",
        "Attempted Game Manipulation"
      ],
      [
        "w.app.error.message.playtimeup",
        "You've used up your time to play on Club Penguin for today. Your parent has set your play time to %0% %1%, %2% %3%."
      ],
      [
        "w.app.error.message.playtimeending",
        "You have %0% %1% left to play Club Penguin today. Your parent has set your play time to %2% %3%, %4% %5%."
      ],
      [
        "w.app.minute",
        "minute"
      ],
      [
        "w.app.minutes",
        "minutes"
      ],
      [
        "w.app.hour",
        "hour"
      ],
      [
        "w.app.hours",
        "hours"
      ],
      [
        "w.p0312.puffle.note01.choose",
        "Choose Your"
      ],
      [
        "w.p0312.puffle.note01.puffle",
        "Puffle"
      ],
      [
        "PH",
        "PH"
      ],
      [
        "w.app.error.message.playhourupdate",
        "Your parent has changed your play time on Club Penguin to  %0% , %1%."
      ],
      [
        "shell.PLAYER_HAS_MAX_ITEMS",
        "Sorry, you can only buy this item 99 times."
      ],
      [
        "party5",
        "Party 5"
      ],
      [
        "party6",
        "Party 6"
      ],
      [
        "party7",
        "Party 7"
      ],
      [
        "party8",
        "Party 8"
      ],
      [
        "w.mobile.snowball.youveBeenHitSingle",
        "You've Been Hit!"
      ],
      [
        "w.mobile.snowball.hitBy",
        "by %0% from the Club Penguin App"
      ],
      [
        "w.mobile.snowball.throwBackSingle",
        "Would you like to throw one back?"
      ],
      [
        "w.mobile.snowball.snowballThrownSingle",
        "You've thrown a snowball back at %0%"
      ],
      [
        "w.mobile.snowball.youveBeenHitMulti",
        "You've Been Hit!"
      ],
      [
        "w.mobile.snowball.throwBackMulti",
        "Throw snowballs back?"
      ],
      [
        "w.mobile.snowball.snowballThrownMulti",
        "Snowballs thrown at %0%!"
      ],
      [
        "w.app.error.message.playhourupdate",
        "Your parent has changed your play time on Club Penguin to  %0% , %1%."
      ],
      [
        "scornbattle_prompt",
        "Are you prepared for battle?"
      ],
      [
        "m.igloo.viewer.details.title",
        "Your current igloo"
      ],
      [
        "m.igloo.viewer.details.edit",
        "Edit"
      ],
      [
        "m.igloo.viewer.details.lockToggle.lable",
        "Igloo Visitors"
      ],
      [
        "m.igloo.viewer.details.lockToggle.friends",
        "Friends"
      ],
      [
        "m.igloo.viewer.details.lockToggle.everyone",
        "Everyone"
      ],
      [
        "m.igloo.viewer.deletePrompt.title",
        "Are you sure that you want to delete this igloo?"
      ],
      [
        "m.igloo.editor.sideBar.music",
        "Music"
      ],
      [
        "m.igloo.editor.sideBar.hide",
        "Hide"
      ],
      [
        "m.igloo.editor.sideBar.show",
        "Show"
      ],
      [
        "m.igloo.editor.musicMenu.titleSaved",
        "My Saved Tracks"
      ],
      [
        "m.igloo.editor.musicMenu.titleNormal",
        "Igloo Music"
      ],
      [
        "m.igloo.editor.musicMenu.gotoDJ3K",
        "Go to DJ3K!"
      ],
      [
        "m.igloo.editor.musicMenu.empySlot",
        "Song Not Playing"
      ],
      [
        "m.igloo.editor.musicMenu.noSaveDialog.goThere",
        "Go There!"
      ],
      [
        "m.igloo.editor.musicMenu.noSaveDialog.message",
        "Record and save your\nown music mixes in DJ3K."
      ],
      [
        "m.igloo.editor.arrowKeysHint",
        "Use arrow keys to change this item."
      ],
      [
        "m.igloo.editor.addIglooPrompt",
        "Are you sure you want to add an igloo? Your flooring and igloo furniture will be saved in your inventory."
      ],
      [
        "m.igloo.editor.changeLocationPrompt",
        "Are you sure you want to move your igloo? Your flooring and igloo furniture will be saved in your inventory."
      ],
      [
        "m.igloo.editor.removeIglooPrompt",
        "Are you sure you want to remove your igloo? Your flooring and igloo furniture will be saved in your inventory."
      ],
      [
        "w.igloo.map.tab.popular",
        "Popular"
      ],
      [
        "w.igloo.map.tab.friends",
        "Friends"
      ],
      [
        "w.igloo.map.tab.everyone",
        "Everyone"
      ],
      [
        "w.igloo.likes.label",
        "Likes"
      ],
      [
        "w.igloo.viewer.deletePromptLikes",
        "You will lose all your LIKES for this igloo."
      ],
      [
        "w.p0612.superhero.superhero.alert.buttontext",
        "OK"
      ],
      [
        "w.p0612.superhero.supervillan.alert.buttontext",
        "OK"
      ],
      [
        "w.p0612.superhero.citizen.alert.buttontext",
        "OK"
      ],
      [
        "w.p0612.superhero.superhero.alert1",
        "Calling all heroes! Super Villains have been spotted at the Bank!"
      ],
      [
        "w.p0612.superhero.superhero.alert2",
        "Fires reported downtown! The city needs a hero!"
      ],
      [
        "w.p0612.superhero.superhero.alert3",
        "The police could use some back-up! Go to the Jail!"
      ],
      [
        "w.p0612.superhero.superhero.alert4",
        "Heroes - gather forces at the Super Hero HQ. For great justice!"
      ],
      [
        "w.p0612.superhero.superhero.alert5",
        "It's time to defeat evil once and for all! To the Super Villain Lair!"
      ],
      [
        "w.p0612.superhero.superhero.alert6",
        "Press Conference at the Coffee Shop. The city wants answers!"
      ],
      [
        "w.p0612.superhero.superhero.alert7",
        "Giant monsters spotted at the Iceberg! Move out!"
      ],
      [
        "w.p0612.superhero.superhero.alert8",
        "Defend the Club Penguin Times at any cost!"
      ],
      [
        "w.p0612.superhero.supervillan.alert1",
        "The Bank vault is defenseless! You know what to do..."
      ],
      [
        "w.p0612.superhero.supervillan.alert2",
        "Villains - join forces downtown. Nothing can stop us!"
      ],
      [
        "w.p0612.superhero.supervillan.alert3",
        "All Super Villains, go to the Jail! Cause trouble, but don't get caught!"
      ],
      [
        "w.p0612.superhero.supervillan.alert4",
        "The Super Heroes think their HQ is safe..."
      ],
      [
        "w.p0612.superhero.supervillan.alert5",
        "Attention Villains! Meet up at the Lair for an evil planning session!"
      ],
      [
        "w.p0612.superhero.supervillan.alert6",
        "No Super Villains allowed at the Coffee Shop. Wear a disguise. They'll never know it's you!"
      ],
      [
        "w.p0612.superhero.supervillan.alert7",
        "Giant monsters, your time has come... to the Iceberg!"
      ],
      [
        "w.p0612.superhero.supervillan.alert8",
        "Shut down the presses at the Club Penguin Times! First the newspaper... then the world!"
      ],
      [
        "w.p0612.superhero.citizen.alert1",
        "Super powered penguins spotted at the Bank! Also pizza!"
      ],
      [
        "w.p0612.superhero.citizen.alert2",
        "Fires reported downtown. Please expect traffic delays."
      ],
      [
        "w.p0612.superhero.citizen.alert3",
        "Watch out for villains escaping the Jail! They ALWAYS do that!"
      ],
      [
        "w.p0612.superhero.citizen.alert4",
        "Super Villains have been spotted heading to the Super Hero HQ!"
      ],
      [
        "w.p0612.superhero.citizen.alert5",
        "Super Heroes reported heading to the Super Villain Lair!"
      ],
      [
        "w.p0612.superhero.citizen.alert6",
        "Fresh coffee reported at the Coffee Shop! Also Super Heroes and Super Villains!"
      ],
      [
        "w.p0612.superhero.citizen.alert7",
        "Giant monsters spotted at the Iceberg! Run!"
      ],
      [
        "w.p0612.superhero.citizen.alert8",
        "Super Heroes and Villains spotted at the Club Penguin Times!"
      ],
      [
        "w.p0612.superhero.citizen.alert",
        "Non-member trying to enter fort"
      ],
      [
        "w.igloo.viewer.totalLikes.label",
        "Grand Total Likes:"
      ],
      [
        "m.igloo.editor.buyMore.igloo_tab_wall",
        "Buy more wall items from the Furniture Catalog"
      ],
      [
        "m.igloo.editor.buyMore.igloo_tab_pets",
        "Buy more pet furniture from the Puffle Catalog in the Pet Shop"
      ],
      [
        "w.map.martial_arts",
        "Martial Artworks"
      ],
      [
        "m.igloo.editor.buyMore.igloo_tab_room",
        "Buy more furniture from the Furniture Catalog"
      ],
      [
        "m.igloo.editor.buyMore.igloo_tab_flooring",
        "Buy more flooring from the Furniture Catalog"
      ],
      [
        "m.igloo.editor.buyMore.igloo_tab_building",
        "Buy more igloos from the Igloo Catalog"
      ],
      [
        "february_abbr",
        "Feb"
      ],
      [
        "march_abbr",
        "Mar"
      ],
      [
        "april_abbr",
        "Apr"
      ],
      [
        "may_abbr",
        "May"
      ],
      [
        "june_abbr",
        "Jun"
      ],
      [
        "july_abbr",
        "Jul"
      ],
      [
        "august_abbr",
        "Aug"
      ],
      [
        "september_abbr",
        "Sept"
      ],
      [
        "october_abbr",
        "Oct"
      ],
      [
        "november_abbr",
        "Nov"
      ],
      [
        "december_abbr",
        "Dec"
      ],
      [
        "january_abbr",
        "Jan"
      ],
      [
        "w.p0612.superhero.superhero.alert.buttontext",
        "OK!"
      ],
      [
        "w.p0612.superhero.supervillan.alert.buttontext",
        "OK!"
      ],
      [
        "w.p0612.superhero.citizen.alert.buttontext",
        "OK!"
      ],
      [
        "w.p0612.superhero.superhero.alert1",
        "Calling all heroes! Super Villains have been spotted at the Bank!"
      ],
      [
        "w.p0612.superhero.superhero.alert2",
        "Fires reported downtown! The city needs a hero!"
      ],
      [
        "w.p0612.superhero.superhero.alert3",
        "The police could use some back-up! Go to the Jail!"
      ],
      [
        "w.p0612.superhero.superhero.alert4",
        "Heroes - gather forces at the Super Hero HQ. For great justice!"
      ],
      [
        "w.p0612.superhero.superhero.alert5",
        "It's time to defeat evil once and for all! To the Super Villain Lair!"
      ],
      [
        "w.p0612.superhero.superhero.alert6",
        "Press Conference at the Coffee Shop. The city wants answers!"
      ],
      [
        "w.p0612.superhero.superhero.alert7",
        "Giant monsters spotted at the Iceberg! Move out!"
      ],
      [
        "w.p0612.superhero.superhero.alert8",
        "Defend the Club Penguin Times at any cost!"
      ],
      [
        "w.p0612.superhero.supervillan.alert1",
        "The Bank vault is defenseless! You know what to do..."
      ],
      [
        "w.p0612.superhero.supervillan.alert2",
        "Villains - join forces downtown. Nothing can stop us!"
      ],
      [
        "w.p0612.superhero.supervillan.alert3",
        "All Super Villains, go to the Jail! Cause trouble, but don't get caught!"
      ],
      [
        "w.p0612.superhero.supervillan.alert4",
        "The Super Heroes think their HQ is safe..."
      ],
      [
        "w.p0612.superhero.supervillan.alert5",
        "Attention Villains! Meet up at the Lair for an evil planning session!"
      ],
      [
        "w.p0612.superhero.supervillan.alert6",
        "No Super Villains allowed at the Coffee Shop. Wear a disguise. They'll never know it's you!"
      ],
      [
        "w.p0612.superhero.supervillan.alert7",
        "Giant monsters, your time has come... to the Iceberg!"
      ],
      [
        "w.p0612.superhero.supervillan.alert8",
        "Shut down the presses at the Club Penguin Times! First the newspaper... then the world!"
      ],
      [
        "w.p0612.superhero.citizen.alert1",
        "Super powered penguins spotted at the Bank! Also pizza!"
      ],
      [
        "w.p0612.superhero.citizen.alert2",
        "Fires reported downtown. Please expect traffic delays."
      ],
      [
        "w.p0612.superhero.citizen.alert3",
        "Watch out for villains escaping the Jail! They ALWAYS do that!"
      ],
      [
        "w.p0612.superhero.citizen.alert4",
        "Super Villains have been spotted heading to the Super Hero HQ!"
      ],
      [
        "w.p0612.superhero.citizen.alert5",
        "Super Heroes reported heading to the Super Villain Lair!"
      ],
      [
        "w.p0612.superhero.citizen.alert6",
        "Fresh coffee reported at the Coffee Shop! Also Super Heroes and Super Villains!"
      ],
      [
        "w.p0612.superhero.citizen.alert7",
        "Giant monsters spotted at the Iceberg! Run!"
      ],
      [
        "w.p0612.superhero.citizen.alert8",
        "Super Heroes and Villains spotted at the Club Penguin Times!"
      ],
      [
        "duplicate_location_warn",
        "You already have this location."
      ],
      [
        "w.igloo.viewer.totalLikes.label",
        "Grand Total Likes"
      ],
      [
        "m.igloo.likes.deletedUser",
        "Anonymous"
      ],
      [
        "w.redemption.login.createPenguin",
        "Create a Penguin"
      ],
      [
        "w.redemption.login.learnMore",
        "Learn more about Membership"
      ],
      [
        "scornbattle",
        "Scorn Battle"
      ],
      [
        "scornbattle_find",
        "%name% is in an epic battle!"
      ],
      [
        "w.map.smoothie_smash",
        "Smoothie Smash"
      ],
      [
        "smoothie_prompt",
        "Would you like to play Smoothie Smash?"
      ],
      [
        "smoothie_find",
        "%name% is making smoothies."
      ],
      [
        "w.redemption.congratulations.innocent.noBonusItem",
        "You've unlocked %0% items!\nWe've added them to your inventory.\nThere are %1% fruit items left to unlock."
      ],
      [
        "w.redemption.congratulations.innocent.claimBonusItem",
        "You've unlocked all the fruit items.\nUnlock your bonus item now!"
      ],
      [
        "w.redemption.congratulations.innocent.bonusItemTitle",
        "Pineapple Igloo Unlocked!"
      ],
      [
        "w.redemption.congratulations.innocent.bonusItem",
        "You've unlocked all %0% fruit items and earned the bonus Pineapple Igloo!"
      ],
      [
        "w.redemption.congratulations.innocent.postBonusItem",
        "You've unlocked %0% more items!\nWe've added them to your inventory."
      ],
      [
        "w.redemption.congratulations.button.bonusItem",
        "Unlock Bonus Item"
      ],
      [
        "smoothie_hint",
        "Make Smoothies"
      ],
      [
        "party3",
        "Party 3"
      ],
      [
        "party4",
        "Party 4"
      ],
      [
        "icejam_prompt",
        "Access Security Terminal?"
      ],
      [
        "w.login.panel.login.title",
        "Login to play!"
      ],
      [
        "w.login.text.or",
        "OR"
      ],
      [
        "w.login.panel.create.button.create",
        "Create"
      ],
      [
        "cloud",
        "Cloud Forest"
      ],
      [
        "cloudforest_find",
        "%name% is in the Cloud Forest"
      ],
      [
        "hotel",
        "Hotel Lobby"
      ],
      [
        "hotellobby_find",
        "%name% is in the Hotel Lobby"
      ],
      [
        "spa",
        "Hotel Spa"
      ],
      [
        "spa_find",
        "%name% is in the Hotel Spa"
      ],
      [
        "rooftop",
        "Hotel Rooftop"
      ],
      [
        "rooftop_find",
        "%name% is in the Hotel Rooftop"
      ],
      [
        "w.puffleadoption.rainbow.chosen.you",
        "This rainbow puffle has chosen you!"
      ],
      [
        "w.puffleadoption.rainbow.choose.name",
        "Choose a name"
      ],
      [
        "w.puffleadoption.rainbow.adopt",
        "Adopt"
      ],
      [
        "w.pufflecare.manual.toc.type.rainbow",
        "Rainbow"
      ],
      [
        "w.pufflecare.manual.handbook.description.rainbow",
        "These majestic puffles enjoy the\nfantastical. They may be the only\ncreature to have seen a real unicorn."
      ],
      [
        "w.pufflecare.manual.description.value.personality.rainbow",
        "Confident, regal"
      ],
      [
        "w.pufflecare.manual.description.value.toys.rainbow",
        "Cloud"
      ],
      [
        "w.pufflecare.manual.description.value.observed.rainbow",
        "Cloud surfing and riding down rainbows"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.rainbow",
        "Rainbow lollipop"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.rainbow",
        "Farts sparkles"
      ],
      [
        "w.map.hotel_lobby",
        "Rainbow Quest"
      ],
      [
        "app.fb.parent.portal.gift.coins.10",
        "10 coins were added to your account"
      ],
      [
        "app.fb.parent.portal.gift.coins.1000",
        "1000 coins were added to your account"
      ],
      [
        "app.fb.parent.portal.gift.coins.20",
        "20 coins were added to your account"
      ],
      [
        "app.fb.parent.portal.gift.coins.50",
        "50 coins were added to your account"
      ],
      [
        "hotelspa_find",
        "%name% is in the Hotel Spa"
      ],
      [
        "hotelroof_find",
        "%name% is on the Hotel Roof"
      ],
      [
        "hotellobby",
        "Hotel Lobby"
      ],
      [
        "hotelspa",
        "Hotel Spa"
      ],
      [
        "hotelroof",
        "Hotel Rooftop"
      ],
      [
        "w.settings.muteAllSounds",
        "Mute All Sounds"
      ],
      [
        "w.redemption.listearned.puffle.maxpuffles",
        "You already have the max number of puffles. All other items have been added to your inventory."
      ],
      [
        "buy_cards",
        "Would you like to buy 3 Power Cards for %cost% coins?"
      ],
      [
        "ninjaProgress.progress.title",
        "My Progress"
      ],
      [
        "ninjaProgress.progress.progressBtn",
        "My progress"
      ],
      [
        "ninjaProgress.progress.backBtn",
        "Go back"
      ],
      [
        "ninjaProgress.progress.reward",
        "Next Reward"
      ],
      [
        "ninjaProgress.progress.begin.vanilla",
        "Talk to Sensei to begin your Ninja journey."
      ],
      [
        "ninjaProgress.progress.begin.fire",
        "Become a Fire Ninja. Discover the power of the flame."
      ],
      [
        "ninjaProgress.progress.begin.water",
        "Become a Water Ninja. Discover the power of the wave."
      ],
      [
        "ninjaProgress.progress.begin.snow",
        "Become a Snow Ninja. Discover the power of the flurry."
      ],
      [
        "ninjaProgress.progress.challenge.vanilla",
        "Well done! Challenge Sensei to earn your Ninja Mask!"
      ],
      [
        "ninjaProgress.progress.challenge.fire",
        "Excellent! Challenge Sensei to become a Fire Ninja!"
      ],
      [
        "ninjaProgress.progress.challenge.water",
        "Impressive skills! Challenge Sensei to become a Water Ninja!"
      ],
      [
        "ninjaProgress.progress.complete.vanilla",
        "Ninja!"
      ],
      [
        "ninjaProgress.progress.complete.fire",
        "Fire Ninja!"
      ],
      [
        "ninjaProgress.progress.complete.water",
        "Water Ninja!"
      ],
      [
        "ninjaProgress.progress.complete.snow",
        "Snow Ninja!"
      ],
      [
        "ninjaProgress.cards.title",
        "My Cards"
      ],
      [
        "ninjaProgress.cards.redeemBtn",
        "I've got a Code"
      ],
      [
        "ninjaProgress.story.title",
        "Card-Jitsu Saga"
      ],
      [
        "ninjaProgress.story.subtitle",
        "Unite with ninjas in Card-Jitsu Snow battle to unlock"
      ],
      [
        "ninjaProgress.story.cinematic.title1",
        "Long, Long Ago\u2026"
      ],
      [
        "ninjaProgress.story.cinematic.title2",
        "Training Begins"
      ],
      [
        "ninjaProgress.story.cinematic.title3",
        "Snow Match"
      ],
      [
        "ninjaProgress.story.cinematic.title4",
        "Counter Strike"
      ],
      [
        "w.app.hint.cjsnow",
        "Battle Snow Minions"
      ],
      [
        "ninjaProgress.story.cinematic.title5",
        "Blasted Back"
      ],
      [
        "ninjaProgress.story.cinematic.title6",
        "The Earth Quivered\u2026"
      ],
      [
        "ninjaProgress.story.cinematic.title7",
        "A Broken Tusk"
      ],
      [
        "w.app.hint.cjsnowtusk",
        "Challenge Tusk"
      ],
      [
        "ninjaProgress.story.cinematic.title8",
        "Tusk's Vow"
      ],
      [
        "ninjaProgress.story.cinematic.title9",
        "Tusk Defeated"
      ],
      [
        "ninjaProgress.redeem.title",
        "Redeeming Codes"
      ],
      [
        "ninjaProgress.redeem.body",
        "To unlock a card code, you will be logged out of the game. Do you want to continue?"
      ],
      [
        "ninjaProgress.redeem.notNowBtn",
        "Not\u00a0now"
      ],
      [
        "ninjaProgress.redeem.logOutBtn",
        "Log out to redeem"
      ],
      [
        "spydrills_hint",
        "Spy Drills"
      ],
      [
        "spydrills_prompt",
        "Would you like to play Spy Drills?"
      ],
      [
        "load_spydrills",
        "Loading Spy Drills"
      ],
      [
        "robotfactory_find",
        "%name% is in the Robot Factory"
      ],
      [
        "buy_cards_done",
        "These 3 Power Cards have been added to your inventory."
      ],
      [
        "dojosnow_find",
        "%name% is in the Snow Dojo"
      ],
      [
        "snowdojo",
        "Snow Dojo"
      ],
      [
        "snow_prompt",
        "Would you like to play\nCard-Jitsu Snow?"
      ],
      [
        "golden_code_elemental_reward_snow_gem",
        "Snow Gem"
      ],
      [
        "w.puffleadoption.statsboard.totalcoins",
        "Your coins:\n%0%"
      ],
      [
        "w.puffleadoption.statsboard.pufflecount",
        "Your puffles: %0%"
      ],
      [
        "w.puffleadoption.statsboard.title",
        "Puffles for everyone"
      ],
      [
        "w.puffleadoption.dialog.rainbowposter.questtitle",
        "Quest for a Rainbow Puffle"
      ],
      [
        "w.puffleadoption.dialog.rainbowposter.questgotohotellobby",
        "Go to the Puffle Hotel"
      ],
      [
        "w.puffleadoption.dialog.rainbowposter.questfinishtasks",
        "Complete all four tasks in the Puffle Care Quest"
      ],
      [
        "w.puffleadoption.dialog.rainbowposter.questlaunchcloudforest",
        "Launch into the Cloud Forest to meet their new pet!"
      ],
      [
        "w.puffleadoption.dialog.rainbowposter.learnmoremembership",
        "Learn More About Membership"
      ],
      [
        "w.puffleadoption.dialog.rainbowposter.gotohotellobby",
        "Go to Puffle Hotel"
      ],
      [
        "w.puffletreasure.dialog.firstsuccessfuldig.puffleFound",
        "%pufflename% found"
      ],
      [
        "w.puffletreasure.dialog.firstsuccessfuldig.description",
        "Everyone's puffles can dig up coins!"
      ],
      [
        "w.notification.puffle.treasurehunt.coinsfound",
        "%0% found %1% coins!"
      ],
      [
        "w.notification.puffle.treasurehunt.itemfound",
        "%0% was added to your inventory!"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.remove",
        "Send your puffle back to the wilds"
      ],
      [
        "w.pufflecare.manual.toc.treasure",
        "Treasure"
      ],
      [
        "w.pufflecare.manual.games.title",
        "Games"
      ],
      [
        "w.pufflecare.manual.games.description",
        "Taking some puffles into games can help you earn more coins!"
      ],
      [
        "w.pufflecare.manual.health.walking.description2",
        "Click your puffle's leash to take it for a walk."
      ],
      [
        "w.pufflecare.manual.health.walking.description3",
        "To send it back to your igloo, open your player card and click your puffle."
      ],
      [
        "snow_find",
        "%name% is playing Card-Jitsu Snow"
      ],
      [
        "w.notification.puffle.treasurehunt.title",
        "Puffle Treasure"
      ],
      [
        "w.pufflecare.manual.health.treasure.description2",
        "Members can walk puffles for the chance to find rare items."
      ],
      [
        "sneak_find",
        "%name% is learning how to scare"
      ],
      [
        "school_find",
        "%name% is in the University"
      ],
      [
        "w.puffletreasure.dialog.firstsuccessfuldig.aboutmembership",
        "About Membership"
      ],
      [
        "Clear Igloo",
        "Clear Igloo"
      ],
      [
        "m.igloo.clearIglooPrompt",
        "Are you sure you want to clear this player's igloo?"
      ],
      [
        "w.banning.prompt.igloocleared.description1",
        "A Moderator has cleared your igloo because it was inappropriate."
      ],
      [
        "w.banning.prompt.igloocleared.description2",
        "Please remember to follow the Club Penguin rules."
      ],
      [
        "w.banning.prompt.banwarning.description1",
        "Oops! You used a rude or inappropriate word."
      ],
      [
        "w.banning.prompt.banwarning.description2",
        "If you break a Club Penguin rule again, you may be banned."
      ],
      [
        "w.banning.prompt.kick.description1",
        "A Moderator removed you from this server."
      ],
      [
        "w.banning.prompt.kick.description2",
        "Please remember to follow the Club Penguin rules."
      ],
      [
        "w.banning.prompt.ban.inappropriatewords",
        "You used a rude or inappropriate word."
      ],
      [
        "w.banning.prompt.bannedhours",
        "This penguin account has been banned for %0% hours."
      ],
      [
        "w.banning.prompt.ban.cheating",
        "You were caught cheating."
      ],
      [
        "w.banning.ingamebanning.button.banned",
        "BANNED"
      ],
      [
        "w.banning.prompt.rules.title",
        "Club Penguin Rules"
      ],
      [
        "w.banning.prompt.rules.respect.title",
        "Respect others"
      ],
      [
        "w.banning.prompt.rules.respect.description",
        "No bullying or being mean to others"
      ],
      [
        "w.banning.prompt.rules.chat.title",
        "Chat nicely"
      ],
      [
        "w.banning.prompt.rules.chat.description",
        "No rude or inappropriate language"
      ],
      [
        "w.banning.prompt.rules.staysafe.title",
        "Stay safe online"
      ],
      [
        "w.banning.prompt.rules.staysafe.description",
        "No sharing personal information"
      ],
      [
        "w.banning.prompt.rules.playfair.title",
        "Play fair"
      ],
      [
        "w.banning.prompt.rules.playfair.description",
        "No cheating or use of third party programs"
      ],
      [
        "w.banning.prompt.button.rules",
        "Rules"
      ],
      [
        "w.igloo.map.tab.population",
        "Population"
      ],
      [
        "ninjaProgress.cards.buyBtn",
        "Buy Power Cards"
      ],
      [
        "ninjaProgress.cards.membersOnly",
        "Members Only"
      ],
      [
        "w.banning.ingamebanning.bancount.singular",
        "(%0% ban)"
      ],
      [
        "w.banning.ingamebanning.bancount.plural",
        "(%0% bans)"
      ],
      [
        "w.banning.ingamebanning.targetplayer",
        "Ban %0% for saying"
      ],
      [
        "w.banning.ingamebanning.button.bullying",
        "Bullying"
      ],
      [
        "w.banning.ingamebanning.button.inappropriatewords",
        "Inappropriate words"
      ],
      [
        "w.banning.ingamebanning.button.sharedpersonalinfo",
        "Shared personal info"
      ],
      [
        "w.banning.ingamebanning.button.cheating",
        "Cheating"
      ],
      [
        "w.banning.ingamebanning.button.warning",
        "Warning only"
      ],
      [
        "w.banning.ingamebanning.button.twentyfour",
        "24 hrs"
      ],
      [
        "w.banning.ingamebanning.button.seventytwo",
        "72 hrs"
      ],
      [
        "w.banning.ingamebanning.button.permanently",
        "Permanently"
      ],
      [
        "w.banning.ingamebanning.button.ban",
        "BAN!"
      ],
      [
        "w.banning.ingamebanning.bannotenotice",
        "Notes:\nComments are saved on player's record"
      ],
      [
        "w.banning.ingamebanning.button.warned",
        "WARNED"
      ],
      [
        "w.banning.ingamebanning.button.warnagain",
        "Warn again"
      ],
      [
        "w.banning.prompt.ban.bullying",
        "You were disrespectful to others."
      ],
      [
        "w.banning.prompt.ban.sharedpersonalinfo",
        "You shared personal information."
      ],
      [
        "w.banning.prompt.bannedpermanently",
        "This penguin has been permanently banned for repeatedly not following the Club Penguin rules."
      ],
      [
        "w.app.error.message.playhourup",
        "You\u2019ve used up your time to play today. Your parent has set your play time to %0% - %1%"
      ],
      [
        "w.app.error.message.playhourending",
        "You have %0% %1% left to play on Club Penguin today. Your parent has set your play time to %2% - %3%"
      ],
      [
        "w.epf.recruitment.dialog.becomeagent",
        "%0%, the island needs you.\nBecome an agent and help protect Club Penguin.\nWill you take up the challenge?"
      ],
      [
        "w.epf.recruitment.dialog.playerjoins",
        "Welcome to the Elite Penguin Force Agent (%0%).\nHere's your spy phone - your most important tool.\nKeep it on you to receive your orders."
      ],
      [
        "w.epf.recruitment.dialog.playerdoesntjoin",
        "Very well. Carry on.\nIf you change your mind, give us a call."
      ],
      [
        "w.epf.recruitment.dialog.addphone",
        "Add phone"
      ],
      [
        "w.epf.recruitment.dialog.director",
        "The Director"
      ],
      [
        "w.epf.recruitment.dialog.phoneadded",
        "We look forward to working with you, agent.\nEnter the Command Room to hone your skills.\nAnd good luck."
      ],
      [
        "w.epf.recruitment.dialog.ok",
        "OK"
      ],
      [
        "w.pufflecare.manual.favouritefoods",
        "Favorite Foods"
      ],
      [
        "w.pufflecare.manual.favouritefood.description1",
        "Members can walk their puffles for the chance to find their favorite food."
      ],
      [
        "w.pufflecare.manual.favouritefood.description2",
        "Feed your puffle their favorite snack and their stats will go up to 100%!"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptionblack",
        "Fish Burger"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptionblue",
        "Pretzels"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptionbrown",
        "Astronaut\nIce Cream"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptiongreen",
        "Tacos"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptionorange",
        "Socks"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptionpink",
        "Watermelon"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptionpurple",
        "Hummus\nand Pita"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptionrainbow",
        "Rainbow\nLollipop"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptionred",
        "Stinky\nCheese"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptionwhite",
        "Yogurt Parfait"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptionyellow",
        "Popcorn"
      ],
      [
        "w.pufflecare.treasureinfographic.title",
        "Puffle Treasure Hunting"
      ],
      [
        "w.pufflecare.treasureinfographic.descriptionCare1",
        "Take good care\n of your pet!"
      ],
      [
        "w.pufflecare.treasureinfographic.descriptionCare2",
        "Healthy puffles can\ndig up more coins."
      ],
      [
        "w.pufflecare.treasureinfographic.descriptionBreak1",
        "Take a break\nwhile walking."
      ],
      [
        "w.pufflecare.treasureinfographic.descriptionBreak2",
        "Puffles can hunt for\ntreasure when you stop."
      ],
      [
        "w.pufflecare.treasureinfographic.descriptionDig1",
        "If your puffle finds\ntreasure, it'll start digging."
      ],
      [
        "w.pufflecare.treasureinfographic.descriptionDig2",
        "If not, try another spot."
      ],
      [
        "w.dialog.button.ok",
        "OK"
      ],
      [
        "w.pufflecarestationmenu.prefixmenutitle",
        "on\nthe"
      ],
      [
        "w.pufflecarestationmenu.menutitle",
        "MENU"
      ],
      [
        "w.pufflecarestationmenu.walkdescription",
        "Walk your puffle to feed it at the \nSnack Stations!"
      ],
      [
        "w.app.prompt.notenoughcoins.title",
        "Uh-oh!"
      ],
      [
        "w.app.prompt.notenoughcoins.description",
        "You'll need more coins\nto get this item."
      ],
      [
        "w.app.prompt.notenoughcoins.earnmore",
        "Earn more coins by"
      ],
      [
        "w.app.prompt.notenoughcoins.playgames",
        "Playing games"
      ],
      [
        "w.app.prompt.notenoughcoins.walkpuffle",
        "Walking your puffle"
      ],
      [
        "w.app.prompt.notenoughcoins.gothere",
        "Go There!"
      ],
      [
        "w.p2013.dialogue.ok",
        "OK"
      ],
      [
        "w.app.prompt.notenoughcoins.descriptionmail",
        "You'll need more coins\nto send this postcard."
      ],
      [
        "w.pufflecare.manual.toc.type.gold",
        "Gold"
      ],
      [
        "w.pufflecare.manual.handbook.description.gold",
        "The legendary gold puffles live near\ngold deposits in the earth's crust. They\nare known to dig up rare golden items."
      ],
      [
        "w.pufflecare.manual.description.value.personality.gold",
        "Lucky, energetic"
      ],
      [
        "w.pufflecare.manual.description.value.toys.gold",
        "Jackhammer"
      ],
      [
        "w.pufflecare.manual.description.value.observed.gold",
        "Distracted by golden objects"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.gold",
        "Chocolate coins"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.gold",
        "Hide-and-Seek\nChampion"
      ],
      [
        "w.pufflecare.manual.favouritefood.descriptiongold",
        "Chocolate\nCoins"
      ],
      [
        "w.preactivationaccess.lockedout.title",
        "Oops!"
      ],
      [
        "w.preactivationaccess.lockedout.activatewithin",
        "\nleft to activate your account. Unactivated accounts will be deleted."
      ],
      [
        "w.preactivationaccess.lockedout.askyourparent",
        "Your parent needs to activate your account so you can keep playing. Ask them to check their email for the activation link."
      ],
      [
        "w.preactivationaccess.button.didntemail",
        "Didn't get an email?"
      ],
      [
        "w.preactivationaccess.button.ok",
        "OK"
      ],
      [
        "w.preactivationaccess.welcome.title",
        "Welcome to Club Penguin!"
      ],
      [
        "w.preactivationaccess.welcome.activatewithin",
        "You can waddle around without activating for"
      ],
      [
        "w.preactivationaccess.welcome.askyourparent",
        "Ask your parent to check their email."
      ],
      [
        "w.preactivationaccess.willdelete",
        "after the trial period, unactivated accounts will be deleted."
      ],
      [
        "w.preactivationaccess.back.title",
        "Welcome back!"
      ],
      [
        "w.preactivationaccess.back.activatewithin",
        "You can waddle around without activating for"
      ],
      [
        "w.preactivationaccess.hud.chatbar",
        "Activate account to enable chat."
      ],
      [
        "w.pufflegoldquestprogress.lockstate.instructions",
        "Dig up %0% gold nuggets!"
      ],
      [
        "w.pufflegoldquestprogress.lockstate.note",
        "You can dig for gold nuggets until you log off. Any gold nuggets you collect will be saved."
      ],
      [
        "w.pufflegoldquestprogress.unlockstate.instructions",
        "Take the gold nuggets to the Gold Mine to activate the jackhammer."
      ],
      [
        "w.pufflegoldquestprogress.button.gothere",
        "Go There!"
      ],
      [
        "w.pufflegoldberrymachine.instructions.description1",
        "Insert coins below to feed\nyour puffle a gold O'berry"
      ],
      [
        "w.pufflegoldberrymachine.instructions.description2",
        "Walk your puffle anywhere to dig up gold nuggets."
      ],
      [
        "w.pufflegoldberrymachine.instructions.description3",
        "Bring the gold nuggets to the Gold Mine\nto activate the jackhammer!"
      ],
      [
        "w.pufflegoldberrymachine.instructions.maxpuffles",
        "You already have the\nmax number of puffles."
      ],
      [
        "w.pufflegoldberrymachine.instructions.nopuffle",
        "Walk your puffle here\nto feed it a gold O'berry!"
      ],
      [
        "w.pufflegoldberrymachine.coinamount",
        "Your Coins: %0%"
      ],
      [
        "w.pufflegoldberrymachine.insertbutton",
        "INSERT"
      ],
      [
        "w.notification.puffle.treasurehunt.nuggetfound",
        "%0% found 1 gold nugget!"
      ],
      [
        "w.notification.puffle.treasurehunt.nuggetsfound",
        "%0% found %1% gold nuggets!"
      ],
      [
        "w.notification.puffle.treasurehunt.goldpufflequest",
        "Gold Puffle Quest"
      ],
      [
        "w.notification.goldpuffle.goldnuggetprompt.description1",
        "You need more gold nuggets\nto activate the jackhammer."
      ],
      [
        "w.notification.goldpuffle.goldnuggetprompt.description2",
        "Go to the Pet Shop with\na puffle to start your quest."
      ],
      [
        "w.notification.goldpuffle.maxpuffleprompt.description1",
        "You already own the maximum\nnumber of puffles!"
      ],
      [
        "w.puffleadoption.gold.title",
        "You found\na gold puffle!"
      ],
      [
        "w.puffleadoption.gold.congratulations.title",
        "Congratulations!"
      ],
      [
        "w.puffleadoption.gold.congratulations.description1",
        "Your new puffle comes with its very own\nadoption certificate and exclusive toy."
      ],
      [
        "w.puffleadoption.gold.congratulations.item1",
        "Adoption\nCertificate"
      ],
      [
        "w.puffleadoption.gold.congratulations.item2",
        "Toy"
      ],
      [
        "w.puffleadoption.gold.poster.title",
        "Members can:"
      ],
      [
        "w.puffleadoption.gold.poster.description",
        "Feed your puffle a gold\nO'berry to begin your quest."
      ],
      [
        "w.puffleadoption.gold.poster.learnbutton",
        "Learn More\nAbout Membership"
      ],
      [
        "w.puffleadoption.gold.poster.memberbutton",
        "OK"
      ],
      [
        "w.preactivationaccess.resend.title",
        "Resend activation email to"
      ],
      [
        "w.preactivationaccess.change.input",
        "Parent email address"
      ],
      [
        "w.preactivationaccess.button.send",
        "Send Email"
      ],
      [
        "w.preactivationaccess.checkemail.resend",
        "Re-send email"
      ],
      [
        "w.preactivationaccess.resend.changeemail",
        "Change email"
      ],
      [
        "w.preactivationaccess.welcome.remainingtime",
        "You can waddle around without activating for %0% more hours."
      ],
      [
        "w.preactivationaccess.welcome.onehourleft",
        "You have one more hour to play without activating."
      ],
      [
        "w.preactivationaccess.aboutactivation.title",
        "By activating your account you can keep exploring, chatting, adding friends, and more!"
      ],
      [
        "w.preactivationaccess.oops.onehour",
        "You have less than one hour to activate your account. Unactivated accounts will be deleted."
      ],
      [
        "w.preactivationaccess.days",
        "%0%\ndays"
      ],
      [
        "w.preactivationaccess.hours",
        "%0%\nhour(s)"
      ],
      [
        "w.preactivationaccess.aboutactivation.sentTo",
        "An activation link was sent to"
      ],
      [
        "w.preactivationaccess.change.title",
        "Resend activation email to"
      ],
      [
        "w.app.prompt.oops.addigloo.header1",
        "Adding an igloo requires\na paid membership"
      ],
      [
        "w.app.prompt.oops.addigloo.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.addigloo.content1",
        "\u2022 Save more unique igloo designs \n\u2022 Decorate their perfect igloo with the latest furniture \n\u2022 Unlock their igloos and throw parties for their friends"
      ],
      [
        "w.app.prompt.oops.addigloo.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.adoptionovr2puffle.header1",
        "Adopting more than two puffles\nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.adoptionovr2puffle.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.adoptionovr2puffle.content1",
        "\u2022 Adopt a pet puffle in every color\n\u2022 Care for up to 75 puffles\n\u2022 Buy special toys and furniture\n   items for their pets"
      ],
      [
        "w.app.prompt.oops.adoptionovr2puffle.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogclothing.header1",
        "This requires a paid membership"
      ],
      [
        "w.app.prompt.oops.catalogclothing.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.catalogclothing.content1",
        "\u2022 Buy new clothing styles every month\n\u2022 Design their own clothes\n\u2022 Wear the latest party outfits"
      ],
      [
        "w.app.prompt.oops.catalogclothing.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogcostumetrunk.header1",
        "Stage Costumes require \na paid membership"
      ],
      [
        "w.app.prompt.oops.catalogcostumetrunk.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.catalogcostumetrunk.content1",
        "\u2022 Purchase costumes to wear everywhere\n\u2022 Dress up and act on the Stage\n\u2022 Change their looks with the latest styles"
      ],
      [
        "w.app.prompt.oops.catalogcostumetrunk.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogigloo.header1",
        "Igloo Upgrades require a \npaid membership"
      ],
      [
        "w.app.prompt.oops.catalogigloo.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.catalogigloo.content1",
        "\u2022 Upgrade to the latest igloos \n\u2022 Customize the flooring in their igloo \n\u2022 Decorate their igloo with furniture items"
      ],
      [
        "w.app.prompt.oops.catalogigloo.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogigloofurniture.header1",
        "Igloo Furniture and Items \nrequire a paid membership"
      ],
      [
        "w.app.prompt.oops.catalogigloofurniture.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.catalogigloofurniture.content1",
        "\u2022 Purchase furniture for their igloo \n\u2022 Design custom furniture for their igloo  \n\u2022 Decorate their igloo any way they want"
      ],
      [
        "w.app.prompt.oops.catalogigloofurniture.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.cataloginstruments.header1",
        "Instruments from the Music Catalog \nrequire a paid membership"
      ],
      [
        "w.app.prompt.oops.cataloginstruments.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogmartialartworks.header1",
        "Ninja items require \na paid membership"
      ],
      [
        "w.app.prompt.oops.catalogmartialartworks.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.catalogmartialartworks.content1",
        "\u2022 Design igloos with exclusive ninja furniture \n\u2022 Wear ninja outfits to unlock special moves \n\u2022 Train in their igloos with Card-Jitsu mats \n\u2022 Earn rewards faster with more Power Cards"
      ],
      [
        "w.app.prompt.oops.catalogmartialartworks.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogpuffleitems.header1",
        "Puffle furniture and items \nrequire a paid membership"
      ],
      [
        "w.app.prompt.oops.catalogpuffleitems.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.catalogpuffleitems.content1",
        "\u2022 Buy furniture for puffles to play with \n\u2022 Get the latest hats for their pets to wear \n\u2022 Adopt up to 75 different pet puffles"
      ],
      [
        "w.app.prompt.oops.catalogpuffleitems.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogrhrareitems.header1",
        "Rockhopper's rare items \nrequire a paid membership"
      ],
      [
        "w.app.prompt.oops.catalogrhrareitems.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogsleds.header1",
        "Additional sleds require \na paid membership"
      ],
      [
        "w.app.prompt.oops.catalogsleds.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.catalogsleds.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogsnowsports.header1",
        "Snow & Sports gear requires \na paid membership"
      ],
      [
        "w.app.prompt.oops.catalogsnowsports.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogsnowsports.header1",
        "Snow & Sports gear requires \na paid membership"
      ],
      [
        "w.app.prompt.oops.catalogsnowsports.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.catalogsnowsports.content1",
        "\u2022 Shop for snow and sports gear \n\u2022 Purchase special sport igloo items \n\u2022 Buy sporty backgrounds"
      ],
      [
        "w.app.prompt.oops.catalogsnowsports.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogsurf.header1",
        "Additional surfboards for Catchin' \nWaves require a paid membership"
      ],
      [
        "w.app.prompt.oops.catalogsurf.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.catalogsurf.content1",
        "\u2022 Buy the Daisy Surfboard to take into the game \n\u2022 Buy the Flame Surfboard to take into the game"
      ],
      [
        "w.app.prompt.oops.catalogsurf.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.epfgear.header1",
        "Equipping this Elite Gear \nrequires a paid membership."
      ],
      [
        "w.app.prompt.oops.epfgear.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.epflapsedmember.header1",
        "EPF gear requires \na paid membership"
      ],
      [
        "w.app.prompt.oops.epflapsedmember.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.epflapsedmember.content1",
        "\u2022 Access and wear their Elite Gear \n\u2022 Customize their secret agent looks"
      ],
      [
        "w.app.prompt.oops.epflapsedmember.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.epfpuffle.header1",
        "Unlocking the Elite Puffle Whistle \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.epfpuffle.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.epfpuffle.content1",
        "Enter a code from Club Penguin Elite Penguin \nForce: Herbert's Revenge Nintendo DS game to \ncall Flare, the elite black puffle."
      ],
      [
        "w.app.prompt.oops.epfpuffle.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.epftracetracker3000.header1",
        "Using the TraceTracker 3000 \nrequires a paid membership."
      ],
      [
        "w.app.prompt.oops.epftracetracker3000.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.epftracetracker3000.content1",
        "Gear up with exclusive items \nto show their agent status"
      ],
      [
        "w.app.prompt.oops.epftracetracker3000.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gameaquagrabber.header1",
        "Aqua Grabber's Soda Seas Level \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.gameaquagrabber.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gameaquagrabber.content1",
        "\u2022 Explore & find the treasure \n\u2022 Challenge advanced modes \n\u2022 Earn exclusive Stamps to show their skills"
      ],
      [
        "w.app.prompt.oops.gameaquagrabber.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gameastrobarrier.header1",
        "Additional Astro Barrier Levels \nrequire a paid membership"
      ],
      [
        "w.app.prompt.oops.gameastrobarrier.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gameastrobarrier.content1",
        "\u2022 Challenge advanced levels & modes \n\u2022 Play hidden levels \n\u2022 Earn exclusive Stamps to show off their \n   skills"
      ],
      [
        "w.app.prompt.oops.gameastrobarrier.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamebitsandbolts.scoreandlevel",
        "Score \nLevel"
      ],
      [
        "w.app.prompt.oops.gamebitsandbolts.header1",
        "Playing More Bits & Bolts Levels \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.gamebitsandbolts.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamebitsandbolts.content1",
        "\u2022 Play advanced levels \n\u2022 Take on more equations"
      ],
      [
        "w.app.prompt.oops.gamebitsandbolts.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamedancesongs.header1",
        "Additional Dance Contest records \nrequire a paid membership"
      ],
      [
        "w.app.prompt.oops.gamedancesongs.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamedancesongs.content1",
        "\u2022 Challenge other dancers & get exclusive songs \n\u2022 Take their purple puffle in the game to help earn coins"
      ],
      [
        "w.app.prompt.oops.gamedancesongs.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamedance.header1",
        "Dance Contest Multiplayer Mode \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.gamedance.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamedance.content1",
        "\u2022 Challenge other dancers & \n   get exclusive songs \n\u2022 Take their purple puffle in the \n   game to help earn coins"
      ],
      [
        "w.app.prompt.oops.gamedance.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamedj3ksave.header1",
        "Saving Music Tracks in DJ3K \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.gamedj3ksave.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamedj3ksave.content1",
        "\u2022 Create and save their own \n   original music tracks  \n\u2022 Play their original saved \n   tracks in their igloo \n\u2022 Take their yellow puffle in \n   the game to help earn coins"
      ],
      [
        "w.app.prompt.oops.gamedj3ksave.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamedj3ktracks.header1",
        "Additional music tracks for DJ3K require a paid membership"
      ],
      [
        "w.app.prompt.oops.gamedj3ktracks.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamedj3ktracks.content1",
        "\u2022 Buy music tracks to create more original songs \n\u2022 Save their music tracks to play in their igloos \n\u2022 Bring their yellow puffle into the game\n   to help earn coins"
      ],
      [
        "w.app.prompt.oops.gamedj3ktracks.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamehydrohopper.header1",
        "Additional Hydro-Hopper Wakeboards \nrequire a paid membership"
      ],
      [
        "w.app.prompt.oops.gamehydrohopper.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamehydrohopper.content1",
        "\u2022 Buy the Yellow Arrow board \n   to take into the game \n\u2022 Buy the Pink Striped board \n    to take into the game"
      ],
      [
        "w.app.prompt.oops.gamehydrohopper.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gameicefishing.header1",
        "The fishing rod requires \na paid membership"
      ],
      [
        "w.app.prompt.oops.gameicefishing.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamejetpack.header1",
        "Additional Jet Pack Adventure \nlevels require a membership"
      ],
      [
        "w.app.prompt.oops.gamejetpack.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamejetpack.content1",
        "\u2022 Play all the Jet Pack Adventure levels \n\u2022 Take their green puffle in the game \n   to help earn coins \n\u2022 Earn exclusive Stamps to show their skills"
      ],
      [
        "w.app.prompt.oops.gamejetpack.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamepufflelaunch.header1",
        "Additional Puffle Launch levels \nrequire a paid membership"
      ],
      [
        "w.app.prompt.oops.gamepufflelaunch.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamepufflelaunch.content1",
        "\u2022 Take their own puffles into the game \n\u2022 Challenge the cranky crab \n   in exclusive areas \n\u2022 Earn exclusive Stamps \n   to show their skills"
      ],
      [
        "w.app.prompt.oops.gamepufflelaunch.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamepufflescape.header1",
        "Additional Pufflescape Levels \nrequire a paid membership"
      ],
      [
        "w.app.prompt.oops.gamepufflescape.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamepufflescape.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamerescuelevel1.header1",
        "The Underground Cave levels of \nPuffle Rescue require a paid membership."
      ],
      [
        "w.app.prompt.oops.gamerescuelevel1.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamerescuelevel1.content1",
        "\u2022 Rescue puffles in the caves & sea levels \n\u2022 Discover hidden secrets \n\u2022 Earn exclusive Stamps to show their skills"
      ],
      [
        "w.app.prompt.oops.gamerescuelevel1.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamerescuelevel2.header1",
        "The Sea levels of Puffle Rescue \nrequire a paid membership."
      ],
      [
        "w.app.prompt.oops.gamerescuelevel2.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamerescuelevel2.content1",
        "\u2022 Rescue puffles in the caves & sea levels \n\u2022 Collect the special Moss Key to \n   access a secret underwater room \n\u2022 Earn exclusive Stamps to show their \n   skills"
      ],
      [
        "w.app.prompt.oops.gamerescuelevel2.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamesystemdefender.header1",
        "Additional System Defender \nLevels require a paid membership"
      ],
      [
        "w.app.prompt.oops.gamesystemdefender.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamesystemdefender.content1",
        "\u2022 Challenge the Testbot Attack level \n\u2022 Challenge the Ultimate Protobot Attack level \n\u2022 Earn exclusive Stamps to show off their skills"
      ],
      [
        "w.app.prompt.oops.gamesystemdefender.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamethinice.header1",
        "Additional Thin Ice levels \nrequire a paid membership"
      ],
      [
        "w.app.prompt.oops.gamethinice.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamethinice.content1",
        "\u2022 Challenge more levels \n\u2022 Discover secrets in the mazes \n\u2022 Earn exclusive Stamps to show \n   their skills"
      ],
      [
        "w.app.prompt.oops.gamethinice.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamewavescompetition.header1",
        "Playing Competition Mode \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.gamewavescompetition.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamewavescompetition.content1",
        "\u2022 Challenge three different waves \n\u2022 Compete for the judges & stand \n   on the podium \n\u2022 Earn exclusive Stamps to show \n   off their skills"
      ],
      [
        "w.app.prompt.oops.gamewavescompetition.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamewavessurvival.header1",
        "Survival Mode requires \na paid membership"
      ],
      [
        "w.app.prompt.oops.gamewavessurvival.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.gamewavessurvival.content1",
        "\u2022 Challenge the ''biggest wave'' \n   & obstacles \n\u2022 Earn exclusive Stamps to \n    show off their skills"
      ],
      [
        "w.app.prompt.oops.gamewavessurvival.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.iglooaccessinvintory.header1",
        "Accessing igloo storage \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.iglooaccessinvintory.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.iglooaccessinvintory.content1",
        "\u2022 Access stored igloo furniture \n\u2022 Decorate their perfect igloo \n\u2022 Unlock their igloo to throw parties \n   for their friends"
      ],
      [
        "w.app.prompt.oops.iglooaccessinvintory.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.iglooplaymusic.header1",
        "Music in igloos requires \na paid membership"
      ],
      [
        "w.app.prompt.oops.iglooplaymusic.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.iglooplaymusic.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.igloostorage.header1",
        "Accessing saved igloos \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.igloostorage.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.igloostorage.content1",
        "\u2022 Access saved igloos \n\u2022 Decorate and save more unique igloo designs \n\u2022 Unlock their igloos to throw parties for their friends"
      ],
      [
        "w.app.prompt.oops.igloostorage.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.igloounlock.header1",
        "Unlocking an igloo \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.igloounlock.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.igloounlock.content1",
        "\u2022 Unlock their igloos so friends can visit \n\u2022 Decorate their perfect igloo \n\u2022 Throw parties for their friends in their igloo"
      ],
      [
        "w.app.prompt.oops.igloounlock.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.inventoryequip.header1",
        "Accessing and wearing member \noutfits requires a paid membership"
      ],
      [
        "w.app.prompt.oops.inventoryequip.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.inventoryequip.content1",
        "\u2022 Wear their member outfits \n\u2022 Wear their member costumes \n\u2022 Show off their unique looks"
      ],
      [
        "w.app.prompt.oops.inventoryequip.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.genericprintview.header1",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.genericprintview.subheader1",
        "As a paid member of Club Penguin, your child can \nenjoy additional benefits."
      ],
      [
        "w.app.prompt.oops.genericprintview.content1",
        "\u2022 Unlimited access \n\u2022 More games, themed events, and unique activities \n\u2022 Exclusive features and priority access \n\u2022 New things to discover and learn - every week!  \n \nCheck out clubpenguin.com\/membership for \nmore information."
      ],
      [
        "w.app.prompt.oops.puffleblack.header1",
        "Adopting a black puffle requires \na paid membership"
      ],
      [
        "w.app.prompt.oops.puffleblack.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.puffleblack.content1",
        "\u2022 Get exclusive hats for their \n   puffle to wear \n\u2022 Buy furniture & toys for their \n   puffles to play with \n\u2022 Take their black puffle into \n   the Cart Surfer game"
      ],
      [
        "w.app.prompt.oops.puffleblack.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.pufflebrown.header1",
        "Adopting a brown puffle \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.pufflebrown.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.pufflebrown.content1",
        "\u2022 Adopt up to 20 pet puffles in every color \n\u2022 Get exclusive hats for their puffle to \n   wear \n\u2022 Buy furniture & toys for their puffles \n   to play with"
      ],
      [
        "w.app.prompt.oops.pufflebrown.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.pufflegreen.header1",
        "Adopting a green puffle \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.pufflegreen.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.pufflegreen.content1",
        "\u2022 Take their green puffles into the \n   Jetpack Adventure game \n\u2022 Get exclusive hats for their puffle to \n   wear \n\u2022 Buy furniture & toys for their puffles \n   to play with"
      ],
      [
        "w.app.prompt.oops.pufflegreen.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.puffleorange.header1",
        "Adopting an orange puffle \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.puffleorange.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.puffleorange.content1",
        "\u2022 Adopt up to 20 pet puffles in every color \n\u2022 Get exclusive hats for their puffle to wear \n\u2022 Buy furniture & toys for their puffles to \n   play with"
      ],
      [
        "w.app.prompt.oops.puffleorange.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.pufflepink.header1",
        "Adopting a pink puffle \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.pufflepink.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.pufflepink.content1",
        "\u2022 Take their pink puffle into the \n   Aqua Grabber game \n\u2022 Get exclusive hats for their\n   puffle to wear \n\u2022 Buy furniture & toys for their puffles\n   to play with"
      ],
      [
        "w.app.prompt.oops.pufflepink.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.pufflepurple.header1",
        "Adopting a purple puffle \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.pufflepurple.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.pufflepurple.content1",
        "\u2022 Take their purple puffle into\n   the Dance Contest game\n\u2022 Get exclusive hats for their puffle to wear \n\u2022 Buy furniture & toys for their\n   puffles to play with"
      ],
      [
        "w.app.prompt.oops.pufflepurple.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.pufflewhite.header1",
        "Adopting a white puffle \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.pufflewhite.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.pufflewhite.content1",
        "\u2022 Adopt up to 20 pet puffles in every color \n\u2022 Get exclusive hats for their puffle to wear \n\u2022 Buy furniture & toys for their puffles\n   to play with"
      ],
      [
        "w.app.prompt.oops.pufflewhite.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.puffleyellow.header1",
        "Adopting a yellow puffle \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.puffleyellow.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.puffleyellow.content1",
        "\u2022 Take their yellow puffle\n   into the DJ3K game\n\u2022 Get exclusive hats for their\n   puffle to wear\n\u2022 Buy furniture & toys for their\n   puffles to play with"
      ],
      [
        "w.app.prompt.oops.puffleyellow.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.pufflerainbow.header1",
        "Adopting a majestic rainbow puffle \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.pufflerainbow.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.pufflerainbow.content1",
        "\u2022 Earn their Puffle Care outfit \n\u2022 Blast into the Cloud Forest \n\u2022 Adopt and show off rainbow puffles"
      ],
      [
        "w.app.prompt.oops.pufflerainbow.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.goldquestoops.header1",
        "Questing for the Gold Puffle \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.goldquestoops.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.goldquestoops.content1",
        "\u2022 Buy gold O'berries \n\u2022 Dig up gold nuggets \n\u2022 Adopt the legendary gold puffle"
      ],
      [
        "w.app.prompt.oops.goldquestoops.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.gamebitsandbolts.header1",
        "Playing More Bits & Bolts Levels \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.epfgear.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.epfgear.content1",
        "\u2022 Gear up with all Elite Penguin Force equipment \n\u2022 Specialize as Tactical, Stealth, Comms, \n   and Tech agents \n\u2022 Show spy status with \n   agent-only special dances"
      ],
      [
        "w.app.prompt.oops.gamepufflescape.content1",
        "\u2022 Take any of their puffles into the game \n\u2022 Solve more puzzles \n\u2022 Earn exclusive Stamps to show their skills"
      ],
      [
        "w.app.prompt.oops.iglooaccessstorage.header1",
        "Accessing igloo storage \nrequires a paid membership"
      ],
      [
        "w.app.prompt.oops.iglooaccessstorage.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.iglooaccessstorage.content1",
        "\u2022 Access stored igloo furniture \n\u2022 Decorate their perfect igloo \n\u2022 Unlock their igloo to throw parties \n   for their friends"
      ],
      [
        "w.app.prompt.oops.iglooaccessstorage.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.oops.catalogsleds.content1",
        "\u2022 Buy the Toboggan to take into the game\n\u2022 Buy the Pink Racing Sled to take into the game\n\u2022 Buy the Green Racing Sled to\n   take into the game"
      ],
      [
        "w.app.prompts.closeups.faqmembership.header1",
        "If a player's membership expires:"
      ],
      [
        "w.app.prompts.closeups.faqmembership.question1",
        "What happens to that player's igloo?"
      ],
      [
        "w.app.prompts.closeups.faqmembership.question2",
        "What happens to that player's outfits & costumes?"
      ],
      [
        "w.app.prompts.closeups.faqmembership.question3",
        "What happens to that player's puffles?"
      ],
      [
        "w.app.prompts.closeups.faqmembership.question4",
        "Will that player be able to play all game levels?"
      ],
      [
        "w.app.prompts.closeups.faqmembership.question5",
        "Will that player get all access to parties?"
      ],
      [
        "w.app.prompts.closeups.faqmembership.back",
        "Back"
      ],
      [
        "w.app.prompts.closeups.faqmembership.subheader1",
        "What happens to that player's igloo?"
      ],
      [
        "w.app.prompts.closeups.faqmembership.content1",
        "Only members can purchase igloo furniture \nand decorate with member-only items. \n\nIf a membership expires, igloos and \nfurniture will be put into storage. \n\nAll member items will be accessible again \nif the membership is renewed on the same \npengu"
      ],
      [
        "w.app.prompts.closeups.faqmembership.subheader2",
        "What happens to that player's outfits & costumes?\u00a0"
      ],
      [
        "w.app.prompts.closeups.faqmembership.content2",
        "Players can continue to use all free-player \nitems collected during events, and any \nitems redeemed through the Treasure \nBook. \n\nAll other member-only items will be placed \nin storage. \n\nAll member items will be accessible again \nif the membersh"
      ],
      [
        "w.app.prompts.closeups.faqmembership.subheader3",
        "What happens to that player's puffles?"
      ],
      [
        "w.app.prompts.closeups.faqmembership.content3",
        "Players will be able to care for all \npreviously adopted puffles. \n\nOnly members can adopt up to 20 puffles \nin-game and purchase pet furniture, hats, \nand toys."
      ],
      [
        "w.app.prompts.closeups.faqmembership.subheader4",
        "Will that player be able to play all game \nlevels?"
      ],
      [
        "w.app.prompts.closeups.faqmembership.content4",
        "Only members can play all game levels \nand collect exclusive Stamps. \n\nIf a membership expires, only some game \nlevels will be accessible."
      ],
      [
        "w.apps.prompts.closeups.faqmembership.content5",
        "Everyone can join parties. \n\nBut only members can access certain \nareas, challenge special quests & mazes \nand get exclusive party items."
      ],
      [
        "w.app.prompt.forms.news.header1",
        "CLUB PENGUIN TIMES"
      ],
      [
        "w.app.prompt.forms.news.content1",
        "Please type your joke, riddle, \nor question for Aunt Arctic here."
      ],
      [
        "w.app.prompt.forms.news.button1",
        "Send"
      ],
      [
        "w.app.prompt.forms.news.content2",
        "Thank you. Your submission has been \nsent, an editor will read it soon."
      ],
      [
        "w.app.prompt.forms.news.button2",
        "O.K."
      ],
      [
        "w.games.robots.copyright_text",
        "SNOWBALL SOFT - 2011"
      ],
      [
        "w.games.robots.help1_text",
        "Click and combine the bolts to match the \ntarget number."
      ],
      [
        "w.games.robots.help2_text",
        "Match the correct multiples of bolts to build \na piece of the robot."
      ],
      [
        "w.games.robots.help2b_text",
        "ONLY"
      ],
      [
        "w.games.robots.help3_text",
        "Use the blast ball to help clear the \nscreen."
      ],
      [
        "w.games.robots.help4_text",
        "Some robots require special \nnumbers of bolts. Watch for even, odd and prime bots."
      ],
      [
        "w.games.robots.help4b_text",
        "ANY"
      ],
      [
        "w.games.robots.score_label_text",
        "SCORE"
      ],
      [
        "w.games.robots.level_label_text",
        "LEVEL"
      ],
      [
        "w.games.robots.cleared_label_text",
        "TILES CLEARED"
      ],
      [
        "w.games.robots.time_label_text",
        "TIME"
      ],
      [
        "w.games.robots.part_only_label_text",
        "ONLY"
      ],
      [
        "w.games.robots.part_any_label_text",
        "ANY"
      ],
      [
        "w.games.robots.start_label_text",
        "START"
      ],
      [
        "w.games.robots.instructions_label_text",
        "INSTRUCTIONS"
      ],
      [
        "w.games.robots.play_now_label_text",
        "PLAY NOW"
      ],
      [
        "w.games.robots.done_label_text",
        "DONE"
      ],
      [
        "w.games.robots.continue_score_text",
        "CURRENT SCORE"
      ],
      [
        "w.games.robots.continue_button_label_text",
        "CONTINUE"
      ],
      [
        "w.games.robots.pause_text",
        "PAUSE"
      ],
      [
        "w.games.smoothie.hintmovetitle",
        "MOVE"
      ],
      [
        "w.games.smoothie.hintsmashtitle",
        "SMASH"
      ],
      [
        "w.games.smoothie.hintcombostitle",
        "COMBOS"
      ],
      [
        "w.games.smoothie.hintwatchouttitle",
        "WATCH OUT!"
      ],
      [
        "w.games.smoothie.timesuptitle",
        "Time's up. Great job!"
      ],
      [
        "w.games.smoothie.awesomeskillstitle",
        "Awesome skills!"
      ],
      [
        "w.games.smoothie.hintmovetxt",
        "Use the arrow keys"
      ],
      [
        "w.games.smoothie.hintsmashtxt",
        "Jump on the \ncorrect fruit"
      ],
      [
        "w.games.smoothie.hintsmash2txt",
        "Jump on fruit to \nheal"
      ],
      [
        "w.games.smoothie.hintcombostxt",
        "Follow the recipe"
      ],
      [
        "w.games.smoothie.hintwatchouttxt",
        "Avoid hazards"
      ],
      [
        "w.games.smoothie.scoretxt.nocolon",
        "Your score"
      ],
      [
        "w.games.smoothie.buttonplay",
        "PLAY"
      ],
      [
        "w.games.smoothie.buttonnormal",
        "NORMAL"
      ],
      [
        "w.games.smoothie.buttonsurvival",
        "SURVIVAL"
      ],
      [
        "w.games.smoothie.buttoninstructions",
        "INSTRUCTIONS"
      ],
      [
        "w.games.smoothie.buttondone",
        "Done"
      ],
      [
        "w.app.prompts.closeups.faqmembership.subheader5",
        "Will that player get all access to parties?"
      ],
      [
        "w.games.robots.botparts_label_text",
        "BOT PARTS"
      ],
      [
        "w.introtocp.dialogue.welcome.pg1",
        "Hey, %0% \u2014 Welcome to Club Penguin!\nI'm a tour guide and this is my pet puffle.\nLet's look around!"
      ],
      [
        "w.introtocp.dialogue.welcome.pg2",
        "There's always tons of stuff to do all over the island...\n\nLike games \u2014 play them to earn coins!"
      ],
      [
        "w.introtocp.dialogue.welcome.pg3",
        "Coins can buy stuff like clothes, furniture, pets, and more."
      ],
      [
        "w.introtocp.dialogue.welcome.pg4",
        "Here's a map for you to keep.\n\nClick it!"
      ],
      [
        "w.introtocp.dialogue.welcome.pg5",
        "There are a few places to check out right away.\nYou'll even collect rewards!\n\nClick the \"!\""
      ],
      [
        "w.introtocp.dialogue.welcome.pg6",
        "Click what you want to do first!"
      ],
      [
        "w.introtocp.dialogue.quest.complete.igloo",
        "SWEET! You found your igloo - it's your very own place.\n\nDon't forget to collect your reward - the \"Table for Two\" furniture for your igloo!"
      ],
      [
        "w.introtocp.dialogue.quest.complete.petshop",
        "Awesome! You found the Pet Shop!\n\nDon't forget to collect your reward - the \"Polka Puffle Hat\" for your pet to wear."
      ],
      [
        "w.introtocp.dialogue.quest.complete.clothes.shop",
        "Nice! You found the Clothes Shop!\n\nDon't forget to collect your reward - the \"Insta-Hero\" shirt!"
      ],
      [
        "w.introtocp.dialogue.quest.reward1",
        "Don't forget to collect your reward - the"
      ],
      [
        "w.introtocp.dialogue.quest.reward2",
        "Don't forget to collect your reward - the"
      ],
      [
        "w.introtocp.dialogue.quest.reward3",
        "Don't forget to collect your reward - the"
      ],
      [
        "w.introtocp.dialogue.quest.end.pg3",
        "And speaking of pizza, I'm going to head to the Pizza Parlor in the Plaza!\n\nHave SO much fun! See ya!"
      ],
      [
        "w.introtocp.dialogue.quest.none",
        "Hey! There aren't any new quests right now. Please check back!"
      ],
      [
        "w.introtocp.dialogue.quest.started.petshop.click.arrow2",
        "Click under the yellow arrow to go inside."
      ],
      [
        "w.introtocp.dialogue.quest.started.clothes.shop.click.arrow2",
        "Click under the yellow arrow to go in."
      ],
      [
        "w.introtocp.dialogue.quest.started.igloo.click.arrow1",
        "See that yellow arrow? Click to get to your igloo!"
      ],
      [
        "w.introtocp.dialogue.quest.started.igloo.click.arrow2",
        "Click under the yellow arrow to get into your igloo."
      ],
      [
        "w.app.prompt.oops.pufflecarestationfood.header1",
        "Buying deluxe food requires \na paid membership."
      ],
      [
        "w.app.prompt.oops.pufflecarestationfood.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.pufflecarestationfood.content1",
        "\u2022 Feed their pet with exclusive food \n   at the Puffle Snack Station \n\u2022 Boost their puffle's food stat to 100%"
      ],
      [
        "w.app.prompt.oops.pufflecarestationfood.learnmore",
        "About Membership"
      ],
      [
        "w.quest.ui.button.back",
        "Back"
      ],
      [
        "w.quest.ui.noquests",
        "Hey! There aren't any new quests right now. Please check back!"
      ],
      [
        "w.quest.ui.button.collectreward",
        "Collect Reward"
      ],
      [
        "w.quest.ui.button.itemadded",
        "Item added to your inventory"
      ],
      [
        "w.quest.ui.todo",
        "To Do"
      ],
      [
        "w.quest.igloo.task_0.description",
        "Visit your igloo"
      ],
      [
        "w.quest.puffle.task_0.description",
        "Visit the Pet Shop"
      ],
      [
        "w.quest.shopping.task_0.description",
        "Visit the Clothes Shop"
      ],
      [
        "w.app.prompt.oops.puffledinowalk.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.puffledinowalk.learnmore",
        "About Membership"
      ],
      [
        "w.map.your_igloo",
        "Your Igloo"
      ],
      [
        "w.app.prompt.oops.party1.header1",
        "Buying this Holiday item requires \na paid membership."
      ],
      [
        "w.app.prompt.oops.party1.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.party1.content1",
        "\u2022 Buy and wear four different train engines \n\u2022 Drive trains of passengers around the island \n\u2022 Buy festive items from the catalog"
      ],
      [
        "w.app.prompt.oops.party1.learnmore",
        "About Membership"
      ],
      [
        "backyard_theirs_find",
        "%name% is in their backyard"
      ],
      [
        "backyard_yours_find",
        "%name% is in your backyard"
      ],
      [
        "w.rooms.hint.backyard",
        "Backyard"
      ],
      [
        "w.rooms.hint.backyardfromigloo",
        "Your Igloo"
      ],
      [
        "w.app.error.message.igloopufflelimit",
        "Sorry, only 10 puffles can\nfit in your igloo.\n\nYou can put some in the\nbackyard to make room."
      ],
      [
        "w.app.prompt.puffle.igloocare",
        "Care for your puffle\nin your igloo!"
      ],
      [
        "w.p2014.prehistoric.dialogue.transform.member",
        "OOGA BOOGA! \nYou found dinosaur egg! \nYou be dinosaur now! \nDino go GRAAAR!"
      ],
      [
        "w.app.prompt.puffle.firsttimeswapbackyard",
        "%0% went outside to your backyard!"
      ],
      [
        "w.app.prompt.oops.pufflemember.header1",
        "Members can adopt every color of puffle."
      ],
      [
        "w.app.prompt.oops.pufflemember.header2",
        "All players can adopt a blue or red puffle at the Pet Shop!"
      ],
      [
        "w.app.prompt.oops.pufflemember.content1",
        "Adopt Red"
      ],
      [
        "w.app.prompt.oops.pufflemember.content2",
        "Adopt Blue"
      ],
      [
        "w.app.prompt.oops.pufflemember.learnmore",
        "About Membership"
      ],
      [
        "w.app.prompt.button.nothanks",
        "No Thanks"
      ],
      [
        "w.app.prompt.button.gothere",
        "Go there!"
      ],
      [
        "w.pufflewidget.tooltip.movetobackyard",
        "Move to Backyard"
      ],
      [
        "w.pufflewidget.tooltip.movetoigloo",
        "Move to Igloo"
      ],
      [
        "w.pufflewidget.tooltip.walk",
        "Walk"
      ],
      [
        "w.app.prompt.puffle.firsttimemovebackyard.header1",
        "Where are all my puffles?"
      ],
      [
        "w.app.prompt.puffle.backyardinfo.header1",
        "Welcome to your backyard!"
      ],
      [
        "w.app.pufflecare.manual.backyard.header1",
        "Backyard"
      ],
      [
        "w.app.pufflecare.manual.backyard.content1",
        "Click the gate to go to your backyard!"
      ],
      [
        "w.games.smoothie.scoretxt",
        "Your score:"
      ],
      [
        "w.pufflecare.manual.card.revamp.label.treasuretip",
        "Puffle Treasure Tips"
      ],
      [
        "w.rooms.hint.backyardinfo",
        "About My Backyard"
      ],
      [
        "w.pufflewidget.tooltip.care",
        "Care"
      ],
      [
        "w.p2014.prehistoric.dialogue.adoptionText",
        "It's a %0%\n dino puffle!"
      ],
      [
        "w.p2014.prehistoric.dialogue.certificateText",
        "has chosen to live with"
      ],
      [
        "w.p2014.prehistoric.dialogue.liveText",
        "Your dino puffles will live\nin your igloo backyard, even\n after the party ends"
      ],
      [
        "w.p2014.prehistoric.dialogue.playText",
        "Play with and care for your\ndino puffles at stations\naround the island!"
      ],
      [
        "w.pufflewidget.tooltip.unwalk",
        "Drop Off"
      ],
      [
        "w.pufflecare.manual.toc.gamesandplay",
        "Games & Play"
      ],
      [
        "w.pufflecare.manual.toc.backyard",
        "Backyard"
      ],
      [
        "w.introtocp.dialogue.quest.end.pg1",
        "Great! You found three important places.\n\nBut there's WAY more! Use your map to explore."
      ],
      [
        "w.introtocp.dialogue.quest.end.pg2",
        "You can meet friends, dress up, play games, be a ninja,\na superstar, a secret agent or ANYTHING else!\n\nHave SO much fun! See ya later!"
      ],
      [
        "w.introtocp.dialogue.quest.pick.another",
        "Pick what you want to do next!"
      ],
      [
        "w.introtocp.dialogue.quest.started.petshop.click.arrow1",
        "Click the door to go into the Pet Shop!"
      ],
      [
        "w.introtocp.dialogue.quest.started.clothes.shop.click.arrow1",
        "Click the door to go into the Clothes Shop!"
      ],
      [
        "w.p2014.prehistoric.dialogue.adoptionText.triceratops",
        "triceratops"
      ],
      [
        "w.p2014.prehistoric.dialogue.adoptionText.trex",
        "T-rex"
      ],
      [
        "w.p2014.prehistoric.dialogue.adoptionText.stegosaurus",
        "stegosaurus"
      ],
      [
        "w.introtocp.dialogue.quest.iconigloo",
        "You can decorate your igloo with furniture whenever you want!"
      ],
      [
        "w.introtocp.dialogue.quest.iconpuffle",
        "You can adopt pet puffles here - there are lots of different kinds!"
      ],
      [
        "w.introtocp.dialogue.quest.iconclothing",
        "There's always a catalog here - with new styles every month."
      ],
      [
        "w.app.prompt.oops.february1.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.february1.content1",
        "Unlimited Fair rides require a paid membership"
      ],
      [
        "w.app.prompt.oops.february1.subheader2",
        "SILVER TICKETS"
      ],
      [
        "w.app.prompt.oops.february1.content2",
        "Win silver tickets on\nthe Daily Spin to go on rides!"
      ],
      [
        "w.app.prompt.oops.february2.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.february2.content1",
        "\u2022 Buy Fair items from the prize booth\n\u2022 Get exclusive puffle hats\nlike the quasar helmet"
      ],
      [
        "w.app.prompt.oops.february1.learnmore",
        "About Membership"
      ],
      [
        "w.preactivationaccess.welcome.header1",
        "%0% Days Left!"
      ],
      [
        "w.preactivationaccess.welcome.content1",
        "You have %0% days left to activate."
      ],
      [
        "w.preactivationaccess.willdelete",
        "Unactivated accounts will be deleted."
      ],
      [
        "w.preactivationaccess.expired.header1",
        "Time's Up!"
      ],
      [
        "w.preactivationaccess.expired.content1",
        "Please activate your account to continue playing."
      ],
      [
        "w.puffleadoption.statsboard.members",
        "For members"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.blueBorderCollie",
        "Loves chasing cat puffles"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.blueBorderCollie",
        "Pretzels"
      ],
      [
        "w.pufflecare.manual.description.value.personality.blueBorderCollie",
        "Loyal, mischievous"
      ],
      [
        "w.pufflecare.manual.description.value.coolfact.orangeTabbyCat",
        "Loves to hide in tiny spaces"
      ],
      [
        "w.pufflecare.manual.description.value.favoritesnacks.orangeTabbyCat",
        "Socks"
      ],
      [
        "w.pufflecare.manual.description.value.personality.orangeTabbyCat",
        "Curious, demanding"
      ],
      [
        "w.puffles.wildpuffle.blueBorderCollie.name",
        "Blue Border Collie"
      ],
      [
        "w.puffles.wildpuffle.orangeTabbyCat.name",
        "Orange Tabby Cat"
      ],
      [
        "w.preactivationaccess.willdelete1",
        "Unactivated accounts will be deleted."
      ],
      [
        "w.puffleadoption.dialog.namepuffle.nameerror",
        "Please choose another name"
      ],
      [
        "w.puffleadoption.dialog.namepuffle.entername",
        "Choose a name"
      ],
      [
        "w.puffleadoption.congratulations.items",
        "Your new puffle comes with"
      ],
      [
        "w.pufflecare.certificate.playcare",
        "Play with and care for your wild puffles at stations around the island!"
      ],
      [
        "w.puffleadoption.congratulations.wherepuffle",
        "%0% will be in your igloo or backyard when you're not walking it!"
      ],
      [
        "w.pufflecare.certificate.adoptedby",
        "was adopted by %0%"
      ],
      [
        "w.endgamescreen.coinsearned.nocolon",
        "Coins earned"
      ],
      [
        "w.endgamescreen.totalcoins.nocolon",
        "Your total coins %0%"
      ],
      [
        "w.endgamescreen.usecoins.nocolon",
        "Use your coins to"
      ],
      [
        "w.endgamescreen.clothing",
        "Buy new clothing"
      ],
      [
        "w.endgamescreen.puffles",
        "Adopt a pet"
      ],
      [
        "w.endgamescreen.igloo",
        "Decorate your igloo"
      ],
      [
        "w.endgamescreen.button.done",
        "Done"
      ],
      [
        "w.pufflecare.manual.handbook.description.orangeTabbyCat",
        "Always curious, these cat puffles will get into almost anything. They love high places and being the center of attention."
      ],
      [
        "w.pufflecare.manual.handbook.description.blueBorderCollie",
        "Full of energy, they're always up for a walk or playing fetch. Just watch out for their slobbery kisses."
      ],
      [
        "w.pufflecare.manual.description.value.observed.blueBorderCollie",
        "Chewing their favorite squeak toy"
      ],
      [
        "w.pufflecare.manual.description.value.observed.orangeTabbyCat",
        "Getting stuck up trees"
      ],
      [
        "w.pufflecare.manual.toc.type.orangeTabbyCat",
        "Orange Tabby Cat"
      ],
      [
        "w.pufflecare.manual.toc.type.blueBorderCollie",
        "Blue Border Collie"
      ],
      [
        "w.app.prompt.puffle.lapsedfirsttimewild",
        "Your puffle creatures went\noutside to your backyard!"
      ],
      [
        "w.app.prompt.puffle.lapsedwildigloo",
        "Only Members can bring their\npuffle creatures into their igloo."
      ],
      [
        "w.app.prompt.puffle.wildcarehotel",
        "Walk your puffle creatures to\nthe hotel to care for them."
      ],
      [
        "w.app.prompt.puffle.firsttimemovebackyard.content1",
        "Some of your puffles went to your backyard. Only 10 puffles can fit\nin your igloo. Members can adopt up to 75 and keep them in their backyard!"
      ],
      [
        "w.app.prompt.puffle.backyardinfo.content1",
        "\u2022 Now members can adopt up to 75 puffles!\n\u2022 You can move puffles between\nyour igloo and backyard.\n\u2022 Your puffles' stats stay the same\nwhile they're in your backyard."
      ],
      [
        "w.app.pufflecare.manual.backyard.content2",
        "\u2022 Now members can adopt up to 75 puffles!\n\u2022 You can move puffles between\nyour igloo and backyard.\n\u2022 Your puffles' stats stay the same\nwhile they're in your backyard."
      ],
      [
        "w.app.pufflecare.manual.wildpuffle.header1",
        "Puffle Creatures"
      ],
      [
        "w.app.pufflecare.manual.wildpuffle.content1",
        "Many puffle creatures have been discovered, but there could be even more out there!"
      ],
      [
        "w.app.pufflecare.manual.wildpuffle.content2",
        "Puffle creatures can dig\nfor rare treasures."
      ],
      [
        "w.app.pufflecare.manual.wildpuffle.content3",
        "Members can adopt some puffle creatures from the Wild Puffle Reserve. They can be cared for at the Puffle Hotel."
      ],
      [
        "park",
        "Puffle Park"
      ],
      [
        "w.app.prompt.oops.puffledinowalk.content1",
        "\u2022 Walk their puffle creatures and care for them in the Puffle Hotel\n\u2022 Bring their puffle creatures into their igloo"
      ],
      [
        "w.app.prompt.oops.puffledinowalk.header1",
        "Taking puffle creatures out of the backyard requires a paid membership."
      ],
      [
        "w.app.prompt.notenoughcoins.nothanks",
        "OK"
      ],
      [
        "w.map.puffle_park",
        "Puffle Park"
      ],
      [
        "w.app.hud.tooltip.puffletricks",
        "Puffle Tricks"
      ],
      [
        "w.app.prompt.puffletricks.nopuffle",
        "Adopt a puffle and walk it to perform tricks!"
      ],
      [
        "w.app.prompt.button.gotopetshop",
        "Go to Pet Shop"
      ],
      [
        "w.app.prompt.puffletricks.notwalkingpuffle",
        "Walk your puffle to perform tricks!"
      ],
      [
        "w.app.prompt.button.gotoigloo",
        "Go to igloo"
      ],
      [
        "w.redemption.onetoone.prompt.close",
        "You have more items to unlock.\nYou can use your code later, but will need to choose new items.\nStill want to quit?"
      ],
      [
        "park_find",
        "%name% is playing in the Puffle Park"
      ],
      [
        "park_hint",
        "Puffle Park"
      ],
      [
        "w.app.pufflecare.manual.puffletricks.header",
        "Puffle Tricks"
      ],
      [
        "w.app.pufflecare.manual.puffletricks.content1",
        "Take your pet for a walk and click the puffle icon to perform tricks!"
      ],
      [
        "w.app.pufflecare.manual.puffletricks.nuzzle",
        "Nuzzle"
      ],
      [
        "w.app.pufflecare.manual.puffletricks.speak",
        "Speak"
      ],
      [
        "w.app.pufflecare.manual.puffletricks.jump",
        "Jump"
      ],
      [
        "w.app.pufflecare.manual.puffletricks.standonhead",
        "Stand on head"
      ],
      [
        "w.app.pufflecare.manual.puffletricks.rollover",
        "Rollover"
      ],
      [
        "w.app.pufflecare.manual.puffletricks.spin",
        "Spin"
      ],
      [
        "w.app.pufflecare.manual.puffletricks.dig",
        "Dig"
      ],
      [
        "w.app.pufflecare.manual.button.howtoadopt",
        "How to Adopt"
      ],
      [
        "w.puffles.dialogue.puffletricks1",
        "You and your puffle can now do tricks. Congrats! \nThey're a great way to bond with your puffles!"
      ],
      [
        "w.puffles.dialogue.puffletricks2",
        "Click on the Puffle Trick icon and choose one."
      ],
      [
        "w.endgamescreen.coinsearned",
        "Coins earned:"
      ],
      [
        "w.endgamescreen.totalcoins",
        "Your total coins: %0%"
      ],
      [
        "w.endgamescreen.usecoins",
        "Use your coins to:"
      ],
      [
        "soccer_find",
        "%name% is in a soccer shootout!"
      ],
      [
        "rink_find",
        "%name% is in the Stadium"
      ],
      [
        "w.app.music.widget.nowplaying",
        "Now playing"
      ],
      [
        "w.app.music.widget.upnext",
        "Up Next"
      ],
      [
        "w.app.music.widget.queueposition",
        "You are #%number% in the playlist."
      ],
      [
        "w.app.music.widget.notracksshared",
        "You are not sharing any tracks."
      ],
      [
        "load_mixmaster",
        "Loading SoundStudio"
      ],
      [
        "mixmaster_prompt",
        "Would you like to start SoundStudio?"
      ],
      [
        "m.igloo.editor.musicMenu.studio.gameTitle",
        "Go to SoundStudio"
      ],
      [
        "m.igloo.editor.musicMenu.studio.DJ3KTracks",
        "DJ3K Tracks"
      ],
      [
        "m.igloo.editor.musicMenu.studio.description",
        "Members can record and share tracks in SoundStudio!"
      ],
      [
        "m.game.soundstudio.makeMusic",
        "Make Music"
      ],
      [
        "m.game.soundstudio.instructions",
        "Instructions"
      ],
      [
        "m.game.soundstudio.savedTracks",
        "Saved Tracks"
      ],
      [
        "m.game.soundstudio.sharedTracks",
        "Shared Tracks"
      ],
      [
        "m.game.soundstudio.noSavedTracks",
        "Members can share music from their Saved Tracks"
      ],
      [
        "w.app.music.songlist.sharednone1",
        "Not Sharing\na Track"
      ],
      [
        "w.app.music.songlist.sharednone2",
        "Members can share a track and visit the Dance Club to hear it play.\n\nOther players can listen and Like it!"
      ],
      [
        "w.app.music.songlist.sharedheader",
        "Currently Sharing"
      ],
      [
        "w.app.music.likes.error",
        "Oops, something's wrong.  Please try again later."
      ],
      [
        "w.app.music.likes.alreadyliked",
        "Come back tomorrow to like this again!"
      ],
      [
        "w.app.music.songlist.sharedclub",
        "Go to the Dance Club to hear your song play!"
      ],
      [
        "w.app.music.songlist.on",
        "On"
      ],
      [
        "w.app.music.songlist.off",
        "Off"
      ],
      [
        "w.app.music.songlist.sharing",
        "Sharing!"
      ],
      [
        "w.app.music.songlist.songlikes",
        "Likes:"
      ],
      [
        "w.app.music.songlist.deleteheader1",
        "Your track list is full."
      ],
      [
        "w.app.music.songlist.deleteheader2",
        "Delete a song to make some room."
      ],
      [
        "w.app.music.songlist.notrack1",
        "You don't have any saved tracks."
      ],
      [
        "w.app.music.songlist.notrack2",
        "Use SoundStudio to make a song."
      ],
      [
        "w.app.music.songlist.startstudio",
        "Start SoundStudio"
      ],
      [
        "w.app.music.songlist.notmember",
        "Recording and sharing  SoundStudio tracks requires  a paid membership."
      ],
      [
        "w.app.music.songlist.songempty",
        "Create New Track"
      ],
      [
        "w.app.music.songlist.songdelete",
        "This song and all its Likes will be deleted."
      ],
      [
        "w.app.music.songlist.yes",
        "yes"
      ],
      [
        "w.app.music.songlist.no",
        "no"
      ],
      [
        "w.app.music.instructions.1",
        "Choose a set of sounds."
      ],
      [
        "w.app.music.instructions.2",
        "Each button plays a sound. Loops repeat,  while one-shots play once each time you press them..."
      ],
      [
        "w.app.music.instructions.3",
        "Members can hit Record to save and share songs"
      ],
      [
        "w.app.music.instructions.4",
        "Members can view and share songs in Saved Tracks."
      ],
      [
        "w.app.music.instructions.5",
        "Shared tracks play in the Dance Club and your igloo.  Other players listening in the Dance Club can Like your song!"
      ],
      [
        "w.app.music.game.board.genre.0",
        "Pop"
      ],
      [
        "w.app.music.game.board.genre.1",
        "Rock"
      ],
      [
        "w.app.music.game.board.genre.2",
        "Dance"
      ],
      [
        "w.app.music.game.board.genre.3",
        "Dubstep"
      ],
      [
        "w.app.music.game.board.prompt.save",
        "Save"
      ],
      [
        "w.app.music.game.board.prompt.cancel",
        "Cancel"
      ],
      [
        "w.app.music.game.board.prompt.nameTrack",
        "Name Your Track"
      ],
      [
        "w.app.music.game.board.loops",
        "LOOPS"
      ],
      [
        "w.app.music.game.board.oneShots",
        "ONE-SHOTS"
      ],
      [
        "w.app.music.game.board.record",
        "Record"
      ],
      [
        "w.app.music.game.board.stop",
        "Stop"
      ],
      [
        "w.app.music.game.start.sharedTracks",
        "Shared Tracks"
      ],
      [
        "w.app.music.game.start.sharedTracks.members",
        "Members can share music from their Saved Tracks"
      ],
      [
        "w.app.music.game.board.prompt.choose.another.name",
        "Please choose another name"
      ],
      [
        "w.app.music.game.oops.description",
        "Recording and sharing SoundStudio tracks requires a paid membership"
      ],
      [
        "soundstudio_prompt",
        "Would you like to play SoundStudio?"
      ],
      [
        "soundroom_find",
        "%name% is Mixing Music"
      ],
      [
        "w.map.soundstudio",
        "Soundstudio"
      ],
      [
        "w.map.skate_park",
        "Skatepark"
      ],
      [
        "skatepark_find",
        "%name% is at the Skatepark"
      ],
      [
        "Day.abbreviated",
        "day"
      ],
      [
        "w.app.music.game.board.genre.4",
        "Spooky"
      ],
      [
        "m.game.soundstudio.spookyPromo",
        "New spooky sounds available for  your tracks!"
      ],
      [
        "m.game.soundstudio.spookyPromo2",
        "Haunt the  Dance Club with spooky sounds!"
      ],
      [
        "w.p2014.party.dialogue.gothere",
        "Holiday Giveaway"
      ],
      [
        "w.party.dialogue.wear",
        "Wear"
      ],
      [
        "crystal_puffle_adopt.components_puffle_name.adoptthispuffle_text",
        "Are you ready to adopt a blue crystal puffle?"
      ],
      [
        "crystal_puffle_adopt.components_puffle_name.givepufflename_text",
        "Choose a name"
      ],
      [
        "attic_find",
        "%name% is in the Mystery Attic"
      ],
      [
        "lodge_find",
        "%name% is in the Puffle Lodge"
      ],
      [
        "pufflewild_find",
        "%name% is visiting the Wild Puffle Reserve"
      ],
      [
        "w.app.prompt.oops.wildpuffle.header",
        "Wild puffles require a paid membership."
      ],
      [
        "w.app.prompt.oops.wildpuffle.subheader",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.wildpuffle.content",
        "\u2022 Adopt all the wild puffle creatures available\n\u2022 Go on walks with them and dig for treasures\n\u2022 Bring them to their igloo or into their backyard"
      ],
      [
        "adoptpuffle.choose_text",
        "Choose a color"
      ],
      [
        "w.map.puffle_wild",
        "Puffle Wild"
      ],
      [
        "w.app.prompt.oops.iglooplaymusic.content1",
        "\u2022 Access and play music in their igloos\n\u2022 Use SoundStudio to record and play music in their igloos"
      ],
      [
        "mall_find",
        "%name% is at the Mall"
      ],
      [
        "w.p2015.june.ui.title",
        "Training Missions"
      ],
      [
        "w.p2015.june.ui.message",
        "From the archives of the island's first defenders, the Penguin Secret Agency."
      ],
      [
        "w.p2015.june.ui.messageRU",
        "These missions are in English."
      ],
      [
        "w.p2015.june.ui.unlock1",
        "Unlocks on June 18"
      ],
      [
        "w.p2015.june.ui.unlock2",
        "Unlocks on June 25"
      ],
      [
        "w.p2015.june.ui.launchbutton",
        "Launch Mission"
      ],
      [
        "w.p2015.june.ui.playagainbtn",
        "Play Again"
      ],
      [
        "w.p2015.june.ui.mission1",
        "1. Case of the Missing Puffles"
      ],
      [
        "w.p2015.june.ui.mission2",
        "2. G's Secret Mission"
      ],
      [
        "w.p2015.june.ui.mission3",
        "3. Case of the Missing Coins"
      ],
      [
        "w.p2015.june.ui.mission4",
        "4. Avalanche Rescue"
      ],
      [
        "w.p2015.june.ui.mission5",
        "5. Secret of the Fur"
      ],
      [
        "w.p2015.june.ui.mission6",
        "6. Questions for a Crab"
      ],
      [
        "w.p2015.june.ui.mission7",
        "7. Clockwork Repairs"
      ],
      [
        "w.p2015.june.ui.mission8",
        "8. Mysterious Tremors"
      ],
      [
        "w.p2015.june.ui.mission9",
        "9. Operation: Spy & Seek"
      ],
      [
        "w.p2015.june.ui.mission10",
        "10. Waddle Squad"
      ],
      [
        "w.p2015.june.ui.mission11",
        "11. The Veggie Villain"
      ],
      [
        "w.p2015.june.ui.nosave",
        "Agent: Progress will not save during your mission. Make sure you have around 40 minutes to complete it."
      ],
      [
        "mall",
        "Mall"
      ],
      [
        "w.map.mall",
        "The Mall"
      ],
      [
        "mall",
        "Mall"
      ],
      [
        "mall_hint",
        "The Mall"
      ],
      [
        "w.p2015.june.congrats3",
        "Agent. Training missions complete. You are now ready for anything. Be resourceful, be remarkable, be ready!"
      ],
      [
        "w.app.ui.spyphone.medals",
        "Earn medals by completing Training Missions or doing Spy Drills."
      ],
      [
        "w.app.ui.spyphone.collect",
        "Collect"
      ],
      [
        "w.app.spymissions.complete",
        "Mission Accomplished"
      ],
      [
        "w.app.spymissions.message",
        "Excellent work, agent."
      ],
      [
        "w.app.spymissions.menubtn",
        "Missions Menu"
      ],
      [
        "w.app.spymissions.catalogbtn",
        "Spy Gear Catalog"
      ],
      [
        "missions_hint",
        "PSA Missions"
      ],
      [
        "m.igloo.editor.musicMenu.cpMusic",
        "Club Penguin Music"
      ],
      [
        "m.igloo.editor.musicMenu.soundStudio",
        "SoundStudio"
      ],
      [
        "w.wmdcatalog.yourcoins",
        "Your Coins"
      ],
      [
        "w.p2015.june.new.epf.experience1",
        "Agent. Train to hone your EPF skills. Be resourceful, be remarkable, be ready!"
      ],
      [
        "w.introtocp.dialogue.quest.end.party.happening",
        "Go to the Town to learn about Club Penguin Island, a whole new experience."
      ],
      [
        "w.app.prompt.oops.header1",
        "This requires a paid membership"
      ],
      [
        "w.party.like",
        "Like"
      ],
      [
        "w.party.challenge_tickets",
        "Challenge Tickets"
      ],
      [
        "w.party.change",
        "Change"
      ],
      [
        "w.party.submit",
        "Submit"
      ],
      [
        "w.party.your_votes",
        "Your votes"
      ],
      [
        "w.app.prompt.october2015.oops.subheader1",
        "Members can:"
      ],
      [
        "w.app.generic.transform",
        "Transform!"
      ],
      [
        "w.app.prompt.oops.november2015.header1",
        "Adopting this puffle requires a paid membership"
      ],
      [
        "w.app.prompt.oops.november2015.subheader1",
        "Members can:"
      ],
      [
        "w.app.prompt.oops.november2015.content1",
        "\u2022 Adopt all the alien puffles while they are available"
      ],
      [
        "ufo_find",
        "%name% is having an alien encounter"
      ],
      [
        "w.app.p2015.december.login1",
        "Hello. You can collect free gifts from this calendar. New ones unlock every day until Dec. 25. Happy holidays!"
      ],
      [
        "w.p2014.prehistoric.dialogue.adopt",
        "Adopt"
      ],
      [
        "w.app.generic.memberscan",
        "Members can adopt dino puffles and transform into dinosaurs"
      ],
      [
        "w.generic.button.goto",
        "Go There"
      ],
      [
        "w.generic.button.gothere",
        "Go There"
      ],
      [
        "w.generic.button.findme",
        "Go There"
      ],
      [
        "w.app.prompt.oops.january2016.header1",
        "This item requires a paid membership."
      ],
      [
        "w.app.prompt.oops.january2016.subheader1",
        "Members can:"
      ],
      [
        "w.party.dialogue.claim",
        "Collect"
      ],
      [
        "w.app.november2016.task1.congrats.instructions",
        "Wanna wear your new item? Click the penguin icon!"
      ],
      [
        "w.app.generic.january2017.weblink",
        "https:\/\/www.clubpenguinisland.com\/pre-registration\/"
      ],
      [
        "w.app.february2017.login0201",
        "Welcome to the Waddle On party, everyone. It\u2019s our celebration of the years of fun we\u2019ve had on the island."
      ],
      [
        "w.app.february2017.login0201.2",
        "Test your knowledge with trivia questions and fill out your memories page. And thank you for making the Club Penguin community so amazing!"
      ],
      [
        "w.app.february2017.task1.start",
        "It\u2019s time for puffle questions in the Forest. I\u2019ve written a couple that might even stump PH herself!"
      ],
      [
        "w.app.february2017.task1.congrats",
        "Looks like you enjoy the fuzzy furballs as much as I do! Well done."
      ],
      [
        "w.app.february2017.task2.start",
        "There are new trivia questions. But they\u2019re in a secret location!"
      ],
      [
        "w.app.february2017.task2.congrats",
        "I suppose I should be concerned about EPF knowledge going public, but I\u2019m impressed!"
      ],
      [
        "w.app.february2017.task3.start",
        "If you\u2019re a history buff, then check out the Cove for new trivia questions."
      ],
      [
        "w.app.february2017.task3.congrats",
        "Good job with the trivia. You could be a Club Penguin Times reporter."
      ],
      [
        "w.app.february2017.task4.start",
        "Visit the Dock and test your knowledge about items and igloos."
      ],
      [
        "w.app.february2017.task4.congrats",
        "Excellent job. You sound like an avid collector of items."
      ],
      [
        "w.app.february2017.task5.start",
        "Are you a black belt? Then you\u2019ll score high on the Ninja trivia in the Dojo."
      ],
      [
        "w.app.february2017.task5.congrats",
        "What does Sensei say? Something about \u201crocking the house\u201d? I\u2019m sure that applies to you here."
      ],
      [
        "w.app.february2017.task6.start",
        "The Stadium is hosting the next big trivia match!"
      ],
      [
        "w.app.february2017.task6.congrats",
        "GOAL! What a performance! I enjoyed that as much as any soccer match"
      ],
      [
        "w.app.february2017.task7.start",
        "The island has transformed a lot over the years. Test your memory of rooms in the Plaza."
      ],
      [
        "w.app.february2017.task7.congrats",
        "You\u2019ve paid close attention to the island over the years. Well done."
      ],
      [
        "w.app.february2017.iceberg.plaque",
        "Together, we can build an island, create a community, change the world... and even tip an iceberg. Waddle on."
      ],
      [
        "w.app.february2017.alltasks.congrats",
        "You've proven to be a trivia master and collected every pin for your memory book. Well done!"
      ],
      [
        "w.app.february2017.iceberg.congrats",
        "Amazing! I never thought I\u2019d witness the iceberg tipping! Congratulations on your discovery."
      ],
      [
        "w.p2014.party.dialogue.gothere",
        "View Memory Pages"
      ],
      [
        "w.app.generic.february2017.paneldescription1.visiticeberg",
        "Visit the Iceberg"
      ],
      [
        "w.app.generic.february2017.paneldescription2.info",
        "Trivia topic for the Forest"
      ],
      [
        "w.app.generic.february2017.paneldescription2.subject",
        "PUFFLES"
      ],
      [
        "w.app.generic.february2017.paneldescription2",
        "Get 3 right to unlock items!"
      ],
      [
        "w.app.generic.february2017.paneldescription.moretrivia",
        "Earn coins by answering more trivia"
      ],
      [
        "w.app.generic.february2017.paneldescription2.location",
        "Visit the Forest"
      ],
      [
        "w.app.generic.february2017.paneldescription3.locked",
        "Unlocks on Feb. 3"
      ],
      [
        "w.app.generic.february2017.paneldescription3.info",
        "Trivia topic for the HQ"
      ],
      [
        "w.app.generic.february2017.paneldescription3.subject",
        "SPIES"
      ],
      [
        "w.app.generic.february2017.paneldescription3",
        "Get 3 right to unlock items!"
      ],
      [
        "w.app.generic.february2017.paneldescription.moretrivia",
        "Earn coins by answering more trivia."
      ],
      [
        "w.app.generic.february2017.paneldescription3.location",
        "Visit the HQ"
      ],
      [
        "w.app.generic.february2017.paneldescription4.locked",
        "Unlocks on Feb. 4"
      ],
      [
        "w.app.generic.february2017.paneldescription4.info",
        "Trivia topic for the Cove"
      ],
      [
        "w.app.generic.february2017.paneldescription4.subject",
        "PARTIES"
      ],
      [
        "w.app.generic.february2017.paneldescription4",
        "Get 3 right to unlock items!"
      ],
      [
        "w.app.generic.february2017.paneldescription.moretrivia",
        "Earn coins by answering more trivia."
      ],
      [
        "w.app.generic.february2017.paneldescription4.location",
        "Visit the Cove"
      ],
      [
        "w.app.generic.february2017.paneldescription5.locked",
        "Unlocks on Feb. 6"
      ],
      [
        "w.app.generic.february2017.paneldescription5.info",
        "Trivia topic for the Dock"
      ],
      [
        "w.app.generic.february2017.paneldescription5.subject",
        "Items & Igloos"
      ],
      [
        "w.app.generic.february2017.paneldescription5",
        "Get 3 right to unlock items!"
      ],
      [
        "w.app.generic.february2017.paneldescription.moretrivia",
        "Earn coins by answering more trivia"
      ],
      [
        "w.app.generic.february2017.paneldescription5.location",
        "Visit the Dock"
      ],
      [
        "w.app.generic.february2017.paneldescription6.locked",
        "Unlocks on Feb. 8"
      ],
      [
        "w.app.generic.february2017.paneldescription6.info",
        "Trivia topic for the Dojo"
      ],
      [
        "w.app.generic.february2017.paneldescription6.subject",
        "NINJAS"
      ],
      [
        "w.app.generic.february2017.paneldescription6",
        "Get 3 right to unlock items!"
      ],
      [
        "w.app.generic.february2017.paneldescription.moretrivia",
        "Earn coins by answering more trivia"
      ],
      [
        "w.app.generic.february2017.paneldescription6.location",
        "Visit the Dojo"
      ],
      [
        "w.app.generic.february2017.paneldescription7.locked",
        "Unlocks on Feb. 10"
      ],
      [
        "w.app.generic.february2017.paneldescription7.info",
        "Trivia topic for the Stadium"
      ],
      [
        "w.app.generic.february2017.paneldescription7.subject",
        "MINIGAMES"
      ],
      [
        "w.app.generic.february2017.paneldescription7",
        "Get 3 right to unlock items!"
      ],
      [
        "w.app.generic.february2017.paneldescription.moretrivia",
        "Earn coins by answering more trivia"
      ],
      [
        "w.app.generic.february2017.paneldescription7.location",
        "Visit the Stadium"
      ],
      [
        "w.app.generic.february2017.paneldescription8.locked",
        "Unlocks on Feb. 11"
      ],
      [
        "w.app.generic.february2017.paneldescription8.info",
        "Trivia topic for the Plaza"
      ],
      [
        "w.app.generic.february2017.paneldescription8.subject",
        "ISLAND HISTORY"
      ],
      [
        "w.app.generic.february2017.paneldescription8",
        "Get 3 right to unlock items!"
      ],
      [
        "w.app.generic.february2017.paneldescription.moretrivia",
        "Earn coins by answering more trivia"
      ],
      [
        "w.app.generic.february2017.paneldescription8.location",
        "Visit the Plaza"
      ],
      [
        "w.app.generic.february2017.paneldescription9.reminder",
        "Members can collect the Alumni Jacket."
      ],
      [
        "w.app.generic.february2017.paneldescription9",
        "Visit the Town"
      ],
      [
        "w.app.loadingscreen.2017february",
        "Celebrate at the Waddle On party until Mar. 29"
      ],
      [
        "w.app.generic.february2017.paneldescription9.info",
        "Learn about the new Club Penguin Island"
      ],
      [
        "w.app.generic.february2017.weblink",
        "https:\/\/www.clubpenguinisland.com\/"
      ],
      [
        "w.app.prompt.oops.february2017.content1",
        "\u2022 Wear the alumni jacket that shows how old their penguin is."
      ],
      [
        "w.app.january2017.town.jacket",
        "Club Penguin Island is the place for adventure, friends, fashion, and stinky cheese.\nPenguins new and old work to make it a welcoming, wonderful community."
      ],
      [
        "w.app.february2017.town.jacket",
        "Club Penguin Island is the place for adventure, friends, fashion, and stinky cheese. Penguins new and old work to make it a welcoming, wonderful community."
      ],
      [
        "w.app.february2017.login0322",
        "Thank you for making Club Penguin so incredibly inspiring. Waddle on, everyone!"
      ],
      ...Object.entries(gameStrings)
    ],
    "error_lang": [
      [
        "shell.KICK",
        "A moderator has removed you from this server. Please be careful what you say and do online and remember to follow the Club Penguin rules."
      ],
      [
        "shell.MODERATOR_BAN",
        "A moderator has banned your account. Your ban will expire in: %number% hours"
      ],
      [
        "shell.GAME_CHEAT",
        "The system has automatically removed you from the server. Please be careful what you say and do online and remember to follow the Club Penguin rules."
      ],
      [
        "shell.BAN_DURATION",
        "<b>Banned:<\/b>\nYou are banned for the next %0 %1"
      ],
      [
        "shell.BAN_FOREVER",
        "<b>Banned:<\/b>\nYou are banned forever"
      ],
      [
        "shell.BAN_AN_HOUR",
        "<b>Banned:<\/b>\nYour ban will expire within the hour"
      ],
      [
        "shell.HACKING_AUTO_BAN",
        "<b>Banned:<\\b>\nThe server has automatically banned you.\nReason: \"%reason%\""
      ],
      [
        "shell.BUDDY_LIMIT",
        "Sorry, you may only have %number% buddies. Please remove some buddies to add more"
      ],
      [
        "shell.TIME_WARNING",
        "You have %number% minutes remaining on the Club Penguin Timer. Have fun!"
      ],
      [
        "shell.NO_PLAY_TIME",
        "Time's up. Thanks for playing! Check out the <b>%0Community%1<\/b> section of the website for fun ways to spend your time outside of Club Penguin."
      ],
      [
        "shell.PLAY_TIME_OVER",
        "Time's up. Thanks for playing! Check out the <b>%0Community%1<\/b> section of the website for fun ways to spend your time outside of Club Penguin."
      ],
      [
        "shell.OUT_PLAY_TIME",
        "You can only play between the hours of %0 and %1."
      ],
      [
        "shell.GROUNDED",
        "You cannot play because you're currently grounded."
      ],
      [
        "shell.PLAYER_IN_ROOM",
        "Please exit your game before leaving the room"
      ],
      [
        "shell.DEFAULT_ERROR",
        "There was an error"
      ],
      [
        "shell.TIME_OUT",
        "Auto Disconnect, your penguin has been idle for more than 10 minutes"
      ],
      [
        "shell.CONNECTION_LOST",
        "Connection was lost.\nPlease click to learn more"
      ],
      [
        "shell.LOAD_ERROR",
        "<b>Load Error<\/b>\nPlease clear your cache and try again"
      ],
      [
        "shell.MULTI_CONNECTIONS",
        "You can only have one Club Penguin window open at a time. Please close any other windows and tabs in your internet browser to connect."
      ],
      [
        "shell.ACCOUNT_NOT_ACTIVATE",
        "Your account has not been activated"
      ],
      [
        "shell.NO_SOCKET_CONNECTION",
        "Having trouble connecting? Please try again, or contact support if the problem continues."
      ],
      [
        "shell.ITEM_NOT_EXIST",
        "This item is not currently available."
      ],
      [
        "shell.CONNECTION_TIMEOUT",
        "Connection timeout. Please choose another server or try again later."
      ],
      [
        "shell.MAX_IGLOO_FURNITURE_ERROR",
        "Sorry, your igloo may only contain %number% items. Please remove an item to add this item."
      ],
      [
        "shell.NOT_MEMBER",
        "Oops! You need to purchase a membership to buy %type%. We would love to have you join. Click the button below to see more about membership"
      ],
      [
        "shell.PASSWORD_REQUIRED",
        "You must provide your password \nto enter Club Penguin"
      ],
      [
        "shell.PASSWORD_SHORT",
        "Your password is too short. \nPlease try again"
      ],
      [
        "shell.PASSWORD_LONG",
        "Your password is too long. \nPlease try again"
      ],
      [
        "shell.PASSWORD_WRONG",
        "Sorry! Incorrect penguin name or password. Passwords are CaSe SeNsiTIVE."
      ],
      [
        "shell.PUFFLE_LIMIT_M",
        "Sorry, you may only have a maximum of %number% puffles"
      ],
      [
        "shell.PUFFLE_LIMIT_NM",
        "Sorry, you must be a member to have more than %number% puffles"
      ],
      [
        "shell.NAME_NOT_ALLOWED",
        "Sorry, this name is not available. Please try again"
      ],
      [
        "shell.REDEMPTION_CONNECTION_LOST",
        "Sorry, you've lost connection. If you haven't closed the Treasure Book, you can reuse your code later."
      ],
      [
        "shell.REDEMPTION_ALREADY_HAVE_ITEM",
        "You already have this item."
      ],
      [
        "shell.REDEMPTION_SERVER_FULL",
        "The server is full. Please try again later."
      ],
      [
        "shell.REDEMPTION_BOOK_ID_NOT_EXIST",
        "That book does not exist."
      ],
      [
        "shell.REDEMPTION_BOOK_ALREADY_REDEEMED",
        "You have already unlocked this book."
      ],
      [
        "shell.REDEMPTION_WRONG_BOOK_ANSWER",
        "Oops! You've entered an incorrect answer. Please try again."
      ],
      [
        "shell.REDEMPTION_BOOK_TOO_MANY_ATTEMPTS",
        "Oops! An incorrect answer has been entered 5 times. Please try again in 45 minutes."
      ],
      [
        "shell.REDEMPTION_CODE_NOT_FOUND",
        "Oops! The code you've entered is incorrect. Please try again."
      ],
      [
        "shell.REDEMPTION_CODE_ALREADY_REDEEMED",
        "Oops! That code has already been used."
      ],
      [
        "shell.REDEMPTION_TOO_MANY_ATTEMPTS",
        "An incorrect code has been entered 5 times. Please try again in\n45 minutes."
      ],
      [
        "shell.REDEMPTION_CATALOG_NOT_AVAILABLE",
        "Sorry, the catalog you're looking for is not available yet. Please try again at a later date."
      ],
      [
        "shell.REDEMPTION_PUFFLES_MAX",
        "You already have the maximum number of puffles."
      ],
      [
        "shell.REDEMPTION_PUFFLE_INVALID",
        "Please choose a different puffle name."
      ],
      [
        "shell.REDEMPTION_PUFFLE_CODE_MAX",
        "You can only redeem one puffle per code."
      ],
      [
        "shell.REDEMPTION_CODE_TOO_SHORT",
        "Oops! The code is too short. It must be at least 9 characters."
      ],
      [
        "shell.REDEMPTION_CODE_TOO_LONG",
        "Oops! The code is too long. It must be 16 characters or shorter."
      ],
      [
        "shell.REDEMPTION_NO_EXCLUSIVE_REDEEMS",
        "You've chosen all of your Super Exclusive bonus items."
      ],
      [
        "shell.REDEMPTION_CODE_GROUP_REDEEMED",
        "Only one code containing 2500 coins can be redeemed per account."
      ],
      [
        "shell.REDEMPTION_CODE_EXPIRED",
        "The code you have entered has expired"
      ],
      [
        "shell.GOLDEN_CODE_NOT_READY",
        "You'll be able to redeem this code July 21. Please come back then..."
      ],
      [
        "shell.ITEM_IN_HOUSE",
        "You already have this item"
      ],
      [
        "shell.NOT_ENOUGH_COINS",
        "You need more coins"
      ],
      [
        "shell.NOT_ENOUGH_MEDALS",
        "You don't have enough medals to obtain this item."
      ],
      [
        "shell.NAME_REQUIRED",
        "You must provide your Penguin Name to enter Club Penguin"
      ],
      [
        "shell.NAME_SHORT",
        "Your Penguin Name is too short. Please try again"
      ],
      [
        "shell.NAME_LONG",
        "Your Penguin Name is too long. Please try again"
      ],
      [
        "shell.NAME_NOT_FOUND",
        "Penguin not found. Try Again?"
      ],
      [
        "shell.LOGIN_FAILED",
        "Login Failed, please try at a later time"
      ],
      [
        "shell.LOGIN_FLOODING_DAILY",
        "Maximum login attempts exceeded. Please try again in an hour"
      ],
      [
        "shell.LOGIN_FLOODING",
        "Maximum login attempts exceeded. Please try again in an hour"
      ],
      [
        "shell.PASSWORD_SAVE_PROMPT",
        "Do not use this feature if\nyou are using a school, library,\nor public computer.\n\nAnyone that uses this computer will have access to your penguin."
      ],
      [
        "shell.SERVER_FULL",
        "Sorry this server is full. Please select another server."
      ],
      [
        "shell.ROOM_FULL",
        "Sorry this room is currently full"
      ],
      [
        "shell.GAME_FULL",
        "Sorry, this game is full. Check back in a little while. Thank you for your patience!"
      ],
      [
        "shell.MAX_STAMPBOOK_COVER_ITEMS",
        "Only %number% items can be stuck on the cover at once."
      ],
      [
        "shell.PLAYER_HAS_MAX_ITEMS",
        "Sorry, you can only buy this item 99 times."
      ],
      [
        "shell.AUTO_BAN",
        "<b>Banned:<\/b>The server has automatically banned you for saying a bad word."
      ],
      [
        "shell.ITEM_NOT_AVAILABLE",
        "This item is not currently available."
      ],
      [
        "shell.CONNECTION_NOT_ALLOWED",
        "Having trouble connecting? Please try again, or contact support if the problem continues."
      ],
      [
        "shell.CHROME_MAC_LOGIN_ERROR",
        "Sorry, there was an error with Chrome's version of Flash Player. Please visit our Help Section for more info."
      ]
    ]
  }

  return JSON.stringify(json);
}