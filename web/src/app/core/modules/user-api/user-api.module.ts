import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { usersFeatureKey, reducer } from './store/user-api.reducer';
import { UserEffects } from './store';
import { UserService } from './services';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(usersFeatureKey, reducer), EffectsModule.forFeature([UserEffects])],
  providers: [UserService]
})
export class UserApiModule {}
