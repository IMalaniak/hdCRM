import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { TaskService } from '../services';
import * as TaskActions from './task.actions';
import { Task, TaskServerResponse } from '../models';
import Swal from 'sweetalert2';

@Injectable()
export class TaskEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.taskListRequested),
      mergeMap(() =>
        this.taskService.getList().pipe(
          catchError(err => {
            console.log('error loading a tasks page ', err);
            return of({});
          })
        )
      ),
      map((response: TaskServerResponse) => TaskActions.taskListLoaded({ response }))
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

  constructor(private actions$: Actions, private taskService: TaskService) {}
}
