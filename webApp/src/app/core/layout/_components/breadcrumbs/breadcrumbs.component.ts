import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from './breadcrumb';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})

export class BreadcrumbsComponent implements OnInit {

  public breadcrumbs: Breadcrumb[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.setBreadcrumbs();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.setBreadcrumbs();
    });
  }

  private setBreadcrumbs() {
    const home: Breadcrumb = {
      keyString: 'home',
      url: '/home'
    };
    const root: ActivatedRoute = this.activatedRoute.root;
    this.breadcrumbs = this.getBreadcrumbs(root);
    this.breadcrumbs = [home, ...this.breadcrumbs];
  }

  private getBreadcrumbs(activatedRoute: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

    // get the child routes
    const children: ActivatedRoute[] = activatedRoute.children;

    // return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }
    // iterate over each children
    for (const child of children) {
      // verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      // get the route's URL segment
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

      // append route URL to URL
      url += `/${routeURL}`;

      // add breadcrumb
      const breadcrumb: Breadcrumb = {
        keyString: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        url: url
      };
      breadcrumbs.push(breadcrumb);

      // recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }

}
