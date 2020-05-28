import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsReadonlyLabeledFormFieldComponent } from './atoms-readonly-labeled-form-field.component';

describe('AtomsReadonlyLabeledFormFieldComponent', () => {
  let component: AtomsReadonlyLabeledFormFieldComponent;
  let fixture: ComponentFixture<AtomsReadonlyLabeledFormFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtomsReadonlyLabeledFormFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsReadonlyLabeledFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
