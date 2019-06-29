import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MediaqueryService } from '@/_shared/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import * as authActions from '@/core/auth/store/auth.actions';
import { User } from '@/_modules/users';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidebarMinimized: boolean;
  @Input() currentUser: User;
  @Output()
  hideSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    public mediaquery: MediaqueryService,
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {

  }

  onLogoutClick() {
    this.store.dispatch(new authActions.LogOut());
    this.router.navigate(['/home']);
    Swal.fire({
      text: 'Logged out!',
      type: 'info',
      timer: 1000
    });
  }

  toogleSidebar() {
    this.hideSidebar.emit(!this.sidebarMinimized);
  }

}
