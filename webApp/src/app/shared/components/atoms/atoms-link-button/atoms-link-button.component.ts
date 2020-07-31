import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

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

      .mat-button.mat-primary .mat-button-focus-overlay,
      .mat-button.mat-accent .mat-button-focus-overlay,
      .mat-button.mat-warn .mat-button-focus-overlay {
        background-color: unset !important;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class AtomsLinkButtonComponent {
  @Input() linkLabel: string;
  @Input() linkColor = 'primary';
  @Input() target = '_self';
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
