import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './_components';

const routes: Routes = [
    {path: '', component: LandingComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LandingComponent
    ],
  exports: [
    LandingComponent
    ]
})
export class HomeModule {}
