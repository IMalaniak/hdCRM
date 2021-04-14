import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UserService } from './services';
import { usersFeatureKey, reducer, UserEffects } from './store';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(usersFeatureKey, reducer), EffectsModule.forFeature([UserEffects])],
  providers: [UserService]
})
export class UserApiModule {}
