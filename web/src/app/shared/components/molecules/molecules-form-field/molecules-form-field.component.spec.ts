import { Component, ViewChild } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { MoleculesFormFieldComponent } from './molecules-form-field.component';

@Component({
  template: `<form [formGroup]="form">
    <molecules-form-field formControlName="input"> </molecules-form-field>
  </form>`
})
class TestInputComponent {
  @ViewChild(MoleculesFormFieldComponent, { static: true })
  textInputComponent: MoleculesFormFieldComponent;

  form = new FormGroup({
    input: new FormControl('Test Value')
  });
}

describe('MoleculesFormFieldComponent', () => {
  let component: TestInputComponent;
  let fixture: ComponentFixture<TestInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [MoleculesFormFieldComponent, TestInputComponent]
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
