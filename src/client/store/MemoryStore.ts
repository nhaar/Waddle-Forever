import { BaseStore } from "./BaseStore";

const createPlainObject = <T = Record<string, unknown>>(): T => Object.create(null);

const checkValueType = (key: string, value: unknown): void => {
  const nonJsonTypes = new Set([
    'undefined',
    'symbol',
    'function',
  ]);

  const type = typeof value;

  if (nonJsonTypes.has(type)) {
    throw new TypeError(`Setting a value of type \`${type}\` for key \`${key}\` is not allowed as it's not supported by JSON`);
  }
};


export class MemoryStore<T extends Record<string, unknown>> extends BaseStore<T> {
  private store: T;

  constructor() {
    super();

    this.store = createPlainObject();
  }

  get<Key extends keyof T>(key: Key): T[Key] | undefined {
    const { store } = this;

    return key in store ? store[key] : undefined;
  }

  set<Key extends keyof T>(key: Key, value?: T[Key]): void {
    const { store } = this;

    const set = (key: string, value?: T[Key] | T | unknown): void => {
      checkValueType(key, value);


      store[key as Key] = value as T[Key];
    };

    if (typeof key === 'object') {
      const object = key;

      for (const [key, value] of Object.entries(object)) {
        set(key, value);
      }
    } else {
      set(key as string, value);
    }

    this.store = store;
  }

  has<Key extends keyof T>(key: string | Key): boolean {
    return (key as string) in this.store;
  }

  delete<Key extends keyof T>(key: Key): void {
    const { store } = this;

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete store[key];

    this.store = store;
  }

  reset<Key extends keyof T>(...keys: Key[]): void {
    for (const key of keys) {
      this.delete(key);
    }
  }

  clear(): void {
    this.reset(...Object.keys(this.store));
  }
}