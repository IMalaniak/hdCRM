import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components';
import { AppMaterialModule } from '@/shared/modules';

const routes: Routes = [{ path: '', component: LandingComponent }];

@NgModule({
  imports: [CommonModule, AppMaterialModule, RouterModule.forChild(routes)],
  declarations: [LandingComponent],
  exports: [LandingComponent]
})
export class HomeModule {}
