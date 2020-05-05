import { Component, OnInit, Input } from '@angular/core';
import { User, State } from '@/modules/users/models';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { allStatesRequested } from '@/modules/users/store/state.actions';
import { selectAllStates } from '@/modules/users/store/state.selectors';
import Swal from 'sweetalert2';
import { cloneDeep } from 'lodash';
import { Asset } from '@/shared/models';
import { ActivatedRoute } from '@angular/router';
import { updateUserRequested, changeIsEditingState } from '@/modules/users/store/user.actions';
import { selectIsEditing } from '@/modules/users/store/user.selectors';
import { environment } from 'environments/environment';

@Component({
  selector: 'templates-user-profile-page',
  templateUrl: './templates-user-profile-page.component.html',
  styleUrls: ['./templates-user-profile-page.component.scss']
})
export class TemplatesUserProfilePageComponent implements OnInit {
  baseUrl = environment.baseUrl;
  @Input() user: User;
  @Input() canEdit = false;
  editForm$: Observable<boolean>;
  coverUrl = './assets/images/userpic/noimage_croped.png';
  coverTitle = 'noimage';

  userInitial: User;
  states$: Observable<State[]>;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.store.dispatch(allStatesRequested());
    this.states$ = this.store.pipe(select(selectAllStates));
    this.editForm$ = this.store.pipe(select(selectIsEditing));
    this.userInitial = cloneDeep(this.user);
    if (!!this.user.avatar) {
      this.setCover(this.user.avatar);
    }

    if (this.canEdit) {
      let isEditing = this.route.snapshot.queryParams['edit'];
      if (isEditing) {
        isEditing = JSON.parse(isEditing);
        this.store.dispatch(changeIsEditingState({ isEditing }));
      }
    }
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
}
