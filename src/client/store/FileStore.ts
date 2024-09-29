import ElectronStore from "electron-store";
import { BaseStore } from "./BaseStore";

export class FileStore<T extends Record<string, unknown>> extends BaseStore<T> {
  private readonly store: ElectronStore<T>;

  constructor(sourceStore: ElectronStore<T>) {
    super();

    this.store = sourceStore;
  }

  get<Key extends keyof T>(key: Key): T[Key] {
    return this.store.get(key);
  }

  set<Key extends keyof T>(key: Key, value?: T[Key]): void {
    this.store.set(key, value);
  }

  has<Key extends keyof T>(key: string | Key): boolean {
    return this.store.has(key);
  }

  delete<Key extends keyof T>(key: Key): void {
    this.store.delete(key);
  }

  reset<Key extends keyof T>(...keys: Key[]): void {
    this.store.reset(...keys);
  }

  clear(): void {
    this.store.clear();
  }
}