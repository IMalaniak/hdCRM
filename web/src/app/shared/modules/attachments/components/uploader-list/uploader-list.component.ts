import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { FilePond } from 'filepond';

import { environment } from 'environments/environment';
import { AppState } from '@/core/store';
import { getToken } from '@/core/modules/auth/store/auth.selectors';
import { Asset, TempAddedAsset } from '@/shared/models';

@Component({
  selector: 'uploader-list-component',
  template: ` <file-pond #uploader [options]="uploaderOptions"></file-pond> `,
  styleUrls: ['./uploader-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploaderListComponent implements OnInit {
  @Input() url: string;

  @Output() addFileCall: EventEmitter<Asset> = new EventEmitter();

  @ViewChild('uploader') uploader: FilePond;

  uploaderOptions: any; // TODO: @IMalaniak add FilePondOptionProps
  token: string;
  tempFiles: TempAddedAsset[] = [];

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {
    this.store$.pipe(select(getToken)).subscribe((token) => {
      this.token = token;
    });
    this.setUploaderOptions();
  }

  setUploaderOptions(): void {
    this.uploaderOptions = {
      name: 'uploader',
      server: {
        url: environment.apiUrl,
        process: {
          url: this.url,
          headers: {
            Authorization: this.token
          },
          onload: (res) => this.uploaderHandleAddFile(res)
        }
      },
      onaddfilestart: (file) =>
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

  uploaderHandleAddFile(data: any): void {
    // TODO: @IMalaniak add data type
    const asset: Asset = JSON.parse(data);
    this.addFileCall.emit(asset);
    setTimeout(() => {
      const toRemove = this.tempFiles.find((item) => item.name === asset.title);
      this.uploader.removeFile(toRemove.id);
    }, 3000);
  }
}
