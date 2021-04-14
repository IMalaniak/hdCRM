import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
// TODO: probably we don't need this is shared
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { COMPONENTS, DIRECTIVES, PIPES } from './imports';
import { AppMaterialModule } from './modules/app-material.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AppMaterialModule,
    AttachmentsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    DragDropModule,
    ReactiveComponentModule
  ],
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES, AppMaterialModule, OverlayModule, FormsModule, ReactiveFormsModule],
  providers: [DatePipe]
})
export class SharedModule {}
