import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachmentsComponent } from './_components';
import { AppMaterialModule } from '@/_shared/modules';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  declarations: [
    AttachmentsComponent
    ],
  exports: [
    AttachmentsComponent
    ]
})
export class AttachmentsModule {}
