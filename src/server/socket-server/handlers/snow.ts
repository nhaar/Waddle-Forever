import { PenguinMessenger } from "../messenger";
import { ClientSocket } from "@server/socket-server/socket-server";
import { getDefaultPenguin } from "@server/database/database";
import { getYellowString, logdebug, logverbose } from "@server/logger";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";
import { SnowContext, SnowPenguinContext } from "@server/socket-server/snow-data-handler";
import { AlignMode, EventType, InputModifier, InputTarget, InputType, MapblockType, ScaleMode, ServerType, TipPhase, ViewMode } from "../world/snow/snow-constants";
import { CARDS } from "@server/game-logic/cards";
import { sleep, SnowGame, SnowPlayer, SnowWorld } from "../world/snow/snow";
import { GameObject, sfxName } from "../world/snow/snow-game-objects";


export type SnowHandler = (ctx: SnowPenguinContext, ...args: Array<string>) => Promise<void>;
export type SnowFrameworkHandler = (ctx: SnowPenguinContext, args: Record<string, any>) => Promise<void>;

export const handleVersion: SnowHandler = async ({ msg, client }) => {
  // copied from snowflake config.py
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
  ctx.penguin.baseUrl = ctx.world.locations.base;
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

  await penguin.switchPlace(penguin.place);
}

export const handleReady: SnowHandler = async (ctx) => {
  const { msg, client, penguin } = ctx;

  if (!penguin.windowManager.loaded) {
    await penguin.windowManager.load();
  }

  const place = penguin.place;

  await msg.sendSnowData(client, 'UI_ALIGN', ctx.world.worldId, 0, 0, AlignMode.CENTER, ScaleMode.NONE);
  await msg.sendSnowData(client, 'UI_BGCOLOR', 34, 164, 243);
  await penguin.setPlace(place.name, 1, 0);
  
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
  await msg.sendSnowData(client, 'P_ZOOM', penguin.place.camera.zoom);
  await msg.sendSnowData(client, 'P_LOCKCAMERA', Number(penguin.place.camera.lockView));
  await msg.sendSnowData(client, 'P_LOCKZOOM', Number(penguin.place.camera.lockZoom));

  // this does nothing for snow, but it's needed for the game to start
  await msg.sendSnowData(client, 'O_PLAYER', -1);
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
    // We're placing a power card
    if (ctx.penguin.selectedCard) {
      ctx.penguin.ninja.placePowerCard(obj.x, obj.y);
    }
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
}

export const frameworkRoomToRoomComplete: SnowFrameworkHandler = async (ctx) => {
  const { penguin, game } = ctx;

  if (game !== null && !penguin.isReady) {
    penguin.isReady = true;
    game.playersReady();
  }
}

