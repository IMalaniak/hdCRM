import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Task, TaskPriority } from '../models';

const detailsPrefix = '[Task Details]';
const listPrefix = '[Tasks List]';
const apiPrefix = '[Tasks API]';

export const taskListRequested = createAction(`${listPrefix} Task List Requested`);
export const taskListLoaded = createAction(`${apiPrefix} Task List Loaded`, props<{ tasks: Task[] }>());

export const createTask = createAction('[Add Task] Add Task Requested', props<{ task: Task }>());
export const createTaskSuccess = createAction(`${apiPrefix} Add Task Success`, props<{ task: Task }>());

export const updateTaskRequested = createAction(`[${detailsPrefix} Update Task Requested`, props<{ task: Task }>());
export const updateTaskSuccess = createAction(`${apiPrefix} Update Task Success`, props<{ task: Update<Task> }>());

export const deleteTask = createAction(`${listPrefix} Delete Task Requested`, props<{ id: number }>());
export const deleteMultipleTaskRequested = createAction(
  `${listPrefix} Delete Multiple Task Requested`,
  props<{ taskIds: number[] }>()
);
export const deleteMultipleTaskSuccess = createAction(
  `${apiPrefix} Delete Multiple Task Success`,
  props<{ taskIds: number[] }>()
);

export const taskPrioritiesRequested = createAction('[Task Manager] Task Priorities Requested');
export const taskPrioritiesLoaded = createAction(
  `${apiPrefix} Task Priorities Loaded`,
  props<{ priorities: TaskPriority[] }>()
);

export const tasksApiError = createAction(`${apiPrefix} Failed Executing Request`);
