import AsyncStorage from '@react-native-async-storage/async-storage';

import { serviceName } from './constants';
import { buildStorageKey } from './utils';

export const readStorage = async <T>(
  storageKey: string,
  onError?: (errorMessage: string) => void,
): Promise<T | undefined> => {
  try {
    const serialisedStorage = await AsyncStorage.getItem(
      buildStorageKey(storageKey),
    );

    if (!serialisedStorage) {
      return;
    }

    return JSON.parse(serialisedStorage);
  } catch (error) {
    onError?.(`${serviceName}.readStorage(): failed to read item from storage`);
  }
};

export const saveStorage = async <T>(
  storageKey: string,
  storageState: T,
  onError?: (errorMessage: string) => void,
) => {
  try {
    await AsyncStorage.setItem(
      buildStorageKey(storageKey),
      JSON.stringify(storageState),
    );
  } catch (error) {
    onError?.(`${serviceName}.saveStorage(): failed to save item to storage`);
  }
};

export const removeStorageItem = async (
  storageKey: string,
  onError?: (errorMessage: string) => void,
) => {
  try {
    await AsyncStorage.removeItem(buildStorageKey(storageKey));
  } catch (error) {
    onError?.(
      `${serviceName}.removeStorageItem(): failed to remove item from storage`,
    );
  }
};
