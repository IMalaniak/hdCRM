export enum IItemsPerPage {
  FIVE = '5',
  TEN = '10',
  FIFTEEN = '15'
}

export const pageSizeOptions = Object.values(IItemsPerPage).map(val => parseInt(val, 0));
