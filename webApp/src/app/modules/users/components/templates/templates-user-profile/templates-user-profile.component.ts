import { Component, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { User, State, Organization } from '@/modules/users/models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { cloneDeep } from 'lodash';
import { Asset, ApiResponse } from '@/shared/models';
import { updateUserRequested, changeIsEditingState } from '@/modules/users/store/user.actions';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import * as fromLayout from '../../../../../core/layout/store';
import { updateUserOrgRequested, updateUserProfileRequested } from '@/core/auth/store/auth.actions';
import { ActivatedRoute } from '@angular/router';

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
  @Input() isProfilePage = false;

  enableDarkTheme$: Observable<boolean>;
  baseUrl = environment.baseUrl;
  coverUrl = './assets/images/userpic/noimage_croped.png';
  coverTitle = 'noimage';
  userInitial: User;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.enableDarkTheme$ = this.store.pipe(select(fromLayout.getDarkThemeState));
    if (this.canEdit) {
      let isEditing = this.route.snapshot.queryParams['edit'];
      if (isEditing) {
        isEditing = JSON.parse(isEditing);
        this.store.dispatch(changeIsEditingState({ isEditing }));
      }
    }
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
    if (asset) {
      this.setCover(asset);
    }
    const user = cloneDeep({ ...this.user, ...(asset && { avatar: asset, avatarId: asset.id }) });
    if (this.isProfilePage) {
      this.store.dispatch(updateUserProfileRequested({ user }));
    } else {
      this.store.dispatch(updateUserRequested({ user }));
    }
  }

  updateUser(user: User): void {
    this.user = user;
    this.updateUserStore();
  }

  updateUserOrg(organization: Organization): void {
    if (this.isProfilePage) {
      this.store.dispatch(updateUserOrgRequested({ organization }));
    } else {
      // @IMalaniak TODO update user org if needed
    }
  }

  isTabToShow(tab: string): boolean {
    return this.tabsToShow.includes(tab);
  }

  setFormEdit(isEditing: boolean): void {
    this.store.dispatch(changeIsEditingState({ isEditing }));
  }
}
