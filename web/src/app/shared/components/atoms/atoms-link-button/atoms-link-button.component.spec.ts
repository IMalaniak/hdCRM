import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@/shared/shared.module';

import { AtomsLinkButtonComponent } from './atoms-link-button.component';

describe('AtomsLinkButtonComponent', () => {
  let component: AtomsLinkButtonComponent;
  let fixture: ComponentFixture<AtomsLinkButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [AtomsLinkButtonComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsLinkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
