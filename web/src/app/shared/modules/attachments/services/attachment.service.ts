import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FileTypes } from '@/shared/models';
import { BS_ICONS } from '@/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private api = '/files';
  fileTypesMap: FileTypes = {
    msWord: ['doc', 'docx'],
    msPPoint: ['ppt', 'pptx'],
    image: ['png', 'jpg', 'jpeg', 'png', 'bmp', 'gif'],
    video: ['mp4', 'avi'],
    text: ['txt'],
    compressed: ['zip', 'rar']
  };

  constructor(private http: HttpClient) {}

  getIcon(filename: string): BS_ICONS {
    const fType = this.getExtension(filename);

    if (this.isFileDoc(fType)) {
      return BS_ICONS.FileEarmarkWord;
    }
    if (this.isFilePPoint(fType)) {
      return BS_ICONS.FileEarmarkPpt;
    }
    if (this.isFileImg(fType)) {
      return BS_ICONS.FileEarmarkImage;
    }
    if (this.isFileVideo(fType)) {
      return BS_ICONS.FileEarmarkPlay;
    }
    if (this.isFileText(fType)) {
      return BS_ICONS.FileEarmarkText;
    }
    if (this.isFileZip(fType)) {
      return BS_ICONS.FileEarmarkZip;
    }

    return BS_ICONS.FileEarmark;
  }

  getExtension(filename: string): string {
    const parts = filename.split('.');
    return parts[parts.length - 1].toLowerCase();
  }

  isFileDoc(fType: string): boolean {
    return this.fileTypesMap.msWord.indexOf(fType) >= 0;
  }

  isFilePPoint(fType: string): boolean {
    return this.fileTypesMap.msPPoint.indexOf(fType) >= 0;
  }

  isFileImg(fType: string): boolean {
    return this.fileTypesMap.image.indexOf(fType) >= 0;
  }

  isFileVideo(fType: string): boolean {
    return this.fileTypesMap.video.indexOf(fType) >= 0;
  }

  isFileText(fType: string): boolean {
    return this.fileTypesMap.text.indexOf(fType) >= 0;
  }

  isFileZip(fType: string): boolean {
    return this.fileTypesMap.compressed.indexOf(fType) >= 0;
  }

  download(id: number): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        observe: 'response'
      }),
      responseType: 'blob' as 'json'
    };
    return this.http.get(`${this.api}/download/${id}`, options);
  }
}
