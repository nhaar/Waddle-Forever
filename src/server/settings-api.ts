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

  router.get('/players', (_, res) => {
    res.json(gameServer.getAllPlayersInfo());
  });

  router.post('/command', (req, res) => {
    const { id, command } = req.body;
    if (typeof id !== 'number' || typeof command !== 'string') {
      res.send(400);
    }

    const client = gameServer.getPlayerById(id);
    if (client !== undefined) {
      gameHandler.runCommand(client, command);
    }

    res.sendStatus(200);
  })

  server.use('/settings-api', router);
}