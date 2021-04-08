export enum ITEMS_PER_PAGE {
  FIVE = '5',
  TEN = '10',
  FIFTEEN = '15'
}

export const pageSizeOptions = Object.values(ITEMS_PER_PAGE).map((val) => parseInt(val, 0));
