import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AtomsCheckboxComponent } from './atoms-checkbox.component';
import { SharedModule } from '@/shared/shared.module';

@Component({
  template: `<form [formGroup]="form">
    <atoms-checkbox formControlName="checkbox"> </atoms-checkbox>
  </form>`
})
class TestAtomsCheckboxComponent {
  @ViewChild(AtomsCheckboxComponent, { static: true })
  checkboxInputComponent: AtomsCheckboxComponent;

  form = new FormGroup({
    checkbox: new FormControl(true)
  });
}

describe('AtomsCheckboxComponent', () => {
  let component: TestAtomsCheckboxComponent;
  let fixture: ComponentFixture<TestAtomsCheckboxComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, BrowserAnimationsModule],
        declarations: [AtomsCheckboxComponent, TestAtomsCheckboxComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAtomsCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
