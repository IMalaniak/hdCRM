// tslint:disable: no-unused-expression

import { fail } from 'assert';
import { expect } from 'chai';
import { Result } from 'neverthrow';
import { CreateOptions } from 'sequelize';
import sinon from 'sinon';
import Container from 'typedi';

import { CONSTANTS } from '../constants';
import { BaseResponse, Department, DepartmentCreationAttributes, User } from '../models';
import { Logger } from '../utils/Logger';
import { DepartmentService } from './departmentService';

describe('DepartmentService', () => {
  let serviceInstance: DepartmentService;
  let loggerInstance: Logger;
  let spyLogger: sinon.SinonSpy;

  let findByPkStub: sinon.SinonStub;
  let createStub: sinon.SinonStub<
    [values: DepartmentCreationAttributes, options: CreateOptions<any>],
    Promise<Department>
  >;
  let updateStub: sinon.SinonStub;
  let findAndCountAllStub: sinon.SinonStub;
  let findAllDepsStub: sinon.SinonStub;
  let findAllUsersStub: sinon.SinonStub;

  // fakes
  const departmentFake = {
    id: 1,
    managerId: 1,
    OrganizationId: 1,
    title: 'Test',
    ParentDepartment: {
      id: 2
    },
    SubDepartments: [{ id: 3 }],
    Workers: [{ id: 3 }]
  } as Department;

  const departmentFakeResponse = {
    id: 1,
    managerId: 1,
    OrganizationId: 1,
    title: 'Test',
    ParentDepartment: {
      id: 2
    },
    SubDepartments: [{ id: 3 }],
    Workers: [{ id: 3 }],
    setParentDepartment: sinon.spy() as any,
    setSubDepartments: sinon.spy() as any,
    setWorkers: sinon.spy() as any
  } as Department;

  const departmentFake2 = {
    id: 2,
    managerId: 2,
    OrganizationId: 1,
    title: 'Test2'
  } as Department;

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
    findByPkStub = sinon.stub(Department, 'findByPk');
    createStub = sinon.stub(Department, 'create') as any;
    updateStub = sinon.stub(Department, 'update');
    findAndCountAllStub = sinon.stub(Department, 'findAndCountAll');
    findAllDepsStub = sinon.stub(Department, 'findAll');
    findAllUsersStub = sinon.stub(User, 'findAll');
  });

  after(() => {
    findByPkStub.restore();
    createStub.restore();
    updateStub.restore();
    findAndCountAllStub.restore();
    findAllDepsStub.restore();
    findAllUsersStub.restore();
  });

  beforeEach(() => {
    loggerInstance = Container.get(Logger);
    spyLogger = sinon.spy(loggerInstance, 'error');
    serviceInstance = Container.get(DepartmentService);
  });

  afterEach(() => {
    findByPkStub.reset();
    createStub.reset();
    updateStub.reset();
    findAndCountAllStub.reset();
    findAllDepsStub.reset();
    findAllUsersStub.reset();
    spyLogger.restore();
  });

  it('should be defined', () => {
    expect(serviceInstance).to.not.be.undefined;
  });

  it('should return an array of items when calling getDashboardData', async () => {
    findAndCountAllStub.resolves({ rows: [departmentFake, departmentFake2], count: 2 });
    const result = await serviceInstance.getDashboardData(1);
    expect(findAndCountAllStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.true;
      expect(result.value.resultsNum).to.equal(2);
      expect(result.value.data).to.deep.equal([departmentFake, departmentFake2]);
    }
  });

  it('should throw an error when calling getDashboardData', async () => {
    findAndCountAllStub.throws();
    const result = await serviceInstance.getDashboardData(1);
    expect(findAndCountAllStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should update an item', async () => {
    updateStub
      .withArgs(
        {
          ...departmentFake
        },
        {
          where: { id: departmentFake.id }
        }
      )
      .resolves([1, [departmentFake]]);
    findByPkStub.withArgs(1).resolves(departmentFakeResponse);
    findAllDepsStub.resolves([...departmentFake.SubDepartments]);
    findAllUsersStub.resolves([...departmentFake.Workers]);

    const result = await serviceInstance.update(departmentFake);
    expect(updateStub.calledOnce).to.be.true;

    expect(
      (departmentFakeResponse.setParentDepartment as sinon.SinonSpy).calledOnceWith(departmentFake.ParentDepartment.id)
    ).to.be.true;
    expect(
      (departmentFakeResponse.setSubDepartments as sinon.SinonSpy).calledOnceWithExactly(departmentFake.SubDepartments)
    ).to.be.true;
    expect((departmentFakeResponse.setWorkers as sinon.SinonSpy).calledOnceWithExactly(departmentFake.Workers)).to.be
      .true;

    expect(findAllDepsStub.calledOnce).to.be.true;
    expect(findAllUsersStub.calledOnce).to.be.true;
    expect(findByPkStub.calledTwice).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.true;
      expect(result.value.data).to.deep.equal(departmentFakeResponse);
    }
  });
});
