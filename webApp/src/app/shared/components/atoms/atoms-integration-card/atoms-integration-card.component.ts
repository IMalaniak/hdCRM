import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'atoms-integration-card',
  template: `
    <div class="integration-card" [style.background-color]="bgColor" [ngClass]="[classes]" (click)="onClick($event)">
      <img src="{{ src }}" alt="{{ title }}" [style.max-width.%]="imgMWidth" [ngClass]="{ 'not-active': isEnabled }" />
    </div>
  `,
  styleUrls: ['./atoms-integration-card.component.scss']
})
export class AtomsIntegrationCardComponent {
  @Input() src: string;

  @Input() title = 'noimage';

  @Input() imgMWidth: number;

  @Input() bgColor: string;

  @Input() cardClass: string;

  @Input() isEnabled: boolean;

  @Output() onclick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    this.onclick.emit(event);
  }

  get classes(): string {
    return this.cardClass;
  }
}
