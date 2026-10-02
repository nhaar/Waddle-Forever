import { getYellowString, logdebug, logverbose } from "@server/logger";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";
import { SnowPenguinContext } from "@server/socket-server/snow-data-handler";
import { AlignMode, EventType, InputModifier, InputTarget, InputType, MapblockType, ScaleMode, ServerType, TipPhase, Windows } from "../world/snow/snow-constants";
import { CARDS } from "@server/game-logic/cards";
import { SnowPlayer, SnowWorld } from "../world/snow/snow";
import { GameObject, sfxName } from "../world/snow/snow-game-objects";


export type SnowHandler = (ctx: SnowPenguinContext, ...args: Array<string>) => Promise<void>;
export type SnowFrameworkHandler = (ctx: SnowPenguinContext, args: Record<string, any>) => Promise<void>;

export const handleVersion: SnowHandler = async ({ msg, client }) => {
  // copied from snowflake config.py
  await msg.send(client, 'S_VERSION', 'FY15-20150206 (4954)r');
}

export const handlePlaceContext: SnowHandler = async (ctx, placeName, query) => {
  const params = new URLSearchParams(query);

  const battleMode = params.get('battleMode');
  const baseAssetUrl = params.get('base_asset_url');
  // it puts "quotes" around the name for some reason
  const place = ctx.world.places[JSON.parse(placeName)];

  if (battleMode === null || baseAssetUrl === null || place === undefined) {
    await ctx.player.sendLoginError();
    ctx.player.disconnected = true;
    ctx.client.end();
    return;
  }

  ctx.player.battleMode = Number(battleMode);
  ctx.player.baseUrl = ctx.world.locations.base;
  ctx.player.place = place;
}

export const handleLogin: SnowHandler = async (ctx, serverType, pid, token) => {
  const id = Number(pid);

  const { msg, client, player, world } = ctx;

  const failLogin = async (msg: string) => {
    logdebug(getYellowString(`Snow login failed: ${msg}`));
    await player.sendLoginError();
    ctx.player.disconnected = true;
    client.end();
  }

  await player.sendLoginMessage("Got /login command");

  if (player.loggedIn) {
    failLogin("Already logged in!");
    return;
  }

  if (serverType.toUpperCase() !== ServerType[world.serverType]) {
    failLogin("Invalid server type given");
    return;
  }

  const p = ctx.regularWorld.getById(id);

  if (p === undefined) {
    failLogin("Penguin not found");
    return;
  }
  
  // this is where we should handle closing multiple connections if this penguin is already logged in,
  // but there isn't even handling for that in the normal world, so uhhhhh

  // TODO: validate token (not super necessary but whatever)

  // TODO: block joining tusk battle if user is not a snow ninja

  console.log(`${p.name} is logging into CJ Snow`);

  player.penguin = p;
  player.pid = p.id;
  world.addPenguin(ctx.player);

  player.loggedIn = true;
  await player.sendLoginMessage('Finalizing login');
  await msg.send(client, 'S_LOGIN', p.id);
  
  // TODO: this shouldnt be sending an empty string... is somewhere else incorrect?
  await msg.send(client, 'W_BASEASSETURL', '');
  await msg.send(client, 'S_WORLDTYPE', world.serverType, world.buildType);
  await msg.send(client, 'S_WORLD', world.worldId, world.worldName, `0:${player.place.id}`, 0, 'none', 0, world.worldOwner, world.worldName, 0, world.stylesheetId, 0);

  await player.switchPlace(player.place);
}

