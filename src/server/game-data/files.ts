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
    }
  ],
  [APPROXIMATION]: [
    {
      file: 'chat291_no_news.swf',
      comment: 'Remove the Newspaper icon to simulare pre-newspapers',
      base: 'unknown:chat291.swf'
    },
    {
      file: 'forts_release.swf',
      comment: 'Removed ability to go to the Plaza, to simulate how the Snow Forts was during its release',
      base: 'archives:ArtworkRoomsForts12.swf'
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
      file: 'aprilfools2010_plaza.swf',
      comment: 'By VamprLover, recreation of the Plaza with the PPA 2010 voting booth'
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
      file: 'cave_opening/dance.swf',
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
      file: 'interface_epf_no_stamps.swf',
      comment: 'Made by Supermanover. Interface with EPF phone but no stamps in the playercard'
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
      comment: 'Winter Luau room recreation by Supermanover'
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
      comment: 'made by Victando'
    },
    {
      file: 'summer_kickoff_2007/dock.swf',
      comment: 'made by Victando'
    },
    {
      file: 'summer_kickoff_2007/mtn.swf',
      comment: 'made by Cyan'
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
      file: '1st_anniversary/coffee.swf',
      comment: 'made by Doubleuman'
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
      file: 'dependencies_scavenger_hunt.json',
      comment: 'File to load the Scavenger Hunt. Should be integrated in the future'
    },
    {
      file: 'dynamic_igloo_music.swf',
      comment: 'File that loads the igloo music from a XML file. Originally by Ben, refined by Randomno to include bold names and remove pagination'
    },
    {
      file: 'fair_dependencies.json',
      comment: 'File to load the Fair dependency. Should be refactor as an "icon" dependency instead, similarly to Pre-CPIP eggs'
    },
    {
      file: 'fair_icon_adder.swf',
      comment: 'Modified from Ben\'s scavenger hunt mod'
    },
    {
      file: 'news_config.xml',
      comment: 'A XML file that is meant to work across all AS3 newspapers, linking all needed elements'
    },
    {
      file: 'scavenger_hunt_2010.swf',
      comment: 'By Ben, SWF that adds the scavenger hunt icon'
    }
  ],
  [UNKNOWN]: [
    {
      file: 'chat291.swf',
      comment: 'I thought it was from Mammoth, but for some reason the bytes don\'t match'
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
      file: 'interface_2009.swf',
      comment: 'Unknown, might just be the October 2009 interface in archives'
    },
    {
      file: 'interface_stamps.swf',
      comment: 'Originally from legacy-media, but have not documented all the changes'
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
      if (!documentedFiles.has(file)) {
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
