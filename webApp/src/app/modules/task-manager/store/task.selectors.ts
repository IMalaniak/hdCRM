import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTask from './task.reducer';

export const selectTaskState = createFeatureSelector<fromTask.TaskState>(fromTask.taskFeatureKey);
export const selectAllTasks = createSelector(selectTaskState, fromTask.selectAll);
