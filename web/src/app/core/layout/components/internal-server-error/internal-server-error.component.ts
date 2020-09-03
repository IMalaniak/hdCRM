import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-internal-server-error',
  templateUrl: './internal-server-error.component.html',
  styleUrls: ['./internal-server-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternalServerErrorComponent {}
