import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlannerRoutingModule } from './planner-routing.module';
import { SharedModule } from '@/_shared/modules';
import { AttachmentsModule } from '../attachments/attachments.module';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { UsersModule } from '@/_modules/users/users.module';

import {
    AddPlanComponent,
    PlanListComponent,
    PlanComponent,
    AddStageDialogComponent, 
    StagesDialogComponent,
    StagesComponent
     } from './_components';

import { PlanService, StageService } from './_services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DragDropModule,
    PlannerRoutingModule,
    AttachmentsModule,
    SweetAlert2Module,
    UsersModule
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
export class PlannerModule {}
