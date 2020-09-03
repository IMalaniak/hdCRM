import { Component, Input, HostBinding, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

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
        <fa-icon *ngIf="icon" [ngClass]="[iconClasses]" [icon]="icon"></fa-icon>
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
        <fa-icon *ngIf="icon" [ngClass]="[iconClasses]" [icon]="icon"></fa-icon>
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
  styleUrls: ['./atoms-icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsIconButtonComponent {
  @Input() type = 'button';
  @Input() matType = 'raised';
  @Input() color = 'primary';
  @Input() icon: string;
  @Input() iconColor: string;
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() showButtonTextOnSm = false;

  @Output() onclick = new EventEmitter<MouseEvent>();

  @HostBinding('class.d-inline-block') displayInline = true;

  onClick(event: MouseEvent): void {
    this.onclick.emit(event);
  }

  get classes(): string {
    let btnClass = 'crm-button';
    if (this.matType !== ('fab' || 'mini-fab')) {
      btnClass += ` mat-${this.matType}-button`;
    }
    if (this.fullWidth) {
      btnClass += ` w-100`;
    }
    if (this.showButtonTextOnSm) {
      btnClass += ` show-button-text-sm`;
    }
    return btnClass;
  }

  get iconClasses(): string {
    let iClass = ' ';
    if (this.iconColor) {
      iClass += this.iconColor;
    }
    return iClass;
  }
}
