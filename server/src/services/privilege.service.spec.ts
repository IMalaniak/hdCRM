// tslint:disable: no-unused-expression

import { fail } from 'assert';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { Result } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';

import { CONSTANTS } from '../constants';
import { CustomError } from '../errors';
import { BaseResponse, CollectionApiResponse, Privilege, PrivilegeCreationAttributes } from '../models';
import { Logger } from '../utils/Logger';
import { PrivilegeService } from './privilege.service';

describe('PrivilegeService', () => {
  let serviceInstance: PrivilegeService;
  let loggerInstance: Logger;
  let spyLogger: sinon.SinonSpy;

  let findAndCountAllStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;

  const expect500 = (result: Result<BaseResponse, CustomError>) => {
    if (result.isErr()) {
      expect(result.error.statusCode).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.error.message).to.equal(CONSTANTS.TEXTS_API_GENERIC_ERROR);
      expect(spyLogger.calledOnce).to.be.true;
    } else {
      fail('The "result" expected to be an error');
    }
  };

  before(() => {
    loggerInstance = Container.get(Logger);
    spyLogger = sinon.spy(loggerInstance, 'error');

    findAndCountAllStub = sinon.stub(Privilege, 'findAndCountAll');
    createStub = sinon.stub(Privilege, 'create');
  });

  after(() => {
    findAndCountAllStub.restore();
    createStub.restore();
    spyLogger.restore();
  });

  beforeEach(() => {
    serviceInstance = Container.get(PrivilegeService);
  });

  afterEach(() => {
    findAndCountAllStub.reset();
    createStub.reset();
    spyLogger.resetHistory();
  });

  it('should be defined', () => {
    expect(serviceInstance).to.not.be.undefined;
  });

  it('should return an array of items when calling getAll', async () => {
    findAndCountAllStub.resolves({ rows: [{ id: 1 }, { id: 2 }], count: 2 });
    const result = await serviceInstance.getAll();
    expect(findAndCountAllStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    const response = result._unsafeUnwrap() as CollectionApiResponse<any>;
    expect(response.resultsNum).to.equal(2);
    expect(response.data).to.deep.equal([{ id: 1 }, { id: 2 }]);
  });

  it('should return an empty array of items when calling getAll', async () => {
    findAndCountAllStub.resolves({ rows: [], count: 0 });
    const result = await serviceInstance.getAll();
    expect(findAndCountAllStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap()).to.deep.equal({});
  });

  it('should throw an error when calling getAll', async () => {
    findAndCountAllStub.throws();
    const result = await serviceInstance.getAll();
    expect(findAndCountAllStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should create a new item', async () => {
    createStub.resolves({ id: 1 });
    const result = await serviceInstance.create({ id: 1 } as PrivilegeCreationAttributes);
    expect(createStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().data).to.deep.equal({ id: 1 });
  });

  it('should throw an error when creating a new item', async () => {
    createStub.throws();
    const result = await serviceInstance.create({ id: 1 } as PrivilegeCreationAttributes);
    expect(createStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });
});
