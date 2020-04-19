import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as TaskActions from './task.actions';
import { Task } from '../models';

export interface TaskState extends EntityState<Task> {
  loading: boolean;
}

export const adapter: EntityAdapter<Task> = createEntityAdapter<Task>({});

export const initialTaskState: TaskState = adapter.getInitialState({
  loading: false
});

const taskReducer = createReducer(
  initialTaskState,
  on(TaskActions.taskListRequested, state => ({ ...state, loading: true })),
  on(TaskActions.taskListLoaded, (state, { response }) => {
    return adapter.addMany(response.list, { ...state, loading: false });
  }),
  on(TaskActions.getTask, state => ({ ...state })),
  on(TaskActions.createTaskSuccess, (state, { task }) => adapter.addOne(task, { ...state })),
  on(TaskActions.createTaskFail, (state, { error }) => ({ ...state, error })),
  on(TaskActions.updateTask, (state, { task }) => {
    return adapter.updateOne(task, { ...state });
  }),
  on(TaskActions.deleteTask, (state, { id }) => {
    return adapter.removeOne(id, { ...state });
  })
);

export function reducer(state: TaskState | undefined, action: Action) {
  return taskReducer(state, action);
}

export const taskFeatureKey = 'tasks';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
