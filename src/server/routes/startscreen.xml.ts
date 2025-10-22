import { findInVersion } from "../game-data";
import { getStartscreenTimeline } from "../timelines/startscreen";
import { Version } from "./versions";

export function getStartscreenXML(version: Version) {
  const startscreens = getStartscreenTimeline();

  const screens = findInVersion(version, startscreens) || [];

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
}