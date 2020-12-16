import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@/shared/shared.module';
import { AtomsReadonlyFormFieldComponent } from './atoms-readonly-form-field.component';

describe('AtomsReadonlyFormFieldComponent', () => {
  let component: AtomsReadonlyFormFieldComponent;
  let fixture: ComponentFixture<AtomsReadonlyFormFieldComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [AtomsReadonlyFormFieldComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsReadonlyFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
