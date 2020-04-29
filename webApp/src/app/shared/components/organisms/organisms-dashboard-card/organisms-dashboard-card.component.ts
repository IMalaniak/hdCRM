import { Component, Input } from '@angular/core';

@Component({
  selector: 'organisms-dashboard-card',
  template: `
    <div class="card" [ngClass]="{ shadow: !disableShadow }">
      <h5 *ngIf="title" class="card-title">{{ title }}</h5>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./organisms-dashboard-card.component.scss']
})
export class OrganismsDashboardCardComponent {
  @Input() title: string;
  @Input() disableShadow = false;
}
