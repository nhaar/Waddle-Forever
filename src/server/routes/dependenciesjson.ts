import { findInVersion, VersionsTimeline } from "../game-data";
import { isGreaterOrEqual, Version } from "./versions";
import { getDate, isEngine3 } from "../timelines/dates";
import { START_DATE } from "../timelines/dates";
import { UPDATES } from "../updates/updates";

const scavengerTimeline = getScavengerTimeline();

function getScavengerTimeline() {
  const timeline = new VersionsTimeline<boolean>();
  timeline.add({
    date: START_DATE,
    info: false
  });
  UPDATES.forEach(update => {
    if (update.update.scavengerHunt2010 !== undefined && update.end !== undefined) {
      timeline.add({
        date: update.date,
        end: update.end,
        info: true
      });
    }
  });

  return timeline.getVersions();
}

const fairTimeline = getFairTimeline();

function getFairTimeline() {
  const timeline = new VersionsTimeline<boolean>();
  timeline.add({
    date: START_DATE,
    info: false
  });
  UPDATES.forEach(update => {
    if (update.update.fairCpip !== undefined && update.end !== undefined) {
      timeline.add({
        date: update.date,
        end: update.end,
        info: true
      });
    }
  });

  return timeline.getVersions();
}

const DEPENDENCIES_2009 = {
	boot: [
		{
			id: 'airtower',
			title: 'Communication'
		},
		{
			id: 'sentry',
			title: 'Communication'
		}
	],
	
	login: [
		{
			id: 'login',
			title: 'Login Screen',
		}
	],
	
	join: [
		{
			id: 'engine',
			title: 'Engine'
		},
		{
			id: 'interface',
			title: 'Interface'
		},
		{
			id: 'gridview',
			title: 'Gridview'
		},
		{
			id: 'mail',
			title: 'Mail'
		},
		{
			id: 'book',
			title: 'Mail'
		}
	],
	
	create: [
		{
			id: 'create',
			title: 'Create Penguin'
		}
	],
	
	merch: [
		{
			id: 'app',
			folder: 'merch/',
			title: 'Communication'
		}
	]
}

const DEPENDENCIES_VANILLA = {
  "boot": [
    {
      "id": "party",
      "title": "Party"
    },
    {
      "id": "airtower",
      "title": "Communication"
    },
    {
      "id": "sentry",
      "title": "Communication"
    }
  ],
  "login": [
    {
      "id": "login",
      "title": "Login Screen"
    }
  ],
  "join": [
    {
      "id": "engine",
      "title": "Engine"
    },
    {
      "id": "interface",
      "title": "Interface"
    },
    {
      "id": "gridview",
      "title": "Gridview"
    },
    {
      "id": "mail",
      "title": "Mail"
    },
    {
      "id": "book",
      "title": "Mail"
    },
    {
      "id": "stampbook",
      "title": "StampBook"
    },
    {
      "id": "buddies",
      "title": "StampBook"
    },
    {
      "id": "rooms_common",
      "title": "Rooms Common"
    }
  ],
  "merch": [
    {
      "id": "app",
      "folder": "merch/",
      "title": "Communication"
    }
  ]
}

export default function getDependenciesJson(version: Version, removeIdle: boolean) {
  const huntActive = findInVersion(version, scavengerTimeline);
  const fairActive = findInVersion(version, fairTimeline);

  const engine3 = isEngine3(version);

  const base = engine3 ? DEPENDENCIES_VANILLA : DEPENDENCIES_2009;
  const dependencies = JSON.parse(JSON.stringify(base));

  if (!engine3) {
    if (isGreaterOrEqual(version, getDate('stamps-release'))) {
      dependencies.join.push({
        id: 'stampbook',
        title: 'StampBook'
      });
    }
  }

  if (huntActive) {
    dependencies.join.push({
      id: 'scavenger_hunt',
      title: 'Interface'
    })
  }

  if (fairActive && !isEngine3(version)) {
    dependencies.join.push({
      id: 'fair',
      title: 'Interface'
    })
  }

  if (removeIdle) {
    dependencies.join.push({
      id: 'idle_cancel',
      title: 'Interface'
    })
  }

  return JSON.stringify(dependencies);
}