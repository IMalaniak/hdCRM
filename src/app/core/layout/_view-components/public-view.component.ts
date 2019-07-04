import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-public',
  template: `
  <section class="main">
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  </section>  
  `,
  styles: [`
    section.main {
      height: 100%;
      overflow-y: auto;
      scroll-behavior: smooth;
    }
  `]
})
export class PublicViewComponent {}