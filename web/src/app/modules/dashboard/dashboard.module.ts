import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { SharedModule } from '@/shared/shared.module';

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
