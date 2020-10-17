import { Component, ChangeDetectionStrategy, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { ComponentType } from '@angular/cdk/portal';
import { DialogDataModel } from '@/shared/models/modal/dialog-data.model';
import { DialogCreateEditModel, DialogResultModel } from '@/shared/models';
import { DialogCreateEditPageModel } from '@/shared/components';
import { BaseModel } from '@/shared/models/base/base.model';

@Component({
  templateUrl: 'add-privilege-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPrivilegeDialogComponent<TDialogModel extends DialogCreateEditModel, TModel extends BaseModel>
  extends DialogCreateEditPageModel<TDialogModel, TModel>
  implements OnInit {
  privilegeGroup: FormGroup;
  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>,
    private fb: FormBuilder
  ) {
    super(dialogRef, data);
  }

  ngOnInit(): void {
    this.buildPrivilegeFormGroup();
  }

  buildPrivilegeFormGroup(): void {
    this.privilegeGroup = this.fb.group({
      keyString: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      title: new FormControl(null, [Validators.required, Validators.minLength(4)])
    });
  }

  onClose(result: boolean): void {
    this.dialogRef.close(new DialogResultModel(result, this.privilegeGroup.value));
  }
}
