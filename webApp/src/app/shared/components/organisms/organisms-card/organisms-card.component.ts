import { Component, Input } from '@angular/core';

@Component({
  selector: 'organisms-card',
  template: `
    <mat-card [ngClass]="{ shadow: !disableShadow }">
      <h5 *ngIf="cardTitle">{{ cardTitle }}</h5>
      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./organisms-card.component.scss']
})
export class OrganismsCardComponent {
  @Input() cardTitle: string;
  @Input() disableShadow = false;
}
