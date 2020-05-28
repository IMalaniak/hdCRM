import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsLabeledFormFieldComponent } from './atoms-labeled-form-field.component';

describe('AtomsLabeledFormFieldComponent', () => {
  let component: AtomsLabeledFormFieldComponent;
  let fixture: ComponentFixture<AtomsLabeledFormFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtomsLabeledFormFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsLabeledFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
