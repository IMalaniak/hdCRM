import { Injectable } from '@angular/core';
import { FileTypes } from '@/shared';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private api: string;
  fileTypesMap: FileTypes = {
    msWord: ['doc', 'docx'],
    msPPoint: ['ppt', 'pptx'],
    image: ['png', 'jpg', 'jpeg', 'png', 'bmp', 'gif'],
    video: ['mp4', 'avi'],
    text: ['txt'],
    compressed: ['zip', 'rar']
  };

  constructor(private http: HttpClient) {
    this.api = '/files';
  }

  getIcon(filename: string): void {
    let icon;
    const fType = this.getExtension(filename);
    switch (true) {
      case this.isFileDoc(fType):
        icon = '-word';
        break;
      case this.isFilePPoint(fType):
        icon = '-powerpoint';
        break;
      case this.isFileImg(fType):
        icon = '-image';
        break;
      case this.isFileVideo(fType):
        icon = '-video';
        break;
      case this.isFileText(fType):
        icon = '-alt';
        break;
      case this.isFileZip(fType):
        icon = '-archive';
        break;
      default:
        icon = '';
    }
    return icon;
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
