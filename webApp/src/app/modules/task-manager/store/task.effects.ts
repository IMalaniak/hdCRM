import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { TaskService } from '../services';
import * as TaskActions from './task.actions';
import { Task, TaskPriority } from '../models';
import Swal from 'sweetalert2';
import { Update } from '@ngrx/entity';
import { HttpErrorResponse } from '@angular/common/http';

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
            Swal.fire({
              text: 'Task created!',
              icon: 'success',
              timer: 2500,
              toast: true,
              showConfirmButton: false,
              position: 'bottom-end'
            });
            return TaskActions.createTaskSuccess({
              task: newTask
            });
          }),
          catchError(error => {
            Swal.fire({
              text: 'Ooops, something went wrong!',
              icon: 'error',
              timer: 2500,
              toast: true,
              showConfirmButton: false,
              position: 'bottom-end'
            });
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
            return of(
              Swal.fire({
                text: 'Ooops, something went wrong!',
                icon: 'error',
                timer: 3000
              })
            );
          })
        )
      ),
      map((data: Task) => {
        const task: Update<Task> = {
          id: data.id,
          changes: data
        };
        Swal.fire({
          text: 'Task updated!',
          icon: 'success',
          timer: 2500,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
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

  constructor(private actions$: Actions, private taskService: TaskService) {}
}
