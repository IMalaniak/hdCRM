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
import {
  FloatLabelType,
  MatFormField,
  MatFormFieldAppearance,
  MatFormFieldControl
} from '@angular/material/form-field';

import { ControlValidator, ERRORMESSAGE } from '@/shared/constants';

interface ErrorMessage {
  key: string;
  message: string;
}

@Component({
  selector: 'input-validation-component',
  templateUrl: './input-validation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputValidationComponent implements OnInit, OnChanges {
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() floatLabel: FloatLabelType = 'auto';
  @Input() hintAlign = 'start';
  @Input() label = '';
  @Input() inputErrors: any;
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

  errors: any = {};

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
    return this._errorMessage;
  }

  get hintMessage(): string {
    return this._hintMessage;
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
    Object.keys(this.inputErrors).forEach((key: ControlValidator) => {
      const errorMessage: ErrorMessage = this.getErrorMessage(key);
      this.errors[key] = errorMessage.message;
    });
  }

  private getErrorMessage(key: ControlValidator): ErrorMessage {
    switch (key) {
      case ControlValidator.REQUIRED:
        return { key, message: ERRORMESSAGE.IS_REQUIRED };
      case ControlValidator.MIN_LENGTH:
        return { key, message: ERRORMESSAGE.IS_TOO_SHORT };
      case ControlValidator.MAX_LENGTH:
        return { key, message: ERRORMESSAGE.IS_TOO_LONG };
      case ControlValidator.EMAIL:
        return { key, message: ERRORMESSAGE.INVALID_EMAIL };
      case ControlValidator.PATTERN:
        return { key, message: ERRORMESSAGE.IS_INVALID };
      case ControlValidator.MIN:
        return { key, message: ERRORMESSAGE.MIN_VALUE };
      case ControlValidator.MAX:
        return { key, message: ERRORMESSAGE.MAX_VALUE };
      case ControlValidator.CONFIRM_PASSWORD:
        return { key, message: ERRORMESSAGE.PASSWORD_NOT_MATCH };
      default:
        return { key, message: ERRORMESSAGE.IS_INVALID };
    }
  }

  private setErrorMessage(): void {
    if (this.canValidate) {
      const errors: any = this.inputErrors;
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
