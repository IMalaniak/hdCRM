import { Component, OnInit, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { IconsService, MediaQueryService } from '@/core/services';
import { BS_ICONS, RoutingConstants, VIEW_PRIVILEGES } from '@/shared/constants';
import { MenuItem } from './menuItem';

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

  constructor(
    private store$: Store<AppState>,
    private mediaQueryService: MediaQueryService,
    private iconsService: IconsService
  ) {
    this.iconsService.registerIcons([
      BS_ICONS.House,
      BS_ICONS.Building,
      BS_ICONS.Calendar2Week,
      BS_ICONS.Person,
      BS_ICONS.People,
      BS_ICONS.ColumnsGap
    ]);
  }

  ngOnInit(): void {
    this.generateMenu();
  }

  private generateMenu(): void {
    this.sidebarMenu = [
      {
        url: RoutingConstants.ROUTE_HOME,
        title: 'Home',
        i18n: '@@sidebarMenuHome',
        icon: BS_ICONS.House,
        disable: !this.mediaQueryService.isPhone
      },
      {
        url: RoutingConstants.ROUTE_DASHBOARD,
        title: 'Dashboard',
        i18n: '@@sidebarMenuDashboard',
        icon: BS_ICONS.ColumnsGap
      },
      {
        url: RoutingConstants.ROUTE_USERS,
        title: 'Users',
        i18n: '@@sidebarMenuUsers',
        icon: BS_ICONS.People,
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGES.USER)))
      },
      {
        url: RoutingConstants.ROUTE_ROLES,
        title: 'Roles',
        i18n: '@@sidebarMenuRoles',
        icon: BS_ICONS.Person,
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGES.ROLE)))
      },
      {
        url: RoutingConstants.ROUTE_PLANNER,
        title: 'Plans',
        i18n: '@@sidebarMenuPlans',
        icon: BS_ICONS.Calendar2Week,
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGES.PLAN)))
      },
      {
        url: RoutingConstants.ROUTE_DEPARTMENTS,
        title: 'Departments',
        i18n: '@@sidebarMenuDepartments',
        icon: BS_ICONS.Building,
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGES.DEPARTMENT)))
      }
    ];
  }
}
