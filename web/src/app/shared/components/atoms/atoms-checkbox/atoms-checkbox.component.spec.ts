import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsCheckboxComponent } from './atoms-checkbox.component';

describe('AtomsCheckboxComponent', () => {
  let component: AtomsCheckboxComponent;
  let fixture: ComponentFixture<AtomsCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtomsCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
