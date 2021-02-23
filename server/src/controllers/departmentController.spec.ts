// tslint:disable: no-unused-expression

import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { ok } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';
import { CONSTANTS } from '../constants';

import { Department } from '../models';
import { DepartmentService } from '../services';
import { DepartmentController } from './departmentController';

describe('DepartmentController', () => {
  let controllerInstance: DepartmentController;
  let dataBaseServiceInstance: DepartmentService;

  const departmentFake = {
    id: 1
  } as Department;

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
    controllerInstance = Container.get(DepartmentController);
    dataBaseServiceInstance = Container.get(DepartmentService);
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
    getDashboardDataStub.resolves(ok({ success: true, data: [departmentFake] }));

    await controllerInstance.getDashboardData(reqLogFake as any, resFake as any);

    expect(getDashboardDataStub.calledOnce).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWith({ success: true, data: [departmentFake] })).to.be.true;
    getDashboardDataStub.restore();
  });

  it('should send success response when calling create', async () => {
    const createStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'create');
    createStub.resolves(ok({ success: true, data: departmentFake }));
    const request = { ...reqLogFake, params: { id: 1 } };

    await controllerInstance.create(request as any, resFake as any);

    expect(createStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Creating new ${CONSTANTS.MODELS_NAME_DEPARTMENT}...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ success: true, data: departmentFake })).to.be.true;
    createStub.restore();
  });
});
