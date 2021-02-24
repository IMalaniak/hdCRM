// tslint:disable: no-unused-expression

import { expect } from 'chai';
import Container from 'typedi';

import { FormService } from './formService';

describe('FormService', () => {
  let serviceInstance: FormService;

  beforeEach(() => {
    serviceInstance = Container.get(FormService);
  });

  it('should be defined', () => {
    expect(serviceInstance).to.not.be.undefined;
  });

  it('should check primary key be defined', () => {
    expect(serviceInstance.primaryKey).to.equal('key');
  });
});
