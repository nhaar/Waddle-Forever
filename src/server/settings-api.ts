import express, { Express } from 'express';

import { SettingsManager } from "./settings";
import { Server } from './client';
import { Handler } from './handlers';
import db, { Databases } from './database';

/**
 * Creates the REST API that the client uses to communicate with the server for updating
 * its settings
 * @param s Reference to the settings manager consumed by the server
 * @param server
 */

type TimelineCommentsPayload = {
  dayComments: Record<string, string>;
  partyComments: Record<string, string>;
  favoriteParties: string[];
};

const sanitizeComments = (raw: unknown): Record<string, string> => {
  if (raw === null || typeof raw !== 'object') {
    return {};
  }

  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        result[key] = value;
      }
    }
  }

  return result;
};


const sanitizeFavoriteParties = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.filter((entry): entry is string => {
    return typeof entry === 'string' && entry.trim().length > 0;
  });
};

const readTimelineComments = (penguinId: number): TimelineCommentsPayload => {
  const data = db.getById<TimelineCommentsPayload>(Databases.TimelineComments, penguinId);
  if (data === undefined) {
    return { dayComments: {}, partyComments: {}, favoriteParties: [] };
  }

  return {
    dayComments: sanitizeComments(data.dayComments),
    partyComments: sanitizeComments(data.partyComments),
    favoriteParties: sanitizeFavoriteParties(data.favoriteParties)
  };
};

const saveTimelineComments = (penguinId: number, body: unknown): void => {
  const payload = body as Partial<TimelineCommentsPayload>;
  db.update<TimelineCommentsPayload>(Databases.TimelineComments, penguinId, {
    dayComments: sanitizeComments(payload.dayComments),
    partyComments: sanitizeComments(payload.partyComments),
    favoriteParties: sanitizeFavoriteParties(payload.favoriteParties)
  });
};

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


  router.get('/timeline-comments/get/:penguinId', (req, res) => {
    const penguinId = Number(req.params.penguinId);
    if (!Number.isInteger(penguinId) || penguinId <= 0) {
      res.status(400).json({ error: 'Invalid penguin id' });
      return;
    }

    res.json(readTimelineComments(penguinId));
  });

  router.post('/timeline-comments/save', (req, res) => {
    const penguinId = Number(req.body.penguinId);
    if (!Number.isInteger(penguinId) || penguinId <= 0) {
      res.status(400).json({ error: 'Invalid penguin id' });
      return;
    }

    saveTimelineComments(penguinId, req.body);
    res.sendStatus(200);
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