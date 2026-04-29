import { FileRef } from "./files";

/** A map that takes as keys a game route and as values a file reference. Works as static serving for a single point in time */
export type RouteRefMap = Record<string, FileRef>;

/** A map that takes as keys an ID number (of any kind) and values a file reference associated with the ID */
export type IdRefMap = Record<number, FileRef>;
