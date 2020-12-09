import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[trimInput], textarea[trimInput]'
})
export class TrimInputDirective {
  constructor(private readonly _ngControl: NgControl) {}

  @HostListener('blur', ['$event']) blur(): void {
    if (this._ngControl && this._ngControl.control) {
      this.transformValue(this._ngControl.control.value || '');
    }
  }

  transformValue(newValue: string): void {
    const _value = newValue.replace(/\s+/g, ' ').trim();

    if (_value !== newValue) {
      this._ngControl.control?.setValue(_value);
    }
  }
}
