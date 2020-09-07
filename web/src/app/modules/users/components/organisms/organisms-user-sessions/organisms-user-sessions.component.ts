import { Component, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { UserSession, User } from '@/modules/users';
import { AppState } from '@/core/reducers';
import { Store } from '@ngrx/store';
import { deleteSession, deleteMultipleSession } from '@/core/auth/store/auth.actions';
import { UAParser } from 'ua-parser-js';
import { ToastMessageService } from '@/shared/services';

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

  constructor(private store: Store<AppState>, private toastMessageService: ToastMessageService) {}

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

  onRemoveSession(sessionId: number): void {
    this.toastMessageService
      .confirm('Are you sure?', 'Do you really want to deactivate this session? You will not be able to recover this!')
      .then((result) => {
        if (result.value) {
          this.removeSession(sessionId);
        }
      });
  }

  onRemoveOtherSessions(): void {
    this.toastMessageService
      .confirm(
        'Are you sure?',
        'Do you really want to deactivate all other active sessions? Current session will stay active!'
      )
      .then((result) => {
        if (result.value) {
          const sessionIds: number[] = this.otherActiveSessions.map((session) => session.id);
          this.removeSession(sessionIds);
        }
      });
  }

  removeSession(sessionIds: number | number[]): void {
    if (typeof sessionIds === 'number') {
      this.store.dispatch(deleteSession({ id: sessionIds }));
    } else {
      this.store.dispatch(deleteMultipleSession({ sessionIds }));
    }
  }
}
