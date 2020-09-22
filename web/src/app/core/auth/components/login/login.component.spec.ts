import { RouterTestingModule } from '@angular/router/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../../services';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@/shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthState } from '../../store/auth.reducer';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const initialState: { auth: AuthState } = {
    auth: {
      loggedIn: false,
      accessToken: null,
      sessionId: null,
      isTokenValid: false,
      isTokenRefreshing: false,
      currentUser: null,
      loading: false
    }
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoginComponent],
        imports: [RouterTestingModule, BrowserAnimationsModule, HttpClientModule, SharedModule],
        providers: [
          AuthenticationService,
          provideMockStore({ initialState }),
          LoginComponent,
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { url: [{ path: 'login' }], routeConfig: { path: 'auth/login' } } }
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
