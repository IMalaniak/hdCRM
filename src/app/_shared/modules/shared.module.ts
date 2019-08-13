import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from './app-material.module';
import { ContentBoxComponent } from '@/_shared/components';


@NgModule({
  imports: [CommonModule, AppMaterialModule],
  declarations: [ContentBoxComponent],
  exports: [AppMaterialModule, ContentBoxComponent]
})
export class SharedModule {}