import { Component, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { UserSession, User } from '@/modules/users';
import { AppState } from '@/core/reducers';
import { Store } from '@ngrx/store';
import { deleteSession, deleteMultipleSession } from '@/core/auth/store/auth.actions';
import { UAParser } from 'ua-parser-js';
import { MAT_BUTTON, THEME_PALETTE, CONSTANTS } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';

@Component({
  selector: 'organisms-user-sessions',
  templateUrl: './organisms-user-sessions.component.html',
  styleUrls: ['./organisms-user-sessions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserSessionsComponent implements OnChanges {
  @Input() user: User;
  @Input() currentSessionId: number;

  currentSession: UserSession;
  otherActiveSessions: UserSession[];

  themePalette = THEME_PALETTE;
  matButtonType = MAT_BUTTON;

  constructor(private store: Store<AppState>, private dialogService: DialogService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']?.currentValue && this.user) {
      this.mapUserSessions();
    }
  }

  mapUserSessions(): void {
    this.currentSession = this.user.UserSessions.find((uSession) => uSession.id === this.currentSessionId);
    this.otherActiveSessions = this.user.UserSessions.filter(
      (uSession) => uSession.id !== this.currentSessionId && uSession.isSuccess
    );
  }

  parseUA(ua: string): string {
    const parsedUA = new UAParser(ua);
    return `${parsedUA.getBrowser().name} on ${parsedUA.getOS().name} ${parsedUA.getOS().version}`;
  }

  getDeviceIcon(ua: string): string[] {
    const parsedUA = new UAParser(ua);
    let icon: string[];
    switch (parsedUA.getDevice().type) {
      case 'mobile':
        icon = ['fas', 'mobile-alt'];
        break;

      case 'tablet':
        icon = ['fas', 'tablet-alt'];
        break;

      default:
        icon = ['fas', 'desktop'];
        break;
    }
    return icon;
  }

  onRemove(sessionId: number | number[], messageText: string): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(messageText);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () => this.removeSession(sessionId));
  }

  onRemoveSession(sessionId: number): void {
    this.onRemove(sessionId, CONSTANTS.TEXTS_SESSION_DEACTIVATE_CONFIRM);
  }

  onRemoveOtherSessions(): void {
    const sessionIds: number[] = this.otherActiveSessions.map((session) => session.id);
    this.onRemove(sessionIds, CONSTANTS.TEXTS_SESSION_DEACTIVATE_ALL_CONFIRM);
  }

  removeSession(sessionIds: number | number[]): void {
    if (typeof sessionIds === 'number') {
      this.store.dispatch(deleteSession({ id: sessionIds }));
    } else {
      this.store.dispatch(deleteMultipleSession({ sessionIds }));
    }
  }
}
