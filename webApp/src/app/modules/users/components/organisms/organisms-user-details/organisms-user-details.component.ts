import { Component, Input, OnInit } from '@angular/core';
import { User, State } from '@/modules/users';
import { AppState } from '@/core/reducers';
import { Store } from '@ngrx/store';
import { changeIsEditingState, updateUserRequested } from '@/modules/users/store/user.actions';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'organisms-user-details',
  templateUrl: './organisms-user-details.component.html',
  styleUrls: ['./organisms-user-details.component.scss']
})
export class OrganismsUserDetailsComponent implements OnInit {
  @Input() user: User;
  @Input() states: State[];
  @Input() canEdit = false;
  @Input() editForm: boolean;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
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
        this.store.dispatch(updateUserRequested({ user: this.user }));
      }
    });
  }
}
