import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Asset } from '@/shared/models';

@Component({
  selector: 'molecules-profile-pic-with-uploader',
  template: `
    <div class="avatar-uploader">
      <atoms-profile-pic *ngIf="!changePic" [avatar]="avatar"></atoms-profile-pic>

      <atoms-icon-button
        matType="mini-fab"
        [icon]="changePic ? ['fas', 'times'] : ['fas', 'pencil-alt']"
        [color]="changePic ? 'warn' : 'primary'"
        (onclick)="changePic = !changePic"
      ></atoms-icon-button>

      <app-profile-pic-uploader
        *ngIf="changePic"
        [url]="apiUrl"
        (addFileCall)="onAddFile($event)"
      ></app-profile-pic-uploader>
    </div>
  `,
  styleUrls: ['./molecules-profile-pic-with-uploader.component.scss']
})
export class MoleculesProfilePicWithUploaderComponent {
  @Input() avatar: Asset;
  @Input() apiUrl: string;

  @Output() addFileCall: EventEmitter<any> = new EventEmitter();

  changePic = false;

  onAddFile(asset: Asset): void {
    setTimeout(() => {
      this.avatar = { ...asset };
      this.changePic = false;
    }, 300);

    this.addFileCall.emit(asset);
  }
}
