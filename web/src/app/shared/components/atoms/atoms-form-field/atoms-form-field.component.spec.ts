import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@/shared/shared.module';
import { AtomsFormFieldComponent } from './atoms-form-field.component';

describe('AtomsFormFieldComponent', () => {
  let component: AtomsFormFieldComponent;
  let fixture: ComponentFixture<AtomsFormFieldComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [AtomsFormFieldComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
