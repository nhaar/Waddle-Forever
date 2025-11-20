import { findInVersion } from "../game-data";
import { AS3_STARTSCREEN, MODERN_AS3 } from "../timelines/dates";
import { getStartscreenTimeline } from "../timelines/startscreen";
import { isLower, Version } from "./versions";

export function getStartscreenXML(version: Version) {
  const startscreens = getStartscreenTimeline();

  const screens = findInVersion(version, startscreens) || [];

	if (isLower(version, AS3_STARTSCREEN)) {
		return `
	<?xml version="1.0" encoding="UTF-8" ?>
	<!-- EN -->
	<startscreen>
		
		<backgrounds>
			<!-- in constant rotation -->
	
			${screens.map((screen) => {
				return `<background>
					<url>${screen}</url>
					<probability>1</probability>
					<nolink/>
				</background>`
			}).join('\n')}
	
			<!-- /constant rotation -->		
			
		</backgrounds>
		
		<messages>
			<message>
				<title>WHAT'S NEW?</title>
				<icon>whats_new.swf</icon>
				<content type='url'>http://community.clubpenguin.com/blog/</content>
			</message>
		</messages>
	
	</startscreen>
	`;
	} else if (isLower(version, MODERN_AS3)) {
		return `
<?xml version="1.0" encoding="UTF-8"?>

<section id="START">
	
	<language>en</language>
	
	<cdn_url href="http://media1.clubpenguin.com/play/"/>
	
	<font_list type="array">
		
		<font src="start/font/CCFaceFrontBoldItalic.swf"/>
		
	</font_list>
	
	<button_list type="array" base_url="http://play.clubpenguin.com/">
		
		<button id="start_button" classpath="com:clubpenguin:web:play:startscreen:view:ui:StartButton" href="login/" target="_top" x="380" y="390">Start</button>
		
		<button id="blog_button" classpath="com:clubpenguin:web:play:startscreen:view:ui:BlogButton" href="http://community.clubpenguin.com/" target="_top" x="105" y="380">Check out what's new</button>
		
		<button id="create_button" classpath="com:clubpenguin:web:play:startscreen:view:ui:CreateAccountButton" href="create/" target="_top" x="650" y="370">Create a new Penguin</button>
		
		<button id="member_button" classpath="com:clubpenguin:web:play:startscreen:view:ui:BecomeMemberButton" href="http://www.clubpenguin.com/membership/" target="_top" x="650" y="425">Become a member</button>
		
		<button id="unlock_button" classpath="com:clubpenguin:web:play:startscreen:view:ui:UnlockItemButton" src="http://media1.clubpenguin.com/play/start/image/unlock-items-icon.swf" href="redeem/" target="_top" x="95" y="400">Unlock items online!</button>
		
	</button_list>
	
	
	<billboard_list type="array">
		
		<billboard id="gen_cjevergreen_water" type="EXTERNAL_LINK" src="login/backgrounds/card_jitsu_water.swf" href="http://www.clubpenguin.com/card-jitsu/" probability="0"/>
		
		<billboard id="gen_epf_sysdef" type="INTERNAL_LINK" src="login/backgrounds/system_defender.swf" href="rm=212#/login/" probability="0"/>
		
		<billboard id="puffle_rescue" type="EXTERNAL_LINK" src="login/backgrounds/puffle_rescue.swf" href="http://www.clubpenguin.com/membership/" probability="0"/>
		
		<billboard id="stamps_jetpack" type="EXTERNAL_LINK" src="login/backgrounds/jetpack.swf" href="http://www.clubpenguin.com/membership/" probability="0"/>
		
		<billboard id="gen_2011puffle-yellow" type="INTERNAL_LINK" src="login/backgrounds/adopt_yellow.swf" href="rm=310#/login/" probability="0"/>
		
		<billboard id="gen_2011puffle-green" type="INTERNAL_LINK" src="login/backgrounds/adopt_green.swf" href="rm=310#/login/" probability="0"/>
		
		<billboard id="gen_2011puffle-black" type="INTERNAL_LINK" src="login/backgrounds/adopt_black.swf" href="rm=310#/login/" probability="0"/>
		
		<billboard id="gen_2011puffle-pink" type="INTERNAL_LINK" src="login/backgrounds/adopt_pink.swf" href="rm=310#/login/" probability="0"/>
		
		<billboard id="stamps2_cart" type="NO_LINK" src="login/backgrounds/stamps3.swf" probability="0"/>
		
		<billboard id="gen_stamps_pufflelaunch" type="NO_LINK" src="login/backgrounds/Billboard_Puffle_Launch.swf" probability="0"/>
		
		<billboard id="epf" type="INTERNAL_LINK" src="login/backgrounds/epf.swf" href="rm=212#/login/" probability="0"/>
		
		<billboard id="mem_igloo_cust" type="EXTERNAL_LINK" src="login/backgrounds/igloo.swf" href="http://www.clubpenguin.com/membership/" probability="0"/>
		
		<billboard id="gen_cjevergreen_ninjarecruit" type="INTERNAL_LINK" src="login/backgrounds/ninja_recruitment.swf" href="rm=320#/login/" probability="0"/>
		
		<billboard id="mem_2011medieval" type="EXTERNAL_LINK" src="login/backgrounds/medievalparty.swf" href="http://www.clubpenguin.com/membership/" probability="0"/>

		${screens.map((screen, i) => {
			return `<billboard id="autogen-${i}" type="EXTERNAL_LINK" src="login/backgrounds/${screen}" href="http://www.clubpenguin.com/membership/" probability="1"/>`
		}).join('\n')}
		
	</billboard_list>
	
</section>`;
	} else {
		return `<?xml version="1.0" encoding="UTF-8"?>

<section id="START">
	
	<language>en</language>
	
	<cdn_url href="/play/start/"/>
	
	<button_list type="array" base_url="/">
	
		<button id="logo_button" classpath="com:clubpenguin:web:play:startscreen:view:ui:LogoButton" href="" x="380" y="305" target="_top"/>
		
		<button id="start_button" classpath="com:clubpenguin:web:play:startscreen:view:ui:LoginButton" href="login/" target="_top" x="410" y="405" fontSize="20">Login</button>
		
		<button id="create_button" classpath="com:clubpenguin:web:play:startscreen:view:ui:CreateAccountButton" href="" target="_top" x="180" y="405" fontSize="18">Create a Penguin</button>
		
		<button id="membership_button" classpath="com:clubpenguin:web:play:startscreen:view:ui:MembershipButton" href="http://betateam.www.clubpenguin.com/membership/" target="_top" x="440" y="287" fontSize="12">Buy a Membership</button>
		
	</button_list>
	
	<billboard_list type="array">
		
		<billboard id="gen_cjevergreen_orig" src="card_jitsu.swf" href="rm=320#/login/" probability="0"/>
		
		<billboard id="gen_cjevergreen_water" src="card_jitsu_water.swf" href="http://betateam.www.clubpenguin.com/membership/" probability="0"/>
		
		<billboard id="gen_cjevergreen_ninjarecruit" src="ninja_recruitment.swf" href="rm=320#/login/" probability="0"/>
		
		<billboard id="gen_epf_sysdef" src="system_defender.swf" href="rm=212#/login/" probability="0"/>
		
		<billboard id="puffle_rescue" src="puffle_rescue.swf" href="http://betateam.www.clubpenguin.com/membership/" probability="0"/>
		
		<billboard id="stamps_jetpack" src="jetpack.swf" href="http://betateam.www.clubpenguin.com/membership/" probability="0"/>
		
		<billboard id="gen_2011puffle-yellow" src="adopt_yellow.swf" href="rm=310#/login/" probability="0"/>
		
		<billboard id="gen_2011puffle-green" src="adopt_green.swf" href="rm=310#/login/" probability="0"/>
		
		<billboard id="gen_2011puffle-black" src="adopt_black.swf" href="rm=310#/login/" probability="0"/>
		
		<billboard id="gen_2011puffle-pink" src="adopt_pink.swf" href="rm=310#/login/" probability="0"/>
		
		<billboard id="stamps2_cart" src="stamps_3.swf" probability="0"/>
		
		<billboard id="gen_stamps_pufflelaunch" src="Billboard_Puffle_Launch.swf" probability="0"/>
		
		<billboard id="epf" src="epf.swf" href="rm=212#/login/" probability="0"/>
		
		<billboard id="mem_igloo_cust" src="login.swf" href="http://betateam.www.clubpenguin.com/membership/" probability="0"/>
		
		<billboard id="gen_2011adventure" src="island_adventure_party.swf" href="rm=400#/login/" probability="0"/>

		${screens.map((screen, i) => {
			return `<billboard id="autogen-${i}" type="EXTERNAL_LINK" src="login/backgrounds/${screen}" href="http://www.clubpenguin.com/membership/" probability="1"/>`
		}).join('\n')}
		
	</billboard_list>
	
</section>`;
	}
}