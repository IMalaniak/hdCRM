import { ChangeDetectionStrategy, Component, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';

import { BaseControlValueAccessorComponentModel } from '../../base/componentModels';
import { THEME_PALETTE } from '@/shared/constants';

@Component({
  selector: 'atoms-checkbox',
  template: `
    <mat-checkbox [formControl]="ngControl.control" [color]="color" (change)="onChange.emit($event)">
      {{ label }}
    </mat-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: AtomsCheckboxComponent }]
})
export class AtomsCheckboxComponent extends BaseControlValueAccessorComponentModel<boolean> {
  @Input() color: ThemePalette = THEME_PALETTE.ACCENT;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange: EventEmitter<MatCheckboxChange> = new EventEmitter();

  constructor(@Optional() @Self() readonly ngControl: NgControl) {
    super();

    this.ngControl.valueAccessor = this;
  }
}
