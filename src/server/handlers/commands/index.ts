import { XtHandler } from "..";
import epfHandler from './epf';

const handler = new XtHandler();

handler.use(epfHandler);

export default handler;