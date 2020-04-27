import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { TaskService } from '../services';
import * as TaskActions from './task.actions';
import { Task } from '../models';
import Swal from 'sweetalert2';
import { Update } from '@ngrx/entity';

@Injectable()
export class TaskEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.taskListRequested),
      mergeMap(() =>
        this.taskService.getList().pipe(
          catchError(err => {
            console.log('error loading a tasks list ', err);
            return of({});
          })
        )
      ),
      map((tasks: Task[]) => TaskActions.taskListLoaded({ tasks }))
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

  constructor(private actions$: Actions, private taskService: TaskService) {}
}
