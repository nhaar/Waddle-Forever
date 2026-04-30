import express, { Express } from 'express';

import { SettingsManager } from "./settings";
import { Server } from './client';
import { Handler } from './handlers';

/**
 * Creates the REST API that the client uses to communicate with the server for updating
 * its settings
 * @param s Reference to the settings manager consumed by the server
 * @param server
 */
export const setApiServer = (s: SettingsManager, server: Express, gameServer: Server, gameHandler: Handler): void => {
  const router = express.Router();

  router.use(express.json());

  server.use('/settings-api', router);
}