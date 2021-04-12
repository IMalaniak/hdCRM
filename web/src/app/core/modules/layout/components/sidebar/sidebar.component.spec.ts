import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { authStateMock } from '@/shared/testing/mocks';
import { provideMockStore } from '@ngrx/store/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { SharedModule } from '@/shared/shared.module';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  const initialState = {
    auth: authStateMock
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SidebarComponent],
        imports: [RouterTestingModule, SharedModule, MatIconTestingModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
