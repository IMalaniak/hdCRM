/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import Container from 'typedi';

import { FileController } from './file.controller';

describe('FileController', () => {
  let controllerInstance: FileController;

  beforeEach(() => {
    controllerInstance = Container.get(FileController);
  });

  it('should be defined', () => {
    expect(controllerInstance).to.not.be.undefined;
  });
});
