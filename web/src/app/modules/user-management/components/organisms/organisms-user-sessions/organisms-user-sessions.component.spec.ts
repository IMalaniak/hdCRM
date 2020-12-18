import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { initialPreferencesState } from '@/core/store/preferences';
import { SharedModule } from '@/shared/shared.module';
import { currentUserMock } from '@/shared/testing/mocks';
import { OrganismsUserSessionsComponent } from './organisms-user-sessions.component';

describe('OrganismsUserSessionsComponent', () => {
  let component: OrganismsUserSessionsComponent;
  let fixture: ComponentFixture<OrganismsUserSessionsComponent>;
  const initialState = {
    preferences: initialPreferencesState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrganismsUserSessionsComponent],
        imports: [RouterTestingModule, MatIconTestingModule, HttpClientModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserSessionsComponent);
    component = fixture.componentInstance;
    component.currentSessionId = currentUserMock.UserSessions[0].id;
    component.user = currentUserMock;
    component.mapUserSessions();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
