import { SingleChartData } from './singleChartData'

export class MultiChartData {
  name: string;
  series: SingleChartData[];
  constructor(name: string, series: SingleChartData[]) {
    this.name = name;
    this.series = series;
  }
}