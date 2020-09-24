// import { TaskManagerModule } from '@/modules/task-manager/task-manager.module';
import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RightSidebarComponent } from './right-sidebar.component';

import { provideMockStore } from '@ngrx/store/testing';
import { initialUsersState } from '@/modules/users/store/user.reducer';

describe('RightSidebarComponent', () => {
  let component: RightSidebarComponent;
  let fixture: ComponentFixture<RightSidebarComponent>;
  const initialState = {
    users: initialUsersState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RightSidebarComponent],
        imports: [
          RouterTestingModule,
          HttpClientModule
          // TaskManagerModule
        ],
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
