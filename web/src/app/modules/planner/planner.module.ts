import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PlannerRoutingModule } from './planner-routing.module';
import { SharedModule } from '@/shared/shared.module';

import {
  AddPlanComponent,
  PlanListComponent,
  PlanComponent,
  AddStageDialogComponent,
  StagesDialogComponent,
  StagesComponent,
  TemplatesPlanViewComponent
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
    SharedModule,
    DragDropModule,
    PlannerRoutingModule.forRoot(),
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
    StagesComponent,
    TemplatesPlanViewComponent
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
export class PlannerModule {}
