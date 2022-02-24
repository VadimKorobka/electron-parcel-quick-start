import { Store, StoreFields } from "./types";

const persistStore = {
  get: <T extends StoreFields>(key: T): Store[T] => {
    try {
      const value: Store[T] = JSON.parse(localStorage.getItem(key));
      if (!Array.isArray(value)) {
        throw new Error(`Store does not contain an array of: ${key}`);
      }
      return value;
    } catch (error) {
      return [] as Store[T];
    }
  },
  set: <T extends StoreFields>(key: T, value: Store[T]): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

export default persistStore;
