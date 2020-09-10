import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { User } from '@/modules/users';
import { Asset } from '@/shared';
import { Observable } from 'rxjs/internal/Observable';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { select, Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { VIEW_PRIVILEGES } from '@/shared/constants';

@Component({
  selector: 'templates-user-details',
  templateUrl: './templates-user-details.component.html',
  styleUrls: ['./templates-user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesUserDetailsComponent {
  canViewDepartment$: Observable<boolean> = this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGES.DEPARTMENT)));

  constructor(private store$: Store<AppState>) {}

  @Input() user: User;
  @Input() isDialog = false;

  @Output() addFileCall: EventEmitter<Asset> = new EventEmitter();

  onAddFile(asset: Asset): void {
    this.addFileCall.emit(asset);
  }
}
