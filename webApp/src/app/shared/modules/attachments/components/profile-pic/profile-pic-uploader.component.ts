import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { getToken } from '@/core/auth/store/auth.selectors';
import { Asset } from '@/shared/models';
import { FilePond } from 'filepond';

@Component({
  selector: 'app-profile-pic-uploader',
  template: `
    <file-pond #picuploader [options]="uploaderOptions"></file-pond>
  `
})
export class ProfilepicUploaderComponent implements OnInit {
  @ViewChild('picuploader') picuploader: FilePond;
  @Input() url: string;
  @Output() addFileCall: EventEmitter<any> = new EventEmitter();
  uploaderOptions: any; // TODO: FilePondOptionProps;
  token: string;

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
    this.store$.pipe(select(getToken)).subscribe(token => {
      this.token = token;
    });

    this.uploaderOptions = {
      name: 'profile-pic-uploader',
      server: {
        url: environment.apiUrl,
        process: {
          url: this.url,
          headers: {
            Authorization: this.token
          },
          onload: res => this.uploaderHandleAddFile(res)
        },
        revert: {
          url: this.url,
          method: 'DELETE',
          headers: {
            Authorization: this.token
          }
        }
      },
      multiple: false,
      allowPaste: false,
      labelIdle: `Drag & Drop your picture or <span class="filepond--label-action">Browse</span>`,
      imageCropAspectRatio: '1:1',
      imagePreviewHeight: 300,
      imageResizeTargetWidth: 300,
      imageResizeTargetHeight: 300,
      stylePanelLayout: 'compact circle',
      styleLoadIndicatorPosition: 'center bottom',
      styleProgressIndicatorPosition: 'center bottom',
      styleButtonProcessItemPosition: 'center bottom',
      styleButtonRemoveItemPosition: 'center bottom',
      acceptedFileTypes: ['image/jpeg', 'image/png']
    };
  }

  uploaderHandleAddFile(data: any) {
    const asset = new Asset(JSON.parse(data));
    this.addFileCall.emit(asset);
  }
}
