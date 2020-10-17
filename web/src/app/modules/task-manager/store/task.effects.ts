import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { TaskService } from '../services';
import * as TaskActions from './task.actions';
import { Task, TaskPriority } from '../models';
import { Update } from '@ngrx/entity';
import { ToastMessageService } from '@/shared/services';
import { HttpErrorResponse } from '@angular/common/http';
import { CollectionServiceMessage, ItemServiceMessage, ServiceMessage } from '@/shared/models';

@Injectable()
export class TaskEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.taskListRequested),
      switchMap(() =>
        this.taskService.getList().pipe(
          map((response: CollectionServiceMessage<Task>) => TaskActions.taskListLoaded({ tasks: response.data })),
          catchError(() => of(TaskActions.tasksApiError()))
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      map((payload) => payload.task),
      mergeMap((task: Task) =>
        this.taskService.create(task).pipe(
          map((response: ItemServiceMessage<Task>) => {
            this.toastMessageService.snack(response);
            return TaskActions.createTaskSuccess({
              task: response.data
            });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(TaskActions.tasksApiError());
          })
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTaskRequested),
      map((payload) => payload.task),
      mergeMap((toUpdate) =>
        this.taskService.updateTask(toUpdate).pipe(
          map((response: ItemServiceMessage<Task>) => {
            const task: Update<Task> = {
              id: response.data.id,
              changes: response.data
            };
            this.toastMessageService.snack(response);
            return TaskActions.updateTaskSuccess({ task });
          }),
          catchError(() => of(TaskActions.tasksApiError()))
        )
      )
    )
  );

  // TODO: @IMalaniak recreate this
  deleteTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskActions.deleteTask),
        map((payload) => payload.id),
        mergeMap((id) => this.taskService.delete(id)),
        map((response: ServiceMessage) => of(this.toastMessageService.snack(response))),
        catchError(() => of(TaskActions.tasksApiError()))
      ),
    {
      dispatch: false
    }
  );

  deleteMultipleTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteMultipleTaskRequested),
      map((payload) => payload.taskIds),
      switchMap((taskIds: number[]) =>
        this.taskService.deleteMultipleTask(taskIds).pipe(
          map((response: ServiceMessage) => {
            this.toastMessageService.snack(response);
            return TaskActions.deleteMultipleTaskSuccess({ taskIds });
          }),
          catchError(() => of(TaskActions.tasksApiError()))
        )
      )
    )
  );

  loadPriorities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.taskPrioritiesRequested),
      switchMap(() =>
        this.taskService.getPriorities().pipe(
          map((response: CollectionServiceMessage<TaskPriority>) =>
            TaskActions.taskPrioritiesLoaded({ priorities: response.data })
          ),
          catchError(() => of(TaskActions.tasksApiError()))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private taskService: TaskService,
    private toastMessageService: ToastMessageService
  ) {}
}
