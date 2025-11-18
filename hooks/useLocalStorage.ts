import { useState, useEffect, SetStateAction } from 'react';

function useLocalStorage<T>(key: string | null, initialValue: T): [T, (value: SetStateAction<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (key === null) {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: SetStateAction<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (key !== null) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // If the key is null (e.g., user logged out), reset the state to initialValue.
    if (key === null) {
      setStoredValue(initialValue);
      return;
    }

    try {
      const item = window.localStorage.getItem(key);
      // When a user logs in, this effect runs. If they have existing data, parse it.
      // If not, set state to initialValue, which is correct for a new session.
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.log(error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);


  return [storedValue, setValue];
}

export default useLocalStorage;