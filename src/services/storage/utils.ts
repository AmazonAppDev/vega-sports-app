import { storageKeyPrefix } from './constants';

export const buildStorageKey = (key: string) => `${storageKeyPrefix}:${key}`;
