import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { MoleculesProfilePicWithUploaderComponent } from './molecules-profile-pic-with-uploader.component';

describe('MoleculesProfilePicWithUploaderComponent', () => {
  let component: MoleculesProfilePicWithUploaderComponent;
  let fixture: ComponentFixture<MoleculesProfilePicWithUploaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatIconTestingModule],
        declarations: [MoleculesProfilePicWithUploaderComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesProfilePicWithUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
