import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { User } from '@/modules/users';
import { Asset } from '@/shared';
import { Observable } from 'rxjs/internal/Observable';
import { Preferences } from '@/core/reducers/preferences.reducer';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { select, Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';

@Component({
  selector: 'templates-user-details',
  templateUrl: './templates-user-details.component.html',
  styleUrls: ['./templates-user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesUserDetailsComponent {
  canViewDepartment$: Observable<Preferences> = this.store$.pipe(select(isPrivileged('department-view')));

  constructor(private store$: Store<AppState>) {}

  @Input() user: User;
  @Input() isDialog = false;

  @Output() addFileCall: EventEmitter<Asset> = new EventEmitter();

  onAddFile(asset: Asset): void {
    this.addFileCall.emit(asset);
  }
}
