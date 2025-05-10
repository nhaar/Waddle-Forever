import express, { Express } from 'express';

import { SettingsManager } from "./settings";
import { Server } from './client';

/**
 * Creates the REST API that the client uses to communicate with the server for updating
 * its settings
 * @param s Reference to the settings manager consumed by the server
 * @param server
 */
export const setApiServer = (s: SettingsManager, server: Express, gameServers: Server[]): void => {
  const router = express.Router();

  router.use(express.json());

  const resetServers = () => {
    gameServers.forEach(s => s.reset());
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

  server.use('/settings-api', router);
}