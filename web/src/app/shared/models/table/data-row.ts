import { CellValue } from './cell-value.model';

export interface DataRow {
  [key: string]: CellValue;
}
