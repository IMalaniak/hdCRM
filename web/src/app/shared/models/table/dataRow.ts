import { ICell } from './cell.model';

export interface DataRow {
  [key: string]: ICell | number;
  id: number;
}
