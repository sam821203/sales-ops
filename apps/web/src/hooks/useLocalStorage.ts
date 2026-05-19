import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      // Generic deserialization: caller is responsible for T matching stored shape
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- JSON.parse returns unknown; T is trusted by caller
      return JSON.parse(item) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // ignore write errors
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

