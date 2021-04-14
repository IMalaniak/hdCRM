import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { appRouterTransition } from '@shared/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [appRouterTransition]
})
export class AppComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
