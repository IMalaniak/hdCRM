import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleService, PrivilegeService } from './services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { privilegesFeatureKey, privilegesReducer, PrivilegeEffects } from './store/privilege';
import { rolesFeatureKey, rolesReducer, RoleEffects } from './store/role';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(rolesFeatureKey, rolesReducer),
    StoreModule.forFeature(privilegesFeatureKey, privilegesReducer),
    EffectsModule.forFeature([RoleEffects, PrivilegeEffects])
  ],
  providers: [RoleService, PrivilegeService]
})
export class RoleApiModule {}
