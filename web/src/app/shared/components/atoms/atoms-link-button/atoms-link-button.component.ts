import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { LINK_TARGET, THEME_PALETTE } from '@/shared/constants';

@Component({
  selector: 'atoms-link-button',
  template: `
    <a
      [href]="linkHref || 'javascript:void(0)'"
      mat-button
      class="button-link"
      color="{{ linkColor }}"
      target="{{ target }}"
      [disableRipple]="true"
      [ngClass]="[classes]"
      [disabled]="disabled"
      (click)="onClick($event)"
      *ngIf="linkType === 'link'; else router"
    >
      <span>{{ linkLabel }}</span>
    </a>

    <ng-template #router>
      <a
        [routerLink]="linkHref"
        mat-button
        class="button-link"
        color="{{ linkColor }}"
        target="{{ target }}"
        [disableRipple]="true"
        [ngClass]="[classes]"
        [disabled]="disabled"
        (click)="onClick($event)"
      >
        <span>{{ linkLabel }}</span>
      </a>
    </ng-template>
  `,
  styles: [
    `
      .button-link {
        min-width: unset;
        line-height: normal;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomsLinkButtonComponent {
  @Input() linkLabel: string;
  @Input() linkColor: ThemePalette = THEME_PALETTE.PRIMARY;
  @Input() target: LINK_TARGET = LINK_TARGET.SELF;
  @Input() linkClass: string;
  @Input() linkHref: any[] | string;
  @Input() linkType: 'link' | 'router' = 'link';
  @Input() disabled = false;

  @Output() onclick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.linkHref) {
      event.preventDefault();
    }

    this.onclick.emit(event);
  }

  get classes(): string {
    return `hover-bg-none ${this.linkClass}`;
  }
}
