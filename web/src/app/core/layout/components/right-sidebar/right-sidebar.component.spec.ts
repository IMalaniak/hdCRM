// import { TaskManagerModule } from '@/modules/task-manager/task-manager.module';
import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RightSidebarComponent } from './right-sidebar.component';

import { provideMockStore } from '@ngrx/store/testing';
import { initialUsersState, UsersState } from '@/modules/users/store/user.reducer';
import { authStateMock } from '@/shared/testing/mocks';
import { AuthState } from '@/core/auth/store/auth.reducer';

describe('RightSidebarComponent', () => {
  let component: RightSidebarComponent;
  let fixture: ComponentFixture<RightSidebarComponent>;
  const initialState: { auth: AuthState; users: UsersState } = {
    auth: authStateMock,
    users: initialUsersState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RightSidebarComponent],
        imports: [RouterTestingModule, HttpClientModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
