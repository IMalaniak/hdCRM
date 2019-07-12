import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { PlannerRoutingModule } from './planner-routing.module';
import { SharedModule } from '@/_shared/modules';
import { AttachmentsModule } from '../attachments/attachments.module';
import { UsersModule } from '@/_modules/users/users.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisV, faInfo, faEdit, faPlus, faSave, faTimes, faUserPlus, faPaperPlane, faArrowRight, faCog } from '@fortawesome/free-solid-svg-icons';

import {
    AddPlanComponent,
    PlanListComponent,
    PlanComponent,
    AddStageDialogComponent, 
    StagesDialogComponent,
    StagesComponent
     } from './_components';

import { PlanService, StageService } from './_services';
import { plansReducer } from './store/plan.reducer';
import { PlanEffects } from './store/plan.effects';
import { stagesReducer } from './store/stage.reducer';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DragDropModule,
    PlannerRoutingModule.forRoot(),
    AttachmentsModule,
    SweetAlert2Module,
    UsersModule,
    FontAwesomeModule,
    StoreModule.forFeature('plans', plansReducer),
    StoreModule.forFeature('stages', stagesReducer),
    EffectsModule.forFeature([PlanEffects])
  ],
  declarations: [
    AddPlanComponent,
    PlanListComponent,
    PlanComponent,
    AddStageDialogComponent,
    StagesDialogComponent,
    StagesComponent
  ], 
  providers: [
    PlanService,
    StageService
  ],
  exports: [
    AddPlanComponent,
    PlanListComponent,
    PlanComponent,
    AddStageDialogComponent,
    StagesDialogComponent,
    StagesComponent
  ],
  entryComponents: [AddStageDialogComponent, StagesDialogComponent]
})
export class PlannerModule {
  constructor() {
    library.add(
      faEllipsisV,
      faInfo,
      faEdit,
      faPlus,
      faSave,
      faTimes,
      faUserPlus,
      faPaperPlane,
      faArrowRight,
      faCog
    );
  }
}
