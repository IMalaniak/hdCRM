import { Component, OnInit, ViewEncapsulation, Input, HostBinding } from '@angular/core';
import { MediaqueryService } from '@/_shared/services';
import { MenuItem } from './menuItem';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  @Input() sidebarMinimized: boolean;
  @HostBinding('class.minimized') get minimized() { return this.sidebarMinimized; }
  sidebarMenu: MenuItem[];

  constructor(
    public mediaquery: MediaqueryService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.generateMenu();
  }


  // <!-- <li><a [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}" [routerLink]="['/users/myprofile']"><mat-icon>person</mat-icon><span class="item-title" i18n="@@sidebarMenuMyProfile">My profile</span></a></li> -->

  // <li [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}"><a [routerLink]="['/myplans']"><span class="item-title" i18n="@@sidebarMenuMyPlans">My Plans</span></a></li>
  // <li [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}"><a [routerLink]="['/calendar']"><span class="item-title" i18n="@@sidebarMenuCalendar">Calendar</span></a></li>


  generateMenu() {
    this.sidebarMenu = [
      {
        url: ['/home'],
        title: 'Home',
        i18n: '@@sidebarMenuHome',
        icon: ['fas', 'home'],
        disable: !this.mediaquery.isPhone
      }, {
        url: ['/dashboard'],
        title: 'Dashboard',
        i18n: '@@sidebarMenuDashboard',
        icon: ['fas', 'th-large']
      }, {
        url: ['/users'],
        title: 'Users',
        i18n: '@@sidebarMenuUsers',
        icon: ['fas', 'users'],
        privilege: this.store.pipe(select(isPrivileged('user-view')))
      }, {
        url: ['/roles'],
        title: 'Roles',
        i18n: '@@sidebarMenuRoles',
        icon: ['fas', 'user-tag'],
        privilege: this.store.pipe(select(isPrivileged('role-view')))
      }, {
        url: ['/planner'],
        title: 'Plans',
        i18n: '@@sidebarMenuPlans',
        icon: ['fas', 'list-alt'],
        privilege: this.store.pipe(select(isPrivileged('plan-view')))
      }, {
        url: ['/departments'],
        title: 'Departments',
        i18n: '@@sidebarMenuDepartments',
        icon: ['fas', 'building'],
        privilege: this.store.pipe(select(isPrivileged('department-view')))
      }, {
        url: ['/chats'],
        title: 'Chats',
        i18n: '@@sidebarMenuChats',
        icon: ['fas', 'sms'],
        privilege: this.store.pipe(select(isPrivileged('chat-view'))),
        disable: true
      }
    ];
  }

}
