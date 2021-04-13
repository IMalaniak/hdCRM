import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialPrivilegesState } from '@/core/modules/role-api/store/privilege';
import { SharedModule } from '@/shared/shared.module';

import { PrivilegesComponent } from './privileges.component';

describe('PrivilegesComponent', () => {
  let component: PrivilegesComponent;
  let fixture: ComponentFixture<PrivilegesComponent>;
  const initialState = {
    'privilege-api': initialPrivilegesState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PrivilegesComponent],
        imports: [RouterTestingModule, MatIconTestingModule, BrowserAnimationsModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
