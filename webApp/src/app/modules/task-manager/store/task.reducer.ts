import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as TaskActions from './task.actions';
import { Task } from '../models';

export interface TaskState extends EntityState<Task> {
  loading: boolean;
}

function sortByCreatedAtAndPriority(t1: Task, t2: Task) {
  const compareByPriority = t2.priority - t1.priority;

  if (compareByPriority !== 0) {
    return compareByPriority;
  } else {
    return +t2.createdAt - +t1.createdAt;
  }
}

export const adapter: EntityAdapter<Task> = createEntityAdapter<Task>({
  sortComparer: sortByCreatedAtAndPriority
});

export const initialTaskState: TaskState = adapter.getInitialState({
  loading: false
});

const taskReducer = createReducer(
  initialTaskState,
  on(TaskActions.taskListRequested, state => ({ ...state, loading: true })),
  on(TaskActions.taskListLoaded, (state, { tasks }) => {
    return adapter.addMany(tasks, { ...state, loading: false });
  }),
  on(TaskActions.createTaskSuccess, (state, { task }) => adapter.addOne(task, { ...state })),
  on(TaskActions.createTaskFail, (state, { error }) => ({ ...state, error })),
  on(TaskActions.updateTaskRequested, state => ({ ...state, loading: true })),
  on(TaskActions.updateTaskCancelled, state => ({ ...state, loading: false })),
  on(TaskActions.updateTaskSuccess, (state, { task }) => adapter.updateOne(task, { ...state, loading: false })),
  on(TaskActions.deleteTask, (state, { id }) => {
    return adapter.removeOne(id, { ...state });
  })
);

export function reducer(state: TaskState | undefined, action: Action) {
  return taskReducer(state, action);
}

export const taskFeatureKey = 'tasks';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
