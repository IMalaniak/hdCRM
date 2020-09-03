import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components';
import { SharedModule } from '@/shared/shared.module';

const routes: Routes = [{ path: '', component: LandingComponent }];

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  declarations: [LandingComponent],
  exports: [LandingComponent]
})
export class HomeModule {}
