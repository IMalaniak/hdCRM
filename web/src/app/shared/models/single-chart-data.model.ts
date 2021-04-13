export class SingleChartDataModel {
  data: any[]; // TODO: ArseniiIrod add type

  constructor(data: any[], paramX: string, paramY: string) {
    this.data = data?.map((item) => ({
        name: item[paramX],
        value: item[paramY].length
      }));
  }
}
