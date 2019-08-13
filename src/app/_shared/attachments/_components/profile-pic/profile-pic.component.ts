import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FilePondOptions, FilePondInstance } from 'filepond';
import { environment } from 'environments/environment';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { getToken } from '@/core/auth/store/auth.selectors';
import { Asset } from '../../_models';

@Component({
  selector: 'app-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.scss']
})
export class ProfilepicComponent implements OnInit {
  @ViewChild('picuploader', { static: false }) picuploader: FilePondInstance;
  @Input() avatar: Asset;
  @Input() apiUrl: string;
  @Output() addFileCall: EventEmitter<any> = new EventEmitter();
  changePic: boolean;
  // TODO: init filepond on changePic
  uploaderOptions: FilePondOptions;
  token: string;

  constructor(
    private store$: Store<AppState>
  ) {  }

  ngOnInit() {
    this.store$.pipe(select(getToken)).subscribe(token => {
      this.token = token;
    });

    this.uploaderOptions = {
      name: 'profile-pic-uploader',
      server: {
        url: environment.baseUrl,
        process: {
          url: this.apiUrl,
          headers: {
            'Authorization': this.token
          },
          onload: (res) => this.uploaderHandleAddFile(res)
        },
        revert: {
          url: this.apiUrl,
          method: 'DELETE',
          headers: {
            'Authorization': this.token
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
