// tslint:disable: no-unused-expression

import { expect } from 'chai';
import Container from 'typedi';

import { AuthController } from './authController';

describe('AuthController', () => {
  let controllerInstance: AuthController;

  beforeEach(() => {
    controllerInstance = Container.get(AuthController);
  });

  it('should be defined', () => {
    expect(controllerInstance).to.not.be.undefined;
  });
});
