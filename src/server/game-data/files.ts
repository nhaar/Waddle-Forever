/** Module handles information of all the files stored in the media folder */

import path from "path";
import { IS_DEV } from "../../common/constants";
import { PACKAGE_INFO } from "./package-info";
import { PackageName } from "./packages";
import { DEFAULT_DIRECTORY, getFilesInDirectory, iterateEntries } from "../../common/utils";

/**
 * File reference is a term used in this code base to refer a string in the format
 * subdirectory:path
 * Where subdirectory is one of a few values which categorize what type of file it is
 * and the path is the path of the file inside the subdirectories
 * */
export type FileRef = string;

/** Information regarding a file */
type FileDocumentation = {
  /** File path inside sudirectory. Not a file reference */
  file: string;
  /** Arbitrary string commenting the file */
  comment: string;
  /** File reference to the file used to make this one */
  base?: FileRef;
};

// reference to names of subdirectories
const FIX = 'fix';
const APPROXIMATION = 'approximation';
const RECREATION = 'recreation';
const MOD = 'mod';
const TOOL = 'tool';
const UNKNOWN = 'unknown';

/** Information of all files that undergo a custom process. Used purely for internal documentation and has no use in production */
const FILE_DOCUMENTATIONS: Record<string, FileDocumentation[]> = {
  [FIX]: [
    {
      file: 'Book2_03_halloween.swf',
      comment: 'Chat291.swf compatibility fixes. Files from around 2005 need the code slightly changed due to not having proper spawn points and the triggers using room names instead of room IDs.'
    },
    {
      file: 'Beta-book.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Igloo1.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Igloo2.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Igloo3.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Igloo5.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Igloo6.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Mtn1.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Dance1b_halloween.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Lounge1_halloween.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Dojo_halloween.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Icerink_halloween.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Town_halloween.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Dance1b_pet.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Forts_pet.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Icerink_pet.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'CP05Coffee.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'CP05Dance.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'CP05Lodge.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'CP05Rink.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'CP05Shop.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'CP05Town.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'CP05Village.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'ENGamesBook2BurntOutBulbs.swf',
      comment: 'Domain check removed'
    },
    {
      file: 'Chat299.swf',
      comment: 'Domain check removed'
    },
    {
      file: 'Chat604.swf',
      comment: `Domain check removed, fixed ports, recompiled frame 30 via FFDEC to remove obfuscation

Manually added the party99.swf entry for medieval 08 (technically the path was party.swf, this may be changed at some point)`
    },
    {
      file: 'RoomsParty3-WinterParty.swf',
      comment: `All the rooms in the Winter Party party that are marked as fix are because of an issue that i could
not figure out with the game engine. When the room SWF loads, the player position
obtained from the jr packet should have already been placed inside the penguin's mc coordinates
however, for a mysterious reason, that is not the case, and engine.swf only updates it after
the room checks, so I did a workaround of checking if _x != 0 as well since that
is the default value
this issue was broken with both the 2010 engine and the 2009 engine,
indicating the issue might lie within shell.swf, or another SWF
until those client files can be implemented, this party will have this workaround fix
the issue in question is not being able to walk past the intersections of blue and orange paths`
    },
    {
      file: 'RoomsParty4-WinterParty.swf',
      comment: 'Winter Party room fix'
    },
    {
      file: 'RoomsParty5-WinterParty.swf',
      comment: 'Winter Party room fix'
    },
    {
      file: 'RoomsParty6-WinterParty.swf',
      comment: 'Winter Party room fix'
    },
    {
      file: 'RoomsParty10-WinterParty.swf',
      comment: 'Winter Party room fix'
    },
    {
      file: 'ArtworkRoomsCoffee2.swf',
      comment: `Chat291.swf compatibility fixes
However, the auto-sitting doesnt seem to work with chat291 anyways, so that
would need to investigated`
    },
    {
      file: 'ArtworkRoomsAgent3.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Pizzatron3000-2007.swf',
      comment: 'Domain check removed'
    },
    {
      file: 'GamesDancingDance.swf',
      comment: 'Domain check removed'
    },
    {
      file: 'GamesJetPackAdventureMain.swf',
      comment: 'Domain check removed'
    },
    {
      file: 'GamesThiniceThinIce.swf',
      comment: 'Domain check removed'
    },
    {
      file: 'ArtworkRoomsForts3.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'Chat339.swf',
      comment: 'Domain check removed, script recompiled in FFDEC to remove obfuscation'
    },
    {
      file: 'ArtworkRoomsRink12.swf',
      comment: 'This file appears to be a debug unreleased file, as it has debugging log text on screen. The text is removed. It is unknown if this file should even be added to the game'
    },
    {
      file: 'CartSurfer2006.swf',
      comment: 'Removed domain check'
    },
    {
      file: 'ENFormsAgent.swf',
      comment: 'Fix by Blue Kirby, it uses a function from shell.swf which is not present in the WF one, so the function call was replaced with the function contents. Alternatively a shell change could be done and have this file be the original instead'
    },
    {
      file: 'Town-party.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'RoomsPlaza-MusicJam2008.swf',
      comment: 'Added triggers and logic to this file that for some reason has unexisting logic'
    },
    {
      file: 'PuffleRoundupWhitePuffle.swf',
      comment: 'Removed domain check'
    },
    {
      file: 'ArtworkRoomsForts.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'ArtworkRoomsSkihill.swf',
      comment: 'Chat291.swf compatibility fixes'
    },
    {
      file: 'StartModuleBeta.swf',
      comment: 'For some reason, the blue background in modern club_penguin.swf\'s doesn\'t appear in the start screen, so this fix circumvents that by renabling the `initMainBackground` function (with some changes so that the depth would properly display), which is an unused function that enables the blue background that is present in the start module itself. Aditionally, removed analyticReportingAs3 request'
    },
    {
      file: 'HolidayParty2012Party3.swf',
      comment: 'The original file was modified so that it automatically changes the snowball effect depending on where you step. It is unknown which mechanism was used to do this in the original, it is likely that maybe party.swf or engine.swf had a say on this, but since we can\'t know for sure it was easier to just mod this file. I took this code from JF archives, I am not sure if it comes from an original SWF or if it was made by NewCP team'
    },
    {
      file: 'PlayStartSwfStart.swf',
      comment: 'Removed the tracking service, which downloads an external SWF which has no useful functionality. Required for truly offline play'
    },
    {
      file: 'Paper86.swf',
      comment: 'Adds all missing items from April to mid-July 2008.'
    }
  ],
  [APPROXIMATION]: [
    {
      file: 'chat291_no_news.swf',
      comment: 'Originally chat291.swf (based on the one currently in unknown). First removed the Newspaper icon to simulate pre-newspapers, then modded the player icon button to open the news and change its hint to say "View News". Then, took the mail icon from chat339 and replaced the star icon in the chatbar with it. Also took the penguin from chat339 and placed it on the login screen, while removing the april fools party note. Also removed the ability to click on the moderator badge to start the PSA quiz',
      base: 'unknown:chat291.swf'
    },
    {
      file: 'chat291_no_april.swf',
      comment: 'Originally chat291.swf from "unknown", adding the penguin from chat339 and removing the april fools note'
    },
    {
      file: 'town_release.swf',
      comment: 'The Snow Forts trigger is removed',
      base: 'archives:ArtworkRoomsTown10.swf'
    },
    {
      file: 'village_release.swf',
      comment: 'Removed ability to go to the Mtn, Lodge and Sport Shop',
      base: 'archives:ArtworkRoomsVillage11.swf'
    },
    {
      file: 'rink_release.swf',
      comment: 'Removed ability to go to the Snow Forts via the door. Maybe that door went to the Town.',
      base: 'archives:ArtworkRoomsRink10.swf'
    },
    {
      file: 'village_sport.swf',
      comment: 'Only the Sport Shop trigger is active',
      base: 'archives:ArtworkRoomsVillage11.swf'
    },
    {
      file: 'village_no_lodge.swf',
      comment: 'The Sport Shop and Mtn triggers work, Lodge doesn\'t',
      base: 'archives:ArtworkRoomsVillage11.swf'
    },
    {
      file: 'music_jam_start_instruments.swf',
      comment: 'Supermanover helped removing the colored bars, this still lacks the text which is very hard to add',
      base: 'archives:MusicJam2010UpdateInstruments.swf'
    },
    {
      file: 'halloween_hunt_icon.swf',
      comment: 'This is a modified version of Ben\'s mod for the hunt to remove basket requirement'
    },
    {
      file: 'map_beach_changed_id.swf',
      comment: `Originally, the beach had ID 809,
but that was later changed. So this map I changed the ID of the beach to the new id
so that it works with newer clients (newer being around 2007)`,
      base: 'archives:ArtworkMapsIsland10.swf'
    },
    {
      file: 'map_plaza_no_berg.swf',
      comment: 'Removed the Iceberg button to simulate how the map was before the room\'s release',
      base: 'archives:ArtworkMapsIsland5.swf'
    },
    {
      file: 'take_tour.swf',
      comment: 'Modified version from the legacy media which makes it compatible with all interfaces. There must have existed an old version of this file from prior to May 27 2010 but this is an approximation that will work for all interfaces'
    },
    {
      file: 'wilderness_expedition/interface.swf',
      comment: 'Modified version of the at the time of comitting unknown:interface_stamps.swf which added the function adoptFreePuffle, used in the Wilderness Expedition 2011, which was recreated as none of the archived interfaces included it'
    },
    {
      file: 'wilderness_expedition/shell.swf',
      comment: 'Modified version ot the legacy-media shell which added the function ownsPuffleType, used in the Wilderness Expedition 2011, which was recreated to fit this shell\'s functionality. Because of the engine.swf modification, added the variable sendThrowEnabled.'
    },
    {
      file: 'temp_php_files/game_strings.php',
      comment: 'Placeholder, until logic for the JSON generation is created'
    },
    {
      file: 'temp_php_files/puffle_care.php',
      comment: 'Placeholder, until logic for the JSON generation is created'
    },
    {
      file: 'temp_php_files/puffles.php',
      comment: 'Placeholder, until logic for the JSON generation is created'
    },
    {
      file: 'temp_php_files/weblogger.php',
      comment: 'Placeholder, until logic for the JSON generation is created'
    },
    {
      file: 'shell.swf',
      comment: 'Exact same as legacy-media shell.swf, but with the function getScavengerHuntCrumbs() added (2011_scavenger_hunt.as), and sendPlayerTeleport() from archives ClientShell2012-10-17.swf (used in April Fools 2011), from the same archives file the variable MSG_SHOW_CONTENT and function showAs3Content() were also implemented. In adition to this, for the Medieval Party 2011 Hydra Battle to work, a handleUpdatePlayer call was added to handleSendPlayerMove, such that x,y are properly updated, it is unknown how exactly it worked otherwise. For Medival Party 2011 support, a check for if can throw snowball is also added (together with engine.swf). For the Battle of Doom to work fully, com.clubpenguin.services.EPFService was copied from this 2012 shell: https://web.archive.org/web/20120101000000*/http://media1.clubpenguin.com/play/v2/client/shell.swf'
    },
    {
      file: 'airtower.swf',
      comment: 'Exact same as legacy-media airtower.swf but with PLAYER_TELEPORT added (from ClientAirtower2012-07-09.swf) (for April Fools 2011). For Medival Party 2011 support, a check for if can throw snowball is also added (together with shell.swf)'
    },
    {
      file: 'engine.swf',
      comment: 'This is the legacy-media engine.swf, with the functions checkIsValidPosition(), teleportPlayer(), sendPlayerTeleport(), sendPlayerTeleportAndMove(), from archives file ClientEngine2012-10-17.swf (for April Fools 2011)'
    },
    {
      file: 'mj2009_merch.swf',
      comment: 'The 2008 merch catalog but with the ID of the access pass changed so that the party is functional. Art and other items need to be recreated'
    },
    {
      file: 'map_chat339.swf',
      comment: 'This is archives ArtworkMapsIsland5.swf but with the iceberg ID changed from 804 to be 805 as and ID changed with chat339.swf'
    },
    {
      file: 'map_shack.swf',
      comment: 'This is archives ArtworkMapsIsland10.swf but with the beach button removed for when the Mine Shack was released'
    },
    {
      file: 'lounge_no_astro.swf',
      comment: 'lounge10 from Mammoth but with the trigger and cabinet removed'
    },
    {
      file: 'penguin_no_shadow.swf',
      comment: 'penguin.swf from Mammoth but with the shadow removed'
    },
    {
      file: 'game_configs/cover.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/furniture_items.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/igloo_floors.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/igloo_locations.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/igloo_music_tracks.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/igloos.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/jokes.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/mascot_messages.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/mascots.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/player_colors.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/polaroids.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/postcards.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/puffle_items.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/puffles.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/safe_chat_messages.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/stamps_tokenized.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/tour_guide_messages.json',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'game_configs/weblogger.php',
      comment: 'Extracted from game_configs.bin from vanilla media'
    },
    {
      file: 'shell_modern_label_fix.swf',
      comment: 'The vanilla media shell.swf, but with EN_LABEL changed so that it can be used with rooms from 2011. In addition, the calls for updateListeners(PLAYER_FRAME had to be changed for the Island Adventure cove triggers to work properly. For the 2011 August interface to work, code was added to setScavengerHuntCrumbs. Changed the background to be white to match the website'
    },
    {
      file: 'rooms_common_label_fix.swf',
      comment: 'The vanilla media rooms_common.swf, but with the localize function of BaseRoom fixed so that it can be used with rooms from 2011'
    },
    {
      file: 'modern_map.swf',
      comment: 'map.swf from vanilla media, but with a fix for the map notes from 2011 (in frame1 code)'
    },
    {
      file: 'map_2011_party_note.swf',
      comment: 'Map2011.swf from archives but with the party note functionality enabled to work with the 2016 SHELL'
    },
    {
      file: 'map_dec_2011.swf',
      comment: 'ContentMapDec2011.swf from archives, but with party note functionality from 2016 SHELL. Later added a fix for the map notes from the later half of 2011, when it changed from note_container.goThereBtn to just goThereBtn'
    },
    {
      file: 'newspaper_march_compatible.swf',
      comment: 'Dec2010ClientNewspaper.swf but replaced com.clubpenguin.lib.module calls to match 2011 club_penguin.swf in order to be compatible. Made by Randomno'
    },
    {
      file: 'dividers_blank.swf',
      comment: 'Dividers (specifically 268 front) but removed every shape so it looks blank.'
    },
    {
      file: 'shell_2011_interface_fix.swf',
      comment: 'shell.swf from vanilla media, but for the 2011 August interface to work, code was added to setScavengerHuntCrumbs. Changed the background to be white to match the website'
    },
    {
      file: 'engine_modern_no_glow.swf',
      comment: 'engine.swf from vanilla media, but with name glow removed'
    },
    {
      file: 'temple_of_fruit/party1.swf',
      comment: 'Credit to Jeff the Rock and cutestlesbian. Temple of Fruit top working with the modded engine.swf'
    },
    {
      file: 'ghosts/engine.swf',
      comment: 'Credit to cutestlesbian and Jeff the Rock. Moddified modern engine with ghost transformations. From their base engine, the function `turnPlayerIntoGhost` is recreated, it enables the transformation and turns on the ghost scavenger hunt icon, and finally it switches the room to ghost mode (to remove the goggle effect). Aditionally, for the INTERFACE to work, the function isPlayerTransformedIntoGhost is added. For the ghost penguin to not get teleported in the middle of the animation, AvatarTransformationManager was modded a bit, in specific the function onTransformLoadComplete. Removed name glow'
    },
    {
      file: 'shell_2012_halloween.swf',
      comment: 'Vanilla shell.swf, but with setAvatarTransformation function (added for compatibility with Halloween 2012 interface). Aditionally, changed attach puffle function in order to equip it to the hand, and to unwalk puffle when updating hand. Must still figure how to make it remove the puffle from the igloo (prevent double walking). Added code to the sendBuyCookie function for the Holiday Party 2012. Modified the getPlayerObjectById code to have the property is_transformed (Holiday Party 2012 interface compatibility). Added the package com.clubpenguin.engine.avatar.AvatarExpirationTimer from the Holiday Party 2012 icon. Added the function setHolidayAvatarTransformation that enables the icon when a transformation happens, and added turnIntoPlayer which is called when the transformation expires. Changed the background to be white to match the website. For the holiday 2012 bakery, changed the functions sendRequestForBakeryState, handleBakeryStateUpdate, sendSnowBallEnterHopper, sendRequestForCookieInventory and handleGetCookieStock'
    },
    {
      file: 'puffles/engine.swf',
      comment: 'Originally approximation:engine_modern_no_glow.swf, but with avatar transformation for puffles added. Also added turnPlayerIntoPuffle and isPlayerTransformedIntoPuffle (for original INTERFACE support). Modified sendJoinRoom to transform when entering party 4 (spa). Modified updatePlayer to transform into penguin if need to, because INTERFACE simply unequips the hand item when you click to revert'
    },
    {
      file: 'holiday_2012/engine.swf',
      comment: 'Originally engine_modern_no_glow. Added Reindeer, Toycar and Frostbite transformations. Added turnPlayerIntoPenguin function. Modified AvatarManager slightly so that the 2012 holiday party timer can fetch the time and so that the shell can update it. Removed Herbert transformation because it was conflicting with the reindeer puffle'
    },
    {
      file: 'scornbattle/scorn_battle.swf',
      comment: 'Originally ScornBattle.swf from vanilla media, but in order to function with modern client, the code was changed, namely, the com.disney packages were ported from bits and bolts, and the EndGameVO class was also copied from there (raw AS3 edit in FFDEC was used, but it seems to work fine)'
    },
    {
      file: 'scornbattle/config.xml',
      comment: 'Because modern bits and bolts code was used in the scorn battle swf, this config xml is needed and it was adapted from bits and bolts to work with these swfs (credit to Jeff the Rock, this is from CPImagined)'
    },
    {
      file: 'scornbattle/scorn.xml',
      comment: 'Same reasoning as scornbattle/config.xml, this file is just a dummy file for the code to work'
    },
    {
      file: 'scornbattle/en.xml',
      comment: 'Same reasoning as scornbattle/config.xml, this file is the locale file written into xml'
    },
    {
      file: 'club_penguin_2011.swf',
      comment: 'The vanilla media club_penguin.swf, but with the background changed to white to match the website'
    }
  ],
  [RECREATION]: [
    {
      file: '2009_storm/beach.swf',
      comment: '2009 Great Storm room recreations all done by Blue Kirby'
    },
    {
      file: '2009_storm/berg.swf',
      comment: 'By Blue Kirby'
    },
    {
      file: '2009_storm/dock.swf',
      comment: 'By Blue Kirby'
    },
    {
      file: '2009_storm/dojo.swf',
      comment: 'By Blue Kirby'
    },
    {
      file: '2009_storm/forts.swf',
      comment: 'By Blue Kirby'
    },
    {
      file: '2009_storm/plaza.swf',
      comment: 'By Blue Kirby'
    },
    {
      file: '2009_storm/town.swf',
      comment: 'By Blue Kirby'
    },
    {
      file: 'agentcom_nofieldops1.swf',
      comment: 'By VamprLover, recreation of the EPF Command Room post construction, only VR room in construction, no field OPS'
    },
    {
      file: 'agentcom_nofieldops2.swf',
      comment: 'By VamprLover, recreation of the EPF Command Room post construction, no field OPS'
    },
    {
      file: 'mjam_10_berg_no_pb.swf',
      comment: 'By VamprLover, recreation of the 2010 Music Jam Iceberg with the Penguin Band on break'
    },
    {
      file: 'agent_2008_apr_pre_cpip.swf',
      comment: 'By VamprLover, recreation of the April 21 2008 HQ in Pre-CPIP'
    },
    {
      file: 'agent_2008_apr_cpip.swf',
      comment: 'By VamprLover, recreation of the April 21 2008 HQ in Post-CPIP'
    },
    {
      file: 'cave_opening/boiler.swf',
      comment: 'By VamprLover. Cave Opening Party room'
    },
    {
      file: 'cave_opening/plaza.swf',
      comment: 'By VamprLover. Cave Opening Party room'
    },
    {
      file: 'cave_opening/cave.swf',
      comment: 'By VamprLover. Cave Opening Party room'
    },
    {
      file: 'dance_cpip_premusicjam.swf',
      comment: 'By Blue Kirby. Dance Club before Music Jam 2008 in Post-CPIP'
    },
    {
      file: 'cpip_cove_precatalog.swf',
      comment: 'By Blue Kirby. Cove before Game Upgrades'
    },
    {
      file: 'dock_cpip_precatalog.swf',
      comment: 'By Blue Kirby. Dock before Game Upgrades'
    },
    {
      file: 'dojo_cpip_start.swf',
      comment: 'By Blue Kirby. Empty dojo room in Post-CPIP'
    },
    {
      file: 'light_cpip_start.swf',
      comment: 'By Blue Kirby. Lighthouse without music catalog and band, Post-CPip'
    },
    {
      file: 'lodge_cpip_start.swf',
      comment: 'By Blue Kirby. Ski Lodge before Game Upgrades'
    },
    {
      file: 'mtn_cpip_start.swf',
      comment: 'By Blue Kirby. Mountain before Game Upgrades'
    },
    {
      file: 'pet_pre_white.swf',
      comment: 'By Blue Kirby. Pet Shop just before White Puffles are added'
    },
    {
      file: 'halloween_hunt_2010.swf',
      comment: `Scavenger hunt 2010 recreation based on the Water Hunt SWF
Made by Supermanover (exported candy assets), and nhaar (added hint text)`
    },
    {
      file: 'iceberg_mjamconst_no_fireworks.swf',
      comment: 'By Blue Kirby, removed fireworks from the Music Jam 2010 construction Iceberg'
    },
    {
      file: 'library_2009.swf',
      comment: 'Made by nhaar. Library without the 2010 yearbook'
    },
    {
      file: 'map_release.swf',
      comment: 'Made by Zeldaboy. Removed the Snow Forts button from the map'
    },
    {
      file: 'mountain_expedition_poster.swf',
      comment: `Made by Victando. Mountain Expedition poster, made using the Halloween 2010 poster as a base
Unknown if its teleporting to village functions would be accurate`
    },
    {
      file: 'paddle_no_brown.swf',
      comment: 'Made by nhaar. Removed Brown and Orange puffles from the 2011 Puffle Paddle to simulate the Fair 2010\'s minigame'
    },
    {
      file: 'postcard_orange_puffle.swf',
      comment: 'Made by Blue Kirby. Removed orange puffle from the adoption postcard'
    },
    {
      file: 'storm_2010_pet.swf',
      comment: 'Storm 2010 room recreation by Blue Kirby'
    },
    {
      file: 'storm_2010_pizza.swf',
      comment: 'Storm 2010 room recreation by Blue Kirby'
    },
    {
      file: 'underwater_adventure_no_pin.swf',
      comment: 'Made by Victando, Underwater Adventure play without its pin from its 2011 feature'
    },
    {
      file: 'water_hunt_planet_y.swf',
      comment: 'Made by Blue Kirby, Water Hunt stage with Planet Y, including glitched T as seen from videos'
    },
    {
      file: 'winter_luau/dance.swf',
      comment: 'Winter Luau room recreation by Supermanover'
    },
    {
      file: 'winter_luau/dock.swf',
      comment: 'Winter Luau room recreation by Supermanover, with additional fixes from Randomno'
    },
    {
      file: 'winter_luau/town.swf',
      comment: 'Winter Luau room recreation by Supermanover'
    },
    {
      file: 'winter_luau/forts.swf',
      comment: 'Winter Luau room recreation by Supermanover'
    },
    {
      file: 'puffle_roundup_orange.swf',
      comment: 'Made by nhaar. Recreation of the Puffle Roundup post Orange puffle release, using the Brown puffle one and replacing Brown puffle with its respective Puffle as seen from the white puffle SWF'
    },
    {
      file: 'agent_2008_nov.swf',
      comment: 'Made by VamprLover. A version of the Post-CPIP HQ without the closet and with the soccer pitch.'
    },
    {
      file: 'plaza_squidzoid_sign.swf',
      comment: 'Made by Blue Kirby. This is RoomsPlaza-Play3.swf from the archives, but for some reason the original is broken, so it was fixed to not have the weird shading. It is unknown why this archive file is like this, but as such it has been tagged as a recreation as it\'s likely a misarchive, and this has been further fixed by Blue Kirby'
    },
    {
      file: 'dance_cpip_postmusicjam2.swf',
      comment: 'Made by VamprLovr'
    },
    {
      file: 'dance_cpip_postmusicjam1.swf',
      comment: 'Made by Jeoy based on VamprLover\'s file'
    },
    {
      file: 'dance_record_pin_mjam.swf',
      comment: 'Made by Blue Kirby, adds the record pin to the Dance Club of the Music Jam 2008'
    },
    {
      file: 'dance_record_pin.swf',
      comment: 'Made by Blue Kirby based on VampLovr and Jeoy\'s files, adds the record pin to the Dance Club with dark lighting'
    },
    {
      file: 'pre_epf_moderator_form.swf',
      comment: 'Made by lifeofgames477. A recreation of the moderator form before the EPF. This file was embedded in the pre-CPIP interface but was lost for post-CPIP, thus it was recreated.'
    },
    {
      file: 'ruby_play_debut.swf',
      comment: 'Made by Blue Kirby, the original version of the play.'
    },
    {
      file: 'plaza_ruby_construction.swf',
      comment: 'Made by Blue Kirby, the Plaza construction for the Ruby and the Ruby play debut'
    },
    {
      file: 'plaza_ruby_no_weather.swf',
      comment: 'Made by Blue Kirby, Plaza for Ruby and the Ruby before weather manipulation'
    },
    {
      file: 'light_lollipop_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'sport_microscope_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'lounge_cake_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'forest_blue_snow_shovel_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'beach_snowflake_tile_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'pet_fort_snow_fort_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'lodge_present_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'plaza_golden_puffle_no_weather.swf',
      comment: 'Made by Blue Kirby. Plaza with the Golden Puffle without weather manipulation'
    },
    {
      file: 'fair_2008_plaza_decorated.swf',
      comment: 'Made by Blue Kirby. Decorated plaza which was added in an update to the party'
    },
    {
      file: 'water_party_07_dance.swf',
      comment: 'Made by victando. Dance Club for the Water Party 2007'
    },
    {
      file: 'fair_08_ticket_info.swf',
      comment: 'Made by lifeofgames477. A recreation of the tickets information screen for the Fair 2008'
    },
    {
      file: 'plaza_team_blue_play.swf',
      comment: 'Made by Blue Kirby. Plaza with the stage having the Team Blue vs Team Red play'
    },
    {
      file: 'penguin_play_awards_09_plaza_const.swf',
      comment: 'Made by Blue Kirby. Plaza for the Penguin Play Awards 2009 construction'
    },
    {
      file: 'medieval_09_const_cave.swf',
      comment: 'Made by Blue Kirby. Cave for the Medieval Party 2009 construction'
    },
    {
      file: 'plaza_haunting_of_the_viking_opera.swf',
      comment: 'Made by Blue Kirby. Plaza for the Haunting of the Viking Opera play before weather manipulation'
    },
    {
      file: 'plaza_ruby_no_weather_09_july.swf',
      comment: 'Made by Blue Kirby. Plaza for the Ruby and the Ruby play before weather manipulation, but specifically for July 2009, which has a different billboard'
    },
    {
      file: 'plaza_underwater_adventure.swf',
      comment: 'Made by Blue kirby. Plaza for the Underwater Adventure play'
    },
    {
      file: 'fair_09_penguins_time_forgot.swf',
      comment: 'Made by Blue Kirby. Plaza for the Penguins that Time Forgot play during the Fair 2009'
    },
    {
      file: 'holiday_09_plaza_quest_golden_puffle.swf',
      comment: 'Made by Blue Kirby. Plaza for the Quest for the Golden Puffle play during the Holiday Party 2009'
    },
    {
      file: 'beacon_lily_pin.swf',
      comment: 'Made by Blue Kirby using jeoy\'s base recreation of the room, adds the Lily pin'
    },
    {
      file: 'mine_puffle_o_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'camp_penguin/town.swf',
      comment: 'made by Doubleuman'
    },
    {
      file: 'camp_penguin/cove.swf',
      comment: 'made by Doubleuman'
    },
    {
      file: 'camp_penguin/dock.swf',
      comment: 'made by Doubleuman'
    },
    {
      file: 'summer_kickoff_2007/beach.swf',
      comment: 'made by Cyan'
    },
    {
      file: 'summer_kickoff_2007/beach_update.swf',
      comment: 'made by Cyan (added Flower Headdress)'
    },
    {
      file: 'summer_kickoff_2007/town.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'summer_kickoff_2007/mtn.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'summer_kickoff_2007/dojo.swf',
      comment: 'made by Victando'
    },
    {
      file: 'summer_kickoff_2007/beacon.swf',
      comment: 'made by Doubleuman'
    },
    {
      file: 'cove_opening/plaza.swf',
      comment: 'made by Doubleuman'
    },
    {
      file: 'cove_opening/forest.swf',
      comment: 'made by Doubleuman'
    },
    {
      file: 'cove_opening/cove.swf',
      comment: 'made by Doubleuman'
    },
    {
      file: 'cove_after_cove_opening_pre_cpip.swf',
      comment: 'made by Victando'
    },
    {
      file: 'color_party_2006/dojo.swf',
      comment: 'made by Doubleuman'
    },
    {
      file: '1st_anniversary_coffee.swf',
      comment: 'Made by Doubleuman, with fixes by Randomno'
    },
    {
      file: 'halloween_2006/pizza.swf',
      comment: 'made by Cyan'
    },
    {
      file: 'halloween_2006/attic.swf',
      comment: 'made by Randomno'
    },
    {
      file: 'halloween_2006/rink.swf',
      comment: 'made by Lifeofgames477'
    },
    {
      file: 'halloween_2006/mtn.swf',
      comment: 'made by Lifeofgames477'
    },
    {
      file: 'berg_oberry_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'snow_sculpture_mtn_no_pin.swf',
      comment: 'Made by Blue Kirby, the archived room with the pin removed'
    },
    {
      file: 'attic_top_hat_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'dojoext_tree_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'pizza_ice_cream_sundae_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'book_safari_hat_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'boiler_kings_crown_pin.swf',
      comment: 'Made by Blue Kirby, the post-party variant of the room with the pin'
    },
    {
      file: 'light_watermelon_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'cave_dojo_lantern_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'coffee_toy_sailboat_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'mine_sand_castle_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'cove_koi_fish_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'fair_09_cove_no_pin.swf',
      comment: 'Made by Blue Kirby, the archived room with the pin removed'
    },
    {
      file: 'pizza_101_days_of_fun_pin_fair.swf',
      comment: 'Made by Blue Kirby, the Fair 2009 variant of the room with the pin'
    },
    {
      file: 'fire_hunt_pizza_no_pin.swf',
      comment: 'Made by Blue Kirby, the archived room with the pin removed'
    },
    {
      file: 'book_padlock_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'april_fools_2007/berg.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'april_fools_2007/shack.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/shack.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/flamini1.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/seemi.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/berg.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/eragon12101.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/clubpenny202.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/liilmiig.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/forts.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/zujkuteee.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/innin.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/mtn.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/air2515.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/dance.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/beach_1.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/quitex.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/tayler727.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/beach_2.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/beach_3.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/plaza.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/angelspark.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/barney1000.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/dock.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/pirategirl66.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/kombivw557.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/mickmitzinic.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/village.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/covanant.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/converseray.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/light.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/jazzybadger.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/toastygirl.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/klop6.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'attic_football_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'attic_snowman_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'light_fireworks_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'berg_puffer_fish_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'pet_speaker_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'beacon_feather_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'lodge_wagon_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'sport_cupcake_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'cove_shield_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'book_cream_soda_barrel_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'stage_ruby_2010_june.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'forts_taco_pin.swf',
      comment: 'Made by Randomno by removing the decorations from the archived party room'
    },
    {
      file: 'cove_bat_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'berg_seashell_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'lost_map_hunt/mtn.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lost_map_hunt/village.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lost_map_hunt/dock.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lost_map_hunt/town.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lost_map_hunt/forts.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lost_map_hunt/handler.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lost_map_hunt/chat506_edit.swf',
      comment: 'Made by Doubleuman, edit for chat506 that makes the hunt work. Later, added the code for PORTs and IPs'
    },
    {
      file: 'cove_cpip_firework_rocket_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'cave_treble_clef_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'cave_mjam08_no_pin.swf',
      comment: 'Made by Blue Kirby, the archived room with the pin removed'
    },
    {
      file: 'halloween_2007/dance_notice.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lighthouse_party_2006/light.swf',
      comment: 'Made by Randomno'
    },
    {
      file: 'plaza_tour_const.swf',
      comment: 'Made by Doubleuman, just a compiled version of an fla with some fixes'
    },
    {
      file: 'plaza_may07.swf',
      comment: 'Made by Randomno'
    },
    {
      file: 'shack_apr10.swf',
      comment: 'Made by lifeofgames477'
    },
    {
      file: 'attic_dec2006.swf',
      comment: 'Made by Randomno, vectorized attic before rocking horse animation, it is an edit of attic42 with rocking horse from attic12 and Find Four tables moved to match a screenshot'
    },
    {
      file: 'map_vector_original.swf',
      comment: 'Made by Randomno, repositioned rooms from map15 and deleted parts of the Forest graphic'
    },
    {
      file: 'attic_dec08.swf',
      comment: 'Made by Randomno, removed the Taco Pin from the archived room'
    },
    {
      file: 'halloween_2008/igloo_background.swf',
      comment: 'Made by Blue Kirby, removed the stormy clouds from the 2010 version, placeholder until a more proper 2008 version is made'
    },
    {
      file: 'water_party_2007/town.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'water_party_2007/mtn.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'water_party_2007/forest.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'mjam_08_const/dance.swf',
      comment: 'Made by Cyan'
    },
    {
      file: 'pirate_party/coffee.swf',
      comment: 'Made by Cyan'
    },
    {
      file: 'pet_nov07.swf',
      comment: 'Made by lifeofgames477'
    },
    {
      file: 'igloo_music/cpip_start.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'pirate_catalog/08_12.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'pirate_catalog/09_05.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'pirate_catalog/09_09.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'pirate_catalog/10_06.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'pizza_2007.swf',
      comment: 'Made by lifeofgames477'
    },
    {
      file: 'pizza_2008.swf',
      comment: 'Made by lifeofgames477'
    },
    {
      file: 'berg_ice_block_pin.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/berg_pin.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/dojo.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/vinje99.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/y4ssengrego.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'festival_of_snow/rockandpen.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'boiler_100_newspapers.swf',
      comment: 'Made by lifeofgames477'
    },
    {
      file: 'festival_of_snow/town.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'interfaces/2008_july.swf',
      comment: 'Made by Blue Kirby. Theoretical first Post-CPIP interface, built on top of the recreation from January 2009 but without the membership badge'
    },
    {
      file: 'interfaces/membership_badge_3.swf',
      comment: 'Made by Blue Kirby. Built on top of the October 2009 interface but removing the owned igloos functionality'
    },
    {
      file: 'interfaces/2010_may.swf',
      comment: 'Made by Supermanover and Blue Kirby. Initially, Super removed the stamps from the legacy media modified interface that was in WF. Blue Kirby removed the owned igloo functionality'
    },
    {
      file: 'interfaces/2010_july.swf',
      comment: 'Made by Blue Kirby. Built on top of the modified lgeacy media interface, removing the owned igloos functionality'
    },
    {
      file: 'client_igloo_cpip.swf',
      comment: 'Made by Blue Kirby, edit which removes the owned igloos button'
    },
    {
      file: 'startscreen/cpip.swf',
      comment: 'Made by lifeofgames477, recreation of the original CPIP start screen'
    },
    {
      file: 'startscreen/cpip_logo.swf',
      comment: 'Made by lifeofgames477, this file is an extension of the CPIP startscreen recreation. The logo was placed in a separate SWF because the recreation was built on top of the startscreen that we had, though it is purely a functional dependency'
    },
    {
      file: 'startscreen/unlock_items.swf',
      comment: 'Made by Blue Kirby, built on top of lifeofgames\' recreation adding the unlock items functionality'
    },
    {
      file: 'startscreen/unlock_items_logo.swf',
      comment: 'Made by Blue Kirby, the logo was slightly altered, cf. lifeofgame\'s recreation for why this file exists'
    },
    {
      file: 'login_cpip.swf',
      comment: 'Made by Blue Kirby, server select screen without the unlock items button and with the proper save password warning'
    },
    {
      file: 'library/cpip.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'library/yearbook_08.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'library/lime_green.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'library/tales_vol_3.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'forms_missions/cpip.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'forms_missions/m9.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'beacon_nolight.swf',
      comment: 'Made by joey, remove the ability to turn off the beacon light'
    },
    {
      file: 'boiler_150_newspaper.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'dock_magnifying_glass_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'mtn_toboggan_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'stage_dodgeball_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'alehouse.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'alehouse_quiet.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'plaza_team_blues_rally_2.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'light_life_ring_pin.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lighthouse_party_2006/beach.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'catalog/clothing_cpip.swf',
      comment: 'Made by Blue Kirby. Ported the catalog to CPIP'
    },
    {
      file: 'catalog/furniture_cpip.swf',
      comment: 'Made by Blue Kirby. Ported the catalog to CPIP'
    },
    {
      file: 'april_fools_2007/mine.swf',
      comment: 'Made by Lifeofgames477'
    },
    {
      file: 'lighthouse_party_2006/beacon.swf',
      comment: 'Made by Doubleuman, comes from a previously compiled SWF of a FLA that was likely an earlier version, and it contained a depth error, which was fixed in this \"recreation\"'
    },
    {
      file: 'halloween_2006/shack.swf',
      comment: 'Made by Lifeofgames477'
    },
    {
      file: 'water_party_2007/dojo.swf',
      comment: 'Made by Doubleuman, added puddle, water balloons, changed block, based on a previously compiled SWF of a FLA that wasn\'t accurate'
    },
    {
      file: 'halloween_2006/village.swf',
      comment: 'Made by Lifeofgames477'
    },
    {
      file: 'great_snow_race/party_note04.swf',
      comment: 'Made by Blue Kirby, originally based on local/en/close_ups/party_op_medals_earned.swf (from vanilla media), added a function in the close button that interacts with the room code from party10 (Great Snow Race) to progress the Operation Hibernation scene. Also removed the medals animations that was present. Then Blue Kirby fixed the text'
    },
    {
      file: 'great_snow_race/party_note03.swf',
      comment: 'Made by Blue Kirby, used party_note04 as a base and changed the text'
    },
    {
      file: 'great_snow_race/party_note05.swf',
      comment: 'Made by Blue Kirby, used party_note04 as a base and changed the text'
    },
    {
      file: 'great_snow_race/party_note02.swf',
      comment: 'Made by Blue Kirby, used party_note04 as a base and changed the text'
    },
    {
      file: 'april_fools_2007/beach.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'catalog/adopt_cpip.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'catalog/costume_cpip.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'catalog/hair_cpip.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'shop_cpip.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'catalog/sport_cpip.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'catalog/igloo_cpip.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'beacon41.swf',
      comment: 'Made by Doubleuman, added the missing pin code to the archived SWF (which was from an unfinished FLA)'
    },
    {
      file: 'village_precpip_tour.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'winter_fiesta_2008/dance.swf',
      comment: 'Made by slicedpizza39, took unfinished file Dance43.swf and added functionality'
    },
    {
      file: 'winter_fiesta_2008/dock.swf',
      comment: 'Made by slicedpizza39, took unfinished file Dock43.swf and added functionality'
    },
    {
      file: 'winter_fiesta_2008/plaza.swf',
      comment: 'Made by slicedpizza39, took unfinished file Plaza47.swf and added functionality'
    },
    {
      file: 'news_beta.swf',
      comment: 'Made by c6'
    },
    {
      file: 'halloween_2006/plaza.swf',
      comment: 'Made by VampLovr54'
    },
    {
      file: 'halloween_2006/lodge.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'halloween_2006/dance.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'igloo_beta.swf',
      comment: 'Made by Doubleuman, originally took the igloo1 fla, added the missing code and then compiled. Then took the igloo from an archived version of the Penguin Chat igloo (link: https://web.archive.org/web/20120426013749/http://www.swfcabin.com/swf-files/1233278154.swf), which also needed removing the stage and put it into the SWF. Finally, some fixes needed to be done which made this compatible with chat291, as igloo1 is from the ElectroServer client.'
    },
    {
      file: 'april_fools_2007/pizza.swf',
      comment: 'Made by slicedpizza, with a fix from Doubleuman'
    },
    {
      file: 'april_fools_2007/coffee.swf',
      comment: 'Made by slicedpizza'
    },
    {
      file: 'plaza_tweltfh_fish.swf',
      comment: 'Made by ItzAle'
    },
    {
      file: 'plaza_notls.swf',
      comment: 'Made by ItzAle'
    },
    {
      file: 'holiday_beach_poster.swf',
      comment: 'Made by Boo0'
    },
    {
      file: 'mjam_11_const/village.swf',
      comment: 'Made by Jeff the Rock'
    },
    {
      file: 'water_party_2007/beach.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'water_party_2007/cove.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'dance_no_game_upgrades.swf',
      comment: 'Made by ItzAle, Dance Club without game upgrades'
    },
    {
      file: 'cove_hut_const.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'shop43.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'forts_broken_sign.swf',
      comment: 'Made by VampLovr'
    },
    {
      file: 'water_party_2007/dock.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'st_patrick_2007/coffee.swf',
      comment: 'Made by Slicedpizza'
    },
    {
      file: 'water_hunt_beach_no_pin.swf',
      comment: 'Made by ItzAle, removed the pin from the room'
    },
    {
      file: 'halloween_2006/forts.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'furniture_sep05.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'telescope/far_halloween.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'telescope/bottle.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'igloo_catalog_dec06_v1.swf',
      comment: 'Made by Doubleuman, un-guided the hatch layers from fla'
    },
    {
      file: 'fireworks_2006/berg.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'fireworks_2006/berg_collision.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'town_newyear.swf',
      comment: 'Made by Doubleuman, took the chat291 fix version and then fixed the laytering issue'
    },
    {
      file: 'forms_missions/m3.swf',
      comment: 'Made by Cyan, removed m4 from the m4 form'
    },
    {
      file: 'mtn_fireworks.swf',
      comment: 'Made by Blue Kirby, removed game upgrades'
    },
    {
      file: 'clocktower.swf',
      comment: 'Made by Doubleuman, the pre-cpip clock tower'
    },
    {
      file: 'membership_inventory.swf',
      comment: 'Made by lifeofgames477, the first post-cpip membership lock for the inventory'
    },
    {
      file: 'agent1.swf',
      comment: 'Made by Randomno'
    },
    {
      file: 'chat339_instrument_hunt.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'temple_of_fruit/engine.swf',
      comment: 'Credit to Jeff the Rock and cutestlesbian. Engine with the Temple of Fruit transformations. Removed the name glow'
    },
    {
      file: 'fair_2009/mine.swf',
      comment: 'Made by Lifeofgames477'
    },
    {
      file: 'fire_hunt/mine.swf',
      comment: 'Of unknown origins, from some archive, a swf was fixed to be accurate by lifeofgames477 and VampLovr'
    },
    {
      file: 'fire_hunt/light.swf',
      comment: 'Made by lifeofgames477'
    },
    {
      file: 'fire_hunt/dojoext.swf',
      comment: 'Made by lifeofgames477'
    },
    {
      file: 'fire_hunt/book.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'st_patrick_2007/town.swf',
      comment: 'Made by lifeofgames477, with additional fixes by Randomno'
    },
    {
      file: 'pre_christmas_08/plaza.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'pre_christmas_08/beach.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'plaza_lighthouse_pin.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'chat339_with_added_items.swf',
      comment: 'Made by Doubleuman. This technically has the lightbulb hunt, but it\'s turned off. Primarily it adds all missing items from the period chat339 was active in waddle forever'
    },
    {
      file: 'lightbulb/chat339.swf',
      comment: 'Same as the other chat 339 with added items but with the icon of the hunt available'
    },
    {
      file: 'lightbulb/attic.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lightbulb/boiler.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lightbulb/dance.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lightbulb/mine.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'lightbulb/plaza.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'old_postcards/32.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'old_postcards/33.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'old_postcards/38.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'coffee_vector.swf',
      comment: 'Made by lifeofgames477'
    },
    {
      file: 'fire_hunt/book_pin.swf',
      comment: 'Made by Blue Kirby, based on Doubleuman\'s recreation'
    },
    {
      file: 'interfaces/membership_badge.swf',
      comment: 'Made by Blue Kirby, interface where the membership badge is only seen by the player itself'
    },
    {
      file: 'interfaces/membership_badge_2.swf',
      comment: 'Made by Blue Kirby, interface where the membership badge is seen by all, but with only the basic level available'
    },
    {
      file: 'dojoext.swf',
      comment: 'Made by Blue Kirby, the Dojo Courtyard when it originally came out, made from the archived SWF of puffle sighting with the puffle removed'
    },
    {
      file: 'dojo_2008.swf',
      comment: 'Made by jeoy, the original Dojo swf'
    },
    {
      file: 'dojohide_2008.swf',
      comment: 'Made by jeoy, the original Ninja Hideout swf'
    },
    {
      file: 'dojohide_2009.swf',
      comment: 'Made by Blue Kirby, used an archive file as a base and took emporium assets from the christmas party 2008'
    },
    {
      file: 'dojoext_2009.swf',
      comment: 'Made by Blue Kirby, Dojo Courtyard with ninja progress'
    },
    {
      file: 'black_puffle_sight/village.swf',
      comment: 'Made by Blue Kirby, phase one of sightings'
    },
    {
      file: 'black_puffle_sight/forest.swf',
      comment: 'Made by Blue Kirby, phase one of sightings'
    },
    {
      file: 'black_puffle_sight/dojoext.swf',
      comment: 'Made by Blue Kirby, phase one of sightings'
    },
    {
      file: 'black_puffle_sight/dojohide.swf',
      comment: 'Made by Blue Kirby, phase one of sightings'
    },
    {
      file: 'black_puffle_sight/dojoext_3.swf',
      comment: 'Made by Blue Kirby, phase three of sightings'
    },
    {
      file: 'black_puffle_sight/dojohide_3.swf',
      comment: 'Made by Blue Kirby, phase three of sightings. Features a depth error in-game: the Black Puffle on the left is supposed to be on top of the Stone object, but will instead appear behind it, to compensate, the Black Puffle was placed a little higher than it is supposed to (should be fixed at some point)'
    },
    {
      file: 'black_puffle_sight/forest_3.swf',
      comment: 'Made by Blue Kirby, phase three of sightings'
    },
    {
      file: 'black_puffle_sight/village_3.swf',
      comment: 'Made by Blue Kirby, phase three of sightings'
    },
    {
      file: 'black_puffle_sight/dojoext_3_volcano.swf',
      comment: 'Made by Blue Kirby, phase three of sightings with active volcano'
    },
    {
      file: 'christmas_06/beacon.swf',
      comment: 'Made by lifeofgames477'
    },
    {
      file: 'christmas_06/coffee.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'christmas_06/dance.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'christmas_06/dock.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'christmas_06/forts.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'christmas_06/lodge.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'christmas_06/town.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'style_september_05.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'mtn_lucky_coin_pin.swf',
      comment: 'Made by Blue Kirby'
    },
    {
      file: 'old_interface/old_toolbar.swf',
      comment: 'Made by Doubleuman, interface71 changed to have the old toolbar, and further modified by lifeofgames477 to add the old logo'
    },
    {
      file: 'old_interface/new_toolbar.swf',
      comment: 'Made by Doubleuman, interface71 with emotes from when laughing emote was updated, and further modified by lifeofgames477 to add the old logo'
    },
    {
      file: 'old_interface/skull_heart_removed.swf',
      comment: 'Made by Doubleuman, interface71 with emotes from when the skull and heart emotes were removed'
    },
    {
      file: 'old_interface/skull_heart_removed_old_logo.swf',
      comment: 'Originally the skull_heart_removed recreation, but with the old log added by lifeofgames477'
    },
    {
      file: 'old_interface/new_emotes_no_heart.swf',
      comment: 'Made by Doubleuman, interface71 with the emotes from when new emotes were added but before the heart emote was re-added'
    },
    {
      file: 'st_patrick_membership.swf',
      comment: 'Made by lifeofgames477'
    },
    {
      file: 'costume_jul_12.swf',
      comment: 'Made by ItzAle'
    },
    {
      file: 'plaza_squidzoid_2012.swf',
      comment: 'Made by ItzAle, Plaza with weather manipulation and the Squidzoid play'
    },
    {
      file: 'berg_island_adventure_no_pin.swf',
      comment: 'Made by ItzAle, removed the Gold Anchor pin from the Island Adventure 2011 Iceberg'
    },
    {
      file: 'mtn_party_favors_pin.swf',
      comment: 'Made by ItzAle, removed fireworks from the archived file'
    },
    {
      file: 'pirate_party/ship.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'pirate_party/shiphold.swf',
      comment: 'Made by Doubleuman, the Ship Hold at the start of the party'
    },
    {
      file: 'pirate_party/shiphold2.swf',
      comment: 'Made by Doubleuman, the Ship Hold after the note was added'
    },
    {
      file: 'shiphold.swf',
      comment: 'Made by Doubleuman, pre-cpip ship hold after Pirate Party ends'
    },
    {
      file: 'rockhopper_note/pirate_party.swf',
      comment: 'Made by Doubleuman, the original Rockhopper note 2'
    },
    {
      file: 'winter_fiesta_2007/forts.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'winter_fiesta_2007/coffee.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'water_party_2007/forts.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'christmas_07/berg.swf',
      comment: 'Made by lifeofgames477, removed the fireworks'
    },
    {
      file: 'christmas_07/mtn.swf',
      comment: 'Made by lifeofgames477, removed the fireworks'
    },
    {
      file: 'journal1.swf',
      comment: 'Made by Randomno, took ArtworkBooksJournal1.swf and added a close button'
    },
    {
      file: 'summer_kickoff_2007/dock.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'summer_kickoff_2007/cave.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'summer_kickoff_2007/dance.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'summer_kickoff_2007/dance_update.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'summer_kickoff_2007/village.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'summer_kickoff_2007/berg.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'summer_kickoff_2007/forest.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'summer_kickoff_2007/plaza.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'paddle_no_white.swf',
      comment: 'Made by lifeofgames477. Removed Brown, Orange and White puffles from the 2011 Puffle Paddle to simulate the Fair 2008\'s minigame'
    },
    {
      file: 'summer_kickoff_2007/coffee.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'christmas_06/beach.swf',
      comment: 'Originally made by Fabi (uploaded by Boo), fixed by lifeofgames477 for pre-CPIP'
    },
    {
      file: 'summer_kickoff_2007/book.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'stage_viking_no_pin.swf',
      comment: 'Made by Blue Kirby, removed the pin from the archived file'
    },
    {
      file: 'rink_vector_precpip.swf',
      comment: 'Made by ChrisCPI, vectorized ice rink before blue sky'
    },
    {
      file: 'halloween_2006/coffee.swf',
      comment: 'Made by VampLovr54'
    },
    {
      file: 'halloween_2006/town.swf',
      comment: 'Made by lifeofgames477'
    },
    {
      file: 'coffee_precpip_clickable_sign.swf',
      comment: 'Made by ItzAle'
    },
    {
      file: 'forest_2008_sky.swf',
      comment: 'Made by ItzAle'
    },
    {
      file: 'medieval_2010/poster.swf',
      comment: 'Made by Bemy'
    },
    {
      file: 'dojo_november_2008.swf',
      comment: 'Made by ItzAle, removed the instructions from Jeoy\'s recreation'
    },
    {
      file: 'rink_2008_sky.swf',
      comment: 'Made by lifeofgames477. Used the vectorized recreation from ChrisCPI and changed the sky'
    },
    {
      file: 'summer_kickoff_2007/cove.swf',
      comment: 'Made by Doubleuman'
    },
    {
      file: 'summer_kickoff_2007/cove_update.swf',
      comment: 'Made by Doubleuman'
    }
  ],
  [MOD]: [
    {
      file: 'dance_contest_swapped.swf',
      comment: 'Mod by Supermanover. The Dance Contest up and down arrow keys are swapped'
    },
    {
      file: 'jpa_level_selector.swf',
      comment: 'Mod by Randomno. Used CPSC\s JPA most likely'
    },
    {
      file: 'thinice_igt30.swf',
      comment: 'Mod for Thin Ice that adds IGT. Originally by sharlot, ported by nhaar'
    },
    {
      file: 'thinice_igt24.swf',
      comment: 'Copy of the IGT mod but for 24 fps'
    }
  ],
  [TOOL]: [
    {
      file: 'boots.swf',
      comment: `A file that initiates the flash environment for the AS2 Post-CPIP client
Originally from solero legacy-media, modified to work in the flat domain any port model of WF`
    },
    {
      file: 'boots30.swf',
      comment: 'Copy of boots.swf but in 30 FPS'
    },
    {
      file: 'dynamic_igloo_music.swf',
      comment: 'File that loads the igloo music from a XML file. Originally by Ben, refined by Randomno to include bold names and remove pagination'
    },
    {
      file: 'fair_icon_adder.swf',
      comment: 'Modified from Ben\'s scavenger hunt mod'
    },
    {
      file: 'idle_cancel.swf',
      comment: 'A custom dependency that removes the idle disconnect timer. Only loads when the "remove_idle" setting is active.'
    },
    {
      file: 'news_config.xml',
      comment: 'A XML file that is meant to work across all AS3 newspapers, linking all needed elements'
    },
    {
      file: 'scavenger_hunt_2010.swf',
      comment: 'By Ben, SWF that adds the scavenger hunt icon'
    },
    {
      file: 'load.swf',
      comment: 'From mammoth. Used dynamic constant replacement. Overrides the XMLSocket.connect function to always connect to IP:WORLD PORT (because of the hardcoded values in join.swf); Overrides the LoadVars.sendAndLoad function to omit "support.clubpenguin.com" from the url (also for join.swf); Overrides String.split to make it think the URL is play.clubpenguin.com (Can be used to bypass domain checks and reduce the amount of modified SWFs).'
    },
    {
      file: 'load30.swf',
      comment: 'Copy of tool:load.swf, but in 30 FPS, and the code for loading the chat swf slightly altered to accommodate for it'
    }
  ],
  [UNKNOWN]: [
    {
      file: 'chat291.swf',
      comment: 'Originally from Mammoth. Seems like I have then modified the message functionality to add command support, I don\'t know if there are more changes. All mammoth did originally was remove the domain lock (and probably recompiled via FFDEC)'
    },
    {
      file: 'chat506.swf',
      comment: `Originally pulled this from slippers 07, but for some reason the sport shop room was bugged
so I fixed that, now I placed it in unknown because I have no idea why it was broken
I also fixed all the servers to point to the same port and IP adress`
    },
    {
      file: 'cpip_map_no_dojoext.swf',
      comment: `This was found but the origins are not known, allegedly someone edited the old
map to work with CPIP, it's used as a placeholder pre dojo courtyard`
    },
    {
      file: 'engine_2009.swf',
      comment: 'Unknown. Most likely some engine SWF we have archived somewhere'
    },
    {
      file: 'interface_stamps.swf',
      comment: 'Originally from legacy-media, but have not documented all the changes, such as a fix for exiting minigames and being placed in rooms'
    },
    {
      file: 'my_puffle.swf',
      comment: 'From legacy-media, but removed the domain check. Unknown where legacy-media took this from or if it has any changes'
    },
    {
      file: 'my_puffle_2013.swf',
      comment: '2013 version, not much secret I just dont remember if I had to remove a domain check. Its on archives. TODO check'
    },
    {
      file: 'NOTLS3EN.swf',
      comment: 'File given by resol, but from unknown sources, doesn\'t match any in the wiki that i checked'
    },
    {
      file: 'halloween_telescope.swf',
      comment: 'No idea where I got this from, I thought it was from another party\'s archive, but nothing archived matched'
    },
    {
      file: 'op_blackout_cinematic.f4v',
      comment: 'Origin unknown, found in a Solero mod of the party (by MonkeyKiller)'
    },
    {
      file: 'icejam/bootstrap.swf',
      comment: 'Origin unknown, found in a Solero mod of the party (by MonkeyKiller)'
    },
    {
      file: 'icejam/icejam.swf',
      comment: 'Origin unknown, found in a Solero mod of the party (by MonkeyKiller)'
    },
    {
      file: 'icejam/locale.swf',
      comment: 'Origin unknown, found in a Solero mod of the party (by MonkeyKiller)'
    },
    {
      file: 'marvel/engine.swf',
      comment: 'Origin unknown, given by cutestlesbian (based on marvel 2013). Removed name glow'
    },
    {
      file: 'marvel/party.swf',
      comment: 'Origin unknown, given by cutestlesbian (based on marvel 2013)'
    },
    {
      file: 'ghosts/party.swf',
      comment: 'Alledgedly originally the Halloween Party 2014 party.swf, with possible modifications, and in addition to that, modifications done by cutestlesbian for the ghost hunter transform to work. After that, added a fix for the ghost hunter not being applying when logging in. Removed a forced JSON utils export because it was breaking stamps somehow. NOTE: the way party icon is setup is important as well, it might break the ghost scavenger hunt icon otherwise, if this file is to be replaced'
    },
    {
      file: 'medieval2012/party.swf',
      comment: 'From JF archives, unknown modifications'
    },
    {
      file: 'medieval2012/mdlv1.swf',
      comment: 'From JF archives, first login poster for medieval 2012. Unknown why but the login poster from archives doesn\'t work, but this one does'
    },
    {
      file: 'medieval2012/mdlv2.swf',
      comment: 'From JF archives, second login poster for medieval 2012. Unknown why but the login poster from archives doesn\'t work, but this one does'
    }
  ]
};

