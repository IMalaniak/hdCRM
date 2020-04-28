import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as taskReducer from './store/task.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TaskEffects } from './store/task.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from './services';
import { SharedModule } from '@/shared/shared.module';
import * as _components from './components';

@NgModule({
  declarations: [
    _components.TaskManagerComponent,
    _components.OrganismsTaskListComponent,
    _components.OrganismsTaskDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    StoreModule.forFeature(taskReducer.taskFeatureKey, taskReducer.reducer),
    EffectsModule.forFeature([TaskEffects])
  ],
  providers: [TaskService],
  exports: [_components.TaskManagerComponent]
})
export class TaskManagerModule {}
