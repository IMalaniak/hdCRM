import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Asset, TempAddedAsset } from '@/shared/models';
import { environment } from 'environments/environment';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { getToken } from '@/core/auth/store/auth.selectors';
import { FilePond } from 'filepond';

@Component({
  selector: 'app-uploader-list',
  template: `
    <file-pond #uploader [options]="uploaderOptions"></file-pond>
  `,
  styleUrls: ['./uploader-list.component.scss']
})
export class UploaderListComponent implements OnInit {
  @ViewChild('uploader') uploader: FilePond;
  @Input() url: string;
  @Output() addFileCall: EventEmitter<any> = new EventEmitter();
  uploaderOptions: any; // TODO FilePondOptionProps
  token: string;
  tempFiles: TempAddedAsset[] = [];

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
    this.store$.pipe(select(getToken)).subscribe(token => {
      this.token = token;
    });

    this.uploaderOptions = {
      name: 'uploader',
      server: {
        url: environment.apiUrl,
        process: {
          url: this.url,
          headers: {
            Authorization: this.token
          },
          onload: res => this.uploaderHandleAddFile(res)
        }
      },
      onaddfilestart: file =>
        this.tempFiles.push({
          id: file.id,
          name: file.filename
        }),
      multiple: true,
      allowRevert: false,
      allowPaste: false,
      allowReplace: false,
      labelIdle: 'Drop files here',
      allowImagePreview: false,
      acceptedFileTypes: [
        'image/jpeg',
        'image/png',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/zip',
        'application/x-rar-compressed'
      ]
    };
  }

  uploaderHandleAddFile(data: any) {
    const asset = new Asset(JSON.parse(data));
    this.addFileCall.emit(asset);
    setTimeout(() => {
      const toRemove = this.tempFiles.find(item => {
        return item.name === asset.title;
      });
      this.uploader.removeFile(toRemove.id);
    }, 3000);
  }


}
