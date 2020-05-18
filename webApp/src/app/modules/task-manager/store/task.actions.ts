import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Task, TaskPriority } from '../models';
import { ApiResponse } from '@/shared';

export const taskListRequested = createAction('[Task List] Task List Requested');
export const taskListLoaded = createAction('[Task Api] Task List Loaded', props<{ tasks: Task[] }>());

export const createTask = createAction('[Add Task] Add Task Requested', props<{ task: Task }>());
export const createTaskSuccess = createAction('[Task API] Add Task Success', props<{ task: Task }>());
export const createTaskFail = createAction('[Task API] Add Task Fail', props<{ error: ApiResponse }>());

export const updateTaskRequested = createAction('[Task Details] Update Task Requested', props<{ task: Task }>());
export const updateTaskCancelled = createAction('[Task API] Update Task Cancelled');
export const updateTaskSuccess = createAction('[Task API] Update Task Success', props<{ task: Update<Task> }>());

export const deleteTask = createAction('[Task List] Delete Task Requested', props<{ id: number }>());

export const taskPrioritiesRequested = createAction('[Task Manager] Task Priorities Requested');
export const taskPrioritiesLoaded = createAction(
  '[Task Api] Task Priorities Loaded',
  props<{ priorities: TaskPriority[] }>()
);
export const taskPrioritiesLoadFail = createAction(
  '[Task API] Task Priorities Load Fail',
  props<{ error: ApiResponse }>()
);
