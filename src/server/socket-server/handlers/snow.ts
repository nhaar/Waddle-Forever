import { PenguinMessenger } from "../messenger";
import { ClientSocket } from "@server/socket-server/socket-server";
import { getDefaultPenguin } from "@server/database/database";
import { getYellowString, logdebug, logverbose } from "@server/logger";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";
import { SnowContext } from "@server/socket-server/snow-data-handler";
import { AlignMode, EventType, InputModifier, InputTarget, InputType, MapblockType, ScaleMode, ServerType, ViewMode } from "../world/snow/snow-constants";
import { LocalGameObject } from "../world/snow/snow-game-objects";
import { CARDS } from "@server/game-logic/cards";
import { SnowGame, SnowPlayer, SnowWorld } from "../world/snow/snow";


export type SnowHandler = (ctx: SnowContext, ...args: Array<string>) => Promise<void>;
export type SnowFrameworkHandler = (ctx: SnowContext, args: Record<string, any>) => Promise<void>;

export const handleVersion: SnowHandler = async ({ msg, client }) => {
  // copied from snowflake config.py, is this meaningful at all?
  await msg.sendSnowData(client, 'S_VERSION', 'FY15-20150206 (4954)r');
}

export const handlePlaceContext: SnowHandler = async (ctx, placeName, query) => {
  const params = new URLSearchParams(query);

  const battleMode = params.get('battleMode');
  const baseAssetUrl = params.get('base_asset_url');
  // it puts "quotes" around the name for some reason
  const place = ctx.world.places[JSON.parse(placeName)];

  if (battleMode === null || baseAssetUrl === null || place === undefined) {
    await ctx.penguin.sendLoginError(ctx);
    ctx.client.end();
    return;
  }

  ctx.penguin.battleMode = Number(battleMode);
  ctx.penguin.baseUrl = baseAssetUrl;
  ctx.penguin.place = place;
}

export const handleLogin: SnowHandler = async (ctx, serverType, pid, token) => {
  const id = Number(pid);

  const { msg, client, penguin, world } = ctx;

  const failLogin = async (msg: string) => {
    logdebug(getYellowString(`Snow login failed: ${msg}`));
    await penguin.sendLoginError(ctx);
    client.end();
  }

  await penguin.sendLoginMessage(ctx, "Got /login command");

  if (penguin.loggedIn) {
    failLogin("Already logged in!");
    return;
  }

  if (serverType.toUpperCase() !== ServerType[world.serverType]) {
    failLogin("Invalid server type given");
    return;
  }

  const pjson = await ctx.db.get(id);

  if (pjson === null) {
    failLogin("Penguin not found");
    return;
  }
  
  // this is where we should handle closing multiple connections if this penguin is already logged in,
  // but there isn't even handling for that in the normal world, so uhhhhh

  // TODO: validate token (not super necessary but whatever)

  // TODO: block joining tusk battle if user is not a snow ninja

  console.log(`${pjson.name} is logging into CJ Snow`);

  const p = new WorldPenguin(id, pjson, ctx.settings);
  ctx.off.removePenguin(id);
  penguin.penguin = p;
  penguin.pid = p.id;
  world.addPenguin(ctx.penguin);

  penguin.loggedIn = true;
  await penguin.sendLoginMessage(ctx, 'Finalizing login');
  await penguin.sendLoginReply(ctx);
  
  // TODO: this shouldnt be sending an empty string... is somewhere else incorrect?
  await msg.sendSnowData(client, 'W_BASEASSETURL', '');
  await msg.sendSnowData(client, 'S_WORLDTYPE', world.serverType, world.buildType);
  await msg.sendSnowData(client, 'S_WORLD', world.worldId, world.worldName, `0:${penguin.place.id}`, 0, 'none', 0, world.worldOwner, world.worldName, 0, world.stylesheetId, 0);

  await penguin.switchPlace(ctx, penguin.place);
}

