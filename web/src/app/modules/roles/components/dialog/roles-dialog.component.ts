import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesComponent } from '../list/roles.component';
import { Role } from '../../models/role';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';

export interface RolesDialogData {
  title: string;
}
@Component({
  templateUrl: 'roles-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesDialogComponent {
  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    public dialogRef: MatDialogRef<RolesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RolesDialogData
  ) {}

  @ViewChild(RolesComponent, { static: true })
  rolesComponent: RolesComponent;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmitClick(roles: Role[]): void {
    this.dialogRef.close(roles);
  }
}
