// tslint:disable: no-unused-expression

import { expect } from 'chai';
import Container from 'typedi';

import { FileController } from './fileController';

describe('FileController', () => {
  let controllerInstance: FileController;

  beforeEach(() => {
    controllerInstance = Container.get(FileController);
  });

  it('should be defined', () => {
    expect(controllerInstance).to.not.be.undefined;
  });
});
