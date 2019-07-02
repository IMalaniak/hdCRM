import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './_components';
import { AppMaterialModule } from '@/_shared/modules';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookSquare, faTwitterSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';

const routes: Routes = [
    {path: '', component: LandingComponent},
];

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LandingComponent
    ],
  exports: [
    LandingComponent
    ]
})
export class HomeModule {
  constructor() {
    library.add(faFacebookSquare, faTwitterSquare, faInstagram);
  }
}
