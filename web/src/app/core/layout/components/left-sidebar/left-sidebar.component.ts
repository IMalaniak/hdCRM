import { Component, OnInit, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { MediaqueryService } from '@/shared/services';
import { MenuItem } from './menuItem';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { RoutingConstants } from '@/shared/constants';

@Component({
  selector: 'left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
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

  generateMenu(): void {
    this.sidebarMenu = [
      {
        url: RoutingConstants.ROUTE_HOME,
        title: 'Home',
        i18n: '@@sidebarMenuHome',
        icon: ['fas', 'home'],
        disable: !this.mediaquery.isPhone
      },
      {
        url: RoutingConstants.ROUTE_DASHBOARD,
        title: 'Dashboard',
        i18n: '@@sidebarMenuDashboard',
        icon: ['fas', 'th-large']
      },
      {
        url: RoutingConstants.ROUTE_USERS,
        title: 'Users',
        i18n: '@@sidebarMenuUsers',
        icon: ['fas', 'users'],
        privilege: this.store.pipe(select(isPrivileged('user-view')))
      },
      {
        url: RoutingConstants.ROUTE_ROLES,
        title: 'Roles',
        i18n: '@@sidebarMenuRoles',
        icon: ['fas', 'user-tag'],
        privilege: this.store.pipe(select(isPrivileged('role-view')))
      },
      {
        url: RoutingConstants.ROUTE_PLANNER,
        title: 'Plans',
        i18n: '@@sidebarMenuPlans',
        icon: ['fas', 'list-alt'],
        privilege: this.store.pipe(select(isPrivileged('plan-view')))
      },
      {
        url: RoutingConstants.ROUTE_DEPARTMENTS,
        title: 'Departments',
        i18n: '@@sidebarMenuDepartments',
        icon: ['fas', 'building'],
        privilege: this.store.pipe(select(isPrivileged('department-view')))
      }
    ];
  }
}
