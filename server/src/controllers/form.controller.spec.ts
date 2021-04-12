/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import Container from 'typedi';

import { FormController } from './form.controller';

describe('FormController', () => {
  let controllerInstance: FormController;

  beforeEach(() => {
    controllerInstance = Container.get(FormController);
  });

  it('should be defined', () => {
    expect(controllerInstance).to.not.be.undefined;
  });
});
