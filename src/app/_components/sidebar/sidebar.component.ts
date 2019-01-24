import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '@/_services';

@Component({
  selector: '.app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
  }



}
