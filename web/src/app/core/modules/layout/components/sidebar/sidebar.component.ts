import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { isPrivileged } from '@core/modules/auth/store/auth.selectors';
import { IconsService, MediaQueryService } from '@core/services';
import { AppState } from '@core/store';
import { BS_ICON, RoutingConstants, VIEW_PRIVILEGE } from '@shared/constants';

import { MenuItem } from './menuItem';

@Component({
  selector: 'sidebar-component',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Input() sidebarMinimized: boolean;

  @HostBinding('class.minimized') get minimized(): boolean {
    return this.sidebarMinimized;
  }

  sidebarMenuItems: MenuItem[];

  constructor(
    private store$: Store<AppState>,
    private mediaQueryService: MediaQueryService,
    private readonly iconsService: IconsService
  ) {
    this.iconsService.registerIcons([
      BS_ICON.House,
      BS_ICON.Building,
      BS_ICON.Calendar2Week,
      BS_ICON.Person,
      BS_ICON.People,
      BS_ICON.ColumnsGap
    ]);

    this.generateMenu();
  }

  private generateMenu(): void {
    this.sidebarMenuItems = [
      {
        url: RoutingConstants.ROUTE_HOME,
        title: 'Home',
        i18n: '@@sidebarMenuHome',
        icon: BS_ICON.House,
        disable: !this.mediaQueryService.isPhone
      },
      {
        url: RoutingConstants.ROUTE_DASHBOARD,
        title: 'Dashboard',
        i18n: '@@sidebarMenuDashboard',
        icon: BS_ICON.ColumnsGap
      },
      {
        url: RoutingConstants.ROUTE_USERS,
        title: 'Users',
        i18n: '@@sidebarMenuUsers',
        icon: BS_ICON.People,
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGE.USER)))
      },
      {
        url: RoutingConstants.ROUTE_ROLES,
        title: 'Roles',
        i18n: '@@sidebarMenuRoles',
        icon: BS_ICON.Person,
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGE.ROLE)))
      },
      {
        url: RoutingConstants.ROUTE_PLANNER,
        title: 'Plans',
        i18n: '@@sidebarMenuPlans',
        icon: BS_ICON.Calendar2Week,
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGE.PLAN)))
      },
      {
        url: RoutingConstants.ROUTE_DEPARTMENTS,
        title: 'Departments',
        i18n: '@@sidebarMenuDepartments',
        icon: BS_ICON.Building,
        privilege: this.store$.pipe(select(isPrivileged(VIEW_PRIVILEGE.DEPARTMENT)))
      }
    ];
  }
}
