import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PlanService, StageService } from './services';
import { plansFeatureKey, plansReducer, PlanEffects } from './store/plan';
import { stagesFeatureKey, stagesReducer, StageEffects } from './store/stage';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(plansFeatureKey, plansReducer),
    StoreModule.forFeature(stagesFeatureKey, stagesReducer),
    EffectsModule.forFeature([PlanEffects, StageEffects])
  ],
  providers: [PlanService, StageService]
})
export class PlanApiModule {}
