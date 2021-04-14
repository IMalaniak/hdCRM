import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@shared/shared.module';

import { AtomsInputComponent } from './atoms-input.component';

@Component({
  template: `<form [formGroup]="form">
    <atoms-input formControlName="input"> </atoms-input>
  </form>`
})
class TestInputComponent {
  @ViewChild(AtomsInputComponent, { static: true })
  textInputComponent: AtomsInputComponent;

  form = new FormGroup({
    input: new FormControl('Test Value')
  });
}

describe('AtomsInputComponent', () => {
  let component: TestInputComponent;
  let fixture: ComponentFixture<TestInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, BrowserAnimationsModule],
        declarations: [AtomsInputComponent, TestInputComponent]
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
