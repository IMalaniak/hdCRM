import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from './modules/app-material.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { COMPONENTS, PIPES } from './imports';
import { OverlayModule } from '@angular/cdk/overlay';
import { IconModule } from './modules/icon.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AppMaterialModule,
    AttachmentsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    IconModule
  ],
  declarations: [...COMPONENTS, ...PIPES],
  exports: [...COMPONENTS, ...PIPES, AppMaterialModule, OverlayModule, FormsModule, ReactiveFormsModule, IconModule]
})
export class SharedModule {}
