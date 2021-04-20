import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { BS_ICON, MAT_BUTTON, THEME_PALETTE } from '@shared/constants';
import { Asset } from '@shared/models';

@Component({
  selector: 'molecules-profile-pic-with-uploader',
  template: `
    <div class="picture-uploader">
      <atoms-profile-pic
        *ngIf="!changePic"
        [picture]="picture"
        (imageLoad)="changePicButtonVisible = true"
      ></atoms-profile-pic>

      <atoms-icon-button
        *ngIf="changePicButtonVisible"
        [matType]="matButtonTypes.MINI_FAB"
        [icon]="changePic ? cancelIcon : editIcon"
        [color]="changePic ? themePalette.WARN : themePalette.PRIMARY"
        (onclick)="changePic = !changePic"
      ></atoms-icon-button>

      <profile-pic-uploader-component
        *ngIf="changePic"
        [url]="apiUrl"
        (addFileCall)="onAddFile($event)"
      ></profile-pic-uploader-component>
    </div>
  `,
  styleUrls: ['./molecules-profile-pic-with-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoleculesProfilePicWithUploaderComponent {
  @Input() picture: Asset;
  @Input() apiUrl: string;

  @Output() addFileCall: EventEmitter<any> = new EventEmitter();

  themePalette = THEME_PALETTE;
  matButtonTypes = MAT_BUTTON;
  cancelIcon = BS_ICON.X;
  editIcon = BS_ICON.Pencil;

  changePic = false;
  changePicButtonVisible = false;

  onAddFile(asset: Asset): void {
    setTimeout(() => {
      this.picture = { ...asset };
      this.changePic = false;
    }, 300);

    this.addFileCall.emit(asset);
  }
}
