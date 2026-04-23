import express, { Express } from 'express';

import { SettingsManager } from "./settings";
import { ModItemsError, ModManager } from './mods';
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
    const reset = req.body.reset ?? false;
    s.updateSettings(req.body.settings);
    res.sendStatus(200);
    if (reset) resetServers();
  });

  router.get('/get', (_, res) => {
    res.json(s.settings);
  });

  router.post('/mod/update', (req, res) => {
    const { name, active } = req.body;
    if (active) {
      // if the mod has issues, it will be raised and the response will warn the user back
      try {
        ModManager.loadCustomItems(name);
        s.mods.setModActive(name);
      } catch (error) {
        if (error instanceof ModItemsError) {
          res.status(400).send(error.message);
          return;
        } else {
          throw error;
        }
      }
    } else {
      ModManager.unloadCustomItems(name);
      s.mods.setModInactive(name);
    }
    res.sendStatus(200);
    resetServers();
  });

  router.get('/mod/get', (_, res) => {
    const mods = s.mods.getMods();
    const modsRelation: Record<string, boolean> = {};
    for (const mod of mods) {
      modsRelation[mod] = s.mods.isModActive(mod);
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