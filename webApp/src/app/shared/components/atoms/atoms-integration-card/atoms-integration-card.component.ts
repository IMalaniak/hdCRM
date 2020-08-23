import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'atoms-integration-card',
  template: `
    <div class="integration-card" [ngClass]="[classes]" (click)="onClick($event)">
      <img src="{{ src }}" alt="{{ title }}" />
    </div>
  `,
  styleUrls: ['./atoms-integration-card.component.scss']
})
export class AtomsIntegrationCardComponent {
  @Input() src: string;

  @Input() title = 'noimage';

  @Input() cardClass = '';

  @Input() isEnabled: boolean;

  @Output() onclick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    this.onclick.emit(event);
  }

  get classes(): string {
    let active = this.isEnabled ? 'active' : '';
    return (active += ` ${this.cardClass}`);
  }
}