export const frameworkWindowManagerReady: SnowFrameworkHandler = async (ctx) => {
  const { penguin, world } = ctx;

  penguin.windowManager.ready = true;

  const loadingScreen = penguin.getWindow(
    'cjsnow_loadingscreenassets.swf',
    `${world.locations.assetBase}/cjsnow_loadingscreenassets.swf`
  );

  const wm = penguin.getWindow('windowmanager.swf');
  await wm.sendAction('setWorldId', { worldId: world.worldId });
  await wm.sendAction('setBaseAssetUrl', { baseAssetUrl: world.locations.base });
  await wm.sendAction('setFontPath', { defaultFontPath: `${world.locations.base}/fonts/` });

  await wm.sendAction('skinRoomToRoom', {
    url: loadingScreen.url,
    className: '',
    variant: penguin.battleMode
  }, EventType.PLAY_ACTION);

  const errorHandler = penguin.getWindow('cardjitsu_snowerrorhandler.swf');
  errorHandler.layer = 'bottomLayer';
  await errorHandler.load(null, { xPercent: 0, yPercent: 0, loadDescription: '' });

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
  const playerSelect = penguin.getWindow('cardjitsu_snowplayerselect.swf');
  await playerSelect.load({
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

export const frameworkScreenSize: SnowFrameworkHandler = async () => {
  // 'smallViewEnabled' is given, but as far as i can tell this is meaningless.
  // possibly did something for the original play page?
}

export const frameworkPayloadBILogAction: SnowFrameworkHandler = async () => {
  // no-op
}

export const frameworkWindowReady: SnowFrameworkHandler = async (ctx, { windowUrl }) => {
  const name = (windowUrl as string).split('/').pop();
  const win = ctx.penguin.getWindow(name);
  win.setLoaded(true, ctx.game);
  if (win.onLoad !== null) {
    win.onLoad(ctx);
  }
}

export const frameworkWindowClosed: SnowFrameworkHandler = async (ctx, { windowUrl }) => {
  const name = (windowUrl as string).split('/').pop();
  const win = ctx.penguin.getWindow(name);
  win.setLoaded(false, ctx.game);
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

export const setupMatchMaker = async (world: SnowWorld) => {
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
      const select = penguin.getWindow(null, 'cardjitsu_snowplayerselect.swf');
      select.sendPayload('matchFound', {
        1: fireNinja ? fireNinja.penguin.name : null,
        2: waterNinja ? waterNinja.penguin.name : null,
        4: snowNinja ? snowNinja.penguin.name : null
      })
      world.matchMaker.removePlayer(penguin);
    }

    world.createGame(fireNinja, waterNinja, snowNinja);
  });
  world.matchMaker.setTickListener(() => {});
}

export const frameworkMemberCardInfo: SnowFrameworkHandler = async ({ penguin }) => {
  if (penguin.lastTip === TipPhase.MEMBER_CARD) {
    penguin.hideTip();
  } else {
    penguin.sendTip(TipPhase.MEMBER_CARD);
  }
}

export const frameworkWindowDuplicated: SnowFrameworkHandler = async ({ penguin }) => {
  // comment from snowflake:
  // This will get sent by the client when the server tries to load a
  // window that already exists.
  // In most cases, it's just the tip window.
  penguin.hideTip();
}

export const frameworkCardSelect: SnowFrameworkHandler = async ({ penguin, game }, { element, value, cardId }) => {
  if (penguin.isReady || !game.timer.running) return console.log('die2');

  const card = penguin.powerCardById(Number(cardId));

  if (card.value !== Number(value) || card.element !== element) return console.log('die');

  if (penguin.selectedMemberCard) {
    penguin.memberCard.remove();
    penguin.memberCard.selected = false;
  }

  if (penguin.selectedCard) {
    penguin.selectedCard.remove();
  }

  card.object.x = card.object.y = -1;

  penguin.selectedCard = card;
  penguin.ninja.removeTargets();
  game.grid.changeTiles(penguin, 'ui_tile_attack', true, true);
  penguin.ninja.playSound(sfxName('uitargetred'), penguin);
}

export const frameworkCardDeselect: SnowFrameworkHandler = async ({ penguin, game }) => {
  if (penguin.isReady || !game.timer.running || !penguin.selectedCard) return console.log('die3');

  penguin.selectedCard.remove();
  penguin.selectedCard = null;
  penguin.ninja.showTargets();
  game.grid.showTiles(penguin);
}

export const frameworkMemberCardSelect: SnowFrameworkHandler = async ({ penguin, game }) => {
  if (!penguin.penguin.membership.isMember) return;

  if (penguin.isReady || !penguin.memberCard || !game.timer.running) return;

  if (penguin.selectedCard) {
    await penguin.selectedCard.remove();
    penguin.selectedCard = null;
  }

  await penguin.memberCard.place();
  penguin.ninja.removeTargets();
  game.grid.hideTiles(penguin);
}

export const frameworkMemberCardDeselect: SnowFrameworkHandler = async ({ penguin, game }) => {
  if (!penguin.penguin.membership.isMember) return;

  if (penguin.isReady || !penguin.memberCard || !game.timer.running) return;

  penguin.memberCard.selected = false;
  await penguin.memberCard.remove();

  if (penguin.ninja.hp > 0) {
    penguin.ninja.showTargets();
    game.grid.showTiles(penguin);
  }
}

export const frameworkCardConsumed: SnowFrameworkHandler = async ({ penguin }) => {
  penguin.powerCardSlots.delete(penguin.selectedCard);
  penguin.selectedCard = null;

  if (!penguin.hasPowerCards) {
    const ui = penguin.getWindow('cardjitsu_snowui.swf');
    ui.sendPayload('updateStamina', { cardData: null, cycle: false, stamina: 0 });
    ui.sendPayload('noCards');
  }
}

export const frameworkConfirmClicked: SnowFrameworkHandler = async ({ penguin, game }) => {
  if (penguin.isReady) return;

  // snowflake had this named 'ui_confirm', but that doesnt seem to exist?
  const confirm = new GameObject(game, 'confirm', penguin.ninja.x, penguin.ninja.y, false, 0.5, 1.05);
  await confirm.placeObject();
  await confirm.placeSprite();
  confirm.playSound('SFX_MG_2013_CJSnow_UIPlayerReady_VBR8');

  penguin.getWindow('cardjitsu_snowui.swf').sendPayload('disableCards');

  game.grid.hideTiles(penguin);

  penguin.isReady = true;

  if (!penguin.displayedTips.has(TipPhase.CONFIRM)) {
    penguin.displayedTips.add(TipPhase.CONFIRM);
  }

  if (penguin.tipMode && penguin.lastTip === TipPhase.CONFIRM) {
    penguin.hideTip();
  }
}

export const frameworkQuit: SnowFrameworkHandler = async (ctx) => {
  const { client, penguin } = ctx;
  console.log(`${penguin.penguin.name} is leaving CJ Snow`);
  await penguin.sendToRoom();
  penguin.disconnected = true;
  client.closed = true;
}
