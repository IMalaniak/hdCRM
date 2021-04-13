import { expect } from 'chai';

import { LIST_VIEW } from '../constants';

import { enumToArray } from './enumToArray';

describe('enumToArray', () => {
  it('checks enum to array convertion', () => {
    const testArray = enumToArray(LIST_VIEW);
    expect(testArray).lengthOf(2);
    expect(testArray).to.deep.equal(['list', 'card']);
  });
});
