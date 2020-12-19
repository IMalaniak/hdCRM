import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { StoreModule } from '@ngrx/store';

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

import * as fromPlan from './store/plan.reducer';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DragDropModule,
    PlannerRoutingModule,
    StoreModule.forFeature(fromPlan.plansFeatureKey, fromPlan.reducer)
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
