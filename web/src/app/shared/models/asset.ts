import { TimeStamps } from './base';

export interface Asset extends TimeStamps {
  id: number;
  title: string;
  location: string;
  type: string;
}

export interface TempAddedAsset {
  id: string;
  name: string;
}
