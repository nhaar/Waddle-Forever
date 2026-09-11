import { PenguinMessenger } from "../messenger";
import { ClientSocket } from "@server/socket-server/socket-server";
import { getDefaultPenguin } from "@server/database/database";
import { logdebug } from "@server/logger";
import { WorldPenguin } from "@server/socket-server/world/world-penguin";
import serverList, { getServerPopulation } from "@server/servers";
import { LoginContext } from "@server/socket-server/xml-handler";


type LoginHandler = (ctx: LoginContext, message: string) => void;

export const login: LoginHandler = async (ctx, message: string) => {
  const { msg, data, settings, db, client } = ctx;
}