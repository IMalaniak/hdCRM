// tslint:disable: no-unused-expression

import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { ok } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';

import { CONSTANTS } from '../constants';
import { Role } from '../models';
import { RoleService } from '../services';
import { RoleController } from './roleController';

describe('RoleController', () => {
  let controllerInstance: RoleController;
  let dataBaseServiceInstance: RoleService;

  const roleFake = {
    id: 1
  } as Role;

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
    controllerInstance = Container.get(RoleController);
    dataBaseServiceInstance = Container.get(RoleService);
  });

  afterEach(() => {
    reqLogFake.log.info.resetHistory();
    resFake.status.resetHistory();
    resFake.send.resetHistory();
  });

  it('should be defined', () => {
    expect(controllerInstance).to.not.be.undefined;
  });

  it('should send success response when calling getDashboardData', async () => {
    const getDashboardDataStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'getDashboardData');
    getDashboardDataStub.resolves(ok({ success: true, data: [roleFake] }));

    await controllerInstance.getDashboardData(reqLogFake as any, resFake as any);

    expect(getDashboardDataStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Geting roles dashboard data...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWith({ success: true, data: [roleFake] })).to.be.true;
    getDashboardDataStub.restore();
  });

  it('should send success response when calling create', async () => {
    const createStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'create');
    createStub.resolves(ok({ success: true, data: roleFake }));
    const request = { ...reqLogFake, params: { id: 1 } };

    await controllerInstance.create(request as any, resFake as any);

    expect(createStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Creating new ${CONSTANTS.MODELS_NAME_ROLE}...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ success: true, data: roleFake })).to.be.true;
    createStub.restore();
  });
});
