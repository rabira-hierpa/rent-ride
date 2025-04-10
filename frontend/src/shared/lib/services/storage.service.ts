import localforage from "localforage";

export class StorageService {
  constructor() {
    localforage.createInstance({
      driver: [
        localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE,
      ],
      name: "storage",
      version: 1.0,
      storeName: "Storage",
      description: "",
    });
  }
  getItem<T>(key: string): Promise<T | null> {
    return localforage.getItem<T>(key);
  }
  getItems<T>(keys: string[]): Promise<T[]> {
    const promises = keys.map((item) => {
      return localforage.getItem<T>(item);
    });

    return Promise.all(promises).then(
      (results) =>
        // @ts-expect-error TS complains about type predicate
        results.filter((result): result is T => result !== null) as T[]
    );
  }
  setItem<T>(key: string, data: T): Promise<T> {
    return localforage.setItem<T>(key, data);
  }
  removeItem(key: string): Promise<void> {
    return localforage.removeItem(key);
  }
  keys(): Promise<string[]> {
    return localforage.keys();
  }
  clear(): Promise<void> {
    return localforage.clear();
  }
}

export const storage = new StorageService();
