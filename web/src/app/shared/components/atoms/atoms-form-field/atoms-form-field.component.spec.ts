import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@/shared/shared.module';
import { AtomsFormFieldComponent } from './atoms-form-field.component';

@Component({
  template: `<form [formGroup]="form">
    <atoms-form-field formControlName="input"> </atoms-form-field>
  </form>`
})
class TestInputComponent {
  @ViewChild(AtomsFormFieldComponent, { static: true })
  textInputComponent: AtomsFormFieldComponent;

  form = new FormGroup({
    input: new FormControl('Test Value')
  });
}

describe('AtomsFormFieldComponent', () => {
  let component: TestInputComponent;
  let fixture: ComponentFixture<TestInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, BrowserAnimationsModule],
        declarations: [TestInputComponent, AtomsFormFieldComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
