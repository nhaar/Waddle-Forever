import { XtHandler } from "..";
import epfHandler from './epf';
import clothingHandler from "./clothing";

const handler = new XtHandler();

handler.use(epfHandler);
handler.use(clothingHandler);

export default handler;