import { SettingsManager } from "@server/settings";
import { GameData } from "@server/timelines/game-data";

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

export default function getDependenciesJson(d: GameData, s: SettingsManager) {
  const hunt = d.isHuntActive();
  const fair = d.getFair();


  const base = d.isVanillaEngine() ? DEPENDENCIES_VANILLA : DEPENDENCIES_2009;
  const dependencies = JSON.parse(JSON.stringify(base));

  if (!d.isVanillaEngine()) {
    if (d.stampsReleased()) {
      dependencies.join.push({
        id: 'stampbook',
        title: 'StampBook'
      });
    }
  }

  if (hunt) {
    dependencies.join.push({
      id: 'scavenger_hunt',
      title: 'Interface'
    })
  }

  if (fair && !d.isVanillaEngine()) {
    dependencies.join.push({
      id: 'fair',
      title: 'Interface'
    })
  }

  if (s.settings.remove_idle) {
    dependencies.join.push({
      id: 'idle_cancel',
      title: 'Interface'
    })
  }

  return JSON.stringify(dependencies);
}