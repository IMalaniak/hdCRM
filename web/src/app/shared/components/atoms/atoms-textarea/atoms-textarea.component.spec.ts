import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@/shared/shared.module';

import { AtomsTextareaComponent } from './atoms-textarea.component';

@Component({
  template: `<form [formGroup]="form">
    <atoms-textarea formControlName="textarea"> </atoms-textarea>
  </form>`
})
class TestAtomsTextareaComponent {
  @ViewChild(AtomsTextareaComponent, { static: true })
  textareaInputComponent: AtomsTextareaComponent;

  form = new FormGroup({
    textarea: new FormControl('Test value')
  });
}

describe('AtomsTextareaComponent', () => {
  let component: TestAtomsTextareaComponent;
  let fixture: ComponentFixture<TestAtomsTextareaComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, BrowserAnimationsModule],
        declarations: [AtomsTextareaComponent, TestAtomsTextareaComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAtomsTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
