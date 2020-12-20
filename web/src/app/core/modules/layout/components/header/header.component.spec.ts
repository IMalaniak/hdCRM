import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialNotificationsState } from '@/core/store/notifications';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock, routerStoreMock } from '@/shared/testing/mocks';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { HeaderComponent } from './header.component';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';
import { initialLayoutState } from '../../store/layout.reducer';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const initialState = {
    auth: authStateMock,
    notifications: initialNotificationsState,
    router: routerStoreMock,
    layout: initialLayoutState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HeaderComponent, NotificationsComponent, UserDropdownComponent, BreadcrumbsComponent],
        imports: [RouterTestingModule, SharedModule, MatIconTestingModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
