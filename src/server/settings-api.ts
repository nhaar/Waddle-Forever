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

  const resetServers = () => {
    gameServer.reset();
  }

  router.post('/update', (req, res) => {
    s.updateSettings(req.body);
    res.sendStatus(200);
    resetServers();
  });

  router.get('/get', (_, res) => {
    res.json(s.settings);
  });

  router.post('/mod/update', (req, res) => {
    const { name, active } = req.body;
    if (active) {
      s.setModActive(name);
    } else {
      s.setModInactive(name);
    }
    res.sendStatus(200);
    resetServers();
  });

  router.get('/mod/get', (_, res) => {
    const activeMods = s.activeMods;
    const mods = s.getMods();
    const modsRelation: Record<string, boolean> = {};
    for (const mod of mods) {
      modsRelation[mod] = activeMods.includes(mod);
    }
    res.json(modsRelation);
  });

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