import { filePolicy } from "./handlers/login";
import { frameworkQuit, frameworkRoomToRoomComplete, frameworkWindowManagerReady, handleIntroAnimDone, handleLogin, handlePlaceContext, handlePlaceReady, handleReady, handleVersion } from "./handlers/snow";
import { SnowDataHandler } from "./snow-data-handler";
import { XmlHandler } from "./xml-handler";

export const createSnowXmlHandler = (): XmlHandler => {
  return new XmlHandler(new Map([
    ['policy', filePolicy]
  ]))
}

export const createSnowDataHandler = (): SnowDataHandler => {
  return new SnowDataHandler(
    new Map([
      ['/version', handleVersion],
      ['/place_context', handlePlaceContext],
      ['/login', handleLogin],
      ['/ready', handleReady],
      ['/place_ready', handlePlaceReady],
      ['/intro_anim_done', handleIntroAnimDone]
    ]),
    // /framework commands - action name is based off of 'triggerName' in json
    new Map([
      ['roomToRoomComplete', frameworkRoomToRoomComplete],
      ['windowManagerReady', frameworkWindowManagerReady],
      ['quit', frameworkQuit],
      ['quitFromPayout', frameworkQuit]
    ])
  )
}