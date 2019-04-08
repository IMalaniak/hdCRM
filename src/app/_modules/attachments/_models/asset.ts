export class Asset {
  id: number;
  title: string;
  location: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export class FileTypes {
  msWord: string[];
  msPPoint: string[];
  image: string[];
  video: string[];
  text: string[];
  compressed: string[];
}
