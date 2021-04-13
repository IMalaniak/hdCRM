import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { plansFeatureKey, plansReducer, PlanEffects } from './store/plan';
import { stagesFeatureKey, stagesReducer, StageEffects } from './store/stage';
import { PlanService, StageService } from './services';

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
