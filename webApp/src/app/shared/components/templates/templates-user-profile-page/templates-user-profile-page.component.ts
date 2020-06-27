import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { User, State, UserSession } from '@/modules/users/models';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { allStatesRequested } from '@/modules/users/store/state.actions';
import Swal from 'sweetalert2';
import { cloneDeep } from 'lodash';
import { Asset, NewPassword, ApiResponse } from '@/shared/models';
import { ActivatedRoute } from '@angular/router';
import { updateUserRequested, changeIsEditingState } from '@/modules/users/store/user.actions';
import { selectIsEditing } from '@/modules/users/store/user.selectors';
import { environment } from 'environments/environment';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '@/shared/validators';
import { UAParser } from 'ua-parser-js';

@Component({
  selector: 'templates-user-profile-page',
  templateUrl: './templates-user-profile-page.component.html',
  styleUrls: ['./templates-user-profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesUserProfilePageComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Input() currentSessionId: number;
  @Input() states: State[];
  @Input() canEdit = false;
  @Input() isLoading: boolean;
  @Input()
  set serverResponse(serverResponse: ApiResponse) {
    if (serverResponse) {
      this.serverResp = serverResponse;
      setTimeout(() => {
        this.serverResp = null;
      }, 5000);
    }
  }
  @Input() tabsToShow: string[] = ['details'];

  @Output() changePassword: EventEmitter<NewPassword> = new EventEmitter();

  @Output() removeSession: EventEmitter<number | number[]> = new EventEmitter();

  baseUrl = environment.baseUrl;
  editForm$: Observable<boolean>;
  coverUrl = './assets/images/userpic/noimage_croped.png';
  coverTitle = 'noimage';
  userInitial: User;
  userNewPassword: FormGroup;
  serverResp: ApiResponse;

  currentSession: UserSession;
  otherActiveSessions: UserSession[];

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.store.dispatch(allStatesRequested());
    this.editForm$ = this.store.pipe(select(selectIsEditing));

    if (this.canEdit) {
      let isEditing = this.route.snapshot.queryParams['edit'];
      if (isEditing) {
        isEditing = JSON.parse(isEditing);
        this.store.dispatch(changeIsEditingState({ isEditing }));
      }
    }

    if (this.isPasswordTabShow) {
      this.buildUserNewPassword();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']?.currentValue && this.user) {
      this.userInitial = cloneDeep(this.user);
      if (!!this.user?.avatar) {
        this.setCover(this.user.avatar);
      }

      if (this.isShowSessionTab) {
        this.mapUserSessions();
      }
    }
  }

  mapUserSessions() {
    this.currentSession = this.user.UserSessions.find(uSession => uSession.id === this.currentSessionId);
    this.otherActiveSessions = this.user.UserSessions.filter(
      uSession => uSession.id !== this.currentSessionId && uSession.isSuccess
    );
  }

  buildUserNewPassword(): void {
    this.userNewPassword = this.fb.group(
      {
        oldPassword: new FormControl(null, Validators.required),
        newPassword: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(64)]),
        verifyPassword: new FormControl(null, Validators.required)
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword
      }
    );
  }

  onClickEdit(): void {
    this.store.dispatch(changeIsEditingState({ isEditing: true }));
  }

  onClickCancelEdit(): void {
    this.store.dispatch(changeIsEditingState({ isEditing: false }));
    this.user = cloneDeep(this.userInitial);
  }

  setCover(cover: Asset): void {
    this.coverUrl = this.baseUrl + cover.location + '/' + cover.title;
    this.coverTitle = cover.title;
  }

  onUpdateUserSubmit(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to save changes? You will not be able to recover this!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.value) {
        this.updateUserStore();
      }
    });
  }

  updateUserStore(asset?: Asset): void {
    const user = cloneDeep(this.user);
    if (asset) {
      user.avatar = asset;
      user.avatarId = asset.id;
      this.setCover(asset);
    }
    this.store.dispatch(updateUserRequested({ user }));
  }

  changeOldPassword(event: NewPassword): void {
    this.userNewPassword.reset();
    this.changePassword.emit(event);
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
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to deactivate this session? You will not be able to recover this!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.value) {
        this.removeSession.emit(sessionId);
      }
    });
  }

  onRemoveOtherSessions(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to deactivate all other active sessions? Current session will stay active!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.value) {
        const sessionIds: number[] = this.otherActiveSessions.map(session => session.id);
        this.removeSession.emit(sessionIds);
      }
    });
  }

  get isPasswordTabShow(): boolean {
    return this.tabsToShow.includes('password');
  }

  get isShowSessionTab(): boolean {
    return this.tabsToShow.includes('session');
  }
}
