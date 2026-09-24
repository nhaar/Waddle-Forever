import { GameData } from "@server/timelines/game-data";
import { parentPort, workerData } from "worker_threads";
import { generateBots } from "./bot-generation";

const { date, amount } = (workerData as { date: string; amount: number; });
const data = new GameData(date);
const bots = generateBots(data, amount);
parentPort.postMessage(bots);
