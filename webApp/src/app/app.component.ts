import { Component, OnInit } from '@angular/core';
import { appRouterTransition } from '@/shared';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [appRouterTransition]
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
