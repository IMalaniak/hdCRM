import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '@/core/store';
import { selectRoute } from '@/core/store/router.selectors';
import { BS_ICON, RoutingConstants } from '@/shared/constants';

import { Breadcrumb } from './breadcrumb';

@Component({
  selector: 'breadcrumbs-component',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  breadcrumbs$: Observable<Breadcrumb[]>;
  homeIcon = BS_ICON.House;

  constructor(private store$: Store<AppState>) {
    this.breadcrumbs$ = this.store$.pipe(
      select(selectRoute),
      map((currentRoute) => {
        const home: Breadcrumb = {
          keyString: 'home',
          url: RoutingConstants.ROUTE_HOME
        };
        const breadcrumbs = this.getBreadcrumbs(currentRoute);
        return [home, ...breadcrumbs];
      })
    );
  }

  private getBreadcrumbs(
    activatedRoute: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

    // get the child routes
    const children: ActivatedRouteSnapshot[] = activatedRoute.children;

    // iterate over each children
    children?.forEach((child) => {
      // verify the custom data property "breadcrumb" is specified on the route
      if (!child?.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      // get the route's URL segment
      const routeURL: string = child.url.map((segment) => segment.path).join('/');

      // append route URL to URL
      url += `/${routeURL}`;

      // add breadcrumb
      const breadcrumb: Breadcrumb = {
        keyString: child.data[ROUTE_DATA_BREADCRUMB],
        url
      };
      breadcrumbs.push(breadcrumb);

      // recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    });
    return breadcrumbs;
  }
}
