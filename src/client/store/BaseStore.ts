export abstract class BaseStore<T extends Record<string, unknown>> {
  abstract get<Key extends keyof T>(key: Key): T[Key] | undefined;

  abstract set<Key extends keyof T>(key: Key, value?: T[Key]): void;

  abstract has<Key extends keyof T>(key: Key | string): boolean;

  abstract reset<Key extends keyof T>(...keys: Key[]): void;

  abstract delete<Key extends keyof T>(key: Key): void;

  abstract clear(): void;
}