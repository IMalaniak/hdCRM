import { Component, Input } from '@angular/core';

@Component({
  selector: 'organisms-card',
  template: `
    <div class="card" [ngClass]="{ shadow: !disableShadow }">
      <h5 *ngIf="title" class="card-title">{{ title }}</h5>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./organisms-card.component.scss']
})
export class OrganismsCardComponent {
  @Input() title: string;
  @Input() disableShadow = false;
}
