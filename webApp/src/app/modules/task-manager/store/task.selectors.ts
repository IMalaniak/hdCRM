import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTask from './task.reducer';

export const selectTaskManagerState = createFeatureSelector<fromTask.TaskManagerState>(fromTask.taskFeatureKey);

export const selectTaskState = createSelector(selectTaskManagerState, (taskManagerState) => taskManagerState.tasks);
export const selectAllTasks = createSelector(selectTaskState, fromTask.selectAllTasks);
export const selectTasksLoading = createSelector(selectTaskState, (taskState) => taskState.loading);

export const selectPriorityState = createSelector(
  selectTaskManagerState,
  (taskManagerState) => taskManagerState.priorities
);
export const selectAllPriorities = createSelector(selectPriorityState, fromTask.selectAllPriorities);
export const selectPrioritiesLoading = createSelector(selectPriorityState, (priorityState) => priorityState.loading);
