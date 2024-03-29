import { Component, Input, ContentChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'organisms-card',
  template: `
    <mat-card [ngClass]="[cardClasses]">
      <div [ngClass]="[headClasses]">
        <span
          class="mat-title mb-0"
          matBadge="{{ counter }}"
          matBadgeSize="small"
          matBadgeColor="primary"
          matBadgeHidden="{{ hideCounter }}"
          >{{ cardTitle }}</span
        >
        <div class="card-actions">
          <ng-content select="[buttons]"></ng-content>
        </div>
      </div>
      <mat-card-content [ngClass]="[contentClasses]">
        <div *ngIf="showDataLoader" class="progress-spinner-overlay">
          <mat-progress-bar mode="query"></mat-progress-bar>
        </div>
        <ng-content select="[content]"></ng-content>
      </mat-card-content>
      <mat-card-footer *ngIf="footer">
        <ng-content select="[footer]"></ng-content>
      </mat-card-footer>
    </mat-card>
  `,
  styleUrls: ['./organisms-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsCardComponent {
  @Input() cardTitle: string;
  @Input() cardClass: string;
  @Input() contentClass: string;
  @Input() showDataLoader: boolean;
  @Input() headClass: string;
  @Input() disableShadow = false;
  @Input() elevation: number; // 0-24
  @Input() counter: number;

  @ContentChild('content') content: ElementRef;
  @ContentChild('subheader') subheader: ElementRef;
  @ContentChild('buttons') buttons: ElementRef;
  @ContentChild('footer') footer: ElementRef;

  get hideCounter(): boolean {
    return this.counter && this.counter === 0;
  }

  get cardClasses(): string {
    return `card ${this.cardClass} ${
      this.disableShadow ? 'mat-elevation-z0' : this.elevation && `mat-elevation-z${this.elevation}`
    }`.trim();
  }

  get contentClasses(): string {
    return `${this.contentClass}`;
  }

  get headClasses(): string {
    return `card-header ${this.headClass}`;
  }
}
