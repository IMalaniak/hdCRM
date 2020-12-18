import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { usersFeatureKey, reducer, UserEffects } from './store';
import { UserService } from './services';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(usersFeatureKey, reducer), EffectsModule.forFeature([UserEffects])],
  providers: [UserService]
})
export class UserApiModule {}
