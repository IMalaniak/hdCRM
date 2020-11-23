import { Component, Input, HostBinding, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { THEME_PALETTE, BUTTON_TYPE, MAT_BUTTON } from '@/shared/constants';

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
        <mat-icon *ngIf="icon" [ngClass]="[iconClasses]" [svgIcon]="icon" aria-hidden="false"></mat-icon>
        <span><ng-content></ng-content></span>
      </button>

      <button
        *ngSwitchCase="matButtonTypes.ICON"
        mat-icon-button
        color="{{ color }}"
        [ngClass]="[classes]"
        (click)="onClick($event)"
        [disabled]="disabled"
      >
        <mat-icon *ngIf="icon" [ngClass]="[iconClasses]" [svgIcon]="icon"></mat-icon>
      </button>

      <button
        *ngSwitchCase="matButtonTypes.FAB"
        mat-fab
        color="{{ color }}"
        [ngClass]="[classes]"
        (click)="onClick($event)"
        [disabled]="disabled"
      >
        <mat-icon *ngIf="icon" [svgIcon]="icon"></mat-icon>
      </button>

      <button
        *ngSwitchCase="matButtonTypes.MINI_FAB"
        mat-mini-fab
        color="{{ color }}"
        [ngClass]="[classes]"
        (click)="onClick($event)"
        [disabled]="disabled"
      >
        <mat-icon *ngIf="icon" [svgIcon]="icon"></mat-icon>
      </button>
    </ng-container>
  `,
  styleUrls: ['./atoms-icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsIconButtonComponent {
  @Input() type: BUTTON_TYPE = BUTTON_TYPE.BUTTON;
  @Input() matType: MAT_BUTTON = MAT_BUTTON.RAISED;
  @Input() color: THEME_PALETTE = THEME_PALETTE.PRIMARY;
  @Input() icon: string;
  @Input() iconColor: string;
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() showButtonTextOnSm = false;

  @Output() onclick = new EventEmitter<MouseEvent>();

  @HostBinding('class.d-inline-block') displayInline = true;

  matButtonTypes = MAT_BUTTON;

  onClick(event: MouseEvent): void {
    this.onclick.emit(event);
  }

  get classes(): string {
    let btnClass = 'crm-button';
    if (this.matType !== (MAT_BUTTON.FAB || MAT_BUTTON.MINI_FAB)) {
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
