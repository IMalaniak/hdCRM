// tslint:disable: no-unused-expression

import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { ok } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';

import { Privilege } from '../repositories';
import { PrivilegeService } from '../services';
import { PrivilegeController } from './privilege.controller';

describe('PrivilegeController', () => {
  let controllerInstance: PrivilegeController;
  let dataBaseServiceInstance: PrivilegeService;

  const privilegeFake = {
    id: 1
  } as Privilege;

  const reqLogFake = {
    log: {
      info: sinon.spy()
    },
    user: {
      OrganizationId: 1
    }
  };

  const resFake = {
    status: sinon.spy(),
    send: sinon.spy()
  };

  beforeEach(() => {
    controllerInstance = Container.get(PrivilegeController);
    dataBaseServiceInstance = Container.get(PrivilegeService);
  });

  afterEach(() => {
    reqLogFake.log.info.resetHistory();
    resFake.status.resetHistory();
    resFake.send.resetHistory();
  });

  it('should be defined', () => {
    expect(controllerInstance).to.not.be.undefined;
  });

  it('should send success response when calling getAll', async () => {
    const getAllStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'getAll');
    getAllStub.resolves(ok({ data: [privilegeFake] }));

    await controllerInstance.getAll(reqLogFake as any, resFake as any);

    expect(getAllStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Selecting privileges list...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWith({ data: [privilegeFake] })).to.be.true;
    getAllStub.restore();
  });

  it('should send success response when calling create', async () => {
    const createStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'create');
    createStub.resolves(ok({ data: privilegeFake }));
    const request = { ...reqLogFake, params: { id: 1 } };

    await controllerInstance.create(request as any, resFake as any);

    expect(createStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Creating new privilege...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ data: privilegeFake })).to.be.true;
    createStub.restore();
  });
});
