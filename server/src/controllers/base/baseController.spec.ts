// tslint:disable: no-unused-expression

import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { ok } from 'neverthrow';
import sinon from 'sinon';
import Container, { Service } from 'typedi';
import { CONSTANTS } from '../../constants';

import { Department, DepartmentAttributes, DepartmentCreationAttributes } from '../../models';
import { DepartmentService } from '../../services/departmentService';
import { BaseController } from './baseController';

@Service()
export class TestBaseController extends BaseController<DepartmentCreationAttributes, DepartmentAttributes, Department> {
  constructor(readonly dataBaseService: DepartmentService) {
    super();
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_DEPARTMENT);
  }
}

describe('BaseController', () => {
  let controllerInstance: TestBaseController;
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
    controllerInstance = Container.get(TestBaseController);
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

  it('should send success response when calling getByPk', async () => {
    const getByPkStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'getByPk');
    getByPkStub.resolves(ok({ success: true, data: departmentFake }));
    const request = { ...reqLogFake, params: { id: 1 } };

    await controllerInstance.getByPk(request as any, resFake as any);

    expect(getByPkStub.calledOnce).to.be.true;
    expect(
      reqLogFake.log.info.calledOnceWith(`Selecting ${CONSTANTS.MODELS_NAME_DEPARTMENT} by id: ${departmentFake.id}...`)
    ).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ success: true, data: departmentFake })).to.be.true;
    getByPkStub.restore();
  });

  it('should send success response when calling getPage', async () => {
    const getPageStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'getPage');
    getPageStub.resolves(ok({ success: true, data: [departmentFake] }));
    const request = {
      ...reqLogFake,
      query: {
        pageSize: '10',
        pageIndex: '0',
        sortIndex: 'id',
        sortDirection: 'asc'
      }
    };

    await controllerInstance.getPage(request as any, resFake as any);

    expect(getPageStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Getting ${CONSTANTS.MODELS_NAME_DEPARTMENT} by page query...`)).to.be
      .true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWith({ success: true, data: [departmentFake] })).to.be.true;
    getPageStub.restore();
  });

  it('should send success response with filtered data when calling getPage', async () => {
    const getPageStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'getPage');
    getPageStub.resolves(ok({ success: true, data: [departmentFake] }));
    const request = {
      ...reqLogFake,
      query: {
        pageSize: '10',
        pageIndex: '0',
        sortIndex: 'id',
        sortDirection: 'asc',
        filters: '[title][like]=Make%'
      }
    };

    await controllerInstance.getPage(request as any, resFake as any);

    expect(getPageStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Getting ${CONSTANTS.MODELS_NAME_DEPARTMENT} by page query...`)).to.be
      .true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWith({ success: true, data: [departmentFake] })).to.be.true;
    getPageStub.restore();
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

  it('should send success response when calling update', async () => {
    const updateStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'update');
    updateStub.resolves(ok({ success: true, data: departmentFake }));
    const request = { ...reqLogFake, params: { id: 1 } };

    await controllerInstance.update(request as any, resFake as any);

    expect(updateStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Updating ${CONSTANTS.MODELS_NAME_DEPARTMENT} by id...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ success: true, data: departmentFake })).to.be.true;
    updateStub.restore();
  });

  it('should send success response when calling delete', async () => {
    const deleteStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'delete');
    deleteStub.resolves(ok({ success: true, message: `Deleted 1` }));
    const request = { ...reqLogFake, params: { id: 1 } };

    await controllerInstance.delete(request as any, resFake as any);

    expect(deleteStub.calledOnce).to.be.true;
    expect(
      reqLogFake.log.info.calledOnceWith(`Deleting ${CONSTANTS.MODELS_NAME_DEPARTMENT} by id: ${departmentFake.id}...`)
    ).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ success: true, message: `Deleted 1` })).to.be.true;
    deleteStub.restore();
  });
});
