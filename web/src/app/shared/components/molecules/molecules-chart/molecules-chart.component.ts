import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SingleChartData } from '@/shared/models';
import { Observable } from 'rxjs/internal/Observable';
import { AppState } from '@/core/reducers';
import { select, Store } from '@ngrx/store';
import * as fromLayout from '@/core/layout/store';

@Component({
  selector: 'molecules-chart',
  template: `
    <ng-container [ngSwitch]="chartType">
      <div class="chart-wrapper" [class.text-white]="enableDarkTheme$ | async">
        <ngx-charts-bar-vertical
          *ngSwitchCase="'bar-vertical'"
          [results]="chart?.data"
          [scheme]="scheme"
          [gradient]="gradient"
          [xAxis]="xAxis"
          [yAxis]="yAxis"
          [legend]="legend"
          [showXAxisLabel]="showXAxisLabel"
          [showYAxisLabel]="showYAxisLabel"
          [xAxisLabel]="xAxisLabel"
          [yAxisLabel]="yAxisLabel"
        >
        </ngx-charts-bar-vertical>

        <ngx-charts-advanced-pie-chart
          *ngSwitchCase="'advanced-pie-chart'"
          [results]="chart?.data"
          [scheme]="scheme"
          [gradient]="gradient"
        >
        </ngx-charts-advanced-pie-chart>
      </div>
    </ng-container>
  `,
  styleUrls: ['./molecules-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoleculesChartComponent implements OnInit {
  enableDarkTheme$: Observable<boolean> = this.store$.pipe(select(fromLayout.getDarkThemeState));

  @Input() chartType: string;
  @Input() paramX: string;
  @Input() paramY: string;
  @Input() results: any; // TODO: ArseniiIrod add type
  @Input() scheme: string;
  @Input() gradient: string;
  @Input() xAxis: boolean;
  @Input() yAxis: boolean;
  @Input() legend: boolean;
  @Input() showXAxisLabel: boolean;
  @Input() showYAxisLabel: boolean;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;

  chart: SingleChartData;

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {
    this.chart = new SingleChartData(this.results, this.paramX, this.paramY);
  }
}
