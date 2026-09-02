import { checkVersion, filePolicy, getKey, login } from "./handlers/login";
import { XmlHandler } from "./xml-handler";

export const createLoginXmlHandler = (): XmlHandler => {
  return new XmlHandler(new Map([
    ['policy', filePolicy],
    ['verChk', checkVersion],
    ['rndK', getKey],
    ['login', login]
  ]))
}