import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';

import { isPrivileged } from '@core/modules/auth/store/auth.selectors';
import { User } from '@core/modules/user-api/shared';
import { IconsService } from '@core/services';
import { AppState } from '@core/store';
import { BS_ICON, LINK_TYPE, VIEW_PRIVILEGE } from '@shared/constants';

@Component({
  selector: 'templates-user-details',
  templateUrl: './templates-user-details.component.html',
  styleUrls: ['./templates-user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesUserDetailsComponent {
  @Input() user: User;
  @Input() isDialog = false;

  canViewDepartment$: Observable<boolean> = this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGE.DEPARTMENT)));

  icons: { [key: string]: BS_ICON } = {
    user: BS_ICON.Person,
    info: BS_ICON.InfoSquare,
    department: BS_ICON.Building,
    role: BS_ICON.Person,
    state: BS_ICON.ToggleOn,
    contacts: BS_ICON.FilePerson,
    mail: BS_ICON.Envelope,
    phone: BS_ICON.Telephone
  };
  linkTypes: typeof LINK_TYPE = LINK_TYPE;

  constructor(private store$: Store<AppState>, private readonly iconsService: IconsService) {
    this.iconsService.registerIcons([BS_ICON.ToggleOn, BS_ICON.FilePerson, BS_ICON.Envelope, BS_ICON.Telephone]);
  }
}
