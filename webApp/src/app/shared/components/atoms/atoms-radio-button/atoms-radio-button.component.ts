import { Component, Input } from '@angular/core';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MoleculesRadioButtonGroupComponent } from '../../molecules';

@Component({
  selector: 'atoms-radio-button',
  template: `
    <mat-radio-button
      id="id"
      labelPosition="labelPosition"
      [color]="color"
      [ngClass]="[radioClass]"
      [value]="value"
      [checked]="isChecked"
      [disabled]="disabled"
      [required]="required"
      (click)="onClick()"
      (change)="onRadioChange($event)"
      ><span [ngClass]="labelClass">{{ labelTxt }}</span> <ng-content></ng-content
    ></mat-radio-button>
  `,
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'accent' }
    }
  ]
})
export class AtomsRadioButtonComponent extends MoleculesRadioButtonGroupComponent {
  @Input() id: string;
  @Input() labelTxt: string;
  @Input() labelClass = '';
  @Input() radioClass = '';
  @Input() disableRipple = false;

  @Input()
  set isChecked(checked: boolean) {
    this._isChecked = checked;
  }

  _isChecked: boolean;

  get isChecked(): boolean {
    return this._isChecked;
  }
}
