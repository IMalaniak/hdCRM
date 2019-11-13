import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Asset, TempAddedAsset } from '../../_models';
import { AttachmentService } from '../../_services';
import { environment } from 'environments/environment';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { getToken } from '@/core/auth/store/auth.selectors';
import { FilePond, FilePondOptionProps } from 'filepond';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {
  @ViewChild('uploader', { static: false }) uploader: FilePond;
  @Input() attachments: Asset[];
  @Input() apiUrl: string;
  @Input() editForm: boolean;
  @Output() deleteFileCall: EventEmitter<any> = new EventEmitter();
  @Output() addFileCall: EventEmitter<any> = new EventEmitter();
  displayedColumns: string[] = ['icon', 'title', 'type', 'createdAt', 'updatedAt', 'actions'];
  uploaderOptions: any; // TODO FilePondOptionProps
  token: string;
  tempFiles: TempAddedAsset[] = [];
  uploaderVisible = false;

  constructor(private attachmentService: AttachmentService, private store$: Store<AppState>) {}

  ngOnInit() {
    if (!this.attachments) {
      this.attachments = [];
    }

    this.store$.pipe(select(getToken)).subscribe(token => {
      this.token = token;
    });

    this.uploaderOptions = {
      name: 'uploader',
      server: {
        url: environment.baseUrl,
        process: {
          url: this.apiUrl,
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

  fileTypeIcon(file: string): string {
    return `file${this.attachmentService.getIcon(file)}`;
  }

  downloadFile(fileId: number, filename: string = null): void {
    this.attachmentService.download(fileId).subscribe((response: any) => {
      console.log(response);
      const dataType = response.type;
      const binaryData = [];
      binaryData.push(response);
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      if (filename) {
        downloadLink.setAttribute('download', filename);
      }
      downloadLink.setAttribute('target', '_blank');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    });
  }

  handleDeleteFile(id: number): void {
    this.deleteFileCall.emit(id);
  }

  onClickAddFiles(): void {
    this.uploaderVisible = true;
  }

  onClickAddFilesDone(): void {
    this.uploaderVisible = false;
  }
}
