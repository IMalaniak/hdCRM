import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@shared/shared.module';

import { initialTaskManagerState } from '../../store/task.reducer';
import { OrganismsTaskListComponent } from '../organisms';

import { TaskManagerComponent } from './task-manager.component';

describe('TaskManagerComponent', () => {
  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;
  const initialState = {
    tasks: initialTaskManagerState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TaskManagerComponent, OrganismsTaskListComponent],
        imports: [SharedModule, MatIconTestingModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
