import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@/shared/shared.module';

import { AtomsUserPicComponent } from './atoms-user-pic.component';

describe('AtomsUserPicComponent', () => {
  let component: AtomsUserPicComponent;
  let fixture: ComponentFixture<AtomsUserPicComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [AtomsUserPicComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsUserPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
