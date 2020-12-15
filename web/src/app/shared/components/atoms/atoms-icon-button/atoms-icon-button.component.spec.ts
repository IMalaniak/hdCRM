import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@/shared/shared.module';
import { AtomsIconButtonComponent } from './atoms-icon-button.component';

describe('AtomsIconButtonComponent', () => {
  let component: AtomsIconButtonComponent;
  let fixture: ComponentFixture<AtomsIconButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [AtomsIconButtonComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
