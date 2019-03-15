export class SingleChartData {
  name: string;
  value: string | number;

  constructor(name: string, value: string | number) {
    this.name = name;
    this.value = value;
  }
}