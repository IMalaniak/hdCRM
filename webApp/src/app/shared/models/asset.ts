// import { environment } from 'environments/environment';

// const baseUrl = environment.baseUrl;

export interface Asset {
  id: number;
  title: string;
  location: string;
  type: string;
  createdAt: string;
  updatedAt: string;

  // get getThumbnailsUrl(): string {
  //   return baseUrl + this.location + '/thumbnails/' + this.title;
  // }

  // get getUrl(): string {
  //   return baseUrl + this.location + '/' + this.title;
  // }

  // get downloadLink(): string {
  //   return `${baseUrl}/files/download/${this.id}`;
  // }
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
