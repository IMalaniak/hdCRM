// tslint:disable: no-unused-expression

import { expect } from 'chai';
import Container from 'typedi';

import { FormController } from './formController';

describe('FormController', () => {
  let controllerInstance: FormController;

  beforeEach(() => {
    controllerInstance = Container.get(FormController);
  });

  it('should be defined', () => {
    expect(controllerInstance).to.not.be.undefined;
  });
});
