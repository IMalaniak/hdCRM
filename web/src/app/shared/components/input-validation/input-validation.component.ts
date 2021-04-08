import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
  FloatLabelType,
  MatFormField,
  MatFormFieldAppearance,
  MatFormFieldControl
} from '@angular/material/form-field';

import { VALIDATE_CONTROL, INPUT_ERROR } from '@/shared/constants';

interface ErrorMessage {
  key: string;
  message: string;
}

@Component({
  selector: 'input-validation-component',
  templateUrl: './input-validation.component.html',
  styles: [
    `
      .mat-form-field {
        width: 100% !important;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputValidationComponent implements OnInit, OnChanges {
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() floatLabel: FloatLabelType = 'auto';
  @Input() label = '';
  @Input() inputErrors: ValidationErrors;
  @Input() hintLabel = '';
  @Input() canValidate: boolean;
  @Input() wrapperClass = 'w-100';
  @Input()
  set hintMessage(value: string) {
    setTimeout(() => {
      this._hintMessage = value;
      if (!(this._cdr as any)['destroyed']) {
        this._cdr.detectChanges();
      }
    });
  }

  @ContentChild(MatFormFieldControl, { static: true }) private _control: MatFormFieldControl<any>;
  @ViewChild(MatFormField, { static: true }) private _matFormField: MatFormField;

  errors: { [key: string]: string } = {};

  private _errorMessage = '';
  private _hintMessage = '';

  set errorMessage(value: string) {
    setTimeout(() => {
      this._errorMessage = value;
      if (!(this._cdr as any)['destroyed']) {
        this._cdr.detectChanges();
      }
    });
  }

  get errorMessage(): string {
    if (this._errorMessage) {
      return this._errorMessage;
    }
  }

  get hintMessage(): string {
    if (this._hintMessage) {
      return this._hintMessage;
    }
  }

  constructor(private readonly _cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    if (this.inputErrors) {
      this.handleError();
      this.setErrorMessage();
    }
  }

  ngOnInit(): void {
    if (this._control) {
      this._matFormField._control = this._control;
    }
  }

  private handleError(): void {
    Object.keys(this.inputErrors).forEach((key: VALIDATE_CONTROL) => {
      const errorMessage: ErrorMessage = this.getErrorMessage(key);
      this.errors[key] = errorMessage.message;
    });
  }

  private getErrorMessage(key: VALIDATE_CONTROL): ErrorMessage {
    switch (key) {
      case VALIDATE_CONTROL.REQUIRED:
        return { key, message: INPUT_ERROR.IS_REQUIRED };
      case VALIDATE_CONTROL.MIN_LENGTH:
        return { key, message: INPUT_ERROR.IS_TOO_SHORT };
      case VALIDATE_CONTROL.MAX_LENGTH:
        return { key, message: INPUT_ERROR.IS_TOO_LONG };
      case VALIDATE_CONTROL.EMAIL:
        return { key, message: INPUT_ERROR.INVALID_EMAIL };
      case VALIDATE_CONTROL.PATTERN:
        return { key, message: INPUT_ERROR.IS_INVALID };
      case VALIDATE_CONTROL.MIN:
        return { key, message: INPUT_ERROR.MIN_VALUE };
      case VALIDATE_CONTROL.MAX:
        return { key, message: INPUT_ERROR.MAX_VALUE };
      case VALIDATE_CONTROL.CONFIRM_PASSWORD:
        return { key, message: INPUT_ERROR.PASSWORD_NOT_MATCH };
      default:
        return { key, message: INPUT_ERROR.IS_INVALID };
    }
  }

  private setErrorMessage(): void {
    if (this.canValidate) {
      const errors: ValidationErrors = this.inputErrors;
      if (errors) {
        Object.keys(this.errors).some((key): boolean => {
          if (errors[key]) {
            this.errorMessage = this.errors[key];
            return true;
          }

          return false;
        });
      }
    }
  }
}
