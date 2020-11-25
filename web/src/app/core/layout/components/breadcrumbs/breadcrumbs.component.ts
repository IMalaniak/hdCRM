import { AppState, selectRoute } from '@/core/reducers';
import { BS_ICONS } from '@/shared/constants';
import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breadcrumb } from './breadcrumb';

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent {
  breadcrumbs$: Observable<Breadcrumb[]>;
  homeIcon = BS_ICONS.House;

  constructor(private store$: Store<AppState>) {
    this.breadcrumbs$ = this.store$.pipe(
      select(selectRoute),
      map((currentRoute) => {
        const home: Breadcrumb = {
          keyString: 'home',
          url: '/home'
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

    // return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }
    // iterate over each children
    children.forEach((child) => {
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
        url: url
      };
      breadcrumbs.push(breadcrumb);

      // recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    });
    return breadcrumbs;
  }
}
