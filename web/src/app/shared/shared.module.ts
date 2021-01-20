import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';

// TODO: probably we don't need this is shared
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppMaterialModule } from './modules/app-material.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { COMPONENTS, DIRECTIVES, PIPES } from './imports';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AppMaterialModule,
    AttachmentsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES, AppMaterialModule, OverlayModule, FormsModule, ReactiveFormsModule],
  providers: [DatePipe]
})
export class SharedModule {}
