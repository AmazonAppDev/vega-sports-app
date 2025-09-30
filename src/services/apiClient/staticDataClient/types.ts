import type { Endpoints } from '../types';

export type StaticDataStructure<T> = {
  [key in Endpoints]?: T[] | T;
};

export type StaticData<T> = {
  id?: string;
  staticData: StaticDataStructure<T>;
};

export type StaticDataRequest<T> = {
  endpoint: Endpoints;
  extras?: StaticData<T>;
};
