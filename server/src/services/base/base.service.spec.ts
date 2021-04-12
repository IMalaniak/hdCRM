/* eslint-disable @typescript-eslint/no-unused-expressions */

import { fail } from 'assert';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { Result } from 'neverthrow';
import { CreateOptions, IncludeOptions } from 'sequelize';
import sinon from 'sinon';
import Container, { Service } from 'typedi';

import { CONSTANTS } from '../../constants';
import { CustomError } from '../../errors';
import { BaseResponse, CollectionApiResponse, PageQuery } from '../../models';
import { DepartmentCreationAttributes, DepartmentAttributes, Department } from '../../repositories';
import { Logger } from '../../utils/Logger';
import { BaseService } from './base.service';

@Service()
export class TestBaseService extends BaseService<DepartmentCreationAttributes, DepartmentAttributes, Department> {
  public excludes: string[] = [];
  public readonly includes: IncludeOptions[] = [];

  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Department);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_DEPARTMENT);
  }
}

describe('BaseService', () => {
  let serviceInstance: TestBaseService;
  let loggerInstance: Logger;
  let spyLogger: sinon.SinonSpy;

  let findByPkStub: sinon.SinonStub;
  let createStub: sinon.SinonStub<[values: DepartmentCreationAttributes, options: CreateOptions], Promise<Department>>;
  let updateStub: sinon.SinonStub;
  let deleteStub: sinon.SinonStub;
  let findAndCountAllStub: sinon.SinonStub;

  const departmentFake = {
    id: 1,
    managerId: 1,
    OrganizationId: 1,
    title: 'Test'
  } as Department;

  const departmentFake2 = {
    id: 2,
    managerId: 2,
    OrganizationId: 1,
    title: 'Test2'
  } as Department;

  const pageQuery: PageQuery = {
    limit: 10,
    offset: 0,
    sortIndex: 'id',
    sortDirection: 'asc',
    parsedFilters: {}
  };

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

    findByPkStub = sinon.stub(Department, 'findByPk');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    createStub = sinon.stub(Department, 'create') as any;
    updateStub = sinon.stub(Department, 'update');
    deleteStub = sinon.stub(Department, 'destroy');
    findAndCountAllStub = sinon.stub(Department, 'findAndCountAll');
  });

  after(() => {
    findByPkStub.restore();
    createStub.restore();
    updateStub.restore();
    deleteStub.restore();
    findAndCountAllStub.restore();
    spyLogger.restore();
  });

  beforeEach(() => {
    serviceInstance = Container.get(TestBaseService);
  });

  afterEach(() => {
    findByPkStub.reset();
    createStub.reset();
    updateStub.reset();
    deleteStub.reset();
    findAndCountAllStub.reset();
    spyLogger.resetHistory();
  });

  it('should be defined', () => {
    expect(serviceInstance).to.not.be.undefined;
  });

  it('should return a departmentFake when calling getById', async () => {
    findByPkStub.withArgs(1).resolves(departmentFake);
    const result = await serviceInstance.getByPk(1);
    expect(findByPkStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().data.id).to.equal(1);
  });

  it('should return empty response when calling getById', async () => {
    findByPkStub.withArgs(3).resolves(null);
    const result = await serviceInstance.getByPk(3);
    expect(findByPkStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect(result._unsafeUnwrapErr().statusCode).to.equal(StatusCodes.NOT_FOUND);
    expect(result._unsafeUnwrapErr().message).to.equal(`No ${CONSTANTS.MODELS_NAME_DEPARTMENT} with such id`);
  });

  it('should throw an error when calling getById', async () => {
    findByPkStub.withArgs('wrong params').throws();
    const result = await serviceInstance.getByPk('wrong params');
    expect(findByPkStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should return an array of items when calling getPage', async () => {
    findAndCountAllStub.resolves({ rows: [departmentFake, departmentFake2], count: 2 });
    const result = await serviceInstance.getPage(pageQuery, 1);
    expect(findAndCountAllStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;

    const response = result._unsafeUnwrap() as CollectionApiResponse<Department>;
    expect(response.ids).to.deep.equal([1, 2]);
    expect(response.resultsNum).to.equal(2);
    expect(response.pages).to.equal(1);
    expect(response.data).to.deep.equal([departmentFake, departmentFake2]);
  });

  it('should return an empty array of items when calling getPage', async () => {
    findAndCountAllStub.resolves({ rows: [], count: 0 });
    const result = await serviceInstance.getPage(pageQuery, 1);
    expect(findAndCountAllStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap()).to.deep.equal({});
  });

  it('should throw an error when calling getPage', async () => {
    findAndCountAllStub.throws();
    const result = await serviceInstance.getPage(pageQuery, 1);
    expect(findAndCountAllStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should create a new item', async () => {
    createStub.resolves(departmentFake);
    findByPkStub.withArgs(1).resolves(departmentFake);
    const result = await serviceInstance.create(departmentFake);
    expect(createStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().data).to.deep.equal(departmentFake);
  });

  it('should throw an error when creating a new item', async () => {
    createStub.throws();
    const result = await serviceInstance.create(departmentFake);
    expect(createStub.calledOnce).to.be.true;
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
    findByPkStub.withArgs(1).resolves(departmentFake);
    const result = await serviceInstance.update(departmentFake);
    expect(updateStub.calledOnce).to.be.true;
    expect(findByPkStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().data).to.deep.equal(departmentFake);
  });

  it('should inform that there is no item to update an item', async () => {
    updateStub
      .withArgs(
        {
          ...departmentFake
        },
        {
          where: { id: departmentFake.id }
        }
      )
      .resolves([0, []]);
    const result = await serviceInstance.update(departmentFake);
    expect(updateStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect(result._unsafeUnwrapErr().statusCode).to.equal(StatusCodes.NOT_FOUND);
    expect(result._unsafeUnwrapErr().message).to.equal(`No ${CONSTANTS.MODELS_NAME_DEPARTMENT}s by this query`);
  });

  it('should throw an error trying to update an item', async () => {
    findByPkStub.throws();
    const result = await serviceInstance.update({
      ...departmentFake
    });
    expect(updateStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should remove item from db', async () => {
    deleteStub
      .withArgs({
        where: { id: 1 }
      })
      .resolves(1);
    const result = await serviceInstance.delete(1);
    expect(deleteStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().message).to.equal(`Deleted 1 ${CONSTANTS.MODELS_NAME_DEPARTMENT}(s)`);
  });

  it('should inform that there is no item to delete', async () => {
    deleteStub
      .withArgs({
        where: { id: 2 }
      })
      .resolves(0);
    const result = await serviceInstance.delete(2);
    expect(deleteStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect(result._unsafeUnwrapErr().statusCode).to.equal(StatusCodes.NOT_FOUND);
    expect(result._unsafeUnwrapErr().message).to.equal(`No ${CONSTANTS.MODELS_NAME_DEPARTMENT}s by this query`);
  });

  it('should throw en error trying to delete an item', async () => {
    deleteStub.throws();
    const result = await serviceInstance.delete('wrong param');
    expect(deleteStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });
});
