import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'atoms-labeled-form-field',
  template: `
    <ng-container [ngSwitch]="fType">
      <mat-form-field *ngSwitchDefault class="w-100" appearance="outline">
        <mat-label>{{ label }}</mat-label>
        <input matInput [formControl]="control" />
      </mat-form-field>

      <mat-form-field *ngSwitchCase="'select'" appearance="outline">
        <mat-label i18n="@@userСomponentTabDetailsState">State</mat-label>
        <mat-select [(ngModel)]="user.StateId" name="userState">
          <mat-option *ngFor="let state of states$ | async" [value]="state.id">{{ state.keyString }}</mat-option>
        </mat-select>
      </mat-form-field>
    </ng-container>
  `,
  styleUrls: ['./atoms-labeled-form-field.component.scss']
})
export class AtomsLabeledFormFieldComponent {
  @Input() label: string;
  @Input() fType: string;
  @Input() control: FormControl;
}
