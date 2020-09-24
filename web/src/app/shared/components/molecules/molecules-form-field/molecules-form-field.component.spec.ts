import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculesFormFieldComponent } from './molecules-form-field.component';

describe('MoleculesFormFieldComponent', () => {
  let component: MoleculesFormFieldComponent;
  let fixture: ComponentFixture<MoleculesFormFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MoleculesFormFieldComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
