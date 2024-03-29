/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import Container from 'typedi';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controllerInstance: AuthController;

  beforeEach(() => {
    controllerInstance = Container.get(AuthController);
  });

  it('should be defined', () => {
    expect(controllerInstance).to.not.be.undefined;
  });
});
