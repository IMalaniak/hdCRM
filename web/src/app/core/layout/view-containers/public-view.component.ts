import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-public',
  template: `
    <section class="main">
      <router-outlet></router-outlet>
      <footer-component></footer-component>
    </section>
  `,
  styles: [
    `
      section.main {
        position: relative;
        height: 100vh;
        overflow-y: auto;
        scroll-behavior: smooth;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicViewComponent {}
