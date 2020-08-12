import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { TaskService } from '../services';
import * as TaskActions from './task.actions';
import { Task, TaskPriority } from '../models';
import { Update } from '@ngrx/entity';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastMessageService } from '@/shared/services';

@Injectable()
export class TaskEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.taskListRequested),
      switchMap(() =>
        this.taskService.getList().pipe(
          map((tasks: Task[]) => TaskActions.taskListLoaded({ tasks })),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(TaskActions.taskListLoadFailed({ error: errorResponse.error }));
          })
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      map(payload => payload.task),
      mergeMap((task: Task) =>
        this.taskService.create(task).pipe(
          map(newTask => {
            this.toastMessageService.toast('Task created!');
            return TaskActions.createTaskSuccess({
              task: newTask
            });
          }),
          catchError(error => {
            this.toastMessageService.toast('Ooops, something went wrong!', 'error');
            return of(TaskActions.createTaskFail({ error }));
          })
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTaskRequested),
      map(payload => payload.task),
      mergeMap(toUpdate =>
        this.taskService.updateTask(toUpdate).pipe(
          catchError(err => {
            TaskActions.updateTaskCancelled();
            return of(this.toastMessageService.popup('Ooops, something went wrong!', 'error'));
          })
        )
      ),
      map((data: Task) => {
        const task: Update<Task> = {
          id: data.id,
          changes: data
        };
        this.toastMessageService.toast('Task updated!');
        return TaskActions.updateTaskSuccess({ task });
      })
    )
  );

  deleteTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskActions.deleteTask),
        map(payload => payload.id),
        mergeMap(id => this.taskService.delete(id))
      ),
    {
      dispatch: false
    }
  );

  deleteMultipleTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteMultipleTaskRequested),
      map(payload => payload.taskIds),
      switchMap((taskIds: number[]) =>
        this.taskService.deleteMultipleTask(taskIds).pipe(
          map(response => {
            return TaskActions.deleteMultipleTaskSuccess({ taskIds });
          }),
          catchError(error => {
            this.toastMessageService.toast('Ooops, something went wrong!', 'error');
            return of(TaskActions.deleteMultipleTaskFailure({ error }));
          })
        )
      )
    )
  );

  loadPriorities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.taskPrioritiesRequested),
      switchMap(() =>
        this.taskService.getPriorities().pipe(
          map((priorities: TaskPriority[]) => TaskActions.taskPrioritiesLoaded({ priorities })),
          catchError((response: HttpErrorResponse) => {
            return of(TaskActions.taskPrioritiesLoadFail({ error: response.error }));
          })
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
