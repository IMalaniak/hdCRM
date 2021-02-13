import { expect } from 'chai';
import { IListView } from '../constants';
import { enumToArray } from './EnumToArray';

describe('EnumToArray', () => {
  it('checks enum to array convertion', () => {
    const testArray = enumToArray(IListView);
    expect(testArray).lengthOf(2);
    expect(testArray).to.deep.equal(['list', 'card']);
  });
});
