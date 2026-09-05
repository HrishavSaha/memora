import { useState, useEffect } from 'react';

const PREFIX = 'memora_';

export const getStorage = (key, initialValue) => {
  const saved = localStorage.getItem(`${PREFIX}${key}`);
  if (saved !== null) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return saved;
    }
  }
  return initialValue;
};

export const setStorage = (key, value) => {
  localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
};

export const useStore = (key, initialValue) => {
  const [value, setValue] = useState(() => getStorage(key, initialValue));

  useEffect(() => {
    setStorage(key, value);
  }, [key, value]);

  return [value, setValue];
};
