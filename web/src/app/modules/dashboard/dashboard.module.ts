import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { DashboardComponent } from './components/dashboard.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Dashboard' },
    component: DashboardComponent
  }
];

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  declarations: [DashboardComponent],
  exports: [DashboardComponent]
})
export class DashboardModule {}
