// tslint:disable: no-unused-expression

import { fail } from 'assert';
import { expect } from 'chai';
import { Result } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';

import { CONSTANTS } from '../constants';
import { BaseResponse, Task, TaskPriority } from '../models';
import { Logger } from '../utils/Logger';
import { TaskService } from './taskService';

describe('TaskService', () => {
  let serviceInstance: TaskService;
  let loggerInstance: Logger;
  let spyLogger: sinon.SinonSpy;

  let findAllTasksStub: sinon.SinonStub;
  let findAllTaskPrioritiesStub: sinon.SinonStub;

  const expect500 = (result: Result<BaseResponse, BaseResponse>) => {
    if (result.isErr()) {
      expect(result.error.success).to.be.false;
      expect(result.error.message).to.equal(CONSTANTS.TEXTS_API_GENERIC_ERROR);
      expect(spyLogger.calledOnce).to.be.true;
    } else {
      fail('The "result" expected to be an error');
    }
  };

  before(() => {
    loggerInstance = Container.get(Logger);
    spyLogger = sinon.spy(loggerInstance, 'error');

    findAllTasksStub = sinon.stub(Task, 'findAll');
    findAllTaskPrioritiesStub = sinon.stub(TaskPriority, 'findAll');
  });

  after(() => {
    findAllTasksStub.restore();
    findAllTaskPrioritiesStub.restore();
    spyLogger.restore();
  });

  beforeEach(() => {
    serviceInstance = Container.get(TaskService);
  });

  afterEach(() => {
    findAllTasksStub.reset();
    findAllTaskPrioritiesStub.reset();
    spyLogger.resetHistory();
  });

  it('should be defined', () => {
    expect(serviceInstance).to.not.be.undefined;
  });

  it('should return an array of items when calling getAll', async () => {
    findAllTasksStub.resolves([{ id: 1 }, { id: 2 }]);
    const result = await serviceInstance.getAll(1);
    expect(findAllTasksStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.true;
      expect(result.value.data).to.deep.equal([{ id: 1 }, { id: 2 }]);
    }
  });

  it('should return an empty array of items when calling getAll', async () => {
    findAllTasksStub.resolves([]);
    const result = await serviceInstance.getAll(1);
    expect(findAllTasksStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.false;
      expect(result.value.data).to.deep.equal([]);
      expect(result.value.message).to.equal(`No ${CONSTANTS.MODELS_NAME_TASK}s by this query`);
    }
  });

  it('should throw an error when calling getAll', async () => {
    findAllTasksStub.throws();
    const result = await serviceInstance.getAll(1);
    expect(findAllTasksStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should return an array of items when calling getPriorities', async () => {
    findAllTaskPrioritiesStub.resolves([{ id: 1 }, { id: 2 }]);
    const result = await serviceInstance.getPriorities();
    expect(findAllTaskPrioritiesStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.true;
      expect(result.value.data).to.deep.equal([{ id: 1 }, { id: 2 }]);
    }
  });

  it('should return an empty array of items when calling getPriorities', async () => {
    findAllTaskPrioritiesStub.resolves([]);
    const result = await serviceInstance.getPriorities();
    expect(findAllTaskPrioritiesStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.false;
      expect(result.value.data).to.deep.equal([]);
      expect(result.value.message).to.equal('No tasks priorities by this query');
    }
  });

  it('should throw an error when calling getPriorities', async () => {
    findAllTaskPrioritiesStub.throws();
    const result = await serviceInstance.getPriorities();
    expect(findAllTaskPrioritiesStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });
});
