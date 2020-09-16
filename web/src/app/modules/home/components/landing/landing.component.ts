import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RoutingConstants, ACTION_LABELS } from '@/shared/constants';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {
  authRoute = RoutingConstants.ROUTE_AUTH;
  logInActionLabel = ACTION_LABELS.LOG_IN;
}
