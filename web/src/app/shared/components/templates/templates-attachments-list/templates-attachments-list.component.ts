import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { AttachmentService } from '@/shared/modules/attachments/services';
import { Asset } from '@/shared/models';
import { Observable } from 'rxjs/internal/Observable';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';
import { getGoogleDriveIntegrationState } from '@/core/reducers/integration.selectors';
import { toggleGoogleDriveIntegration } from '@/core/reducers/integration.actions';
import { COLUMN_NAMES, COLUMN_LABELS, ACTION_LABELS, THEME_PALETTE, MAT_BUTTON } from '@/shared/constants';

@Component({
  selector: 'templates-attachments-list',
  templateUrl: './templates-attachments-list.component.html',
  styleUrls: ['./templates-attachments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesAttachmentsListComponent {
  googleDriveIntegrationState$: Observable<boolean> = this.store$.pipe(select(getGoogleDriveIntegrationState));

  @Input() apiUrl: string;
  @Input() attachments: Asset[];
  @Input() canAdd: boolean;
  @Input() canDelete: boolean;

  @Output() deleteFileCall: EventEmitter<any> = new EventEmitter();
  @Output() addFileCall: EventEmitter<any> = new EventEmitter();

  uploaderVisible = false;

  themePalette = THEME_PALETTE;
  matButtonTypes = MAT_BUTTON;
  columns = COLUMN_NAMES;
  columnLabels = COLUMN_LABELS;
  actionLabels = ACTION_LABELS;
  displayedColumns: COLUMN_NAMES[] = [
    COLUMN_NAMES.ICON,
    COLUMN_NAMES.TITLE,
    COLUMN_NAMES.TYPE,
    COLUMN_NAMES.CREATED_AT,
    COLUMN_NAMES.UPDATED_AT,
    COLUMN_NAMES.ACTIONS
  ];

  constructor(private store$: Store<AppState>, private attachmentService: AttachmentService) {}

  onClickAddFiles(): void {
    this.uploaderVisible = true;
  }

  onClickAddFilesDone(): void {
    this.uploaderVisible = false;
  }

  fileTypeIcon(file: string): string {
    return `file${this.attachmentService.getIcon(file)}`;
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
