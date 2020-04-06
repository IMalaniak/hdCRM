import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilepicUploaderComponent } from './profile-pic-uploader.component';

describe('ProfilepicUploaderComponent', () => {
  let component: ProfilepicUploaderComponent;
  let fixture: ComponentFixture<ProfilepicUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilepicUploaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilepicUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
