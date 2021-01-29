import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsInputComponent } from './atoms-input.component';

describe('AtomsInputComponent', () => {
  let component: AtomsInputComponent;
  let fixture: ComponentFixture<AtomsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtomsInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
