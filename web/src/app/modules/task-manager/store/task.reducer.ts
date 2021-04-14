import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { Task, TaskPriority } from '../models';

import * as TaskActions from './task.actions';

export interface TaskState extends EntityState<Task> {
  loading: boolean;
}

export interface TaskPriorityState extends EntityState<TaskPriority> {
  loading: boolean;
}

export interface TaskManagerState {
  tasks: TaskState;
  priorities: TaskPriorityState;
}

const sortTasks = (t1: Task, t2: Task) => {
  const compareByPriority: number = t2.TaskPriorityId - t1.TaskPriorityId;
  const compareByCompleteness: number = +t2.isCompleted + +t1.isCompleted;
  if (compareByCompleteness !== 0) {
    return compareByCompleteness;
  }

  if (compareByPriority !== 0) {
    return compareByPriority;
  } else {
    return +t2.createdAt - +t1.createdAt;
  }
};

export const taskAdapter: EntityAdapter<Task> = createEntityAdapter<Task>({
  sortComparer: sortTasks
});

export const priorityAdapter: EntityAdapter<TaskPriority> = createEntityAdapter<TaskPriority>();

export const initialTaskState: TaskState = taskAdapter.getInitialState({
  loading: false
});

export const initialTaskPriorityState: TaskPriorityState = priorityAdapter.getInitialState({
  loading: false
});

export const initialTaskManagerState: TaskManagerState = {
  tasks: initialTaskState,
  priorities: initialTaskPriorityState
};

const taskManagerReducer = createReducer(
  initialTaskManagerState,
  on(TaskActions.taskListRequested, (state: TaskManagerState) => ({
    ...state,
    tasks: { ...state.tasks, loading: true }
  })),
  on(TaskActions.taskListLoaded, (state: TaskManagerState, { tasks }) => ({
    ...state,
    tasks: taskAdapter.upsertMany(tasks, { ...state.tasks, loading: false })
  })),
  on(TaskActions.createTaskSuccess, (state: TaskManagerState, { task }) => ({
    ...state,
    tasks: taskAdapter.addOne(task, { ...state.tasks })
  })),
  on(TaskActions.updateTaskRequested, (state: TaskManagerState) => ({
    ...state,
    tasks: { ...state.tasks, loading: true }
  })),
  on(TaskActions.updateTaskSuccess, (state: TaskManagerState, { task }) => ({
    ...state,
    tasks: taskAdapter.updateOne(task, { ...state.tasks, loading: false })
  })),
  on(TaskActions.deleteTask, (state: TaskManagerState, { id }) => ({
    ...state,
    tasks: taskAdapter.removeOne(id, { ...state.tasks })
  })),
  on(TaskActions.deleteMultipleTaskRequested, (state: TaskManagerState) => ({
    ...state,
    tasks: { ...state.tasks, loading: true }
  })),
  on(TaskActions.deleteMultipleTaskSuccess, (state: TaskManagerState, { taskIds }) => ({
    ...state,
    tasks: taskAdapter.removeMany(taskIds, { ...state.tasks, loading: false })
  })),
  on(TaskActions.taskPrioritiesRequested, (state: TaskManagerState) => ({
    ...state,
    priorities: { ...state.priorities, loading: true }
  })),
  on(TaskActions.taskPrioritiesLoaded, (state: TaskManagerState, { priorities }) => ({
    ...state,
    priorities: priorityAdapter.upsertMany(priorities, { ...state.priorities, loading: true })
  })),
  on(TaskActions.tasksApiError, (state: TaskManagerState) => ({
    ...state,
    tasks: { ...state.tasks, loading: false }
  }))
);

export const reducer = (state: TaskManagerState | undefined, action: Action) => taskManagerReducer(state, action);

export const taskFeatureKey = 'tasks';

export const {
  selectAll: selectAllTasks,
  selectEntities: selectTaskEntities,
  selectIds: selectTaskIds,
  selectTotal: selectTotalTasks
} = taskAdapter.getSelectors();

export const {
  selectAll: selectAllPriorities,
  selectEntities: selectPriorityEntities,
  selectIds: selectPriorityIds,
  selectTotal: selectTotalPriority
} = priorityAdapter.getSelectors();
