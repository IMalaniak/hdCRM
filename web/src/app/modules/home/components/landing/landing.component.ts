import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouteConstants, ACTION_LABELS } from '@/shared/constants';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {
  authRoute = RouteConstants.ROUTE_AUTH;
  actionLabels = ACTION_LABELS;
}
