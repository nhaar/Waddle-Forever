import { TemporaryChange } from "./changes";
import { FileRef } from "./files";

/**
 * Represents a valid migrator visit. `true` means that a visit happens but the catalog is not updated,
 * if the catalog is updated, the catalog's file is listed
 * */
export type MigratorVisit = true | FileRef;

type StandaloneMigratorVisits = TemporaryChange<MigratorVisit>[];

export const STANDALONE_MIGRATOR_VISITS: StandaloneMigratorVisits = [
];