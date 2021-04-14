import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonConstants, InputErrorConstants } from '@shared/constants';
import { SharedModule } from '@shared/shared.module';

import { InputValidationComponent } from './input-validation.component';

@Component({
  template: `<input-validation-component
    label="Test label"
    [canValidate]="true"
    [inputErrors]="control.errors"
    [hintLabel]="hintLabel"
    [hintMessage]="hintMessage"
  >
    <input matInput [formControl]="control"
  /></input-validation-component>`
})
export class TestWrapperComponent {
  @ViewChild(InputValidationComponent, { static: true }) child: InputValidationComponent;
  control = new FormControl(null);

  hintLabel: string;
  hintMessage: string;
}

describe('InputValidationComponent', () => {
  let component: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [BrowserAnimationsModule, SharedModule],
        declarations: [InputValidationComponent, TestWrapperComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should display hint message', fakeAsync(() => {
    expect(component.child.hintMessage).toBeUndefined();
    component.hintMessage = 'Test hint';
    fixture.detectChanges();
    tick();
    expect(component.child.hintMessage).toEqual('Test hint');
  }));

  it('should display hint label', fakeAsync(() => {
    expect(component.child.hintLabel).toBeUndefined();
    component.hintLabel = 'Hint label';
    fixture.detectChanges();
    tick();
    expect(component.child.hintLabel).toEqual('Hint label');
  }));

  it('should set error message', fakeAsync(() => {
    component.control.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(11)]);
    component.control.updateValueAndValidity();
    component.control.setValue(null);
    fixture.detectChanges();
    tick();
    expect(component.child.errorMessage).toEqual(InputErrorConstants.IS_REQUIRED);

    component.control.setValue('test');
    fixture.detectChanges();
    tick();
    expect(component.child.errorMessage).toEqual(InputErrorConstants.IS_TOO_SHORT);

    component.control.setValue('testtesttesttest');
    fixture.detectChanges();
    tick();
    expect(component.child.errorMessage).toEqual(InputErrorConstants.IS_TOO_LONG);

    component.control.reset();
    component.control.setValidators([Validators.email]);
    component.control.updateValueAndValidity();
    component.control.setValue('test.com');
    fixture.detectChanges();
    tick();
    expect(component.child.errorMessage).toEqual(InputErrorConstants.INVALID_EMAIL);
  }));

  it('should set error message with regex', fakeAsync(() => {
    component.control.setValidators([Validators.pattern(CommonConstants.WWW_REGEX)]);
    component.control.updateValueAndValidity();
    component.control.setValue('testtest@');
    fixture.detectChanges();
    tick();
    expect(component.child.errorMessage).toEqual(InputErrorConstants.IS_INVALID);
  }));

  it('should set error with min and max value', fakeAsync(() => {
    component.control.setValidators([Validators.min(3), Validators.max(10)]);
    component.control.updateValueAndValidity();
    component.control.setValue(1);
    fixture.detectChanges();
    tick();
    expect(component.child.errorMessage).toEqual(InputErrorConstants.MIN_VALUE);

    component.control.setValue(20);
    fixture.detectChanges();
    tick();
    expect(component.child.errorMessage).toEqual(InputErrorConstants.MAX_VALUE);
  }));
});
