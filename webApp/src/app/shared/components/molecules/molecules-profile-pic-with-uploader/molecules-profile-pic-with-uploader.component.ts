import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Asset } from '@/shared/models';

@Component({
  selector: 'molecules-profile-pic-with-uploader',
  template: `
    <div class="img-avatar d-flex justify-content-center align-items-center">
      <atoms-profile-pic *ngIf="!changePic" [avatar]="avatar"></atoms-profile-pic>
      <div class="pencil" [ngClass]="{ cancel: changePic }" (click)="changePic = !changePic">
        <fa-icon *ngIf="!changePic" [icon]="['fas', 'pencil-alt']"></fa-icon>
        <fa-icon *ngIf="changePic" [icon]="['fas', 'times']"></fa-icon>
      </div>
      <app-profile-pic-uploader *ngIf="changePic" [url]="apiUrl" (addFileCall)="onAddFile($event)"></app-profile-pic-uploader>
    </div>
  `,
  styleUrls: ['./molecules-profile-pic-with-uploader.component.scss']
})
export class MoleculesProfilePicWithUploaderComponent {
  @Input() avatar: Asset;
  @Input() apiUrl: string;
  @Output() addFileCall: EventEmitter<any> = new EventEmitter();

  changePic = false;

  constructor() {}

  onAddFile(asset: Asset): void {
    setTimeout(() => {
      this.changePic = false;
    }, 300);
    this.addFileCall.emit(asset);
  }
}
