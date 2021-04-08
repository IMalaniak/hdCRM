import { SingleChartDataModel } from './single-chart-data.model';

export class MultiChartDataModel {
  name: string;
  series: SingleChartDataModel[];
  constructor(name: string, series: SingleChartDataModel[]) {
    this.name = name;
    this.series = series;
  }
}
