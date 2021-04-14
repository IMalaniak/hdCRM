import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import * as _components from './components';
import { TaskService } from './services';
import { TaskEffects } from './store/task.effects';
import * as taskReducer from './store/task.reducer';

@NgModule({
  declarations: [
    _components.TaskManagerComponent,
    _components.OrganismsTaskListComponent,
    _components.OrganismsTaskDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature(taskReducer.taskFeatureKey, taskReducer.reducer),
    EffectsModule.forFeature([TaskEffects])
  ],
  providers: [TaskService],
  exports: [_components.TaskManagerComponent]
})
export class TaskManagerModule {}
