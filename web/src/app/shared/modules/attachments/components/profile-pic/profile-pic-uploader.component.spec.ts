import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@shared/shared.module';
import { authStateMock } from '@shared/testing/mocks';

import { ProfilepicUploaderComponent } from './profile-pic-uploader.component';

describe('ProfilepicUploaderComponent', () => {
  let component: ProfilepicUploaderComponent;
  let fixture: ComponentFixture<ProfilepicUploaderComponent>;
  const initialState = {
    auth: authStateMock
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [ProfilepicUploaderComponent],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilepicUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