export const handleReady: SnowHandler = async (ctx) => {
  const { msg, client, player } = ctx;

  if (!player.windowManager.loaded) {
    await player.windowManager.load();
  }

  const place = player.place;

  await msg.send(client, 'UI_ALIGN', ctx.world.worldId, 0, 0, AlignMode.CENTER, ScaleMode.NONE);
  await msg.send(client, 'UI_BGCOLOR', 34, 164, 243);
  await player.setPlace(place.name, 1, 0);
  
  await msg.send(client, 'P_MAPBLOCK', MapblockType.TILEMAP, 1, 1, place.mapBlocks.tileMap);
  await msg.send(client, 'P_MAPBLOCK', MapblockType.HEIGHTMAP, 1, 1, place.mapBlocks.heightMap);

  await msg.send(client, 'P_VIEW', place.camera.viewMode);
  await msg.send(client, 'P_TILESIZE', place.camera.tileSize);
  await msg.send(client, 'P_LOCKVIEW', Number(place.camera.lockView));
  await msg.send(client, 'P_LOCKSCROLL', Number(place.camera.lockScroll));
  await msg.send(client, 'P_LOCKOBJECTS', Number(place.objectLock));

  await msg.send(client, 'P_HEIGHTMAPDIVISIONS', place.camera.heightMapDivisions);
  await msg.send(client, 'P_HEIGHTMAPSCALE', place.camera.heightMapScale);
  await msg.send(client, 'P_DRAG', Number(place.draggable));
  await msg.send(client, 'P_ELEVSCALE', place.camera.elevationScale);
  await msg.send(client, 'P_RELIEF', Number(place.camera.terrainLighting));
  // do these need repeated?
  await msg.send(client, 'P_HEIGHTMAPDIVISIONS', place.camera.heightMapDivisions);
  await msg.send(client, 'P_HEIGHTMAPSCALE', place.camera.heightMapScale);

  const c3d = place.camera3d;
  await msg.send(client, 'P_CAMERA3D',
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
  await msg.send(client, 'P_CAMLIMITS',
    cam.marginTopLeftX, cam.marginTopLeftY,
    cam.marginBottomRightX, cam.marginBottomRightY
  );

  await msg.send(client, 'P_RENDERFLAGS', Number(place.render.occludeTiles), place.render.alphaCutoff);
  await msg.send(client, 'P_LOCKRENDERSIZE', 0, c3d.cameraWidth, c3d.cameraHeight);

  const s = place.physics;
  await msg.send(client, 'P_PHYSICS', ...[
    s.gravity, s.collision, s.friction,
    s.tileFriction, s.safetyNet, s.netHeight,
    s.netFriction, s.netBounce
  ].map(Number));

  await msg.send(client, 'P_ASSETSCOMPLETE');
}

export const handlePlaceReady: SnowHandler = async (ctx) => {
  const { msg, client, player } = ctx;

  await msg.send(client, 'P_CAMERA', ...player.place.camera.position, 0, 1);
  await msg.send(client, 'P_ZOOM', player.place.camera.zoom);
  await msg.send(client, 'P_LOCKCAMERA', Number(player.place.camera.lockView));
  await msg.send(client, 'P_LOCKZOOM', Number(player.place.camera.lockZoom));

  // this does nothing for snow, but it's needed for the game to start
  await msg.send(client, 'O_PLAYER', -1);
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
    const lobj = ctx.player.localObjects.getById(Number(objectId));

    if (lobj !== null && lobj.onClick !== null) {
      lobj.onClick(ctx, lobj);
    }

    return;
  }

  if (obj.onClick === null) {
    // We're placing a power card
    if (ctx.player.selectedCard) {
      ctx.player.ninja.placePowerCard(obj.x, obj.y);
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

  await ctx.msg.send(
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
  const { player, game } = ctx;

  if (game !== null && !player.isReady) {
    player.isReady = true;
    game.playersReady();
  }
}

export const frameworkWindowManagerReady: SnowFrameworkHandler = async (ctx) => {
  const { player, world } = ctx;

  player.windowManager.ready = true;

  const loadingScreen = player.getWindow(
    'cjsnow_loadingscreenassets.swf',
    `${world.locations.assetBase}/cjsnow_loadingscreenassets.swf`
  );

  const wm = player.getWindow('windowmanager.swf');
  await wm.sendAction('setWorldId', { worldId: world.worldId });
  await wm.sendAction('setBaseAssetUrl', { baseAssetUrl: world.locations.base });
  await wm.sendAction('setFontPath', { defaultFontPath: `${world.locations.base}/fonts/` });

  await wm.sendAction('skinRoomToRoom', {
    url: loadingScreen.url,
    className: '',
    variant: player.battleMode
  }, EventType.PLAY_ACTION);

  const errorHandler = player.getWindow(Windows.ERRORS);
  errorHandler.layer = 'bottomLayer';
  await errorHandler.load(null, { xPercent: 0, yPercent: 0, loadDescription: '' });

  const cardCounts = {
    'f': 0,
    'w': 0,
    's': 0
  };
  player.penguin.ninja.getDeck().forEach(id => {
    const card = CARDS.get(id);
    if (card.powerId > 0) cardCounts[card.element]++;
  });

  // TODO: this can be one of two: 'cardjitsu_snowplayerselect.swf' or 'cardjitsu_snowplayerselectbeta.swf'
  const playerSelect = player.getWindow(Windows.PLAYER_SELECT);
  await playerSelect.load({
    game: player.battleMode === 0 ? 'snow' : 'snowtusk',
    name: player.penguin.name,
    powerCardsFire: cardCounts.f,
    powerCardsWater: cardCounts.w,
    powerCardsSnow: cardCounts.s,
    playerSnowRank: player.penguin.ninja.snowProgress.rank,
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
  const win = ctx.player.getWindow(name);
  win.setLoaded(true, ctx.game);
  if (win.onLoad !== null) {
    win.onLoad(ctx);
  }
}

export const frameworkWindowClosed: SnowFrameworkHandler = async (ctx, { windowUrl }) => {
  const name = (windowUrl as string).split('/').pop();
  const win = ctx.player.getWindow(name);
  win.setLoaded(false, ctx.game);
  if (win.onClose !== null) {
    win.onClose(ctx);
  }
  ctx.player.windowManager.delete(name);
}

export const frameworkElementSelected: SnowFrameworkHandler = async (ctx, { element, tipMode }) => {
  ctx.player.element = (element as string).toLowerCase();
  ctx.player.tipMode = tipMode;

  if (!['fire', 'water', 'snow'].includes(ctx.player.element)) {
    logverbose(getYellowString('Invalid element: ' + ctx.player.element));
    ctx.player.disconnected = true;
    ctx.client.end();
    return;
  }

  ctx.world.matchMaker.addPlayer(ctx.player);
}

export const frameworkMMCancel: SnowFrameworkHandler = async (ctx) => {
  ctx.world.matchMaker.removePlayer(ctx.player);
}

export const setupMatchMaker = async (world: SnowWorld) => {
  /* TODO: its probably better that the snow matchmaker gets its own class,
  since there's a few other things we should do (prioritize by rank,
  fill in with bot players, etc) */

  world.matchMaker.setAvailableRoomPredicate((room, player: SnowPlayer) => {
    return !room.full && room.allPlayersMeetCondition((p: SnowPlayer) => {
      return p.element !== player.element && p.battleMode === player.battleMode;
    })
  });
  world.matchMaker.setMatchListener((players: SnowPlayer[]) => {
    const fire = players.find(p => p.element === 'fire') ?? null;
    const water = players.find(p => p.element === 'water') ?? null;
    const snow = players.find(p => p.element === 'snow') ?? null;

    for (const penguin of [fire, snow, water].filter(Boolean)) {
      const select = penguin.getWindow(null, Windows.PLAYER_SELECT);
      select.sendPayload('matchFound', {
        1: fire ? fire.penguin.name : null,
        2: water ? water.penguin.name : null,
        4: snow ? snow.penguin.name : null
      })
      world.matchMaker.removePlayer(penguin);
    }

    world.createGame(fire, water, snow);
  });
  world.matchMaker.setTickListener(() => {});
}

export const frameworkMemberCardInfo: SnowFrameworkHandler = async ({ player }) => {
  if (player.lastTip === TipPhase.MEMBER_CARD) {
    player.hideTip();
  } else {
    player.sendTip(TipPhase.MEMBER_CARD);
  }
}

export const frameworkWindowDuplicated: SnowFrameworkHandler = async ({ player }) => {
  // comment from snowflake:
  // This will get sent by the client when the server tries to load a
  // window that already exists.
  // In most cases, it's just the tip window.
  player.hideTip();
}

export const frameworkCardSelect: SnowFrameworkHandler = async ({ player, game }, { element, value, cardId }) => {
  if (player.isReady || !game.timer.running || player.ninja.isKO) return;

  const card = player.powerCardById(Number(cardId));

  if (card.value !== Number(value) || card.element !== element) return;

  if (player.selectedMemberCard) {
    player.memberCard.remove();
    player.memberCard.selected = false;
  }

  if (player.selectedCard) {
    player.selectedCard.remove();
  }

  card.object.x = card.object.y = -1;

  player.selectedCard = card;
  player.ninja.removeTargets();
  game.grid.showAttackTiles(player);
  player.ninja.playSound(sfxName('uitargetred'), player);
}

export const frameworkCardDeselect: SnowFrameworkHandler = async ({ player, game }) => {
  if (player.isReady || !game.timer.running || !player.selectedCard) return;

  player.selectedCard.remove();
  player.selectedCard = null;
  player.ninja.showTargets();
  game.grid.showTiles(player);
}

export const frameworkMemberCardSelect: SnowFrameworkHandler = async ({ player, game }) => {
  if (!player.penguin.membership.isMember) return;

  if (player.isReady || !player.memberCard || !game.timer.running) return;

  if (player.selectedCard) {
    await player.selectedCard.remove();
    player.selectedCard = null;
  }

  await player.memberCard.place();
  player.ninja.removeTargets();
  game.grid.hideTiles(player);
}

export const frameworkMemberCardDeselect: SnowFrameworkHandler = async ({ player, game }) => {
  if (!player.penguin.membership.isMember) return;

  if (player.isReady || !player.memberCard || !game.timer.running) return;

  player.memberCard.selected = false;
  await player.memberCard.remove();

  if (player.ninja.hp > 0) {
    player.ninja.showTargets();
    game.grid.showTiles(player);
  }
}

export const frameworkCardConsumed: SnowFrameworkHandler = async ({ player }) => {
  player.powerCardSlots.delete(player.selectedCard);
  player.selectedCard = null;

  if (!player.hasPowerCards) {
    const ui = player.getWindow(Windows.UI);
    ui.sendPayload('updateStamina', { cardData: null, cycle: false, stamina: 0 });
    ui.sendPayload('noCards');
  }
}

export const frameworkConfirmClicked: SnowFrameworkHandler = async ({ player, game }) => {
  if (player.isReady) return;

  // snowflake had this named 'ui_confirm', but that doesnt seem to exist?
  const confirm = new GameObject(game, 'confirm', player.ninja.x, player.ninja.y, false, 0.5, 1.05);
  await confirm.placeObject();
  await confirm.placeSprite();
  confirm.playSound('SFX_MG_2013_CJSnow_UIPlayerReady_VBR8');

  player.getWindow(Windows.UI).sendPayload('disableCards');

  game.grid.hideTiles(player);

  player.isReady = true;

  if (!player.displayedTips.has(TipPhase.CONFIRM)) {
    player.displayedTips.add(TipPhase.CONFIRM);
  }

  if (player.tipMode && player.lastTip === TipPhase.CONFIRM) {
    player.hideTip();
  }
}

export const frameworkMute: SnowFrameworkHandler = async (ctx) => {
  ctx.player.muteSounds = true;
}

export const frameworkQuit: SnowFrameworkHandler = async (ctx) => {
  const { player } = ctx;
  console.log(`${player.penguin.name} is leaving CJ Snow`);
  await player.sendToRoom();
  player.disconnected = true;
}
