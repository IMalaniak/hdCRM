import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputValidationComponent } from './input-validation.component';

describe('InputValidationComponent', () => {
  let component: InputValidationComponent;
  let fixture: ComponentFixture<InputValidationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InputValidationComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InputValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
