import AsyncStorage from '@react-native-async-storage/async-storage';

import { storageKeyPrefix } from '@AppServices/storage/constants';
import { readStorage, removeStorageItem, saveStorage } from '../DeviceStorage';

const storageKey = 'storageState';

describe('DeviceStorage service', () => {
  describe('readStorage', () => {
    it('readStorage is called with properly evaluated key', async () => {
      await readStorage(storageKey);

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        '@KeplerSportApp:storageState',
      );
    });

    it('readStorage is returning proper value', async () => {
      // return serialized value as mock result from AsyncStorage.getItem
      (AsyncStorage.getItem as jest.Mock).mockReturnValueOnce(
        '{"name":"Test user"}',
      );

      const result = await readStorage(storageKey);

      expect(result).toStrictEqual({
        name: 'Test user',
      });
    });

    it('readStorage fails on parsing serialised data', async () => {
      // passing non serialised object as mock result from AsyncStorage.getItem
      // will cause error on JSON.parse in readStorage
      (AsyncStorage.getItem as jest.Mock).mockReturnValueOnce({
        name: 'Test user',
      });

      const handleOnError = jest.fn();

      await readStorage(storageKey, handleOnError);
      expect(handleOnError).toHaveBeenCalledWith(
        'DeviceStorage.readStorage(): failed to read item from storage',
      );
    });

    it('readStorage throws error on reading item', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      const handleOnError = jest.fn();

      await readStorage(storageKey, handleOnError);
      expect(handleOnError).toHaveBeenCalledWith(
        'DeviceStorage.readStorage(): failed to read item from storage',
      );
    });
  });

  describe('saveStorage', () => {
    it('saveStorage is called with properly evaluated key and serialised object', async () => {
      const storageState = {
        name: 'Test user',
        theme: 'dark',
      };

      await saveStorage(storageKey, storageState);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@KeplerSportApp:storageState',
        JSON.stringify(storageState),
      );
    });

    it('saveStorage throws error on saving item', async () => {
      (AsyncStorage.setItem as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      const storageState = {};
      const handleOnError = jest.fn();

      await saveStorage(storageKey, storageState, handleOnError);
      expect(handleOnError).toHaveBeenCalledWith(
        'DeviceStorage.saveStorage(): failed to save item to storage',
      );
    });
  });

  describe('removeStorageItem', () => {
    it('called properly and remove item from storage', async () => {
      await removeStorageItem(storageKey);

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        `${storageKeyPrefix}:${storageKey}`,
      );
    });
  });

  it('throws error on removing item', async () => {
    (AsyncStorage.removeItem as jest.Mock).mockImplementation(() => {
      throw new Error();
    });

    const handleOnError = jest.fn();

    await removeStorageItem(storageKey, handleOnError);
    expect(handleOnError).toHaveBeenCalledWith(
      'DeviceStorage.removeStorageItem(): failed to remove item from storage',
    );
  });
});
