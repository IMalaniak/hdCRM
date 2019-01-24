import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService, PrivilegeService, AuthenticationService } from '@/_services';

@Component({
  selector: '.app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessagesComponent implements OnInit {
  showDebugContainer: boolean;

  constructor(
    public messageService: MessageService,
    private privilegeService: PrivilegeService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    if (this.authService.validToken()) {
      this.showDebugContainer = this.privilegeService.checkUserPrivilege('showDebug');
    }
  }

}
