import { Component, OnInit } from '@angular/core';
import { appRouterTransition } from '@/_shared/animations/app-transition';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './_shared/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [appRouterTransition]
})
export class AppComponent implements OnInit {
  constructor(private scktService: SocketService) {}

  ngOnInit() {
    this.scktService.initSocket();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