export const handleReady: SnowHandler = async (ctx) => {
  const { msg, client, penguin } = ctx;

  if (!penguin.windowManager.loaded) {
    await penguin.windowManager.load(ctx);
  }

  const place = penguin.place;

  await msg.sendSnowData(client, 'UI_ALIGN', ctx.world.worldId, 0, 0, AlignMode.CENTER, ScaleMode.NONE);
  await msg.sendSnowData(client, 'UI_BGCOLOR', 34, 164, 243);
  await penguin.setPlace(ctx, place.name, 1, 0);
  
  await msg.sendSnowData(client, 'P_MAPBLOCK', MapblockType.TILEMAP, 1, 1, place.mapBlocks.tileMap);
  await msg.sendSnowData(client, 'P_MAPBLOCK', MapblockType.HEIGHTMAP, 1, 1, place.mapBlocks.heightMap);

  await msg.sendSnowData(client, 'P_VIEW', place.camera.viewMode);
  await msg.sendSnowData(client, 'P_TILESIZE', place.camera.tileSize);
  await msg.sendSnowData(client, 'P_LOCKVIEW', Number(place.camera.lockView));
  await msg.sendSnowData(client, 'P_LOCKSCROLL', Number(place.camera.lockScroll));
  await msg.sendSnowData(client, 'P_LOCKOBJECTS', Number(place.objectLock));

  await msg.sendSnowData(client, 'P_HEIGHTMAPDIVISIONS', place.camera.heightMapDivisions);
  await msg.sendSnowData(client, 'P_HEIGHTMAPSCALE', place.camera.heightMapScale);
  await msg.sendSnowData(client, 'P_DRAG', Number(place.draggable));
  await msg.sendSnowData(client, 'P_ELEVSCALE', place.camera.elevationScale);
  await msg.sendSnowData(client, 'P_RELIEF', Number(place.camera.terrainLighting));
  // do these need repeated?
  await msg.sendSnowData(client, 'P_HEIGHTMAPDIVISIONS', place.camera.heightMapDivisions);
  await msg.sendSnowData(client, 'P_HEIGHTMAPSCALE', place.camera.heightMapScale);

  const c3d = place.camera3d;
  await msg.sendSnowData(client, 'P_CAMERA3D',
    c3d.near, c3d.far,
    ...c3d.position, ...c3d.angle,
    c3d.cameraView, c3d.left,
    c3d.right, c3d.top,
    c3d.top, c3d.bottom,
    c3d.aspect, c3d.vFov,
    c3d.focalLength, 0, c3d.cameraWidth,
    c3d.cameraHeight
  );

  const cam = place.camera;
  await msg.sendSnowData(client, 'P_CAMLIMITS',
    cam.marginTopLeftX, cam.marginTopLeftY,
    cam.marginBottomRightX, cam.marginBottomRightY
  );

  await msg.sendSnowData(client, 'P_RENDERFLAGS', Number(place.render.occludeTiles), place.render.alphaCutoff);
  await msg.sendSnowData(client, 'P_LOCKRENDERSIZE', 0, c3d.cameraWidth, c3d.cameraHeight);

  const s = place.physics;
  await msg.sendSnowData(client, 'P_PHYSICS', ...[
    s.gravity, s.collision, s.friction,
    s.tileFriction, s.safetyNet, s.netHeight,
    s.netFriction, s.netBounce
  ].map(Number));

  await msg.sendSnowData(client, 'P_ASSETSCOMPLETE');
}

export const handlePlaceReady: SnowHandler = async (ctx) => {
  const { msg, client, penguin } = ctx;

  await msg.sendSnowData(client, 'P_CAMERA', ...penguin.place.camera.position, 0, 1);
  await msg.sendSnowData(client, 'P_ZOOM', penguin.place.camera.zoom.toFixed(1));
  await msg.sendSnowData(client, 'P_LOCKCAMERA', Number(penguin.place.camera.lockView));
  await msg.sendSnowData(client, 'P_LOCKZOOM', Number(penguin.place.camera.lockZoom));

  const player = new LocalGameObject(penguin, 'Player', 5, 2.5);
  await player.placeObject(ctx);
  await msg.sendSnowData(client, 'O_PLAYER', player.id);
}

export const handleIntroAnimDone: SnowHandler = async () => {
  // no-op
}

// Sent when clicking a game object
export const handleUse: SnowHandler = async (ctx, objectId) => {
  if (ctx.game === null) return;

  const obj = ctx.game.objects.getById(Number(objectId));

  if (obj === null) {
    // Try and find the obj in the client local objects
    const lobj = ctx.penguin.localObjects.getById(Number(objectId));

    if (lobj !== null && lobj.onClick !== null) {
      lobj.onClick(ctx, lobj);
    }

    return;
  }

  if (obj.onClick === null) {
    // TODO: place powercard;
    return;
  }

  obj.onClick(ctx, obj);
}

export const handleActionDone: SnowHandler = async ({ game }, objectId, handleId) => {
  if (game !== null) {
    game.callbacks.actionDone(Number(handleId), Number(objectId));
  }
}

export const frameworkRoomToRoomMinTime: SnowFrameworkHandler = async (ctx) => {
  if (ctx.game === null) {
    return;
  }

  await ctx.msg.sendSnowData(
    ctx.client,
    'W_INPUT',
    '/use', // input id
    '4375706:1', // script id
    InputTarget.GOB,
    InputType.MOUSE_CLICK,
    InputModifier.NONE,
    '/use' // command
  );

  ctx.game.somePlayerReady(ctx);
}

export const frameworkRoomToRoomComplete: SnowFrameworkHandler = async (ctx) => {
  const { penguin, game } = ctx;

  if (game !== null && !penguin.isReady) {
    penguin.isReady = true;
    game.playersReady(ctx);
  }
}

