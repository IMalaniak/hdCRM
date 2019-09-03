import { Component, OnInit, ViewEncapsulation, Input, HostBinding } from '@angular/core';
import { MediaqueryService } from '@/_shared/services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  @Input() sidebarMinimized: boolean;
  @HostBinding('class.minimized') get minimized() { return this.sidebarMinimized; }

  constructor(
    public mediaquery: MediaqueryService
  ) { }

  ngOnInit() {
  }

}