function cleanPath(path: string): string {
  return path.replaceAll('/', '\\');
}

/** Raises error if a unproperly documented file is found */
function enforceDocumentationCorrectness(): void {
  // files in the media folder, but not in here
  const missingFiles: string[] = [];
  // files in here, but not in the media folder
  const orphans: string[] = [];

  iterateEntries(FILE_DOCUMENTATIONS, (key, value) => {
    // currently assuming they are all in default package, this may change at some point
    const subdirectory = path.join(DEFAULT_DIRECTORY, key);
    const files = new Set(getFilesInDirectory(subdirectory).map(cleanPath));
    const documentedFiles = new Set<string>();

    value.forEach((doc) => {
      // path module uses \ instead of /
      documentedFiles.add(cleanPath(doc.file))
    });
    files.forEach((file) => {
      if (!documentedFiles.has(file) && !file.endsWith('.DS_Store')) {
        missingFiles.push(path.join(key, file));
      }
    })
    documentedFiles.forEach((file) => {
      if (!files.has(file)) {
        orphans.push(file);
      }
    })
  });

  if (missingFiles.length > 0) {
    console.log(missingFiles);
    throw new Error('Found undocumented files');
  }
  if (orphans.length > 0) {
    console.log(orphans);
    throw new Error('Found files with documentation that don\'t exist');
  }
}

