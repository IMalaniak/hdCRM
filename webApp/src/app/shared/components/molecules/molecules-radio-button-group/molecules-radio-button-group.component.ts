import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'molecules-radio-button-group',
  template: `
    <mat-radio-group
      name="name"
      [disabled]="disabled"
      [required]="required"
      color="color"
      [value]="value"
      (click)="onClick()"
      (change)="onRadioChange($event)"
    >
      <atoms-radio-button
        *ngFor="let item of items"
        color="color"
        labelPosition="labelPosition"
        [labelTxt]="bindLabel"
        [checked]="true"
        [required]="required"
        [disabled]="disabled"
      ></atoms-radio-button>
    </mat-radio-group>
  `,
  styleUrls: ['./molecules-radio-button-group.component.scss']
})
export class MoleculesRadioButtonGroupComponent implements OnInit {
  @Input() items: any[];
  @Input() bindLabel: any; //
  @Input() bindValue: any; //
  @Input() disabled = false;
  @Input() required = false;
  @Input() color: ThemePalette;
  @Input() labelPosition: 'before' | 'after' = 'after';
  // @Input() selected: T;

  @Input()
  set name(name: string) {
    this._name = name;
  }
  @Input()
  set value(value: any) {
    this._value = value;
  }

  @Output() onclick = new EventEmitter();
  @Output() onchange = new EventEmitter<MatRadioChange>();

  _value: any;
  private _name: string;

  constructor() {}

  ngOnInit(): void {}

  onClick(): void {
    // check if needed
    if (!this.disabled) {
      this.onclick.emit(this.value);
      console.log('onClickMethod', this.value);
    }
  }

  onRadioChange(event: MatRadioChange): void {
    this.onchange.emit(event);
    // Change events are only emitted when the value changes due to user interaction
  }

  get value(): any {
    return this._value;
  }

  get name(): string {
    return this._name;
  }
}
