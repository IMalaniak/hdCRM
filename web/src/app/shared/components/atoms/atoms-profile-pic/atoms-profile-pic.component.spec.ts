import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@shared/shared.module';

import { AtomsProfilePicComponent } from './atoms-profile-pic.component';

describe('AtomsProfilePicComponent', () => {
  let component: AtomsProfilePicComponent;
  let fixture: ComponentFixture<AtomsProfilePicComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [AtomsProfilePicComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsProfilePicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
