import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomsProfilePicComponent } from './atoms-profile-pic.component';

describe('AtomsProfilePicComponent', () => {
  let component: AtomsProfilePicComponent;
  let fixture: ComponentFixture<AtomsProfilePicComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AtomsProfilePicComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsProfilePicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
