/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { ok } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';

import { CONSTANTS } from '../constants';
import { Task } from '../repositories';
import { TaskService } from '../services';

import { TaskController } from './task.controller';

describe('TaskController', () => {
  let controllerInstance: TaskController;
  let dataBaseServiceInstance: TaskService;

  const taskFake = {
    id: 1
  } as Task;

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
    controllerInstance = Container.get(TaskController);
    dataBaseServiceInstance = Container.get(TaskService);
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
    getAllStub.resolves(ok({ data: [taskFake] }));

    await controllerInstance.getAll(reqLogFake as any, resFake as any);

    expect(getAllStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Selecting all tasks...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWith({ data: [taskFake] })).to.be.true;
    getAllStub.restore();
  });

  it('should send success response when calling create', async () => {
    const createStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'create');
    createStub.resolves(ok({ data: taskFake }));
    const request = { ...reqLogFake, params: { id: 1 } };

    await controllerInstance.create(request as any, resFake as any);

    expect(createStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Creating new ${CONSTANTS.MODELS_NAME_TASK}...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ data: taskFake })).to.be.true;
    createStub.restore();
  });

  it('should send success response when calling delete', async () => {
    const deleteStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'delete');
    deleteStub.resolves(ok({ message: `Deleted 2` }));
    const request = { ...reqLogFake, body: { taskIds: [1, 2] } };

    await controllerInstance.deleteMultiple(request as any, resFake as any);

    expect(deleteStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Deleting multiple tasks...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ message: `Deleted 2` })).to.be.true;
    deleteStub.restore();
  });

  it('should send success response when calling getPriorities', async () => {
    const getAllStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'getPriorities');
    getAllStub.resolves(ok({ data: [taskFake] }));

    await controllerInstance.getPriorities(reqLogFake as any, resFake as any);

    expect(getAllStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Selecting all task priorities...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWith({ data: [taskFake] })).to.be.true;
    getAllStub.restore();
  });
});
