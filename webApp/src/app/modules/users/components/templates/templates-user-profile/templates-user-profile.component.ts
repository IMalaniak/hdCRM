import { Component, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { User, State } from '@/modules/users/models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { cloneDeep } from 'lodash';
import { Asset, ApiResponse } from '@/shared/models';
import { updateUserRequested } from '@/modules/users/store/user.actions';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import * as fromLayout from '../../../../../core/layout/store';

@Component({
  selector: 'templates-user-profile',
  templateUrl: './templates-user-profile.component.html',
  styleUrls: ['./templates-user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesUserProfileComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Input() currentSessionId: number;
  @Input() states: State[];
  @Input() canEdit: boolean;
  @Input() isLoading: boolean;
  @Input() serverResponse: ApiResponse;
  @Input() editForm: boolean;
  @Input() tabsToShow: string[] = ['details'];

  enableDarkTheme$: Observable<boolean>;
  baseUrl = environment.baseUrl;
  coverUrl = './assets/images/userpic/noimage_croped.png';
  coverTitle = 'noimage';
  userInitial: User;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.enableDarkTheme$ = this.store.pipe(select(fromLayout.getDarkThemeState));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']?.currentValue && this.user) {
      this.userInitial = cloneDeep(this.user);
      if (this.user.avatar) {
        this.setCover(this.user.avatar);
      }
    }
  }

  setCover(cover: Asset): void {
    this.coverUrl = this.baseUrl + cover.location + '/' + cover.title;
    this.coverTitle = cover.title;
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

  get isPasswordTabShow(): boolean {
    return this.tabsToShow.includes('password');
  }

  get isShowSessionTab(): boolean {
    return this.tabsToShow.includes('sessions');
  }
}
