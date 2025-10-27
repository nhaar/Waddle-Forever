// reconstruction of two lost functions from the Wilderness Expedition 2011:
// INTERFACE.adoptFreePuffle
// SHELL.ownsPuffleType

function adoptFreePuffle(type_id)
{
   var _loc5_ = getFilePath("puffle" + type_id + "_icon");
   var _loc3_ = getCoins();
   var _loc2_ = shell.getMyPuffleCount();
   var _loc6_ = getInventoryObjectById(type_id + 750);
   var _loc8_;
   var _loc4_;
   var _loc1_;
   if(_loc2_ >= shell.MAX_PUFFLES)
   {
      _loc8_ = getLocalizedString("max_puffles_prompt");
      showPrompt("warn",_loc8_);
   }
   else
   {
      setActiveShopItem(type_id);
      _loc4_ = getLocalizedString("adopt_puffle");
      _loc1_ = getLocalizedString("num_coins");
      _loc1_ = replaceString("%num%",_loc3_,_loc1_);
      _loc8_ = _loc4_ + " " + _loc1_;
      adoptPuffleName();
   }
}

function ownsPuffleType(type_id)
{
  var puffles = puffleManager._myPuffles;
  var i = 0;
  while (i < puffles.length)
  {
    var puffle = puffles[i];
    if (puffle.typeID == type_id)
    {
      return true;
    }
    i++;
  }

  return false;
}