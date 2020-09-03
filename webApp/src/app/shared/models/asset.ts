export interface Asset {
  id: number;
  title: string;
  location: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileTypes {
  msWord: string[];
  msPPoint: string[];
  image: string[];
  video: string[];
  text: string[];
  compressed: string[];
}

export interface TempAddedAsset {
  id: string;
  name: string;
}
