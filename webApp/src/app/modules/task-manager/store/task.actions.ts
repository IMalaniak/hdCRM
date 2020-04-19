import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Task, TaskServerResponse } from '../models';

export const taskListRequested = createAction('[Task API] Get Task List Details Requested');
export const taskListLoaded = createAction(
  '[Task API] Get Task List Details Loaded',
  props<{ response: TaskServerResponse }>()
);
export const getTask = createAction('[Task Details] Get Task Details Requested', props<{ id: number }>());
export const createTask = createAction('[Add Task] Add Task Requested', props<{ task: Task }>());
export const createTaskSuccess = createAction('[Task API] Add Task Success', props<{ task: Task }>());
export const createTaskFail = createAction('[Task API] Add Task Fail', props<{ error: string }>());
export const deleteTask = createAction('[Task List] Delete Task Requested', props<{ id: number }>());
export const updateTask = createAction('[Task Details] Task Changes Saved', props<{ task: Update<Task> }>());
