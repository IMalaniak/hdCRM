import { Component, Input, HostBinding, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'atoms-icon-button',
  template: `
    <ng-container [ngSwitch]="matType">
      <button
        *ngSwitchDefault
        type="{{ type }}"
        mat-button
        color="{{ color }}"
        (click)="onClick($event)"
        [ngClass]="[classes]"
        [disabled]="disabled"
      >
        <fa-icon *ngIf="icon" [icon]="icon"></fa-icon>
        <span><ng-content></ng-content></span>
      </button>

      <button
        *ngSwitchCase="'icon'"
        mat-icon-button
        color="{{ color }}"
        [ngClass]="[classes]"
        (click)="onClick($event)"
        [disabled]="disabled"
      >
        <fa-icon *ngIf="icon" [icon]="icon"></fa-icon>
      </button>

      <button
        *ngSwitchCase="'fab'"
        mat-fab
        color="{{ color }}"
        [ngClass]="[classes]"
        (click)="onClick($event)"
        [disabled]="disabled"
      >
        <fa-icon class="fab-icon" *ngIf="icon" [icon]="icon"></fa-icon>
      </button>

      <button
        *ngSwitchCase="'mini-fab'"
        mat-mini-fab
        color="{{ color }}"
        [ngClass]="[classes]"
        (click)="onClick($event)"
        [disabled]="disabled"
      >
        <fa-icon class="fab-icon" *ngIf="icon" [icon]="icon"></fa-icon>
      </button>
    </ng-container>
  `,
  styleUrls: ['./atoms-icon-button.component.scss']
})
export class AtomsIconButtonComponent {
  @Input() color = 'primary';
  @Input() icon: string;
  @Input() type = 'button';
  @Input() matType = 'raised';
  @Input() disabled = false;
  @Input() showButtonTextOnSm = false;

  @HostBinding('class.d-inline-block') displayInline = true;

  @Output() onclick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    this.onclick.emit(event);
  }

  get classes(): string {
    let btnClass = 'crm-button';
    if (this.matType !== ('fab' || 'mini-fab')) {
      btnClass += ` mat-${this.matType}-button`;
    }
    if (this.showButtonTextOnSm) {
      btnClass += ` show-button-text-sm`;
    }
    return btnClass;
  }
}
