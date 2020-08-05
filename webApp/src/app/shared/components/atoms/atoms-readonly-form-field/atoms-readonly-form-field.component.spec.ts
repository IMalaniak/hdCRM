import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsReadonlyFormFieldComponent } from './atoms-readonly-form-field.component';

describe('AtomsReadonlyFormFieldComponent', () => {
  let component: AtomsReadonlyFormFieldComponent;
  let fixture: ComponentFixture<AtomsReadonlyFormFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtomsReadonlyFormFieldComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsReadonlyFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
