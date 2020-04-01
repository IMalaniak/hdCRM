import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'atoms-icon-button',
  template: `
    <button type="{{type}}" mat-button color="{{ color }}" class="crm-button mat-{{ matType }}-button" [disabled]="disabled">
      <fa-icon *ngIf="icon" [icon]="icon"></fa-icon>
      <span><ng-content></ng-content></span>
    </button>
  `,
  styleUrls: ['./atoms-icon-button.component.scss']
})
export class AtomsIconButtonComponent {
  @Input() color = 'primary';
  @Input() icon: string;
  @Input() type = 'button';
  @Input() matType = 'raised';
  @Input() disabled = false;

  @HostBinding('class.d-inline-block') displayInline = true;

  constructor() {}
}
