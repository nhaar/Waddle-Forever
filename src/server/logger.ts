import dotenv from 'dotenv';
dotenv.config();
import { IS_DEV } from "@common/constants";

export const getRedString = (str: string): string => `${'\x1b[31m'}${str}${'\x1b[0m'}`;
export const getGreenString = (str: string): string => `${'\x1b[32m'}${str}${'\x1b[0m'}`;
export const getYellowString = (str: string): string => `${'\x1b[33m'}${str}${'\x1b[0m'}`;
export const getBlueString = (str: string): string => `${'\x1b[34m'}${str}${'\x1b[0m'}`;

/**
 * Used to log things in debugging
 */
export function logdebug(...args: unknown[]) {
  if (IS_DEV) {
    console.log(...args);
  }
}

export const logdebugerr = (msg: string): void => {
  logdebug(getRedString(msg));
}

export function logverbose(...args: unknown[]) {
  if (process.env.VERBOSE === 'true') {
    console.log(...args);
  }
}

/** Use this for things that should be removed before commiting */
export function templog(...args: unknown[]) {
  console.log(...args);
}