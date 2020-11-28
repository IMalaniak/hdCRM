import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppMaterialModule } from './modules/app-material.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { COMPONENTS, PIPES } from './imports';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AppMaterialModule,
    AttachmentsModule,
    NgxChartsModule,
    ReactiveFormsModule
  ],
  declarations: [...COMPONENTS, ...PIPES],
  exports: [...COMPONENTS, ...PIPES, AppMaterialModule, OverlayModule, FormsModule, ReactiveFormsModule],
  providers: [DatePipe]
})
export class SharedModule {}
