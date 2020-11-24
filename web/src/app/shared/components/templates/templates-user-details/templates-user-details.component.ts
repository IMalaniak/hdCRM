import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { User } from '@/modules/users';
import { Asset } from '@/shared/models';
import { Observable } from 'rxjs/internal/Observable';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { select, Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { BS_ICONS, VIEW_PRIVILEGES } from '@/shared/constants';
import { IconsService } from '@/core/services';

@Component({
  selector: 'templates-user-details',
  templateUrl: './templates-user-details.component.html',
  styleUrls: ['./templates-user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesUserDetailsComponent {
  canViewDepartment$: Observable<boolean> = this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGES.DEPARTMENT)));

  @Input() user: User;
  @Input() isDialog = false;

  @Output() addFileCall: EventEmitter<Asset> = new EventEmitter();

  icons: { [key: string]: BS_ICONS } = {
    user: BS_ICONS.Person,
    info: BS_ICONS.InfoSquare,
    department: BS_ICONS.Building,
    role: BS_ICONS.Person,
    state: BS_ICONS.ToggleOn,
    contacts: BS_ICONS.FilePerson,
    mail: BS_ICONS.Envelope,
    phone: BS_ICONS.Telephone
  };

  constructor(private store$: Store<AppState>, private iconsService: IconsService) {
    this.iconsService.registerIcons([BS_ICONS.ToggleOn, BS_ICONS.FilePerson, BS_ICONS.Envelope, BS_ICONS.Telephone]);
  }

  onAddFile(asset: Asset): void {
    this.addFileCall.emit(asset);
  }
}
