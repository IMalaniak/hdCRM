import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import {
  AddPlanComponent,
  PlanListComponent,
  PlanComponent,
  AddStageDialogComponent,
  StagesDialogComponent,
  StagesComponent,
  TemplatesPlanViewComponent
} from './components';
import { PlanManagementRoutingModule } from './plan-management-routing.module';
import { PlanEffects, plansFeatureKey, reducer } from './store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DragDropModule,
    PlanManagementRoutingModule,
    StoreModule.forFeature(plansFeatureKey, reducer),
    EffectsModule.forFeature([PlanEffects])
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
export class PlanManagementModule {}
