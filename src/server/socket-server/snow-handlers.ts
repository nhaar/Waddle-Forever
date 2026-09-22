import { filePolicy } from "./handlers/login";
import { frameworkQuit, frameworkRoomToRoomComplete, frameworkScreenSize, frameworkWindowManagerReady, frameworkWindowReady, frameworkWindowClosed, handleIntroAnimDone, handleLogin, frameworkPayloadBILogAction, handlePlaceContext, handlePlaceReady, handleReady, handleVersion, frameworkElementSelected, frameworkMMCancel, frameworkRoomToRoomMinTime, handleUse, handleActionDone } from "./handlers/snow";
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
      ['/intro_anim_done', handleIntroAnimDone],
      ['/use', handleUse],
      ['/anim_done', handleActionDone],
      ['/sound_done', handleActionDone]
    ]),
    // '/framework' commands - action name is based off of 'triggerName' in json
    new Map([
      ['roomToRoomMinTime', frameworkRoomToRoomMinTime],
      ['roomToRoomComplete', frameworkRoomToRoomComplete],
      ['windowManagerReady', frameworkWindowManagerReady],
      ['windowReady', frameworkWindowReady],
      ['windowClosed', frameworkWindowClosed],
      ['screenSize', frameworkScreenSize],
      ['payloadBILogAction', frameworkPayloadBILogAction],
      ['mmElementSelected', frameworkElementSelected],
      ['mmCancel', frameworkMMCancel],
      ['quit', frameworkQuit],
      ['quitFromPayout', frameworkQuit]
    ])
  )
}