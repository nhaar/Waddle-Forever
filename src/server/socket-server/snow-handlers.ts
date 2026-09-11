import { filePolicy } from "./handlers/login";
import { XmlHandler } from "./xml-handler";

export const createSnowXmlHandler = (): XmlHandler => {
  return new XmlHandler(new Map([
    ['policy', filePolicy],
  ]))
}
