import dotenv from 'dotenv';
dotenv.config();
import { IS_DEV } from "../common/constants";

/**
 * Used to log things in debugging
 */
export function logdebug(...args: unknown[]) {
  if (IS_DEV) {
    console.log(...args);
  }
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