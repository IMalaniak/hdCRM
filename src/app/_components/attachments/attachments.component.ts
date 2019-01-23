import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { Asset, FileTypes } from '@/_models';
import { TranslationsService } from '@/_services';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AttachmentsComponent implements OnInit {
  // @ViewChild('myPond') myPond: any;
  @Input() attachments: Asset[];
  @Input() editForm: boolean;
  @Output() deleteFileCall: EventEmitter<any> = new EventEmitter();
  allowedFileTypesMap: FileTypes;
  translations: Object;

  // pondOptions = {
  //   class: 'my-filepond',
  //   multiple: true,
  //   labelIdle: 'Drop files here',
  //   acceptedFileTypes: 'image/jpeg, image/png'
  // };

  // pondHandleInit() {
  //   console.log('FilePond has initialised', this.myPond);
  // }

  // pondHandleAddFile(event: any) {
  //   console.log('A file was added', event);
  // }

  constructor(
    private translationsService: TranslationsService
  ) { }

  ngOnInit() {
    if (!this.attachments) {
      this.attachments = [];
    }
    this.translationsService.getTranslations([
      'ATTACHMENTSCOMPONENT.FilePond.labelIdle',
    ]).subscribe((translations: string[]) => {
      this.translations = translations;
    });
    this.allowedFileTypesMap = {
      msWord: ['doc', 'docx'],
      msPPoint: ['ppt', 'pptx'],
      image: ['png', 'jpg', 'jpeg', 'png', 'bmp', 'gif'],
      video: ['mp4', 'avi'],
      text: ['txt'],
      compressed: ['zip', 'rar']
    };
  }

  getIcon(filename): void {
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

  getExtension(filename): string {
    const parts = filename.split('.');
    return parts[parts.length - 1].toLowerCase();
  }

  isFileDoc(fType): boolean {
    return this.allowedFileTypesMap.msWord.indexOf(fType) >= 0;
  }

  isFilePPoint(fType): boolean {
    return this.allowedFileTypesMap.msPPoint.indexOf(fType) >= 0;
  }

  isFileImg(fType): boolean {
    return this.allowedFileTypesMap.image.indexOf(fType) >= 0;
  }

  isFileVideo(fType): boolean {
    return this.allowedFileTypesMap.video.indexOf(fType) >= 0;
  }

  isFileText(fType): boolean {
    return this.allowedFileTypesMap.text.indexOf(fType) >= 0;
  }

  isFileZip(fType): boolean {
    return this.allowedFileTypesMap.compressed.indexOf(fType) >= 0;
  }

  handleDeleteFile(id: number): void {
    this.deleteFileCall.emit(id);
  }

}
