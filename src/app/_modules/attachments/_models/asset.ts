import { environment } from 'environments/environment';

const baseUrl = environment.baseUrl;

export class Asset {
  id: number;
  title: string;
  location: string;
  type: string;
  createdAt: string;
  updatedAt: string;

  constructor(input?: any) {
    Object.assign(this, input);
  }

  get getThumbnailsUrl(): string {
    return baseUrl + this.location + 'thumbnails/' + this.title;
  }

  get getUrl(): string {
    return baseUrl + this.location + this.title;
  }
}

export class FileTypes {
  msWord: string[];
  msPPoint: string[];
  image: string[];
  video: string[];
  text: string[];
  compressed: string[];
}