export const frameworkWindowManagerReady: SnowFrameworkHandler = async (ctx) => {
  const { penguin, world } = ctx;

  penguin.windowManager.ready = true;

  const loadingScreen = penguin.getWindow(
    ctx,
    'cjsnow_loadingscreenassets.swf',
    `${penguin.assetBaseUrl}/cjsnow_loadingscreenassets.swf`
  );

  const wm = penguin.getWindow(ctx, 'windowmanager.swf');
  await wm.sendAction(ctx, 'setWorldId', { worldId: world.worldId });
  await wm.sendAction(ctx, 'setBaseAssetUrl', { baseAssetUrl: penguin.baseUrl });
  await wm.sendAction(ctx, 'setFontPath', { defaultFontPath: `${penguin.baseUrl}/fonts/` });

  await wm.sendAction(ctx, 'skinRoomToRoom', {
    url: loadingScreen.url,
    className: '',
    variant: penguin.battleMode
  }, EventType.PLAY_ACTION);

  const errorHandler = penguin.getWindow(ctx, 'cardjitsu_snowerrorhandler.swf');
  errorHandler.layer = 'bottomLayer';
  await errorHandler.load(ctx, null, { xPercent: 0, yPercent: 0, loadDescription: '' });

  const cardCounts = {
    'f': 0,
    'w': 0,
    's': 0
  };
  penguin.penguin.ninja.getDeck().forEach(id => {
    const card = CARDS.get(id);
    if (card.powerId > 0) cardCounts[card.element]++;
  });

  // TODO: this can be one of two: 'cardjitsu_snowplayerselect.swf' or 'cardjitsu_snowplayerselectbeta.swf'
  const playerSelect = penguin.getWindow(ctx, 'cardjitsu_snowplayerselect.swf');
  await playerSelect.load(ctx, {
    game: penguin.battleMode === 0 ? 'snow' : 'snowtusk',
    name: penguin.penguin.name,
    powerCardsFire: cardCounts.f,
    powerCardsWater: cardCounts.w,
    powerCardsSnow: cardCounts.s,
    playerSnowRank: 0, // TODO
  }, {
    loadDescription: '', xPercent: 0, yPercent: 0
  });
}

export const frameworkScreenSize: SnowFrameworkHandler = async (ctx, { smallViewEnabled }) => {
  ctx.penguin.screenSize = smallViewEnabled;
}

export const frameworkPayloadBILogAction: SnowFrameworkHandler = async () => {
  // no-op
}

export const frameworkWindowReady: SnowFrameworkHandler = async (ctx, { windowUrl }) => {
  const name = (windowUrl as string).split('/').pop();
  const win = ctx.penguin.getWindow(ctx, name);
  win.loaded = true;
  if (win.onLoad !== null) {
    win.onLoad(ctx);
  }
}

export const frameworkWindowClosed: SnowFrameworkHandler = async (ctx, { windowUrl }) => {
  const name = (windowUrl as string).split('/').pop();
  const win = ctx.penguin.getWindow(ctx, name);
  win.loaded = false;
  if (win.onClose !== null) {
    win.onClose(ctx);
  }
  ctx.penguin.windowManager.delete(name);
}

export const frameworkElementSelected: SnowFrameworkHandler = async (ctx, { element, tipMode }) => {
  ctx.penguin.element = (element as string).toLowerCase();
  ctx.penguin.tipMode = tipMode;

  if (!['fire', 'water', 'snow'].includes(ctx.penguin.element)) {
    logverbose(getYellowString('Invalid element: ' + ctx.penguin.element));
    ctx.client.end();
    return;
  }

  ctx.world.matchMaker.addPlayer(ctx.penguin);
}

export const frameworkMMCancel: SnowFrameworkHandler = async (ctx) => {
  ctx.world.matchMaker.removePlayer(ctx.penguin);
}

export const setupMatchMaker = async (world: SnowWorld, msg: PenguinMessenger<SnowPlayer>) => {
  /* TODO: its probably better that the snow matchmaker gets its own class,
  since there's a few other things we should do (prioritize by rank,
  fill in with bot players, etc) */

  world.matchMaker.setAvailableRoomPredicate((room, player: SnowPlayer) => {
    return !room.full && room.allPlayersMeetCondition((p: SnowPlayer) => {
      return p.element !== player.element;
    })
  });
  world.matchMaker.setMatchListener((players: SnowPlayer[]) => {
    const fireNinja = players.find(p => p.element === 'fire') ?? null;
    const waterNinja = players.find(p => p.element === 'water') ?? null;
    const snowNinja = players.find(p => p.element === 'snow') ?? null;

    for (const penguin of [fireNinja, snowNinja, waterNinja].filter(Boolean)) {
      const ctx = { penguin, msg, world } as SnowContext;
      const select = penguin.getWindow(ctx, 'cardjitsu_snowplayerselect.swf');
      select.sendPayload(ctx, 'matchFound', {
        1: fireNinja ? fireNinja.penguin.name : null,
        2: waterNinja ? waterNinja.penguin.name : null,
        4: snowNinja ? snowNinja.penguin.name : null
      })
      world.matchMaker.removePlayer(penguin);
    }

    world.createGame({ msg, world } as SnowContext, fireNinja, waterNinja, snowNinja);
  });
  world.matchMaker.setTickListener(() => {});
}

export const frameworkQuit: SnowFrameworkHandler = async (ctx) => {
  const { client, penguin } = ctx;
  console.log(`${penguin.penguin.name} is leaving CJ Snow`);
  await penguin.sendToRoom(ctx);
  client.closed = true;
}
