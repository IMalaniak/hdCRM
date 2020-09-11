import { Component, OnInit, ViewEncapsulation, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { MediaqueryService } from '@/shared/services';
import { MenuItem } from './menuItem';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';

@Component({
  selector: 'left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftSidebarComponent implements OnInit {
  @Input() leftSidebarMinimized: boolean;

  @HostBinding('class.minimized') get minimized(): boolean {
    return this.leftSidebarMinimized;
  }

  sidebarMenu: MenuItem[];

  constructor(public mediaquery: MediaqueryService, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.generateMenu();
  }

  // <!-- <li><a [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}" [routerLink]="['/users/myprofile']"><mat-icon>person</mat-icon><span class="item-title" i18n="@@sidebarMenuMyProfile">My profile</span></a></li> -->

  // <li [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}"><a [routerLink]="['/myplans']"><span class="item-title" i18n="@@sidebarMenuMyPlans">My Plans</span></a></li>
  // <li [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}"><a [routerLink]="['/calendar']"><span class="item-title" i18n="@@sidebarMenuCalendar">Calendar</span></a></li>

  generateMenu(): void {
    this.sidebarMenu = [
      {
        url: ['/home'],
        title: 'Home',
        i18n: '@@sidebarMenuHome',
        icon: ['fas', 'home'],
        disable: !this.mediaquery.isPhone
      },
      {
        url: ['/dashboard'],
        title: 'Dashboard',
        i18n: '@@sidebarMenuDashboard',
        icon: ['fas', 'th-large']
      },
      {
        url: ['/users'],
        title: 'Users',
        i18n: '@@sidebarMenuUsers',
        icon: ['fas', 'users'],
        privilege: this.store.pipe(select(isPrivileged('user-view')))
      },
      {
        url: ['/roles'],
        title: 'Roles',
        i18n: '@@sidebarMenuRoles',
        icon: ['fas', 'user-tag'],
        privilege: this.store.pipe(select(isPrivileged('role-view')))
      },
      {
        url: ['/planner'],
        title: 'Plans',
        i18n: '@@sidebarMenuPlans',
        icon: ['fas', 'list-alt'],
        privilege: this.store.pipe(select(isPrivileged('plan-view')))
      },
      {
        url: ['/departments'],
        title: 'Departments',
        i18n: '@@sidebarMenuDepartments',
        icon: ['fas', 'building'],
        privilege: this.store.pipe(select(isPrivileged('department-view')))
      },
      {
        url: ['/chats'],
        title: 'Chats',
        i18n: '@@sidebarMenuChats',
        icon: ['fas', 'sms'],
        privilege: this.store.pipe(select(isPrivileged('chat-view')))
      }
    ];
  }
}
