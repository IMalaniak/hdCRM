import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-public',
  template: `
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styles: []
})
export class PublicViewComponent {}