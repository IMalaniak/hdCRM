import { NgControl } from '@angular/forms';

import { TrimInputDirective } from './trim-input.directive';

describe('TrimInputDirective', () => {
  // tslint:disable-next-line:prefer-const
  let control: NgControl;

  it('should create an instance', () => {
    const directive = new TrimInputDirective(control);
    expect(directive).toBeTruthy();
  });

  // TODO: add test cases
});
