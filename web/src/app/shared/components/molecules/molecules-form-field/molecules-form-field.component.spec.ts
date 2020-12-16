import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@/shared/shared.module';
import { MoleculesFormFieldComponent } from './molecules-form-field.component';

describe('MoleculesFormFieldComponent', () => {
  let component: MoleculesFormFieldComponent;
  let fixture: ComponentFixture<MoleculesFormFieldComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [MoleculesFormFieldComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
