import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@/shared/shared.module';
import { authStateMock } from '@/shared/testing/mocks';

import { initialLayoutState } from '../../store/layout.reducer';

import { UserDropdownComponent } from './user-dropdown.component';

describe('UserDropdownComponent', () => {
  let component: UserDropdownComponent;
  let fixture: ComponentFixture<UserDropdownComponent>;
  const initialState = {
    layout: initialLayoutState,
    auth: authStateMock
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDropdownComponent],
      imports: [SharedModule, MatIconTestingModule],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