/** All possible values for a subdirectory in a file reference */
const SUBDIRECTORES = new Set([
  APPROXIMATION,
  FIX,
  MOD,
  RECREATION,
  TOOL,
  UNKNOWN,
  'archives',
  'slegacy',
  'svanilla',
  'mammoth',
  'slippers07'
]);

if (IS_DEV) {
  // check this in dev to enforce new files are being tracked
  enforceDocumentationCorrectness();
}

/** Check if a file path represents a file reference or just a normal file path */
export function isPathAReference(path: string): boolean {
  // file paths can't have ':', while references use that as a separator
  return path.includes(':');
}

/** Get the path to a file given its reference */
export function getMediaFilePath(fileReference: string): string {
  const fileMatch = fileReference.match(/(\w+)\:(.*)/);
  if (fileMatch === null) {
    throw new Error(`Incorrect file reference: ${fileReference}`);
  }
  const subdirectory = fileMatch[1];
  const filePath = fileMatch[2];

  if (!SUBDIRECTORES.has(subdirectory)) {
    throw new Error(`Invalid file reference subdirectory: ${subdirectory}`)
  }

  const pkgPath = path.join(subdirectory, filePath);

  let pkgName = 'default';
  for (const pkg in PACKAGE_INFO) {
    if (PACKAGE_INFO[pkg as PackageName].has(pkgPath)) {
      pkgName = pkg;
      break;
    }
  }

  return path.join(pkgName, pkgPath);
}
