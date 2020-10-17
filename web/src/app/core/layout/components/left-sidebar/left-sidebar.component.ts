import { Component, OnInit, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from './menuItem';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { RoutingConstants, VIEW_PRIVILEGES } from '@/shared/constants';
import { MediaQueryService } from '@/core/services/media-query/media-query.service';

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

  constructor(private store$: Store<AppState>, private mediaQueryService: MediaQueryService) {}

  ngOnInit(): void {
    this.generateMenu();
  }

  private generateMenu(): void {
    this.sidebarMenu = [
      {
        url: RoutingConstants.ROUTE_HOME,
        title: 'Home',
        i18n: '@@sidebarMenuHome',
        icon: ['fas', 'home'],
        disable: !this.mediaQueryService.isPhone
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
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGES.USER)))
      },
      {
        url: RoutingConstants.ROUTE_ROLES,
        title: 'Roles',
        i18n: '@@sidebarMenuRoles',
        icon: ['fas', 'user-tag'],
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGES.ROLE)))
      },
      {
        url: RoutingConstants.ROUTE_PLANNER,
        title: 'Plans',
        i18n: '@@sidebarMenuPlans',
        icon: ['fas', 'list-alt'],
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGES.PLAN)))
      },
      {
        url: RoutingConstants.ROUTE_DEPARTMENTS,
        title: 'Departments',
        i18n: '@@sidebarMenuDepartments',
        icon: ['fas', 'building'],
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGES.DEPARTMENT)))
      }
    ];
  }
}
