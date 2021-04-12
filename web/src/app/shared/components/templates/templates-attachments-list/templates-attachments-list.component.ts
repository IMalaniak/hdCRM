import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { AppState } from '@/core/store';
import { getGoogleDriveIntegrationState, toggleGoogleDriveIntegration } from '@/core/store/integration';
import { IconsService } from '@/core/services';
import { AttachmentService } from '@/shared/modules/attachments/services';
import { Asset } from '@/shared/models';
import { COLUMN_KEY, COLUMN_LABEL, ACTION_LABEL, THEME_PALETTE, MAT_BUTTON, BS_ICON } from '@/shared/constants';

@Component({
  selector: 'templates-attachments-list',
  templateUrl: './templates-attachments-list.component.html',
  styleUrls: ['./templates-attachments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesAttachmentsListComponent {
  @Input() apiUrl: string;
  @Input() attachments: Asset[];
  @Input() canAdd: boolean;
  @Input() canDelete: boolean;

  @Output() deleteFileCall: EventEmitter<any> = new EventEmitter();
  @Output() addFileCall: EventEmitter<any> = new EventEmitter();

  googleDriveIntegrationState$: Observable<boolean> = this.store$.pipe(select(getGoogleDriveIntegrationState));

  uploaderVisible = false;

  themePalette = THEME_PALETTE;
  matButtonTypes = MAT_BUTTON;
  columns = COLUMN_KEY;
  columnLabels = COLUMN_LABEL;
  actionLabels = ACTION_LABEL;
  displayedColumns: COLUMN_KEY[] = [
    COLUMN_KEY.ICON,
    COLUMN_KEY.TITLE,
    COLUMN_KEY.TYPE,
    COLUMN_KEY.CREATED_AT,
    COLUMN_KEY.UPDATED_AT,
    COLUMN_KEY.ACTIONS
  ];
  listIcons: { [key: string]: BS_ICON } = {
    remove: BS_ICON.Trash,
    done: BS_ICON.Check,
    add: BS_ICON.FileEarmarkPlus
  };

  constructor(
    private store$: Store<AppState>,
    private attachmentService: AttachmentService,
    private readonly iconsService: IconsService
  ) {
    this.iconsService.registerIcons([
      BS_ICON.FileEarmarkPlus,
      BS_ICON.FileEarmarkWord,
      BS_ICON.FileEarmarkPpt,
      BS_ICON.FileEarmarkImage,
      BS_ICON.FileEarmarkPlay,
      BS_ICON.FileEarmarkText,
      BS_ICON.FileEarmarkZip,
      BS_ICON.FileEarmark
    ]);
  }

  onClickAddFiles(): void {
    this.uploaderVisible = true;
  }

  onClickAddFilesDone(): void {
    this.uploaderVisible = false;
  }

  fileTypeIcon(file: string): BS_ICON {
    return this.attachmentService.getIcon(file);
  }

  downloadFile(fileId: number, filename: string = null): void {
    this.attachmentService.download(fileId).subscribe((response: any) => {
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

  handleAddFile(asset: Asset): void {
    this.addFileCall.emit(asset);
  }

  handleDeleteFile(id: number): void {
    this.deleteFileCall.emit(id);
  }

  enableGoogleDriveIntegration(): void {
    this.store$.dispatch(toggleGoogleDriveIntegration());
  }
}
