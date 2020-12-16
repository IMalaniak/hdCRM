import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@/shared/shared.module';
import { AtomsIntegrationCardComponent } from './atoms-integration-card.component';

describe('AtomsIntegrationCardComponent', () => {
  let component: AtomsIntegrationCardComponent;
  let fixture: ComponentFixture<AtomsIntegrationCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [AtomsIntegrationCardComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsIntegrationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
