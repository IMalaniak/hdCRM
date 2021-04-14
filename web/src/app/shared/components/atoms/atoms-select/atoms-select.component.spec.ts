import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@shared/shared.module';

import { AtomsSelectComponent } from './atoms-select.component';

@Component({
  template: `<form [formGroup]="form">
    <atoms-select formControlName="radiogroup"> </atoms-select>
  </form>`
})
class TestAtomsSelectComponent {
  @ViewChild(AtomsSelectComponent, { static: true })
  selectInputComponent: AtomsSelectComponent;

  form = new FormGroup({
    radiogroup: new FormControl('Test value')
  });
}

describe('AtomsSelectComponent', () => {
  let component: TestAtomsSelectComponent;
  let fixture: ComponentFixture<TestAtomsSelectComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, BrowserAnimationsModule],
        declarations: [AtomsSelectComponent, TestAtomsSelectComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAtomsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
