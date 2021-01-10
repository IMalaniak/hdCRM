import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  template: ''
})
// tslint:disable-next-line:component-class-suffix
export abstract class BaseControlValueAccessorComponentModel<T> implements ControlValueAccessor {
  @Input()
  get value(): T {
    return this._value;
  }

  set value(value: T) {
    this.writeValue(value);
  }

  @Input() set disabled(value: boolean) {
    this._isDisabled = value;
  }

  get disabled(): boolean {
    return this._isDisabled;
  }

  protected _value: T;
  propagateChange: Function = Function.prototype;
  propagateTouched: Function = Function.prototype;

  private _isDisabled: boolean;

  writeValue(value: T): void {
    if (this._value !== value) {
      this.propagateChange(value);
      this.propagateTouched();
      this._value = value;
    }
  }

  registerOnChange(fn: (_: unknown) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
