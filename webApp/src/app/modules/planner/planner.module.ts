import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { PlannerRoutingModule } from './planner-routing.module';
import { SharedModule } from '@/shared';
import { UsersModule } from '@/modules/users/users.module';

// TODO: delete
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisV,
  faInfo,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

import {
  AddPlanComponent,
  PlanListComponent,
  PlanComponent,
  AddStageDialogComponent,
  StagesDialogComponent,
  StagesComponent
} from './components';

import { PlanService, StageService } from './services';
import * as fromPlan from './store/plan.reducer';
import { PlanEffects } from './store/plan.effects';
import * as fromStage from './store/stage.reducer';
import { StageEffects } from './store/stage.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DragDropModule,
    PlannerRoutingModule.forRoot(),
    SweetAlert2Module,
    UsersModule,
    FontAwesomeModule,
    StoreModule.forFeature(fromPlan.plansFeatureKey, fromPlan.reducer),
    StoreModule.forFeature(fromStage.stagesFeatureKey, fromStage.reducer),
    EffectsModule.forFeature([PlanEffects, StageEffects])
  ],
  declarations: [
    AddPlanComponent,
    PlanListComponent,
    PlanComponent,
    AddStageDialogComponent,
    StagesDialogComponent,
    StagesComponent
  ],
  providers: [PlanService, StageService],
  exports: [
    AddPlanComponent,
    PlanListComponent,
    PlanComponent,
    AddStageDialogComponent,
    StagesDialogComponent,
    StagesComponent
  ]
})
export class PlannerModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faEllipsisV,
      faInfo,
      faEdit,
      faTrash
    );
  }
}
