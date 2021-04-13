/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import Container from 'typedi';

import { FormService } from './form.service';

describe('FormService', () => {
  let serviceInstance: FormService;

  beforeEach(() => {
    serviceInstance = Container.get(FormService);
  });

  it('should be defined', () => {
    expect(serviceInstance).to.not.be.undefined;
  });
});
