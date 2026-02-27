// frame 1

function handleUpdatePlayer(player_ob)
{
  updateGloveTransformation(player_ob);
  updatePlayer(player_ob);
}

function handleJoinRoom()
{

   var _loc1_ = SHELL.getRoomObject();
   stopMouse();
   loadRoom(_loc1_,false);
   updateGloveTransformation(SHELL.getMyPlayerObject());
}

function updateGloveTransformation(player_obj)
{

  var player_id = player_obj.player_id;
  if (player_id != SHELL.getMyPlayerId())
  {
    return;
  }
  var new_id = 0;
  switch(player_obj.hand)
  {
      // ice gloves
      case 5156:
        new_id = 50;
        break;
      // lightning gloves
      case 5157:
        new_id = 51;
        break;
      // fire gloves
      case 5158:
        new_id = 52;
        break;
  }
  if(player_obj.avatar_id != new_id)
  {
      setTimeout(function()
      {
        SHELL.setAvatarTransformation(new_id);
      }
      ,250);
  }
}

// avatar config

static function initPowerGloves()
{
  var check = new com.clubpenguin.engine.projectiles.SnowballHitCheck();
  var snowballTypes = [{type:"ballice",index:50},{type:"ballelectric",index:51},{type:"ballfire",index:52}];
  
  for (var i = 0; i < snowballTypes.length; i++)
  {
    var snowballType = snowballTypes[i];
    var avatarModel = com.clubpenguin.engine.avatar.AvatarConfig._defaultAvatarVO.clone();
    var snowballEnum = new com.clubpenguin.engine.avatar.effect.AvatarEffectEnum(com.clubpenguin.engine.avatar.effect.AvatarEffectEnum.LIB_SNOW_BALL_NAME,snowballType.type, com.clubpenguin.engine.avatar.effect.AvatarEffectEnum.FLAG_NONE);
    com.clubpenguin.engine.avatar.effect.AvatarEffectEnum["SNOW_" + snowballType.type] = snowballEnum;
    avatarModel.snowball = new com.clubpenguin.engine.projectiles.vo.SnowballVO(snowballEnum,-100,20);
    com.clubpenguin.engine.avatar.AvatarConfig._model.setSnowballHitCheck(snowballEnum,check);
    com.clubpenguin.engine.avatar.AvatarConfig._model.setAvatarData(snowballType.index,avatarModel);
  }
}

com.clubpenguin.engine.avatar.AvatarConfig.initPowerGloves();