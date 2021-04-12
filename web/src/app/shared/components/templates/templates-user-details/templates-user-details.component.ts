import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { select, Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { IconsService } from '@/core/services';
import { isPrivileged } from '@/core/modules/auth/store/auth.selectors';
import { User } from '@/core/modules/user-api/shared';
import { BS_ICON, VIEW_PRIVILEGE } from '@/shared/constants';
import { Asset } from '@/shared/models';

@Component({
  selector: 'templates-user-details',
  templateUrl: './templates-user-details.component.html',
  styleUrls: ['./templates-user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesUserDetailsComponent {
  @Input() user: User;
  @Input() isDialog = false;

  @Output() addFileCall: EventEmitter<Asset> = new EventEmitter();

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

  constructor(private store$: Store<AppState>, private readonly iconsService: IconsService) {
    this.iconsService.registerIcons([BS_ICON.ToggleOn, BS_ICON.FilePerson, BS_ICON.Envelope, BS_ICON.Telephone]);
  }

  onAddFile(asset: Asset): void {
    this.addFileCall.emit(asset);
  }
}
