import { Component } from '@angular/core';
import { appRouterTransition } from '@/shared';
import { RouterOutlet, Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter, delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [appRouterTransition]
})
export class AppComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  constructor(private router: Router, private viewportScroller: ViewportScroller) {
    this.router.events
      .pipe(
        filter((e: any): e is Scroll => e instanceof Scroll),
        delay(0)
      )
      .subscribe(e => {
        if (e.position) {
          this.viewportScroller.scrollToPosition(e.position);
        } else if (e.anchor) {
          this.viewportScroller.scrollToAnchor(e.anchor);
        } else {
          this.viewportScroller.scrollToPosition([0, 0]);
          window.scrollTo(0, 0);
        }
      });
  }
}
