import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AtomsRadiogroupComponent } from './atoms-radiogroup.component';
import { SharedModule } from '@/shared/shared.module';

@Component({
  template: `<form [formGroup]="form">
    <atoms-radiogroup formControlName="radiogroup"> </atoms-radiogroup>
  </form>`
})
class TestAtomsRadiogroupComponent {
  @ViewChild(AtomsRadiogroupComponent, { static: true })
  radiogroupInputComponent: AtomsRadiogroupComponent;

  form = new FormGroup({
    radiogroup: new FormControl(true)
  });
}

describe('AtomsRadiogroupComponent', () => {
  let component: TestAtomsRadiogroupComponent;
  let fixture: ComponentFixture<TestAtomsRadiogroupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, BrowserAnimationsModule],
        declarations: [AtomsRadiogroupComponent, TestAtomsRadiogroupComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAtomsRadiogroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
