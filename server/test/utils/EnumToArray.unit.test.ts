import { expect } from 'chai';
import { IListView } from '../../src/constants';
import { enumToArray } from '../../src/utils/EnumToArray';

describe('EnumToArray', () => {
  it('checks enum to array convertion', () => {
    const testArray = enumToArray(IListView);
    expect(testArray).lengthOf(2);
    expect(testArray).to.deep.equal(['list', 'card']);
  });
});
